import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { setLessonPublished } from "@/lib/admin/actions";
import { getAdminForAction, requireAdminPage } from "@/lib/admin/auth";
import { LESSON_ID, seedContent } from "@/test/ai";
import { createTestDb, type TestDb } from "@/test/db";
import { connectFakeSupabase, fakeSupabase, type Tokens } from "@/test/supabase";

// Админка: страницы и действия доступны только тем, кто есть в public.admins.
// Сессия (cookie) подменена: в каждом тесте задаём, кто «вошёл».

const session = vi.hoisted(() => ({ token: undefined as string | undefined }));

vi.mock("@supabase/supabase-js", async () => (await import("@/test/supabase")).supabaseModuleMock);
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({ headers: vi.fn(), cookies: vi.fn() }));
// redirect в Next.js прерывает выполнение исключением — делаем так же, но с понятным текстом.
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT ${url}`);
  },
}));
vi.mock("@/lib/supabase/session", async () => {
  const supabase = await import("@/test/supabase");
  return {
    createSessionClient: async () => supabase.sessionClient(session.token),
  };
});

let testDb: TestDb;
const tokens: Tokens = {};

beforeAll(async () => {
  testDb = await createTestDb();
  await seedContent(testDb);
  connectFakeSupabase(testDb, tokens);
});

afterAll(async () => {
  await testDb.close();
});

beforeEach(() => {
  session.token = undefined;
});

// Вошёл через Google; admin — есть ли в таблице admins.
async function signIn(admin: boolean): Promise<string> {
  const id = randomUUID();
  await testDb.createUser(id);
  tokens[`session-${id}`] = { sub: id, role: "authenticated", email: `${id}@example.com` };
  if (admin) {
    await testDb.run("service", "insert into public.admins (user_id) values ($1)", [id]);
  }
  session.token = `session-${id}`;
  return id;
}

async function lessonPublished(): Promise<boolean> {
  const rows = await testDb.run<{ published: boolean }>(
    "service",
    "select published from public.lessons where id = $1",
    [LESSON_ID],
  );
  return rows[0]?.published ?? false;
}

describe("admin access", () => {
  it("not signed in → page redirects to login, action gets nothing", async () => {
    await expect(requireAdminPage()).rejects.toThrow("REDIRECT /admin/login");
    expect(await getAdminForAction()).toBeNull();
  });

  it("forged session → same as not signed in", async () => {
    session.token = "forged";
    await expect(requireAdminPage()).rejects.toThrow("REDIRECT /admin/login");
  });

  it("signed in but not an admin → 'no access' page, action gets nothing", async () => {
    await signIn(false);
    await expect(requireAdminPage()).rejects.toThrow("REDIRECT /admin/no-access");
    expect(await getAdminForAction()).toBeNull();
  });

  it("admin → gets the context with the server database client", async () => {
    const id = await signIn(true);
    const admin = await requireAdminPage();
    expect(admin.user).toEqual({ id, email: `${id}@example.com` });
    expect(await getAdminForAction()).not.toBeNull();
  });

  it("a non-admin cannot change content through a Server Action", async () => {
    await signIn(false);
    const before = await lessonPublished();
    const result = await setLessonPublished(LESSON_ID, !before);
    expect(result).toMatchObject({ ok: false });
    expect(await lessonPublished()).toBe(before);
  });

  it("a user cannot make themselves an admin through the database", async () => {
    const id = await signIn(false);
    await expect(
      testDb.run({ user: id }, "insert into public.admins (user_id) values ($1)", [id]),
    ).rejects.toThrow(/permission denied/);
    const rows = await fakeSupabase(testDb, { user: id }).from("admins").select("user_id");
    expect(rows.data ?? []).toEqual([]);
  });
});
