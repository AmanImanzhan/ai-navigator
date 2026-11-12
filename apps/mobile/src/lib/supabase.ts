import type { Database } from "@ai-navigator/shared";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";

// Ключи из apps/mobile/.env. Здесь только publishable key — его можно отдавать в приложение,
// доступ к данным ограничивают правила RLS в базе. Secret key в приложении не бывает никогда.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_KEY;

function createSupabase(): SupabaseClient<Database> | null {
  // Без ключей (например, .env не заполнен) приложение работает на встроенных данных.
  if (!url || !key) {
    if (__DEV__) {
      console.log(
        "Supabase: нет ключей в .env — работаем на встроенных данных",
      );
    }
    return null;
  }

  return createClient<Database>(url, key, {
    auth: {
      // Сессия входа хранится в памяти телефона и переживает перезапуск.
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      // В мобильном приложении нет адресной строки, из которой можно прочитать сессию.
      detectSessionInUrl: false,
    },
  });
}

export const supabase = createSupabase();

// Пока приложение открыто — продлеваем сессию входа, в фоне — перестаём.
if (supabase && Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
