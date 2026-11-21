import Constants from "expo-constants";

// development / preview / production — профиль EAS, с которым собрано приложение
// (app.config.ts → extra.appEnv). При запуске через `expo start` — development.
// По нему Sentry и PostHog отделяют настоящие события (production) от тестовых.
const extra: unknown = Constants.expoConfig?.extra;

export const APP_ENV: string =
  typeof extra === "object" &&
  extra !== null &&
  "appEnv" in extra &&
  typeof extra.appEnv === "string"
    ? extra.appEnv
    : "development";
