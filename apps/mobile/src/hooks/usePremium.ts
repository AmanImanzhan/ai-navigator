import { useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  configurePurchases,
  purchasesAvailable,
  refreshPremium,
  setPurchasesUser,
} from "@/lib/purchases";
import { usePremiumStore } from "@/store/usePremiumStore";

// Подключает RevenueCat и следит за входом: вошёл — logIn(id), вышел — logOut.
// Подключается один раз в корневом layout.
export function usePurchasesSetup(): void {
  const { user, initialized } = useAuth();
  const userId = user?.id ?? null;

  useEffect(() => {
    // Ждём, пока Supabase прочитает сохранённую сессию: тогда сразу знаем покупателя.
    if (!initialized) return;
    configurePurchases(userId);
    setPurchasesUser(userId);
  }, [initialized, userId]);
}

// Есть ли подписка Premium у вошедшего. Сначала — ответ из кэша RevenueCat, свежий — в фоне.
// Обновляется, когда экран снова на виду. checked: false — RevenueCat ещё не ответил.
export function usePremium(): {
  premium: boolean;
  expiresAt: string | null;
  checked: boolean;
  refresh: () => Promise<void>;
} {
  const userId = useAuth().user?.id ?? null;
  const state = usePremiumStore();
  // Ответ про другого человека (сменили аккаунт, RevenueCat ещё не ответил) не показываем.
  // Покупок нет (Android, нет ключа) — сразу известно: подписки нет.
  const mine =
    !purchasesAvailable || (state.checked && state.userId === userId);

  useFocusEffect(
    useCallback(() => {
      refreshPremium();
    }, []),
  );

  return {
    premium: mine && state.premium,
    expiresAt: mine ? state.expiresAt : null,
    checked: mine,
    refresh: refreshPremium,
  };
}
