import type { AiClientError } from "@/lib/ai/errors";
import { captureError } from "@/lib/monitoring";

// Отчёт в Sentry о сбоях ИИ-клиента, которых не ждём: без него «нет сети» на экране
// не отличить от ошибки в коде или в сборке.
// В отчёте только запрос (try/fill/usage), транспорт, код, имя/сообщение/код исходной ошибки
// и её cause, HTTP-статус. Никогда — текст человека, ответ ИИ, токен или заголовки.

export type AiOperation = "try" | "fill" | "usage";
// xhr — XMLHttpRequest React Native (lib/ai/xhr.ts). Если транспорт сменится — новое значение.
export type AiTransport = "xhr";

const MAX_MESSAGE_LENGTH = 200;

// Что отправляем: сбой связи и неожиданное в приложении, а также ответ сервера не в нашем
// формате (status есть только тогда). Ответы сервера с кодом (лимит, отказ ИИ…), таймаут
// и «Стоп» — обычная работа, их не шлём.
export function shouldReportAiError(error: AiClientError): boolean {
  if (error.code === "network" || error.code === "unexpected") return true;
  return error.status !== undefined;
}

export type AiErrorReport = {
  error: Error;
  level: "warning" | "error";
  tags: Record<string, string>;
  extra: Record<string, string | number | undefined>;
};

// Сообщение ошибки. Ошибка разбора JSON может процитировать кусок ответа ИИ —
// у неё берём только имя.
function errorMessage(error: unknown): string | undefined {
  if (!(error instanceof Error) || error.name === "SyntaxError") return undefined;
  return error.message.slice(0, MAX_MESSAGE_LENGTH);
}

// Код ошибки (ExpoModulesCore кладёт его в .code, например ERR_…), если он есть.
function errorCode(error: unknown): string | number | undefined {
  if (typeof error !== "object" || error === null || !("code" in error)) return undefined;
  const { code } = error;
  return typeof code === "string" || typeof code === "number" ? code : undefined;
}

function errorName(error: unknown): string | undefined {
  if (error === undefined) return undefined;
  return error instanceof Error ? error.name : typeof error;
}

export function buildAiErrorReport(
  operation: AiOperation,
  transport: AiTransport,
  error: AiClientError,
): AiErrorReport {
  const { reason } = error;
  const cause: unknown = reason instanceof Error ? reason.cause : undefined;
  // Одна группа в Sentry на пару «запрос + код».
  const reported = new Error(`AI ${operation}: ${error.code}`);
  reported.name = "AiClientError";
  return {
    error: reported,
    // Сбой связи бывает и у здоровой сборки — предупреждение, остальное — ошибка.
    level: error.code === "network" ? "warning" : "error",
    tags: {
      ai_operation: operation,
      ai_error_code: error.code,
      transport,
    },
    extra: {
      reasonName: reason instanceof Error ? reason.name : typeof reason,
      reasonMessage: errorMessage(reason),
      reasonCode: errorCode(reason),
      causeName: errorName(cause),
      causeMessage: errorMessage(cause),
      causeCode: errorCode(cause),
      status: error.status,
    },
  };
}

export function reportAiError(
  operation: AiOperation,
  transport: AiTransport,
  error: AiClientError,
): void {
  if (!shouldReportAiError(error)) return;
  const { error: reported, ...context } = buildAiErrorReport(operation, transport, error);
  captureError(reported, context);
}
