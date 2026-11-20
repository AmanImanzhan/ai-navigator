import * as Sentry from "@sentry/nextjs";
import type { LanguageModel } from "ai";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/ai/try/route";
import {
  aiRequest,
  failingModel,
  LESSON_ID,
  modelFailingMidStream,
  readEvents,
  seedContent,
  signedInUser,
  streamingModel,
  UNPUBLISHED_LESSON_ID,
  usedToday,
} from "@/test/ai";
import { createTestDb, type TestDb } from "@/test/db";
import { connectFakeSupabase, type Tokens } from "@/test/supabase";

// POST /api/ai/try: вход, лимит (списание до вызова ИИ), возврат попытки при сбое ИИ.

const model = vi.hoisted(() => ({ current: null as LanguageModel | null }));

vi.mock("@supabase/supabase-js", async () => (await import("@/test/supabase")).supabaseModuleMock);
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));
vi.mock("@/lib/ai/model", () => ({
  getAiModel: () => {
    if (!model.current) throw new Error("model not set");
    return model.current;
  },
}));

let testDb: TestDb;
const tokens: Tokens = {};

beforeAll(async () => {
  testDb = await createTestDb();
  await seedContent(testDb);
  connectFakeSupabase(testDb, tokens);
});

afterAll(async () => {
  await testDb.close();
});

beforeEach(() => {
  vi.mocked(Sentry.captureException).mockClear();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

const ANSWER = ["Dear boss, ", "I need a day off.", "[[REVIEW]]", "Good prompt: clear goal."];

function tryRequest(token: string | undefined, prompt = "Write an email to my boss") {
  return aiRequest("/api/ai/try", { lessonId: LESSON_ID, locale: "en", prompt }, token);
}

describe("POST /api/ai/try", () => {
  it("without a token → 401, the model is not called", async () => {
    const mock = streamingModel(ANSWER);
    model.current = mock;
    const response = await POST(tryRequest(undefined));
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "unauthorized" });
    expect(mock.doStreamCalls).toHaveLength(0);
  });

  it("with a forged token → 401", async () => {
    const response = await POST(tryRequest("forged.jwt.token"));
    expect(response.status).toBe(401);
  });

  it("streams the answer and the review, spends one request", async () => {
    const user = await signedInUser(testDb, tokens);
    model.current = streamingModel(ANSWER);
    const response = await POST(tryRequest(user.token));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/x-ndjson");
    const events = await readEvents(response);
    expect(events[0]).toMatchObject({ type: "meta", usage: { limit: 3, used: 1, remaining: 2 } });
    const text = (type: string) =>
      events
        .filter((event): event is { type: string; text: string } =>
          typeof event === "object" && event !== null && "type" in event && event.type === type,
        )
        .map((event) => event.text)
        .join("");
    expect(text("answer")).toBe("Dear boss, I need a day off.");
    expect(text("review")).toBe("Good prompt: clear goal.");
    expect(events.at(-1)).toEqual({ type: "done" });
    expect(await usedToday(testDb, user.id)).toBe(1);
  });

  it("limit reached → 429 with Retry-After, the model is not called", async () => {
    const user = await signedInUser(testDb, tokens);
    model.current = streamingModel(ANSWER);
    for (let i = 0; i < 3; i += 1) await readEvents(await POST(tryRequest(user.token)));

    const mock = streamingModel(ANSWER);
    model.current = mock;
    const response = await POST(tryRequest(user.token));
    expect(response.status).toBe(429);
    expect(await response.json()).toMatchObject({ error: "limit_reached" });
    expect(Number(response.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(mock.doStreamCalls).toHaveLength(0);
    expect(await usedToday(testDb, user.id)).toBe(3);
  });

  it("provider error before the answer → 503 and the request is refunded", async () => {
    const user = await signedInUser(testDb, tokens);
    const secret = "my secret prompt text";
    model.current = failingModel(secret);
    const response = await POST(tryRequest(user.token, secret));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "ai_unavailable" });
    expect(await usedToday(testDb, user.id)).toBe(0);

    // В Sentry — только тип ошибки и код, без текста запроса.
    const sent = vi.mocked(Sentry.captureException).mock.calls.map(([error]) => String(error));
    expect(sent.length).toBeGreaterThan(0);
    expect(sent.join("\n")).not.toContain(secret);
    expect(sent.join("\n")).toContain("AI_APICallError (529)");
  });

  it("provider fails mid-answer → error event and the request is refunded", async () => {
    const user = await signedInUser(testDb, tokens);
    model.current = modelFailingMidStream(["Dear boss, "]);
    const response = await POST(tryRequest(user.token));

    expect(response.status).toBe(200);
    const events = await readEvents(response);
    expect(events.at(-1)).toEqual({ type: "error", error: "ai_unavailable" });
    expect(await usedToday(testDb, user.id)).toBe(0);
  });

  it("unpublished lesson → 404, nothing is spent", async () => {
    const user = await signedInUser(testDb, tokens);
    const mock = streamingModel(ANSWER);
    model.current = mock;
    const response = await POST(
      aiRequest("/api/ai/try", { lessonId: UNPUBLISHED_LESSON_ID, locale: "en", prompt: "hi" }, user.token),
    );
    expect(response.status).toBe(404);
    expect(mock.doStreamCalls).toHaveLength(0);
    expect(await usedToday(testDb, user.id)).toBe(0);
  });

  it("empty or too long prompt → 400 / 413, nothing is spent", async () => {
    const user = await signedInUser(testDb, tokens);
    expect((await POST(tryRequest(user.token, "   "))).status).toBe(400);
    expect((await POST(tryRequest(user.token, "x".repeat(2001)))).status).toBe(413);
    expect(await usedToday(testDb, user.id)).toBe(0);
  });

  it("missing ANTHROPIC_API_KEY → 500 server_not_configured, nothing is spent", async () => {
    vi.resetModules();
    vi.doUnmock("@/lib/ai/model");
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    try {
      const { POST: freshPost } = await import("@/app/api/ai/try/route");
      const user = await signedInUser(testDb, tokens);
      const response = await freshPost(tryRequest(user.token));
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: "server_not_configured" });
      expect(await usedToday(testDb, user.id)).toBe(0);
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
