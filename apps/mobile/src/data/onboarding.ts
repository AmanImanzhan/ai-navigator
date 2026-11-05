import type { SFSymbol } from "expo-symbols";

// Варианты ответов онбординга. Нужны и экранам онбординга, и Профилю.

export type LanguageCode = "en" | "ru" | "es";

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
  title: string;
  subtitle: string;
};

export const OCCUPATIONS: Occupation[] = [
  {
    id: "office",
    icon: "briefcase",
    title: "Офис и администрирование",
    subtitle: "Документы, письма, таблицы",
  },
  {
    id: "manager",
    icon: "person.3",
    title: "Руковожу людьми",
    subtitle: "Встречи, задачи, отчёты",
  },
  {
    id: "business",
    icon: "storefront",
    title: "Своё дело",
    subtitle: "Реклама, клиенты, соцсети",
  },
  {
    id: "student",
    icon: "graduationcap",
    title: "Учусь",
    subtitle: "Конспекты, задания, языки",
  },
  {
    id: "retired",
    icon: "cup.and.saucer",
    title: "На пенсии",
    subtitle: "Общение, фото, безопасность",
  },
];

export type DailyMinutes = 5 | 10 | 15;

export type DailyTime = {
  minutes: DailyMinutes;
  title: string;
  subtitle: string;
};

export const DAILY_TIMES: DailyTime[] = [
  { minutes: 5, title: "5 минут", subtitle: "Лёгкий старт · 1 урок в день" },
  {
    minutes: 10,
    title: "10 минут",
    subtitle: "Обычный темп · урок и практика",
  },
  {
    minutes: 15,
    title: "15 минут",
    subtitle: "Быстрый прогресс · 2 урока в день",
  },
];
