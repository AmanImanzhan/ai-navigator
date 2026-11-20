import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/revenuecat/webhook/route";
import { createTestDb, type TestDb } from "@/test/db";
import { connectFakeSupabase } from "@/test/supabase";

// Webhook RevenueCat: проверка секрета, повторы, порядок событий, SANDBOX/PRODUCTION.
// Supabase подменён на PGlite с нашими миграциями — работают настоящие
// apply_subscription_event / apply_subscription_transfer.

vi.mock("@supabase/supabase-js", async () => (await import("@/test/supabase")).supabaseModuleMock);
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

const SECRET = "rc_webhook_test_secret";
const HOUR = 60 * 60 * 1000;
const T0 = Date.UTC(2026, 10, 1, 12);

let testDb: TestDb;

beforeAll(async () => {
  testDb = await createTestDb();
  connectFakeSupabase(testDb);
});

afterAll(async () => {
  await testDb.close();
});

beforeEach(() => {
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

type EventFields = Record<string, unknown> & { app_user_id: string };

function event(fields: EventFields) {
  return {
    id: randomUUID(),
    type: "INITIAL_PURCHASE",
    product_id: "ainavigator_premium_monthly",
    entitlement_ids: ["premium"],
    period_type: "NORMAL",
    event_timestamp_ms: T0,
    // Срок — в будущем, чтобы has_premium считал подписку действующей.
    expiration_at_ms: Date.now() + 30 * 24 * HOUR,
    environment: "PRODUCTION",
    ...fields,
  };
}

function send(body: unknown, authorization: string | null = `Bearer ${SECRET}`) {
  const headers = new Headers({ "content-type": "application/json" });
  if (authorization !== null) headers.set("authorization", authorization);
  return POST(
    new Request("http://localhost/api/revenuecat/webhook", {
      method: "POST",
      headers,
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

async function result(response: Response): Promise<unknown> {
  return ((await response.json()) as { result?: unknown }).result;
}

async function newUser(): Promise<string> {
  const id = randomUUID();
  await testDb.createUser(id);
  return id;
}

type Row = { status: string; environment: string; product_id: string };

async function subscription(userId: string): Promise<Row | undefined> {
  const rows = await testDb.run<Row>(
    "service",
    "select status, environment, product_id from public.subscriptions where user_id = $1",
    [userId],
  );
  return rows[0];
}

describe("POST /api/revenuecat/webhook — secret", () => {
  it.each([
    ["no header", null],
    ["wrong secret", "Bearer wrong"],
    ["secret without Bearer", SECRET],
    ["empty Bearer", "Bearer "],
  ])("%s → 401 and nothing is written", async (_name, header) => {
    const userId = await newUser();
    const response = await send({ event: event({ app_user_id: userId }) }, header);
    expect(response.status).toBe(401);
    expect(await subscription(userId)).toBeUndefined();
  });

  it("server without the secret configured → 500, nothing is written", async () => {
    vi.stubEnv("REVENUECAT_WEBHOOK_SECRET", "");
    const userId = await newUser();
    const response = await send({ event: event({ app_user_id: userId }) });
    vi.unstubAllEnvs();
    expect(response.status).toBe(500);
    expect(await subscription(userId)).toBeUndefined();
  });

  it("broken JSON or an event without required fields → 400", async () => {
    expect((await send("{not json")).status).toBe(400);
    expect((await send({ event: { type: "RENEWAL" } })).status).toBe(400);
  });
});

describe("POST /api/revenuecat/webhook — events", () => {
  it("purchase → active Premium", async () => {
    const userId = await newUser();
    const response = await send({ event: event({ app_user_id: userId }) });
    expect(response.status).toBe(200);
    expect(await result(response)).toBe("applied");
    expect(await subscription(userId)).toMatchObject({ status: "active" });
  });

  it("trial purchase → trialing", async () => {
    const userId = await newUser();
    await send({ event: event({ app_user_id: userId, period_type: "TRIAL" }) });
    expect(await subscription(userId)).toMatchObject({ status: "trialing" });
  });

  it("the same event twice is applied once", async () => {
    const userId = await newUser();
    const purchase = event({ app_user_id: userId });
    expect(await result(await send({ event: purchase }))).toBe("applied");

    // Между повторами подписка изменилась (отмена) — повтор покупки не должен её откатить.
    await send({
      event: event({ app_user_id: userId, type: "CANCELLATION", event_timestamp_ms: T0 + HOUR }),
    });
    const repeat = await send({ event: purchase });
    expect(repeat.status).toBe(200);
    expect(await result(repeat)).toBe("duplicate");
    expect(await subscription(userId)).toMatchObject({ status: "cancelled" });
  });

  it("an older event arriving late does not overwrite a newer one (last_event_at)", async () => {
    const userId = await newUser();
    const expired = event({ app_user_id: userId, type: "EXPIRATION", event_timestamp_ms: T0 + 2 * HOUR });
    const renewal = event({ app_user_id: userId, type: "RENEWAL", event_timestamp_ms: T0 + HOUR });

    expect(await result(await send({ event: expired }))).toBe("applied");
    expect(await result(await send({ event: renewal }))).toBe("stale");
    expect(await subscription(userId)).toMatchObject({ status: "expired" });
  });

  it("events in normal order are all applied", async () => {
    const userId = await newUser();
    await send({ event: event({ app_user_id: userId, period_type: "TRIAL" }) });
    await send({ event: event({ app_user_id: userId, type: "RENEWAL", event_timestamp_ms: T0 + HOUR }) });
    expect(await subscription(userId)).toMatchObject({ status: "active" });
    await send({ event: event({ app_user_id: userId, type: "BILLING_ISSUE", event_timestamp_ms: T0 + 2 * HOUR }) });
    expect(await subscription(userId)).toMatchObject({ status: "grace_period" });
    await send({ event: event({ app_user_id: userId, type: "EXPIRATION", event_timestamp_ms: T0 + 3 * HOUR }) });
    expect(await subscription(userId)).toMatchObject({ status: "expired" });
  });

  it.each(["SANDBOX", "PRODUCTION"])("%s purchase is stored with its environment", async (environment) => {
    const userId = await newUser();
    const response = await send({ event: event({ app_user_id: userId, environment }) });
    expect(response.status).toBe(200);
    expect(await subscription(userId)).toMatchObject({ status: "active", environment });
  });

  it("unknown environment value → 400", async () => {
    const userId = await newUser();
    const response = await send({ event: event({ app_user_id: userId, environment: "STAGING" }) });
    expect(response.status).toBe(400);
  });

  it("anonymous RevenueCat id and other products are ignored with 200", async () => {
    const anonymous = await send({ event: event({ app_user_id: "$RCAnonymousID:abc" }) });
    expect(anonymous.status).toBe(200);
    expect(await result(anonymous)).toBe("ignore:anonymous");

    const userId = await newUser();
    const other = await send({
      event: event({ app_user_id: userId, product_id: "other_app_product", entitlement_ids: [] }),
    });
    expect(await result(other)).toBe("ignore:not_premium");
    expect(await subscription(userId)).toBeUndefined();
  });

  it("deleted account → 200 unknown_user (RevenueCat must not retry forever)", async () => {
    const response = await send({ event: event({ app_user_id: randomUUID() }) });
    expect(response.status).toBe(200);
    expect(await result(response)).toBe("unknown_user");
  });

  it("transfer moves Premium to the new account and ends it for the old one", async () => {
    const oldUser = await newUser();
    const newOwner = await newUser();
    await send({ event: event({ app_user_id: oldUser }) });

    const response = await send({
      event: {
        id: randomUUID(),
        type: "TRANSFER",
        transferred_from: [oldUser],
        transferred_to: [newOwner],
        event_timestamp_ms: T0 + HOUR,
      },
    });
    expect(await result(response)).toBe("applied");
    expect(await subscription(oldUser)).toMatchObject({ status: "expired" });
    expect(await subscription(newOwner)).toMatchObject({ status: "active" });
  });
});
