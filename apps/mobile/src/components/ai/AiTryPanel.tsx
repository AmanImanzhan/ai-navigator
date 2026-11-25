import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AccessibilityInfo,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AiConsentSheet } from "@/components/ai/AiConsentSheet";
import { AiErrorNotice } from "@/components/ai/AiErrorNotice";
import { AiSignInPrompt } from "@/components/ai/AiSignInPrompt";
import { AiUsageNote } from "@/components/ai/AiUsageNote";
import { Button } from "@/components/Button";
import { CopyButton } from "@/components/CopyButton";
import { useAiConsentGate } from "@/hooks/useAiConsentGate";
import { useAiTry } from "@/hooks/useAiTry";
import { useAiUsage } from "@/hooks/useAiUsage";
import { useAuth } from "@/hooks/useAuth";
import { MAX_PROMPT_CHARS } from "@/lib/ai/config";
import { toPlainText } from "@/lib/ai/format";
import { theme } from "@/theme";

// Поле запроса — примерно на 3 строки.
const INPUT_MIN_HEIGHT = 96;

type AiTryPanelProps = {
  lessonId: string;
  // С чего начать: запрос из урока. Человек может его поправить.
  initialPrompt: string;
};

// «Спросите AI прямо здесь»: запрос → ответ потоком → разбор «что хорошо / что улучшить».
export function AiTryPanel({ lessonId, initialPrompt }: AiTryPanelProps) {
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("ai.try.title")}</Text>
        <Text style={styles.hint}>{t("ai.try.hint")}</Text>
      </View>
      {isSignedIn ? (
        <AiTryForm lessonId={lessonId} initialPrompt={initialPrompt} />
      ) : (
        <AiSignInPrompt />
      )}
    </View>
  );
}

function AiTryForm({ lessonId, initialPrompt }: AiTryPanelProps) {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState(initialPrompt);
  const usage = useAiUsage();
  const { status, answer, review, error, ask, stop } = useAiTry(lessonId);
  // Первый запрос — только после согласия отправлять текст в Anthropic.
  const consent = useAiConsentGate();

  const streaming = status === "streaming";
  const trimmed = prompt.trim();
  const plainAnswer = toPlainText(answer).trim();
  const plainReview = toPlainText(review).trim();

  // VoiceOver: говорим один раз в начале и один раз в конце — не на каждом кусочке ответа.
  useEffect(() => {
    if (status === "streaming") {
      AccessibilityInfo.announceForAccessibility(t("ai.try.announceStart"));
    } else if (status === "done") {
      AccessibilityInfo.announceForAccessibility(t("ai.try.announceDone"));
    }
  }, [status, t]);

  return (
    <View style={styles.form}>
      <TextInput
        value={prompt}
        onChangeText={setPrompt}
        multiline
        maxLength={MAX_PROMPT_CHARS}
        editable={!streaming}
        style={[styles.input, streaming && styles.inputDisabled]}
        accessibilityLabel={t("ai.try.inputLabel")}
      />

      {streaming ? (
        <Button title={t("ai.try.stop")} variant="secondary" onPress={stop} />
      ) : (
        <Button
          title={status === "idle" ? t("ai.try.ask") : t("ai.try.askAgain")}
          disabled={!trimmed}
          onPress={() => consent.run(() => ask(trimmed))}
        />
      )}

      {error?.code !== "limit_reached" ? <AiUsageNote usage={usage} /> : null}

      {streaming && !plainAnswer ? (
        <View style={styles.thinking}>
          <ActivityIndicator color={theme.colors.accent} />
          <Text style={styles.hint}>{t("ai.try.thinking")}</Text>
        </View>
      ) : null}

      {plainAnswer ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>{t("ai.try.answer")}</Text>
          <View style={styles.answer}>
            <Text style={styles.body} selectable>
              {plainAnswer}
            </Text>
          </View>
        </View>
      ) : null}

      {plainReview ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>{t("ai.try.review")}</Text>
          <View style={styles.review}>
            <Text style={styles.body} selectable>
              {plainReview}
            </Text>
          </View>
        </View>
      ) : null}

      {status === "stopped" ? (
        <Text style={styles.hint}>{t("ai.try.stopped")}</Text>
      ) : null}

      {!streaming && plainAnswer ? (
        <CopyButton text={plainAnswer} title={t("ai.try.copyAnswer")} />
      ) : null}

      {status === "error" && error ? (
        <AiErrorNotice
          error={error}
          onRetry={() => consent.run(() => ask(trimmed))}
        />
      ) : null}

      <AiConsentSheet
        visible={consent.visible}
        onAgree={consent.agree}
        onDecline={consent.decline}
      />
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
  inputDisabled: {
    color: theme.colors.textSecondary,
  },
  thinking: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  block: {
    gap: theme.spacing.xs,
  },
  blockTitle: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
  },
  answer: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bg,
  },
  review: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.accentSubtle,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
