import PostHog from "posthog-react-native";

import { isTelemetryAllowed } from "@/store/useTelemetryStore";

// Анонимная статистика использования (PostHog, серверы в ЕС).
// Единственное место, где приложение обращается к PostHog: экраны вызывают только
// track / screen / identify / reset отсюда.
//
// Правила приватности:
// - только названия событий и безопасные свойства (id урока, трека, шаблона; язык; тариф);
// - никогда: тексты человека, запросы и ответы ИИ, заметки, почта, имя, токены;
// - человек — id пользователя Supabase после входа, до входа — случайный анонимный id;
// - без записи экрана (session replay), без автосбора нажатий и текста, без IDFA и
//   слежки между приложениями;
// - нет ключа или человек выключил «Помогать улучшать приложение» — ничего не отправляем.

const KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY?.trim() ?? "";
const HOST = "https://eu.i.posthog.com";

// Все события и их свойства. Новое событие — сначала сюда.
export type AnalyticsEvents = {
  app_opened: { language: string };
  onboarding_completed: { language: string; minutes_per_day: number };
  lesson_started: { lesson_id: string; track_id: string | null };
  lesson_completed: { lesson_id: string; track_id: string | null };
  template_copied: { template_id: string };
  ai_request_sent: { feature: "try" | "fill"; lesson_id?: string; template_id?: string };
  ai_limit_reached: { feature: "try" | "fill"; premium: boolean };
  paywall_viewed: { source: string };
  purchase_started: { plan: "monthly" | "annual" };
  purchase_completed: { plan: "monthly" | "annual" };
  purchase_cancelled: { plan: "monthly" | "annual" };
  restore_purchases: { result: "restored" | "nothing" | "error" };
  sign_in: { method: "apple" | "google" };
  account_deleted: Record<string, never>;
};

let client: PostHog | null = null;

// Клиент PostHog — только если есть ключ и человек не против. Создаётся при первом событии.
function getClient(): PostHog | null {
  if (!KEY || !isTelemetryAllowed()) return null;
  client ??= new PostHog(KEY, {
    host: HOST,
    // Только наши события: без системных «установка / открытие / фон».
    captureAppLifecycleEvents: false,
    enableSessionReplay: false,
    // Ошибки собирает Sentry; PostHog их не трогает.
    errorTracking: { autocapture: false },
    // Не определять город и страну по IP-адресу.
    disableGeoip: true,
    // Флаги и опросы не используем — лишних запросов нет.
    preloadFeatureFlags: false,
    disableSurveys: true,
  });
  return client;
}

export function track<E extends keyof AnalyticsEvents>(
  event: E,
  properties: AnalyticsEvents[E],
): void {
  getClient()?.capture(event, properties);
}

// Просмотр экрана: только путь (/lesson/4), без параметров из адреса.
export function screen(path: string): void {
  getClient()?.screen(path);
}

// После входа: события привязываются к id пользователя Supabase. Без почты и имени.
export function identify(userId: string): void {
  getClient()?.identify(userId);
}

// После выхода: новый анонимный id, чтобы следующие события не попали в чужой профиль.
export function reset(): void {
  client?.reset();
  // reset() в PostHog снимает и отказ от сбора — возвращаем его, если человек против.
  if (!isTelemetryAllowed()) client?.optOut();
}

// Переключатель «Помогать улучшать приложение».
export function setAnalyticsEnabled(enabled: boolean): void {
  if (enabled) {
    client?.optIn();
  } else {
    client?.optOut();
  }
}
