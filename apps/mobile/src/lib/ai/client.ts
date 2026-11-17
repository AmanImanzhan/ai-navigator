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
import { AiClientError, isServerErrorCode } from "@/lib/ai/errors";
import { supabase } from "@/lib/supabase";

// Клиент API ИИ-помощника (apps/web/src/app/api/ai). Экраны ходят к помощнику только отсюда.
// Протокол (запросы, события потока, коды ошибок) — в @ai-navigator/shared, ai.ts.
// Любая неудача — AiClientError с понятным кодом.

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
// Помнит причину, чтобы показать понятную ошибку.
class RequestGuard {
  private readonly controller = new AbortController();
  private timer: ReturnType<typeof setTimeout> | undefined;
  private timedOut = false;
  private readonly onExternalAbort = () => this.controller.abort();

  constructor(private readonly external?: AbortSignal) {
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
    if (error instanceof AiClientError) return error;
    // fetch бросает ошибку, когда нет сети или связь оборвалась.
    return new AiClientError("network");
  }

  dispose() {
    clearTimeout(this.timer);
    this.external?.removeEventListener("abort", this.onExternalAbort);
  }
}

async function send(
  path: string,
  token: string,
  signal: AbortSignal,
  body?: unknown,
): Promise<FetchResponse> {
  return fetch(`${API_URL}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });
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
  );
}

function isAiUsage(value: unknown): value is AiUsage {
  return (
    isObject(value) &&
    typeof value.limit === "number" &&
    typeof value.used === "number" &&
    typeof value.remaining === "number" &&
    typeof value.resetAt === "string"
  );
}

// ---------- Сколько запросов осталось сегодня: GET /api/ai/usage ----------

export async function fetchAiUsage(signal?: AbortSignal): Promise<AiUsage> {
  const guard = new RequestGuard(signal);
  try {
    const token = await getAccessToken();
    guard.restartTimer(USAGE_TIMEOUT_MS);
    const response = await send("/api/ai/usage", token, guard.signal);
    if (!response.ok) throw await readError(response);
    const body: unknown = await response.json();
    if (!isAiUsage(body)) throw new AiClientError("ai_unavailable");
    return body;
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
  const guard = new RequestGuard(signal);
  try {
    const token = await getAccessToken();
    guard.restartTimer(FILL_TIMEOUT_MS);
    const response = await send("/api/ai/fill", token, guard.signal, request);
    if (!response.ok) throw await readError(response);
    const body: unknown = await response.json();
    if (
      !isObject(body) ||
      !isObject(body.values) ||
      typeof body.tip !== "string" ||
      !isAiUsage(body.usage)
    ) {
      throw new AiClientError("ai_unavailable");
    }
    // Берём только строковые значения — на всякий случай.
    const values: Record<string, string> = {};
    for (const [field, value] of Object.entries(body.values)) {
      if (typeof value === "string") values[field] = value;
    }
    return { values, tip: body.tip, usage: body.usage };
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
    return isObject(value) && typeof value.type === "string"
      ? (value as AiTryEvent)
      : null;
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
  const guard = new RequestGuard(signal);
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
      const { done, value } = await reader.read();
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
