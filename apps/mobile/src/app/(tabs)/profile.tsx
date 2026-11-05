import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { InfoCard } from "@/components/InfoCard";
import { DAILY_TIMES, LANGUAGES, OCCUPATIONS } from "@/data/onboarding";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

// Вкладка «Профиль»: ответы онбординга, прогресс и сброс данных.
export default function Profile() {
  const language = useAppStore((state) => state.language);
  const occupation = useAppStore((state) => state.occupation);
  const minutesPerDay = useAppStore((state) => state.minutesPerDay);
  const completedCount = useAppStore((state) => state.completedLessons.length);
  const resetAll = useAppStore((state) => state.resetAll);

  // Превращаем сохранённые коды («ru», «office», 10) в понятный текст.
  const languageTitle =
    LANGUAGES.find((item) => item.code === language)?.title ?? "—";
  const occupationTitle =
    OCCUPATIONS.find((item) => item.id === occupation)?.title ?? "Не выбрано";
  const timeTitle =
    DAILY_TIMES.find((item) => item.minutes === minutesPerDay)?.title ?? "—";

  // Сначала спрашиваем — чтобы не стереть всё случайным нажатием.
  // После сброса _layout сам откроет выбор языка: онбординг снова доступен.
  function handleReset() {
    Alert.alert(
      "Сбросить данные?",
      "Ответы и прогресс уроков удалятся, и приложение начнётся с выбора языка.",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Сбросить", style: "destructive", onPress: resetAll },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Профиль</Text>

        <View style={styles.cards}>
          <InfoCard label="Язык" value={languageTitle} />
          <InfoCard label="Занятие" value={occupationTitle} />
          <InfoCard label="Время в день" value={timeTitle} />
          <InfoCard label="Пройдено уроков" value={String(completedCount)} />
        </View>

        <View style={styles.actions}>
          <Button
            title="Сбросить данные"
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
