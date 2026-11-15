import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/BackHeader";
import { BUTTON_HEIGHT, Button } from "@/components/Button";
import { BulletList } from "@/components/library/BulletList";
import { useAuth } from "@/hooks/useAuth";
import { deleteAccount, isNetworkError } from "@/lib/auth";
import { getAppleUserId } from "@/lib/auth/apple";
import { theme } from "@/theme";

// Удаление аккаунта (требование App Store): что удалится, что это навсегда,
// что подписка сама не отменится, и явное подтверждение.
export default function DeleteAccount() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const isAppleAccount = user ? getAppleUserId(user) !== null : false;

  // Второе, явное подтверждение — чтобы не удалить случайным нажатием.
  function handleDelete() {
    Alert.alert(
      t("deleteAccount.confirmTitle"),
      t("deleteAccount.confirmMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("deleteAccount.confirmButton"),
          style: "destructive",
          onPress: () => {
            runDeletion();
          },
        },
      ],
    );
  }

  async function runDeletion() {
    setBusy(true);
    const result = await deleteAccount();

    if (result.status === "deleted") {
      // Телефон уже очищен — приложение само вернулось к началу. Этот экран закроется.
      Alert.alert(t("deleteAccount.doneTitle"), t("deleteAccount.doneMessage"));
      return;
    }
    setBusy(false);
    // Закрыли окно Apple — передумали, ничего не говорим.
    if (result.status === "cancelled") return;

    if (__DEV__) console.log("Удаление не удалось:", result.error);
    Alert.alert(
      t("deleteAccount.errorTitle"),
      isNetworkError(result.error)
        ? t("auth.errorNetwork")
        : t("deleteAccount.errorGeneric"),
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackHeader fallback="/settings" />

        <View style={styles.header}>
          <Text style={styles.title}>{t("deleteAccount.title")}</Text>
          <Text style={styles.body}>{t("deleteAccount.intro")}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{t("deleteAccount.whatTitle")}</Text>
          <BulletList
            items={[
              t("deleteAccount.whatProgress"),
              t("deleteAccount.whatPrompts"),
              t("deleteAccount.whatSettings"),
              t("deleteAccount.whatAccount"),
            ]}
          />
        </View>

        <Text style={styles.body}>{t("deleteAccount.phone")}</Text>

        {/* Подписку App Store удаление аккаунта не отменяет — предупреждаем заранее. */}
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>
            {t("deleteAccount.subscriptionTitle")}
          </Text>
          <Text style={styles.noticeText}>
            {t("deleteAccount.subscriptionText")}
          </Text>
        </View>

        {isAppleAccount ? (
          <Text style={styles.caption}>{t("deleteAccount.appleNote")}</Text>
        ) : null}
      </ScrollView>

      <View style={styles.actions}>
        {busy ? (
          <View style={styles.busy}>
            <ActivityIndicator color={theme.colors.error} />
            <Text style={styles.caption}>{t("deleteAccount.inProgress")}</Text>
          </View>
        ) : (
          <Button
            title={t("deleteAccount.button")}
            variant="danger"
            onPress={handleDelete}
          />
        )}
      </View>
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
    paddingBottom: theme.spacing.xl,
  },
  header: {
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  block: {
    gap: theme.spacing.xs,
  },
  label: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  notice: {
    gap: theme.spacing.xxs,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.warningBg,
  },
  noticeTitle: {
    ...theme.typography.headline,
    color: theme.colors.warning,
  },
  noticeText: {
    ...theme.typography.callout,
    color: theme.colors.text,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  actions: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  busy: {
    // Та же высота, что у кнопки, — экран не прыгает, пока идёт удаление.
    minHeight: BUTTON_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
  },
});
