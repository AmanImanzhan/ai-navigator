// Подписка AI Navigator Premium — бизнес-правила в одном месте (сервер и приложение).
// Все уроки и шаблоны бесплатные. По подписке — только больше запросов к ИИ-помощнику.

// Entitlement в RevenueCat: «есть ли Premium». Должен совпадать с id в панели RevenueCat.
export const PREMIUM_ENTITLEMENT = "premium";

// Товары в App Store Connect (группа подписок «AI Navigator Premium»).
// $2.99 в месяц и $19.99 в год, у обоих пробный период 3 дня (introductory offer).
// Цены и пробный период задаются в App Store Connect — здесь только id.
export const PREMIUM_PRODUCTS = {
  monthly: "ainavigator_premium_monthly",
  yearly: "ainavigator_premium_yearly",
} as const;

export type PremiumProductId =
  (typeof PREMIUM_PRODUCTS)[keyof typeof PREMIUM_PRODUCTS];

// Запросов к ИИ-помощнику в день (сутки по UTC). Проверяет сервер (consume_ai_request).
export const AI_DAILY_LIMITS = {
  free: 3,
  premium: 30,
} as const;
