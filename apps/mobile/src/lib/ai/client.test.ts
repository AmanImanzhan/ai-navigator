import { afterAll, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { fetchAiUsage, isValidHeader, streamAiTry } from "@/lib/ai/client";
import { AiClientError } from "@/lib/ai/errors";
import { captureError } from "@/lib/monitoring";

// Клиент ИИ: «нет сети» — только при настоящем сбое связи, остальное — «unexpected»
// и отчёт в Sentry с причиной, но без текста человека и токена.
// fetch из Expo (поток «Попробуй сам»), глобальный fetch («сколько осталось»), Supabase и Sentry
// подменены — без сети и ключей.

const TOKEN = "secret-access-token";
const PROMPT = "Напиши письмо начальнику про отпуск";

const mockFetch = jest.fn<(url: string, init: unknown) => Promise<unknown>>();
// Глобальный fetch — им ходит Supabase; им же теперь идёт GET /api/ai/usage.
const mockGlobalFetch = jest.fn<(url: string, init: unknown) => Promise<unknown>>();
const ORIGINAL_GLOBAL_FETCH = globalThis.fetch;
const mockGetSession = jest.fn<() => Promise<unknown>>();

jest.mock("expo/fetch", () => ({
  fetch: (url: string, init: unknown) => mockFetch(url, init),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: { auth: { getSession: () => mockGetSession() } },
}));

jest.mock("@/lib/ai/config", () => ({
  API_URL: "https://api.example.test",
  TRY_START_TIMEOUT_MS: 40_000,
  TRY_IDLE_TIMEOUT_MS: 25_000,
  FILL_TIMEOUT_MS: 40_000,
  USAGE_TIMEOUT_MS: 10_000,
}));

jest.mock("@/lib/monitoring", () => ({ captureError: jest.fn() }));

const mockCapture = jest.mocked(captureError);

// Ответ с потоком: кусочки по очереди, затем конец (или обрыв, если передана ошибка).
function streamResponse(chunks: string[], breakWith?: Error) {
  const encoder = new TextEncoder();
  let index = 0;
  return {
    ok: true,
    status: 200,
    body: {
      getReader: () => ({
        read: async () => {
          if (index < chunks.length) {
            return { done: false, value: encoder.encode(chunks[index++]) };
          }
          if (breakWith) throw breakWith;
          return { done: true, value: undefined };
        },
      }),
    },
  };
}

function jsonResponse(status: number, body: unknown) {
  return { ok: status < 400, status, json: async () => body };
}

const USAGE = {
  limit: 3,
  used: 1,
  remaining: 2,
  resetAt: "2026-11-22T00:00:00.000Z",
  premium: false,
};

async function askTry(): Promise<AiClientError> {
  try {
    await streamAiTry({ lessonId: "t1", locale: "ru", prompt: PROMPT }, () => {});
  } catch (error) {
    if (error instanceof AiClientError) return error;
    throw error;
  }
  throw new Error("expected an error");
}

// Всё, что ушло в Sentry, одной строкой — проверить, что текстов и токена там нет.
function reportedText(): string {
  return JSON.stringify(
    mockCapture.mock.calls.map(([error, context]) => [
      error instanceof Error ? [error.name, error.message] : error,
      context,
    ]),
  );
}

beforeEach(() => {
  mockFetch.mockReset();
  mockGlobalFetch.mockReset();
  globalThis.fetch = mockGlobalFetch as unknown as typeof globalThis.fetch;
  mockCapture.mockReset();
  mockGetSession.mockReset();
  mockGetSession.mockResolvedValue({
    data: { session: { access_token: TOKEN } },
  });
});

afterAll(() => {
  globalThis.fetch = ORIGINAL_GLOBAL_FETCH;
});

describe("AI client errors", () => {
  it("streams the answer when everything works, nothing is reported", async () => {
    mockFetch.mockResolvedValue(
      streamResponse([
        `${JSON.stringify({ type: "meta", usage: USAGE })}\n{"type":"answer","te`,
        'xt":"Hi"}\n{"type":"done"}\n',
      ]),
    );
    const events: unknown[] = [];
    await streamAiTry({ lessonId: "t1", locale: "ru", prompt: PROMPT }, (event) =>
      events.push(event),
    );

    expect(events).toEqual([
      { type: "meta", usage: USAGE },
      { type: "answer", text: "Hi" },
      { type: "done" },
    ]);
    const [url, init] = mockFetch.mock.calls[0] ?? [];
    expect(url).toBe("https://api.example.test/api/ai/try");
    expect(init).toMatchObject({
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      credentials: "omit",
    });
    expect(mockGlobalFetch).not.toHaveBeenCalled();
    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("real connection failure (fetch failed) → network, reported as a warning", async () => {
    mockFetch.mockRejectedValue(
      new Error("fetch failed: The Internet connection appears to be offline."),
    );

    expect((await askTry()).code).toBe("network");
    expect(mockCapture).toHaveBeenCalledTimes(1);
    expect(mockCapture.mock.calls[0]?.[1]).toEqual({
      level: "warning",
      tags: {
        ai_operation: "try",
        ai_error_code: "network",
        transport: "expo",
        global_fetch: "other",
      },
      extra: {
        reasonName: "Error",
        reasonMessage: "fetch failed: The Internet connection appears to be offline.",
        reasonCode: undefined,
        causeName: undefined,
        causeMessage: undefined,
        causeCode: undefined,
        status: undefined,
      },
    });
  });

  it("any other error before the request → unexpected (not «no internet»), reported", async () => {
    mockFetch.mockRejectedValue(new TypeError("undefined is not a function"));

    const error = await askTry();
    expect(error.code).toBe("unexpected");
    expect(mockCapture.mock.calls[0]?.[1]).toMatchObject({
      level: "error",
      tags: { ai_operation: "try", ai_error_code: "unexpected" },
      extra: { reasonName: "TypeError", reasonMessage: "undefined is not a function" },
    });
  });

  it("a crash in our own code (session read) → unexpected, the request is never sent", async () => {
    mockGetSession.mockRejectedValue(new ReferenceError("window is not defined"));

    expect((await askTry()).code).toBe("unexpected");
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockCapture.mock.calls[0]?.[1]).toMatchObject({
      extra: { reasonName: "ReferenceError", reasonMessage: "window is not defined" },
    });
  });

  it("stream broken in the middle → network", async () => {
    mockFetch.mockResolvedValue(
      streamResponse(['{"type":"answer","text":"Hi"}\n'], new Error("connection lost")),
    );

    expect((await askTry()).code).toBe("network");
    expect(mockCapture.mock.calls[0]?.[1]).toMatchObject({
      tags: { ai_error_code: "network" },
      extra: { reasonMessage: "connection lost" },
    });
  });

  it("server answers with our error code (limit) → that code, not reported", async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(429, { error: "limit_reached", resetAt: USAGE.resetAt }),
    );

    const error = await askTry();
    expect(error.code).toBe("limit_reached");
    expect(error.resetAt).toBe(USAGE.resetAt);
    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("not our format (e.g. Vercel error page) → ai_unavailable, reported with HTTP status", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => {
        throw new SyntaxError(`JSON Parse error: ${PROMPT}`);
      },
    });

    const error = await askTry();
    expect(error.code).toBe("ai_unavailable");
    expect(mockCapture.mock.calls[0]?.[1]).toMatchObject({
      level: "error",
      tags: { ai_operation: "try", ai_error_code: "ai_unavailable" },
      extra: { status: 403 },
    });
  });

  it("broken JSON in a response: only the error name goes to Sentry", async () => {
    mockGlobalFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError(`JSON Parse error: Unexpected identifier "${PROMPT}"`);
      },
    });

    await expect(fetchAiUsage()).rejects.toMatchObject({ code: "unexpected" });
    expect(mockCapture.mock.calls[0]?.[1]).toMatchObject({
      tags: { ai_operation: "usage", transport: "global" },
      extra: { reasonName: "SyntaxError", reasonMessage: undefined },
    });
  });

  it("reports never contain the prompt or the token", async () => {
    mockFetch.mockRejectedValue(new Error("fetch failed: offline"));
    await askTry();
    mockFetch.mockRejectedValue(new TypeError("boom"));
    await askTry();
    mockFetch.mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {
        throw new SyntaxError(PROMPT);
      },
    });
    await askTry();

    expect(mockCapture).toHaveBeenCalledTimes(3);
    const text = reportedText();
    expect(text).not.toContain(PROMPT);
    expect(text).not.toContain(TOKEN);
  });

  it("native error details (code, cause) go to the report, without the token", async () => {
    // Так expo/fetch оборачивает ошибку iOS: FetchError «fetch failed: …» с cause и code.
    const cause = Object.assign(new Error("Не удалось завершить операцию. Ошибка протокола"), {
      code: "ERR_FETCH_NATIVE",
    });
    const failure = Object.assign(
      new Error("fetch failed: Не удалось завершить операцию. Ошибка протокола", { cause }),
      { code: "ERR_UNKNOWN" },
    );
    mockFetch.mockRejectedValue(failure);

    expect((await askTry()).code).toBe("network");
    expect(mockCapture.mock.calls[0]?.[1]).toMatchObject({
      tags: { transport: "expo" },
      extra: {
        reasonCode: "ERR_UNKNOWN",
        causeName: "Error",
        causeMessage: "Не удалось завершить операцию. Ошибка протокола",
        causeCode: "ERR_FETCH_NATIVE",
      },
    });
    expect(reportedText()).not.toContain(TOKEN);
  });

  it("the report says what globalThis.fetch really is (expo/fetch under the Sentry wrapper)", async () => {
    const expoBuiltin = Object.defineProperty(async () => undefined, Symbol.for("expo.builtin"), {
      value: true,
    });
    const sentryWrapper = Object.assign(
      (url: string, init: unknown) => mockGlobalFetch(url, init),
      { __sentry_original__: expoBuiltin },
    );
    globalThis.fetch = sentryWrapper as unknown as typeof globalThis.fetch;
    mockGlobalFetch.mockRejectedValue(new Error("fetch failed: offline"));

    await expect(fetchAiUsage()).rejects.toMatchObject({ code: "network" });
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockCapture.mock.calls[0]?.[1]).toMatchObject({
      tags: { ai_operation: "usage", transport: "global", global_fetch: "expo" },
    });
  });

  it("«Stop» pressed → cancelled, not reported", async () => {
    const controller = new AbortController();
    mockFetch.mockImplementation(async () => {
      controller.abort();
      throw new Error("fetch failed: The operation was aborted.");
    });

    await expect(
      streamAiTry({ lessonId: "t1", locale: "ru", prompt: PROMPT }, () => {}, controller.signal),
    ).rejects.toMatchObject({ code: "cancelled" });
    expect(mockCapture).not.toHaveBeenCalled();
  });
});

describe("AI request headers", () => {
  type SentInit = { headers: Record<string, string>; credentials?: string };

  // Параметры последнего запроса через этот fetch.
  function lastInit(fetchMock: typeof mockFetch): SentInit {
    return fetchMock.mock.calls.at(-1)?.[1] as SentInit;
  }

  const VALID_NAME = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
  const VALID_VALUE = /^[\x21-\x7E]([\x20-\x7E]*[\x21-\x7E])?$/;

  it("every header of usage (GET) and try (POST) is printable ASCII, no control characters", async () => {
    mockGlobalFetch.mockResolvedValue(jsonResponse(200, USAGE));
    await fetchAiUsage();
    const usageInit = lastInit(mockGlobalFetch);
    const usageHeaders = usageInit.headers;

    mockFetch.mockResolvedValue(streamResponse(['{"type":"done"}\n']));
    await streamAiTry({ lessonId: "t1", locale: "ru", prompt: PROMPT }, () => {});
    const tryInit = lastInit(mockFetch);
    const tryHeaders = tryInit.headers;

    // Cookie нашему API не нужны — ни в одном запросе.
    expect(usageInit.credentials).toBe("omit");
    expect(tryInit.credentials).toBe("omit");

    expect(Object.keys(usageHeaders)).toEqual(["Authorization"]);
    expect(Object.keys(tryHeaders).sort()).toEqual(["Authorization", "Content-Type"]);
    for (const [name, value] of [
      ...Object.entries(usageHeaders),
      ...Object.entries(tryHeaders),
    ]) {
      expect(name).toMatch(VALID_NAME);
      expect(value).toMatch(VALID_VALUE);
    }
    // Ни текста запроса, ни трассировки Sentry в заголовках.
    expect(JSON.stringify(tryHeaders)).not.toContain(PROMPT);
    const names = Object.keys(tryHeaders).map((name) => name.toLowerCase());
    for (const tracing of ["sentry-trace", "baggage", "traceparent"]) {
      expect(names).not.toContain(tracing);
    }
  });

  it.each([
    ["line break", `${TOKEN}\n`],
    ["trailing space", `${TOKEN} `],
    ["non-ASCII", `${TOKEN}ё`],
    ["control character", `${TOKEN}\u0000`],
  ])("broken token (%s) is never sent, the error is reported without the token", async (_, token) => {
    mockGetSession.mockResolvedValue({ data: { session: { access_token: token } } });

    expect((await askTry()).code).toBe("unexpected");
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockCapture.mock.calls[0]?.[1]).toMatchObject({
      extra: { reasonMessage: "invalid request header: Authorization" },
    });
    expect(reportedText()).not.toContain(TOKEN);
  });

  it("isValidHeader rejects bad names and values", () => {
    expect(isValidHeader("Authorization", "Bearer a.b.c")).toBe(true);
    expect(isValidHeader("X Test", "v")).toBe(false);
    expect(isValidHeader("", "v")).toBe(false);
    expect(isValidHeader("Х-Тест", "v")).toBe(false);
    expect(isValidHeader("X-Test", "")).toBe(false);
    expect(isValidHeader("X-Test", "a\r\nb")).toBe(false);
    expect(isValidHeader("X-Test", "привет")).toBe(false);
  });
});
