import type {
  HowtoItem,
  LessonCard,
  LessonContent,
  LessonLevel,
  PracticeFollowUp,
  QuizOption,
  ShareAction,
  ToolLink,
} from "@/data/lessons";

// Проверки данных из базы. В jsonb может лежать что угодно, а экраны ждут точную форму —
// поэтому всё, что пришло из сети, сначала проверяем, а уже потом показываем.

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

// Необязательное поле: либо его нет, либо это непустая строка.
function isOptionalString(value: unknown): boolean {
  return value === undefined || isString(value);
}

function isListOf<T>(
  value: unknown,
  check: (item: unknown) => item is T,
): value is T[] {
  return Array.isArray(value) && value.length > 0 && value.every(check);
}

export function isLessonLevel(value: number): value is LessonLevel {
  return value === 1 || value === 2 || value === 3;
}

export function isToolLink(value: unknown): value is ToolLink {
  return isRecord(value) && isString(value.name) && isString(value.url);
}

export function isToolList(value: unknown): value is ToolLink[] {
  return isListOf(value, isToolLink);
}

function isShareAction(value: unknown): value is ShareAction {
  return isRecord(value) && isString(value.label) && isString(value.message);
}

function isFollowUp(value: unknown): value is PracticeFollowUp {
  return isRecord(value) && isString(value.hint) && isString(value.prompt);
}

function isHowtoItem(value: unknown): value is HowtoItem {
  return (
    isRecord(value) && isOptionalString(value.title) && isString(value.text)
  );
}

function isQuizOption(value: unknown): value is QuizOption {
  return (
    isRecord(value) &&
    isString(value.text) &&
    typeof value.correct === "boolean"
  );
}

// Каждый тип карточки — свой набор обязательных полей, как в data/lessons/types.ts.
function isLessonCard(value: unknown): value is LessonCard {
  if (!isRecord(value)) return false;

  switch (value.type) {
    case "result":
      return isOptionalString(value.title) && isString(value.text);
    case "tool":
      return isToolList(value.tools) && isString(value.text);
    case "info":
      return (
        isString(value.label) &&
        isOptionalString(value.title) &&
        isString(value.text)
      );
    case "howto":
      return (
        isOptionalString(value.label) &&
        isOptionalString(value.intro) &&
        (value.layout === "options" ||
          value.layout === "steps" ||
          value.layout === "list") &&
        isListOf(value.items, isHowtoItem) &&
        isOptionalString(value.note)
      );
    case "quiz":
      return (
        isString(value.situation) &&
        isString(value.question) &&
        isListOf(value.options, isQuizOption) &&
        value.options.some((option) => option.correct) &&
        isString(value.explanation)
      );
    case "practice":
      return (
        isOptionalString(value.userPrompt) &&
        isOptionalString(value.improvedLabel) &&
        isOptionalString(value.improvedPrompt) &&
        (value.share === undefined || isShareAction(value.share)) &&
        (value.followUp === undefined || isFollowUp(value.followUp)) &&
        isOptionalString(value.note)
      );
    case "summary":
      return (
        isString(value.formula) &&
        isOptionalString(value.text) &&
        (value.share === undefined || isShareAction(value.share))
      );
    default:
      // Неизвестный тип карточки: старая версия приложения не сумеет её показать.
      return false;
  }
}

export function isLessonContent(value: unknown): value is LessonContent {
  return (
    isRecord(value) &&
    isOptionalString(value.skill) &&
    isOptionalString(value.helperCriteria) &&
    isListOf(value.cards, isLessonCard)
  );
}
