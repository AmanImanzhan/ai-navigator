// Edge Function «delete-account»: человек удаляет свой аккаунт из приложения.
//
// Кто вызывает: приложение, с токеном вошедшего пользователя (supabase.functions.invoke).
// Что делает: отзывает доступ «Вход с Apple» (если входили через Apple) и удаляет пользователя.
//
// Безопасность:
// - JWT проверяется дважды: шлюзом Supabase (verify_jwt в config.toml) и здесь (auth: "user");
// - удалить можно только себя: id берётся из проверенного токена;
// - secret key в приложение не попадает: admin-клиент создаётся здесь из секретов платформы.
//
// Секреты функции (supabase secrets set): APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_CLIENT_ID,
// APPLE_PRIVATE_KEY. Вся логика — в handler.ts и apple.ts.

import { withSupabase } from "npm:@supabase/server@1";

import { handleDeleteAccount } from "./handler.ts";

export default {
  fetch: withSupabase({ auth: "user" }, (req, ctx) =>
    handleDeleteAccount(req, {
      userId: ctx.userClaims?.id ?? null,
      admin: ctx.supabaseAdmin.auth.admin,
      env: (name) => Deno.env.get(name),
    }),
  ),
};
