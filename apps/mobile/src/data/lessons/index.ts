import { EN } from "@/data/lessons/en";
import { ES } from "@/data/lessons/es";
import { RU } from "@/data/lessons/ru";
import type {
  Lesson,
  LessonContent,
  LessonData,
  LessonLevel,
  LessonId,
  LessonStatus,
  Locale,
  LocaleLessons,
  ToolLink,
  Track,
  TrackData,
} from "@/data/lessons/types";

export type * from "@/data/lessons/types";

// Тексты уроков по языкам.
const LOCALES: Record<Locale, LocaleLessons> = { ru: RU, en: EN, es: ES };

// Если у урока нет перевода на язык пользователя — показываем английский.
const CONTENT_FALLBACK_LOCALE: Locale = "en";

// Короткая запись урока: id, уровень и время в минутах.
function lesson(id: LessonId, level: LessonLevel, minutes: number): LessonData {
  return { id, level, minutes };
}

// Структура: какие направления, какие в них уроки, уровень и время.
// Тексты — в файлах языков (ru.ts, en.ts, es.ts).
export const TRACKS: TrackData[] = [
  {
    id: "texts",
    premium: false,
    lessons: [lesson("1", 1, 5), lesson("2", 1, 5), lesson("3", 2, 7)],
  },
  {
    id: "images",
    premium: false,
    lessons: [lesson("4", 1, 7), lesson("5", 1, 7), lesson("6", 2, 10)],
  },
  {
    id: "video",
    premium: false,
    lessons: [lesson("7", 1, 8), lesson("8", 2, 10), lesson("9", 2, 10)],
  },
  {
    id: "voice",
    premium: false,
    lessons: [lesson("10", 1, 7), lesson("11", 2, 8), lesson("12", 2, 8)],
  },
  {
    id: "safety",
    premium: false,
    lessons: [lesson("13", 1, 7), lesson("14", 2, 8), lesson("15", 1, 6)],
  },
  {
    id: "work-admin",
    premium: true,
    lessons: [lesson("16", 2, 10), lesson("17", 2, 10), lesson("18", 2, 8)],
  },
  {
    id: "work-management",
    premium: true,
    lessons: [lesson("19", 3, 10), lesson("20", 3, 10), lesson("21", 3, 10)],
  },
];

// ---------- Урок и направление на нужном языке ----------

function localizeLesson(data: LessonData, locale: Locale): Lesson {
  const content: LessonContent | undefined =
    LOCALES[locale].lessons[data.id].content ??
    LOCALES[CONTENT_FALLBACK_LOCALE].lessons[data.id].content;

  return {
    id: data.id,
    title: LOCALES[locale].lessons[data.id].title,
    level: data.level,
    minutes: data.minutes,
    content,
  };
}

export function getTracks(locale: Locale): Track[] {
  return TRACKS.map((track) => ({
    id: track.id,
    title: LOCALES[locale].tracks[track.id],
    premium: track.premium,
    lessons: track.lessons.map((item) => localizeLesson(item, locale)),
  }));
}

// id приходит из адреса (/lesson/4), поэтому это обычная строка.
export function getLesson(id: string, locale: Locale): Lesson | undefined {
  const data = TRACKS.flatMap((track) => track.lessons).find(
    (item) => item.id === id,
  );
  return data ? localizeLesson(data, locale) : undefined;
}

// Пройденный урок важнее всего: его можно открыть снова.
// «Подписка» важнее «Скоро»: пусть человек сразу видит, что направление платное.
export function getLessonStatus(
  lesson: Lesson,
  track: Track,
  completed: boolean,
): LessonStatus {
  if (completed) return "completed";
  if (track.premium) return "premium";
  if (!lesson.content) return "soon";
  return "available";
}

// Главный инструмент урока — первый в карточке tool. Нужен практике для кнопки «Открыть …».
export function getLessonTool(content: LessonContent): ToolLink | undefined {
  return content.cards.find((card) => card.type === "tool")?.tools[0];
}
