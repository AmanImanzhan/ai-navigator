import * as Sentry from "@sentry/nextjs";

// Отправка ошибок сервера в Sentry. Без SENTRY_DSN ничего не делает.

// Наши ошибки (сообщения — только коды, без данных человека): отправляем как есть.
export function reportServerError(where: string, error: unknown): void {
  Sentry.captureException(error, { tags: { where } });
}

// Ошибки ИИ-провайдера: в их сообщениях и полях может оказаться текст запроса или ответа,
// поэтому отправляем только тип ошибки и HTTP-код — без исходного объекта.
export function reportAiError(where: string, error: unknown): void {
  const name = error instanceof Error ? error.name : "unknown";
  // Человек остановил ответ или ушёл с экрана — это не ошибка.
  if (name === "AbortError" || name === "ResponseAborted") return;
  const status =
    typeof error === "object" && error !== null && "statusCode" in error
      ? error.statusCode
      : undefined;
  const suffix = typeof status === "number" ? ` (${status})` : "";
  Sentry.captureException(new Error(`${where}: ${name}${suffix}`), {
    tags: { where, area: "ai" },
  });
}
