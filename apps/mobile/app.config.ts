import type { ConfigContext, ExpoConfig } from "expo/config";

// Основные настройки — в app.json. Этот файл добавляет к ним вход через Google.

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
  ],
  extra: {
    ...config.extra,
    // Приложение читает их через expo-constants (lib/auth/google.ts).
    googleAuth: {
      iosClientId: GOOGLE_IOS_CLIENT_ID,
      webClientId: GOOGLE_WEB_CLIENT_ID,
    },
  },
});
