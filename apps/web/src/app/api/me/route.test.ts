import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/me/route";
import { signedInUser } from "@/test/ai";
import { createTestDb, type TestDb } from "@/test/db";
import { connectFakeSupabase, type Tokens } from "@/test/supabase";

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

describe("GET /api/me", () => {
  it("without a token → 401", async () => {
    expect((await GET(new Request("http://localhost/api/me"))).status).toBe(401);
  });

  it("returns only the caller's id", async () => {
    const user = await signedInUser(testDb, tokens);
    const response = await GET(
      new Request("http://localhost/api/me", { headers: { authorization: `Bearer ${user.token}` } }),
    );
    expect(await response.json()).toEqual({ id: user.id, email: null });
  });

  it("server without Supabase settings → 500 server_not_configured", async () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const response = await GET(
        new Request("http://localhost/api/me", { headers: { authorization: "Bearer x" } }),
      );
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: "server_not_configured" });
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
