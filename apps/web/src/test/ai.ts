import { randomUUID } from "node:crypto";

import type { LanguageModelV4StreamPart } from "@ai-sdk/provider";
import { MockLanguageModelV4 } from "ai/test";

import type { TestDb } from "@/test/db";
import type { Tokens } from "@/test/supabase";

// Общее для тестов ИИ-маршрутов: пользователи с токенами, урок и шаблон в базе,
// подменённая модель Claude (MockLanguageModelV4 из AI SDK — без сети и без ключа).

export const LESSON_ID = "t1";
export const TEMPLATE_ID = "tpl1";
export const UNPUBLISHED_LESSON_ID = "draft";

// Опубликованный урок с шаблоном и неопубликованный черновик.
export async function seedContent(testDb: TestDb): Promise<void> {
  await testDb.db.exec(`
    insert into public.tracks (id, sort) values ('basics', 1);
    insert into public.lessons (id, track_id, sort, level, minutes, published) values
      ('${LESSON_ID}', 'basics', 1, 1, 5, true),
      ('${UNPUBLISHED_LESSON_ID}', 'basics', 2, 1, 5, false);
    insert into public.lesson_translations (lesson_id, locale, title, content) values
      ('${LESSON_ID}', 'en', 'Write an email', '{"skill": "Write emails", "cards": []}'),
      ('${UNPUBLISHED_LESSON_ID}', 'en', 'Draft', '{"cards": []}');
    insert into public.templates (id, lesson_id, sort, published) values
      ('${TEMPLATE_ID}', '${LESSON_ID}', 1, true);
    insert into public.template_translations
      (template_id, locale, title, purpose, prompt, example) values
      ('${TEMPLATE_ID}', 'en', 'Email', 'Write an email',
       'Write an email to [recipient] about [topic]', 'Write an email to my boss about vacation');
  `);
}

// Новый пользователь и его «токен» (подменённый getClaims примет только его).
export async function signedInUser(
  testDb: TestDb,
  tokens: Tokens,
): Promise<{ id: string; token: string }> {
  const id = randomUUID();
  await testDb.createUser(id);
  const token = `token-${id}`;
  tokens[token] = { sub: id, role: "authenticated" };
  return { id, token };
}

export async function usedToday(testDb: TestDb, userId: string): Promise<number> {
  const rows = await testDb.run<{ count: number }>(
    "service",
    "select coalesce(sum(count), 0)::int as count from public.ai_usage where user_id = $1",
    [userId],
  );
  return rows[0]?.count ?? 0;
}

const USAGE = {
  inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 10, text: 10, reasoning: 0 },
};

const FINISH: LanguageModelV4StreamPart = {
  type: "finish",
  usage: USAGE,
  finishReason: { unified: "stop", raw: "end_turn" },
};

function stream(parts: LanguageModelV4StreamPart[]) {
  return new ReadableStream<LanguageModelV4StreamPart>({
    start(controller) {
      for (const part of parts) controller.enqueue(part);
      controller.close();
    },
  });
}

function textParts(texts: string[]): LanguageModelV4StreamPart[] {
  return [
    { type: "stream-start", warnings: [] },
    { type: "text-start", id: "1" },
    ...texts.map((delta): LanguageModelV4StreamPart => ({ type: "text-delta", id: "1", delta })),
    { type: "text-end", id: "1" },
  ];
}

// Модель отвечает потоком: ответ, маркер, разбор.
export function streamingModel(texts: string[]): MockLanguageModelV4 {
  return new MockLanguageModelV4({
    doStream: async () => ({ stream: stream([...textParts(texts), FINISH]) }),
  });
}

// Модель начала отвечать и упала посреди ответа.
export function modelFailingMidStream(texts: string[]): MockLanguageModelV4 {
  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: stream([...textParts(texts), { type: "error", error: new Error("overloaded") }]),
    }),
  });
}

// Провайдер недоступен сразу. В сообщении ошибки — текст запроса: он не должен
// попасть ни в ответ, ни в Sentry.
export function failingModel(secretText: string): MockLanguageModelV4 {
  const fail = async (): Promise<never> => {
    throw Object.assign(new Error(`provider failed for: ${secretText}`), {
      name: "AI_APICallError",
      statusCode: 529,
    });
  };
  return new MockLanguageModelV4({ doStream: fail, doGenerate: fail });
}

// «Заполнить»: модель возвращает JSON по схеме.
export function fillModel(output: unknown, unified: "stop" | "content-filter" = "stop") {
  return new MockLanguageModelV4({
    doGenerate: async () => ({
      content: [{ type: "text", text: JSON.stringify(output) }],
      finishReason: { unified, raw: undefined },
      usage: USAGE,
      warnings: [],
    }),
  });
}

export function aiRequest(path: string, body: unknown, token?: string): Request {
  const headers = new Headers({ "content-type": "application/json" });
  if (token) headers.set("authorization", `Bearer ${token}`);
  return new Request(`http://localhost${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

// NDJSON-ответ «Попробуй сам» → список событий.
export async function readEvents(response: Response): Promise<unknown[]> {
  const text = await response.text();
  return text
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as unknown);
}
