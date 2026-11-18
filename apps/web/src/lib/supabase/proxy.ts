import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Продление сессии входа в админку (вызывается из src/proxy.ts для адресов /admin).
// Токен входа живёт около часа; когда он истекает, Supabase выдаёт новый по refresh-токену.
// Делаем это здесь, до страницы: Server Components не умеют записывать cookies.
//
// Переменные читаем напрямую, а не через lib/env.ts: тот помечен server-only для кода React,
// а proxy — отдельная среда.
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();
  // Не настроено — страница админки сама покажет ошибку настройки.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        // Новые cookies — и странице (request), и браузеру (response).
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // Ответ с cookies входа нельзя кэшировать: иначе чужая сессия может попасть другому.
        for (const [header, value] of Object.entries(headers)) {
          response.headers.set(header, value);
        }
      },
    },
  });

  // Между созданием клиента и этим вызовом ничего не добавлять: здесь и продлевается сессия.
  await supabase.auth.getClaims();

  return response;
}
