// Настройки ИИ-помощника в приложении. Сам ИИ, лимиты и ключи — на сервере (apps/web/src/lib/ai).

// Адрес сайта с API (apps/mobile/.env → EXPO_PUBLIC_API_URL). Нет адреса — помощник недоступен.
export const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

// Максимальная длина текста. Проверяет сервер (apps/web/src/lib/ai/config.ts);
// здесь те же числа, чтобы поле ввода не давало набрать больше.
export const MAX_PROMPT_CHARS = 2000;
export const MAX_SITUATION_CHARS = 1000;

// Таймауты. Сервер сам ограничивает ИИ (первое слово — 15 с, весь ответ — 45 с) и в этом
// случае возвращает попытку. Наши таймауты длиннее: они ловят пропавшую связь, а не медленный ИИ.
// «Попробуй сам»: сколько ждать начала ответа и сколько — тишины между кусочками.
export const TRY_START_TIMEOUT_MS = 40_000;
export const TRY_IDLE_TIMEOUT_MS = 25_000;
// «Заполнить с помощником» — весь ответ целиком.
export const FILL_TIMEOUT_MS = 40_000;
// «Сколько осталось».
export const USAGE_TIMEOUT_MS = 10_000;
