import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { fetchAiUsage, streamAiTry } from "@/lib/ai/client";
import { AiClientError } from "@/lib/ai/errors";
import { captureError } from "@/lib/monitoring";

// Клиент ИИ: «нет сети» — только при настоящем сбое связи, остальное — «unexpected»
// и отчёт в Sentry с причиной, но без текста человека и токена.
// fetch из Expo, Supabase и Sentry подменены — без сети и ключей.

const TOKEN = "secret-access-token";
const PROMPT = "Напиши письмо начальнику про отпуск";

const mockFetch = jest.fn<(url: string, init: unknown) => Promise<unknown>>();
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
  mockCapture.mockReset();
  mockGetSession.mockReset();
  mockGetSession.mockResolvedValue({
    data: { session: { access_token: TOKEN } },
  });
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
    });
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
      tags: { ai_operation: "try", ai_error_code: "network" },
      extra: {
        reasonName: "Error",
        reasonMessage: "fetch failed: The Internet connection appears to be offline.",
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
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError(`JSON Parse error: Unexpected identifier "${PROMPT}"`);
      },
    });

    await expect(fetchAiUsage()).rejects.toMatchObject({ code: "unexpected" });
    expect(mockCapture.mock.calls[0]?.[1]).toMatchObject({
      tags: { ai_operation: "usage" },
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
