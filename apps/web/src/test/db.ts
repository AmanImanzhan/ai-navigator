import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { PGlite, type Transaction } from "@electric-sql/pglite";

// Настоящий Postgres прямо в тесте (PGlite — Postgres, собранный в WebAssembly): без сети,
// без Docker и без настоящего Supabase. Накатываем наши миграции из supabase/migrations —
// так тесты проверяют ровно те SQL-функции, что работают в базе (лимиты ИИ, подписка).

const MIGRATIONS_DIR = join(__dirname, "../../../../supabase/migrations");

// Минимум того, что Supabase создаёт сам: роли, схема auth, таблица пользователей и auth.uid().
// auth.uid() читает id из настройки request.jwt.claim.sub — как в Supabase.
const SUPABASE_STUB = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  create schema auth;
  grant usage on schema auth to anon, authenticated, service_role;
  create table auth.users (
    id uuid primary key,
    email text,
    raw_user_meta_data jsonb
  );
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  grant execute on function auth.uid() to anon, authenticated, service_role;
`;

// Кто выполняет запрос: вошедший пользователь (права и RLS как у приложения)
// или сервер с secret key (service_role).
// anon — запрос без входа (только publishable key).
export type DbRole = { user: string } | "service" | "anon";

export type TestDb = {
  db: PGlite;
  // Создать пользователя (как вход через Apple/Google).
  createUser: (id: string) => Promise<void>;
  // Выполнить запрос от имени роли — в отдельной транзакции.
  run: <T>(role: DbRole, sql: string, params?: unknown[]) => Promise<T[]>;
  close: () => Promise<void>;
};

async function useRole(tx: Transaction, role: DbRole) {
  if (role === "service" || role === "anon") {
    await tx.exec(`set local role ${role === "service" ? "service_role" : "anon"}`);
    return;
  }
  // set_config(…, true) — только до конца транзакции, другие запросы не задевает.
  await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [role.user]);
  await tx.exec("set local role authenticated");
}

export async function createTestDb(): Promise<TestDb> {
  const db = new PGlite();
  await db.exec(SUPABASE_STUB);
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort();
  for (const file of files) {
    await db.exec(readFileSync(join(MIGRATIONS_DIR, file), "utf8"));
  }

  return {
    db,
    createUser: async (id) => {
      await db.query("insert into auth.users (id) values ($1)", [id]);
    },
    run: async <T>(role: DbRole, sql: string, params: unknown[] = []) => {
      const result = await db.transaction(async (tx) => {
        await useRole(tx, role);
        return tx.query<T>(sql, params);
      });
      return result.rows;
    },
    close: () => db.close(),
  };
}
