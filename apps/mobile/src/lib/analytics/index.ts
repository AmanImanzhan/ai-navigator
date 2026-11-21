import PostHog from "posthog-react-native";

import { APP_ENV } from "@/lib/appEnv";
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

// Публичный ключ проекта PostHog всегда начинается с phc_. Другое значение (например,
// личный ключ phx_ — он секретный и в приложение попадать не должен) — статистику не включаем.
export function isPostHogKey(value: string): boolean {
  return /^phc_\S+$/.test(value);
}

const RAW_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY?.trim() ?? "";
const KEY = isPostHogKey(RAW_KEY) ? RAW_KEY : "";
if (RAW_KEY && !KEY && __DEV__) {
  console.warn("EXPO_PUBLIC_POSTHOG_KEY должен начинаться с phc_ — статистика выключена.");
}
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
  registerEnvironment(client);
  return client;
}

// Каждое событие помечаем окружением (production / preview / development), чтобы в PostHog
// отделять настоящие события от тестовых. PostHog.reset() эту пометку стирает — ставим снова.
function registerEnvironment(posthog: PostHog): void {
  void posthog.register({ environment: APP_ENV });
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
  if (!client) return;
  client.reset();
  registerEnvironment(client);
  // reset() в PostHog снимает и отказ от сбора — возвращаем его, если человек против.
  if (!isTelemetryAllowed()) client.optOut();
}

// Переключатель «Помогать улучшать приложение».
export function setAnalyticsEnabled(enabled: boolean): void {
  if (enabled) {
    client?.optIn();
  } else {
    client?.optOut();
  }
}
