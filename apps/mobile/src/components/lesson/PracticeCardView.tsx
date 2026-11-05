import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
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

const COPIED_DURATION_MS = 2000;

// Карточка «Попробуй сам»: свой запрос, улучшенный запрос и кнопки.
// Каждая часть необязательна — показываем только то, что есть в уроке.
export function PracticeCardView({ card, tool }: PracticeCardViewProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const { userPrompt, improvedLabel, improvedPrompt, share, followUp, note } =
    card;

  // Через 2 секунды возвращаем кнопке обычный текст.
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_DURATION_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    if (!improvedPrompt) return;
    await Clipboard.setStringAsync(improvedPrompt);
    setCopied(true);
  }

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
            <Button
              title={
                copied ? t("lesson.practice.copied") : t("lesson.practice.copy")
              }
              variant="secondary"
              onPress={handleCopy}
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
