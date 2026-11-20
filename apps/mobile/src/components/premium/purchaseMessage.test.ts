import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { TFunction } from "i18next";
import { Alert } from "react-native";

import { showPurchaseMessage } from "@/components/premium/purchaseMessage";

// Что человек видит после покупки или восстановления.

const t = ((key: string) => key) as unknown as TFunction;

beforeEach(() => {
  jest.spyOn(Alert, "alert").mockImplementation(() => {});
});

function shown(): unknown[][] {
  return jest.mocked(Alert.alert).mock.calls.map((call) => call.slice(0, 2));
}

describe("showPurchaseMessage", () => {
  it("cancelled by the user or purchased → no alert", () => {
    showPurchaseMessage(t, { status: "cancelled" });
    showPurchaseMessage(t, { status: "purchased", premium: true });
    expect(shown()).toEqual([]);
  });

  it("restore with nothing to restore → explains it", () => {
    showPurchaseMessage(t, { status: "restored", premium: false });
    expect(shown()).toEqual([["premium.restoredNothingTitle", "premium.restoredNothingText"]]);
  });

  it("restore with Premium → no alert (the screen shows success itself)", () => {
    showPurchaseMessage(t, { status: "restored", premium: true });
    expect(shown()).toEqual([]);
  });

  it.each([
    ["network", "premium.errorNetwork"],
    ["notAllowed", "premium.errorNotAllowed"],
    ["productUnavailable", "premium.errorProductUnavailable"],
    ["generic", "premium.errorGeneric"],
  ] as const)("error %s → %s", (reason, text) => {
    showPurchaseMessage(t, { status: "error", reason });
    expect(shown()).toEqual([["premium.errorTitle", text]]);
  });

  it("pending (Ask to Buy) and sign-in required have their own texts", () => {
    showPurchaseMessage(t, { status: "pending" });
    showPurchaseMessage(t, { status: "signInRequired" });
    expect(shown()).toEqual([
      ["premium.pendingTitle", "premium.pendingText"],
      ["premium.signInTitle", "premium.signInText"],
    ]);
  });
});
