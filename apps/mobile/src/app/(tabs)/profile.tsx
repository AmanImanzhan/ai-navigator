import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { InfoCard } from "@/components/InfoCard";
import { LANGUAGES } from "@/data/onboarding";
import { useAuth, useAvailableProviders } from "@/hooks/useAuth";
import { getDisplayName } from "@/lib/auth";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

// Вкладка «Профиль»: аккаунт, ответы онбординга, прогресс и сброс данных.
export default function Profile() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const providers = useAvailableProviders();
  const language = useAppStore((state) => state.language);
  const occupation = useAppStore((state) => state.occupation);
  const minutesPerDay = useAppStore((state) => state.minutesPerDay);
  const completedCount = useAppStore((state) => state.completedLessons.length);
  const resetAll = useAppStore((state) => state.resetAll);

  // Превращаем сохранённые коды («ru», «office», 10) в понятный текст.
  const languageTitle =
    LANGUAGES.find((item) => item.code === language)?.title ?? "—";
  const occupationTitle = occupation
    ? t(`onboarding.work.options.${occupation}.title`)
    : t("profile.notSelected");

  // Имя есть не всегда (Apple отдаёт его только при первом входе) — тогда показываем почту.
  // Почта от Apple может быть скрытой (…@privaterelay.appleid.com) — это нормально.
  const displayName = user ? getDisplayName(user) : null;
  const email = user?.email ?? null;

  function handleSignOut() {
    Alert.alert(t("profile.signOutTitle"), t("profile.signOutMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("profile.signOut"), style: "destructive", onPress: signOut },
    ]);
  }

  // Сначала спрашиваем — чтобы не стереть всё случайным нажатием.
  // После сброса _layout сам откроет выбор языка: онбординг снова доступен.
  function handleReset() {
    Alert.alert(t("profile.resetTitle"), t("profile.resetMessage"), [
      { text: t("profile.resetCancel"), style: "cancel" },
      { text: t("profile.resetConfirm"), style: "destructive", onPress: resetAll },
    ]);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("profile.title")}</Text>

        {user ? (
          <View style={styles.cards}>
            <InfoCard
              label={t("profile.account")}
              value={displayName ?? email ?? t("profile.signedIn")}
            />
            {displayName && email ? (
              <InfoCard label={t("profile.email")} value={email} />
            ) : null}
          </View>
        ) : providers && providers.length > 0 ? (
          <InfoCard
            label={t("profile.account")}
            value={t("profile.signInPrompt")}
            accessibilityHint={t("profile.signInHint")}
            onPress={() => router.push("/save-progress")}
          />
        ) : null}

        <View style={styles.cards}>
          <InfoCard
            label={t("profile.language")}
            value={languageTitle}
            accessibilityHint={t("profile.languageHint")}
            onPress={() => router.push("/language-picker")}
          />
          <InfoCard label={t("profile.occupation")} value={occupationTitle} />
          <InfoCard
            label={t("profile.timePerDay")}
            value={t("common.minutes", { count: minutesPerDay })}
          />
          <InfoCard
            label={t("profile.completed")}
            value={t("profile.lessonsCount", { count: completedCount })}
          />
        </View>

        <View style={styles.actions}>
          {user ? (
            <Button
              title={t("profile.signOut")}
              variant="secondary"
              onPress={handleSignOut}
            />
          ) : null}
          <Button
            title={t("profile.reset")}
            variant="secondary"
            onPress={handleReset}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    flexGrow: 1,
    gap: theme.spacing.xl,
    padding: theme.spacing.xl,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  cards: {
    gap: theme.spacing.xs,
  },
  // Кнопки прижаты к низу экрана.
  actions: {
    gap: theme.spacing.xs,
    marginTop: "auto",
  },
});
