import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { ChoiceCard } from "@/components/ChoiceCard";
import { ProgressHeader } from "@/components/ProgressHeader";
import { DAILY_MINUTES, type DailyMinutes } from "@/data/onboarding";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

// Онбординг, шаг 3: сколько времени в день и напоминание.
export default function OnboardingTime() {
  const { t } = useTranslation();
  const savedMinutes = useAppStore((state) => state.minutesPerDay);
  const savedReminder = useAppStore((state) => state.reminderEnabled);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [minutes, setMinutes] = useState<DailyMinutes>(savedMinutes);
  const [remind, setRemind] = useState(savedReminder);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.top}>
        <ProgressHeader button="back" step={3} total={3} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("onboarding.time.title")}</Text>
          <Text style={styles.body}>{t("onboarding.time.body")}</Text>
        </View>

        <View style={styles.list} accessibilityRole="radiogroup">
          {DAILY_MINUTES.map((option) => (
            <ChoiceCard
              key={option}
              title={t("common.minutes", { count: option })}
              subtitle={t(`onboarding.time.options.${option}`)}
              selected={minutes === option}
              onPress={() => setMinutes(option)}
            />
          ))}
        </View>

        <View style={styles.reminder}>
          <View style={styles.reminderTexts}>
            <Text style={styles.reminderTitle}>
              {t("onboarding.time.reminderTitle")}
            </Text>
            <Text style={styles.reminderSubtitle}>
              {t("onboarding.time.reminderSubtitle")}
            </Text>
          </View>
          <Switch
            value={remind}
            onValueChange={setRemind}
            trackColor={{ false: theme.colors.track, true: theme.colors.accent }}
            ios_backgroundColor={theme.colors.track}
            accessibilityLabel={t("onboarding.time.reminderTitle")}
          />
        </View>
      </ScrollView>

      <View style={styles.actions}>
        {/* Переход на /home делает _layout: после onboardingDone онбординг закрыт. */}
        <Button
          title={t("common.done")}
          onPress={() => completeOnboarding(minutes, remind)}
        />
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
