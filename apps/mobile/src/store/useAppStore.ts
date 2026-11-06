import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  DailyMinutes,
  LanguageCode,
  OccupationId,
} from "@/data/onboarding";

// Запрос, который человек заполнил по шаблону и сохранил во вкладке «Запросы» → «Мои».
export type SavedPrompt = {
  id: string;
  templateId: string;
  title: string;
  text: string;
  // Когда сохранён (миллисекунды) — новые показываем сверху.
  createdAt: number;
};

// Что приложение помнит между запусками.
type AppData = {
  language: LanguageCode;
  // null — ещё не ответили на «Чем вы занимаетесь?».
  occupation: OccupationId | null;
  minutesPerDay: DailyMinutes;
  reminderEnabled: boolean;
  onboardingDone: boolean;
  // id пройденных уроков.
  completedLessons: string[];
  savedPrompts: SavedPrompt[];
};

type AppActions = {
  setLanguage: (language: LanguageCode) => void;
  saveOccupation: (occupation: OccupationId) => void;
  completeOnboarding: (
    minutesPerDay: DailyMinutes,
    reminderEnabled: boolean,
  ) => void;
  markLessonCompleted: (id: string) => void;
  savePrompt: (templateId: string, title: string, text: string) => void;
  deletePrompt: (id: string) => void;
  resetAll: () => void;
};

const INITIAL_DATA: AppData = {
  language: "en",
  occupation: null,
  minutesPerDay: 10,
  reminderEnabled: true,
  onboardingDone: false,
  completedLessons: [],
  savedPrompts: [],
};

// persist сам сохраняет данные в AsyncStorage и загружает их при запуске.
export const useAppStore = create<AppData & AppActions>()(
  persist(
    (set) => ({
      ...INITIAL_DATA,
      setLanguage: (language) => set({ language }),
      saveOccupation: (occupation) => set({ occupation }),
      completeOnboarding: (minutesPerDay, reminderEnabled) =>
        set({ minutesPerDay, reminderEnabled, onboardingDone: true }),
      markLessonCompleted: (id) =>
        set((state) =>
          // Не добавляем один урок дважды.
          state.completedLessons.includes(id)
            ? state
            : { completedLessons: [...state.completedLessons, id] },
        ),
      savePrompt: (templateId, title, text) =>
        set((state) => {
          const createdAt = Date.now();
          const prompt: SavedPrompt = {
            id: `${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
            templateId,
            title,
            text,
            createdAt,
          };
          return { savedPrompts: [prompt, ...state.savedPrompts] };
        }),
      deletePrompt: (id) =>
        set((state) => ({
          savedPrompts: state.savedPrompts.filter((prompt) => prompt.id !== id),
        })),
      resetAll: () => set(INITIAL_DATA),
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// true, когда сохранённые данные уже загружены из памяти телефона.
export function useHasHydrated() {
  return useSyncExternalStore(
    (onChange) => useAppStore.persist.onFinishHydration(onChange),
    () => useAppStore.persist.hasHydrated(),
  );
}
