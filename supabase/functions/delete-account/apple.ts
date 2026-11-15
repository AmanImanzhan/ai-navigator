// Отзыв доступа «Вход с Apple» — этого требует App Store при удалении аккаунта.
//
// Документация Apple:
//   обмен кода на токены — POST https://appleid.apple.com/auth/token
//   отзыв токена         — POST https://appleid.apple.com/auth/revoke
//   client_secret        — JWT (ES256), подписанный ключом .p8
//
// Здесь только стандартные Web API (fetch, crypto.subtle) — код работает и в Deno, и в Node,
// поэтому его можно проверить тестом без настоящих ключей.

const APPLE_TOKEN_URL = "https://appleid.apple.com/auth/token";
const APPLE_REVOKE_URL = "https://appleid.apple.com/auth/revoke";
const APPLE_AUDIENCE = "https://appleid.apple.com";

// client_secret живёт 5 минут — его хватает на два запроса. Apple разрешает до 6 месяцев,
// но короткий срок безопаснее: каждый раз делаем новый.
const CLIENT_SECRET_TTL_SECONDS = 5 * 60;
// Сколько ждём ответа Apple. Если Apple недоступен, удаление аккаунта не должно зависнуть.
const APPLE_TIMEOUT_MS = 10_000;

export type AppleConfig = {
  // Team ID из Apple Developer (10 символов).
  teamId: string;
  // Key ID ключа «Sign in with Apple» (10 символов).
  keyId: string;
  // Bundle id приложения — для него выдан код входа.
  clientId: string;
  // Содержимое файла .p8.
  privateKey: string;
};

export type FetchLike = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

// Чем закончился отзыв. reason — короткая причина для журнала (без токенов и кодов).
export type AppleRevokeResult =
  | { revoked: true }
  | { revoked: false; reason: string };

// Секреты функции: APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_CLIENT_ID, APPLE_PRIVATE_KEY.
// Нет хотя бы одного — отзыв у Apple пропускаем (аккаунт всё равно удалится).
export function readAppleConfig(
  env: (name: string) => string | undefined,
): AppleConfig | null {
  const teamId = env("APPLE_TEAM_ID")?.trim();
  const keyId = env("APPLE_KEY_ID")?.trim();
  const clientId = env("APPLE_CLIENT_ID")?.trim();
  const privateKey = env("APPLE_PRIVATE_KEY")?.trim();
  if (!teamId || !keyId || !clientId || !privateKey) return null;
  return { teamId, keyId, clientId, privateKey };
}

// ---------- client_secret ----------

function base64UrlEncode(data: Uint8Array | string): string {
  const bytes =
    typeof data === "string" ? new TextEncoder().encode(data) : data;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64Decode(value: string) {
  const binary = atob(value);
  // Явный ArrayBuffer — так байты подходят для crypto.subtle в любой версии TypeScript.
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// Ключ принимаем в любом виде: файл .p8 целиком, с «\n» вместо переносов строк
// или только середину без строк «-----BEGIN/END PRIVATE KEY-----».
function importPrivateKey(privateKey: string): Promise<CryptoKey> {
  const body = privateKey
    .replace(/-----[A-Z ]+-----/g, "")
    .replace(/\\n/g, "")
    .replace(/\s+/g, "");
  return crypto.subtle.importKey(
    "pkcs8",
    base64Decode(body),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
}

// JWT, которым функция представляется Apple: «я — приложение clientId команды teamId».
export async function createClientSecret(
  config: AppleConfig,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): Promise<string> {
  const header = { alg: "ES256", kid: config.keyId };
  const payload = {
    iss: config.teamId,
    iat: nowSeconds,
    exp: nowSeconds + CLIENT_SECRET_TTL_SECONDS,
    aud: APPLE_AUDIENCE,
    sub: config.clientId,
  };
  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
  const key = await importPrivateKey(config.privateKey);
  // WebCrypto отдаёт подпись в виде r||s — именно такой формат нужен JWT ES256.
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(unsigned),
  );
  return `${unsigned}.${base64UrlEncode(new Uint8Array(signature))}`;
}

// ---------- Запросы к Apple ----------

// «sub» из id_token — id пользователя Apple. Подпись не проверяем:
// токен пришёл напрямую от Apple по HTTPS.
function readSubject(idToken: unknown): string | null {
  if (typeof idToken !== "string") return null;
  const payload = idToken.split(".")[1];
  if (!payload) return null;
  try {
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = new TextDecoder().decode(base64Decode(padded));
    const sub: unknown = JSON.parse(json).sub;
    return typeof sub === "string" ? sub : null;
  } catch {
    return null;
  }
}

async function postForm(
  fetchFn: FetchLike,
  url: string,
  params: Record<string, string>,
): Promise<Response> {
  return fetchFn(url, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
    signal: AbortSignal.timeout(APPLE_TIMEOUT_MS),
  });
}

// Код ошибки Apple («invalid_grant», «invalid_client»…) для журнала.
async function readAppleError(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (typeof body === "object" && body !== null && "error" in body) {
      return `${response.status} ${String(body.error)}`;
    }
  } catch {
    // Тело не JSON — хватит кода ответа.
  }
  return String(response.status);
}

type RevokeParams = {
  config: AppleConfig;
  // Свежий код входа: приложение получает его, показав окно Apple перед удалением.
  authorizationCode: string;
  // id пользователя Apple, привязанный к аккаунту. null — неизвестен.
  expectedSubject: string | null;
  fetchFn?: FetchLike;
};

// Меняет код входа на токен и отзывает его. Никогда не бросает ошибку:
// что бы ни случилось у Apple, аккаунт должен удалиться.
export async function revokeAppleAccess({
  config,
  authorizationCode,
  expectedSubject,
  fetchFn = fetch,
}: RevokeParams): Promise<AppleRevokeResult> {
  try {
    const clientSecret = await createClientSecret(config);

    const tokenResponse = await postForm(fetchFn, APPLE_TOKEN_URL, {
      client_id: config.clientId,
      client_secret: clientSecret,
      code: authorizationCode,
      grant_type: "authorization_code",
    });
    if (!tokenResponse.ok) {
      return {
        revoked: false,
        reason: `token_exchange_failed: ${await readAppleError(tokenResponse)}`,
      };
    }

    const tokens: unknown = await tokenResponse.json();
    if (typeof tokens !== "object" || tokens === null) {
      return { revoked: false, reason: "token_response_invalid" };
    }
    const refreshToken =
      "refresh_token" in tokens && typeof tokens.refresh_token === "string"
        ? tokens.refresh_token
        : null;
    const accessToken =
      "access_token" in tokens && typeof tokens.access_token === "string"
        ? tokens.access_token
        : null;

    // Код выдан другому Apple ID, не тому, что привязан к аккаунту, — его доступ не трогаем.
    const subject = "id_token" in tokens ? readSubject(tokens.id_token) : null;
    if (expectedSubject && subject && subject !== expectedSubject) {
      return { revoked: false, reason: "apple_user_mismatch" };
    }

    const token = refreshToken ?? accessToken;
    if (!token) return { revoked: false, reason: "no_token_in_response" };

    const revokeResponse = await postForm(fetchFn, APPLE_REVOKE_URL, {
      client_id: config.clientId,
      client_secret: clientSecret,
      token,
      token_type_hint: refreshToken ? "refresh_token" : "access_token",
    });
    if (!revokeResponse.ok) {
      return {
        revoked: false,
        reason: `revoke_failed: ${await readAppleError(revokeResponse)}`,
      };
    }

    return { revoked: true };
  } catch (error) {
    // Сеть, таймаут, испорченный ключ .p8.
    const name = error instanceof Error ? error.name : "unknown";
    return { revoked: false, reason: `apple_request_error: ${name}` };
  }
}
