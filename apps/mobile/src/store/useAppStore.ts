import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
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
  // UUID — такой же id у запроса и в базе.
  id: string;
  templateId: string;
  title: string;
  text: string;
  // Когда сохранён (миллисекунды) — новые показываем сверху.
  createdAt: number;
};

// Что ещё не отправлено в аккаунт. Это и есть очередь изменений: она хранится на телефоне
// и переживает перезапуск. Отправка повторяется, пока не получится (lib/sync).
export type PendingSync = {
  // id пройденных уроков.
  lessons: string[];
  // id сохранённых запросов.
  prompts: string[];
  // id запросов, удалённых на телефоне. Нужны, чтобы удалённое не вернулось из облака.
  deletedPrompts: string[];
  // Изменились ответы онбординга (язык, занятие, время, напоминания).
  profile: boolean;
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
  // Когда пройден каждый урок (миллисекунды). При слиянии с облаком берём самую раннюю дату.
  lessonCompletedAt: Record<string, number>;
  savedPrompts: SavedPrompt[];
  // Окно «Сохраните прогресс» уже предлагали — сами больше не показываем.
  saveProgressPromptShown: boolean;
  pendingSync: PendingSync;
  // Аккаунт, с которым последний раз синхронизировались данные на телефоне.
  // null — данные ещё ни с кем не синхронизировались (пользовались без входа).
  accountId: string | null;
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
  markSaveProgressPromptShown: () => void;
  // accountId — чей теперь телефон после сброса (вошедший пользователь остаётся вошедшим).
  resetAll: (accountId?: string | null) => void;
};

export const EMPTY_PENDING_SYNC: PendingSync = {
  lessons: [],
  prompts: [],
  deletedPrompts: [],
  profile: false,
};

const INITIAL_DATA: AppData = {
  language: "en",
  occupation: null,
  minutesPerDay: 10,
  reminderEnabled: true,
  onboardingDone: false,
  completedLessons: [],
  lessonCompletedAt: {},
  savedPrompts: [],
  saveProgressPromptShown: false,
  pendingSync: EMPTY_PENDING_SYNC,
  accountId: null,
};

// Версия формы сохранённых данных. 1 — добавлены синхронизация и UUID у запросов.
const STORE_VERSION = 1;

function addUnique(list: string[], id: string): string[] {
  return list.includes(id) ? list : [...list, id];
}

// Отметить, что ответы онбординга нужно отправить в аккаунт.
function withProfilePending(state: AppData): Pick<AppData, "pendingSync"> {
  return { pendingSync: { ...state.pendingSync, profile: true } };
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Данные из старой версии приложения → новая форма.
function migrate(persisted: unknown, version: number): unknown {
  if (version >= STORE_VERSION || typeof persisted !== "object" || !persisted) {
    return persisted;
  }
  const old = persisted as Partial<AppData>;
  const now = Date.now();
  return {
    ...old,
    // Когда пройдены старые уроки, неизвестно — считаем, что сейчас.
    lessonCompletedAt: Object.fromEntries(
      (old.completedLessons ?? []).map((id) => [id, now]),
    ),
    // Старые id вида "1731…-abc12" база не примет — выдаём новые UUID.
    savedPrompts: (old.savedPrompts ?? []).map((prompt) =>
      UUID_PATTERN.test(prompt.id)
        ? prompt
        : { ...prompt, id: Crypto.randomUUID() },
    ),
  };
}

// persist сам сохраняет данные в AsyncStorage и загружает их при запуске.
export const useAppStore = create<AppData & AppActions>()(
  persist(
    (set) => ({
      ...INITIAL_DATA,
      setLanguage: (language) =>
        set((state) => ({ language, ...withProfilePending(state) })),
      saveOccupation: (occupation) =>
        set((state) => ({ occupation, ...withProfilePending(state) })),
      completeOnboarding: (minutesPerDay, reminderEnabled) =>
        set((state) => ({
          minutesPerDay,
          reminderEnabled,
          onboardingDone: true,
          ...withProfilePending(state),
        })),
      markLessonCompleted: (id) =>
        set((state) =>
          // Не добавляем один урок дважды.
          state.completedLessons.includes(id)
            ? state
            : {
                completedLessons: [...state.completedLessons, id],
                lessonCompletedAt: {
                  ...state.lessonCompletedAt,
                  [id]: Date.now(),
                },
                pendingSync: {
                  ...state.pendingSync,
                  lessons: addUnique(state.pendingSync.lessons, id),
                },
              },
        ),
      savePrompt: (templateId, title, text) =>
        set((state) => {
          const prompt: SavedPrompt = {
            id: Crypto.randomUUID(),
            templateId,
            title,
            text,
            createdAt: Date.now(),
          };
          return {
            savedPrompts: [prompt, ...state.savedPrompts],
            pendingSync: {
              ...state.pendingSync,
              prompts: addUnique(state.pendingSync.prompts, prompt.id),
            },
          };
        }),
      deletePrompt: (id) =>
        set((state) => ({
          savedPrompts: state.savedPrompts.filter((prompt) => prompt.id !== id),
          pendingSync: {
            ...state.pendingSync,
            // Ещё не отправленный запрос отправлять уже не нужно.
            prompts: state.pendingSync.prompts.filter((item) => item !== id),
            deletedPrompts: addUnique(state.pendingSync.deletedPrompts, id),
          },
        })),
      markSaveProgressPromptShown: () => set({ saveProgressPromptShown: true }),
      resetAll: (accountId = null) => set({ ...INITIAL_DATA, accountId }),
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: STORE_VERSION,
      migrate: (persisted, version) =>
        migrate(persisted, version) as AppData & AppActions,
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
