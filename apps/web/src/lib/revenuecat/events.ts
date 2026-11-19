import {
  PREMIUM_ENTITLEMENT,
  PREMIUM_PRODUCTS,
  type Database,
} from "@ai-navigator/shared";
import { z } from "zod";

// События webhook RevenueCat → что поменять в таблице subscriptions.
// Чистые функции без базы и сети — их легко проверить отдельно.
// Поля и типы событий: https://www.revenuecat.com/docs/integrations/webhooks/event-types-and-fields

type SubscriptionStatus = Database["public"]["Enums"]["subscription_status"];

// Только нужные поля. Остальные (их много, и RevenueCat добавляет новые) просто пропускаем.
const eventSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  app_user_id: z.string().nullish(),
  original_app_user_id: z.string().nullish(),
  aliases: z.array(z.string()).nullish(),
  transferred_from: z.array(z.string()).nullish(),
  transferred_to: z.array(z.string()).nullish(),
  product_id: z.string().nullish(),
  entitlement_ids: z.array(z.string()).nullish(),
  period_type: z.string().nullish(),
  expiration_at_ms: z.number().nullish(),
  grace_period_expiration_at_ms: z.number().nullish(),
  event_timestamp_ms: z.number(),
  environment: z.enum(["SANDBOX", "PRODUCTION"]).nullish(),
  cancel_reason: z.string().nullish(),
});

export const webhookBodySchema = z.object({ event: eventSchema });

export type RevenueCatEvent = z.infer<typeof eventSchema>;

export type SubscriptionChange =
  | { kind: "ignore"; reason: string }
  | {
      kind: "update";
      eventId: string;
      eventType: string;
      userId: string;
      status: SubscriptionStatus;
      productId: string;
      expiresAt: string;
      eventAt: string;
      environment: "SANDBOX" | "PRODUCTION";
    }
  | {
      kind: "transfer";
      eventId: string;
      from: string[];
      // null — покупки ушли анонимному пользователю (не вошёл в аккаунт).
      to: string | null;
      eventAt: string;
    };

// appUserID в приложении = id пользователя Supabase (uuid). Анонимные id RevenueCat
// ($RCAnonymousID:…) пропускаем — у них нет аккаунта и лимита.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function userIds(ids: (string | null | undefined)[]): string[] {
  return [...new Set(ids.filter((id): id is string => !!id && UUID.test(id)))].map(
    (id) => id.toLowerCase(),
  );
}

const PRODUCT_IDS: readonly string[] = Object.values(PREMIUM_PRODUCTS);

// Событие про нашу подписку: entitlement premium или один из наших товаров.
function isPremium(event: RevenueCatEvent): boolean {
  return (
    (event.entitlement_ids?.includes(PREMIUM_ENTITLEMENT) ?? false) ||
    (event.product_id ? PRODUCT_IDS.includes(event.product_id) : false)
  );
}

const iso = (ms: number) => new Date(ms).toISOString();

// Активная подписка: пробный период или обычный оплаченный.
function activeStatus(event: RevenueCatEvent): SubscriptionStatus {
  return event.period_type === "TRIAL" ? "trialing" : "active";
}

// Статус и срок по типу события. null — событие не меняет доступ.
function statusFor(
  event: RevenueCatEvent,
): { status: SubscriptionStatus; expiresAtMs: number | null } | null {
  switch (event.type) {
    // Покупка, продление (или новая подписка после истечения), снова включил автопродление,
    // Apple продлил срок, отменили возврат денег, временный доступ при сбое у Apple.
    case "INITIAL_PURCHASE":
    case "RENEWAL":
    case "UNCANCELLATION":
    case "SUBSCRIPTION_EXTENDED":
    case "REFUND_REVERSED":
    case "TEMPORARY_ENTITLEMENT_GRANT":
      return { status: activeStatus(event), expiresAtMs: event.expiration_at_ms ?? null };

    case "CANCELLATION":
      // Возврат денег (через Apple) — доступ заканчивается сразу.
      if (event.cancel_reason === "CUSTOMER_SUPPORT") {
        return { status: "expired", expiresAtMs: event.event_timestamp_ms };
      }
      // Выключил автопродление — доступ до конца оплаченного периода.
      return { status: "cancelled", expiresAtMs: event.expiration_at_ms ?? null };

    // Не прошла оплата: Apple ещё пытается списать, доступ — до конца льготного срока.
    case "BILLING_ISSUE":
      return {
        status: "grace_period",
        expiresAtMs: event.grace_period_expiration_at_ms ?? event.expiration_at_ms ?? null,
      };

    case "EXPIRATION":
      return {
        status: "expired",
        expiresAtMs: event.expiration_at_ms ?? event.event_timestamp_ms,
      };

    // TEST, PRODUCT_CHANGE (новый товар придёт событием RENEWAL), SUBSCRIPTION_PAUSED
    // (только Google Play) и другие — доступ не меняют.
    default:
      return null;
  }
}

export function toSubscriptionChange(event: RevenueCatEvent): SubscriptionChange {
  const eventAt = iso(event.event_timestamp_ms);

  if (event.type === "TRANSFER") {
    const from = userIds(event.transferred_from ?? []);
    if (from.length === 0) return { kind: "ignore", reason: "transfer_from_anonymous" };
    return {
      kind: "transfer",
      eventId: event.id,
      from,
      to: userIds(event.transferred_to ?? [])[0] ?? null,
      eventAt,
    };
  }

  if (!isPremium(event)) return { kind: "ignore", reason: "not_premium" };

  const change = statusFor(event);
  if (!change) return { kind: "ignore", reason: "event_type" };
  if (change.expiresAtMs === null || !event.product_id) {
    return { kind: "ignore", reason: "no_expiration" };
  }

  // Последний id приложения, затем остальные id этого покупателя.
  const userId = userIds([
    event.app_user_id,
    event.original_app_user_id,
    ...(event.aliases ?? []),
  ])[0];
  if (!userId) return { kind: "ignore", reason: "anonymous" };

  return {
    kind: "update",
    eventId: event.id,
    eventType: event.type,
    userId,
    status: change.status,
    productId: event.product_id,
    expiresAt: iso(change.expiresAtMs),
    eventAt,
    environment: event.environment ?? "PRODUCTION",
  };
}
