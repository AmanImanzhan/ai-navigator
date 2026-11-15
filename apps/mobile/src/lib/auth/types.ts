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

// Подготовка к удалению аккаунта.
// body — что провайдер передаёт серверной функции delete-account (Apple — свежий код входа).
// cancelled — человек закрыл окно подтверждения: удаление не начинаем.
export type DeletionPreparation =
  | { status: "ready"; body: Record<string, string> }
  | { status: "cancelled" }
  | { status: "error"; error: unknown };

export type AuthProvider = {
  // Можно ли войти этим способом на этом телефоне (Apple — только iOS).
  isAvailable: () => Promise<boolean>;
  signIn: () => Promise<SignInResult>;
  // Выход из самого провайдера на телефоне, если он помнит аккаунт (Google помнит, Apple — нет).
  signOut?: () => Promise<void>;
  // Перед удалением аккаунта (Apple: ещё раз показать окно Apple и получить код для отзыва).
  prepareAccountDeletion?: () => Promise<DeletionPreparation>;
  // После удаления аккаунта (Google: отозвать доступ приложения к аккаунту Google).
  afterAccountDeletion?: () => Promise<void>;
};
