// Протокол API ИИ-помощника (apps/web/src/app/api/ai). Общий для сервера и приложения,
// чтобы обе стороны понимали запросы и ответы одинаково.

export type AiLocale = "en" | "ru" | "es";

// ---------- Коды ошибок ----------

export type AiErrorCode =
  // Нет токена или он недействителен — нужно войти.
  | "unauthorized"
  // Тело запроса не того формата.
  | "invalid_request"
  // Текст длиннее допустимого (см. limits в ответе).
  | "input_too_long"
  // Урок или шаблон не найден (или не опубликован).
  | "not_found"
  // Дневной лимит исчерпан — см. resetAt.
  | "limit_reached"
  // ИИ отказался отвечать на этот запрос. Попытка возвращена.
  | "ai_declined"
  // ИИ не ответил (сбой, таймаут). Попытка возвращена.
  | "ai_unavailable"
  // Сервер не настроен (нет ключей). Ошибка разработчика, а не пользователя.
  | "server_not_configured";

export type AiErrorResponse = {
  error: AiErrorCode;
  // Для limit_reached: когда счётчик обнулится (ISO, полночь UTC).
  resetAt?: string;
  // Для input_too_long: сколько символов можно.
  maxLength?: number;
};

// Сколько запросов осталось сегодня.
export type AiUsage = {
  // Дневной лимит: 3 без подписки, 30 с подпиской (AI_DAILY_LIMITS в subscription.ts).
  limit: number;
  // Есть ли подписка — по данным сервера (таблица subscriptions).
  premium: boolean;
  used: number;
  remaining: number;
  // Когда счётчик обнулится (ISO, полночь UTC).
  resetAt: string;
};

// ---------- «Попробуй сам»: POST /api/ai/try ----------

export type AiTryRequest = {
  lessonId: string;
  locale: AiLocale;
  // Запрос, который человек сам написал к ИИ.
  prompt: string;
};

// Ответ — поток NDJSON: по одному JSON-событию на строку.
// Порядок: meta → answer… → review… → done. При сбое посреди ответа — error вместо done.
export type AiTryEvent =
  | { type: "meta"; usage: AiUsage }
  // Кусок ответа ИИ на запрос человека.
  | { type: "answer"; text: string }
  // Кусок разбора: что в запросе хорошо и что улучшить.
  | { type: "review"; text: string }
  | { type: "done" }
  | { type: "error"; error: AiErrorCode };

// ---------- «Заполнить с помощником»: POST /api/ai/fill ----------

export type AiFillRequest = {
  templateId: string;
  locale: AiLocale;
  // Ситуация человека своими словами.
  situation: string;
};

export type AiFillResponse = {
  // Значения полей шаблона: { "[тема]" без скобок → значение }. Поля, для которых ИИ не нашёл
  // значения в описании ситуации, не приходят — человек заполнит их сам.
  values: Record<string, string>;
  // Короткий совет: что уточнить или проверить.
  tip: string;
  usage: AiUsage;
};
