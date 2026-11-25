import { appStorage } from "@/lib/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Версия текста согласия (лист AiConsentSheet, тексты ai.consent.*). Изменили, что и кому
// отправляется, — увеличьте число: приложение спросит согласие снова (правило Apple 5.1.2(i)).
export const AI_CONSENT_VERSION = 1;

type AiConsentState = {
  // Какую версию текста человек принял; null — не принимал или отозвал.
  acceptedVersion: number | null;
  accept: () => void;
  revoke: () => void;
};

// Согласие отправлять текст ИИ-помощнику (наш API → Anthropic). Хранится только на этом телефоне
// (AsyncStorage): как и «Помогать улучшать приложение», оно относится к устройству.
export const useAiConsentStore = create<AiConsentState>()(
  persist(
    (set) => ({
      acceptedVersion: null,
      accept: () => set({ acceptedVersion: AI_CONSENT_VERSION }),
      revoke: () => set({ acceptedVersion: null }),
    }),
    {
      name: "ai-consent",
      storage: createJSONStorage(() => appStorage),
    },
  ),
);

function isCurrent(version: number | null): boolean {
  return version === AI_CONSENT_VERSION;
}

// Можно ли сейчас отправлять текст ИИ. Пока согласие не прочитано с телефона — нельзя.
export function hasAiConsent(): boolean {
  return (
    useAiConsentStore.persist.hasHydrated() &&
    isCurrent(useAiConsentStore.getState().acceptedVersion)
  );
}

// То же для экранов (перерисовываются, когда согласие дали или отозвали).
export function useHasAiConsent(): boolean {
  return useAiConsentStore((state) => isCurrent(state.acceptedVersion));
}
