import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { refreshAiUsage, useAiUsage } from "@/hooks/useAiUsage";
import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
import {
  purchasesAvailable,
  purchasePremium,
  restorePurchases,
  type PurchaseResult,
} from "@/lib/purchases";
import { theme } from "@/theme";

// ВРЕМЕННО, только в разработке (__DEV__): проверить покупку в Sandbox до экрана подписки
// (Задача 31). Тексты без перевода — пользователи эту панель не видят.
export function PremiumDevPanel() {
  const { user } = useAuth();
  const { premium, expiresAt, checked, refresh } = usePremium();
  const usage = useAiUsage();
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<PurchaseResult>) {
    setBusy(true);
    const result = await action();
    setBusy(false);
    // Сервер узнаёт о покупке из webhook через несколько секунд — спрашиваем лимит позже.
    if (user) setTimeout(() => refreshAiUsage(user.id), 5000);
    Alert.alert(
      "RevenueCat",
      result.status === "error"
        ? `error: ${result.error instanceof Error ? result.error.message : String(result.error)}`
        : JSON.stringify(result),
    );
  }

  const status = !purchasesAvailable
    ? "покупки недоступны (нет EXPO_PUBLIC_REVENUECAT_IOS_KEY или не iOS)"
    : !checked
      ? "проверяем…"
      : premium
        ? `Premium до ${expiresAt ?? "—"}`
        : "нет подписки";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Подписка (тест, только в разработке)</Text>
      <Text style={styles.text}>RevenueCat: {status}</Text>
      <Text style={styles.text}>
        Сервер:{" "}
        {usage
          ? `${usage.premium ? "premium" : "free"}, осталось ${usage.remaining} из ${usage.limit}`
          : user
            ? "нет ответа"
            : "войдите в аккаунт"}
      </Text>
      <Button
        title="Тест: купить месяц"
        variant="secondary"
        disabled={busy}
        onPress={() => run(() => purchasePremium("monthly"))}
      />
      <Button
        title="Тест: восстановить"
        variant="secondary"
        disabled={busy}
        onPress={() => run(restorePurchases)}
      />
      <Button
        title="Обновить статус"
        variant="ghost"
        disabled={busy}
        onPress={() => {
          refresh();
          if (user) refreshAiUsage(user.id);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  text: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
