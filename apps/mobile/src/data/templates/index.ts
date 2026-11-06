import { TRACKS } from "@/data/lessons";
import type { LessonId, Locale } from "@/data/lessons";
import { EN } from "@/data/templates/en";
import { ES } from "@/data/templates/es";
import { RU } from "@/data/templates/ru";
import type {
  LocaleTemplates,
  PromptTemplate,
  TemplateId,
  TemplateNumber,
} from "@/data/templates/types";

export type * from "@/data/templates/types";

const LOCALES: Record<Locale, LocaleTemplates> = { ru: RU, en: EN, es: ES };

// ВРЕМЕННО: пока шаблоны не переведены, показываем русский текст.
// Когда переводы будут готовы — вернуть "en".
const FALLBACK_LOCALE: Locale = "ru";

const NUMBERS: TemplateNumber[] = [1, 2, 3, 4, 5];

// Все id шаблонов по порядку уроков: "1.1" … "21.5".
export const TEMPLATE_IDS: TemplateId[] = TRACKS.flatMap((track) =>
  track.lessons.flatMap((lesson) =>
    NUMBERS.map((number): TemplateId => `${lesson.id}.${number}`),
  ),
);

// "2.3" → "2". Формат id гарантирует тип TemplateId.
function lessonIdOf(id: TemplateId): LessonId {
  return id.split(".")[0] as LessonId;
}

function localizeTemplate(
  id: TemplateId,
  locale: Locale,
): PromptTemplate | undefined {
  const lessonId = lessonIdOf(id);
  const text =
    LOCALES[locale].templates[id] ?? LOCALES[FALLBACK_LOCALE].templates[id];
  if (!text) return undefined;

  return {
    ...text,
    id,
    lessonId,
    lessonNote:
      LOCALES[locale].lessonNotes[lessonId] ??
      LOCALES[FALLBACK_LOCALE].lessonNotes[lessonId],
  };
}

// id приходит из адреса (/template/2.3), поэтому сначала проверяем, что он настоящий.
export function isTemplateId(id: string): id is TemplateId {
  return (TEMPLATE_IDS as string[]).includes(id);
}

export function getTemplates(locale: Locale): PromptTemplate[] {
  return TEMPLATE_IDS.flatMap((id) => localizeTemplate(id, locale) ?? []);
}

export function getTemplate(
  id: string,
  locale: Locale,
): PromptTemplate | undefined {
  return isTemplateId(id) ? localizeTemplate(id, locale) : undefined;
}

export function getLessonTemplates(
  lessonId: string,
  locale: Locale,
): PromptTemplate[] {
  return getTemplates(locale).filter(
    (template) => template.lessonId === lessonId,
  );
}

// ---------- Поля для заполнения ----------

const FIELD_PATTERN = /\[([^\]]+)\]/g;

// Поля в [квадратных скобках] по порядку, без повторов: "[имя] … [имя]" → ["имя"].
export function getTemplateFields(prompt: string): string[] {
  const names = Array.from(prompt.matchAll(FIELD_PATTERN), (match) => match[1]);
  return Array.from(new Set(names));
}

// Подставляет значения в поля. Незаполненное поле остаётся в скобках: [имя].
export function fillTemplate(
  prompt: string,
  values: Record<string, string>,
): string {
  return prompt.replace(FIELD_PATTERN, (field, name: string) => {
    const value = values[name]?.trim();
    return value ? value : field;
  });
}

// Делит текст на обычные куски и поля — чтобы подсветить поля на экране.
export function splitTemplateParts(
  text: string,
): { text: string; isField: boolean }[] {
  return text
    .split(/(\[[^\]]+\])/)
    .filter((part) => part.length > 0)
    .map((part) => ({ text: part, isField: /^\[[^\]]+\]$/.test(part) }));
}
