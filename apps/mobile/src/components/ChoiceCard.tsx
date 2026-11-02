import { SymbolView, type SFSymbol } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

type ChoiceCardProps = {
  title: string;
  subtitle?: string;
  // В кружке слева: короткий текст (badge) или иконка (icon). Если нет обоих — кружка нет.
  badge?: string;
  icon?: SFSymbol;
  selected: boolean;
  onPress: () => void;
};

const BADGE_SIZE = 40;
const ICON_SIZE = 20;
const CHECK_SIZE = 24;

export function ChoiceCard({
  title,
  subtitle,
  badge,
  icon,
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
      {icon || badge ? (
        <View style={[styles.badge, selected && styles.badgeSelected]}>
          {icon ? (
            <SymbolView
              name={icon}
              size={ICON_SIZE}
              tintColor={theme.colors.accent}
            />
          ) : (
            <Text style={styles.badgeText}>{badge}</Text>
          )}
        </View>
      ) : null}

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
