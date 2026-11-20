import * as Sentry from "@sentry/react-native";
import type { Breadcrumb, ErrorEvent } from "@sentry/react-native";
import Constants from "expo-constants";

import { isTelemetryAllowed } from "@/store/useTelemetryStore";

// Отчёты об ошибках (Sentry). Единственное место, где приложение настраивает Sentry.
//
// Правила приватности:
// - sendDefaultPii: false — Sentry сам не добавляет IP, cookies и данные пользователя;
// - в отчёт не попадают тела запросов, заголовки (Authorization), адреса с параметрами,
//   тексты человека и ИИ; пользователь — только id Supabase;
// - нет DSN или человек выключил «Помогать улучшать приложение» — ничего не отправляем.

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim() ?? "";

// development / preview / production — профиль EAS, с которым собрано приложение
// (app.config.ts → extra.appEnv). При запуске через `expo start` — development.
const extra: unknown = Constants.expoConfig?.extra;
const APP_ENV =
  typeof extra === "object" &&
  extra !== null &&
  "appEnv" in extra &&
  typeof extra.appEnv === "string"
    ? extra.appEnv
    : "development";

// Навигация Expo Router: в отчёте видно, на каком экране случилась ошибка.
export const navigationIntegration = Sentry.reactNavigationIntegration();

let initialized = false;

// Адрес без параметров и фрагмента: в ?query могут оказаться данные.
function stripQuery(url: unknown): unknown {
  return typeof url === "string" ? url.split(/[?#]/)[0] : url;
}

// Всё, что может содержать данные человека, из отчёта убираем.
function scrubEvent(event: ErrorEvent): ErrorEvent | null {
  if (!isTelemetryAllowed()) return null;
  if (event.request) {
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.headers;
    delete event.request.query_string;
    event.request.url = stripQuery(event.request.url) as string | undefined;
  }
  // Только id, без почты, имени и IP.
  event.user = event.user?.id ? { id: event.user.id } : undefined;
  event.breadcrumbs = event.breadcrumbs
    ?.map(scrubBreadcrumb)
    .filter((item): item is Breadcrumb => item !== null);
  return event;
}

function scrubBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb | null {
  // Логи консоли могут содержать что угодно — не отправляем.
  if (breadcrumb.category === "console") return null;
  // Сетевые запросы: только метод, адрес без параметров и код ответа. Без тел и заголовков.
  if (breadcrumb.category === "fetch" || breadcrumb.category === "xhr") {
    const data = breadcrumb.data ?? {};
    return {
      ...breadcrumb,
      data: {
        method: data.method,
        url: stripQuery(data.url),
        status_code: data.status_code,
      },
    };
  }
  // Остальное (переходы между экранами, нажатия) — без дополнительных данных.
  return { ...breadcrumb, data: undefined };
}

// Включить Sentry. Только если есть DSN и человек не против. Повторный вызов ничего не делает.
export function initMonitoring(): void {
  if (initialized || !DSN || !isTelemetryAllowed()) return;
  initialized = true;
  Sentry.init({
    dsn: DSN,
    environment: APP_ENV,
    sendDefaultPii: false,
    // Скорость экранов и запросов — для части сессий, этого достаточно.
    tracesSampleRate: APP_ENV === "production" ? 0.1 : 1.0,
    integrations: [navigationIntegration],
    // Без записи экрана и без формы отзыва.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    beforeSend: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
  });
}

export function isMonitoringOn(): boolean {
  return initialized;
}

// Кто вошёл — только id Supabase. null — вышел.
export function setMonitoringUser(userId: string | null): void {
  if (!initialized) return;
  Sentry.setUser(userId ? { id: userId } : null);
}

// Отправить ошибку вручную (например, из перехвата). Без текстов человека в сообщении!
export function captureError(error: unknown): void {
  if (!initialized) return;
  Sentry.captureException(error);
}

// Обёртка корневого компонента: ловит ошибки отрисовки и замеряет запуск.
export const wrapRoot = Sentry.wrap;
