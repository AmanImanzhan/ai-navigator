import { AI_DAILY_LIMITS } from "@ai-navigator/shared";

// Настройки ИИ-помощника — всё в одном месте.

// Модель: Claude Haiku 5.5 — самая быстрая и недорогая модель Claude текущего поколения
// ($0.10 за 1 млн входных токенов, $0.50 за 1 млн выходных). Задачи помощника простые
// (короткий ответ и разбор, подбор значений полей), поэтому старшие модели здесь не нужны.
export const AI_MODEL = "claude-haiku-5-5";

// Настройки модели для обоих сценариев: без «размышлений» перед ответом и с низким усилием —
// так ответ начинается быстрее и стоит меньше. Для Haiku 5.5 выключить размышления можно
// только при усилии не выше high.
export const AI_PROVIDER_OPTIONS = {
  anthropic: {
    thinking: { type: "disabled" as const },
    effort: "low" as const,
  },
};

// ---------- Лимиты ----------

// Запросов к помощнику в день: без подписки и с подпиской AI Navigator Premium.
// Сами числа — в packages/shared/src/subscription.ts (их видит и приложение).
// Какой лимит применить, решает база (consume_ai_request) по таблице subscriptions.
export const FREE_DAILY_LIMIT = AI_DAILY_LIMITS.free;
export const PREMIUM_DAILY_LIMIT = AI_DAILY_LIMITS.premium;

// Самый длинный текст, который человек может прислать (в символах).
export const MAX_PROMPT_CHARS = 2000;
export const MAX_SITUATION_CHARS = 1000;

// Самый длинный ответ ИИ (в токенах). Ограничивает и цену, и время ответа
// (у Haiku 1200 токенов — порядка 10–15 секунд).
export const MAX_OUTPUT_TOKENS_TRY = 1200;
export const MAX_OUTPUT_TOKENS_FILL = 600;

// ---------- Время ----------

// Сколько хостинг даёт функции (API) на весь ответ, включая поток: Netlify — 60 секунд,
// не настраивается. Дольше — функцию обрывают: человек получит обрыв без события error,
// а попытка не вернётся. Поэтому ИИ обрываем сами раньше (ниже) и возвращаем попытку.
export const HOSTING_FUNCTION_LIMIT_MS = 60_000;
// Запас на всё, кроме ИИ: проверка входа, база (лимит, урок), запуск функции.
export const REQUEST_OVERHEAD_MS = 10_000;

// Сколько ждём ИИ. Не дождались — ошибка ai_unavailable и попытка возвращается.
// Вместе с REQUEST_OVERHEAD_MS должно укладываться в HOSTING_FUNCTION_LIMIT_MS (config.test.ts).
export const TRY_TIMEOUT = { firstChunkMs: 15_000, totalMs: 40_000 };
export const FILL_TIMEOUT_MS = 30_000;

// Повторов при сбое у провайдера. Каждый повтор — ещё ожидание для человека, поэтому один.
export const AI_MAX_RETRIES = 1;

// ---------- «Попробуй сам» ----------

// Строка, которой ИИ отделяет ответ от разбора запроса. Сервер режет по ней поток
// на события answer и review — приложению не нужно ничего разбирать.
export const REVIEW_MARKER = "[[REVIEW]]";
