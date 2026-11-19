import { create } from "zustand";

// Подписка AI Navigator Premium по данным RevenueCat на этом телефоне.
export type PremiumInfo = {
  premium: boolean;
  // Когда закончится или продлится доступ (ISO). null — нет подписки или срок неизвестен.
  expiresAt: string | null;
  // true — продлится сама; false — автопродление выключено, доступ до expiresAt.
  willRenew: boolean;
  // Идёт пробный период.
  trial: boolean;
};

export const NO_PREMIUM: PremiumInfo = {
  premium: false,
  expiresAt: null,
  willRenew: false,
  trial: false,
};

// Только в памяти: сам RevenueCat хранит последний ответ на телефоне (кэш) и отдаёт его сразу,
// а свежий подтягивает в фоне. Лимит ИИ всё равно проверяет сервер (таблица subscriptions).
type PremiumState = PremiumInfo & {
  // Чей это ответ: id пользователя Supabase или null (не вошёл — анонимный покупатель).
  userId: string | null;
  // true, когда RevenueCat уже ответил хотя бы раз.
  checked: boolean;
  setPremium: (userId: string | null, info: PremiumInfo) => void;
};

export const usePremiumStore = create<PremiumState>()((set) => ({
  ...NO_PREMIUM,
  userId: null,
  checked: false,
  setPremium: (userId, info) => set({ ...info, userId, checked: true }),
}));
