import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { SignInButtons } from "@/components/auth/SignInButtons";
import { theme } from "@/theme";

// Карточка в Профиле для тех, кто не вошёл: зачем входить и кнопки входа.
export function SignInCard() {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.texts}>
        <Text style={styles.label}>{t("profile.account")}</Text>
        <Text style={styles.title}>{t("profile.signInPrompt")}</Text>
      </View>
      <SignInButtons />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  texts: {
    gap: theme.spacing.xxs,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
});
