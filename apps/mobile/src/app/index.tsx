import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { ChoiceCard } from "@/components/ChoiceCard";
import { theme } from "@/theme";

type Language = {
  code: "en" | "ru" | "es";
  badge: string;
  title: string;
  subtitle?: string;
};

type LanguageCode = Language["code"];

// Список языков. Сохранение и перевод приложения добавим позже через i18n.
const LANGUAGES: Language[] = [
  { code: "en", badge: "EN", title: "English" },
  { code: "ru", badge: "RU", title: "Русский", subtitle: "Russian" },
  { code: "es", badge: "ES", title: "Español", subtitle: "Spanish" },
];

// Первый экран: выбор языка.
export default function LanguageSelect() {
  const [selected, setSelected] = useState<LanguageCode>("en");

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose your language</Text>
        <Text style={styles.caption}>Выберите язык · Elige tu idioma</Text>
      </View>

      <View style={styles.list} accessibilityRole="radiogroup">
        {LANGUAGES.map((language) => (
          <ChoiceCard
            key={language.code}
            badge={language.badge}
            title={language.title}
            subtitle={language.subtitle}
            selected={selected === language.code}
            onPress={() => setSelected(language.code)}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <Button title="Continue" onPress={() => router.push("/welcome")} />
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
  header: {
    gap: theme.spacing.xs,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  list: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  actions: {
    paddingBottom: theme.spacing.md,
  },
});
