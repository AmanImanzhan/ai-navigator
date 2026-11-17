import type { AiUsage } from "@ai-navigator/shared";

import { aiErrorResponse } from "@/lib/api/responses";
import { MissingEnvError } from "@/lib/env";

// Общие ответы маршрутов API.

// Лимит на сегодня исчерпан: 429 + когда обнулится (и Retry-After в секундах — стандартный заголовок).
export function limitReachedResponse(usage: AiUsage): Response {
  const seconds = Math.max(
    Math.ceil((new Date(usage.resetAt).getTime() - Date.now()) / 1000),
    1,
  );
  return aiErrorResponse(
    "limit_reached",
    429,
    { resetAt: usage.resetAt },
    { "retry-after": String(seconds) },
  );
}

// Неожиданная ошибка маршрута. В журнал — только тип ошибки, без данных запроса.
export function handleRouteError(error: unknown, route: string): Response {
  if (error instanceof MissingEnvError) {
    console.error(`${route}: ${error.message}`);
    return aiErrorResponse("server_not_configured", 500);
  }
  console.error(
    `${route}: ${error instanceof Error ? `${error.name}: ${error.message}` : "unknown error"}`,
  );
  return aiErrorResponse("ai_unavailable", 503);
}
