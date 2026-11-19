import { create } from "zustand";

// Есть ли подписка AI Navigator Premium — по данным RevenueCat на этом телефоне.
// Только в памяти: сам RevenueCat хранит последний ответ на телефоне (кэш) и отдаёт его сразу,
// а свежий подтягивает в фоне. Лимит ИИ всё равно проверяет сервер (таблица subscriptions).
type PremiumState = {
  // Чей это ответ: id пользователя Supabase или null (не вошёл — анонимный покупатель).
  userId: string | null;
  premium: boolean;
  // Когда закончится доступ (ISO). null — нет подписки или срок неизвестен.
  expiresAt: string | null;
  // true, когда RevenueCat уже ответил хотя бы раз.
  checked: boolean;
  setPremium: (
    userId: string | null,
    premium: boolean,
    expiresAt: string | null,
  ) => void;
};

export const usePremiumStore = create<PremiumState>()((set) => ({
  userId: null,
  premium: false,
  expiresAt: null,
  checked: false,
  setPremium: (userId, premium, expiresAt) =>
    set({ userId, premium, expiresAt, checked: true }),
}));
