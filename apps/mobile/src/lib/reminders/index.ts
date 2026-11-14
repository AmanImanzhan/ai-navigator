import * as Notifications from "expo-notifications";
import { AndroidImportance, IosAuthorizationStatus } from "expo-notifications";
import { Linking, Platform } from "react-native";

import i18n from "@/i18n";
import { planReminders, type Weekday } from "@/lib/reminders/plan";
import { useAppStore } from "@/store/useAppStore";
import { useReminderStore } from "@/store/useReminderStore";

// Ежедневные напоминания — локальные уведомления: их планирует сам телефон,
// сервер и push-сертификаты не нужны.

// Куда ведёт нажатие на напоминание.
export const REMINDER_URL = "/home";

const ANDROID_CHANNEL_ID = "reminders";

// Приложение открыто в момент напоминания — не показываем: человек и так здесь.
// Исключение — тестовое напоминание из Настроек (только в разработке).
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const isTest = notification.request.content.data?.test === true;
    return {
      shouldShowBanner: isTest,
      shouldShowList: isTest,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

// ---------- Разрешение ----------

export type ReminderPermission = "granted" | "denied" | "undetermined";

function toPermission(
  response: Notifications.NotificationPermissionsStatus,
): ReminderPermission {
  if (response.granted) return "granted";
  // «Временное» разрешение iOS (тихие уведомления) тоже считаем разрешением.
  if (response.ios?.status === IosAuthorizationStatus.PROVISIONAL) {
    return "granted";
  }
  return response.canAskAgain ? "undetermined" : "denied";
}

export async function getReminderPermission(): Promise<ReminderPermission> {
  return toPermission(await Notifications.getPermissionsAsync());
}

// Спрашивает разрешение, только если ещё не спрашивали. Если человек уже отказал,
// iOS второй раз не спросит — тогда поможет только «Открыть настройки iPhone».
export async function requestReminderPermission(): Promise<ReminderPermission> {
  if (Platform.OS === "android") {
    // На Android уведомлениям нужен канал — создаём до запроса разрешения.
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: i18n.t("reminders.channelName"),
      importance: AndroidImportance.DEFAULT,
    });
  }
  const current = await getReminderPermission();
  if (current !== "undetermined") return current;
  return toPermission(await Notifications.requestPermissionsAsync());
}

// Настройки этого приложения в «Настройках» iPhone — там можно разрешить уведомления.
export function openSystemSettings() {
  Linking.openSettings();
}

// ---------- Планирование ----------

// Текст напоминания: свой вариант для каждого дня недели, на языке приложения.
function reminderContent(
  weekday: Weekday,
): Notifications.NotificationContentInput {
  const t = i18n.getFixedT(useAppStore.getState().language);
  return {
    title: t(`reminders.messages.${weekday}.title`),
    body: t(`reminders.messages.${weekday}.body`),
    data: { url: REMINDER_URL },
  };
}

// Пересоздаёт расписание с нуля: снимаем всё запланированное и ставим заново.
// Вызывается при любом изменении (включили, сменили время или язык, прошли урок, открыли
// приложение) — так расписание всегда соответствует текущему состоянию.
async function rescheduleNow() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const { enabled, hour, minute } = useReminderStore.getState();
  const { onboardingDone, lastLessonAt } = useAppStore.getState();
  if (!enabled || !onboardingDone) return;
  if ((await getReminderPermission()) !== "granted") return;

  const channelId = Platform.OS === "android" ? ANDROID_CHANNEL_ID : undefined;
  const plan = planReminders(new Date(), { hour, minute }, lastLessonAt);

  for (const reminder of plan) {
    await Notifications.scheduleNotificationAsync({
      content: reminderContent(reminder.weekday),
      trigger:
        reminder.kind === "weekly"
          ? {
              type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
              weekday: reminder.weekday,
              hour: reminder.hour,
              minute: reminder.minute,
              channelId,
            }
          : {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: reminder.date,
              channelId,
            },
    });
  }
}

// Одновременно идёт только одно перепланирование; если просили ещё — повторяем после.
let running: Promise<void> | null = null;
let again = false;

export function rescheduleReminders(): Promise<void> {
  if (running) {
    again = true;
    return running;
  }
  running = rescheduleNow()
    .catch((error: unknown) => {
      if (__DEV__) console.log("Напоминания не запланированы:", String(error));
    })
    .finally(() => {
      running = null;
      if (again) {
        again = false;
        rescheduleReminders();
      }
    });
  return running;
}

// «Сбросить данные»: выключаем напоминания и снимаем всё запланированное.
export async function resetReminders() {
  useReminderStore.getState().reset();
  await rescheduleReminders();
}

// Только для разработки: напоминание через 5 секунд, чтобы проверить текст и нажатие.
export async function sendTestReminder() {
  const weekday = (new Date().getDay() + 1) as Weekday;
  const content = reminderContent(weekday);
  await Notifications.scheduleNotificationAsync({
    content: { ...content, data: { ...content.data, test: true } },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId: Platform.OS === "android" ? ANDROID_CHANNEL_ID : undefined,
    },
  });
}
