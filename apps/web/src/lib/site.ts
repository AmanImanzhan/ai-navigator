import type { Metadata } from "next";

import {
  languageAlternates,
  localizedPath,
  type Locale,
  type SitePath,
} from "@/i18n/config";

// Адрес сайта — для canonical-ссылок, sitemap и robots.
// 1. NEXT_PUBLIC_SITE_URL — если задан (свой домен);
// 2. VERCEL_PROJECT_PRODUCTION_URL — Vercel подставляет сам (…vercel.app);
// 3. локально — localhost.
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}

// title и description страницы + ссылки на её версии на других языках (hreflang).
export function pageMetadata(
  lang: Locale,
  path: SitePath,
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: localizedPath(lang, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: localizedPath(lang, path),
      siteName: "AI Navigator",
      locale: lang,
      type: "website",
    },
  };
}
