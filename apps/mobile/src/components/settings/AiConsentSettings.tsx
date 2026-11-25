import { useTranslation } from "react-i18next";
import { StyleSheet, Switch, Text, View } from "react-native";

import { AiConsentSheet } from "@/components/ai/AiConsentSheet";
import { useAiConsentGate } from "@/hooks/useAiConsentGate";
import { track } from "@/lib/analytics";
import { useAiConsentStore, useHasAiConsent } from "@/store/useAiConsentStore";
import { theme } from "@/theme";

// «AI-помощник»: согласие отправлять текст в Anthropic. Выключил — согласие отозвано, запросы
// не уходят; включил — сначала тот же лист согласия, что и перед первым запросом.
export function AiConsentSettings() {
  const { t } = useTranslation();
  const allowed = useHasAiConsent();
  const gate = useAiConsentGate();

  function onValueChange(value: boolean) {
    if (value) {
      // Сам лист и сохранит согласие по «Согласен».
      gate.run(() => {});
      return;
    }
    useAiConsentStore.getState().revoke();
    track("ai_consent", { action: "revoked" });
  }

  return (
    <View style={styles.card}>
      <View style={styles.switchRow}>
        <View style={styles.texts}>
          <Text style={styles.title}>{t("settings.aiConsentTitle")}</Text>
          <Text style={styles.subtitle}>
            {allowed ? t("settings.aiConsentOn") : t("settings.aiConsentOff")}
          </Text>
        </View>
        <Switch
          value={allowed}
          onValueChange={onValueChange}
          trackColor={{ false: theme.colors.track, true: theme.colors.accent }}
          ios_backgroundColor={theme.colors.track}
          accessibilityLabel={t("settings.aiConsentTitle")}
        />
      </View>
      <AiConsentSheet visible={gate.visible} onAgree={gate.agree} onDecline={gate.decline} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
