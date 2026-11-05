import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { ChoiceCard } from "@/components/ChoiceCard";
import { LANGUAGES, type LanguageCode } from "@/data/onboarding";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

// Первый экран: выбор языка.
// Заголовок и подпись не переводим — их видят ещё до выбора языка.
export default function LanguageSelect() {
  const { t } = useTranslation();
  const savedLanguage = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const [selected, setSelected] = useState<LanguageCode>(savedLanguage);

  function handleContinue() {
    setLanguage(selected);
    router.push("/welcome");
  }

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
        {/* Кнопка сразу на выбранном языке: Continue / Продолжить / Continuar. */}
        <Button
          title={t("common.continue", { lng: selected })}
          onPress={handleContinue}
        />
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
