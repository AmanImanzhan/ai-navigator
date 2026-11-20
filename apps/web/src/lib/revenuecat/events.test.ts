import { describe, expect, it } from "vitest";

import { toSubscriptionChange, type RevenueCatEvent } from "@/lib/revenuecat/events";

// Событие RevenueCat → изменение подписки (чистая функция, без базы).

const USER = "3f0c1a6e-1b2c-4d5e-8f90-123456789abc";
const NOW = Date.UTC(2026, 10, 1);
const IN_MONTH = NOW + 30 * 24 * 60 * 60 * 1000;

function event(fields: Partial<RevenueCatEvent>): RevenueCatEvent {
  return {
    id: "evt-1",
    type: "INITIAL_PURCHASE",
    app_user_id: USER,
    product_id: "ainavigator_premium_yearly",
    entitlement_ids: ["premium"],
    period_type: "NORMAL",
    event_timestamp_ms: NOW,
    expiration_at_ms: IN_MONTH,
    environment: "PRODUCTION",
    ...fields,
  };
}

describe("toSubscriptionChange", () => {
  it.each([
    [{ type: "INITIAL_PURCHASE", period_type: "TRIAL" }, "trialing"],
    [{ type: "INITIAL_PURCHASE" }, "active"],
    [{ type: "RENEWAL" }, "active"],
    [{ type: "UNCANCELLATION" }, "active"],
    [{ type: "CANCELLATION", cancel_reason: "UNSUBSCRIBE" }, "cancelled"],
    [{ type: "BILLING_ISSUE", grace_period_expiration_at_ms: NOW + 1000 }, "grace_period"],
    [{ type: "EXPIRATION" }, "expired"],
  ] as const)("%o → %s", (fields, status) => {
    expect(toSubscriptionChange(event(fields))).toMatchObject({ kind: "update", status });
  });

  it("refund ends access immediately, not at the end of the period", () => {
    const change = toSubscriptionChange(
      event({ type: "CANCELLATION", cancel_reason: "CUSTOMER_SUPPORT" }),
    );
    expect(change).toMatchObject({
      kind: "update",
      status: "expired",
      expiresAt: new Date(NOW).toISOString(),
    });
  });

  it("missing environment is treated as PRODUCTION; SANDBOX is kept", () => {
    expect(toSubscriptionChange(event({ environment: null }))).toMatchObject({
      environment: "PRODUCTION",
    });
    expect(toSubscriptionChange(event({ environment: "SANDBOX" }))).toMatchObject({
      environment: "SANDBOX",
    });
  });

  it("uses the Supabase id among aliases, lower-cased", () => {
    expect(
      toSubscriptionChange(
        event({ app_user_id: "$RCAnonymousID:1", aliases: [USER.toUpperCase()] }),
      ),
    ).toMatchObject({ userId: USER });
  });

  it("ignores TEST events and events without an expiration", () => {
    expect(toSubscriptionChange(event({ type: "TEST" }))).toEqual({
      kind: "ignore",
      reason: "event_type",
    });
    expect(toSubscriptionChange(event({ expiration_at_ms: null }))).toEqual({
      kind: "ignore",
      reason: "no_expiration",
    });
  });
});
