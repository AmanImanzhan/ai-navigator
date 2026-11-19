import { useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  configurePurchases,
  purchasesAvailable,
  refreshPremium,
  setPurchasesUser,
} from "@/lib/purchases";
import {
  NO_PREMIUM,
  usePremiumStore,
  type PremiumInfo,
} from "@/store/usePremiumStore";

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
export function usePremium(): PremiumInfo & {
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

  const info = mine && state.premium ? state : NO_PREMIUM;
  return {
    premium: info.premium,
    expiresAt: info.expiresAt,
    willRenew: info.willRenew,
    trial: info.trial,
    checked: mine,
    refresh: refreshPremium,
  };
}
