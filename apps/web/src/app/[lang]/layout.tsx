import type { Metadata } from "next";
import { notFound } from "next/navigation";

import "@/styles/globals.css";
import { LOCALES, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSiteUrl } from "@/lib/site";

// Все страницы собираются заранее на трёх языках. Другой язык в адресе — страница 404.
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    metadataBase: getSiteUrl(),
    applicationName: dict.meta.siteName,
    title: {
      default: dict.meta.homeTitle,
      template: `%s · ${dict.meta.siteName}`,
    },
    description: dict.meta.homeDescription,
  };
}

// Корневой layout: <html lang> — на языке страницы (важно для экранного диктора и поиска).
export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
