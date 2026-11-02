import { StyleSheet, Text, View } from "react-native";

import { LessonLabel } from "@/components/lesson/LessonLabel";
import type { ToolCard } from "@/data/lessons";
import { theme } from "@/theme";

type ToolCardViewProps = {
  card: ToolCard;
};

// Карточка «Какой инструмент»: название крупно и пояснение.
export function ToolCardView({ card }: ToolCardViewProps) {
  return (
    <View style={styles.container}>
      <LessonLabel text="Какой инструмент" />
      <Text style={styles.name}>{card.name}</Text>
      <Text style={styles.text}>{card.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  name: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
