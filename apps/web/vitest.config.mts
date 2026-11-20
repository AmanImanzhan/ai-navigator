import { defineConfig } from "vitest/config";

// Тесты сайта и API (Vitest). Supabase, Anthropic и Sentry в тестах — моки,
// база — PGlite (src/test/db.ts). Тесты не ходят в сеть и не требуют ключей.
export default defineConfig({
  resolve: {
    // Пути «@/…» из tsconfig.json.
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    setupFiles: ["src/test/setup.ts"],
    // PGlite накатывает миграции за пару секунд.
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
