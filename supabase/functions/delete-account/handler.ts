import {
  readAppleConfig,
  revokeAppleAccess,
  type AppleRevokeResult,
  type FetchLike,
} from "./apple.ts";

// Логика удаления аккаунта. Не зависит от Deno и Supabase SDK: всё внешнее приходит
// параметрами — поэтому её можно проверить тестом. Подключение — в index.ts.

// Что нужно от admin API Supabase (ctx.supabaseAdmin.auth.admin).
type AdminError = { message: string; status?: number };

type AdminUser = {
  identities?: {
    provider: string;
    id: string;
    identity_data?: Record<string, unknown>;
  }[];
};

export type AdminApi = {
  getUserById: (
    id: string,
  ) => Promise<{ data: { user: AdminUser | null }; error: AdminError | null }>;
  deleteUser: (id: string) => Promise<{ error: AdminError | null }>;
};

export type DeleteAccountDeps = {
  // id вызывающего из проверенного JWT. Удалить можно только себя:
  // id берётся только отсюда, а не из тела запроса.
  userId: string | null;
  admin: AdminApi;
  // Чтение секретов функции (Deno.env.get).
  env: (name: string) => string | undefined;
  fetchFn?: FetchLike;
  log?: (message: string) => void;
};

// Код входа Apple — короткая строка; всё длиннее — точно не он.
const MAX_CODE_LENGTH = 4096;

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// Тело запроса: { appleAuthorizationCode?: string }. Всё остальное игнорируем.
async function readAuthorizationCode(req: Request): Promise<string | null> {
  try {
    const body: unknown = await req.json();
    if (typeof body !== "object" || body === null) return null;
    if (!("appleAuthorizationCode" in body)) return null;
    const code = body.appleAuthorizationCode;
    return typeof code === "string" &&
      code.length > 0 &&
      code.length <= MAX_CODE_LENGTH
      ? code
      : null;
  } catch {
    // Пустое или испорченное тело — значит, кода нет.
    return null;
  }
}

// id пользователя Apple, привязанный к аккаунту (если человек входил через Apple).
function findAppleIdentity(
  user: AdminUser,
): { subject: string | null } | null {
  const identity = user.identities?.find((item) => item.provider === "apple");
  if (!identity) return null;
  const subject = identity.identity_data?.sub;
  return { subject: typeof subject === "string" ? subject : identity.id };
}

export async function handleDeleteAccount(
  req: Request,
  { userId, admin, env, fetchFn, log = console.error }: DeleteAccountDeps,
): Promise<Response> {
  if (req.method !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }
  if (!userId) {
    return json(401, { error: "unauthorized" });
  }

  const authorizationCode = await readAuthorizationCode(req);

  const found = await admin.getUserById(userId);
  if (found.error || !found.data.user) {
    // Аккаунта уже нет (прошлая попытка удалила его, а ответ до телефона не дошёл) —
    // отвечаем «удалён», чтобы приложение завершило очистку.
    if (found.error?.status === 404) {
      return json(200, { deleted: true, appleRevoked: false });
    }
    log(`delete-account: не удалось прочитать пользователя: ${found.error?.message}`);
    return json(500, { error: "user_lookup_failed" });
  }

  // 1. Отзываем доступ у Apple. Не получилось — пишем в журнал и всё равно удаляем аккаунт:
  //    человек просил удалить данные, и это важнее. Доступ он может отозвать и сам
  //    в настройках iPhone, а без аккаунта в базе он уже ничего не открывает.
  let apple: AppleRevokeResult | null = null;
  const appleIdentity = findAppleIdentity(found.data.user);
  if (appleIdentity) {
    const config = readAppleConfig(env);
    if (!authorizationCode) {
      apple = { revoked: false, reason: "no_authorization_code" };
    } else if (!config) {
      apple = { revoked: false, reason: "apple_secrets_not_configured" };
    } else {
      apple = await revokeAppleAccess({
        config,
        authorizationCode,
        expectedSubject: appleIdentity.subject,
        fetchFn,
      });
    }
    if (!apple.revoked) {
      log(`delete-account: доступ Apple не отозван (${apple.reason}), user ${userId}`);
    }
  }

  // 2. Удаляем пользователя. Его строки в profiles, user_progress, saved_prompts, ai_usage,
  //    subscriptions и memberships удалятся каскадом (on delete cascade в схеме).
  const deleted = await admin.deleteUser(userId);
  if (deleted.error) {
    log(`delete-account: не удалось удалить user ${userId}: ${deleted.error.message}`);
    return json(500, { error: "delete_failed" });
  }

  return json(200, { deleted: true, appleRevoked: apple?.revoked ?? false });
}
