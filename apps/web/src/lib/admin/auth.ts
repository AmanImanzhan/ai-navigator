import "server-only";

import type { Database } from "@ai-navigator/shared";
import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { cache } from "react";

import { createAdminClient } from "@/lib/supabase/admin";
import { createSessionClient } from "@/lib/supabase/session";

// Кто админ. Список — в таблице public.admins: её может менять только сервисная роль
// (secret key или SQL Editor), поэтому назначить себя админом из браузера или приложения нельзя.
//
// Правило: каждая страница админки вызывает requireAdminPage(), каждое действие —
// getAdminForAction(). Проверка в интерфейсе — не защита: действие — это обычный POST-запрос,
// его можно отправить и без интерфейса.

export type AdminUser = {
  id: string;
  email: string | null;
};

// Админ и клиент базы с secret key. Получить клиент можно только здесь, после проверки.
export type AdminContext = {
  user: AdminUser;
  db: SupabaseClient<Database>;
};

export type AdminCheck =
  | { status: "signedOut" }
  | { status: "forbidden"; email: string | null }
  | { status: "admin"; admin: AdminContext };

// Проверяет вошедшего. cache — один раз на запрос, даже если спрашивают layout и страница.
export const checkAdmin = cache(async (): Promise<AdminCheck> => {
  const supabase = await createSessionClient();
  // getClaims проверяет подпись токена из cookie — подделать вход не получится.
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub || claims.role !== "authenticated") {
    return { status: "signedOut" };
  }

  const user: AdminUser = {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
  };
  const db = createAdminClient();
  const { data: row, error: dbError } = await db
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (dbError) throw new Error(`Проверка админа не удалась: ${dbError.code}`);
  if (!row) return { status: "forbidden", email: user.email };

  return { status: "admin", admin: { user, db } };
});

// Для страниц: не вошёл — на страницу входа, не админ — «Нет доступа».
export async function requireAdminPage(): Promise<AdminContext> {
  const check = await checkAdmin();
  if (check.status === "signedOut") redirect("/admin/login");
  if (check.status === "forbidden") redirect("/admin/no-access");
  return check.admin;
}

// Для действий (Server Actions): null — прав нет, действие ничего не делает.
export async function getAdminForAction(): Promise<AdminContext | null> {
  const check = await checkAdmin();
  return check.status === "admin" ? check.admin : null;
}
