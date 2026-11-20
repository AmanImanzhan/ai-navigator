import type { Database } from "@ai-navigator/shared";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { DbRole, TestDb } from "@/test/db";

// Подмена клиента Supabase для тестов: вместо HTTP-запросов к Supabase — SQL в PGlite.
// Умеет ровно то, чем пользуется наш серверный код: rpc(…) и from(…).select().eq().in().

type Result = { data: unknown; error: { code: string; message: string } | null };

function toError(error: unknown): Result {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "unknown";
  const message = error instanceof Error ? error.message : "unknown";
  return { data: null, error: { code, message } };
}

// Только простые имена (таблицы, колонки, функции): защита от опечаток в тестах.
function name(value: string): string {
  if (!/^[a-z_][a-z0-9_]*$/.test(value)) throw new Error(`bad identifier: ${value}`);
  return value;
}

async function rpc(
  testDb: TestDb,
  role: DbRole,
  fn: string,
  args: Record<string, unknown> = {},
): Promise<Result> {
  const keys = Object.keys(args);
  const params = keys.map((key, index) => `${name(key)} => $${index + 1}`).join(", ");
  try {
    const rows = await testDb.run<Record<string, unknown>>(
      role,
      `select * from public.${name(fn)}(${params})`,
      keys.map((key) => args[key]),
    );
    // Функция возвращает одно значение (text, boolean) — Supabase отдаёт его без обёртки.
    const first = rows[0];
    if (rows.length === 1 && first && Object.keys(first).length === 1 && fn in first) {
      return { data: first[fn], error: null };
    }
    return { data: rows, error: null };
  } catch (error) {
    return toError(error);
  }
}

class Query implements PromiseLike<Result> {
  private columns = "*";
  private readonly where: { column: string; values: unknown[] }[] = [];
  private single = false;

  constructor(
    private readonly testDb: TestDb,
    private readonly role: DbRole,
    private readonly table: string,
  ) {}

  select(columns: string) {
    this.columns = columns
      .split(",")
      .map((column) => name(column.trim()))
      .join(", ");
    return this;
  }

  eq(column: string, value: unknown) {
    this.where.push({ column: name(column), values: [value] });
    return this;
  }

  in(column: string, values: unknown[]) {
    this.where.push({ column: name(column), values });
    return this;
  }

  maybeSingle() {
    this.single = true;
    return this;
  }

  private async execute(): Promise<Result> {
    const params: unknown[] = [];
    const conditions = this.where.map(({ column, values }) => {
      const placeholders = values.map((value) => {
        params.push(value);
        return `$${params.length}`;
      });
      return `${column}::text in (${placeholders.join(", ")})`;
    });
    const sql = `select ${this.columns} from public.${name(this.table)}${
      conditions.length > 0 ? ` where ${conditions.join(" and ")}` : ""
    }`;
    try {
      const rows = await this.testDb.run(this.role, sql, params);
      return { data: this.single ? (rows[0] ?? null) : rows, error: null };
    } catch (error) {
      return toError(error);
    }
  }

  then<A = Result, B = never>(
    onFulfilled?: ((value: Result) => A | PromiseLike<A>) | null,
    onRejected?: ((reason: unknown) => B | PromiseLike<B>) | null,
  ): PromiseLike<A | B> {
    return this.execute().then(onFulfilled, onRejected);
  }
}

export type FakeClaims = {
  sub: string;
  role: "authenticated" | "anon" | "service_role";
  email?: string;
};

export type Tokens = Record<string, FakeClaims>;

// tokens — какие «токены» считать настоящими и кому они принадлежат.
// Неизвестный токен — getClaims вернёт ошибку, как Supabase на подделанный JWT.
// sessionToken — токен из cookie (админка): getClaims() без аргумента проверяет его.
export function fakeSupabase(
  testDb: TestDb,
  role: DbRole,
  tokens: Tokens = {},
  sessionToken?: string,
): SupabaseClient<Database> {
  const client = {
    rpc: (fn: string, args?: Record<string, unknown>) => rpc(testDb, role, fn, args),
    from: (table: string) => new Query(testDb, role, table),
    auth: {
      getClaims: async (token: string | undefined = sessionToken) => {
        const claims = token ? tokens[token] : undefined;
        return claims
          ? { data: { claims }, error: null }
          : { data: null, error: { message: "invalid JWT" } };
      },
    },
  };
  return client as unknown as SupabaseClient<Database>;
}

// ---------- Подмена модуля @supabase/supabase-js ----------
//
// В тесте:
//   vi.mock("@supabase/supabase-js", async () => (await import("@/test/supabase")).supabaseModuleMock);
//   connectFakeSupabase(testDb, { "token-1": { sub: USER, role: "authenticated" } });
// Дальше наш код как обычно вызывает createClient(url, key, { global: { headers } }).

let connected: { testDb: TestDb; tokens: Tokens } | null = null;

export function connectFakeSupabase(testDb: TestDb, tokens: Tokens = {}): void {
  connected = { testDb, tokens };
}

type ClientOptions = { global?: { headers?: Record<string, string> } };

function createFakeClient(_url: string, key: string, options?: ClientOptions) {
  if (!connected) throw new Error("connectFakeSupabase() was not called");
  const { testDb, tokens } = connected;
  // secret key — сервер (service_role); иначе — тот, чей токен в заголовке, или аноним.
  if (key === process.env.SUPABASE_SECRET_KEY) return fakeSupabase(testDb, "service", tokens);
  const token = options?.global?.headers?.Authorization?.replace(/^Bearer\s+/, "");
  const claims = token ? tokens[token] : undefined;
  const role: DbRole = claims?.role === "authenticated" ? { user: claims.sub } : "anon";
  return fakeSupabase(testDb, role, tokens);
}

export const supabaseModuleMock = { createClient: createFakeClient };

// Клиент админки (сессия в cookie): getClaims() проверяет токен из «cookie».
export function sessionClient(sessionToken: string | undefined): SupabaseClient<Database> {
  if (!connected) throw new Error("connectFakeSupabase() was not called");
  const { testDb, tokens } = connected;
  const claims = sessionToken ? tokens[sessionToken] : undefined;
  const role: DbRole = claims?.role === "authenticated" ? { user: claims.sub } : "anon";
  return fakeSupabase(testDb, role, tokens, sessionToken);
}
