import {
  PREMIUM_ENTITLEMENT,
  PREMIUM_PRODUCTS,
} from "@ai-navigator/shared";
import { Platform } from "react-native";
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesError,
  type PurchasesStoreProduct,
} from "react-native-purchases";

import { usePremiumStore } from "@/store/usePremiumStore";

// Покупки через RevenueCat (подписка AI Navigator Premium, только iOS).
//
// Кто покупатель: appUserID в RevenueCat = id пользователя Supabase. До входа RevenueCat
// считает человека анонимным. Покупать и восстанавливать можно только после входа —
// иначе подписка привяжется к анониму, а лимит ИИ считается по аккаунту.
//
// Публичный ключ RevenueCat (appl_…) можно класть в приложение — им нельзя ничего изменить,
// только покупать от имени этого телефона. Секреты RevenueCat в приложении не бывают.

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY?.trim() ?? "";

// Нет ключа или не iPhone — покупок нет, приложение работает как без подписки.
export const purchasesAvailable = Platform.OS === "ios" && IOS_KEY !== "";

let configured = false;
// Кому принадлежит последний ответ RevenueCat (id Supabase или null).
let currentUserId: string | null = null;

function applyCustomerInfo(info: CustomerInfo) {
  const entitlement = info.entitlements.active[PREMIUM_ENTITLEMENT];
  usePremiumStore
    .getState()
    .setPremium(
      currentUserId,
      entitlement?.isActive === true,
      entitlement?.expirationDate ?? null,
    );
}

// Включить RevenueCat. Один раз при запуске, когда уже известно, вошёл ли человек:
// так не создаём лишнего анонимного покупателя.
export function configurePurchases(userId: string | null): void {
  if (!purchasesAvailable || configured) return;
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.WARN).catch(() => {});
  Purchases.configure({ apiKey: IOS_KEY, appUserID: userId });
  configured = true;
  currentUserId = userId;
  // RevenueCat сам сообщает об изменениях: покупка, продление, конец подписки.
  Purchases.addCustomerInfoUpdateListener(applyCustomerInfo);
  refreshPremium();
}

// Вход и выход: подписка привязывается к аккаунту Supabase.
// logIn — тот же покупатель в RevenueCat, что и на других телефонах этого аккаунта.
// logOut — снова анонимный (подписка остаётся у аккаунта, на телефоне её больше не видно).
export async function setPurchasesUser(userId: string | null): Promise<void> {
  if (!configured || userId === currentUserId) return;
  currentUserId = userId;
  try {
    if (userId) {
      const { customerInfo } = await Purchases.logIn(userId);
      applyCustomerInfo(customerInfo);
    } else if (!(await Purchases.isAnonymous())) {
      applyCustomerInfo(await Purchases.logOut());
    }
  } catch (error) {
    if (__DEV__) console.log("RevenueCat: не получилось сменить пользователя", error);
  }
}

// Спросить RevenueCat заново. Он отвечает из кэша, если ответ свежий (до 5 минут),
// иначе — из сети. Нет сети — оставляем то, что было.
export async function refreshPremium(): Promise<void> {
  if (!configured) return;
  try {
    applyCustomerInfo(await Purchases.getCustomerInfo());
  } catch (error) {
    if (__DEV__) console.log("RevenueCat: не получилось узнать подписку", error);
  }
}

export type PurchaseResult =
  | { status: "purchased"; premium: boolean }
  | { status: "restored"; premium: boolean }
  | { status: "cancelled" }
  // Не вошёл в аккаунт — сначала вход.
  | { status: "signInRequired" }
  // Покупки недоступны: нет ключа, не iPhone или товар не найден в App Store.
  | { status: "unavailable" }
  | { status: "error"; error: unknown };

function isPurchasesError(error: unknown): error is PurchasesError {
  return typeof error === "object" && error !== null && "userCancelled" in error;
}

async function canBuy(): Promise<PurchaseResult | null> {
  if (!configured) return { status: "unavailable" };
  if (!currentUserId || (await Purchases.isAnonymous())) {
    return { status: "signInRequired" };
  }
  return null;
}

function hasPremium(info: CustomerInfo): boolean {
  return info.entitlements.active[PREMIUM_ENTITLEMENT]?.isActive === true;
}

// Товар из текущего «предложения» (offering default в RevenueCat). Нет — ищем по id в App Store.
async function findProduct(
  productId: string,
): Promise<PurchasesStoreProduct | null> {
  const offerings = await Purchases.getOfferings();
  const fromOffering = offerings.current?.availablePackages.find(
    (item) => item.product.identifier === productId,
  )?.product;
  if (fromOffering) return fromOffering;
  const [product] = await Purchases.getProducts([productId]);
  return product ?? null;
}

// Купить подписку: месяц или год. Окно оплаты показывает Apple.
export async function purchasePremium(
  plan: keyof typeof PREMIUM_PRODUCTS,
): Promise<PurchaseResult> {
  const blocked = await canBuy();
  if (blocked) return blocked;
  try {
    const product = await findProduct(PREMIUM_PRODUCTS[plan]);
    if (!product) return { status: "unavailable" };
    const { customerInfo } = await Purchases.purchaseStoreProduct(product);
    applyCustomerInfo(customerInfo);
    return { status: "purchased", premium: hasPremium(customerInfo) };
  } catch (error) {
    if (isPurchasesError(error) && error.userCancelled) {
      return { status: "cancelled" };
    }
    return { status: "error", error };
  }
}

// «Восстановить покупки»: подписка с этого Apple ID переходит к вошедшему аккаунту.
// Если раньше она была у другого аккаунта, у того доступ закончится (настройка
// Transfer behavior в RevenueCat) — одна подписка = один аккаунт.
export async function restorePurchases(): Promise<PurchaseResult> {
  const blocked = await canBuy();
  if (blocked) return blocked;
  try {
    const info = await Purchases.restorePurchases();
    applyCustomerInfo(info);
    return { status: "restored", premium: hasPremium(info) };
  } catch (error) {
    return { status: "error", error };
  }
}
