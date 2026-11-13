import { useEffect, useState } from "react";

import {
  getAvailableProviders,
  signOut,
  type AuthProviderId,
} from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";

// Вошёл ли человек и кто он. Экраны берут вход только отсюда.
export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const initialized = useAuthStore((state) => state.initialized);
  const user = session?.user ?? null;

  return { user, isSignedIn: user !== null, initialized, signOut };
}

// Способы входа на этом телефоне. null — ещё проверяем, [] — войти нельзя (например, Android).
export function useAvailableProviders(): AuthProviderId[] | null {
  const [providers, setProviders] = useState<AuthProviderId[] | null>(null);

  useEffect(() => {
    let active = true;
    getAvailableProviders().then((ids) => {
      if (active) setProviders(ids);
    });
    return () => {
      active = false;
    };
  }, []);

  return providers;
}
