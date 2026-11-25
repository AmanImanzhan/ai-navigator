import type {
  AiErrorResponse,
  AiFillRequest,
  AiFillResponse,
  AiTryEvent,
  AiTryRequest,
  AiUsage,
} from "@ai-navigator/shared";
import {
  API_URL,
  FILL_TIMEOUT_MS,
  TRY_IDLE_TIMEOUT_MS,
  TRY_START_TIMEOUT_MS,
  USAGE_TIMEOUT_MS,
} from "@/lib/ai/config";
import { AiClientError, isServerErrorCode } from "@/lib/ai/errors";
import { reportAiError, type AiOperation } from "@/lib/ai/report";
import { XhrNetworkError, xhrRequest, type XhrResponse } from "@/lib/ai/xhr";
import { supabase } from "@/lib/supabase";
import { hasAiConsent } from "@/store/useAiConsentStore";

// Клиент API ИИ-помощника (apps/web/src/app/api/ai). Экраны ходят к помощнику только отсюда.
// Протокол (запросы, события потока, коды ошибок) — в @ai-navigator/shared, ai.ts.
// Любая неудача — AiClientError с понятным кодом. «network» — только настоящий сбой связи;
// всё неожиданное — «unexpected» и отчёт в Sentry (lib/ai/report.ts).
// Транспорт — XMLHttpRequest React Native (lib/ai/xhr.ts), поток читаем по кусочкам.

// Текст человека уходит в Anthropic только с его согласия (правило Apple 5.1.2(i)).
// Экраны сначала показывают лист согласия; это последняя проверка — без согласия запрос не уходит.
function requireAiConsent(): void {
  if (!hasAiConsent()) throw new AiClientError("consent_required");
}

// Токен текущей сессии входа. getSession сам продлит его, если срок вышел.
async function getAccessToken(): Promise<string> {
  if (!supabase || !API_URL) throw new AiClientError("not_configured");
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new AiClientError("unauthorized");
  return token;
}

// Отмена запроса: по кнопке «Стоп» (внешний signal) или по таймауту.
// Помнит причину, чтобы показать понятную ошибку, и сообщает о неожиданных сбоях.
class RequestGuard {
  private readonly controller = new AbortController();
  private timer: ReturnType<typeof setTimeout> | undefined;
  private timedOut = false;
  private readonly onExternalAbort = () => this.controller.abort();

  constructor(
    private readonly operation: AiOperation,
    private readonly external?: AbortSignal,
  ) {
    if (external?.aborted) this.controller.abort();
    external?.addEventListener("abort", this.onExternalAbort);
  }

  get signal(): AbortSignal {
    return this.controller.signal;
  }

  // (Пере)запускает таймер: если за ms ничего не пришло — прерываем запрос.
  restartTimer(ms: number) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timedOut = true;
      this.controller.abort();
    }, ms);
  }

  // Во что превратить пойманную ошибку.
  explain(error: unknown): AiClientError {
    if (this.timedOut) return new AiClientError("timeout");
    if (this.external?.aborted) return new AiClientError("cancelled");
    const result =
      error instanceof AiClientError
        ? error
        : new AiClientError("unexpected", { reason: error });
    reportAiError(this.operation, "xhr", result);
    return result;
  }

  dispose() {
    clearTimeout(this.timer);
    this.external?.removeEventListener("abort", this.onExternalAbort);
  }
}

// Имя заголовка — только символы token из HTTP (RFC 9110), значение — видимые ASCII и пробелы
// внутри, без управляющих символов и переносов строк. Иначе iOS может оборвать запрос.
const HEADER_NAME = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
const HEADER_VALUE = /^[\x21-\x7E]([\x20-\x7E]*[\x21-\x7E])?$/;

export function isValidHeader(name: string, value: string): boolean {
  return HEADER_NAME.test(name) && HEADER_VALUE.test(value);
}

// Заголовки запроса к API ИИ. Испорченный токен не отправляем: в отчёт — без самого токена.
export function buildRequestHeaders(
  token: string,
  hasBody: boolean,
): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
  };
  for (const [name, value] of Object.entries(headers)) {
    if (!isValidHeader(name, value)) {
      throw new AiClientError("unexpected", {
        reason: new Error(`invalid request header: ${name}`),
      });
    }
  }
  return headers;
}

// Запрос к API. Cookie не отправляем (withCredentials = false в xhr.ts): вход — по токену.
// Сбой связи — «network»; остальное разберёт explain.
async function send(
  path: string,
  token: string,
  signal: AbortSignal,
  options: { body?: unknown; onChunk?: (text: string) => void } = {},
): Promise<XhrResponse> {
  const { body, onChunk } = options;
  try {
    return await xhrRequest({
      url: `${API_URL}${path}`,
      method: body === undefined ? "GET" : "POST",
      headers: buildRequestHeaders(token, body !== undefined),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
      onChunk,
    });
  } catch (error) {
    if (error instanceof XhrNetworkError) {
      throw new AiClientError("network", { reason: error });
    }
    throw error;
  }
}

function isOk(response: XhrResponse): boolean {
  return response.status >= 200 && response.status < 300;
}

// Тело успешного ответа → JSON. Не JSON — исключение (SyntaxError), его разберёт explain.
function parseJson(response: XhrResponse): unknown {
  return JSON.parse(response.text);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Ответ с ошибкой → AiClientError с кодом сервера. Не JSON (например, страница ошибки хостинга) —
// «ИИ недоступен».
function readError(response: XhrResponse): AiClientError {
  let body: unknown = null;
  try {
    body = JSON.parse(response.text);
  } catch {
    // Не JSON — ниже ответим по статусу.
  }
  if (isObject(body) && isServerErrorCode(body.error)) {
    const { resetAt, maxLength } = body as Partial<AiErrorResponse>;
    return new AiClientError(body.error, {
      resetAt: typeof resetAt === "string" ? resetAt : undefined,
      maxLength: typeof maxLength === "number" ? maxLength : undefined,
    });
  }
  return new AiClientError(
    response.status === 401 ? "unauthorized" : "ai_unavailable",
    { status: response.status },
  );
}

// Остаток запросов из ответа сервера. Не тот формат — null.
// premium мог не прийти от старой версии сервера — тогда считаем, что подписки нет.
function toAiUsage(value: unknown): AiUsage | null {
  if (
    !isObject(value) ||
    typeof value.limit !== "number" ||
    typeof value.used !== "number" ||
    typeof value.remaining !== "number" ||
    typeof value.resetAt !== "string"
  ) {
    return null;
  }
  return {
    limit: value.limit,
    premium: value.premium === true,
    used: value.used,
    remaining: value.remaining,
    resetAt: value.resetAt,
  };
}

// ---------- Сколько запросов осталось сегодня: GET /api/ai/usage ----------

export async function fetchAiUsage(signal?: AbortSignal): Promise<AiUsage> {
  const guard = new RequestGuard("usage", signal);
  try {
    const token = await getAccessToken();
    guard.restartTimer(USAGE_TIMEOUT_MS);
    const response = await send("/api/ai/usage", token, guard.signal);
    if (!isOk(response)) throw readError(response);
    const body = parseJson(response);
    const usage = toAiUsage(body);
    if (!usage) throw new AiClientError("ai_unavailable");
    return usage;
  } catch (error) {
    throw guard.explain(error);
  } finally {
    guard.dispose();
  }
}

// ---------- «Заполнить с помощником»: POST /api/ai/fill ----------

export async function requestAiFill(
  request: AiFillRequest,
  signal?: AbortSignal,
): Promise<AiFillResponse> {
  const guard = new RequestGuard("fill", signal);
  try {
    requireAiConsent();
    const token = await getAccessToken();
    guard.restartTimer(FILL_TIMEOUT_MS);
    const response = await send("/api/ai/fill", token, guard.signal, {
      body: request,
    });
    if (!isOk(response)) throw readError(response);
    const body = parseJson(response);
    const usage = isObject(body) ? toAiUsage(body.usage) : null;
    if (
      !isObject(body) ||
      !isObject(body.values) ||
      typeof body.tip !== "string" ||
      !usage
    ) {
      throw new AiClientError("ai_unavailable");
    }
    // Берём только строковые значения — на всякий случай.
    const values: Record<string, string> = {};
    for (const [field, value] of Object.entries(body.values)) {
      if (typeof value === "string") values[field] = value;
    }
    return { values, tip: body.tip, usage };
  } catch (error) {
    throw guard.explain(error);
  } finally {
    guard.dispose();
  }
}

// ---------- «Попробуй сам»: POST /api/ai/try, ответ потоком ----------

// Одна строка NDJSON → событие. Непонятные строки пропускаем.
function parseTryEvent(line: string): AiTryEvent | null {
  if (!line.trim()) return null;
  try {
    const value: unknown = JSON.parse(line);
    if (!isObject(value) || typeof value.type !== "string") return null;
    if (value.type === "meta") {
      const usage = toAiUsage(value.usage);
      return usage ? { type: "meta", usage } : null;
    }
    return value as AiTryEvent;
  } catch {
    return null;
  }
}

// События потока, кроме ошибки: ошибка приходит как AiClientError.
export type AiTryStreamEvent = Exclude<AiTryEvent, { type: "error" }>;

// Отправляет запрос и передаёт события по мере прихода: meta → answer… → review… → done.
// Завершается, когда пришло done. Сбой (в том числе посреди ответа) — AiClientError;
// всё, что пришло до сбоя, уже передано в onEvent.
export async function streamAiTry(
  request: AiTryRequest,
  onEvent: (event: AiTryStreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const guard = new RequestGuard("try", signal);
  // Кусочки приходят как попало: строка может оборваться посередине — храним хвост.
  let buffer = "";
  let finished = false;

  // Разобрать готовые строки. Ошибка из потока — исключение: xhr.ts прервёт запрос.
  const handleLines = (lines: string[]) => {
    for (const line of lines) {
      if (finished) return;
      const event = parseTryEvent(line);
      if (!event) continue;
      if (event.type === "error") throw new AiClientError(event.error);
      onEvent(event);
      if (event.type === "done") finished = true;
    }
  };

  try {
    requireAiConsent();
    const token = await getAccessToken();
    guard.restartTimer(TRY_START_TIMEOUT_MS);
    const response = await send("/api/ai/try", token, guard.signal, {
      body: request,
      onChunk: (chunk) => {
        // Пришёл кусочек — связь жива, ждём следующий не дольше TRY_IDLE_TIMEOUT_MS.
        guard.restartTimer(TRY_IDLE_TIMEOUT_MS);
        const lines = (buffer + chunk).split("\n");
        buffer = lines.pop() ?? "";
        handleLines(lines);
      },
    });
    if (!isOk(response)) throw readError(response);
    // Последняя строка могла прийти без перевода строки.
    handleLines([buffer]);
    buffer = "";
    // Поток закончился без done — связь оборвалась.
    if (!finished) throw new AiClientError("network");
  } catch (error) {
    throw guard.explain(error);
  } finally {
    guard.dispose();
  }
}
