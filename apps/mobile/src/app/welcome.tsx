import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { useAuth, useAvailableProviders } from "@/hooks/useAuth";
import { getDisplayName } from "@/lib/auth";
import { theme } from "@/theme";

// Приветствие: начать онбординг или войти в аккаунт, который уже есть.
export default function Welcome() {
  const { t } = useTranslation();
  const { user, isSignedIn } = useAuth();
  const providers = useAvailableProviders();
  // Уже вошли или войти на этом телефоне нечем — кнопку входа не показываем.
  const canSignIn = !isSignedIn && providers !== null && providers.length > 0;
  // Уже вошли (например, после «Сбросить данные» вход сохраняется) — говорим, в какой аккаунт,
  // чтобы на месте кнопки входа не было пустоты.
  const accountName = user
    ? (getDisplayName(user) ?? user.email ?? null)
    : null;

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Текст прокручивается, если не помещается (маленький экран, крупный шрифт),
          а кнопки всегда видны внизу. */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("welcome.title")}</Text>
        <Text style={styles.body}>{t("welcome.body")}</Text>
      </ScrollView>

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
        {accountName ? (
          <Text style={styles.signedIn}>
            {t("welcome.signedInAs", { name: accountName })}
          </Text>
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
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xl,
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
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  signedIn: {
    ...theme.typography.callout,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingVertical: theme.spacing.sm,
  },
});
