// Цвета приложения. В экранах используем только эти имена, а не hex-коды.
export const colors = {
  bg: "#F8F5F0",
  card: "#FFFFFF",
  accent: "#D85A30",
  accentPressed: "#BF4E28",
  accentSubtle: "#FBEAE3",
  onAccent: "#FFFFFF",
  text: "#2A1E18",
  textSecondary: "#6E625B",
  border: "#ECE5DC",
  success: "#2F7D4A",
  successBg: "#E7F3E9",
  error: "#C0392B",
  errorBg: "#FBEAEA",
  warning: "#9A6A12",
  warningBg: "#FDF2DD",
  track: "#EFE8E0",
} as const;

export type ColorName = keyof typeof colors;
