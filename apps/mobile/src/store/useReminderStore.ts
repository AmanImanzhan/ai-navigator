import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Время напоминания по умолчанию — 19:00.
export const DEFAULT_REMINDER_HOUR = 19;
export const DEFAULT_REMINDER_MINUTE = 0;

type ReminderState = {
  // Напоминания включены. По умолчанию выключены: включает сам человек.
  enabled: boolean;
  hour: number;
  minute: number;
  setEnabled: (enabled: boolean) => void;
  setTime: (hour: number, minute: number) => void;
  reset: () => void;
};

const INITIAL = {
  enabled: false,
  hour: DEFAULT_REMINDER_HOUR,
  minute: DEFAULT_REMINDER_MINUTE,
};

// Настройки напоминаний. Хранятся только на этом телефоне и не синхронизируются:
// на рабочем телефоне человек может хотеть одно время, на домашнем — другое.
export const useReminderStore = create<ReminderState>()(
  persist(
    (set) => ({
      ...INITIAL,
      setEnabled: (enabled) => set({ enabled }),
      setTime: (hour, minute) => set({ hour, minute }),
      reset: () => set(INITIAL),
    }),
    {
      name: "reminders",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
