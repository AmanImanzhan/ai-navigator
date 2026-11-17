import type { AiErrorCode } from "@ai-navigator/shared";

// Ошибки помощника. Коды сервера (AiErrorCode в @ai-navigator/shared) плюс свои, приложения:
// - network — нет интернета или сервер недоступен;
// - timeout — ответ не пришёл вовремя (обычно слабая связь);
// - not_configured — в сборке нет адреса API (EXPO_PUBLIC_API_URL) или ключей Supabase;
// - cancelled — человек сам остановил запрос («Стоп» или ушёл с экрана). Это не ошибка, её не показываем.
export type AiClientErrorCode =
  | AiErrorCode
  | "network"
  | "timeout"
  | "not_configured"
  | "cancelled";

export class AiClientError extends Error {
  readonly code: AiClientErrorCode;
  // Для limit_reached: когда появятся новые запросы (ISO).
  readonly resetAt?: string;
  // Для input_too_long: сколько символов можно.
  readonly maxLength?: number;

  constructor(
    code: AiClientErrorCode,
    extra: { resetAt?: string; maxLength?: number } = {},
  ) {
    super(code);
    this.name = "AiClientError";
    this.code = code;
    this.resetAt = extra.resetAt;
    this.maxLength = extra.maxLength;
  }
}

const SERVER_CODES: readonly AiErrorCode[] = [
  "unauthorized",
  "invalid_request",
  "input_too_long",
  "not_found",
  "limit_reached",
  "ai_declined",
  "ai_unavailable",
  "server_not_configured",
];

export function isServerErrorCode(value: unknown): value is AiErrorCode {
  return SERVER_CODES.includes(value as AiErrorCode);
}

// Любую ошибку — в AiClientError (неизвестное считаем «ИИ недоступен»).
export function toAiClientError(error: unknown): AiClientError {
  return error instanceof AiClientError
    ? error
    : new AiClientError("ai_unavailable");
}
