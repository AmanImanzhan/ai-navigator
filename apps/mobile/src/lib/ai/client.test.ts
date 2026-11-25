import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import {
  fetchAiUsage,
  isValidHeader,
  requestAiFill,
  streamAiTry,
  type AiTryStreamEvent,
} from "@/lib/ai/client";
import { AiClientError } from "@/lib/ai/errors";
import { captureError } from "@/lib/monitoring";
import { FakeXhr, sentXhr } from "@/test/fakeXhr";

// Клиент ИИ поверх XMLHttpRequest: поток по кусочкам, честные коды ошибок, отчёт в Sentry
// без текста человека и токена. XHR, Supabase и Sentry подменены — без сети и ключей.

const TOKEN = "secret-access-token";
const PROMPT = "Напиши письмо начальнику про отпуск";

const mockGetSession = jest.fn<() => Promise<unknown>>();

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

// Согласие отправлять текст ИИ (store/useAiConsentStore). По умолчанию дано; без него — свои тесты.
const mockHasAiConsent = jest.fn<() => boolean>();

jest.mock("@/store/useAiConsentStore", () => ({
  hasAiConsent: () => mockHasAiConsent(),
}));

const mockCapture = jest.mocked(captureError);

const USAGE = {
  limit: 3,
  used: 1,
  remaining: 2,
  resetAt: "2026-11-22T00:00:00.000Z",
  premium: false,
};

const line = (value: unknown) => `${JSON.stringify(value)}\n`;

// Запустить «Попробуй сам»: события копятся в events, результат — в outcome.
function startTry(signal?: AbortSignal) {
  const events: AiTryStreamEvent[] = [];
  const outcome = streamAiTry(
    { lessonId: "t1", locale: "ru", prompt: PROMPT },
    (event) => events.push(event),
    signal,
  ).then(
    () => null,
    (error: unknown) => {
      if (error instanceof AiClientError) return error;
      throw error;
    },
  );
  return { events, outcome };
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
  FakeXhr.install();
  mockCapture.mockReset();
  mockGetSession.mockReset();
  mockGetSession.mockResolvedValue({ data: { session: { access_token: TOKEN } } });
  mockHasAiConsent.mockReturnValue(true);
});

afterEach(() => {
  jest.useRealTimers();
});

describe("streamAiTry over XHR", () => {
  it("streams events as chunks arrive, lines may be split between chunks", async () => {
    const { events, outcome } = startTry();
    const xhr = await sentXhr();

    expect(xhr.method).toBe("POST");
    expect(xhr.url).toBe("https://api.example.test/api/ai/try");
    expect(xhr.withCredentials).toBe(false);
    expect(JSON.parse(String(xhr.body))).toEqual({ lessonId: "t1", locale: "ru", prompt: PROMPT });

    xhr.respond(200).push(`${line({ type: "meta", usage: USAGE })}{"type":"answer","te`);
    expect(events).toEqual([{ type: "meta", usage: USAGE }]);

    xhr.push('xt":"Hi"}\n');
    expect(events).toHaveLength(2);

    xhr.finish('{"type":"done"}');
    expect(await outcome).toBeNull();
    expect(events).toEqual([
      { type: "meta", usage: USAGE },
      { type: "answer", text: "Hi" },
      { type: "done" },
    ]);
    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("connection fails before an answer → network, reported as a warning with transport xhr", async () => {
    const { outcome } = startTry();
    (await sentXhr()).fail();

    expect((await outcome)?.code).toBe("network");
    expect(mockCapture.mock.calls[0]?.[1]).toEqual({
      level: "warning",
      tags: { ai_operation: "try", ai_error_code: "network", transport: "xhr" },
      extra: {
        reasonName: "XhrNetworkError",
        reasonMessage: "xhr network error",
        reasonCode: undefined,
        causeName: undefined,
        causeMessage: undefined,
        causeCode: undefined,
        status: undefined,
      },
    });
  });

  it("connection lost in the middle → network, what came before is kept", async () => {
    const { events, outcome } = startTry();
    (await sentXhr()).respond(200).push(line({ type: "answer", text: "Hi" })).fail();

    expect((await outcome)?.code).toBe("network");
    expect(events).toEqual([{ type: "answer", text: "Hi" }]);
  });

  it("stream ended without done → network", async () => {
    const { outcome } = startTry();
    (await sentXhr()).respond(200).finish(line({ type: "answer", text: "Hi" }));

    expect((await outcome)?.code).toBe("network");
  });

  it("error event from the server stops the request with that code", async () => {
    const { events, outcome } = startTry();
    const xhr = await sentXhr();
    xhr
      .respond(200)
      .push(line({ type: "answer", text: "Hi" }) + line({ type: "error", error: "ai_unavailable" }));

    expect((await outcome)?.code).toBe("ai_unavailable");
    expect(events).toEqual([{ type: "answer", text: "Hi" }]);
    expect(xhr.done).toBe(true);
    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("limit reached (429 with our JSON) → limit_reached with resetAt, not reported", async () => {
    const { outcome } = startTry();
    (await sentXhr())
      .respond(429)
      .finish(JSON.stringify({ error: "limit_reached", resetAt: USAGE.resetAt }));

    const error = await outcome;
    expect(error?.code).toBe("limit_reached");
    expect(error?.resetAt).toBe(USAGE.resetAt);
    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("not our format (e.g. hosting error page) → ai_unavailable, reported with HTTP status", async () => {
    const { outcome } = startTry();
    (await sentXhr()).respond(403).finish("<html>Forbidden</html>");

    expect((await outcome)?.code).toBe("ai_unavailable");
    expect(mockCapture.mock.calls[0]?.[1]).toMatchObject({
      level: "error",
      tags: { ai_error_code: "ai_unavailable", transport: "xhr" },
      extra: { status: 403 },
    });
  });

  it("401 without our JSON → unauthorized", async () => {
    const { outcome } = startTry();
    (await sentXhr()).respond(401).finish("");

    expect((await outcome)?.code).toBe("unauthorized");
  });

  it("«Stop» → cancelled, the request is aborted, nothing reported", async () => {
    const controller = new AbortController();
    const { outcome } = startTry(controller.signal);
    const xhr = await sentXhr();

    controller.abort();

    expect((await outcome)?.code).toBe("cancelled");
    expect(xhr.done).toBe(true);
    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("no answer in time → timeout, the request is aborted", async () => {
    jest.useFakeTimers();
    const { outcome } = startTry();
    const xhr = await sentXhr();

    jest.advanceTimersByTime(40_000);

    expect((await outcome)?.code).toBe("timeout");
    expect(xhr.done).toBe(true);
  });

  it("silence between chunks longer than the idle timeout → timeout", async () => {
    jest.useFakeTimers();
    const { outcome } = startTry();
    const xhr = await sentXhr();

    xhr.respond(200).push(line({ type: "answer", text: "Hi" }));
    jest.advanceTimersByTime(24_000);
    expect(xhr.done).toBe(false);
    jest.advanceTimersByTime(1_000);

    expect((await outcome)?.code).toBe("timeout");
  });

  it("a crash in our own code (session read) → unexpected, the request is never sent", async () => {
    mockGetSession.mockRejectedValue(new ReferenceError("window is not defined"));
    const { outcome } = startTry();

    expect((await outcome)?.code).toBe("unexpected");
    expect(FakeXhr.instances).toHaveLength(0);
    expect(mockCapture.mock.calls[0]?.[1]).toMatchObject({
      extra: { reasonName: "ReferenceError", reasonMessage: "window is not defined" },
    });
  });

  it("reports never contain the prompt or the token", async () => {
    let run = startTry();
    (await sentXhr()).fail();
    await run.outcome;

    run = startTry();
    (await sentXhr()).respond(502).finish(PROMPT);
    await run.outcome;

    expect(mockCapture).toHaveBeenCalledTimes(2);
    const text = reportedText();
    expect(text).not.toContain(PROMPT);
    expect(text).not.toContain(TOKEN);
  });
});

describe("usage and fill over XHR", () => {
  it("usage: GET with the token, no body, no cookies", async () => {
    const promise = fetchAiUsage();
    const xhr = await sentXhr();
    xhr.respond(200).finish(JSON.stringify(USAGE));

    await expect(promise).resolves.toEqual(USAGE);
    expect(xhr.method).toBe("GET");
    expect(xhr.url).toBe("https://api.example.test/api/ai/usage");
    expect(xhr.body).toBeNull();
    expect(xhr.withCredentials).toBe(false);
  });

  it("usage: broken JSON → unexpected, only the error name goes to Sentry", async () => {
    const promise = fetchAiUsage();
    (await sentXhr()).respond(200).finish(`{"oops": ${PROMPT}`);

    await expect(promise).rejects.toMatchObject({ code: "unexpected" });
    expect(mockCapture.mock.calls[0]?.[1]).toMatchObject({
      tags: { ai_operation: "usage", transport: "xhr" },
      extra: { reasonName: "SyntaxError", reasonMessage: undefined },
    });
    expect(reportedText()).not.toContain(PROMPT);
  });

  it("fill: POST JSON, string values only", async () => {
    const request = { templateId: "tpl1", locale: "ru", situation: PROMPT } as Parameters<
      typeof requestAiFill
    >[0];
    const promise = requestAiFill(request);
    const xhr = await sentXhr();
    xhr
      .respond(200)
      .finish(JSON.stringify({ values: { a: "1", b: 2 }, tip: "Tip", usage: USAGE }));

    await expect(promise).resolves.toEqual({ values: { a: "1" }, tip: "Tip", usage: USAGE });
    expect(xhr.method).toBe("POST");
    expect(xhr.url).toBe("https://api.example.test/api/ai/fill");
    expect(JSON.parse(String(xhr.body))).toEqual(request);
  });
});

describe("AI request headers", () => {
  const VALID_NAME = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
  const VALID_VALUE = /^[\x21-\x7E]([\x20-\x7E]*[\x21-\x7E])?$/;

  it("every header of usage (GET) and try (POST) is printable ASCII, no control characters", async () => {
    const usage = fetchAiUsage();
    const usageXhr = await sentXhr();
    usageXhr.respond(200).finish(JSON.stringify(USAGE));
    await usage;

    const run = startTry();
    const tryXhr = await sentXhr();
    tryXhr.respond(200).finish(line({ type: "done" }));
    await run.outcome;

    expect(Object.keys(usageXhr.headers)).toEqual(["Authorization"]);
    expect(Object.keys(tryXhr.headers).sort()).toEqual(["Authorization", "Content-Type"]);
    for (const [name, value] of [
      ...Object.entries(usageXhr.headers),
      ...Object.entries(tryXhr.headers),
    ]) {
      expect(name).toMatch(VALID_NAME);
      expect(value).toMatch(VALID_VALUE);
    }
    // Ни текста запроса, ни трассировки Sentry в заголовках.
    expect(JSON.stringify(tryXhr.headers)).not.toContain(PROMPT);
    const names = Object.keys(tryXhr.headers).map((name) => name.toLowerCase());
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

    expect((await startTry().outcome)?.code).toBe("unexpected");
    expect(FakeXhr.instances).toHaveLength(0);
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

describe("without consent to send text to AI", () => {
  beforeEach(() => {
    mockHasAiConsent.mockReturnValue(false);
  });

  it("'Ask AI' sends nothing: no request, no token, consent_required", async () => {
    const { events, outcome } = startTry();
    const error = await outcome;

    expect(error?.code).toBe("consent_required");
    expect(FakeXhr.instances).toHaveLength(0);
    expect(mockGetSession).not.toHaveBeenCalled();
    expect(events).toEqual([]);
    // Это не сбой — в Sentry не сообщаем.
    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("'Fill in with the helper' sends nothing", async () => {
    const error = await requestAiFill({
      templateId: "1.1",
      locale: "en",
      situation: PROMPT,
    }).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(AiClientError);
    expect((error as AiClientError).code).toBe("consent_required");
    expect(FakeXhr.instances).toHaveLength(0);
    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("the remaining-requests counter still works: it sends no text", async () => {
    const usage = fetchAiUsage();
    const xhr = await sentXhr();
    expect(xhr.url).toBe("https://api.example.test/api/ai/usage");
    xhr.respond(200).finish(JSON.stringify(USAGE));
    await expect(usage).resolves.toEqual(USAGE);
  });
});
