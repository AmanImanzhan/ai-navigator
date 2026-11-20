import type { AiUsage } from "@ai-navigator/shared";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { usePremium } from "@/hooks/usePremium";
import { getResetTime } from "@/lib/ai/format";
import { purchasesAvailable } from "@/lib/purchases";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

// «сегодня в 03:00» / «завтра в 03:00» — когда появятся новые запросы, по часам телефона.
// Не смогли разобрать дату — null.
export function useResetText(resetAt: string | undefined): string | null {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const reset = resetAt ? getResetTime(resetAt, language) : null;
  if (!reset) return null;
  return reset.day === "today"
    ? t("ai.usage.today", { time: reset.time })
    : t("ai.usage.tomorrow", { time: reset.time });
}

// Текст «лимит исчерпан» — спокойно, без давления: когда появятся новые запросы.
// Без подписки — ещё и кнопка «Больше запросов с Premium» (только на iPhone с покупками).
export function LimitReachedText({ resetAt }: { resetAt?: string }) {
  const { t } = useTranslation();
  const when = useResetText(resetAt);
  const { premium, checked } = usePremium();
  const showUpgrade = purchasesAvailable && checked && !premium;

  return (
    <View style={styles.reached}>
      <Text style={styles.reachedText}>
        {when
          ? t("ai.errors.limit_reached", { when })
          : t("ai.errors.limit_reached_soon")}
      </Text>
      {showUpgrade ? (
        <Button
          title={t("premium.moreRequests")}
          variant="secondary"
          onPress={() => router.push({ pathname: "/paywall", params: { source: "limit" } })}
        />
      ) : null}
    </View>
  );
}

type AiUsageNoteProps = {
  usage: AiUsage | null;
};

// Ненавязчиво: «Осталось 2 из 3 сегодня» (с подпиской — «из 30»; лимит присылает сервер).
// Запросы кончились — когда появятся новые.
export function AiUsageNote({ usage }: AiUsageNoteProps) {
  const { t } = useTranslation();
  if (!usage) return null;

  if (usage.remaining <= 0) return <LimitReachedText resetAt={usage.resetAt} />;

  return (
    <Text style={styles.left}>
      {t("ai.usage.left", { remaining: usage.remaining, limit: usage.limit })}
    </Text>
  );
}

const styles = StyleSheet.create({
  left: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  reached: {
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.track,
  },
  reachedText: {
    ...theme.typography.callout,
    color: theme.colors.text,
  },
});
