import type { TextStyle } from "react-native";

// Стили текста. fontFamily не задаём — так iOS использует системный SF Pro.
export const typography = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: "700" },
  title: { fontSize: 22, lineHeight: 28, fontWeight: "600" },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: "600" },
  body: { fontSize: 17, lineHeight: 24, fontWeight: "400" },
  callout: { fontSize: 15, lineHeight: 20, fontWeight: "400" },
  label: { fontSize: 13, lineHeight: 18, fontWeight: "500" },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" },
} as const satisfies Record<string, TextStyle>;

export type TypographyName = keyof typeof typography;
