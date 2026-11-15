// Языки сайта — те же, что в приложении. Английский — по умолчанию и без префикса в адресе:
// /privacy — английский, /ru/privacy — русский, /es/privacy — испанский.

export const LOCALES = ["en", "ru", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// Названия языков не переводим: каждый язык написан на самом себе (как в приложении).
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  es: "Español",
};

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

// Страницы сайта без языка: "" — главная.
export type SitePath = "" | "/privacy" | "/terms" | "/support";

export const SITE_PATHS: SitePath[] = ["", "/privacy", "/terms", "/support"];

// Адрес страницы на нужном языке: ("ru", "/privacy") → "/ru/privacy", ("en", "") → "/".
export function localizedPath(locale: Locale, path: SitePath): string {
  if (locale === DEFAULT_LOCALE) return path || "/";
  return `/${locale}${path}`;
}

// Ссылки на все языковые версии страницы — для поисковиков (hreflang).
export function languageAlternates(path: SitePath): Record<string, string> {
  return {
    ...Object.fromEntries(
      LOCALES.map((locale) => [locale, localizedPath(locale, path)]),
    ),
    "x-default": localizedPath(DEFAULT_LOCALE, path),
  };
}
