// Запасной Intl.PluralRules для наших языков (en, ru, es).
// i18next выбирает форму слова («1 урок / 2 урока / 5 уроков») через Intl.PluralRules,
// а в движке Hermes (React Native) его может не быть. Ставим замену, только если своего нет.

type Category = "one" | "few" | "many" | "other";

const CATEGORIES: Record<string, Category[]> = {
  en: ["one", "other"],
  es: ["one", "other"],
  ru: ["one", "few", "many", "other"],
};

function selectRussian(count: number): Category {
  if (!Number.isInteger(count)) return "other";
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "one";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "few";
  return "many";
}

class FallbackPluralRules {
  private language: string;

  constructor(locale?: string | string[]) {
    const code = (Array.isArray(locale) ? locale[0] : locale) ?? "en";
    this.language = code.split(/[-_]/)[0];
  }

  select(count: number): Category {
    if (this.language === "ru") return selectRussian(count);
    return count === 1 ? "one" : "other";
  }

  resolvedOptions() {
    return { pluralCategories: CATEGORIES[this.language] ?? CATEGORIES.en };
  }
}

export function installPluralRulesFallback() {
  if (typeof Intl !== "undefined" && typeof Intl.PluralRules === "function") {
    return;
  }
  const intl = (globalThis.Intl ?? {}) as Record<string, unknown>;
  intl.PluralRules = FallbackPluralRules;
  (globalThis as Record<string, unknown>).Intl = intl;
}
