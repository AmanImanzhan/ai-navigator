import type { TFunction } from "i18next";
import { Alert } from "react-native";

import type { PurchaseErrorReason, PurchaseResult } from "@/lib/purchases";

const ERROR_KEYS = {
  network: "premium.errorNetwork",
  notAllowed: "premium.errorNotAllowed",
  productUnavailable: "premium.errorProductUnavailable",
  generic: "premium.errorGeneric",
} as const satisfies Record<PurchaseErrorReason, string>;

// Понятное сообщение после покупки или восстановления. Отмену человек сделал сам — молчим.
// Успех каждый экран показывает по-своему, поэтому здесь его нет.
export function showPurchaseMessage(t: TFunction, result: PurchaseResult): void {
  switch (result.status) {
    case "pending":
      Alert.alert(t("premium.pendingTitle"), t("premium.pendingText"));
      return;
    case "signInRequired":
      Alert.alert(t("premium.signInTitle"), t("premium.signInText"));
      return;
    case "unavailable":
      Alert.alert(t("premium.errorTitle"), t("premium.errorProductUnavailable"));
      return;
    case "error":
      Alert.alert(t("premium.errorTitle"), t(ERROR_KEYS[result.reason]));
      return;
    case "restored":
      if (!result.premium) {
        Alert.alert(t("premium.restoredNothingTitle"), t("premium.restoredNothingText"));
      }
      return;
    case "cancelled":
    case "purchased":
      return;
  }
}
