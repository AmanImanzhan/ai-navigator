import "server-only";

import type { Database } from "@ai-navigator/shared";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/env";

// Клиент Supabase для админки сайта: сессия входа хранится в cookies браузера (@supabase/ssr).
// Создаём новый клиент на каждый запрос — так требует Supabase.
//
// Кто вошёл, проверяем только через auth.getClaims(): он проверяет подпись токена.
// getSession() на сервере не годится — он верит cookie без проверки.
export async function createSessionClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Вызов из Server Component: там cookies менять нельзя. Не страшно — сессию
            // продлевает proxy (lib/supabase/proxy.ts) до того, как страница начнёт рисоваться.
          }
        },
      },
    },
  );
}
