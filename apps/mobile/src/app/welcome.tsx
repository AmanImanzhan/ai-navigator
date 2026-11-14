import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { useAuth, useAvailableProviders } from "@/hooks/useAuth";
import { theme } from "@/theme";

// Приветствие: начать онбординг или войти в аккаунт, который уже есть.
export default function Welcome() {
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();
  const providers = useAvailableProviders();
  // Уже вошли или войти на этом телефоне нечем — кнопку входа не показываем.
  const canSignIn = !isSignedIn && providers !== null && providers.length > 0;

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.title}>{t("welcome.title")}</Text>
        <Text style={styles.body}>{t("welcome.body")}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title={t("welcome.start")}
          onPress={() => router.push("/onboarding/work")}
        />
        {/* Вход в аккаунт: если в нём уже пройден онбординг, приложение сразу откроет уроки. */}
        {canSignIn ? (
          <Button
            title={t("welcome.haveAccount")}
            variant="ghost"
            onPress={() =>
              router.push({
                pathname: "/save-progress",
                params: { mode: "signIn" },
              })
            }
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    paddingHorizontal: theme.spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  actions: {
    gap: theme.spacing.xs,
    paddingBottom: theme.spacing.md,
  },
});
