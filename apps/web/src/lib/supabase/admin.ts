import "server-only";

import type { Database } from "@ai-navigator/shared";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseSecretKey, getSupabaseUrl } from "@/lib/env";

// Клиент с secret key: обходит все правила доступа (RLS).
// Только для сервера — «server-only» не даст случайно импортировать файл в код браузера.
// Пока не используется: понадобится ИИ-помощнику (учёт лимитов в ai_usage) и админ-панели.
// Правило: сначала проверить пользователя (getUserFromRequest), и только потом — этот клиент.
export function createAdminClient(): SupabaseClient<Database> {
  return createClient<Database>(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
