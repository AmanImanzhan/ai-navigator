import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, StyleSheet, Switch, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { ReminderTimePicker } from "@/components/settings/ReminderTimePicker";
import { useReminderSwitch } from "@/hooks/useReminderSwitch";
import {
  getReminderPermission,
  openSystemSettings,
  sendTestReminder,
  type ReminderPermission,
} from "@/lib/reminders";
import { theme } from "@/theme";

// Карточка «Напоминания» в Настройках: переключатель, время и подсказка,
// если уведомления запрещены в настройках iPhone.
export function ReminderSettings() {
  const { t } = useTranslation();
  const { enabled, busy, toggle } = useReminderSwitch();
  const [permission, setPermission] = useState<ReminderPermission | null>(null);

  const checkPermission = useCallback(() => {
    getReminderPermission()
      .then(setPermission)
      .catch(() => setPermission(null));
  }, []);

  // После переключения разрешение могло только что появиться — проверяем заново.
  useEffect(() => {
    checkPermission();
  }, [enabled, checkPermission]);

  // Разрешение могли поменять в настройках iPhone — проверяем при открытии экрана
  // и при возвращении в приложение.
  useFocusEffect(
    useCallback(() => {
      checkPermission();
      const subscription = AppState.addEventListener("change", (state) => {
        if (state === "active") checkPermission();
      });
      return () => subscription.remove();
    }, [checkPermission]),
  );

  // Включено, но iPhone запрещает уведомления (выключили в его настройках) — напоминания не придут.
  const blocked = enabled && permission === "denied";

  return (
    <View style={styles.card}>
      <View style={styles.switchRow}>
        <View style={styles.texts}>
          <Text style={styles.title}>{t("settings.reminderTitle")}</Text>
          <Text style={styles.subtitle}>{t("settings.reminderSubtitle")}</Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={toggle}
          disabled={busy}
          trackColor={{ false: theme.colors.track, true: theme.colors.accent }}
          ios_backgroundColor={theme.colors.track}
          accessibilityLabel={t("settings.reminderTitle")}
        />
      </View>

      {enabled ? (
        <>
          <View style={styles.divider} />
          <ReminderTimePicker />
        </>
      ) : null}

      {blocked ? (
        <View style={styles.warning}>
          <Text style={styles.warningText}>
            {t("settings.reminderBlocked")}
          </Text>
          <Button
            title={t("reminders.openSettings")}
            variant="secondary"
            onPress={openSystemSettings}
          />
        </View>
      ) : null}

      {/* Только в разработке: проверить текст и нажатие, не дожидаясь вечера. */}
      {__DEV__ && enabled && !blocked ? (
        <Button
          title={t("settings.testReminder")}
          variant="ghost"
          onPress={() => {
            sendTestReminder();
          }}
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
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
  },
  warning: {
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.warningBg,
  },
  warningText: {
    ...theme.typography.callout,
    color: theme.colors.warning,
  },
});
