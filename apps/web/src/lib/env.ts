import "server-only";

// Переменные окружения сервера. Ни одна из них не попадает в браузер:
// в браузер Next.js передаёт только переменные с префиксом NEXT_PUBLIC_.

export class MissingEnvError extends Error {
  constructor(name: string) {
    super(`Не задана переменная окружения ${name} (см. apps/web/.env.example)`);
  }
}

function read(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new MissingEnvError(name);
  return value;
}

export function getSupabaseUrl(): string {
  return read("SUPABASE_URL");
}

// Publishable key: им можно проверять токены пользователей; права даёт RLS.
export function getSupabasePublishableKey(): string {
  return read("SUPABASE_PUBLISHABLE_KEY");
}

// Secret key обходит RLS. Читается только в lib/supabase/admin.ts.
export function getSupabaseSecretKey(): string {
  return read("SUPABASE_SECRET_KEY");
}
