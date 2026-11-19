import { PREMIUM_ENTITLEMENT } from "@ai-navigator/shared";
import { Linking, Platform } from "react-native";
import Purchases, {
  INTRO_ELIGIBILITY_STATUS,
  LOG_LEVEL,
  PACKAGE_TYPE,
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type PurchasesError,
  type PurchasesPackage,
} from "react-native-purchases";

import { NO_PREMIUM, usePremiumStore, type PremiumInfo } from "@/store/usePremiumStore";

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

// Системная страница подписок Apple — если окно управления подписками не открылось.
const APPLE_SUBSCRIPTIONS_URL = "https://apps.apple.com/account/subscriptions";

let configured = false;
// Кому принадлежит последний ответ RevenueCat (id Supabase или null).
let currentUserId: string | null = null;
// Идущая смена пользователя (logIn / logOut). Покупка ждёт её, чтобы не купить «анониму».
let identifying: Promise<void> = Promise.resolve();

function toPremiumInfo(info: CustomerInfo): PremiumInfo {
  const entitlement = info.entitlements.active[PREMIUM_ENTITLEMENT];
  if (!entitlement?.isActive) return NO_PREMIUM;
  return {
    premium: true,
    expiresAt: entitlement.expirationDate,
    willRenew: entitlement.willRenew,
    trial: entitlement.periodType === "TRIAL",
  };
}

function applyCustomerInfo(info: CustomerInfo) {
  usePremiumStore.getState().setPremium(currentUserId, toPremiumInfo(info));
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
export function setPurchasesUser(userId: string | null): Promise<void> {
  if (!configured || userId === currentUserId) return identifying;
  currentUserId = userId;
  identifying = (async () => {
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
  })();
  return identifying;
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

// ---------- Что показать на экране подписки ----------

export type PaywallPlan = {
  pkg: PurchasesPackage;
  period: "monthly" | "annual";
  // Цена за весь период из App Store, в валюте человека: «$19.99», «1 990,00 ₽».
  priceString: string;
  // Для годового: сколько выходит в месяц (считает RevenueCat в той же валюте).
  pricePerMonthString: string | null;
  // Пробный период, если он доступен этому Apple ID: число дней/недель/месяцев.
  trial: { count: number; unit: "DAY" | "WEEK" | "MONTH" | "YEAR" } | null;
};

export type PaywallOffer = {
  plans: PaywallPlan[];
  // На сколько процентов год выгоднее, чем 12 месяцев помесячно. null — не посчитать.
  annualSavingsPercent: number | null;
};

const TRIAL_UNITS = ["DAY", "WEEK", "MONTH", "YEAR"] as const;

function trialOf(
  pkg: PurchasesPackage,
  eligible: boolean,
): PaywallPlan["trial"] {
  const intro = pkg.product.introPrice;
  // Показываем только бесплатный пробный период и только тем, кому Apple его даст.
  if (!eligible || !intro || intro.price !== 0) return null;
  const unit = TRIAL_UNITS.find((item) => item === intro.periodUnit);
  if (!unit) return null;
  return { count: intro.periodNumberOfUnits * intro.cycles, unit };
}

// Тарифы из текущего предложения RevenueCat (offering default): месяц и год.
// Цены и валюта — только из App Store; в приложении их нет.
// null — предложение не загрузилось (нет сети, товары ещё не настроены).
export async function loadPaywallOffer(): Promise<PaywallOffer | null> {
  if (!configured) return null;
  const offering = (await Purchases.getOfferings()).current;
  const monthly = offering?.monthly ?? null;
  const annual = offering?.annual ?? null;
  const packages = [annual, monthly].filter(
    (item): item is PurchasesPackage => item !== null,
  );
  if (packages.length === 0) return null;

  // Право на пробный период решает Apple (был ли он уже у этого Apple ID).
  // Не удалось узнать (UNKNOWN, ошибка) — не обещаем пробный период.
  const eligibility = await Purchases.checkTrialOrIntroductoryPriceEligibility(
    packages.map((item) => item.product.identifier),
  ).catch(() => null);
  const isEligible = (pkg: PurchasesPackage) =>
    eligibility?.[pkg.product.identifier]?.status ===
    INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_ELIGIBLE;

  const plans: PaywallPlan[] = packages.map((pkg) => ({
    pkg,
    period: pkg.packageType === PACKAGE_TYPE.ANNUAL ? "annual" : "monthly",
    priceString: pkg.product.priceString,
    pricePerMonthString:
      pkg.packageType === PACKAGE_TYPE.ANNUAL
        ? pkg.product.pricePerMonthString
        : null,
    trial: trialOf(pkg, isEligible(pkg)),
  }));

  // Экономия года: обе цены из одного магазина и в одной валюте.
  let annualSavingsPercent: number | null = null;
  if (
    monthly &&
    annual &&
    monthly.product.currencyCode === annual.product.currencyCode &&
    monthly.product.price > 0
  ) {
    const percent = Math.floor(
      (1 - annual.product.price / (monthly.product.price * 12)) * 100,
    );
    if (percent > 0) annualSavingsPercent = percent;
  }

  return { plans, annualSavingsPercent };
}

// ---------- Покупка и восстановление ----------

export type PurchaseResult =
  | { status: "purchased"; premium: boolean }
  | { status: "restored"; premium: boolean }
  | { status: "cancelled" }
  // Покупка ждёт одобрения (например, «Попросить купить» в Семейном доступе).
  | { status: "pending" }
  // Не вошёл в аккаунт — сначала вход.
  | { status: "signInRequired" }
  // Покупки недоступны: нет ключа или не iPhone.
  | { status: "unavailable" }
  | { status: "error"; reason: PurchaseErrorReason };

// Причина ошибки — для понятного текста на экране.
export type PurchaseErrorReason =
  | "network"
  // Покупки запрещены на iPhone (Экранное время).
  | "notAllowed"
  // Товар сейчас нельзя купить (не настроен или недоступен в этой стране).
  | "productUnavailable"
  | "generic";

function isPurchasesError(error: unknown): error is PurchasesError {
  return typeof error === "object" && error !== null && "code" in error;
}

function toResult(error: unknown): PurchaseResult {
  if (!isPurchasesError(error)) return { status: "error", reason: "generic" };
  if (error.userCancelled || error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
    return { status: "cancelled" };
  }
  switch (error.code) {
    case PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR:
      return { status: "pending" };
    case PURCHASES_ERROR_CODE.NETWORK_ERROR:
    case PURCHASES_ERROR_CODE.OFFLINE_CONNECTION_ERROR:
      return { status: "error", reason: "network" };
    case PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR:
      return { status: "error", reason: "notAllowed" };
    case PURCHASES_ERROR_CODE.PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR:
      return { status: "error", reason: "productUnavailable" };
    default:
      if (__DEV__) console.log("RevenueCat: ошибка покупки", error.code, error.message);
      return { status: "error", reason: "generic" };
  }
}

async function canBuy(): Promise<PurchaseResult | null> {
  if (!configured) return { status: "unavailable" };
  // Только что вошли — дожидаемся, пока RevenueCat узнает аккаунт.
  await identifying;
  if (!currentUserId || (await Purchases.isAnonymous())) {
    return { status: "signInRequired" };
  }
  return null;
}

function hasPremium(info: CustomerInfo): boolean {
  return toPremiumInfo(info).premium;
}

// Купить выбранный тариф. Окно оплаты показывает Apple.
export async function purchasePlan(plan: PaywallPlan): Promise<PurchaseResult> {
  const blocked = await canBuy();
  if (blocked) return blocked;
  try {
    const { customerInfo } = await Purchases.purchasePackage(plan.pkg);
    applyCustomerInfo(customerInfo);
    return { status: "purchased", premium: hasPremium(customerInfo) };
  } catch (error) {
    return toResult(error);
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
    return toResult(error);
  }
}

// «Управлять подпиской» — системное окно подписок App Store (отмена, смена тарифа).
// Не открылось — страница подписок Apple в браузере.
export async function openManageSubscriptions(): Promise<void> {
  try {
    if (!configured) throw new Error("not configured");
    await Purchases.showManageSubscriptions();
  } catch {
    await Linking.openURL(APPLE_SUBSCRIPTIONS_URL).catch(() => {});
  }
  // Человек мог отменить подписку — спросим RevenueCat заново.
  refreshPremium();
}
