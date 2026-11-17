import type { AiUsage } from "@ai-navigator/shared";

import { FREE_DAILY_LIMIT } from "@/lib/ai/config";
import { readAiUsage } from "@/lib/ai/usage";
import { aiErrorResponse } from "@/lib/api/responses";
import { handleRouteError } from "@/lib/api/routes";
import { getUserFromRequest } from "@/lib/supabase/server";

// GET /api/ai/usage — сколько запросов к помощнику осталось сегодня (без списания).
// Приложение покажет «Осталось 3 из 5».
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return aiErrorResponse("unauthorized", 401);
    const usage: AiUsage = await readAiUsage(
      user.supabase,
      user.id,
      FREE_DAILY_LIMIT,
    );
    return Response.json(usage, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return handleRouteError(error, "ai usage");
  }
}
