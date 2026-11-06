import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { CopyButton } from "@/components/CopyButton";
import { LessonHighlight } from "@/components/lesson/LessonHighlight";
import { LessonLabel } from "@/components/lesson/LessonLabel";
import { OpenToolButton } from "@/components/lesson/OpenToolButton";
import { ShareButton } from "@/components/lesson/ShareButton";
import type { PracticeCard, ToolLink } from "@/data/lessons";
import { theme } from "@/theme";

type PracticeCardViewProps = {
  card: PracticeCard;
  tool?: ToolLink;
};

// Карточка «Попробуй сам»: свой запрос, улучшенный запрос и кнопки.
// Каждая часть необязательна — показываем только то, что есть в уроке.
export function PracticeCardView({ card, tool }: PracticeCardViewProps) {
  const { t } = useTranslation();
  const { userPrompt, improvedLabel, improvedPrompt, share, followUp, note } =
    card;

  return (
    <View style={styles.container}>
      <LessonLabel text={t("lesson.labels.practice")} />

      {userPrompt ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>
            {t("lesson.practice.youWrite")}
          </Text>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{userPrompt}</Text>
          </View>
        </View>
      ) : null}

      {improvedPrompt ? (
        <LessonHighlight
          title={improvedLabel ?? t("lesson.practice.better")}
          text={improvedPrompt}
        />
      ) : null}

      {note ? <Text style={styles.note}>{note}</Text> : null}

      {improvedPrompt || share || tool ? (
        <View style={styles.actions}>
          {share ? <ShareButton action={share} /> : null}
          {improvedPrompt ? (
            <CopyButton
              text={improvedPrompt}
              title={t("lesson.practice.copy")}
            />
          ) : null}
          {tool ? <OpenToolButton tool={tool} /> : null}
        </View>
      ) : null}

      {followUp ? (
        <Text style={styles.tip}>
          {t("lesson.practice.followUp", {
            hint: followUp.hint,
            prompt: followUp.prompt,
          })}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  block: {
    gap: theme.spacing.xs,
  },
  blockTitle: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
  },
  bubble: {
    alignSelf: "flex-start",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.track,
  },
  bubbleText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  note: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  actions: {
    gap: theme.spacing.xs,
  },
  tip: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
