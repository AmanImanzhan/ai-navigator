import type { AiFillResponse } from "@ai-navigator/shared";
import { z } from "zod";

import { MAX_SITUATION_CHARS } from "@/lib/ai/config";
import { loadTemplateForAi } from "@/lib/ai/content";
import { runFill } from "@/lib/ai/fill";
import { getAiModel } from "@/lib/ai/model";
import { buildFillPrompt, wrapUserText } from "@/lib/ai/prompts";
import { consumeAiRequest, refundAiRequest } from "@/lib/ai/usage";
import { aiErrorResponse, readJsonBody } from "@/lib/api/responses";
import { handleRouteError, limitReachedResponse } from "@/lib/api/routes";
import { getUserFromRequest } from "@/lib/supabase/server";

// POST /api/ai/fill — «Заполнить с помощником»: по шаблону и описанию ситуации ИИ предлагает
// значения для полей в [квадратных скобках]. Ответ — JSON (AiFillResponse в shared/ai.ts).
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RequestSchema = z.object({
  templateId: z.string().min(1).max(16),
  locale: z.enum(["en", "ru", "es"]),
  situation: z.string(),
});

export async function POST(request: Request) {
  try {
    return await handle(request);
  } catch (error) {
    return handleRouteError(error, "ai fill");
  }
}

async function handle(request: Request): Promise<Response> {
  const user = await getUserFromRequest(request);
  if (!user) return aiErrorResponse("unauthorized", 401);

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;
  const parsed = RequestSchema.safeParse(body.value);
  if (!parsed.success) return aiErrorResponse("invalid_request", 400);
  const { templateId, locale } = parsed.data;
  const situation = parsed.data.situation.trim();
  if (!situation) return aiErrorResponse("invalid_request", 400);
  if (situation.length > MAX_SITUATION_CHARS) {
    return aiErrorResponse("input_too_long", 413, {
      maxLength: MAX_SITUATION_CHARS,
    });
  }

  const model = getAiModel();
  const template = await loadTemplateForAi(user.supabase, templateId, locale);
  // Шаблона нет или в нём нечего заполнять.
  if (!template || template.fields.length === 0) {
    return aiErrorResponse("not_found", 404);
  }

  const consumed = await consumeAiRequest(user.supabase);
  if (!consumed.allowed) return limitReachedResponse(consumed.usage);
  const refund = () => refundAiRequest(user.supabase, consumed.reservationId);

  let result: Awaited<ReturnType<typeof runFill>>;
  try {
    result = await runFill({
      model,
      instructions: buildFillPrompt(locale, {
        templateTitle: template.title,
        purpose: template.purpose,
        templatePrompt: template.prompt,
        fields: template.fields,
      }),
      userText: wrapUserText("situation", situation),
      fields: template.fields,
      abortSignal: request.signal,
    });
  } catch (error) {
    await refund();
    throw error;
  }

  // ИИ не справился — попытку возвращаем.
  if (!result.ok) {
    await refund();
    return result.error === "ai_declined"
      ? aiErrorResponse("ai_declined", 422)
      : aiErrorResponse("ai_unavailable", 503);
  }

  return Response.json(
    {
      values: result.values,
      tip: result.tip,
      usage: consumed.usage,
    } satisfies AiFillResponse,
    { headers: { "cache-control": "no-store" } },
  );
}
