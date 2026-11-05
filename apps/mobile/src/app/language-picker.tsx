import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { ChoiceCard } from "@/components/ChoiceCard";
import { LANGUAGES, type LanguageCode } from "@/data/onboarding";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

// Шторка выбора языка из Профиля. Язык меняется сразу во всём приложении.
export default function LanguagePicker() {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  function handleSelect(code: LanguageCode) {
    setLanguage(code);
    router.back();
  }

  return (
    <View style={styles.sheet}>
      <Text style={styles.title}>{t("profile.languagePickerTitle")}</Text>

      <View style={styles.list} accessibilityRole="radiogroup">
        {LANGUAGES.map((item) => (
          <ChoiceCard
            key={item.code}
            badge={item.badge}
            title={item.title}
            selected={language === item.code}
            onPress={() => handleSelect(item.code)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    backgroundColor: theme.colors.bg,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  list: {
    gap: theme.spacing.sm,
  },
});
