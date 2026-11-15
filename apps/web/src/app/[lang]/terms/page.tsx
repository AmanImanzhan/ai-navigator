import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalArticle } from "@/components/LegalArticle";
import { SiteShell } from "@/components/SiteShell";
import { getTerms } from "@/content/legal";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return pageMetadata(lang, "/terms", meta.termsTitle, meta.termsDescription);
}

// Условия использования — ссылка на них нужна в Google Branding и пригодится в App Store.
export default async function Terms({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <SiteShell lang={lang} path="/terms">
      <LegalArticle
        title={dict.meta.termsTitle}
        document={getTerms(lang)}
        draftNote={dict.legal.draftNote}
        updatedLabel={dict.legal.updated}
      />
    </SiteShell>
  );
}
