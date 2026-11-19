import type { LessonContent } from "@ai-navigator/shared";

import type { LanguageCode } from "@/data/onboarding";

// ---------- Карточки урока: общие типы в @ai-navigator/shared (их же проверяет админка) ----------

export type {
  HowtoCard,
  HowtoItem,
  HowtoLayout,
  InfoCard,
  LessonCard,
  LessonContent,
  PracticeCard,
  PracticeFollowUp,
  QuizCard,
  QuizOption,
  ResultCard,
  ShareAction,
  SummaryCard,
  ToolCard,
  ToolLink,
} from "@ai-navigator/shared";

// ---------- Структура: одинакова для всех языков ----------

export type Locale = LanguageCode;

export type TrackId =
  | "texts"
  | "images"
  | "video"
  | "voice"
  | "safety"
  | "work-admin"
  | "work-management";

export type LessonId =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21";

export type LessonLevel = 1 | 2 | 3;

export type LessonData = {
  id: LessonId;
  level: LessonLevel;
  minutes: number;
};

export type TrackData = {
  id: TrackId;
  lessons: LessonData[];
};

// ---------- Тексты на одном языке (файлы ru.ts, en.ts, es.ts) ----------

// Урок на одном языке = будущая строка lesson_translations (lesson_id, locale, title, content).
// Нет content — урока на этом языке ещё нет.
export type LessonTranslation = {
  title: string;
  content?: LessonContent;
};

// Record требует все id: забыть название урока или направления не получится.
export type LocaleLessons = {
  tracks: Record<TrackId, string>;
  lessons: Record<LessonId, LessonTranslation>;
};

// ---------- Урок на одном языке — с ним работают экраны ----------

export type Lesson = {
  id: LessonId;
  title: string;
  level: LessonLevel;
  minutes: number;
  // Нет содержимого — урок «скоро».
  content?: LessonContent;
};

// Направление: тексты, картинки, видео…
export type Track = {
  id: TrackId;
  title: string;
  lessons: Lesson[];
};

// available — можно открыть; completed — пройден; soon — ещё нет содержимого.
// Все уроки бесплатные — платный только ИИ-помощник.
export type LessonStatus = "available" | "completed" | "soon";
