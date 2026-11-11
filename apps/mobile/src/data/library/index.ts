import type { LessonId, Locale } from "@/data/lessons";
import {
  CAPCUT,
  CHATGPT,
  CLAUDE,
  COPILOT,
  DREAMINA,
  ELEVENLABS,
  EXCEL,
  GEMINI,
  GOOGLE_LENS,
  GOOGLE_SHEETS,
  GOOGLE_TRANSLATE,
  HEYGEN,
  IDEOGRAM,
  KLING,
  PERPLEXITY,
} from "@/data/lessons/tools";
import { EN } from "@/data/library/en";
import { ES } from "@/data/library/es";
import { RU } from "@/data/library/ru";
import type {
  ConceptData,
  LibraryConcept,
  LibraryTool,
  LocaleLibrary,
  ToolCategory,
  ToolData,
  ToolId,
} from "@/data/library/types";

export type * from "@/data/library/types";

const LOCALES: Record<Locale, LocaleLibrary> = { ru: RU, en: EN, es: ES };

// Когда последний раз сверяли факты с официальными сайтами.
const CHECKED_AT = "2026-11-11";

// Порядок категорий на экране.
export const TOOL_CATEGORIES: ToolCategory[] = [
  "assistants",
  "search",
  "images",
  "video",
  "voice",
  "translation",
  "spreadsheets",
];

function tool(
  id: ToolId,
  category: ToolCategory,
  url: string,
  lessonIds: LessonId[],
): ToolData {
  return { id, category, url, lessonIds, checkedAt: CHECKED_AT };
}

// Структура инструментов: категория, сайт и уроки, где инструмент встречается.
export const TOOLS: ToolData[] = [
  tool("chatgpt", "assistants", CHATGPT.url, [
    "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "17", "18", "19", "20", "21",
  ]),
  tool("claude", "assistants", CLAUDE.url, [
    "1", "2", "3", "17", "18", "19", "20", "21",
  ]),
  tool("gemini", "assistants", GEMINI.url, [
    "1", "2", "4", "5", "7", "12", "16", "18",
  ]),
  tool("copilot", "assistants", COPILOT.url, []),
  tool("perplexity", "search", PERPLEXITY.url, []),
  tool("ideogram", "images", IDEOGRAM.url, ["4", "6"]),
  tool("kling", "video", KLING.url, ["7", "9"]),
  tool("dreamina", "video", DREAMINA.url, ["7", "9"]),
  tool("heygen", "video", HEYGEN.url, ["8"]),
  tool("capcut", "video", CAPCUT.url, ["9"]),
  tool("elevenlabs", "voice", ELEVENLABS.url, ["11", "12"]),
  tool("google-translate", "translation", GOOGLE_TRANSLATE.ru.url, ["10"]),
  tool("google-lens", "translation", GOOGLE_LENS.ru.url, ["14"]),
  tool("google-sheets", "spreadsheets", GOOGLE_SHEETS.ru.url, ["16"]),
  tool("excel", "spreadsheets", EXCEL.url, ["16"]),
];

export const CONCEPTS: ConceptData[] = [
  { id: "model", lessonIds: ["1"] },
  { id: "chatbot-vs-agent", lessonIds: ["1"] },
  { id: "prompt", lessonIds: ["1"] },
  { id: "context", lessonIds: ["1", "2"] },
  { id: "hallucinations", lessonIds: ["3", "19"] },
  { id: "multimodal", lessonIds: ["3", "5", "10"] },
  { id: "plans-and-limits", lessonIds: ["7", "9", "11"] },
  { id: "privacy", lessonIds: ["3", "15"] },
  { id: "one-company-many-products", lessonIds: [] },
  { id: "skills-and-connectors", lessonIds: [] },
  { id: "image-generation", lessonIds: ["4", "6"] },
  { id: "deepfakes", lessonIds: ["13", "14"] },
];

// ---------- На нужном языке ----------

export function getTools(locale: Locale): LibraryTool[] {
  const texts = LOCALES[locale];
  return TOOLS.map((data) => ({
    ...texts.tools[data.id],
    ...data,
    categoryTitle: texts.categories[data.category],
  }));
}

export function getTool(id: string, locale: Locale): LibraryTool | undefined {
  return getTools(locale).find((item) => item.id === id);
}

export function getConcepts(locale: Locale): LibraryConcept[] {
  return CONCEPTS.map((data) => ({
    ...LOCALES[locale].concepts[data.id],
    ...data,
  }));
}

export function getConcept(
  id: string,
  locale: Locale,
): LibraryConcept | undefined {
  return getConcepts(locale).find((item) => item.id === id);
}

export function getCategoryTitle(
  category: ToolCategory,
  locale: Locale,
): string {
  return LOCALES[locale].categories[category];
}

// Инструмент из урока → его страница в Справочнике. Сравниваем по адресу сайта.
export function getLibraryToolId(url: string): ToolId | undefined {
  return TOOLS.find((item) => item.url === url)?.id;
}
