import type { AiLocale } from "@ai-navigator/shared";

import { fillPromptEn } from "@/lib/ai/prompts/fill.en";
import { fillPromptEs } from "@/lib/ai/prompts/fill.es";
import { fillPromptRu } from "@/lib/ai/prompts/fill.ru";
import { tryPromptEn } from "@/lib/ai/prompts/try.en";
import { tryPromptEs } from "@/lib/ai/prompts/try.es";
import { tryPromptRu } from "@/lib/ai/prompts/try.ru";
import type {
  FillPromptContext,
  TryPromptContext,
} from "@/lib/ai/prompts/types";

export type * from "@/lib/ai/prompts/types";

// Системные промпты на языке приложения. Record не даст забыть язык.
const TRY_PROMPTS: Record<AiLocale, (ctx: TryPromptContext) => string> = {
  en: tryPromptEn,
  ru: tryPromptRu,
  es: tryPromptEs,
};

const FILL_PROMPTS: Record<AiLocale, (ctx: FillPromptContext) => string> = {
  en: fillPromptEn,
  ru: fillPromptRu,
  es: fillPromptEs,
};

export function buildTryPrompt(locale: AiLocale, ctx: TryPromptContext) {
  return TRY_PROMPTS[locale](ctx);
}

export function buildFillPrompt(locale: AiLocale, ctx: FillPromptContext) {
  return FILL_PROMPTS[locale](ctx);
}

// Текст человека — отдельным сообщением, в теге: так модель не путает его с инструкциями.
export function wrapUserText(tag: "prompt" | "situation", text: string) {
  return `<${tag}>\n${text}\n</${tag}>`;
}
