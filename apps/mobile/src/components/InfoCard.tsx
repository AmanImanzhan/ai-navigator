import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

type InfoCardProps = {
  label: string;
  value: string;
};

// Карточка «название — значение», например «Язык — Русский».
export function InfoCard({ label, value }: InfoCardProps) {
  return (
    <View style={styles.card} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.xxs,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  value: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
});
