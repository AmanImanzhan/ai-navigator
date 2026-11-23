import type { BrowserOptions, Breadcrumb, ErrorEvent } from "@sentry/nextjs";

// Общие настройки Sentry для сервера, edge и браузера.
//
// Правила приватности (как в приложении):
// - не отправляем тела запросов (запросы и ситуации для ИИ, ответы ИИ), cookies, заголовки
//   (Authorization, секрет webhook), параметры адреса, значения переменных в коде;
// - пользователя не определяем (ни id, ни IP);
// - без DSN Sentry выключен — сайт работает как раньше.

export const SENTRY_DATA_COLLECTION: NonNullable<BrowserOptions["dataCollection"]> = {
  userInfo: false,
  cookies: false,
  httpHeaders: false,
  httpBodies: [],
  urlQueryParams: false,
  // ИИ-помощник: никогда не записывать промты и ответы модели.
  genAI: { inputs: false, outputs: false },
  mcp: { inputs: false, outputs: false },
  databaseQueryData: false,
  queues: false,
  // Значения локальных переменных могут содержать тексты человека.
  stackFrameVariables: false,
};

function stripQuery(url: unknown): unknown {
  return typeof url === "string" ? url.split(/[?#]/)[0] : url;
}

// Последняя проверка перед отправкой: даже если что-то попало в отчёт — убираем.
export function scrubEvent(event: ErrorEvent): ErrorEvent {
  if (event.request) {
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.headers;
    delete event.request.query_string;
    event.request.url = stripQuery(event.request.url) as string | undefined;
  }
  delete event.user;
  event.breadcrumbs = event.breadcrumbs
    ?.map(scrubBreadcrumb)
    .filter((item): item is Breadcrumb => item !== null);
  return event;
}

export function scrubBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb | null {
  // Логи консоли могут содержать что угодно — не отправляем.
  if (breadcrumb.category === "console") return null;
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
  return { ...breadcrumb, data: undefined };
}

// Окружение: production / preview / development — вшито при сборке (lib/deploy.ts).
export function sentryEnvironment(): string {
  return process.env.NEXT_PUBLIC_DEPLOY_ENV || process.env.NODE_ENV || "development";
}
