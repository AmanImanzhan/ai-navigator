import "server-only";

import { PRIVACY_EN } from "@/content/legal/privacy.en";
import { PRIVACY_ES } from "@/content/legal/privacy.es";
import { PRIVACY_RU } from "@/content/legal/privacy.ru";
import { TERMS_EN } from "@/content/legal/terms.en";
import { TERMS_ES } from "@/content/legal/terms.es";
import { TERMS_RU } from "@/content/legal/terms.ru";
import type { LegalDocument } from "@/content/legal/types";
import type { Locale } from "@/i18n/config";

export type * from "@/content/legal/types";

// Политика конфиденциальности и условия — на всех трёх языках (Record не даст забыть язык).
const PRIVACY: Record<Locale, LegalDocument> = {
  en: PRIVACY_EN,
  ru: PRIVACY_RU,
  es: PRIVACY_ES,
};

const TERMS: Record<Locale, LegalDocument> = {
  en: TERMS_EN,
  ru: TERMS_RU,
  es: TERMS_ES,
};

export function getPrivacyPolicy(locale: Locale): LegalDocument {
  return PRIVACY[locale];
}

export function getTerms(locale: Locale): LegalDocument {
  return TERMS[locale];
}
