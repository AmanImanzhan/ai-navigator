import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Хранилище «ключ → строка» для сессии Supabase и persist-сторов zustand.
// На телефоне — AsyncStorage. Веб-версия AsyncStorage пишет в window.localStorage,
// а при сборке Expo может выполнить наш код в Node, где window нет, — там храним в памяти,
// чтобы импорт сторов и Supabase не падал (ReferenceError: window is not defined).

export type KeyValueStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

export function createMemoryStorage(): KeyValueStorage {
  const items = new Map<string, string>();
  return {
    getItem: async (key) => items.get(key) ?? null,
    setItem: async (key, value) => {
      items.set(key, value);
    },
    removeItem: async (key) => {
      items.delete(key);
    },
  };
}

export function createAppStorage(
  os: typeof Platform.OS,
  hasWindow: boolean,
): KeyValueStorage {
  return os === "web" && !hasWindow ? createMemoryStorage() : AsyncStorage;
}

export const appStorage = createAppStorage(Platform.OS, typeof window !== "undefined");
