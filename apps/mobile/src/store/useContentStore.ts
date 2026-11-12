import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ContentSnapshot } from "@/data/remote/buildSnapshot";

// Версия формы кэша. Поменяли ContentSnapshot или типы уроков — увеличьте число:
// старый кэш выбросится, и приложение загрузит контент заново.
const CONTENT_CACHE_VERSION = 1;

type ContentState = {
  // Последний загруженный из базы контент. Храним один язык — тот, на котором он загружен.
  snapshot: ContentSnapshot | null;
  // true, когда кэш прочитан из памяти телефона (или прочитать не вышло). В память не сохраняется.
  hydrated: boolean;
  saveSnapshot: (snapshot: ContentSnapshot) => void;
};

// Кэш контента из Supabase. Отдельно от useAppStore: это копия данных базы, а не данные пользователя.
export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      snapshot: null,
      hydrated: false,
      saveSnapshot: (snapshot) => set({ snapshot }),
    }),
    {
      name: "content-cache",
      storage: createJSONStorage(() => AsyncStorage),
      version: CONTENT_CACHE_VERSION,
      // Кэш старой версии не переделываем — просто выбрасываем.
      migrate: () => ({ snapshot: null }),
      partialize: (state) => ({ snapshot: state.snapshot }),
      // Вызывается и после удачного чтения, и после ошибки (например, повреждённый кэш).
      // Без этого при ошибке заставка висела бы вечно.
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          useContentStore.setState({ snapshot: null });
        }
        useContentStore.setState({ hydrated: true });
      },
    },
  ),
);
