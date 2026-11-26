import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { LessonLabel } from "@/components/lesson/LessonLabel";
import type { ResultCard } from "@/data/lessons";
import { theme } from "@/theme";

type ResultCardViewProps = {
  card: ResultCard;
};

// Карточка «Вот что получится»: пример результата текстом в отдельной карточке.
// Картинок у уроков нет — поэтому без места под картинку, чтобы не было пустой рамки.
export function ResultCardView({ card }: ResultCardViewProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LessonLabel text={t("lesson.labels.result")} />
      <View testID="result-preview" style={styles.preview}>
        {card.title ? <Text style={styles.title}>{card.title}</Text> : null}
        <Text style={styles.text}>{card.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  preview: {
    gap: theme.spacing.xs,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
