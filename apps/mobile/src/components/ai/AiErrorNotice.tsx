import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { LimitReachedText } from "@/components/ai/AiUsageNote";
import { Button } from "@/components/Button";
import type { AiClientError, AiClientErrorCode } from "@/lib/ai/errors";
import { theme } from "@/theme";

// После каких ошибок есть смысл просто повторить тот же запрос.
const RETRYABLE: readonly AiClientErrorCode[] = [
  "invalid_request",
  "ai_unavailable",
  "server_not_configured",
  "not_configured",
  "network",
  "timeout",
];

type AiErrorNoticeProps = {
  error: AiClientError;
  onRetry: () => void;
};

// Понятное сообщение об ошибке помощника и, где это поможет, кнопка «Попробовать ещё раз».
export function AiErrorNotice({ error, onRetry }: AiErrorNoticeProps) {
  const { t } = useTranslation();

  if (error.code === "limit_reached") {
    return <LimitReachedText resetAt={error.resetAt} />;
  }

  const message =
    error.code === "input_too_long"
      ? t("ai.errors.input_too_long", { max: error.maxLength ?? "" })
      : t(`ai.errors.${error.code}`);

  return (
    <View style={styles.box}>
      {/* Сообщение озвучивается само, как только появилось. */}
      <Text
        style={styles.text}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        {message}
      </Text>
      {RETRYABLE.includes(error.code) ? (
        <Button
          title={t("ai.errors.retry")}
          variant="secondary"
          onPress={onRetry}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.errorBg,
  },
  text: {
    ...theme.typography.callout,
    color: theme.colors.text,
  },
});
