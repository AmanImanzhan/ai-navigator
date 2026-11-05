import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  DailyMinutes,
  LanguageCode,
  OccupationId,
} from "@/data/onboarding";

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
};

type AppActions = {
  setLanguage: (language: LanguageCode) => void;
  saveOccupation: (occupation: OccupationId) => void;
  completeOnboarding: (
    minutesPerDay: DailyMinutes,
    reminderEnabled: boolean,
  ) => void;
  markLessonCompleted: (id: string) => void;
  resetAll: () => void;
};

const INITIAL_DATA: AppData = {
  language: "en",
  occupation: null,
  minutesPerDay: 10,
  reminderEnabled: true,
  onboardingDone: false,
  completedLessons: [],
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
