import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";

import { REMINDER_URL, rescheduleReminders } from "@/lib/reminders";
import { useAppStore } from "@/store/useAppStore";
import { useReminderStore } from "@/store/useReminderStore";

// Подключается один раз в корневом layout, когда данные загружены из памяти.
// Держит расписание напоминаний в порядке и открывает Главную по нажатию на напоминание.
export function useReminders(enabled: boolean) {
  // Расписание — заново при запуске, при возвращении в приложение и при любом изменении,
  // от которого оно зависит. Фоновые задачи не нужны.
  useEffect(() => {
    if (!enabled) return;
    rescheduleReminders();

    const unsubscribeSettings = useReminderStore.subscribe(() =>
      rescheduleReminders(),
    );
    const unsubscribeApp = useAppStore.subscribe((state, previous) => {
      if (
        state.language !== previous.language ||
        state.lastLessonAt !== previous.lastLessonAt ||
        state.onboardingDone !== previous.onboardingDone
      ) {
        rescheduleReminders();
      }
    });
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") rescheduleReminders();
    });

    return () => {
      unsubscribeSettings();
      unsubscribeApp();
      subscription.remove();
    };
  }, [enabled]);

  // Нажали на напоминание — открываем Главную. Работает и когда приложение было закрыто:
  // тогда нажатие ждёт в getLastNotificationResponse.
  useEffect(() => {
    if (!enabled) return;

    function openFromNotification(
      response: Notifications.NotificationResponse,
    ) {
      const url = response.notification.request.content.data?.url;
      if (
        url === REMINDER_URL &&
        response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
      ) {
        router.navigate(REMINDER_URL);
      }
    }

    const last = Notifications.getLastNotificationResponse();
    if (last) {
      openFromNotification(last);
      Notifications.clearLastNotificationResponse();
    }

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        openFromNotification,
      );
    return () => subscription.remove();
  }, [enabled]);
}
