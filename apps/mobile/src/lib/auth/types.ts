// Способы входа. Новый провайдер (Google — Задача 23.2): добавить id сюда,
// файл с его signIn рядом (как apple.ts) и строку в AUTH_PROVIDERS (index.ts).
export type AuthProviderId = "apple";

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
};
