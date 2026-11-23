import { deployCommit } from "@/lib/deploy";

// GET /api/health — «сайт жив». Пригодится, чтобы быстро проверить деплой и для мониторинга.
// Каждый раз считается заново: ответ не кэшируется.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      status: "ok",
      service: "ai-navigator-web",
      time: new Date().toISOString(),
      // Коммит, из которого собран деплой (хостинг даёт при сборке; локально — null).
      commit: deployCommit(),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
