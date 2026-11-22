import type {
  AiErrorResponse,
  AiFillRequest,
  AiFillResponse,
  AiTryEvent,
  AiTryRequest,
  AiUsage,
} from "@ai-navigator/shared";
// fetch из Expo умеет читать ответ по кусочкам (response.body.getReader()) — для потока ответа ИИ.
import { fetch } from "expo/fetch";

import {
  API_URL,
  FILL_TIMEOUT_MS,
  TRY_IDLE_TIMEOUT_MS,
  TRY_START_TIMEOUT_MS,
  USAGE_TIMEOUT_MS,
} from "@/lib/ai/config";
import {
  AiClientError,
  isFetchFailure,
  isServerErrorCode,
} from "@/lib/ai/errors";
import { reportAiError, type AiOperation } from "@/lib/ai/report";
import { supabase } from "@/lib/supabase";

// Клиент API ИИ-помощника (apps/web/src/app/api/ai). Экраны ходят к помощнику только отсюда.
// Протокол (запросы, события потока, коды ошибок) — в @ai-navigator/shared, ai.ts.
// Любая неудача — AiClientError с понятным кодом. «network» — только настоящий сбой связи;
// всё неожиданное — «unexpected» и отчёт в Sentry (lib/ai/report.ts).

type FetchResponse = Awaited<ReturnType<typeof fetch>>;

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
    reportAiError(this.operation, result);
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

async function send(
  path: string,
  token: string,
  signal: AbortSignal,
  body?: unknown,
): Promise<FetchResponse> {
  const headers = buildRequestHeaders(token, body !== undefined);
  try {
    return await fetch(`${API_URL}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    // Запрос не ушёл или ответ не пришёл из-за связи — «нет сети». Другое — разберёт explain.
    if (isFetchFailure(error)) {
      throw new AiClientError("network", { reason: error });
    }
    throw error;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Ответ с ошибкой → AiClientError с кодом сервера. Не JSON (например, страница ошибки Vercel) —
// «ИИ недоступен».
async function readError(response: FetchResponse): Promise<AiClientError> {
  const body: unknown = await response.json().catch(() => null);
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
    if (!response.ok) throw await readError(response);
    const body: unknown = await response.json();
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
    const token = await getAccessToken();
    guard.restartTimer(FILL_TIMEOUT_MS);
    const response = await send("/api/ai/fill", token, guard.signal, request);
    if (!response.ok) throw await readError(response);
    const body: unknown = await response.json();
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

// Следующий кусочек ответа. Поток оборвался посреди ответа — это сбой связи.
async function readChunk(
  reader: ReadableStreamDefaultReader<Uint8Array>,
): Promise<ReadableStreamReadResult<Uint8Array>> {
  try {
    return await reader.read();
  } catch (error) {
    throw new AiClientError("network", { reason: error });
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
  try {
    const token = await getAccessToken();
    guard.restartTimer(TRY_START_TIMEOUT_MS);
    const response = await send("/api/ai/try", token, guard.signal, request);
    if (!response.ok) throw await readError(response);
    if (!response.body) throw new AiClientError("ai_unavailable");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    // Кусочки приходят как попало: строка может оборваться посередине — храним хвост.
    let buffer = "";
    for (;;) {
      guard.restartTimer(TRY_IDLE_TIMEOUT_MS);
      const { done, value } = await readChunk(reader);
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = done ? "" : (lines.pop() ?? "");

      for (const line of lines) {
        const event = parseTryEvent(line);
        if (!event) continue;
        if (event.type === "error") throw new AiClientError(event.error);
        onEvent(event);
        if (event.type === "done") return;
      }
      // Поток закончился без done — связь оборвалась.
      if (done) throw new AiClientError("network");
    }
  } catch (error) {
    throw guard.explain(error);
  } finally {
    guard.dispose();
  }
}
