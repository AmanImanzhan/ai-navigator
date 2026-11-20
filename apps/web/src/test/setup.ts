import { vi } from "vitest";

// «server-only» запрещает импорт серверного кода в браузер; в тестах (Node) он не нужен.
vi.mock("server-only", () => ({}));

// Ненастоящие значения переменных окружения: код сервера читает их, но в сеть не ходит —
// Supabase и Anthropic в тестах подменены. Настоящих ключей в тестах нет и не нужно.
process.env.SUPABASE_URL = "http://supabase.test";
process.env.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
process.env.SUPABASE_SECRET_KEY = "sb_secret_test";
process.env.ANTHROPIC_API_KEY = "sk-ant-test";
process.env.REVENUECAT_WEBHOOK_SECRET = "rc_webhook_test_secret";
