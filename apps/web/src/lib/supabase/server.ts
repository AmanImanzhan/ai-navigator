import "server-only";

import type { Database } from "@ai-navigator/shared";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/env";

// Клиент Supabase для API-маршрутов сайта.
//
// Пользователь приложения присылает свой токен в заголовке Authorization: Bearer <JWT>.
// Мы проверяем подпись токена (getClaims) и дальше ходим в базу от имени этого пользователя:
// RLS сам ограничит доступ его строками. Так будет работать ИИ-помощник (Задача 27).

export type AuthenticatedUser = {
  id: string;
  email: string | null;
  // Клиент Supabase с токеном пользователя: запросы идут с его правами.
  supabase: SupabaseClient<Database>;
};

// Токен из «Authorization: Bearer <JWT>». Нет или другой формат — null.
export function readBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  const match = header?.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

function createUserClient(token: string): SupabaseClient<Database> {
  return createClient<Database>(getSupabaseUrl(), getSupabasePublishableKey(), {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Проверяет токен вошедшего пользователя. Подделанный, просроченный или чужой токен → null.
// С новыми ключами Supabase (асимметричная подпись) проверка идёт локально по открытому
// ключу проекта, без лишнего запроса к серверу входа.
export async function getUserFromRequest(
  request: Request,
): Promise<AuthenticatedUser | null> {
  const token = readBearerToken(request);
  if (!token) return null;

  const supabase = createUserClient(token);
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data) return null;

  const { sub, email, role } = data.claims;
  // Токены «анонимного» доступа (publishable key) и сервисные — не пользователь.
  if (!sub || role !== "authenticated") return null;

  return {
    id: sub,
    email: typeof email === "string" ? email : null,
    supabase,
  };
}
