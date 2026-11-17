import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { useAvailableProviders } from "@/hooks/useAuth";
import { theme } from "@/theme";

// Для тех, кто не вошёл: мягко предлагаем войти вместо отправки запроса.
// Кнопка открывает шторку входа (save-progress) с объяснением, зачем нужен аккаунт.
export function AiSignInPrompt() {
  const { t } = useTranslation();
  const providers = useAvailableProviders();

  // На этом телефоне войти нельзя — тогда и предлагать нечего.
  if (providers !== null && providers.length === 0) {
    return <Text style={styles.text}>{t("auth.unavailable")}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t("ai.signIn.text")}</Text>
      <Button
        title={t("ai.signIn.button")}
        variant="secondary"
        onPress={() =>
          router.push({ pathname: "/save-progress", params: { mode: "ai" } })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  text: {
    ...theme.typography.callout,
    color: theme.colors.textSecondary,
  },
});
