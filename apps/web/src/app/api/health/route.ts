// GET /api/health — «сайт жив». Пригодится, чтобы быстро проверить деплой и для мониторинга.
// Каждый раз считается заново: ответ не кэшируется.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      status: "ok",
      service: "ai-navigator-web",
      time: new Date().toISOString(),
      // Коммит, из которого собран деплой (Vercel подставляет сам; локально — null).
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
