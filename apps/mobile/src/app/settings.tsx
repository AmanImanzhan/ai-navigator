import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SignInCard } from "@/components/auth/SignInCard";
import { BackHeader } from "@/components/BackHeader";
import { Button } from "@/components/Button";
import { ChoiceCard } from "@/components/ChoiceCard";
import { InfoCard } from "@/components/InfoCard";
import { ReminderSettings } from "@/components/settings/ReminderSettings";
import { DAILY_MINUTES, LANGUAGES } from "@/data/onboarding";
import { useAuth, useAvailableProviders } from "@/hooks/useAuth";
import { getDisplayName, isNetworkError } from "@/lib/auth";
import { resetReminders } from "@/lib/reminders";
import { resetAllData } from "@/lib/sync";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

// Настройки: язык, время в день, напоминания, аккаунт и сброс данных.
export default function Settings() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const providers = useAvailableProviders();
  const language = useAppStore((state) => state.language);
  const minutesPerDay = useAppStore((state) => state.minutesPerDay);
  const setMinutesPerDay = useAppStore((state) => state.setMinutesPerDay);

  const languageTitle =
    LANGUAGES.find((item) => item.code === language)?.title ?? "—";

  // Имя есть не всегда (Apple отдаёт его только при первом входе) — тогда показываем почту.
  // Почта от Apple может быть скрытой (…@privaterelay.appleid.com) — это нормально.
  const displayName = user ? getDisplayName(user) : null;
  const email = user?.email ?? null;

  // Выход: данные и напоминания на телефоне остаются.
  function handleSignOut() {
    Alert.alert(t("profile.signOutTitle"), t("profile.signOutMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("profile.signOut"), style: "destructive", onPress: signOut },
    ]);
  }

  // Сначала спрашиваем — чтобы не стереть всё случайным нажатием.
  // Вошедшего предупреждаем, что очистится и аккаунт.
  // После сброса _layout сам откроет выбор языка: онбординг снова доступен.
  function handleReset() {
    Alert.alert(
      t("profile.resetTitle"),
      user ? t("profile.resetMessageSignedIn") : t("profile.resetMessage"),
      [
        { text: t("profile.resetCancel"), style: "cancel" },
        {
          text: t("profile.resetConfirm"),
          style: "destructive",
          onPress: () => {
            resetData();
          },
        },
      ],
    );
  }

  // Аккаунт очистить не вышло (например, нет сети) — телефон не трогаем и говорим почему.
  // Получилось — заодно выключаем напоминания.
  async function resetData() {
    try {
      await resetAllData();
      await resetReminders();
    } catch (error) {
      Alert.alert(
        t("profile.resetErrorTitle"),
        isNetworkError(error) ? t("auth.errorNetwork") : t("auth.errorGeneric"),
      );
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackHeader fallback="/profile" />
        <Text style={styles.title}>{t("settings.title")}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.general")}</Text>
          <InfoCard
            label={t("profile.language")}
            value={languageTitle}
            accessibilityHint={t("profile.languageHint")}
            onPress={() => router.push("/language-picker")}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profile.timePerDay")}</Text>
          <View style={styles.list} accessibilityRole="radiogroup">
            {DAILY_MINUTES.map((option) => (
              <ChoiceCard
                key={option}
                title={t("common.minutes", { count: option })}
                subtitle={t(`onboarding.time.options.${option}`)}
                selected={minutesPerDay === option}
                onPress={() => setMinutesPerDay(option)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.reminders")}</Text>
          <ReminderSettings />
        </View>

        {user ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("profile.account")}</Text>
            <InfoCard
              label={t("profile.account")}
              value={displayName ?? email ?? t("profile.signedIn")}
            />
            {displayName && email ? (
              <InfoCard label={t("profile.email")} value={email} />
            ) : null}
            <Button
              title={t("profile.signOut")}
              variant="secondary"
              onPress={handleSignOut}
            />
            {/* Опасное действие — красным текстом, но без яркой кнопки. */}
            <Button
              title={t("deleteAccount.title")}
              variant="dangerText"
              onPress={() => router.push("/delete-account")}
            />
          </View>
        ) : providers && providers.length > 0 ? (
          <SignInCard />
        ) : null}

        <View style={styles.actions}>
          <Button
            title={t("profile.reset")}
            variant="ghost"
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
    gap: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  section: {
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  list: {
    gap: theme.spacing.sm,
  },
  actions: {
    marginTop: theme.spacing.md,
  },
});
