import "server-only";

import type { AiUsage, Database } from "@ai-navigator/shared";
import type { SupabaseClient } from "@supabase/supabase-js";

// Дневной лимит помощника — через функции в базе (миграция 20261117120000_ai_usage_limits).
// Вызываются с токеном пользователя: функции сами знают, кто это (auth.uid()).

type Db = SupabaseClient<Database>;

export type ConsumeResult =
  | { allowed: true; usage: AiUsage; reservationId: string }
  | { allowed: false; usage: AiUsage };

// Списать одну попытку. Атомарно: два одновременных запроса не превысят лимит.
export async function consumeAiRequest(
  db: Db,
  limit: number,
): Promise<ConsumeResult> {
  const { data, error } = await db.rpc("consume_ai_request", {
    p_limit: limit,
  });
  if (error) throw new Error(`consume_ai_request: ${error.code}`);
  const row = data?.[0];
  if (!row) throw new Error("consume_ai_request: empty result");

  const usage: AiUsage = {
    limit,
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

// Начало сегодняшнего дня по UTC — лимит считается по UTC.
function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function nextUtcMidnight(): string {
  const date = new Date();
  date.setUTCHours(24, 0, 0, 0);
  return date.toISOString();
}

// Сколько запросов осталось сегодня — без списания.
export async function readAiUsage(
  db: Db,
  userId: string,
  limit: number,
): Promise<AiUsage> {
  const { data, error } = await db
    .from("ai_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("day", todayUtc())
    .maybeSingle();
  if (error) throw new Error(`ai_usage: ${error.code}`);

  const used = Math.min(data?.count ?? 0, limit);
  return {
    limit,
    used,
    remaining: Math.max(limit - used, 0),
    resetAt: nextUtcMidnight(),
  };
}
