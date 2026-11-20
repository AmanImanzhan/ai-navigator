// Тесты приложения: Jest + jest-expo (по документации Expo: docs.expo.dev/develop/unit-testing).
// Тесты не ходят в сеть: Supabase, RevenueCat, Sentry и PostHog в них подменены.

// Часовой пояс с большой разницей с UTC: так видно, если код путает местную дату и UTC
// (например, «сегодня уже занимались» в напоминаниях). Задаём до запуска тестов.
process.env.TZ = "America/Los_Angeles";

/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.setup.ts"],
  testMatch: ["<rootDir>/src/**/*.test.ts?(x)"],
  // Каждый тест — с чистыми моками: вызовы и подмены из прошлого теста не мешают.
  clearMocks: true,
  restoreMocks: true,
  // Пакеты React Native и Expo приходят непереведёнными (ESM, Flow) — их Jest тоже
  // пропускает через Babel. Шаблон — из документации Expo для npm.
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|posthog-react-native)",
  ],
};
