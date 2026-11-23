import type { Metadata } from "next";

import {
  languageAlternates,
  localizedPath,
  type Locale,
  type SitePath,
} from "@/i18n/config";

// Адрес сайта — для canonical-ссылок, sitemap и robots.
// 1. NEXT_PUBLIC_SITE_URL — если задан (свой домен);
// 2. адрес деплоя — хостинг даёт его при сборке (Netlify: URL, …netlify.app), см. lib/deploy.ts;
// 3. локально — localhost.
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const deployed = process.env.NEXT_PUBLIC_DEPLOY_URL;
  if (deployed) return new URL(deployed);
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
      // Картинка для ссылок: робот, название и слоган на языке страницы
      // (public/og, создаёт npm run brand:assets из корня).
      images: [
        { url: `/og/og-${lang}.png`, width: 1200, height: 630, alt: "AI Navigator" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/og/og-${lang}.png`],
    },
  };
}
