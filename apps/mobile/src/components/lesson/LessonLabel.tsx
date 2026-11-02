import { StyleSheet, Text } from "react-native";

import { theme } from "@/theme";

type LessonLabelProps = {
  text: string;
};

// Маленькая оранжевая метка над карточкой: «Вот что получится», «Как сделать»…
export function LessonLabel({ text }: LessonLabelProps) {
  return <Text style={styles.label}>{text}</Text>;
}

const styles = StyleSheet.create({
  label: {
    ...theme.typography.label,
    color: theme.colors.accent,
    textTransform: "uppercase",
  },
});
