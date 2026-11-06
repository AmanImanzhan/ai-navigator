import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/BackHeader";
import { Button } from "@/components/Button";
import { CopyButton } from "@/components/CopyButton";
import { HighlightedPrompt } from "@/components/templates/HighlightedPrompt";
import { fillTemplate, getTemplateFields } from "@/data/templates";
import { useTemplate } from "@/hooks/useTemplates";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

const SAVED_DURATION_MS = 2000;

// «[имя]» → «Имя» — подпись над полем ввода.
function fieldLabel(name: string): string {
  return name.charAt(0).toLocaleUpperCase() + name.slice(1);
}

// Заполнение шаблона: поле ввода на каждое [поле], ниже живой предпросмотр готового запроса.
export default function FillTemplateScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const template = useTemplate(id);
  const savePrompt = useAppStore((state) => state.savePrompt);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  // Через 2 секунды кнопка снова «Сохранить в мои».
  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), SAVED_DURATION_MS);
    return () => clearTimeout(timer);
  }, [saved]);

  if (!template) {
    return (
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <View style={styles.content}>
          <BackHeader />
          <Text style={styles.title}>{t("template.notFound")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Одинаковые поля ([имя] … [имя]) — одно поле ввода.
  const fields = getTemplateFields(template.prompt);
  const filled = fillTemplate(template.prompt, values);
  const hasAnyValue = fields.some((field) => values[field]?.trim());

  function handleSave() {
    if (!template) return;
    savePrompt(template.id, template.title, filled);
    setSaved(true);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* padding на обеих платформах: на Android приложение edge-to-edge, окно само не сжимается. */}
      <KeyboardAvoidingView style={styles.screen} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <BackHeader />
          <View style={styles.header}>
            <Text style={styles.title}>{t("template.fillTitle")}</Text>
            <Text style={styles.subtitle}>{template.title}</Text>
          </View>

          {fields.map((field) => (
            <View key={field} style={styles.field}>
              <Text style={styles.label}>{fieldLabel(field)}</Text>
              <TextInput
                value={values[field] ?? ""}
                onChangeText={(text) =>
                  setValues((current) => ({ ...current, [field]: text }))
                }
                placeholder={field}
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.input}
                multiline
                accessibilityLabel={fieldLabel(field)}
              />
            </View>
          ))}

          <View style={styles.field}>
            <Text style={styles.label}>{t("template.preview")}</Text>
            <View style={styles.preview}>
              <HighlightedPrompt text={filled} />
            </View>
          </View>

          {/* Кнопки внутри прокрутки — клавиатура их не закроет. */}
          <View style={styles.actions}>
            <CopyButton text={filled} variant="primary" />
            <Button
              title={saved ? t("template.saved") : t("template.save")}
              variant="secondary"
              disabled={!hasAnyValue}
              onPress={handleSave}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    gap: theme.spacing.xxs,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.callout,
    color: theme.colors.textSecondary,
  },
  field: {
    gap: theme.spacing.xs,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.text,
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.text,
    minHeight: 48,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    textAlignVertical: "top",
  },
  preview: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.accentSubtle,
  },
  actions: {
    gap: theme.spacing.xs,
  },
});
