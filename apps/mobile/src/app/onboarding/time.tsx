import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { ChoiceCard } from "@/components/ChoiceCard";
import { ProgressHeader } from "@/components/ProgressHeader";
import { theme } from "@/theme";

type DailyTime = {
  minutes: 5 | 10 | 15;
  title: string;
  subtitle: string;
};

type DailyMinutes = DailyTime["minutes"];

const DAILY_TIMES: DailyTime[] = [
  { minutes: 5, title: "5 минут", subtitle: "Лёгкий старт · 1 урок в день" },
  {
    minutes: 10,
    title: "10 минут",
    subtitle: "Обычный темп · урок и практика",
  },
  {
    minutes: 15,
    title: "15 минут",
    subtitle: "Быстрый прогресс · 2 урока в день",
  },
];

// Онбординг, шаг 3: сколько времени в день и напоминание.
export default function OnboardingTime() {
  const [minutes, setMinutes] = useState<DailyMinutes>(10);
  const [remind, setRemind] = useState(true);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.top}>
        <ProgressHeader button="back" step={3} total={3} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Сколько времени в день?</Text>
          <Text style={styles.body}>
            Один урок занимает 5–7 минут. Это можно поменять в любой момент
          </Text>
        </View>

        <View style={styles.list} accessibilityRole="radiogroup">
          {DAILY_TIMES.map((time) => (
            <ChoiceCard
              key={time.minutes}
              title={time.title}
              subtitle={time.subtitle}
              selected={minutes === time.minutes}
              onPress={() => setMinutes(time.minutes)}
            />
          ))}
        </View>

        <View style={styles.reminder}>
          <View style={styles.reminderTexts}>
            <Text style={styles.reminderTitle}>Напоминать в 19:00</Text>
            <Text style={styles.reminderSubtitle}>Одно уведомление в день</Text>
          </View>
          <Switch
            value={remind}
            onValueChange={setRemind}
            trackColor={{ false: theme.colors.track, true: theme.colors.accent }}
            ios_backgroundColor={theme.colors.track}
            accessibilityLabel="Напоминать в 19:00"
          />
        </View>
      </ScrollView>

      <View style={styles.actions}>
        {/* replace, а не push: назад в онбординг вернуться нельзя. */}
        <Button title="Готово" onPress={() => router.replace("/home")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  top: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xs,
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.xl,
  },
  header: {
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  list: {
    gap: theme.spacing.sm,
  },
  reminder: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  reminderTexts: {
    flex: 1,
  },
  reminderTitle: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  reminderSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  actions: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
});
