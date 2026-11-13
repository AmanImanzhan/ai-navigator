import { isAuthRetryableFetchError, type User } from "@supabase/supabase-js";

import { appleProvider } from "@/lib/auth/apple";
import { googleProvider } from "@/lib/auth/google";
import type {
  AuthProvider,
  AuthProviderId,
  SignInResult,
} from "@/lib/auth/types";
import { supabase } from "@/lib/supabase";

export type * from "@/lib/auth/types";

// Все способы входа. Порядок = порядок кнопок на экране: Apple первой.
const AUTH_PROVIDERS: Record<AuthProviderId, AuthProvider> = {
  apple: appleProvider,
  google: googleProvider,
};

const PROVIDER_IDS = Object.keys(AUTH_PROVIDERS) as AuthProviderId[];

// Способы входа, доступные на этом телефоне. Проверяем один раз — результат не меняется.
let availableProviders: Promise<AuthProviderId[]> | null = null;

export function getAvailableProviders(): Promise<AuthProviderId[]> {
  availableProviders ??= Promise.all(
    PROVIDER_IDS.map(async (id) =>
      (await AUTH_PROVIDERS[id].isAvailable().catch(() => false)) ? [id] : [],
    ),
  ).then((lists) => lists.flat());
  return availableProviders;
}

export async function signIn(provider: AuthProviderId): Promise<SignInResult> {
  try {
    return await AUTH_PROVIDERS[provider].signIn();
  } catch (error) {
    return { status: "error", error };
  }
}

// Выход. Без сети сервер не ответит — тогда выходим хотя бы на этом телефоне.
// Заодно выходим из провайдеров, которые помнят аккаунт на телефоне (Google).
export async function signOut() {
  await Promise.all(
    PROVIDER_IDS.map((id) => AUTH_PROVIDERS[id].signOut?.().catch(() => {})),
  );
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) {
    await supabase.auth.signOut({ scope: "local" });
  }
}

// Какую ошибку показать: «нет интернета» или «что-то пошло не так».
// Supabase сообщает о сети своим типом ошибки, Apple и Google — текстом
// («Network request failed», «The Internet connection appears to be offline»).
export function isNetworkError(error: unknown): boolean {
  if (isAuthRetryableFetchError(error)) return true;
  return (
    error instanceof Error && /network|internet|offline/i.test(error.message)
  );
}

// Имя для Профиля. Google присылает его всегда; Apple — только при первом входе,
// и человек мог его не указать.
export function getDisplayName(user: User): string | null {
  const name: unknown = user.user_metadata.full_name;
  return typeof name === "string" && name.trim() ? name.trim() : null;
}
