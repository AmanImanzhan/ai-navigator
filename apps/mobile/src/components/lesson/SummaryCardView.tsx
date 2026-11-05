import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { LessonHighlight } from "@/components/lesson/LessonHighlight";
import { LessonLabel } from "@/components/lesson/LessonLabel";
import type { SummaryCard } from "@/data/lessons";
import { theme } from "@/theme";

type SummaryCardViewProps = {
  card: SummaryCard;
};

// Карточка «Готово»: формула урока.
export function SummaryCardView({ card }: SummaryCardViewProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LessonLabel text={t("lesson.labels.summary")} />
      <LessonHighlight title={t("lesson.labels.formula")} text={card.formula} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
});
