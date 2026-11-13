import { supabase } from "@/lib/supabase";

export type ProfileName = {
  fullName: string;
  givenName: string | null;
  familyName: string | null;
};

// Сохраняет имя сразу в два места:
// - profiles.full_name — для сервера (письма, командный тариф);
// - данные пользователя в сессии — чтобы Профиль показывал имя сразу и без сети.
// Не получилось — не страшно: вход уже прошёл, просто покажем почту вместо имени.
export async function saveProfileName(userId: string, name: ProfileName) {
  if (!supabase) return;

  const [profile, user] = await Promise.all([
    supabase
      .from("profiles")
      .update({ full_name: name.fullName })
      .eq("id", userId),
    supabase.auth.updateUser({
      data: {
        full_name: name.fullName,
        given_name: name.givenName,
        family_name: name.familyName,
      },
    }),
  ]);

  const error = profile.error ?? user.error;
  if (error && __DEV__) {
    console.log("Имя не сохранено:", error.message);
  }
}
