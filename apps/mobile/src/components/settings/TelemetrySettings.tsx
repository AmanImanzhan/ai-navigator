import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, Switch, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { captureError, isMonitoringOn } from "@/lib/monitoring";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { theme } from "@/theme";

// «Помогать улучшать приложение»: анонимная статистика и отчёты об ошибках.
// Выключил — PostHog перестаёт собирать события, Sentry не отправляет отчёты.
export function TelemetrySettings() {
  const { t } = useTranslation();
  const enabled = useTelemetryStore((state) => state.enabled);
  const setEnabled = useTelemetryStore((state) => state.setEnabled);

  // Только в разработке: проверить, что ошибка доходит до Sentry.
  function sendTestError() {
    if (!isMonitoringOn()) {
      Alert.alert("Sentry", t("settings.testSentryOff"));
      return;
    }
    captureError(new Error("Sentry test error from Settings"));
    Alert.alert("Sentry", t("settings.testSentrySent"));
  }

  return (
    <View style={styles.card}>
      <View style={styles.switchRow}>
        <View style={styles.texts}>
          <Text style={styles.title}>{t("settings.telemetryTitle")}</Text>
          <Text style={styles.subtitle}>{t("settings.telemetryText")}</Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={setEnabled}
          trackColor={{ false: theme.colors.track, true: theme.colors.accent }}
          ios_backgroundColor={theme.colors.track}
          accessibilityLabel={t("settings.telemetryTitle")}
        />
      </View>

      {__DEV__ ? (
        <Button
          title={t("settings.testSentry")}
          variant="ghost"
          onPress={sendTestError}
        />
      ) : null}
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  texts: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
