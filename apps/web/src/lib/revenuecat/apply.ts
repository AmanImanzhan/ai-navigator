import "server-only";

import type { SubscriptionChange } from "@/lib/revenuecat/events";
import { createAdminClient } from "@/lib/supabase/admin";

// Записывает изменение подписки в базу (secret key). Вызывать только после проверки
// секрета webhook. Сама запись — в функциях базы (миграция 20261119120000_subscriptions):
// там же защита от повторов (id события) и от старых событий (время события).
// Возвращает итог: applied / duplicate / stale / unknown_user / ignore:<причина>.
export async function applySubscriptionChange(
  change: SubscriptionChange,
): Promise<string> {
  if (change.kind === "ignore") return `ignore:${change.reason}`;

  const db = createAdminClient();

  if (change.kind === "transfer") {
    const { data, error } = await db.rpc("apply_subscription_transfer", {
      p_event_id: change.eventId,
      p_from: change.from,
      p_event_at: change.eventAt,
      ...(change.to ? { p_to: change.to } : {}),
    });
    if (error) throw new Error(`apply_subscription_transfer: ${error.code}`);
    return data;
  }

  const { data, error } = await db.rpc("apply_subscription_event", {
    p_event_id: change.eventId,
    p_event_type: change.eventType,
    p_user: change.userId,
    p_status: change.status,
    p_product_id: change.productId,
    p_expires_at: change.expiresAt,
    p_event_at: change.eventAt,
    p_environment: change.environment,
  });
  if (error) throw new Error(`apply_subscription_event: ${error.code}`);
  return data;
}
