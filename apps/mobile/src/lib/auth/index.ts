import {
  FunctionsFetchError,
  isAuthRetryableFetchError,
  type User,
} from "@supabase/supabase-js";

import { appleProvider } from "@/lib/auth/apple";
import { googleProvider } from "@/lib/auth/google";
import type {
  AuthProvider,
  AuthProviderId,
  SignInResult,
} from "@/lib/auth/types";
import { track } from "@/lib/analytics";
import { resetReminders } from "@/lib/reminders";
import { supabase } from "@/lib/supabase";
import { forgetMergedAccount, syncBeforeSignOut } from "@/lib/sync";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";

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
    const result = await AUTH_PROVIDERS[provider].signIn();
    // Статистика: только способ входа, без почты и имени.
    if (result.status === "signedIn") track("sign_in", { method: provider });
    return result;
  } catch (error) {
    return { status: "error", error };
  }
}

// Выход. Сначала пробуем отправить несохранённые изменения в аккаунт.
// Без сети сервер не ответит — тогда выходим хотя бы на этом телефоне.
// Заодно выходим из провайдеров, которые помнят аккаунт на телефоне (Google).
// Данные на телефоне остаются.
export async function signOut() {
  await syncBeforeSignOut();
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
  // Серверная функция не ответила (нет сети).
  if (error instanceof FunctionsFetchError) return true;
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

// ---------- Удаление аккаунта ----------

export type DeleteAccountResult =
  | { status: "deleted" }
  | { status: "cancelled" }
  | { status: "error"; error: unknown };

// Через какие способы входа человек входил в этот аккаунт (их может быть несколько).
function linkedProviders(user: User): AuthProviderId[] {
  const providers = new Set(user.identities?.map((item) => item.provider));
  return PROVIDER_IDS.filter((id) => providers.has(id));
}

// После удаления на сервере: выходим и стираем всё на телефоне — данные, очередь
// синхронизации, напоминания. Онбординг сбросится, и приложение само откроет начало.
async function clearPhoneAfterDeletion() {
  // Сначала забываем аккаунт в синхронизации — чтобы ничего не отправилось в удалённый аккаунт.
  forgetMergedAccount();
  // scope: "local" — аккаунта на сервере уже нет, спрашивать сервер незачем.
  await supabase?.auth.signOut({ scope: "local" }).catch(() => {});
  useAppStore.getState().resetAll(null);
  await resetReminders();
}

// Удаляет аккаунт: подтверждение у Apple (если входили через Apple) → серверная функция
// delete-account → отзыв доступа Google → очистка телефона.
// Ошибка или нет сети — телефон не трогаем: данные и вход остаются как были.
export async function deleteAccount(): Promise<DeleteAccountResult> {
  const user = useAuthStore.getState().session?.user;
  if (!supabase || !user) {
    return { status: "error", error: new Error("Нет входа в аккаунт") };
  }
  const providers = linkedProviders(user);

  // 1. Подготовка: Apple покажет своё окно. Закрыли окно — ничего не удаляем.
  let body: Record<string, string> = {};
  for (const id of providers) {
    const prepared = await AUTH_PROVIDERS[id].prepareAccountDeletion?.();
    if (!prepared) continue;
    if (prepared.status !== "ready") return prepared;
    body = { ...body, ...prepared.body };
  }

  // 2. Сервер удаляет аккаунт (и данные в облаке — каскадом). Токен входа
  //    supabase-js подставит сам: удалить можно только свой аккаунт.
  const { data, error } = await supabase.functions.invoke<{
    deleted?: boolean;
  }>("delete-account", { body });
  if (error) return { status: "error", error };
  if (data?.deleted !== true) {
    return {
      status: "error",
      error: new Error("Сервер не подтвердил удаление"),
    };
  }

  // 3. Аккаунта уже нет — дальше ошибки не важны, просто убираем всё за собой.
  await Promise.all(
    providers.map((id) =>
      AUTH_PROVIDERS[id].afterAccountDeletion?.().catch(() => {}),
    ),
  );
  track("account_deleted", {});
  await clearPhoneAfterDeletion();
  return { status: "deleted" };
}
