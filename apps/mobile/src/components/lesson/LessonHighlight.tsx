import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

type LessonHighlightProps = {
  // Без заголовка — просто выделенный текст.
  title?: string;
  text: string;
};

// Выделенный блок: совет, формула урока.
export function LessonHighlight({ title, text }: LessonHighlightProps) {
  return (
    <View style={styles.box}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: theme.spacing.xxs,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSubtle,
  },
  title: {
    ...theme.typography.label,
    color: theme.colors.accent,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
