import "server-only";

import type { Database } from "@ai-navigator/shared";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseSecretKey, getSupabaseUrl } from "@/lib/env";

// Клиент с secret key: обходит все правила доступа (RLS).
// Только для сервера — «server-only» не даст случайно импортировать файл в код браузера.
// Где используется:
//   админка — получить клиент можно только через lib/admin/auth.ts после проверки админа;
//   webhook RevenueCat — lib/revenuecat/apply.ts после проверки секрета webhook.
// Больше нигде напрямую в маршрутах и действиях не вызывать.
export function createAdminClient(): SupabaseClient<Database> {
  return createClient<Database>(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
