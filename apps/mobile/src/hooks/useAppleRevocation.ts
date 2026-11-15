import { useEffect } from "react";
import { AppState } from "react-native";

import { signOut } from "@/lib/auth";
import {
  getAppleUserId,
  isAppleAccessRevoked,
  onAppleAccessRevoked,
} from "@/lib/auth/apple";
import { useAuthStore } from "@/store/useAuthStore";

// Человек отключил «Вход с Apple» для приложения в настройках iPhone — выходим из аккаунта.
// Данные на телефоне остаются, как при обычном выходе.
// Подключается один раз в корневом layout. Работает только у тех, кто входил через Apple.
export function useAppleRevocation(enabled: boolean) {
  const user = useAuthStore((state) => state.session?.user ?? null);
  const appleUserId = user ? getAppleUserId(user) : null;

  useEffect(() => {
    if (!enabled || !appleUserId) return;
    let active = true;

    // Пока приложение было закрыто, iOS ничего не сообщит — спрашиваем сами
    // при запуске и при каждом возвращении в приложение.
    async function check(id: string) {
      if ((await isAppleAccessRevoked(id)) && active) signOut();
    }
    check(appleUserId);

    // Пока приложение открыто, iOS сообщает об отзыве сама.
    const unsubscribe = onAppleAccessRevoked(() => {
      signOut();
    });
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") check(appleUserId);
    });

    return () => {
      active = false;
      unsubscribe();
      subscription.remove();
    };
  }, [enabled, appleUserId]);
}
