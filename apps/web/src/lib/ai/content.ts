import "server-only";

import {
  getTemplateFields,
  type AiLocale,
  type Database,
} from "@ai-navigator/shared";
import type { SupabaseClient } from "@supabase/supabase-js";

// Урок и шаблон для помощника берём из базы (с правами пользователя — RLS отдаёт только
// опубликованное), а не из запроса: так API нельзя использовать как бесплатный доступ к ИИ
// с произвольными инструкциями.

type Db = SupabaseClient<Database>;

const FALLBACK_LOCALE: AiLocale = "en";

function localesFor(locale: AiLocale): AiLocale[] {
  return Array.from(new Set([locale, FALLBACK_LOCALE]));
}

// Строка на языке пользователя, а если перевода нет — английская.
function pickLocale<Row extends { locale: AiLocale }>(
  rows: Row[],
  locale: AiLocale,
): Row | undefined {
  return (
    rows.find((row) => row.locale === locale) ??
    rows.find((row) => row.locale === FALLBACK_LOCALE)
  );
}

function readString(value: unknown, key: string): string | null {
  if (typeof value !== "object" || value === null || !(key in value)) {
    return null;
  }
  const field: unknown = (value as Record<string, unknown>)[key];
  return typeof field === "string" && field.trim() ? field.trim() : null;
}

export type LessonForAi = {
  title: string;
  skill: string | null;
  criteria: string | null;
};

export async function loadLessonForAi(
  db: Db,
  lessonId: string,
  locale: AiLocale,
): Promise<LessonForAi | null> {
  const { data, error } = await db
    .from("lesson_translations")
    .select("locale, title, content")
    .eq("lesson_id", lessonId)
    .in("locale", localesFor(locale));
  if (error) throw new Error(`lesson_translations: ${error.code}`);

  const row = pickLocale(data ?? [], locale);
  if (!row) return null;
  return {
    title: row.title,
    skill: readString(row.content, "skill"),
    criteria: readString(row.content, "helperCriteria"),
  };
}

export type TemplateForAi = {
  title: string;
  purpose: string;
  prompt: string;
  fields: string[];
};

export async function loadTemplateForAi(
  db: Db,
  templateId: string,
  locale: AiLocale,
): Promise<TemplateForAi | null> {
  const { data, error } = await db
    .from("template_translations")
    .select("locale, title, purpose, prompt")
    .eq("template_id", templateId)
    .in("locale", localesFor(locale));
  if (error) throw new Error(`template_translations: ${error.code}`);

  const row = pickLocale(data ?? [], locale);
  if (!row) return null;
  return {
    title: row.title,
    purpose: row.purpose,
    prompt: row.prompt,
    fields: getTemplateFields(row.prompt),
  };
}
