// Ручная проверка ИИ-помощника (apps/web/src/app/api/ai) без приложения.
//
//   npm run ai:smoke              — получить токен тестового пользователя и готовые команды curl
//   npm run ai:smoke -- --run     — сразу вызвать /api/ai/usage, /api/ai/try и /api/ai/fill
//   npm run ai:smoke -- --delete  — удалить тестового пользователя
//
// Адрес сайта — AI_BASE_URL (по умолчанию http://localhost:3000, где работает `npm run dev`).
// Нужен корневой .env с SUPABASE_URL и SUPABASE_SECRET_KEY (как для seed-content).
//
// Тестовый пользователь — обычный пользователь Supabase с почтой ai-smoke@example.com.
// Пароль генерируется заново при каждом запуске и нигде не сохраняется.

import { randomBytes } from "node:crypto";

import { createClient } from "@supabase/supabase-js";

import type {
  AiFillRequest,
  AiTryRequest,
  Database,
} from "@ai-navigator/shared";

process.loadEnvFile();

const TEST_EMAIL = "ai-smoke@example.com";
const BASE_URL = (process.env.AI_BASE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Нет ${name} в .env — см. .env.example`);
  return value;
}

const admin = createClient<Database>(
  requireEnv("SUPABASE_URL"),
  requireEnv("SUPABASE_SECRET_KEY"),
  { auth: { persistSession: false, autoRefreshToken: false } },
);

async function findTestUserId(): Promise<string | null> {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw new Error(`listUsers: ${error.message}`);
    const user = data.users.find((item) => item.email === TEST_EMAIL);
    if (user) return user.id;
    if (data.users.length < 200) return null;
  }
  return null;
}

// Создаёт тестового пользователя (или задаёт ему новый пароль) и входит — получаем токен.
async function getTestToken(): Promise<string> {
  const password = randomBytes(24).toString("base64url");
  const existing = await findTestUserId();
  if (existing) {
    const { error } = await admin.auth.admin.updateUserById(existing, {
      password,
    });
    if (error) throw new Error(`updateUserById: ${error.message}`);
  } else {
    const { error } = await admin.auth.admin.createUser({
      email: TEST_EMAIL,
      password,
      email_confirm: true,
      user_metadata: { full_name: "AI Smoke Test" },
    });
    if (error) throw new Error(`createUser: ${error.message}`);
  }

  const { data, error } = await admin.auth.signInWithPassword({
    email: TEST_EMAIL,
    password,
  });
  if (error || !data.session) {
    throw new Error(
      `Не получилось войти: ${error?.message ?? "нет сессии"}. ` +
        "Проверьте, что в Supabase включён вход по почте: Authentication → Sign In / Providers → Email.",
    );
  }
  return data.session.access_token;
}

const TRY_BODY: AiTryRequest = {
  lessonId: "1",
  locale: "ru",
  prompt:
    "Напиши поздравление коллеге Ане с днём рождения. Мы работаем вместе 3 года, она любит горы и кофе.",
};

const FILL_BODY: AiFillRequest = {
  templateId: "1.5",
  locale: "ru",
  situation:
    "Хочу объяснить маме, что такое инфляция, чтобы она поняла, почему всё дорожает.",
};

function curlCommands(token: string): string {
  const auth = `-H "Authorization: Bearer ${token}"`;
  const json = `-H "Content-Type: application/json"`;
  return [
    `# Сколько запросов осталось сегодня`,
    `curl -s ${auth} ${BASE_URL}/api/ai/usage`,
    ``,
    `# «Попробуй сам» — ответ потоком (-N: показывать строки сразу)`,
    `curl -N -s ${auth} ${json} -d '${JSON.stringify(TRY_BODY)}' ${BASE_URL}/api/ai/try`,
    ``,
    `# «Заполнить с помощником»`,
    `curl -s ${auth} ${json} -d '${JSON.stringify(FILL_BODY)}' ${BASE_URL}/api/ai/fill`,
    ``,
    `# Без токена — должно быть 401 unauthorized`,
    `curl -s -i ${json} -d '${JSON.stringify(TRY_BODY)}' ${BASE_URL}/api/ai/try | head -1`,
  ].join("\n");
}

async function runAll(token: string) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  console.log("\n— GET /api/ai/usage");
  const usage = await fetch(`${BASE_URL}/api/ai/usage`, { headers });
  console.log(usage.status, await usage.text());

  console.log("\n— POST /api/ai/try (поток)");
  const tryRes = await fetch(`${BASE_URL}/api/ai/try`, {
    method: "POST",
    headers,
    body: JSON.stringify(TRY_BODY),
  });
  console.log("статус:", tryRes.status);
  if (tryRes.body && tryRes.headers.get("content-type")?.includes("ndjson")) {
    const decoder = new TextDecoder();
    let section = "";
    for await (const chunk of tryRes.body) {
      for (const line of decoder.decode(chunk, { stream: true }).split("\n")) {
        if (!line.trim()) continue;
        const event = JSON.parse(line) as { type: string; text?: string };
        if (event.type === "answer" || event.type === "review") {
          if (section !== event.type) {
            process.stdout.write(`\n[${event.type}]\n`);
            section = event.type;
          }
          process.stdout.write(event.text ?? "");
        } else {
          process.stdout.write(`\n${line}\n`);
        }
      }
    }
  } else {
    console.log(await tryRes.text());
  }

  console.log("\n— POST /api/ai/fill");
  const fill = await fetch(`${BASE_URL}/api/ai/fill`, {
    method: "POST",
    headers,
    body: JSON.stringify(FILL_BODY),
  });
  console.log(fill.status, await fill.text());
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--delete")) {
    const id = await findTestUserId();
    if (!id) return console.log("Тестового пользователя нет.");
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) throw new Error(`deleteUser: ${error.message}`);
    return console.log(`Удалён ${TEST_EMAIL}.`);
  }

  const token = await getTestToken();
  console.log(`Токен тестового пользователя ${TEST_EMAIL} (действует ~1 час).`);
  console.log(`Не публикуйте его. Сайт: ${BASE_URL}\n`);
  console.log(curlCommands(token));

  if (args.includes("--run")) await runAll(token);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
