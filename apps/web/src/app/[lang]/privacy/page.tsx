import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalArticle } from "@/components/LegalArticle";
import { SiteShell } from "@/components/SiteShell";
import { getPrivacyPolicy } from "@/content/legal";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return pageMetadata(
    lang,
    "/privacy",
    meta.privacyTitle,
    meta.privacyDescription,
  );
}

// Политика конфиденциальности — ссылка на неё нужна в App Store и в Google Branding.
export default async function Privacy({
  params,
}: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <SiteShell lang={lang} path="/privacy">
      <LegalArticle
        title={dict.meta.privacyTitle}
        document={getPrivacyPolicy(lang)}
        updatedLabel={dict.legal.updated}
      />
    </SiteShell>
  );
}
