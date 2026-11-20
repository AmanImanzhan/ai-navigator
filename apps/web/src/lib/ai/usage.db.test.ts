import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { consumeAiRequest, readAiUsage, refundAiRequest } from "@/lib/ai/usage";
import { createTestDb, type TestDb } from "@/test/db";
import { fakeSupabase } from "@/test/supabase";

// Дневной лимит ИИ (3 без подписки / 30 с Premium) и статусы подписки —
// наш серверный код вместе с настоящими SQL-функциями из миграций.

let testDb: TestDb;

beforeAll(async () => {
  testDb = await createTestDb();
});

afterAll(async () => {
  await testDb.close();
});

async function newUser(): Promise<string> {
  const id = randomUUID();
  await testDb.createUser(id);
  return id;
}

function clientFor(userId: string) {
  return fakeSupabase(testDb, { user: userId });
}

const DAY_MS = 24 * 60 * 60 * 1000;

// Подписку пишет только сервер — как webhook (service_role).
async function setSubscription(userId: string, status: string, expiresInMs: number) {
  await testDb.run(
    "service",
    `insert into public.subscriptions (user_id, status, product_id, expires_at)
     values ($1, $2, 'ainavigator_premium_monthly', now() + $3 * interval '1 millisecond')
     on conflict (user_id) do update set status = excluded.status, expires_at = excluded.expires_at`,
    [userId, status, expiresInMs],
  );
}

async function hasPremium(userId: string): Promise<boolean> {
  const rows = await testDb.run<{ has_premium: boolean }>(
    "service",
    "select public.has_premium($1) as has_premium",
    [userId],
  );
  return rows[0]?.has_premium ?? false;
}

describe("AI daily limit", () => {
  it("free user: 3 requests a day, the 4th is refused", async () => {
    const db = clientFor(await newUser());
    const results = [];
    for (let i = 0; i < 4; i += 1) results.push(await consumeAiRequest(db));

    expect(results.map((result) => result.allowed)).toEqual([true, true, true, false]);
    expect(results.map((result) => result.usage.remaining)).toEqual([2, 1, 0, 0]);
    expect(results[3]?.usage).toMatchObject({ limit: 3, used: 3, premium: false });
  });

  it("resets at the next UTC midnight", async () => {
    const db = clientFor(await newUser());
    const result = await consumeAiRequest(db);
    const now = new Date();
    const nextMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
    expect(new Date(result.usage.resetAt).getTime()).toBe(nextMidnight);
  });

  it("Premium user: 30 requests a day", async () => {
    const userId = await newUser();
    await setSubscription(userId, "active", 30 * DAY_MS);
    const db = clientFor(userId);
    let last = await consumeAiRequest(db);
    for (let i = 1; i < 30; i += 1) last = await consumeAiRequest(db);
    expect(last).toMatchObject({ allowed: true, usage: { limit: 30, used: 30, remaining: 0 } });
    expect((await consumeAiRequest(db)).allowed).toBe(false);
  });

  it("refund gives the request back, but only once", async () => {
    const db = clientFor(await newUser());
    const first = await consumeAiRequest(db);
    if (!first.allowed) throw new Error("expected allowed");
    await refundAiRequest(db, first.reservationId);
    await refundAiRequest(db, first.reservationId);
    expect(await readAiUsage(db)).toMatchObject({ used: 0, remaining: 3 });
  });

  it("one user cannot refund another user's request", async () => {
    const owner = clientFor(await newUser());
    const stranger = clientFor(await newUser());
    const consumed = await consumeAiRequest(owner);
    if (!consumed.allowed) throw new Error("expected allowed");
    await refundAiRequest(stranger, consumed.reservationId);
    expect(await readAiUsage(owner)).toMatchObject({ used: 1 });
  });

  it("readAiUsage does not spend a request", async () => {
    const db = clientFor(await newUser());
    await readAiUsage(db);
    await readAiUsage(db);
    expect(await readAiUsage(db)).toMatchObject({ used: 0, remaining: 3, limit: 3 });
  });

  it("users without sign-in cannot spend requests", async () => {
    await expect(consumeAiRequest(fakeSupabase(testDb, "anon"))).rejects.toThrow(
      /consume_ai_request/,
    );
  });
});

describe("subscription status → Premium", () => {
  it.each([
    ["trialing", true],
    ["active", true],
    // Выключил автопродление — доступ до конца оплаченного периода.
    ["cancelled", true],
    // Оплата не прошла, Apple ещё пытается списать — доступ до конца льготного срока.
    ["grace_period", true],
    ["expired", false],
  ])("%s (period not over) → premium %s", async (status, premium) => {
    const userId = await newUser();
    await setSubscription(userId, status, DAY_MS);
    expect(await hasPremium(userId)).toBe(premium);
    expect((await readAiUsage(clientFor(userId))).limit).toBe(premium ? 30 : 3);
  });

  it.each(["trialing", "active", "cancelled", "grace_period"])(
    "%s with the period already over → no premium",
    async (status) => {
      const userId = await newUser();
      await setSubscription(userId, status, -60_000);
      expect(await hasPremium(userId)).toBe(false);
    },
  );

  it("no subscription row → no premium", async () => {
    expect(await hasPremium(await newUser())).toBe(false);
  });

  it("users cannot read has_premium or write subscriptions themselves", async () => {
    const userId = await newUser();
    await expect(
      testDb.run({ user: userId }, "select public.has_premium($1)", [userId]),
    ).rejects.toThrow(/permission denied/);
    await expect(
      testDb.run(
        { user: userId },
        `insert into public.subscriptions (user_id, status, product_id, expires_at)
         values ($1, 'active', 'x', now() + interval '1 year')`,
        [userId],
      ),
    ).rejects.toThrow(/permission denied|row-level security/);
  });
});
