"use server";

import {
  cleanContent,
  lessonContentIssues,
  templateFieldsIssues,
  templateTextIssues,
  type Json,
} from "@ai-navigator/shared";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { logChange } from "@/lib/admin/audit";
import { getAdminForAction } from "@/lib/admin/auth";
import { CONTENT_LOCALES, type ContentLocale } from "@/lib/admin/locales";
import { createSessionClient } from "@/lib/supabase/session";

// Действия админки (Server Actions). Каждое — обычный POST-запрос, его можно отправить и без
// интерфейса. Поэтому каждое само проверяет админа (getAdminForAction) и само проверяет данные
// той же проверкой, что и приложение (@ai-navigator/shared). Битое в базу не попадает.

export type ActionResult = { ok: true } | { ok: false; errors: string[] };

const NO_ACCESS: ActionResult = {
  ok: false,
  errors: ["Нет доступа. Войдите заново под аккаунтом админа."],
};

const BAD_REQUEST: ActionResult = {
  ok: false,
  errors: ["Неверный запрос. Обновите страницу и попробуйте ещё раз."],
};

function dbError(what: string, error: { code: string }): ActionResult {
  console.error(`admin ${what}: ${error.code}`);
  return {
    ok: false,
    errors: [`Не удалось сохранить ${what} (код ${error.code}). Попробуйте ещё раз.`],
  };
}

const LocaleSchema = z.enum(["en", "ru", "es"]);
const IdSchema = z.string().min(1).max(16);

// ---------- Вход и выход ----------

// Адрес сайта, с которого пришёл запрос: localhost, превью или основной адрес сайта на Netlify.
async function requestOrigin(): Promise<string> {
  const list = await headers();
  const origin = list.get("origin");
  if (origin) return origin;
  const host = list.get("x-forwarded-host") ?? list.get("host");
  const proto = list.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

// «Войти через Google»: Supabase отправит в Google, а потом вернёт на /admin/auth/callback.
export async function signInWithGoogle(): Promise<void> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${await requestOrigin()}/admin/auth/callback` },
  });
  if (error || !data.url) {
    console.error(`admin sign in: ${error?.code ?? "no url"}`);
    redirect("/admin/login?error=start");
  }
  redirect(data.url);
}

export async function signOut(): Promise<void> {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- Уроки ----------

// Показать урок в приложении или скрыть его (вместе с его шаблонами).
export async function setLessonPublished(
  lessonId: string,
  published: boolean,
): Promise<ActionResult> {
  const admin = await getAdminForAction();
  if (!admin) return NO_ACCESS;
  const id = IdSchema.safeParse(lessonId);
  if (!id.success || typeof published !== "boolean") return BAD_REQUEST;

  const { data, error } = await admin.db
    .from("lessons")
    .update({ published })
    .eq("id", id.data)
    .select("id");
  if (error) return dbError("статус урока", error);
  if (data.length === 0) return { ok: false, errors: ["Урок не найден."] };

  await logChange(
    admin,
    published ? "lesson.publish" : "lesson.hide",
    id.data,
    {},
  );
  revalidatePath("/admin", "layout");
  return { ok: true };
}

const LessonInputSchema = z.object({
  lessonId: IdSchema,
  locale: LocaleSchema,
  title: z.string().max(200),
  note: z.string().max(2000),
  // null — содержимого на этом языке нет (приложение покажет английское).
  content: z.unknown(),
});

export type LessonInput = z.input<typeof LessonInputSchema>;

// Сохраняет урок на одном языке: название, карточки и заметку для шаблонов урока.
export async function saveLessonTranslation(
  input: LessonInput,
): Promise<ActionResult> {
  const admin = await getAdminForAction();
  if (!admin) return NO_ACCESS;
  const parsed = LessonInputSchema.safeParse(input);
  if (!parsed.success) return BAD_REQUEST;
  const { lessonId, locale } = parsed.data;
  const title = parsed.data.title.trim();
  const note = parsed.data.note.trim();

  // Проверка — та же, что в приложении.
  const errors: string[] = [];
  if (!title) errors.push("Не заполнено название урока.");
  let content: Json | null = null;
  if (parsed.data.content !== null && parsed.data.content !== undefined) {
    const cleaned = cleanContent(parsed.data.content) ?? {};
    errors.push(...lessonContentIssues(cleaned));
    content = cleaned as Json;
  }
  if (errors.length > 0) return { ok: false, errors };

  const current = await admin.db
    .from("lesson_translations")
    .select("title, content")
    .eq("lesson_id", lessonId)
    .eq("locale", locale)
    .maybeSingle();
  if (current.error) return dbError("урок", current.error);
  const currentNote = await admin.db
    .from("lesson_notes")
    .select("text")
    .eq("lesson_id", lessonId)
    .eq("locale", locale)
    .maybeSingle();
  if (currentNote.error) return dbError("заметку", currentNote.error);

  const lesson = await admin.db
    .from("lessons")
    .select("id")
    .eq("id", lessonId)
    .maybeSingle();
  if (lesson.error) return dbError("урок", lesson.error);
  if (!lesson.data) return { ok: false, errors: ["Урок не найден."] };

  // Что поменялось — для журнала.
  const changed: string[] = [];
  if (current.data?.title !== title) changed.push("title");
  if (
    JSON.stringify(current.data?.content ?? null) !== JSON.stringify(content)
  ) {
    changed.push("content");
  }
  if ((currentNote.data?.text ?? "") !== note) changed.push("note");
  if (changed.length === 0) return { ok: true };

  const saved = await admin.db
    .from("lesson_translations")
    .upsert({ lesson_id: lessonId, locale, title, content });
  if (saved.error) return dbError("урок", saved.error);

  // Пустая заметка — удаляем строку: приложение покажет английскую (или никакой).
  const noteResult = note
    ? await admin.db
        .from("lesson_notes")
        .upsert({ lesson_id: lessonId, locale, text: note })
    : await admin.db
        .from("lesson_notes")
        .delete()
        .eq("lesson_id", lessonId)
        .eq("locale", locale);
  if (noteResult.error) return dbError("заметку", noteResult.error);

  await logChange(admin, "lesson.update", lessonId, { fields: changed }, locale);
  revalidatePath("/admin", "layout");
  return { ok: true };
}

// ---------- Шаблоны ----------

const ToolSchema = z.object({
  name: z.string().max(100),
  url: z.string().max(500),
});

const TemplateTextSchema = z.object({
  title: z.string().max(200),
  purpose: z.string().max(1000),
  prompt: z.string().max(4000),
  example: z.string().max(4000),
  tools: z.array(ToolSchema).max(10),
});

const TemplateInputSchema = z.object({
  templateId: IdSchema,
  texts: z.object({
    ru: TemplateTextSchema,
    en: TemplateTextSchema,
    es: TemplateTextSchema,
  }),
});

export type TemplateInput = z.input<typeof TemplateInputSchema>;

// Сохраняет шаблон сразу на трёх языках: так можно проверить, что [полей] везде поровну.
export async function saveTemplate(input: TemplateInput): Promise<ActionResult> {
  const admin = await getAdminForAction();
  if (!admin) return NO_ACCESS;
  const parsed = TemplateInputSchema.safeParse(input);
  if (!parsed.success) return BAD_REQUEST;
  const { templateId } = parsed.data;

  // Лишние пробелы по краям убираем; пустые инструменты (обе строки пустые) — тоже.
  const texts = Object.fromEntries(
    CONTENT_LOCALES.map((locale) => {
      const text = parsed.data.texts[locale];
      return [
        locale,
        {
          title: text.title.trim(),
          purpose: text.purpose.trim(),
          prompt: text.prompt.trim(),
          example: text.example.trim(),
          tools: text.tools
            .map((tool) => ({ name: tool.name.trim(), url: tool.url.trim() }))
            .filter((tool) => tool.name || tool.url),
        },
      ];
    }),
  ) as Record<ContentLocale, z.infer<typeof TemplateTextSchema>>;

  const errors = [
    ...CONTENT_LOCALES.flatMap((locale) =>
      templateTextIssues(texts[locale]).map((issue) => `${locale}: ${issue}`),
    ),
    ...templateFieldsIssues(
      Object.fromEntries(
        CONTENT_LOCALES.map((locale) => [locale, texts[locale].prompt]),
      ),
    ),
  ];
  if (errors.length > 0) return { ok: false, errors };

  const template = await admin.db
    .from("templates")
    .select("id")
    .eq("id", templateId)
    .maybeSingle();
  if (template.error) return dbError("шаблон", template.error);
  if (!template.data) return { ok: false, errors: ["Шаблон не найден."] };

  const current = await admin.db
    .from("template_translations")
    .select("locale, title, purpose, prompt, example, tools")
    .eq("template_id", templateId);
  if (current.error) return dbError("шаблон", current.error);

  // Что поменялось — для журнала: { ru: ["prompt"], en: ["title", "tools"] }.
  const changed: Record<string, string[]> = {};
  for (const locale of CONTENT_LOCALES) {
    const before = current.data.find((row) => row.locale === locale);
    const after = texts[locale];
    const fields = (["title", "purpose", "prompt", "example", "tools"] as const).filter(
      (key) => JSON.stringify(before?.[key] ?? null) !== JSON.stringify(after[key]),
    );
    if (fields.length > 0) changed[locale] = fields;
  }
  if (Object.keys(changed).length === 0) return { ok: true };

  const saved = await admin.db.from("template_translations").upsert(
    CONTENT_LOCALES.filter((locale) => changed[locale]).map((locale) => ({
      template_id: templateId,
      locale,
      ...texts[locale],
    })),
  );
  if (saved.error) return dbError("шаблон", saved.error);

  await logChange(admin, "template.update", templateId, { fields: changed });
  revalidatePath("/admin", "layout");
  return { ok: true };
}
