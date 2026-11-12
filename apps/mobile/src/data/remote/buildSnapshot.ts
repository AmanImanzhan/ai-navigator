import type { Tables } from "@ai-navigator/shared";

import {
  CONTENT_FALLBACK_LOCALE,
  isLessonId,
  isTrackId,
  type Lesson,
  type LessonContent,
  type Locale,
  type Track,
} from "@/data/lessons";
import {
  isLessonLevel,
  isLessonContent,
  isToolList,
} from "@/data/remote/validate";
import { isTemplateId, type PromptTemplate } from "@/data/templates";

// Ответ базы: строки нужных таблиц только с нужными колонками.
export type ContentRows = {
  tracks: Pick<Tables<"tracks">, "id" | "sort" | "premium">[];
  trackTranslations: Pick<
    Tables<"track_translations">,
    "track_id" | "locale" | "title"
  >[];
  lessons: Pick<
    Tables<"lessons">,
    "id" | "track_id" | "sort" | "level" | "minutes"
  >[];
  lessonTranslations: Pick<
    Tables<"lesson_translations">,
    "lesson_id" | "locale" | "title" | "content"
  >[];
  lessonNotes: Pick<Tables<"lesson_notes">, "lesson_id" | "locale" | "text">[];
  templates: Pick<Tables<"templates">, "id" | "lesson_id" | "sort">[];
  templateTranslations: Pick<
    Tables<"template_translations">,
    | "template_id"
    | "locale"
    | "title"
    | "purpose"
    | "prompt"
    | "example"
    | "tools"
  >[];
};

// Контент на одном языке — в тех же типах, что и встроенные данные. Его хранит кэш.
export type ContentSnapshot = {
  locale: Locale;
  // Когда загружен (миллисекунды).
  fetchedAt: number;
  tracks: Track[];
  templates: PromptTemplate[];
};

// Данные из базы не подошли — кэш не трогаем, остаёмся на том, что есть.
export class InvalidContentError extends Error {}

// Быстрый поиск перевода: по id и языку.
function translations<Row extends { locale: Locale }>(
  rows: Row[],
  idOf: (row: Row) => string,
) {
  const byKey = new Map(rows.map((row) => [`${idOf(row)}:${row.locale}`, row]));
  return (id: string, locale: Locale): Row | undefined =>
    byKey.get(`${id}:${locale}`);
}

const bySort = (a: { sort: number }, b: { sort: number }) => a.sort - b.sort;

export function buildSnapshot(
  rows: ContentRows,
  locale: Locale,
  fetchedAt: number,
): ContentSnapshot {
  const fallback = CONTENT_FALLBACK_LOCALE;
  const trackText = translations(rows.trackTranslations, (row) => row.track_id);
  const lessonText = translations(
    rows.lessonTranslations,
    (row) => row.lesson_id,
  );
  const noteText = translations(rows.lessonNotes, (row) => row.lesson_id);
  const templateText = translations(
    rows.templateTranslations,
    (row) => row.template_id,
  );

  // ---------- Направления и уроки ----------

  const tracks: Track[] = [...rows.tracks].sort(bySort).flatMap((track) => {
    // Незнакомое направление или без названия — пропускаем.
    const title = (trackText(track.id, locale) ?? trackText(track.id, fallback))
      ?.title;
    if (!isTrackId(track.id) || !title) return [];

    const lessons: Lesson[] = rows.lessons
      .filter((lesson) => lesson.track_id === track.id)
      .sort(bySort)
      .flatMap((lesson) => {
        const own = lessonText(lesson.id, locale);
        const english = lessonText(lesson.id, fallback);
        const title = (own ?? english)?.title;
        if (!isLessonId(lesson.id) || !isLessonLevel(lesson.level) || !title) {
          return [];
        }

        // Как во встроенных данных: содержимое на языке пользователя, а если его нет — на английском.
        const rawContent = own?.content ?? english?.content ?? null;
        let content: LessonContent | undefined;
        if (rawContent !== null) {
          if (!isLessonContent(rawContent)) {
            throw new InvalidContentError(
              `урок ${lesson.id}: битое содержимое`,
            );
          }
          content = rawContent;
        }

        return {
          id: lesson.id,
          title,
          level: lesson.level,
          minutes: lesson.minutes,
          content,
        };
      });

    // Направление без опубликованных уроков не показываем.
    if (lessons.length === 0) return [];
    return { id: track.id, title, premium: track.premium, lessons };
  });

  // ---------- Шаблоны ----------

  // Порядок шаблонов — как у уроков: сначала по урокам, внутри урока — по номеру.
  const lessonOrder = new Map<string, number>(
    tracks
      .flatMap((track) => track.lessons)
      .map((lesson, index) => [lesson.id, index]),
  );

  const templates: PromptTemplate[] = [...rows.templates]
    .sort(
      (a, b) =>
        (lessonOrder.get(a.lesson_id) ?? 0) -
          (lessonOrder.get(b.lesson_id) ?? 0) || a.sort - b.sort,
    )
    .flatMap((template) => {
      const text =
        templateText(template.id, locale) ??
        templateText(template.id, fallback);
      const lessonId = template.lesson_id;
      // Шаблон без своего урока в приложении не нужен: на него не попасть.
      if (
        !isTemplateId(template.id) ||
        !isLessonId(lessonId) ||
        !lessonOrder.has(lessonId) ||
        !text
      ) {
        return [];
      }
      if (!isToolList(text.tools)) {
        throw new InvalidContentError(
          `шаблон ${template.id}: битый список инструментов`,
        );
      }

      return {
        id: template.id,
        lessonId,
        title: text.title,
        purpose: text.purpose,
        tools: text.tools,
        prompt: text.prompt,
        example: text.example,
        lessonNote: (noteText(lessonId, locale) ?? noteText(lessonId, fallback))
          ?.text,
      };
    });

  // Пустой ответ — скорее всего, ошибка в базе. Лучше показать старые данные, чем пустой экран.
  if (tracks.length === 0 || templates.length === 0) {
    throw new InvalidContentError("пустой ответ");
  }

  return { locale, fetchedAt, tracks, templates };
}
