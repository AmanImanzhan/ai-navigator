import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import { openSystemSettings, requestReminderPermission } from "@/lib/reminders";
import { useReminderStore } from "@/store/useReminderStore";

// Переключатель напоминаний — в онбординге и в Настройках.
// Разрешение на уведомления спрашиваем только сейчас, когда человек сам включает напоминания.
export function useReminderSwitch() {
  const { t } = useTranslation();
  const enabled = useReminderStore((state) => state.enabled);
  const setEnabled = useReminderStore((state) => state.setEnabled);
  const [busy, setBusy] = useState(false);

  async function toggle(value: boolean) {
    if (!value) {
      setEnabled(false);
      return;
    }

    setBusy(true);
    const permission = await requestReminderPermission().catch(
      () => "denied" as const,
    );
    setBusy(false);

    if (permission === "granted") {
      setEnabled(true);
      return;
    }

    // Отказали (сейчас или раньше) — объясняем, где включить. Переключатель остаётся выключенным.
    Alert.alert(t("reminders.deniedTitle"), t("reminders.deniedMessage"), [
      { text: t("reminders.notNow"), style: "cancel" },
      { text: t("reminders.openSettings"), onPress: openSystemSettings },
    ]);
  }

  return { enabled, busy, toggle };
}
