import type { LessonId } from "@/data/lessons";

// ---------- Структура: одинакова для всех языков ----------

export type ToolCategory =
  | "assistants"
  | "search"
  | "images"
  | "video"
  | "voice"
  | "translation"
  | "spreadsheets";

export type ToolId =
  | "chatgpt"
  | "claude"
  | "gemini"
  | "copilot"
  | "perplexity"
  | "ideogram"
  | "kling"
  | "dreamina"
  | "heygen"
  | "capcut"
  | "elevenlabs"
  | "google-translate"
  | "google-lens"
  | "google-sheets"
  | "excel";

export type ConceptId =
  | "model"
  | "chatbot-vs-agent"
  | "prompt"
  | "context"
  | "hallucinations"
  | "multimodal"
  | "plans-and-limits"
  | "privacy"
  | "one-company-many-products"
  | "skills-and-connectors"
  | "image-generation"
  | "deepfakes";

export type ToolData = {
  id: ToolId;
  category: ToolCategory;
  // Официальный сайт. Название инструмента — в текстах языка.
  url: string;
  lessonIds: LessonId[];
  // Когда сверяли факты с официальным сайтом: "2026-11-11".
  checkedAt: string;
};

export type ConceptData = {
  id: ConceptId;
  lessonIds: LessonId[];
};

// ---------- Тексты на одном языке (ru.ts, en.ts, es.ts) ----------

export type ToolText = {
  name: string;
  // Что это — 1–2 предложения.
  about: string;
  // Чем хорош — короткие пункты.
  strengths: string[];
  // Что можно без оплаты.
  free: string;
  // Важно знать — ограничения.
  notes: string[];
};

export type ConceptText = {
  title: string;
  text: string;
  example: string;
};

// Record требует все id: забыть перевод инструмента или понятия не получится.
export type LocaleLibrary = {
  categories: Record<ToolCategory, string>;
  tools: Record<ToolId, ToolText>;
  concepts: Record<ConceptId, ConceptText>;
};

// ---------- На одном языке — с этим работают экраны ----------

export type LibraryTool = ToolText & {
  id: ToolId;
  category: ToolCategory;
  categoryTitle: string;
  url: string;
  lessonIds: LessonId[];
  checkedAt: string;
};

export type LibraryConcept = ConceptText & {
  id: ConceptId;
  lessonIds: LessonId[];
};
