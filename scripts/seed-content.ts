// Заливает контент приложения (направления, уроки, шаблоны) в Supabase.
// Источник — файлы apps/mobile/src/data. Справочник пока остаётся в приложении.
//
// Запуск из корня репозитория: npm run seed:content
// Нужен корневой .env с SUPABASE_URL и SUPABASE_SECRET_KEY.
//
// Повторный запуск безопасен: upsert обновляет строку с тем же первичным ключом, а не добавляет новую.

import { createClient } from "@supabase/supabase-js";

import type { Database, TablesInsert } from "@ai-navigator/shared";
import { TRACKS } from "@/data/lessons";
import { EN as LESSONS_EN } from "@/data/lessons/en";
import { ES as LESSONS_ES } from "@/data/lessons/es";
import { RU as LESSONS_RU } from "@/data/lessons/ru";
import type { Locale, LocaleLessons } from "@/data/lessons/types";
import { TEMPLATE_IDS } from "@/data/templates";
import { EN as TEMPLATES_EN } from "@/data/templates/en";
import { ES as TEMPLATES_ES } from "@/data/templates/es";
import { RU as TEMPLATES_RU } from "@/data/templates/ru";
import type { LocaleTemplates } from "@/data/templates/types";

const LOCALES: Locale[] = ["en", "ru", "es"];

const LESSONS: Record<Locale, LocaleLessons> = {
  en: LESSONS_EN,
  ru: LESSONS_RU,
  es: LESSONS_ES,
};

const TEMPLATES: Record<Locale, LocaleTemplates> = {
  en: TEMPLATES_EN,
  ru: TEMPLATES_RU,
  es: TEMPLATES_ES,
};

// ---------- Подключение ----------

// Читает корневой .env (npm запускает скрипт из корня).
process.loadEnvFile();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Нет ${name} в .env — см. .env.example`);
  }
  return value;
}

// Secret key обходит RLS — поэтому скрипт может писать контент.
const supabase = createClient<Database>(
  requireEnv("SUPABASE_URL"),
  requireEnv("SUPABASE_SECRET_KEY"),
  { auth: { persistSession: false, autoRefreshToken: false } },
);

// ---------- Строки для таблиц ----------

const tracks: TablesInsert<"tracks">[] = TRACKS.map((track, index) => ({
  id: track.id,
  sort: index,
  premium: track.premium,
}));

const trackTranslations: TablesInsert<"track_translations">[] =
  LOCALES.flatMap((locale) =>
    TRACKS.map((track) => ({
      track_id: track.id,
      locale,
      title: LESSONS[locale].tracks[track.id],
    })),
  );

const ALL_LESSONS = TRACKS.flatMap((track) => track.lessons);

// Урок опубликован, если у него есть содержимое хотя бы на одном языке.
const lessons: TablesInsert<"lessons">[] = TRACKS.flatMap((track) =>
  track.lessons.map((lesson, index) => ({
    id: lesson.id,
    track_id: track.id,
    sort: index,
    level: lesson.level,
    minutes: lesson.minutes,
    published: LOCALES.some(
      (locale) => LESSONS[locale].lessons[lesson.id].content !== undefined,
    ),
  })),
);

const lessonTranslations: TablesInsert<"lesson_translations">[] =
  LOCALES.flatMap((locale) =>
    ALL_LESSONS.map((lesson) => {
      const translation = LESSONS[locale].lessons[lesson.id];
      return {
        lesson_id: lesson.id,
        locale,
        title: translation.title,
        content: translation.content ?? null,
      };
    }),
  );

const lessonNotes: TablesInsert<"lesson_notes">[] = LOCALES.flatMap((locale) =>
  Object.entries(TEMPLATES[locale].lessonNotes).map(([lessonId, text]) => ({
    lesson_id: lessonId,
    locale,
    text,
  })),
);

// "2.3" → урок "2", номер 3.
const templates: TablesInsert<"templates">[] = TEMPLATE_IDS.map((id) => {
  const [lessonId, number] = id.split(".");
  return {
    id,
    lesson_id: lessonId,
    sort: Number(number),
    published: true,
  };
});

const templateTranslations: TablesInsert<"template_translations">[] =
  LOCALES.flatMap((locale) =>
    TEMPLATE_IDS.flatMap((id) => {
      const text = TEMPLATES[locale].templates[id];
      if (!text) return [];
      return {
        template_id: id,
        locale,
        title: text.title,
        purpose: text.purpose,
        prompt: text.prompt,
        example: text.example,
        tools: text.tools,
      };
    }),
  );

// ---------- Заливка ----------

// Ошибка базы — останавливаемся сразу, чтобы не заливать дальше на сломанное.
function check(table: string, count: number, error: { message: string } | null) {
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`✓ ${table}: ${count}`);
}

// Порядок важен: сначала строки, на которые ссылаются другие (направление → урок → шаблон).
// onConflict — первичный ключ: по нему upsert находит уже залитую строку.
async function seed() {
  let result = await supabase
    .from("tracks")
    .upsert(tracks, { onConflict: "id" });
  check("tracks", tracks.length, result.error);

  result = await supabase
    .from("track_translations")
    .upsert(trackTranslations, { onConflict: "track_id,locale" });
  check("track_translations", trackTranslations.length, result.error);

  result = await supabase
    .from("lessons")
    .upsert(lessons, { onConflict: "id" });
  check("lessons", lessons.length, result.error);

  result = await supabase
    .from("lesson_translations")
    .upsert(lessonTranslations, { onConflict: "lesson_id,locale" });
  check("lesson_translations", lessonTranslations.length, result.error);

  result = await supabase
    .from("lesson_notes")
    .upsert(lessonNotes, { onConflict: "lesson_id,locale" });
  check("lesson_notes", lessonNotes.length, result.error);

  result = await supabase
    .from("templates")
    .upsert(templates, { onConflict: "id" });
  check("templates", templates.length, result.error);

  result = await supabase
    .from("template_translations")
    .upsert(templateTranslations, { onConflict: "template_id,locale" });
  check("template_translations", templateTranslations.length, result.error);
}

seed().catch((error: unknown) => {
  console.error("Ошибка заливки:", error instanceof Error ? error.message : error);
  process.exit(1);
});
