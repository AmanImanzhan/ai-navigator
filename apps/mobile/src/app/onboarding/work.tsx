import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { ChoiceCard } from "@/components/ChoiceCard";
import { ProgressHeader } from "@/components/ProgressHeader";
import { OCCUPATIONS, type OccupationId } from "@/data/onboarding";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

// Онбординг, шаг 2: чем занимается пользователь.
export default function OnboardingWork() {
  const { t } = useTranslation();
  const savedOccupation = useAppStore((state) => state.occupation);
  const saveOccupation = useAppStore((state) => state.saveOccupation);
  // null — пока ничего не выбрано. Если уже отвечали — показываем прошлый ответ.
  const [selected, setSelected] = useState<OccupationId | null>(
    savedOccupation,
  );

  function handleNext() {
    if (selected === null) return;
    saveOccupation(selected);
    router.push("/onboarding/time");
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.top}>
        <ProgressHeader button="back" step={2} total={3} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("onboarding.work.title")}</Text>
          <Text style={styles.body}>{t("onboarding.work.body")}</Text>
        </View>

        <View style={styles.list} accessibilityRole="radiogroup">
          {OCCUPATIONS.map((occupation) => (
            <ChoiceCard
              key={occupation.id}
              icon={occupation.icon}
              title={t(`onboarding.work.options.${occupation.id}.title`)}
              subtitle={t(`onboarding.work.options.${occupation.id}.subtitle`)}
              selected={selected === occupation.id}
              onPress={() => setSelected(occupation.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          title={t("common.next")}
          disabled={selected === null}
          onPress={handleNext}
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
  actions: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
});
