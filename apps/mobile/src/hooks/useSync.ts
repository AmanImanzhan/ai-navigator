import { useEffect } from "react";
import { AppState } from "react-native";

import { forgetMergedAccount, schedulePush, syncNow } from "@/lib/sync";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";

// Подключается один раз в корневом layout. enabled — когда данные телефона уже загружены
// из памяти: сливать с облаком пустой стор нельзя.
// Синхронизирует: при входе и запуске, после каждого изменения, при возвращении в приложение.
export function useSync(enabled: boolean) {
  const userId = useAuthStore((state) => state.session?.user.id ?? null);

  // Вошли (или приложение запустилось с сохранённым входом) — полная синхронизация.
  useEffect(() => {
    if (!enabled) return;
    if (userId) {
      syncNow();
    } else {
      forgetMergedAccount();
    }
  }, [enabled, userId]);

  useEffect(() => {
    if (!enabled || !userId) return;

    // Очередь изменилась (урок пройден, запрос сохранён или удалён) — отправляем.
    const unsubscribe = useAppStore.subscribe((state, previous) => {
      if (state.pendingSync !== previous.pendingSync) schedulePush();
    });

    // Вернулись в приложение — повторяем то, что не ушло, и проверяем облако.
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") syncNow();
    });

    return () => {
      unsubscribe();
      subscription.remove();
    };
  }, [enabled, userId]);
}
