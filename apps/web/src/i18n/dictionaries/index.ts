import "server-only";

import type { Locale } from "@/i18n/config";
import { EN } from "@/i18n/dictionaries/en";
import { ES } from "@/i18n/dictionaries/es";
import { RU } from "@/i18n/dictionaries/ru";
import type { Dictionary } from "@/i18n/dictionaries/types";

export type * from "@/i18n/dictionaries/types";

// Тексты читаются только на сервере (Server Components) — в браузер уходит готовый HTML,
// а не все три словаря.
const DICTIONARIES: Record<Locale, Dictionary> = { en: EN, ru: RU, es: ES };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
