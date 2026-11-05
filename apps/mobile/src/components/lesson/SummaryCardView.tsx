import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { LessonHighlight } from "@/components/lesson/LessonHighlight";
import { LessonLabel } from "@/components/lesson/LessonLabel";
import type { SummaryCard } from "@/data/lessons";
import { theme } from "@/theme";

type SummaryCardViewProps = {
  card: SummaryCard;
};

// Карточка «Готово»: формула урока и, если есть, вывод после неё.
export function SummaryCardView({ card }: SummaryCardViewProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LessonLabel text={t("lesson.labels.summary")} />
      <LessonHighlight title={t("lesson.labels.formula")} text={card.formula} />
      {card.text ? <Text style={styles.text}>{card.text}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
