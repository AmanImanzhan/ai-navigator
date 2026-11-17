import type { AiUsage } from "@ai-navigator/shared";
import { create } from "zustand";

// Сколько запросов к ИИ-помощнику осталось сегодня. Только в памяти: при запуске спрашиваем сервер
// заново. userId — чей это остаток, чтобы после смены аккаунта не показать чужой.
type AiUsageState = {
  userId: string | null;
  usage: AiUsage | null;
  setUsage: (userId: string, usage: AiUsage) => void;
};

export const useAiUsageStore = create<AiUsageState>()((set) => ({
  userId: null,
  usage: null,
  setUsage: (userId, usage) => set({ userId, usage }),
}));
