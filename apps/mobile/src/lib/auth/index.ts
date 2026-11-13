import { isAuthRetryableFetchError, type User } from "@supabase/supabase-js";

import { appleProvider } from "@/lib/auth/apple";
import type {
  AuthProvider,
  AuthProviderId,
  SignInResult,
} from "@/lib/auth/types";
import { supabase } from "@/lib/supabase";

export type * from "@/lib/auth/types";

// Все способы входа. Порядок = порядок кнопок на экране.
const AUTH_PROVIDERS: Record<AuthProviderId, AuthProvider> = {
  apple: appleProvider,
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
export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) {
    await supabase.auth.signOut({ scope: "local" });
  }
}

// Какую ошибку показать: «нет интернета» или «что-то пошло не так».
export function isNetworkError(error: unknown): boolean {
  if (isAuthRetryableFetchError(error)) return true;
  return (
    error instanceof Error && error.message.includes("Network request failed")
  );
}

// Имя для Профиля. Его может не быть: Apple отдаёт имя только при первом входе,
// а человек мог его не указать.
export function getDisplayName(user: User): string | null {
  const name: unknown = user.user_metadata.full_name;
  return typeof name === "string" && name.trim() ? name.trim() : null;
}
