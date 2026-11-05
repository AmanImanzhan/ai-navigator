import { StyleSheet, Text, View } from "react-native";

import { LessonLabel } from "@/components/lesson/LessonLabel";
import type { InfoCard } from "@/data/lessons";
import { theme } from "@/theme";

type InfoCardViewProps = {
  card: InfoCard;
};

// Карточка-объяснение без инструмента, например «Что важно знать».
export function InfoCardView({ card }: InfoCardViewProps) {
  return (
    <View style={styles.container}>
      <LessonLabel text={card.label} />
      {card.title ? <Text style={styles.title}>{card.title}</Text> : null}
      <Text style={styles.text}>{card.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
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
