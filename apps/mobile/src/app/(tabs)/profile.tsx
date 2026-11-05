import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { InfoCard } from "@/components/InfoCard";
import { LANGUAGES } from "@/data/onboarding";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

// Вкладка «Профиль»: ответы онбординга, прогресс и сброс данных.
export default function Profile() {
  const { t } = useTranslation();
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
  // Кнопка прижата к низу экрана.
  actions: {
    marginTop: "auto",
  },
});
