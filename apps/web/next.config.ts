import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

// Корень монорепо Next.js находит сам — по package-lock.json в корне репозитория.
// @ai-navigator/shared тоже собирается без настроек: Turbopack сам компилирует пакеты workspaces.
const nextConfig: NextConfig = {
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

// Sentry: загрузка source maps (понятные строки кода в отчётах об ошибках) — только если на Vercel
// заданы SENTRY_AUTH_TOKEN, SENTRY_ORG и SENTRY_PROJECT. Без них сборка проходит как обычно.
const uploadSourceMaps = Boolean(
  process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT,
);

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  // Не отправлять Sentry статистику о самой сборке.
  telemetry: false,
  sourcemaps: { disable: !uploadSourceMaps },
  widenClientFileUpload: true,
});
