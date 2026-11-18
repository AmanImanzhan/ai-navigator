import "server-only";

import { getTemplateFields, type Json, type Tables } from "@ai-navigator/shared";

import type { AdminContext } from "@/lib/admin/auth";
import { CONTENT_LOCALES, type ContentLocale } from "@/lib/admin/locales";

// Чтение контента для админки. Через secret key: админ видит и скрытые уроки (RLS их прячет).
// Каждая функция принимает AdminContext — значит, её нельзя вызвать без проверки админа.

function fail(what: string, error: { code: string }): never {
  throw new Error(`Не удалось загрузить ${what}: ${error.code}`);
}

// Название на русском, иначе на английском, иначе любое.
function pickTitle(
  rows: { locale: ContentLocale; title: string }[],
): string | null {
  for (const locale of CONTENT_LOCALES) {
    const row = rows.find((item) => item.locale === locale);
    if (row?.title) return row.title;
  }
  return null;
}

// ---------- Обзор ----------

export type AdminStats = {
  users: number;
  aiRequestsToday: number;
  aiRequests7d: number;
  aiUsersToday: number;
  lessonsPublished: number;
  lessonsTotal: number;
  templatesTotal: number;
};

export type AuditEntry = Pick<
  Tables<"admin_audit_log">,
  "id" | "admin_email" | "action" | "entity_id" | "locale" | "details" | "created_at"
>;

export async function loadOverview(
  { db }: AdminContext,
): Promise<{ stats: AdminStats; recent: AuditEntry[] }> {
  const [stats, lessons, templates, recent] = await Promise.all([
    db.rpc("admin_stats"),
    db.from("lessons").select("published"),
    db.from("templates").select("id", { count: "exact", head: true }),
    db
      .from("admin_audit_log")
      .select("id, admin_email, action, entity_id, locale, details, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);
  if (stats.error) fail("статистику", stats.error);
  if (lessons.error) fail("уроки", lessons.error);
  if (templates.error) fail("шаблоны", templates.error);
  if (recent.error) fail("журнал", recent.error);

  const row = stats.data[0];
  return {
    stats: {
      users: Number(row?.users ?? 0),
      aiRequestsToday: Number(row?.ai_requests_today ?? 0),
      aiRequests7d: Number(row?.ai_requests_7d ?? 0),
      aiUsersToday: Number(row?.ai_users_today ?? 0),
      lessonsPublished: lessons.data.filter((lesson) => lesson.published).length,
      lessonsTotal: lessons.data.length,
      templatesTotal: templates.count ?? 0,
    },
    recent: recent.data,
  };
}

// ---------- Уроки ----------

export type LessonListItem = {
  id: string;
  title: string;
  level: number;
  minutes: number;
  published: boolean;
  // На каких языках есть содержимое (карточки).
  contentLocales: ContentLocale[];
};

export type TrackWithLessons = {
  id: string;
  title: string;
  premium: boolean;
  lessons: LessonListItem[];
};

export async function loadLessonList({
  db,
}: AdminContext): Promise<TrackWithLessons[]> {
  const [tracks, trackTexts, lessons, lessonTexts] = await Promise.all([
    db.from("tracks").select("id, sort, premium").order("sort"),
    db.from("track_translations").select("track_id, locale, title"),
    db
      .from("lessons")
      .select("id, track_id, sort, level, minutes, published")
      .order("sort"),
    db.from("lesson_translations").select("lesson_id, locale, title, content"),
  ]);
  if (tracks.error) fail("направления", tracks.error);
  if (trackTexts.error) fail("названия направлений", trackTexts.error);
  if (lessons.error) fail("уроки", lessons.error);
  if (lessonTexts.error) fail("тексты уроков", lessonTexts.error);

  return tracks.data.map((track) => ({
    id: track.id,
    premium: track.premium,
    title:
      pickTitle(trackTexts.data.filter((row) => row.track_id === track.id)) ??
      track.id,
    lessons: lessons.data
      .filter((lesson) => lesson.track_id === track.id)
      .map((lesson) => {
        const texts = lessonTexts.data.filter(
          (row) => row.lesson_id === lesson.id,
        );
        return {
          id: lesson.id,
          title: pickTitle(texts) ?? `Урок ${lesson.id}`,
          level: lesson.level,
          minutes: lesson.minutes,
          published: lesson.published,
          contentLocales: CONTENT_LOCALES.filter((locale) =>
            texts.some((row) => row.locale === locale && row.content !== null),
          ),
        };
      }),
  }));
}

// Урок на одном языке. Нет строки — пустые значения.
export type LessonLocaleData = {
  title: string;
  content: Json | null;
  note: string;
};

export type LessonDetails = {
  id: string;
  title: string;
  trackTitle: string;
  level: number;
  minutes: number;
  published: boolean;
  locales: Record<ContentLocale, LessonLocaleData>;
};

export async function loadLesson(
  { db }: AdminContext,
  lessonId: string,
): Promise<LessonDetails | null> {
  const lesson = await db
    .from("lessons")
    .select("id, track_id, level, minutes, published")
    .eq("id", lessonId)
    .maybeSingle();
  if (lesson.error) fail("урок", lesson.error);
  if (!lesson.data) return null;

  const [texts, notes, trackTexts] = await Promise.all([
    db
      .from("lesson_translations")
      .select("locale, title, content")
      .eq("lesson_id", lessonId),
    db.from("lesson_notes").select("locale, text").eq("lesson_id", lessonId),
    db
      .from("track_translations")
      .select("locale, title")
      .eq("track_id", lesson.data.track_id),
  ]);
  if (texts.error) fail("тексты урока", texts.error);
  if (notes.error) fail("заметки урока", notes.error);
  if (trackTexts.error) fail("название направления", trackTexts.error);

  const locales = Object.fromEntries(
    CONTENT_LOCALES.map((locale) => {
      const text = texts.data.find((row) => row.locale === locale);
      const note = notes.data.find((row) => row.locale === locale);
      return [
        locale,
        {
          title: text?.title ?? "",
          content: text?.content ?? null,
          note: note?.text ?? "",
        },
      ];
    }),
  ) as Record<ContentLocale, LessonLocaleData>;

  return {
    id: lesson.data.id,
    title: pickTitle(texts.data) ?? `Урок ${lessonId}`,
    trackTitle: pickTitle(trackTexts.data) ?? lesson.data.track_id,
    level: lesson.data.level,
    minutes: lesson.data.minutes,
    published: lesson.data.published,
    locales,
  };
}

// ---------- Шаблоны ----------

export type TemplateText = {
  title: string;
  purpose: string;
  prompt: string;
  example: string;
  tools: Json;
};

export type TemplateListItem = {
  id: string;
  lessonId: string;
  lessonTitle: string;
  title: string;
  published: boolean;
  // Сколько [полей] в каждом языке (null — языка нет).
  fieldCounts: Record<ContentLocale, number | null>;
};

// Шаблоны с поиском по номеру, названию и тексту запроса на всех языках.
export async function loadTemplateList(
  { db }: AdminContext,
  query: string,
): Promise<TemplateListItem[]> {
  const [templates, texts, lessons, lessonTexts] = await Promise.all([
    db.from("templates").select("id, lesson_id, sort, published"),
    db
      .from("template_translations")
      .select("template_id, locale, title, purpose, prompt"),
    db.from("lessons").select("id, sort"),
    db.from("lesson_translations").select("lesson_id, locale, title"),
  ]);
  if (templates.error) fail("шаблоны", templates.error);
  if (texts.error) fail("тексты шаблонов", texts.error);
  if (lessons.error) fail("уроки", lessons.error);
  if (lessonTexts.error) fail("названия уроков", lessonTexts.error);

  const needle = query.trim().toLocaleLowerCase("ru");
  const lessonOrder = new Map(lessons.data.map((lesson) => [lesson.id, lesson.sort]));

  return templates.data
    .map((template) => {
      const own = texts.data.filter((row) => row.template_id === template.id);
      return { template, own };
    })
    .filter(({ template, own }) => {
      if (!needle) return true;
      const haystack = [
        template.id,
        ...own.flatMap((row) => [row.title, row.purpose, row.prompt]),
      ]
        .join("\n")
        .toLocaleLowerCase("ru");
      return haystack.includes(needle);
    })
    .sort(
      (a, b) =>
        (lessonOrder.get(a.template.lesson_id) ?? 0) -
          (lessonOrder.get(b.template.lesson_id) ?? 0) ||
        a.template.sort - b.template.sort,
    )
    .map(({ template, own }) => ({
      id: template.id,
      lessonId: template.lesson_id,
      lessonTitle:
        pickTitle(
          lessonTexts.data.filter((row) => row.lesson_id === template.lesson_id),
        ) ?? `Урок ${template.lesson_id}`,
      title: pickTitle(own) ?? template.id,
      published: template.published,
      fieldCounts: Object.fromEntries(
        CONTENT_LOCALES.map((locale) => {
          const row = own.find((item) => item.locale === locale);
          return [locale, row ? getTemplateFields(row.prompt).length : null];
        }),
      ) as Record<ContentLocale, number | null>,
    }));
}

export type TemplateDetails = {
  id: string;
  lessonId: string;
  title: string;
  texts: Record<ContentLocale, TemplateText>;
};

const EMPTY_TEXT: TemplateText = {
  title: "",
  purpose: "",
  prompt: "",
  example: "",
  tools: [],
};

export async function loadTemplate(
  { db }: AdminContext,
  templateId: string,
): Promise<TemplateDetails | null> {
  const template = await db
    .from("templates")
    .select("id, lesson_id")
    .eq("id", templateId)
    .maybeSingle();
  if (template.error) fail("шаблон", template.error);
  if (!template.data) return null;

  const texts = await db
    .from("template_translations")
    .select("locale, title, purpose, prompt, example, tools")
    .eq("template_id", templateId);
  if (texts.error) fail("тексты шаблона", texts.error);

  return {
    id: template.data.id,
    lessonId: template.data.lesson_id,
    title: pickTitle(texts.data) ?? templateId,
    texts: Object.fromEntries(
      CONTENT_LOCALES.map((locale) => {
        const row = texts.data.find((item) => item.locale === locale);
        return [
          locale,
          row
            ? {
                title: row.title,
                purpose: row.purpose,
                prompt: row.prompt,
                example: row.example,
                tools: row.tools,
              }
            : EMPTY_TEXT,
        ];
      }),
    ) as Record<ContentLocale, TemplateText>,
  };
}
