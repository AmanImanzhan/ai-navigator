import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

type StatTone = "success" | "accent" | "warning";

type StatCardProps = {
  icon: SymbolViewProps["name"];
  value: string;
  label: string;
  tone: StatTone;
};

// Цвет иконки и числа + цвет фона для каждого тона.
const TONES: Record<StatTone, { color: string; background: string }> = {
  success: {
    color: theme.colors.success,
    background: theme.colors.successBg,
  },
  accent: {
    color: theme.colors.accent,
    background: theme.colors.accentSubtle,
  },
  warning: {
    color: theme.colors.warning,
    background: theme.colors.warningBg,
  },
};

// Маленькая карточка итога: иконка, число и подпись.
export function StatCard({ icon, value, label, tone }: StatCardProps) {
  const { color, background } = TONES[tone];

  return (
    <View
      style={[styles.card, { backgroundColor: background }]}
      accessible
      accessibilityLabel={`${value} ${label}`}
    >
      <SymbolView name={icon} size={20} tintColor={color} />
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    gap: theme.spacing.xxs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.radius.lg,
  },
  value: {
    ...theme.typography.title,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
