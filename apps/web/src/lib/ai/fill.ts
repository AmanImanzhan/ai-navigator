import { generateText, Output, type LanguageModel } from "ai";
import { z } from "zod";

import {
  AI_MAX_RETRIES,
  AI_PROVIDER_OPTIONS,
  FILL_TIMEOUT_MS,
  MAX_OUTPUT_TOKENS_FILL,
} from "@/lib/ai/config";
import { reportAiError } from "@/lib/sentry/report";

// «Заполнить с помощником»: ИИ возвращает объект строго по схеме — приложение просто
// подставит значения в поля. Имена полей в схеме — список из шаблона (enum): выдумать
// лишнее поле модель не может.

// Самое длинное значение одного поля, которое отдаём приложению.
const MAX_VALUE_CHARS = 300;

export type FillRunParams = {
  model: LanguageModel;
  instructions: string;
  userText: string;
  fields: string[];
  abortSignal?: AbortSignal;
};

export type FillRunResult =
  | { ok: true; values: Record<string, string>; tip: string }
  | { ok: false; error: "ai_unavailable" | "ai_declined" };

function fillSchema(fields: [string, ...string[]]) {
  return z.object({
    values: z.array(
      z.object({
        field: z.enum(fields),
        value: z.string(),
      }),
    ),
    tip: z.string(),
  });
}

export async function runFill({
  model,
  instructions,
  userText,
  fields,
  abortSignal,
}: FillRunParams): Promise<FillRunResult> {
  const [first, ...rest] = fields;
  if (first === undefined) return { ok: false, error: "ai_unavailable" };

  try {
    const result = await generateText({
      model,
      instructions,
      prompt: userText,
      output: Output.object({ schema: fillSchema([first, ...rest]) }),
      maxOutputTokens: MAX_OUTPUT_TOKENS_FILL,
      maxRetries: AI_MAX_RETRIES,
      timeout: FILL_TIMEOUT_MS,
      abortSignal,
      providerOptions: AI_PROVIDER_OPTIONS,
    });
    if (result.finishReason === "content-filter") {
      return { ok: false, error: "ai_declined" };
    }

    const values: Record<string, string> = {};
    for (const item of result.output.values) {
      const value = item.value.trim().slice(0, MAX_VALUE_CHARS);
      // Пустые значения не отдаём: поле человек заполнит сам.
      if (value && !(item.field in values)) values[item.field] = value;
    }
    return { ok: true, values, tip: result.output.tip.trim() };
  } catch (error) {
    // Сбой провайдера, таймаут или ответ не по схеме. В журнал — только тип ошибки.
    console.error(
      `ai fill error: ${error instanceof Error ? error.name : "unknown"}`,
    );
    reportAiError("ai fill", error);
    return { ok: false, error: "ai_unavailable" };
  }
}
