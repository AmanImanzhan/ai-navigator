import type { ConfigContext, ExpoConfig } from "expo/config";

// Основные настройки — в app.json. Этот файл добавляет к ним вход через Google и Sentry.

// ---------- Google Client ID: вставьте сюда ----------
// Это не секреты: они всё равно попадают в приложение. Client Secret сюда НЕ вставлять —
// он нужен только в Supabase Dashboard.
// Формат: "123456789012-abc123def456.apps.googleusercontent.com".
// Пока строки пустые, кнопки Google в приложении нет.

// Google Cloud → Clients → клиент типа iOS.
const GOOGLE_IOS_CLIENT_ID = "254126463928-hg8d2u4ngubn7273u3k65dnlc8a6r2m1.apps.googleusercontent.com";
// Google Cloud → Clients → клиент типа Web application (тот же, что в Supabase).
const GOOGLE_WEB_CLIENT_ID = "254126463928-f3l9vhf571jjiijhh2ks2l89p5515kte.apps.googleusercontent.com";

// ---------------------------------------------------------

const GOOGLE_ID_SUFFIX = ".apps.googleusercontent.com";
const GOOGLE_SCHEME_PREFIX = "com.googleusercontent.apps.";

// iOS возвращает человека в приложение после входа Google по «перевёрнутому» Client ID:
// "123-abc.apps.googleusercontent.com" → "com.googleusercontent.apps.123-abc".
// Считаем его сами, чтобы не ошибиться руками. Пока ID нет — заглушка, чтобы сборка не падала.
function googleIosUrlScheme(iosClientId: string): string {
  if (!iosClientId.endsWith(GOOGLE_ID_SUFFIX)) {
    return `${GOOGLE_SCHEME_PREFIX}not-configured`;
  }
  return GOOGLE_SCHEME_PREFIX + iosClientId.slice(0, -GOOGLE_ID_SUFFIX.length);
}

// ---------- Sentry: загрузка source maps ----------
// Профиль EAS (development / preview / production). EAS задаёт EAS_BUILD_PROFILE при сборке;
// при `expo start` его нет — значит, разработка.
const APP_ENV = process.env.EAS_BUILD_PROFILE ?? "development";
// Организация и проект Sentry — из переменных окружения EAS (не секреты, но и не в коде).
// Source maps (чтобы в отчёте была понятная строка кода) загружаются только для preview и
// production и только если в EAS есть секрет SENTRY_AUTH_TOKEN. Нет токена — сборка не падает.
// Организация Sentry — в регионе EU (de.sentry.io). sentry-cli 3 берёт адрес сервера из того же
// места, что и токен: токен приходит переменной окружения EAS, значит, и адрес нужен там же
// (SENTRY_URL). Иначе адрес из sentry.properties игнорируется и запросы уходят на sentry.io.
const SENTRY_URL = process.env.SENTRY_URL ?? "https://de.sentry.io/";
const SENTRY_UPLOAD =
  APP_ENV !== "development" &&
  Boolean(process.env.SENTRY_AUTH_TOKEN) &&
  Boolean(process.env.SENTRY_ORG) &&
  Boolean(process.env.SENTRY_PROJECT);

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? "AI Navigator",
  slug: config.slug ?? "ai-navigator",
  plugins: [
    ...(config.plugins ?? []),
    [
      "@react-native-google-signin/google-signin",
      { iosUrlScheme: googleIosUrlScheme(GOOGLE_IOS_CLIENT_ID) },
    ],
    [
      "@sentry/react-native/expo",
      {
        url: SENTRY_URL,
        organization: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        // Токен читается из SENTRY_AUTH_TOKEN во время сборки — в конфиг его не пишем.
        disableAutoUpload: !SENTRY_UPLOAD,
      },
    ],
  ],
  extra: {
    ...config.extra,
    // Окружение для Sentry (lib/monitoring): development / preview / production.
    appEnv: APP_ENV,
    // Приложение читает их через expo-constants (lib/auth/google.ts).
    googleAuth: {
      iosClientId: GOOGLE_IOS_CLIENT_ID,
      webClientId: GOOGLE_WEB_CLIENT_ID,
    },
  },
});
