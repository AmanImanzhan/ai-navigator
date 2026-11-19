import { createHash, timingSafeEqual } from "node:crypto";

import { getRevenueCatWebhookSecret, MissingEnvError } from "@/lib/env";
import { applySubscriptionChange } from "@/lib/revenuecat/apply";
import { toSubscriptionChange, webhookBodySchema } from "@/lib/revenuecat/events";

// POST /api/revenuecat/webhook — RevenueCat сообщает о покупке, продлении, отмене,
// истечении, возврате и переносе подписки. Мы обновляем таблицу subscriptions.
//
// Защита: RevenueCat присылает заголовок «Authorization: Bearer <REVENUECAT_WEBHOOK_SECRET>»
// (значение задаётся в панели RevenueCat). Без него — 401, ничего не пишем.
// Ответ 200 — «принято»; любой другой код RevenueCat повторит (до 5 раз за ~80 минут).
// Повтор безопасен: событие с тем же id второй раз не применяется.
export const dynamic = "force-dynamic";

// Событие RevenueCat — несколько килобайт. Больше — не читаем.
const MAX_BODY_BYTES = 256 * 1024;

// Сравнение секрета за одинаковое время, чтобы его нельзя было подобрать по скорости ответа.
// Хеши одинаковой длины — timingSafeEqual требует равных длин.
function isAuthorized(header: string | null, secret: string): boolean {
  if (!header) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(header.trim()), digest(`Bearer ${secret}`));
}

function json(body: Record<string, string>, status: number): Response {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  let secret: string;
  try {
    secret = getRevenueCatWebhookSecret();
  } catch (error) {
    if (error instanceof MissingEnvError) console.error(`revenuecat webhook: ${error.message}`);
    return json({ error: "server_not_configured" }, 500);
  }

  if (!isAuthorized(request.headers.get("authorization"), secret)) {
    return json({ error: "unauthorized" }, 401);
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    return json({ error: "too_large" }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const parsed = webhookBodySchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid_event" }, 400);

  const { event } = parsed.data;
  try {
    const result = await applySubscriptionChange(toSubscriptionChange(event));
    // В журнал — только тип события и итог, без id пользователей.
    console.info(`revenuecat webhook: ${event.type} → ${result}`);
    return json({ result }, 200);
  } catch (error) {
    if (error instanceof MissingEnvError) {
      console.error(`revenuecat webhook: ${error.message}`);
      return json({ error: "server_not_configured" }, 500);
    }
    console.error(
      `revenuecat webhook: ${event.type} failed: ${error instanceof Error ? error.message : "unknown"}`,
    );
    // 500 — RevenueCat повторит событие позже.
    return json({ error: "failed" }, 500);
  }
}
