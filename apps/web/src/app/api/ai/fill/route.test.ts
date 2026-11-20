import * as Sentry from "@sentry/nextjs";
import type { LanguageModel } from "ai";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/ai/fill/route";
import {
  aiRequest,
  failingModel,
  fillModel,
  seedContent,
  signedInUser,
  TEMPLATE_ID,
  usedToday,
} from "@/test/ai";
import { createTestDb, type TestDb } from "@/test/db";
import { connectFakeSupabase, type Tokens } from "@/test/supabase";

// POST /api/ai/fill: вход, лимит, возврат попытки, если ИИ не справился.

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

const GOOD_OUTPUT = {
  values: [
    { field: "recipient", value: "  my boss  " },
    { field: "topic", value: "a day off" },
  ],
  tip: "Mention the date.",
};

function fillRequest(token: string | undefined, situation = "I need a day off on Friday") {
  return aiRequest("/api/ai/fill", { templateId: TEMPLATE_ID, locale: "en", situation }, token);
}

describe("POST /api/ai/fill", () => {
  it("without a token → 401, the model is not called", async () => {
    const mock = fillModel(GOOD_OUTPUT);
    model.current = mock;
    const response = await POST(fillRequest(undefined));
    expect(response.status).toBe(401);
    expect(mock.doGenerateCalls).toHaveLength(0);
  });

  it("returns trimmed values for the template fields and spends one request", async () => {
    const user = await signedInUser(testDb, tokens);
    model.current = fillModel(GOOD_OUTPUT);
    const response = await POST(fillRequest(user.token));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      values: { recipient: "my boss", topic: "a day off" },
      tip: "Mention the date.",
      usage: expect.objectContaining({ limit: 3, used: 1, remaining: 2 }),
    });
    expect(await usedToday(testDb, user.id)).toBe(1);
  });

  it("limit reached → 429, the model is not called", async () => {
    const user = await signedInUser(testDb, tokens);
    model.current = fillModel(GOOD_OUTPUT);
    for (let i = 0; i < 3; i += 1) await POST(fillRequest(user.token));

    const mock = fillModel(GOOD_OUTPUT);
    model.current = mock;
    const response = await POST(fillRequest(user.token));
    expect(response.status).toBe(429);
    expect(mock.doGenerateCalls).toHaveLength(0);
  });

  it("provider error → 503 and the request is refunded, no user text in Sentry", async () => {
    const user = await signedInUser(testDb, tokens);
    const secret = "my private situation";
    model.current = failingModel(secret);
    const response = await POST(fillRequest(user.token, secret));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "ai_unavailable" });
    expect(await usedToday(testDb, user.id)).toBe(0);
    const sent = vi.mocked(Sentry.captureException).mock.calls.map(([error]) => String(error));
    expect(sent.join("\n")).not.toContain(secret);
  });

  it("answer not matching the schema → 503 and refund", async () => {
    const user = await signedInUser(testDb, tokens);
    model.current = fillModel({ values: [{ field: "unknown_field", value: "x" }], tip: "" });
    const response = await POST(fillRequest(user.token));
    expect(response.status).toBe(503);
    expect(await usedToday(testDb, user.id)).toBe(0);
  });

  it("model declined (content filter) → 422 and refund", async () => {
    const user = await signedInUser(testDb, tokens);
    model.current = fillModel(GOOD_OUTPUT, "content-filter");
    const response = await POST(fillRequest(user.token));
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({ error: "ai_declined" });
    expect(await usedToday(testDb, user.id)).toBe(0);
  });

  it("unknown template → 404, nothing is spent", async () => {
    const user = await signedInUser(testDb, tokens);
    const response = await POST(
      aiRequest("/api/ai/fill", { templateId: "nope", locale: "en", situation: "x" }, user.token),
    );
    expect(response.status).toBe(404);
    expect(await usedToday(testDb, user.id)).toBe(0);
  });
});
