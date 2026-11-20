import { MissingEnvError } from "@/lib/env";
import { reportServerError } from "@/lib/sentry/report";
import { getUserFromRequest } from "@/lib/supabase/server";

// GET /api/me — образец защищённого маршрута: кто вызывает (по токену из приложения).
// Так будут устроены маршруты ИИ-помощника: сначала проверяем пользователя, потом работаем.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
    return Response.json({ id: user.id, email: user.email });
  } catch (error) {
    // Не заданы переменные Supabase — это ошибка настройки сервера, а не пользователя.
    // Остальные ошибки летят дальше — их отправит в Sentry onRequestError (instrumentation.ts).
    if (error instanceof MissingEnvError) {
      reportServerError("me", error);
      console.error(error.message);
      return Response.json({ error: "server_not_configured" }, { status: 500 });
    }
    throw error;
  }
}
