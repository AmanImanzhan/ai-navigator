import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";

import { Button } from "@/components/Button";
import { InfoCard } from "@/components/InfoCard";
import { showPurchaseMessage } from "@/components/premium/purchaseMessage";
import { refreshAiUsage } from "@/hooks/useAiUsage";
import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
import { track } from "@/lib/analytics";
import { formatDate } from "@/lib/date";
import { openManageSubscriptions, restorePurchases } from "@/lib/purchases";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

// Строка «AI Navigator Premium» в Настройках.
// Нет подписки — нажатие открывает экран подписки (там же «Восстановить покупки»).
// Есть — статус, дата продления или окончания, «Управлять подпиской» и «Восстановить покупки».
export function PremiumSettings() {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const { user } = useAuth();
  const { premium, expiresAt, willRenew, trial } = usePremium();
  const [busy, setBusy] = useState(false);

  if (!premium) {
    return (
      <InfoCard
        label={t("premium.rowLabel")}
        value={t("premium.rowInactive")}
        onPress={() => router.push({ pathname: "/paywall", params: { source: "settings" } })}
      />
    );
  }

  const date = expiresAt ? formatDate(expiresAt, language) : null;
  const status = trial ? t("premium.statusTrial") : t("premium.statusActive");
  const when = date
    ? willRenew
      ? t("premium.renewsOn", { date })
      : t("premium.endsOn", { date })
    : null;

  async function handleRestore() {
    setBusy(true);
    const result = await restorePurchases();
    setBusy(false);
    track("restore_purchases", {
      result:
        result.status === "restored"
          ? result.premium
            ? "restored"
            : "nothing"
          : "error",
    });
    if (result.status === "restored" && result.premium) {
      Alert.alert(t("premium.restoredTitle"), t("premium.restoredText"));
      if (user) refreshAiUsage(user.id);
      return;
    }
    showPurchaseMessage(t, result);
  }

  return (
    <View style={styles.list}>
      <InfoCard label={status} value={when ?? t("premium.rowInactive")} />
      <Button
        title={t("premium.manage")}
        variant="secondary"
        onPress={() => {
          openManageSubscriptions();
        }}
      />
      <Button
        title={t("premium.restore")}
        variant="ghost"
        disabled={busy}
        onPress={handleRestore}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.xs,
  },
});
