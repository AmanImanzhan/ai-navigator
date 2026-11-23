import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

import { buildDeployEnv } from "./src/lib/deploy";

// Корень монорепо Next.js находит сам — по package-lock.json в корне репозитория.
// @ai-navigator/shared тоже собирается без настроек: Turbopack сам компилирует пакеты workspaces.
const nextConfig: NextConfig = {
  // Окружение, коммит и адрес деплоя (переменные хостинга есть только во время сборки) —
  // вшиваем в код как NEXT_PUBLIC_DEPLOY_* (src/lib/deploy.ts).
  env: buildDeployEnv(process.env),
  experimental: {
    // Своя страница 404: корневой layout лежит в app/[lang], поэтому общий 404 — отдельным файлом.
    globalNotFound: true,
  },
  // Админку не индексировать — даже ответы без HTML (редиректы, обработчик входа).
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

// Sentry: загрузка source maps (понятные строки кода в отчётах об ошибках) — только если на хостинге
// заданы SENTRY_AUTH_TOKEN, SENTRY_ORG и SENTRY_PROJECT. Без них сборка проходит как обычно.
const uploadSourceMaps = Boolean(
  process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT,
);

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Организация Sentry — в регионе EU. sentry-cli 3 берёт адрес из того же места, что и токен,
  // поэтому на хостинге рядом с SENTRY_AUTH_TOKEN нужна переменная SENTRY_URL.
  sentryUrl: process.env.SENTRY_URL ?? "https://de.sentry.io/",
  silent: !process.env.CI,
  // Не отправлять Sentry статистику о самой сборке.
  telemetry: false,
  sourcemaps: { disable: !uploadSourceMaps },
  widenClientFileUpload: true,
});
