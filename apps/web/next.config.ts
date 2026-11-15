import type { NextConfig } from "next";

// Корень монорепо Next.js находит сам — по package-lock.json в корне репозитория.
// @ai-navigator/shared тоже собирается без настроек: Turbopack сам компилирует пакеты workspaces.
const nextConfig: NextConfig = {
  experimental: {
    // Своя страница 404: корневой layout лежит в app/[lang], поэтому общий 404 — отдельным файлом.
    globalNotFound: true,
  },
};

export default nextConfig;
