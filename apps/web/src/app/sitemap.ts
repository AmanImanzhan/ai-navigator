import type { MetadataRoute } from "next";

import {
  LOCALES,
  SITE_PATHS,
  languageAlternates,
  localizedPath,
} from "@/i18n/config";
import { getSiteUrl } from "@/lib/site";

// /sitemap.xml: все страницы на всех языках, со ссылками друг на друга.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const absolute = (path: string) => new URL(path, base).toString();

  return SITE_PATHS.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: absolute(localizedPath(locale, path)),
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(path)).map(([key, value]) => [
            key,
            absolute(value),
          ]),
        ),
      },
    })),
  );
}
