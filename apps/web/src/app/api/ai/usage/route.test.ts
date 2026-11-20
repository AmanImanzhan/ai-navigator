import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/ai/usage/route";
import { signedInUser } from "@/test/ai";
import { createTestDb, type TestDb } from "@/test/db";
import { connectFakeSupabase, type Tokens } from "@/test/supabase";

// GET /api/ai/usage: сколько запросов осталось (без списания).

vi.mock("@supabase/supabase-js", async () => (await import("@/test/supabase")).supabaseModuleMock);
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

let testDb: TestDb;
const tokens: Tokens = {};

beforeAll(async () => {
  testDb = await createTestDb();
  connectFakeSupabase(testDb, tokens);
});

afterAll(async () => {
  await testDb.close();
});

function usageRequest(token?: string) {
  return new Request("http://localhost/api/ai/usage", {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
}

describe("GET /api/ai/usage", () => {
  it("without a token → 401", async () => {
    const response = await GET(usageRequest());
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "unauthorized" });
  });

  it("a token of a non-user role → 401", async () => {
    tokens["anon-token"] = { sub: "x", role: "anon" };
    expect((await GET(usageRequest("anon-token"))).status).toBe(401);
  });

  it("free user: 3 of 3 left, not cached, nothing spent", async () => {
    const user = await signedInUser(testDb, tokens);
    await GET(usageRequest(user.token));
    const response = await GET(usageRequest(user.token));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toMatchObject({
      limit: 3,
      used: 0,
      remaining: 3,
      premium: false,
    });
  });

  it("Premium user: limit 30", async () => {
    const user = await signedInUser(testDb, tokens);
    await testDb.run(
      "service",
      `insert into public.subscriptions (user_id, status, product_id, expires_at)
       values ($1, 'trialing', 'ainavigator_premium_yearly', now() + interval '3 days')`,
      [user.id],
    );
    expect(await (await GET(usageRequest(user.token))).json()).toMatchObject({
      limit: 30,
      remaining: 30,
      premium: true,
    });
  });
});
