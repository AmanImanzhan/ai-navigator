import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import { Platform } from "react-native";

import { saveProfileName } from "@/lib/auth/profile";
import type { AuthProvider, SignInResult } from "@/lib/auth/types";
import { supabase } from "@/lib/supabase";

type GoogleClientIds = {
  iosClientId: string;
  webClientId: string;
};

const GOOGLE_ID_SUFFIX = ".apps.googleusercontent.com";

function isClientId(value: unknown): value is string {
  return typeof value === "string" && value.endsWith(GOOGLE_ID_SUFFIX);
}

// Client ID вписываются в app.config.ts и попадают в приложение через extra.googleAuth.
// Пока их нет — вход через Google выключен (кнопки не будет).
function getClientIds(): GoogleClientIds | null {
  const googleAuth: unknown = Constants.expoConfig?.extra?.googleAuth;
  if (typeof googleAuth !== "object" || googleAuth === null) return null;
  if (!("iosClientId" in googleAuth) || !("webClientId" in googleAuth)) {
    return null;
  }
  const { iosClientId, webClientId } = googleAuth;
  if (!isClientId(iosClientId) || !isClientId(webClientId)) return null;
  return { iosClientId, webClientId };
}

let configured = false;

// Настраиваем библиотеку один раз, перед первым входом или выходом.
// webClientId — чтобы в токене Google был «получатель», которого знает Supabase.
function ensureConfigured(): boolean {
  if (configured) return true;
  const ids = getClientIds();
  if (!ids) return false;
  GoogleSignin.configure({
    webClientId: ids.webClientId,
    iosClientId: ids.iosClientId,
  });
  configured = true;
  return true;
}

// Окно Google закрыли — это не ошибка.
function isCancelledError(error: unknown): boolean {
  return (
    isErrorWithCode(error) &&
    (error.code === statusCodes.SIGN_IN_CANCELLED ||
      error.code === statusCodes.IN_PROGRESS)
  );
}

// Вход через Google: Google выдаёт ID-токен, Supabase проверяет его и создаёт сессию.
// nonce не передаём: библиотека (бесплатная версия) не умеет его задавать, а iOS-SDK Google
// кладёт в токен свой. Поэтому в Supabase для Google включено «Skip nonce check».
async function signIn(): Promise<SignInResult> {
  if (!supabase || !ensureConfigured()) {
    return { status: "error", error: new Error("Google не настроен") };
  }

  let idToken: string | null;
  let googleName: string | null;
  let givenName: string | null;
  let familyName: string | null;
  try {
    // На Android проверяет сервисы Google Play, на iOS сразу отвечает «да».
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (isCancelledResponse(response)) return { status: "cancelled" };
    idToken = response.data.idToken;
    googleName = response.data.user.name;
    givenName = response.data.user.givenName;
    familyName = response.data.user.familyName;
  } catch (error) {
    if (isCancelledError(error)) return { status: "cancelled" };
    return { status: "error", error };
  }

  if (!idToken) {
    return { status: "error", error: new Error("Google не вернул токен") };
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });
  if (error) return { status: "error", error };

  // Обычно имя Supabase берёт из токена Google сам (full_name). Если его там нет —
  // сохраняем имя из ответа Google, как у Apple.
  if (!data.user.user_metadata.full_name && googleName) {
    await saveProfileName(data.user.id, {
      fullName: googleName,
      givenName,
      familyName,
    });
  }

  return { status: "signedIn" };
}

// Выходим и из Google на телефоне — иначе следующий вход молча возьмёт тот же аккаунт.
async function signOut() {
  if (!ensureConfigured()) return;
  await GoogleSignin.signOut();
}

export const googleProvider: AuthProvider = {
  isAvailable: async () =>
    (Platform.OS === "ios" || Platform.OS === "android") &&
    supabase !== null &&
    getClientIds() !== null,
  signIn,
  signOut,
};
