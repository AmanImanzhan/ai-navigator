// Общий код для приложения, сайта и скриптов.

// Типы базы Supabase. database.types.ts создаёт команда `npm run db:types` — не правьте его руками.
export * from "./database.types";

// Протокол API ИИ-помощника (сервер — apps/web, клиент — приложение).
export type * from "./ai";

// Поля шаблонов запросов.
export { getTemplateFields } from "./templates";

// Контент уроков: типы карточек и проверка (одна для приложения и админки).
export * from "./content";
