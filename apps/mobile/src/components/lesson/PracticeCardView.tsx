import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { LessonHighlight } from "@/components/lesson/LessonHighlight";
import { LessonLabel } from "@/components/lesson/LessonLabel";
import { OpenToolButton } from "@/components/lesson/OpenToolButton";
import type { PracticeCard, ToolCard } from "@/data/lessons";
import { theme } from "@/theme";

type PracticeCardViewProps = {
  card: PracticeCard;
  tool?: ToolCard;
};

const COPIED_DURATION_MS = 2000;

// Карточка «Попробуй сам»: свой запрос, улучшенный запрос и кнопки.
export function PracticeCardView({ card, tool }: PracticeCardViewProps) {
  const [copied, setCopied] = useState(false);

  // Через 2 секунды возвращаем кнопке обычный текст.
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_DURATION_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    await Clipboard.setStringAsync(card.improvedPrompt);
    setCopied(true);
  }

  return (
    <View style={styles.container}>
      <LessonLabel text="Попробуй сам" />

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Вы пишете:</Text>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{card.userPrompt}</Text>
        </View>
      </View>

      <LessonHighlight title="Лучше так:" text={card.improvedPrompt} />

      <View style={styles.actions}>
        <Button
          title={copied ? "Скопировано" : "Скопировать запрос"}
          variant="secondary"
          onPress={handleCopy}
        />
        {tool ? <OpenToolButton tool={tool} /> : null}
      </View>

      <Text style={styles.tip}>
        Если буквы искажены: «{card.fixPrompt}»
      </Text>
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
  actions: {
    gap: theme.spacing.xs,
  },
  tip: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
