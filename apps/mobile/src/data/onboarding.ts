import type { SFSymbol } from "expo-symbols";

// Варианты ответов онбординга. Нужны и экранам онбординга, и Профилю.
// Подписи вариантов — в переводах (src/i18n/locales), здесь только id и иконки.

export type LanguageCode = "en" | "ru" | "es";

// Названия языков не переводим: каждый язык написан на самом себе.
export type Language = {
  code: LanguageCode;
  badge: string;
  title: string;
  subtitle?: string;
};

export const LANGUAGES: Language[] = [
  { code: "en", badge: "EN", title: "English" },
  { code: "ru", badge: "RU", title: "Русский", subtitle: "Russian" },
  { code: "es", badge: "ES", title: "Español", subtitle: "Spanish" },
];

export type OccupationId =
  | "office"
  | "manager"
  | "business"
  | "student"
  | "retired";

export type Occupation = {
  id: OccupationId;
  icon: SFSymbol;
};

export const OCCUPATIONS: Occupation[] = [
  { id: "office", icon: "briefcase" },
  { id: "manager", icon: "person.3" },
  { id: "business", icon: "storefront" },
  { id: "student", icon: "graduationcap" },
  { id: "retired", icon: "cup.and.saucer" },
];

export type DailyMinutes = 5 | 10 | 15;

export const DAILY_MINUTES: DailyMinutes[] = [5, 10, 15];
