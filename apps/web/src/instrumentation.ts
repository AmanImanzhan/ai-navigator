import * as Sentry from "@sentry/nextjs";

import { initServerSentry } from "@/lib/sentry/server";

// Next.js вызывает register() один раз при запуске сервера (Node.js и edge).
export function register() {
  initServerSentry();
}

// Необработанные ошибки страниц, маршрутов API и Server Actions → Sentry.
// Без SENTRY_DSN Sentry не включён, и вызов ничего не делает.
export const onRequestError = Sentry.captureRequestError;
