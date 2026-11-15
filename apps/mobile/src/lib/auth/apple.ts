import * as AppleAuthentication from "expo-apple-authentication";
import type { User } from "@supabase/supabase-js";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";

import { saveProfileName } from "@/lib/auth/profile";
import type {
  AuthProvider,
  DeletionPreparation,
  SignInResult,
} from "@/lib/auth/types";
import { supabase } from "@/lib/supabase";

// Человек закрыл окно Apple — по документации expo-apple-authentication.
function isCancelled(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    error.code === "ERR_REQUEST_CANCELED"
  );
}

// Вход через Apple: Apple выдаёт подписанный токен, Supabase проверяет его и создаёт сессию.
async function signIn(): Promise<SignInResult> {
  if (!supabase) {
    return { status: "error", error: new Error("Supabase не настроен") };
  }

  // nonce — одноразовая случайная строка против повторного использования токена.
  // Apple получает её хеш (он попадёт в токен), Supabase — саму строку: он сам посчитает хеш и сравнит.
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );

  let credential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });
  } catch (error) {
    if (isCancelled(error)) return { status: "cancelled" };
    return { status: "error", error };
  }

  if (!credential.identityToken) {
    return { status: "error", error: new Error("Apple не вернул токен") };
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "apple",
    token: credential.identityToken,
    nonce: rawNonce,
  });
  if (error) return { status: "error", error };

  // Имя Apple отдаёт только при самом первом входе — сохраняем, пока оно есть.
  const { givenName, middleName, familyName } = credential.fullName ?? {};
  const fullName = [givenName, middleName, familyName]
    .filter(Boolean)
    .join(" ");
  if (fullName) {
    await saveProfileName(data.user.id, {
      fullName,
      givenName: givenName ?? null,
      familyName: familyName ?? null,
    });
  }

  return { status: "signedIn" };
}

// Перед удалением аккаунта ещё раз показываем окно Apple: оно подтверждает, что это сам
// человек, и даёт свежий код входа (живёт 5 минут). По этому коду сервер отзовёт у Apple
// доступ приложения — так требует App Store.
async function prepareAccountDeletion(): Promise<DeletionPreparation> {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [],
    });
    if (!credential.authorizationCode) {
      return { status: "error", error: new Error("Apple не вернул код") };
    }
    return {
      status: "ready",
      body: { appleAuthorizationCode: credential.authorizationCode },
    };
  } catch (error) {
    if (isCancelled(error)) return { status: "cancelled" };
    return { status: "error", error };
  }
}

export const appleProvider: AuthProvider = {
  isAvailable: async () =>
    Platform.OS === "ios" &&
    supabase !== null &&
    (await AppleAuthentication.isAvailableAsync()),
  signIn,
  prepareAccountDeletion,
};

// ---------- Отзыв доступа из настроек iOS ----------

// id пользователя Apple, если человек входил через Apple. null — вход не через Apple.
export function getAppleUserId(user: User): string | null {
  const identity = user.identities?.find((item) => item.provider === "apple");
  if (!identity) return null;
  const sub: unknown = identity.identity_data?.sub;
  return typeof sub === "string" ? sub : identity.id;
}

// Отозван ли доступ «Вход с Apple» для этого приложения (Настройки iPhone → Apple ID →
// Вход с Apple → «Не использовать»). Не знаем (ошибка, симулятор) — считаем, что нет.
export async function isAppleAccessRevoked(appleUserId: string) {
  if (Platform.OS !== "ios") return false;
  try {
    const state =
      await AppleAuthentication.getCredentialStateAsync(appleUserId);
    return (
      state === AppleAuthentication.AppleAuthenticationCredentialState.REVOKED
    );
  } catch {
    return false;
  }
}

// iOS сообщает об отзыве, пока приложение открыто. Возвращает функцию отписки.
export function onAppleAccessRevoked(listener: () => void): () => void {
  if (Platform.OS !== "ios") return () => {};
  const subscription = AppleAuthentication.addRevokeListener(listener);
  return () => subscription.remove();
}
