import * as WebBrowser from "expo-web-browser";

import type { LanguageCode } from "@/data/onboarding";
import { API_URL } from "@/lib/ai/config";

// Сайт AI Navigator (apps/web): тот же адрес, что и у API. Нет адреса в .env — основной сайт,
// чтобы ссылки на Условия и Политику работали всегда (их проверяет Apple на экране подписки).
const SITE_URL = API_URL || "https://ai-navigator-app.netlify.app";

export type SitePage = "terms" | "privacy";

// Английский — без префикса (/terms), остальные — /ru/terms, /es/terms.
export function sitePageUrl(page: SitePage, language: LanguageCode): string {
  return language === "en" ? `${SITE_URL}/${page}` : `${SITE_URL}/${language}/${page}`;
}

// Открывает страницу сайта во встроенном браузере — человек остаётся в приложении.
export async function openSitePage(
  page: SitePage,
  language: LanguageCode,
): Promise<void> {
  await WebBrowser.openBrowserAsync(sitePageUrl(page, language)).catch(() => {});
}
