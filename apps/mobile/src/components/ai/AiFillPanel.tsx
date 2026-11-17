import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AccessibilityInfo,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AiErrorNotice } from "@/components/ai/AiErrorNotice";
import { AiSignInPrompt } from "@/components/ai/AiSignInPrompt";
import { AiUsageNote } from "@/components/ai/AiUsageNote";
import { Button } from "@/components/Button";
import { useAiFill } from "@/hooks/useAiFill";
import { useAiUsage } from "@/hooks/useAiUsage";
import { useAuth } from "@/hooks/useAuth";
import { MAX_SITUATION_CHARS } from "@/lib/ai/config";
import { toPlainText } from "@/lib/ai/format";
import { theme } from "@/theme";

// Поле ситуации — примерно на 2–3 строки.
const INPUT_MIN_HEIGHT = 72;

type AiFillPanelProps = {
  templateId: string;
  // Поля шаблона (без скобок).
  fields: string[];
  // ИИ предложил значения — экран подставляет их в поля.
  onValues: (values: Record<string, string>) => void;
};

// «Заполнить с помощником»: человек описывает ситуацию — ИИ заполняет поля шаблона и даёт совет.
export function AiFillPanel(props: AiFillPanelProps) {
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("ai.fill.title")}</Text>
        <Text style={styles.hint}>{t("ai.fill.hint")}</Text>
      </View>
      {isSignedIn ? <AiFillForm {...props} /> : <AiSignInPrompt />}
    </View>
  );
}

function AiFillForm({ templateId, fields, onValues }: AiFillPanelProps) {
  const { t } = useTranslation();
  const [situation, setSituation] = useState("");
  const usage = useAiUsage();
  const { status, tip, filledCount, error, fill } = useAiFill(
    templateId,
    fields,
  );

  const loading = status === "loading";
  const trimmed = situation.trim();

  async function handleFill() {
    const values = await fill(trimmed);
    if (values) onValues(values);
  }

  // VoiceOver: одно сообщение, когда поля заполнены.
  useEffect(() => {
    if (status === "done") {
      AccessibilityInfo.announceForAccessibility(
        filledCount > 0 ? t("ai.fill.announceDone") : t("ai.fill.nothing"),
      );
    }
  }, [status, filledCount, t]);

  return (
    <View style={styles.form}>
      <Text style={styles.label}>{t("ai.fill.inputLabel")}</Text>
      <TextInput
        value={situation}
        onChangeText={setSituation}
        placeholder={t("ai.fill.placeholder")}
        placeholderTextColor={theme.colors.textSecondary}
        multiline
        maxLength={MAX_SITUATION_CHARS}
        editable={!loading}
        style={styles.input}
        accessibilityLabel={t("ai.fill.inputLabel")}
      />
      <Button
        title={loading ? t("ai.fill.loading") : t("ai.fill.submit")}
        disabled={loading || !trimmed}
        onPress={handleFill}
      />

      {error?.code !== "limit_reached" ? <AiUsageNote usage={usage} /> : null}

      {status === "done" ? (
        <View style={filledCount > 0 ? styles.success : styles.neutral}>
          <Text style={styles.resultText}>
            {filledCount > 0 ? t("ai.fill.done") : t("ai.fill.nothing")}
          </Text>
          {tip.trim() ? (
            <Text style={styles.tip}>
              {t("ai.fill.tip", { tip: toPlainText(tip).trim() })}
            </Text>
          ) : null}
        </View>
      ) : null}

      {status === "error" && error ? (
        <AiErrorNotice error={error} onRetry={handleFill} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  header: {
    gap: theme.spacing.xxs,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  hint: {
    ...theme.typography.callout,
    color: theme.colors.textSecondary,
  },
  form: {
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.text,
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.text,
    minHeight: INPUT_MIN_HEIGHT,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
    textAlignVertical: "top",
  },
  success: {
    gap: theme.spacing.xxs,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.successBg,
  },
  neutral: {
    gap: theme.spacing.xxs,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.track,
  },
  resultText: {
    ...theme.typography.callout,
    color: theme.colors.text,
  },
  tip: {
    ...theme.typography.callout,
    color: theme.colors.textSecondary,
  },
});
