import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";

import { supabase } from "@/lib/supabase";

type AuthState = {
  // Текущая сессия входа. null — человек не вошёл.
  session: Session | null;
  // true, когда Supabase уже прочитал сохранённую сессию из памяти телефона.
  initialized: boolean;
};

// Состояние входа. В AsyncStorage не сохраняем: сессию там уже хранит сам Supabase,
// а этот стор только повторяет её для экранов. Без Supabase входа нет — сразу «готово».
export const useAuthStore = create<AuthState>()(() => ({
  session: null,
  initialized: supabase === null,
}));

// Подписка на события входа: первая сессия при запуске, вход, выход, обновление токена.
// Подключается один раз в корневом layout. Возвращает функцию отписки.
export function listenToAuthChanges(): () => void {
  if (!supabase) return () => {};

  // Внутри обработчика ничего не ждём (await) — так советует Supabase:
  // только запоминаем сессию.
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.setState({ session, initialized: true });
  });
  return () => data.subscription.unsubscribe();
}
