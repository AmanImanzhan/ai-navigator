import type { AiUsage } from "@ai-navigator/shared";

import { readAiUsage } from "@/lib/ai/usage";
import { aiErrorResponse } from "@/lib/api/responses";
import { handleRouteError } from "@/lib/api/routes";
import { getUserFromRequest } from "@/lib/supabase/server";

// GET /api/ai/usage — сколько запросов к помощнику осталось сегодня (без списания),
// дневной лимит (3 или 30) и есть ли подписка. Приложение покажет «Осталось 2 из 3».
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return aiErrorResponse("unauthorized", 401);
    const usage: AiUsage = await readAiUsage(user.supabase);
    return Response.json(usage, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return handleRouteError(error, "ai usage");
  }
}
