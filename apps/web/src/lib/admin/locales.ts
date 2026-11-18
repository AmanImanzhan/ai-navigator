import type { Enums } from "@ai-navigator/shared";

// Языки контента в админке. Порядок вкладок: русский (основной для команды), английский
// (запасной язык приложения), испанский.
export type ContentLocale = Enums<"app_locale">;

export const CONTENT_LOCALES: readonly ContentLocale[] = ["ru", "en", "es"];

export const CONTENT_LOCALE_NAMES: Record<ContentLocale, string> = {
  ru: "Русский",
  en: "English",
  es: "Español",
};

export function isContentLocale(value: unknown): value is ContentLocale {
  return CONTENT_LOCALES.includes(value as ContentLocale);
}
