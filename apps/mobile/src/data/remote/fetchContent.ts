import { CONTENT_FALLBACK_LOCALE, type Locale } from "@/data/lessons";
import {
  buildSnapshot,
  type ContentSnapshot,
} from "@/data/remote/buildSnapshot";
import { supabase } from "@/lib/supabase";

// Сколько ждём ответа базы. Плохая сеть не должна держать загрузку бесконечно.
const TIMEOUT_MS = 15_000;

// Загружает уроки и шаблоны на языке пользователя (и английский — на случай, если перевода нет).
// Возвращает null, если Supabase не настроен. При ошибке сети или битых данных — бросает ошибку.
export async function fetchContent(
  locale: Locale,
): Promise<ContentSnapshot | null> {
  if (!supabase) return null;

  const locales = Array.from(new Set([locale, CONTENT_FALLBACK_LOCALE]));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const signal = controller.signal;

  try {
    // Семь запросов параллельно. RLS сам отдаёт только опубликованное.
    const [
      tracks,
      trackTranslations,
      lessons,
      lessonTranslations,
      lessonNotes,
      templates,
      templateTranslations,
    ] = await Promise.all([
      supabase.from("tracks").select("id, sort, premium").abortSignal(signal),
      supabase
        .from("track_translations")
        .select("track_id, locale, title")
        .in("locale", locales)
        .abortSignal(signal),
      supabase
        .from("lessons")
        .select("id, track_id, sort, level, minutes")
        .abortSignal(signal),
      supabase
        .from("lesson_translations")
        .select("lesson_id, locale, title, content")
        .in("locale", locales)
        .abortSignal(signal),
      supabase
        .from("lesson_notes")
        .select("lesson_id, locale, text")
        .in("locale", locales)
        .abortSignal(signal),
      supabase
        .from("templates")
        .select("id, lesson_id, sort")
        .abortSignal(signal),
      supabase
        .from("template_translations")
        .select("template_id, locale, title, purpose, prompt, example, tools")
        .in("locale", locales)
        .abortSignal(signal),
    ]);

    // Хоть один запрос не удался — не собираем снимок из половины данных.
    const error =
      tracks.error ??
      trackTranslations.error ??
      lessons.error ??
      lessonTranslations.error ??
      lessonNotes.error ??
      templates.error ??
      templateTranslations.error;
    if (error) throw new Error(error.message);

    return buildSnapshot(
      {
        tracks: tracks.data ?? [],
        trackTranslations: trackTranslations.data ?? [],
        lessons: lessons.data ?? [],
        lessonTranslations: lessonTranslations.data ?? [],
        lessonNotes: lessonNotes.data ?? [],
        templates: templates.data ?? [],
        templateTranslations: templateTranslations.data ?? [],
      },
      locale,
      Date.now(),
    );
  } finally {
    clearTimeout(timer);
  }
}
