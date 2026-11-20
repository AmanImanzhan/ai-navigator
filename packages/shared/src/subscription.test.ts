import { describe, expect, it } from "vitest";

import { AI_DAILY_LIMITS, PREMIUM_ENTITLEMENT, PREMIUM_PRODUCTS } from "./subscription";

// Бизнес-правила подписки. Если число здесь поменялось — это решение о деньгах,
// а не случайная правка: тест напомнит обновить paywall, политику и App Store.
describe("subscription rules", () => {
  it("AI limits: 3 requests a day free, 30 with Premium", () => {
    expect(AI_DAILY_LIMITS).toEqual({ free: 3, premium: 30 });
  });

  it("entitlement and product ids match RevenueCat and App Store Connect", () => {
    expect(PREMIUM_ENTITLEMENT).toBe("premium");
    expect(PREMIUM_PRODUCTS).toEqual({
      monthly: "ainavigator_premium_monthly",
      yearly: "ainavigator_premium_yearly",
    });
  });
});
