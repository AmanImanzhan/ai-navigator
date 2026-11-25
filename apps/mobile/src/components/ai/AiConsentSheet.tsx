import { useTranslation } from "react-i18next";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { openSitePage } from "@/lib/site";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

type AiConsentSheetProps = {
  visible: boolean;
  onAgree: () => void;
  onDecline: () => void;
};

// Пункты листа по порядку: что отправляется, кому, зачем, обучение, срок хранения, что у нас.
const POINTS = ["what", "who", "why", "training", "retention", "ours"] as const;

// Согласие на отправку текста ИИ-помощнику (правило Apple 5.1.2(i)): что, кому и зачем уходит.
// Меняете тексты ai.consent.* по смыслу — увеличьте AI_CONSENT_VERSION (store/useAiConsentStore).
export function AiConsentSheet({ visible, onAgree, onDecline }: AiConsentSheetProps) {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      // Смахнули лист вниз — это «Не сейчас».
      onRequestClose={onDecline}
    >
      <SafeAreaView style={styles.screen} edges={["bottom"]}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title} accessibilityRole="header">
            {t("ai.consent.title")}
          </Text>
          <Text style={styles.body}>{t("ai.consent.intro")}</Text>

          <View style={styles.points}>
            {POINTS.map((point) => (
              <View key={point} style={styles.point}>
                <Text style={styles.pointTitle}>{t(`ai.consent.${point}Title`)}</Text>
                <Text style={styles.pointText}>{t(`ai.consent.${point}Text`)}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.note}>{t("ai.consent.withdraw")}</Text>
          <Text
            style={styles.link}
            accessibilityRole="link"
            onPress={() => openSitePage("privacy", language)}
          >
            {t("ai.consent.privacyLink")}
          </Text>
        </ScrollView>

        <View style={styles.actions}>
          <Button title={t("ai.consent.agree")} onPress={onAgree} />
          <Button title={t("ai.consent.notNow")} variant="ghost" onPress={onDecline} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  points: {
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  point: {
    gap: theme.spacing.xxs,
  },
  pointTitle: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
  },
  pointText: {
    ...theme.typography.callout,
    color: theme.colors.text,
  },
  note: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  link: {
    ...theme.typography.callout,
    color: theme.colors.accent,
    textDecorationLine: "underline",
  },
  actions: {
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
});
