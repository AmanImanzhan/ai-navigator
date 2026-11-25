import { describe, expect, it } from "vitest";

import { getPrivacyPolicy, getTerms, type LegalDocument } from "@/content/legal";
import { LOCALES } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// Apple отклоняет приложения с заглушками на сайте (правило 2.1(a)): ни одного «[TODO» в
// юридических текстах и на странице поддержки.
function documentText(document: LegalDocument): string {
  return [
    document.updated,
    document.intro,
    ...document.sections.flatMap((section) => [
      section.heading,
      ...(section.paragraphs ?? []),
      ...(section.items ?? []),
      ...(section.afterItems ?? []),
    ]),
  ].join("\n");
}

describe.each(LOCALES)("legal texts (%s)", (locale) => {
  it("privacy policy and terms have no placeholders", () => {
    expect(documentText(getPrivacyPolicy(locale))).not.toContain("[TODO");
    expect(documentText(getTerms(locale))).not.toContain("[TODO");
  });

  it("support page shows a real email", () => {
    expect(getDictionary(locale).support.email).toMatch(/^[^\s@[\]]+@[^\s@]+\.[a-z]+$/);
  });

  it("privacy policy tells about AI consent and Anthropic's 30-day deletion", () => {
    const text = documentText(getPrivacyPolicy(locale));
    expect(text).toContain("Anthropic");
    expect(text).toContain("30");
  });
});
