import type { LessonId, ToolLink } from "@/data/lessons";

// Номер шаблона внутри урока: у каждого урока по 5 шаблонов.
export type TemplateNumber = 1 | 2 | 3 | 4 | 5;

// id шаблона = «урок.номер», например "2.3". TypeScript знает все 105 вариантов.
export type TemplateId = `${LessonId}.${TemplateNumber}`;

// Тексты шаблона на одном языке.
export type TemplateText = {
  title: string;
  // Для чего пригодится.
  purpose: string;
  tools: ToolLink[];
  // Готовый запрос. Поля для заполнения — в [квадратных скобках].
  prompt: string;
  // Что человек получит.
  example: string;
};

// Шаблоны на одном языке (файлы ru.ts, en.ts, es.ts).
// lessonNotes — общее предупреждение для всех шаблонов урока, например «закройте номера счетов».
export type LocaleTemplates = {
  lessonNotes: Partial<Record<LessonId, string>>;
  templates: Partial<Record<TemplateId, TemplateText>>;
};

// Основной язык (ru) обязан содержать все 105 шаблонов — иначе ошибка tsc.
export type CompleteLocaleTemplates = LocaleTemplates & {
  templates: Record<TemplateId, TemplateText>;
};

// Шаблон на одном языке — с ним работают экраны.
export type PromptTemplate = TemplateText & {
  id: TemplateId;
  lessonId: LessonId;
  lessonNote?: string;
};
