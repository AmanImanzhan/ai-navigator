import type { AiClientError } from "@/lib/ai/errors";
import { captureError } from "@/lib/monitoring";

// Отчёт в Sentry о сбоях ИИ-клиента, которых не ждём: без него «нет сети» на экране
// не отличить от ошибки в коде или в сборке.
// В отчёте только запрос (try/fill/usage), код, имя и сообщение исходной ошибки, HTTP-статус.
// Никогда — текст человека, ответ ИИ, токен или заголовки.

export type AiOperation = "try" | "fill" | "usage";

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

// Сообщение исходной ошибки. Ошибка разбора JSON может процитировать кусок ответа ИИ —
// у неё берём только имя.
function reasonMessage(reason: unknown): string | undefined {
  if (!(reason instanceof Error) || reason.name === "SyntaxError") return undefined;
  return reason.message.slice(0, MAX_MESSAGE_LENGTH);
}

export function buildAiErrorReport(
  operation: AiOperation,
  error: AiClientError,
): AiErrorReport {
  const { reason } = error;
  // Одна группа в Sentry на пару «запрос + код».
  const reported = new Error(`AI ${operation}: ${error.code}`);
  reported.name = "AiClientError";
  return {
    error: reported,
    // Сбой связи бывает и у здоровой сборки — предупреждение, остальное — ошибка.
    level: error.code === "network" ? "warning" : "error",
    tags: { ai_operation: operation, ai_error_code: error.code },
    extra: {
      reasonName: reason instanceof Error ? reason.name : typeof reason,
      reasonMessage: reasonMessage(reason),
      status: error.status,
    },
  };
}

export function reportAiError(operation: AiOperation, error: AiClientError): void {
  if (!shouldReportAiError(error)) return;
  const { error: reported, ...context } = buildAiErrorReport(operation, error);
  captureError(reported, context);
}
