import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TelemetryState = {
  // «Помогать улучшать приложение»: анонимная статистика (PostHog) и отчёты об ошибках (Sentry).
  // По умолчанию включено; выключил — ни то, ни другое не отправляется.
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

// Хранится только на этом телефоне (AsyncStorage), в аккаунт не попадает:
// согласие относится к устройству, а не к аккаунту.
export const useTelemetryStore = create<TelemetryState>()(
  persist(
    (set) => ({
      enabled: true,
      setEnabled: (enabled) => set({ enabled }),
    }),
    {
      name: "telemetry",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// Согласие уже прочитано с телефона. До этого ничего не отправляем.
export function isTelemetryReady(): boolean {
  return useTelemetryStore.persist.hasHydrated();
}

// Можно ли сейчас отправлять статистику и ошибки.
export function isTelemetryAllowed(): boolean {
  return isTelemetryReady() && useTelemetryStore.getState().enabled;
}

export function useTelemetryHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useTelemetryStore.persist.onFinishHydration(onChange),
    () => useTelemetryStore.persist.hasHydrated(),
  );
}
