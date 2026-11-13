// Способы входа. Новый провайдер: добавить id сюда,
// файл с его signIn рядом (как apple.ts, google.ts), строку в AUTH_PROVIDERS (index.ts)
// и кнопку в components/auth/SignInButtons.tsx.
export type AuthProviderId = "apple" | "google";

// Чем закончилась попытка входа.
// cancelled — человек сам закрыл окно входа: это не ошибка, ничего не показываем.
export type SignInResult =
  | { status: "signedIn" }
  | { status: "cancelled" }
  | { status: "error"; error: unknown };

export type AuthProvider = {
  // Можно ли войти этим способом на этом телефоне (Apple — только iOS).
  isAvailable: () => Promise<boolean>;
  signIn: () => Promise<SignInResult>;
  // Выход из самого провайдера на телефоне, если он помнит аккаунт (Google помнит, Apple — нет).
  signOut?: () => Promise<void>;
};
