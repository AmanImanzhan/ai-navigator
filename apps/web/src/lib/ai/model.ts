import "server-only";

import { createAnthropic } from "@ai-sdk/anthropic";
import type { LanguageModel } from "ai";

import { AI_MODEL } from "@/lib/ai/config";
import { getAnthropicApiKey } from "@/lib/env";

// Модель Claude через Vercel AI SDK. Ключ Anthropic берётся из переменной окружения сервера
// и в браузер или приложение не попадает. Нет ключа — MissingEnvError (server_not_configured).
export function getAiModel(): LanguageModel {
  const anthropic = createAnthropic({ apiKey: getAnthropicApiKey() });
  return anthropic(AI_MODEL);
}
