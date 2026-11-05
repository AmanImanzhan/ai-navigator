import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { LessonLabel } from "@/components/lesson/LessonLabel";
import type { ResultCard } from "@/data/lessons";
import { theme } from "@/theme";

type ResultCardViewProps = {
  card: ResultCard;
};

const IMAGE_HEIGHT = 220;

// Карточка «Вот что получится»: картинка результата, заголовок и описание.
export function ResultCardView({ card }: ResultCardViewProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LessonLabel text={t("lesson.labels.result")} />
      {/* Место под картинку. Настоящую добавим позже. */}
      <View style={styles.image} />
      <Text style={styles.title}>{card.title}</Text>
      <Text style={styles.text}>{card.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  image: {
    height: IMAGE_HEIGHT,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.track,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
