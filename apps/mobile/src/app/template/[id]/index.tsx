import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/BackHeader";
import { Button } from "@/components/Button";
import { CopyButton } from "@/components/CopyButton";
import { LessonHighlight } from "@/components/lesson/LessonHighlight";
import { OpenToolButton } from "@/components/lesson/OpenToolButton";
import { HighlightedPrompt } from "@/components/templates/HighlightedPrompt";
import { useTemplate } from "@/hooks/useTemplates";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

// Экран шаблона: для чего, запрос с подсвеченными полями, пример и кнопки.
export default function TemplateScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const template = useTemplate(id);
  const completedLessons = useAppStore((state) => state.completedLessons);

  // Шаблон закрытого урока сюда из списка не попадает; по прямой ссылке — показываем «не найден».
  if (!template || !completedLessons.includes(template.lessonId)) {
    return (
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <View style={styles.content}>
          <BackHeader fallback="/prompts" />
          <Text style={styles.notFound}>
            {template
              ? t("prompts.lockedAfter", { lesson: template.lessonId })
              : t("template.notFound")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackHeader fallback="/prompts" />
        <Text style={styles.title}>{template.title}</Text>

        <View style={styles.block}>
          <Text style={styles.label}>{t("template.purpose")}</Text>
          <Text style={styles.body}>{template.purpose}</Text>
        </View>

        {template.lessonNote ? (
          <LessonHighlight text={template.lessonNote} />
        ) : null}

        <View style={styles.block}>
          <Text style={styles.label}>{t("template.prompt")}</Text>
          <View style={styles.promptCard}>
            <HighlightedPrompt text={template.prompt} />
          </View>
          <Text style={styles.hint}>{t("template.fieldsHint")}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{t("template.example")}</Text>
          <Text style={styles.body}>{template.example}</Text>
        </View>

        <View style={styles.actions}>
          <Button
            title={t("template.fill")}
            onPress={() =>
              router.push({
                pathname: "/template/[id]/fill",
                params: { id: template.id },
              })
            }
          />
          <CopyButton text={template.prompt} />
          {template.tools.map((tool) => (
            <OpenToolButton key={tool.url} tool={tool} variant="secondary" />
          ))}
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
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  block: {
    gap: theme.spacing.xs,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.accent,
    textTransform: "uppercase",
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  promptCard: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  hint: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  actions: {
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  notFound: {
    ...theme.typography.title,
    color: theme.colors.text,
    textAlign: "center",
    paddingTop: theme.spacing.xxl,
  },
});
