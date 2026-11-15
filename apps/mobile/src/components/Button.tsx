import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "@/theme";

// Высота кнопки. Нужна и другим кнопкам (например, Apple), чтобы они стояли вровень.
// Это минимум: длинная подпись или крупный системный шрифт переносятся, а не обрезаются.
export const BUTTON_HEIGHT = 54;

// danger — подтверждение опасного действия (мягкий красный фон);
// dangerText — ссылка на опасное действие (только красный текст, без фона).
type ButtonVariant =
  "primary" | "secondary" | "ghost" | "danger" | "dangerText";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        containerStyles[variant],
        pressed && pressedStyles[variant],
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.title, titleStyles[variant]]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: BUTTON_HEIGHT,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...theme.typography.headline,
    textAlign: "center",
  },
  disabled: {
    opacity: 0.4,
  },
});

// Как выглядит кнопка в обычном состоянии.
const containerStyles = StyleSheet.create({
  primary: { backgroundColor: theme.colors.accent },
  secondary: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ghost: { backgroundColor: "transparent" },
  danger: { backgroundColor: theme.colors.errorBg },
  dangerText: { backgroundColor: "transparent" },
});

// Как кнопка слегка темнеет при нажатии.
const pressedStyles = StyleSheet.create({
  primary: { backgroundColor: theme.colors.accentPressed },
  secondary: { backgroundColor: theme.colors.track },
  ghost: { backgroundColor: theme.colors.accentSubtle },
  danger: { opacity: 0.8 },
  dangerText: { backgroundColor: theme.colors.errorBg },
});

const titleStyles = StyleSheet.create({
  primary: { color: theme.colors.onAccent },
  secondary: { color: theme.colors.text },
  ghost: { color: theme.colors.accent },
  danger: { color: theme.colors.error },
  dangerText: { color: theme.colors.error },
});
