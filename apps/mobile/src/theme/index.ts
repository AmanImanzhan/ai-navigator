import { colors } from "./colors";
import { radius, spacing } from "./spacing";
import { typography } from "./typography";

// Вся тема одним объектом: theme.colors.accent, theme.spacing.md и т.д.
export const theme = {
  colors,
  typography,
  spacing,
  radius,
} as const;

export { colors, radius, spacing, typography };
export type Theme = typeof theme;
