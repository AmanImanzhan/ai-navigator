import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

type InfoCardProps = {
  label: string;
  value: string;
  // Если передать onPress — карточку можно нажать, справа появится стрелка.
  onPress?: () => void;
  // Подсказка экранному диктору: что произойдёт при нажатии.
  accessibilityHint?: string;
};

// Карточка «название — значение», например «Язык — Русский».
export function InfoCard({
  label,
  value,
  onPress,
  accessibilityHint,
}: InfoCardProps) {
  const content = (
    <>
      <View style={styles.texts}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      {onPress ? (
        <SymbolView
          name={{
            ios: "chevron.right",
            android: "chevron_right",
            web: "chevron_right",
          }}
          size={16}
          weight="semibold"
          tintColor={theme.colors.textSecondary}
        />
      ) : null}
    </>
  );

  if (!onPress) {
    return (
      <View
        style={styles.card}
        accessible
        accessibilityLabel={`${label}: ${value}`}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  pressed: {
    backgroundColor: theme.colors.track,
  },
  texts: {
    flex: 1,
    gap: theme.spacing.xxs,
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
