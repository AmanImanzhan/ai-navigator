import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { PromptTemplate } from "@/data/templates";
import { theme } from "@/theme";

type TemplateRowProps = {
  template: PromptTemplate;
  locked: boolean;
  onPress: () => void;
};

// Строка шаблона в списке. Закрытый шаблон — с замком и подписью «Откроется после урока N».
export function TemplateRow({ template, locked, onPress }: TemplateRowProps) {
  const { t } = useTranslation();
  const subtitle = locked
    ? t("prompts.lockedAfter", { lesson: template.lessonId })
    : template.purpose;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${template.title}. ${subtitle}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.texts}>
        <Text style={[styles.title, locked && styles.titleLocked]}>
          {template.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>

      <SymbolView
        name={
          locked
            ? { ios: "lock.fill", android: "lock", web: "lock" }
            : {
                ios: "chevron.right",
                android: "chevron_right",
                web: "chevron_right",
              }
        }
        size={16}
        weight="semibold"
        tintColor={theme.colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  pressed: {
    backgroundColor: theme.colors.track,
  },
  texts: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  titleLocked: {
    color: theme.colors.textSecondary,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
