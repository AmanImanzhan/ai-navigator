import { useEffect } from "react";
import { AppState } from "react-native";

import type { Locale } from "@/data/lessons";
import { fetchContent } from "@/data/remote/fetchContent";
import { useAppStore } from "@/store/useAppStore";
import { useContentStore } from "@/store/useContentStore";

// Как часто проверяем базу на обновления.
const REFRESH_INTERVAL_HOURS = 6;
const REFRESH_INTERVAL_MS = REFRESH_INTERVAL_HOURS * 60 * 60 * 1000;

// Языки, для которых загрузка уже идёт, — чтобы не запускать её второй раз.
const loading = new Set<Locale>();

// Загружает свежий контент, если кэша на этом языке нет или он старше REFRESH_INTERVAL_HOURS.
// Любая ошибка — тихо остаёмся на текущих данных: кэш или встроенные.
async function refreshContent(locale: Locale) {
  const { snapshot, saveSnapshot } = useContentStore.getState();
  const isFresh =
    snapshot?.locale === locale &&
    Date.now() - snapshot.fetchedAt < REFRESH_INTERVAL_MS;
  if (isFresh || loading.has(locale)) return;

  loading.add(locale);
  try {
    const fresh = await fetchContent(locale);
    // Пока грузили, язык могли сменить — тогда этот ответ уже не нужен.
    if (fresh && useAppStore.getState().language === locale) {
      saveSnapshot(fresh);
    }
  } catch (error) {
    if (__DEV__) {
      console.log("Контент из Supabase не загружен:", String(error));
    }
  } finally {
    loading.delete(locale);
  }
}

// Подключается один раз в корневом layout. enabled — когда кэш уже прочитан из памяти.
// Проверяет обновления: при запуске, при смене языка и когда приложение возвращается из фона.
export function useContentSync(enabled: boolean) {
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    if (enabled) refreshContent(language);
  }, [enabled, language]);

  useEffect(() => {
    if (!enabled) return;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        refreshContent(useAppStore.getState().language);
      }
    });
    return () => subscription.remove();
  }, [enabled]);
}
