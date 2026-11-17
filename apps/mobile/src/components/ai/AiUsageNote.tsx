import type { AiUsage } from "@ai-navigator/shared";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { getResetTime } from "@/lib/ai/format";
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
export function LimitReachedText({ resetAt }: { resetAt?: string }) {
  const { t } = useTranslation();
  const when = useResetText(resetAt);

  return (
    <View style={styles.reached}>
      <Text style={styles.reachedText}>
        {when
          ? t("ai.errors.limit_reached", { when })
          : t("ai.errors.limit_reached_soon")}
      </Text>
      {/* Подписка (позже): здесь появится кнопка «Больше запросов» — экран подписки и лимит
          для подписчиков на сервере (FREE_DAILY_LIMIT в apps/web/src/lib/ai/config.ts). */}
    </View>
  );
}

type AiUsageNoteProps = {
  usage: AiUsage | null;
};

// Ненавязчиво: «Осталось 3 из 5 сегодня». Запросы кончились — когда появятся новые.
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
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.track,
  },
  reachedText: {
    ...theme.typography.callout,
    color: theme.colors.text,
  },
});
