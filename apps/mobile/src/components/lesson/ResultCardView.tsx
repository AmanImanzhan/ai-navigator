import { StyleSheet, Text, View } from "react-native";

import type { ResultCard } from "@/data/lessons";
import { theme } from "@/theme";

type ResultCardViewProps = {
  card: ResultCard;
};

// Карточка result — вступление к уроку: вводный абзац без рамок и фона,
// перед ним жирная строка, если у карточки есть заголовок.
export function ResultCardView({ card }: ResultCardViewProps) {
  return (
    <View testID="lesson-lead" style={styles.container}>
      {card.title ? <Text style={styles.title}>{card.title}</Text> : null}
      <Text style={styles.text}>{card.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xxs,
  },
  title: {
    ...theme.typography.lead,
    fontWeight: theme.typography.headline.fontWeight,
    color: theme.colors.text,
  },
  text: {
    ...theme.typography.lead,
    color: theme.colors.text,
  },
});
