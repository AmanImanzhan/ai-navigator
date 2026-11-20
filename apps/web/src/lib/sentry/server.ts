import * as Sentry from "@sentry/nextjs";

import {
  scrubBreadcrumb,
  scrubEvent,
  SENTRY_DATA_COLLECTION,
  sentryEnvironment,
} from "@/lib/sentry/options";

// Sentry на сервере (Node.js и edge). Без SENTRY_DSN — не включается.
export function initServerSentry(): void {
  const dsn = process.env.SENTRY_DSN?.trim();
  if (!dsn) return;
  Sentry.init({
    dsn,
    environment: sentryEnvironment(),
    dataCollection: SENTRY_DATA_COLLECTION,
    // Только ошибки: без замеров скорости (в них попадают адреса и параметры).
    tracesSampleRate: 0,
    beforeSend: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
  });
}
