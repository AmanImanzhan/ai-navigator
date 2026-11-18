import { getTemplateFields } from "../templates";
import { CARD_TYPE_LABELS, fieldLabel, type LessonCardType } from "./labels";
import type { LessonContent, ToolLink } from "./types";

// Проверка контента уроков и шаблонов. Один код для приложения и админки сайта:
// - приложение проверяет то, что пришло из базы (isLessonContent, isToolList) — битое не покажет;
// - админка проверяет перед сохранением и показывает список ошибок (lessonContentIssues и др.).
// Правило: что не пропустит приложение, то админка не даст сохранить.

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Непустая строка.
function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export function isLessonLevel(value: number): value is 1 | 2 | 3 {
  return value === 1 || value === 2 || value === 3;
}

// ---------- Сбор ошибок ----------

// Ошибки копятся с «адресом»: «Карточка 3 («Проверка») → Варианты ответа, пункт 2: …».
class Issues {
  readonly messages: string[] = [];

  add(path: string[], message: string) {
    this.messages.push(path.length > 0 ? `${path.join(" → ")}: ${message}` : message);
  }

  // Обязательный текст.
  required(path: string[], record: UnknownRecord, key: string) {
    if (!isString(record[key])) {
      this.add(path, `не заполнено поле «${fieldLabel(key)}»`);
    }
  }

  // Необязательный текст: либо поля нет, либо непустая строка.
  optional(path: string[], record: UnknownRecord, key: string) {
    const value = record[key];
    if (value !== undefined && !isString(value)) {
      this.add(path, `поле «${fieldLabel(key)}» должно быть текстом или отсутствовать`);
    }
  }

  // Непустой список; каждый элемент проверяет check.
  list(
    path: string[],
    record: UnknownRecord,
    key: string,
    check: (item: unknown, itemPath: string[]) => void,
  ) {
    const value = record[key];
    const listPath = [...path, fieldLabel(key)];
    if (!Array.isArray(value) || value.length === 0) {
      this.add(listPath, "нужен хотя бы один пункт");
      return;
    }
    value.forEach((item, index) => check(item, [...listPath, `пункт ${index + 1}`]));
  }

  // Объект с полями.
  object(
    path: string[],
    value: unknown,
    check: (record: UnknownRecord) => void,
  ) {
    if (!isRecord(value)) {
      this.add(path, "должен быть объектом с полями");
      return;
    }
    check(value);
  }
}

function checkToolLink(issues: Issues, value: unknown, path: string[]) {
  issues.object(path, value, (tool) => {
    issues.required(path, tool, "name");
    issues.required(path, tool, "url");
  });
}

function checkShare(issues: Issues, card: UnknownRecord, path: string[]) {
  if (card.share === undefined) return;
  const sharePath = [...path, fieldLabel("share")];
  issues.object(sharePath, card.share, (share) => {
    issues.required(sharePath, share, "label");
    issues.required(sharePath, share, "message");
  });
}

// Каждый тип карточки — свой набор обязательных полей, как в content/types.ts.
function checkCard(issues: Issues, value: unknown, index: number) {
  const base = [`Карточка ${index + 1}`];
  if (!isRecord(value)) {
    issues.add(base, "должна быть объектом с полями");
    return;
  }
  const type = value.type;
  if (typeof type !== "string" || !Object.prototype.hasOwnProperty.call(CARD_TYPE_LABELS, type)) {
    // Неизвестный тип карточки: приложение не сумеет её показать.
    issues.add(base, `неизвестный тип карточки «${String(type)}»`);
    return;
  }
  const path = [`Карточка ${index + 1} («${CARD_TYPE_LABELS[type as LessonCardType]}»)`];
  const card = value;

  switch (type as LessonCardType) {
    case "result":
      issues.optional(path, card, "title");
      issues.required(path, card, "text");
      break;
    case "tool":
      issues.list(path, card, "tools", (item, itemPath) =>
        checkToolLink(issues, item, itemPath),
      );
      issues.required(path, card, "text");
      break;
    case "info":
      issues.required(path, card, "label");
      issues.optional(path, card, "title");
      issues.required(path, card, "text");
      break;
    case "howto":
      issues.optional(path, card, "label");
      issues.optional(path, card, "intro");
      if (
        card.layout !== "options" &&
        card.layout !== "steps" &&
        card.layout !== "list"
      ) {
        issues.add(path, `не выбран «${fieldLabel("layout")}»`);
      }
      issues.list(path, card, "items", (item, itemPath) =>
        issues.object(itemPath, item, (howto) => {
          issues.optional(itemPath, howto, "title");
          issues.required(itemPath, howto, "text");
        }),
      );
      issues.optional(path, card, "note");
      break;
    case "quiz":
      issues.required(path, card, "situation");
      issues.required(path, card, "question");
      issues.list(path, card, "options", (item, itemPath) =>
        issues.object(itemPath, item, (option) => {
          issues.required(itemPath, option, "text");
          if (typeof option.correct !== "boolean") {
            issues.add(itemPath, "не указано, правильный ли это ответ");
          }
        }),
      );
      if (
        Array.isArray(card.options) &&
        !card.options.some((option) => isRecord(option) && option.correct === true)
      ) {
        issues.add(path, "нет ни одного правильного варианта ответа");
      }
      issues.required(path, card, "explanation");
      break;
    case "practice":
      issues.optional(path, card, "userPrompt");
      issues.optional(path, card, "improvedLabel");
      issues.optional(path, card, "improvedPrompt");
      checkShare(issues, card, path);
      if (card.followUp !== undefined) {
        const followPath = [...path, fieldLabel("followUp")];
        issues.object(followPath, card.followUp, (followUp) => {
          issues.required(followPath, followUp, "hint");
          issues.required(followPath, followUp, "prompt");
        });
      }
      issues.optional(path, card, "note");
      break;
    case "summary":
      issues.required(path, card, "formula");
      issues.optional(path, card, "text");
      checkShare(issues, card, path);
      break;
  }
}

// ---------- Уроки ----------

// Что не так с содержимым урока. Пустой список — всё в порядке.
export function lessonContentIssues(value: unknown): string[] {
  const issues = new Issues();
  if (!isRecord(value)) {
    issues.add([], "содержимое урока должно быть объектом с карточками");
    return issues.messages;
  }
  issues.optional([], value, "skill");
  issues.optional([], value, "helperCriteria");
  if (!Array.isArray(value.cards) || value.cards.length === 0) {
    issues.add([], "в уроке нет ни одной карточки");
  } else {
    value.cards.forEach((card, index) => checkCard(issues, card, index));
  }
  return issues.messages;
}

export function isLessonContent(value: unknown): value is LessonContent {
  return lessonContentIssues(value).length === 0;
}

// ---------- Инструменты (в карточках и шаблонах) ----------

export function isToolLink(value: unknown): value is ToolLink {
  return isRecord(value) && isString(value.name) && isString(value.url);
}

// Непустой список инструментов.
export function isToolList(value: unknown): value is ToolLink[] {
  return Array.isArray(value) && value.length > 0 && value.every(isToolLink);
}

// ---------- Шаблоны (только админка: приложение проверяет список инструментов) ----------

export type TemplateTextInput = {
  title: string;
  purpose: string;
  prompt: string;
  example: string;
  tools: unknown;
};

// Что не так с шаблоном на одном языке.
export function templateTextIssues(text: TemplateTextInput): string[] {
  const issues = new Issues();
  const record: UnknownRecord = text;
  for (const key of ["title", "purpose", "prompt", "example"]) {
    issues.required([], record, key);
  }
  issues.list([], record, "tools", (item, itemPath) => {
    checkToolLink(issues, item, itemPath);
    if (isToolLink(item) && !/^https?:\/\//.test(item.url)) {
      issues.add(itemPath, "ссылка должна начинаться с https://");
    }
  });
  if (isString(text.prompt) && getTemplateFields(text.prompt).length === 0) {
    issues.add([], "в запросе нет ни одного поля в [квадратных скобках]");
  }
  return issues.messages;
}

// Поля [в скобках] на разных языках называются по-разному («[тема]», «[topic]»), поэтому
// сравниваем их число: в каждом языке человек должен заполнить одинаковое количество полей.
export function templateFieldsIssues(
  promptsByLocale: Record<string, string>,
): string[] {
  const fields = Object.entries(promptsByLocale).map(([locale, prompt]) => ({
    locale,
    fields: getTemplateFields(prompt),
  }));
  const counts = new Set(fields.map((item) => item.fields.length));
  if (counts.size <= 1) return [];
  const details = fields
    .map(
      (item) =>
        `${item.locale} — ${item.fields.length} (${item.fields.map((name) => `[${name}]`).join(", ") || "нет полей"})`,
    )
    .join("; ");
  return [`Разное число полей в [скобках] в языках: ${details}`];
}

// ---------- Очистка перед проверкой (админка) ----------

// Формы оставляют пустые строки там, где поле не заполнили. Для приложения «необязательное
// поле» — это отсутствующее поле, поэтому убираем пустые строки и опустевшие объекты
// (например, «Поделиться» без текста). Элементы списков не выбрасываем: пустой пункт —
// это ошибка, которую должна показать проверка.
export function cleanContent(value: unknown): unknown {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map((item) => {
      const cleaned = cleanContent(item);
      return cleaned === undefined ? {} : cleaned;
    });
  }
  if (isRecord(value)) {
    const result: UnknownRecord = {};
    for (const [key, item] of Object.entries(value)) {
      if (typeof item === "string" && item.trim() === "") continue;
      const cleaned = cleanContent(item);
      if (cleaned !== undefined) result[key] = cleaned;
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }
  return value;
}
