import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

type ChoiceCardProps = {
  title: string;
  subtitle?: string;
  badge: string;
  selected: boolean;
  onPress: () => void;
};

const BADGE_SIZE = 40;
const CHECK_SIZE = 24;

export function ChoiceCard({
  title,
  subtitle,
  badge,
  selected,
  onPress,
}: ChoiceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.unselected,
        pressed && !selected && styles.pressed,
      ]}
    >
      <View style={[styles.badge, selected && styles.badgeSelected]}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>

      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {selected ? (
        <View style={styles.check}>
          <SymbolView
            name={{ ios: "checkmark", android: "check", web: "check" }}
            size={14}
            weight="bold"
            tintColor={theme.colors.onAccent}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    borderRadius: theme.radius.lg,
  },
  // Рамка 1px, поэтому отступ на 1px больше — чтобы при выборе ничего не сдвигалось.
  unselected: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md + 1,
  },
  selected: {
    backgroundColor: theme.colors.accentSubtle,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    padding: theme.spacing.md,
  },
  pressed: {
    backgroundColor: theme.colors.track,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  // На выбранной карточке фон тоже accentSubtle, поэтому кружок делаем белым.
  badgeSelected: {
    backgroundColor: theme.colors.card,
  },
  badgeText: {
    ...theme.typography.label,
    color: theme.colors.accent,
  },
  texts: {
    flex: 1,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  check: {
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});
