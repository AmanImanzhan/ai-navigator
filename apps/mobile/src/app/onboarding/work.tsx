import { router } from "expo-router";
import type { SFSymbol } from "expo-symbols";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { ChoiceCard } from "@/components/ChoiceCard";
import { ProgressHeader } from "@/components/ProgressHeader";
import { theme } from "@/theme";

type Occupation = {
  id: "office" | "manager" | "business" | "student" | "retired";
  icon: SFSymbol;
  title: string;
  subtitle: string;
};

type OccupationId = Occupation["id"];

const OCCUPATIONS: Occupation[] = [
  {
    id: "office",
    icon: "briefcase",
    title: "Офис и администрирование",
    subtitle: "Документы, письма, таблицы",
  },
  {
    id: "manager",
    icon: "person.3",
    title: "Руковожу людьми",
    subtitle: "Встречи, задачи, отчёты",
  },
  {
    id: "business",
    icon: "storefront",
    title: "Своё дело",
    subtitle: "Реклама, клиенты, соцсети",
  },
  {
    id: "student",
    icon: "graduationcap",
    title: "Учусь",
    subtitle: "Конспекты, задания, языки",
  },
  {
    id: "retired",
    icon: "cup.and.saucer",
    title: "На пенсии",
    subtitle: "Общение, фото, безопасность",
  },
];

// Онбординг, шаг 2: чем занимается пользователь.
export default function OnboardingWork() {
  // null — пока ничего не выбрано.
  const [selected, setSelected] = useState<OccupationId | null>(null);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.top}>
        <ProgressHeader button="back" step={2} total={3} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Чем вы занимаетесь?</Text>
          <Text style={styles.body}>
            Подберём уроки и примеры под вашу жизнь
          </Text>
        </View>

        <View style={styles.list} accessibilityRole="radiogroup">
          {OCCUPATIONS.map((occupation) => (
            <ChoiceCard
              key={occupation.id}
              icon={occupation.icon}
              title={occupation.title}
              subtitle={occupation.subtitle}
              selected={selected === occupation.id}
              onPress={() => setSelected(occupation.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          title="Дальше"
          disabled={selected === null}
          onPress={() => router.push("/onboarding/time")}
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
