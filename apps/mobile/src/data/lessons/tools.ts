import type { Locale, ToolLink } from "@/data/lessons/types";

// Официальные сайты инструментов. Используются и в уроках, и в шаблонах запросов.

// ---------- Названия одинаковые на всех языках ----------

export const CHATGPT: ToolLink = { name: "ChatGPT", url: "https://chatgpt.com" };
export const GEMINI: ToolLink = {
  name: "Gemini",
  url: "https://gemini.google.com",
};
export const CLAUDE: ToolLink = { name: "Claude", url: "https://claude.ai" };
export const IDEOGRAM: ToolLink = {
  name: "Ideogram",
  url: "https://ideogram.ai",
};
export const KLING: ToolLink = { name: "Kling", url: "https://klingai.com" };
export const DREAMINA: ToolLink = {
  name: "Dreamina",
  url: "https://dreamina.capcut.com",
};
export const HEYGEN: ToolLink = {
  name: "HeyGen",
  url: "https://www.heygen.com",
};
export const ELEVENLABS: ToolLink = {
  name: "ElevenLabs",
  url: "https://elevenlabs.io",
};
export const EXCEL: ToolLink = {
  name: "Excel",
  url: "https://excel.cloud.microsoft",
};
export const COPILOT: ToolLink = {
  name: "Microsoft Copilot",
  url: "https://copilot.microsoft.com",
};
export const PERPLEXITY: ToolLink = {
  name: "Perplexity",
  url: "https://www.perplexity.ai",
};
export const CAPCUT: ToolLink = { name: "CapCut", url: "https://www.capcut.com" };

// ---------- Название зависит от языка ----------

export const GOOGLE_TRANSLATE: Record<Locale, ToolLink> = {
  ru: { name: "Google Переводчик", url: "https://translate.google.com" },
  en: { name: "Google Translate", url: "https://translate.google.com" },
  es: { name: "Traductor de Google", url: "https://translate.google.com" },
};

export const GOOGLE_SHEETS: Record<Locale, ToolLink> = {
  ru: { name: "Google Таблицы", url: "https://sheets.google.com" },
  en: { name: "Google Sheets", url: "https://sheets.google.com" },
  es: { name: "Hojas de cálculo de Google", url: "https://sheets.google.com" },
};

export const GOOGLE_LENS: Record<Locale, ToolLink> = {
  ru: { name: "Google Объектив", url: "https://lens.google" },
  en: { name: "Google Lens", url: "https://lens.google" },
  es: { name: "Google Lens", url: "https://lens.google" },
};
