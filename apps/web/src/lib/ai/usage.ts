import "server-only";

import type { AiUsage, Database } from "@ai-navigator/shared";
import type { SupabaseClient } from "@supabase/supabase-js";

import { FREE_DAILY_LIMIT, PREMIUM_DAILY_LIMIT } from "@/lib/ai/config";

// Дневной лимит помощника — через функции в базе (миграции 20261117120000_ai_usage_limits
// и 20261119120000_subscriptions: лимит зависит от подписки).
// Вызываются с токеном пользователя: функции сами знают, кто это (auth.uid()).

type Db = SupabaseClient<Database>;

export type ConsumeResult =
  | { allowed: true; usage: AiUsage; reservationId: string }
  | { allowed: false; usage: AiUsage };

// Оба лимита передаём в базу, а она сама выбирает по подписке (таблица subscriptions).
const LIMITS = {
  p_free_limit: FREE_DAILY_LIMIT,
  p_premium_limit: PREMIUM_DAILY_LIMIT,
};

// Списать одну попытку. Атомарно: два одновременных запроса не превысят лимит.
export async function consumeAiRequest(db: Db): Promise<ConsumeResult> {
  const { data, error } = await db.rpc("consume_ai_request", LIMITS);
  if (error) throw new Error(`consume_ai_request: ${error.code}`);
  const row = data?.[0];
  if (!row) throw new Error("consume_ai_request: empty result");

  const usage: AiUsage = {
    limit: row.daily_limit,
    premium: row.premium,
    used: row.used,
    remaining: row.remaining,
    resetAt: new Date(row.reset_at).toISOString(),
  };
  return row.allowed && row.reservation_id
    ? { allowed: true, usage, reservationId: row.reservation_id }
    : { allowed: false, usage };
}

// Вернуть попытку, если ИИ не ответил. Ошибку возврата только записываем в журнал:
// человеку она ничего не меняет, а ответ об ошибке ИИ он уже получит.
export async function refundAiRequest(
  db: Db,
  reservationId: string,
): Promise<void> {
  const { error } = await db.rpc("refund_ai_request", {
    p_reservation: reservationId,
  });
  if (error) console.error(`refund_ai_request failed: ${error.code}`);
}

// Сколько запросов осталось сегодня и есть ли подписка — без списания.
export async function readAiUsage(db: Db): Promise<AiUsage> {
  const { data, error } = await db.rpc("ai_usage_status", LIMITS);
  if (error) throw new Error(`ai_usage_status: ${error.code}`);
  const row = data?.[0];
  if (!row) throw new Error("ai_usage_status: empty result");
  return {
    limit: row.daily_limit,
    premium: row.premium,
    used: row.used,
    remaining: row.remaining,
    resetAt: new Date(row.reset_at).toISOString(),
  };
}
