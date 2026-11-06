import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { CopyButton } from "@/components/CopyButton";
import type { SavedPrompt } from "@/store/useAppStore";
import { theme } from "@/theme";

type SavedPromptCardProps = {
  prompt: SavedPrompt;
  onDelete: () => void;
};

// Сохранённый запрос во вкладке «Мои»: название, текст и кнопки «Скопировать» / «Удалить».
export function SavedPromptCard({ prompt, onDelete }: SavedPromptCardProps) {
  const { t } = useTranslation();

  // Сначала спрашиваем — чтобы не удалить случайно.
  function handleDelete() {
    Alert.alert(t("prompts.deleteTitle"), t("prompts.deleteMessage"), [
      { text: t("prompts.deleteCancel"), style: "cancel" },
      { text: t("prompts.delete"), style: "destructive", onPress: onDelete },
    ]);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{prompt.title}</Text>
      <Text style={styles.text} selectable>
        {prompt.text}
      </Text>
      <View style={styles.actions}>
        <View style={styles.action}>
          <CopyButton text={prompt.text} variant="secondary" />
        </View>
        <View style={styles.action}>
          <Button
            title={t("prompts.delete")}
            variant="ghost"
            onPress={handleDelete}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  text: {
    ...theme.typography.callout,
    color: theme.colors.text,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  action: {
    flex: 1,
  },
});
