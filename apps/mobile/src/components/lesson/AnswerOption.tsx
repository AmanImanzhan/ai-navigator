import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

// default — обычный; correct — правильный; wrong — выбранный, но неверный.
export type AnswerState = "default" | "correct" | "wrong";

type AnswerOptionProps = {
  text: string;
  state: AnswerState;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
};

const ICON_CIRCLE_SIZE = 24;

const ICONS: Record<"correct" | "wrong", SymbolViewProps["name"]> = {
  correct: { ios: "checkmark", android: "check", web: "check" },
  wrong: { ios: "xmark", android: "close", web: "close" },
};

// Вариант ответа в карточке «Проверка».
export function AnswerOption({
  text,
  state,
  selected,
  disabled,
  onPress,
}: AnswerOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      style={({ pressed }) => [
        styles.base,
        containerStyles[state],
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.text}>{text}</Text>

      {state !== "default" ? (
        <View style={[styles.iconCircle, iconCircleStyles[state]]}>
          <SymbolView
            name={ICONS[state]}
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
  pressed: {
    backgroundColor: theme.colors.track,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});

// Рамка 1px у обычного и 2px у цветных — отступ компенсирует, чтобы текст не сдвигался.
const containerStyles = StyleSheet.create({
  default: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md + 1,
  },
  correct: {
    backgroundColor: theme.colors.successBg,
    borderWidth: 2,
    borderColor: theme.colors.success,
    padding: theme.spacing.md,
  },
  wrong: {
    backgroundColor: theme.colors.errorBg,
    borderWidth: 2,
    borderColor: theme.colors.error,
    padding: theme.spacing.md,
  },
});

const iconCircleStyles = StyleSheet.create({
  correct: { backgroundColor: theme.colors.success },
  wrong: { backgroundColor: theme.colors.error },
});
