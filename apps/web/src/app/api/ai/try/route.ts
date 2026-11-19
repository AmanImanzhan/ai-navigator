import { z } from "zod";

import { MAX_PROMPT_CHARS, REVIEW_MARKER } from "@/lib/ai/config";
import { loadLessonForAi } from "@/lib/ai/content";
import { getAiModel } from "@/lib/ai/model";
import { buildTryPrompt, wrapUserText } from "@/lib/ai/prompts";
import { runTryStream } from "@/lib/ai/try";
import { consumeAiRequest, refundAiRequest } from "@/lib/ai/usage";
import { aiErrorResponse, readJsonBody } from "@/lib/api/responses";
import { handleRouteError, limitReachedResponse } from "@/lib/api/routes";
import { getUserFromRequest } from "@/lib/supabase/server";

// POST /api/ai/try — «Попробуй сам»: человек пишет свой запрос в рамках урока,
// ИИ отвечает и коротко разбирает запрос. Ответ — поток NDJSON (см. AiTryEvent в shared/ai.ts).
export const dynamic = "force-dynamic";
// Сколько секунд Vercel даёт функции на ответ.
export const maxDuration = 60;

const RequestSchema = z.object({
  lessonId: z.string().min(1).max(16),
  locale: z.enum(["en", "ru", "es"]),
  prompt: z.string(),
});

export async function POST(request: Request) {
  try {
    return await handle(request);
  } catch (error) {
    return handleRouteError(error, "ai try");
  }
}

async function handle(request: Request): Promise<Response> {
  // 1. Кто это? Только вошедшие.
  const user = await getUserFromRequest(request);
  if (!user) return aiErrorResponse("unauthorized", 401);

  // 2. Что прислали.
  const body = await readJsonBody(request);
  if (!body.ok) return body.response;
  const parsed = RequestSchema.safeParse(body.value);
  if (!parsed.success) return aiErrorResponse("invalid_request", 400);
  const { lessonId, locale } = parsed.data;
  const prompt = parsed.data.prompt.trim();
  if (!prompt) return aiErrorResponse("invalid_request", 400);
  if (prompt.length > MAX_PROMPT_CHARS) {
    return aiErrorResponse("input_too_long", 413, {
      maxLength: MAX_PROMPT_CHARS,
    });
  }

  // 3. Модель (нет ключа — ошибка настройки) и урок из базы — до списания попытки.
  const model = getAiModel();
  const lesson = await loadLessonForAi(user.supabase, lessonId, locale);
  if (!lesson) return aiErrorResponse("not_found", 404);

  // 4. Списываем попытку до вызова ИИ.
  const consumed = await consumeAiRequest(user.supabase);
  if (!consumed.allowed) return limitReachedResponse(consumed.usage);
  const refund = () => refundAiRequest(user.supabase, consumed.reservationId);

  // 5. Ответ ИИ потоком. Неожиданный сбой — возвращаем попытку.
  try {
    return await runTryStream({
      model,
      instructions: buildTryPrompt(locale, {
        lessonTitle: lesson.title,
        skill: lesson.skill,
        criteria: lesson.criteria,
        marker: REVIEW_MARKER,
      }),
      userText: wrapUserText("prompt", prompt),
      usage: consumed.usage,
      refund,
      abortSignal: request.signal,
    });
  } catch (error) {
    await refund();
    throw error;
  }
}
