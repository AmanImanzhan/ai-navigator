import * as Sentry from "@sentry/nextjs";

import {
  scrubBreadcrumb,
  scrubEvent,
  SENTRY_DATA_COLLECTION,
  sentryEnvironment,
} from "@/lib/sentry/options";

// Sentry в браузере (сайт и админка): только ошибки, без записи сессий (replay) и без
// замеров скорости. Без NEXT_PUBLIC_SENTRY_DSN — не включается.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();

if (dsn) {
  Sentry.init({
    dsn,
    environment: sentryEnvironment(),
    dataCollection: SENTRY_DATA_COLLECTION,
    tracesSampleRate: 0,
    beforeSend: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
  });
}

// Переходы между страницами — для понятных отчётов (что открывали перед ошибкой).
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
