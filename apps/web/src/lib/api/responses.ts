import type { AiErrorCode, AiErrorResponse } from "@ai-navigator/shared";

// Ответы API с понятными кодами ошибок (список кодов — в @ai-navigator/shared, ai.ts).

export function aiErrorResponse(
  error: AiErrorCode,
  status: number,
  extra: Omit<AiErrorResponse, "error"> = {},
  headers: HeadersInit = {},
): Response {
  return Response.json({ error, ...extra } satisfies AiErrorResponse, {
    status,
    headers: { "cache-control": "no-store", ...headers },
  });
}

// Тело запроса больше этого — даже не читаем (в символах JSON, с запасом на служебные поля).
const MAX_BODY_BYTES = 16_384;

export type JsonBody =
  { ok: true; value: unknown } | { ok: false; response: Response };

// Читает JSON из тела запроса. Слишком большое тело — input_too_long, не JSON — invalid_request.
export async function readJsonBody(request: Request): Promise<JsonBody> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) {
    return { ok: false, response: aiErrorResponse("input_too_long", 413) };
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    return { ok: false, response: aiErrorResponse("input_too_long", 413) };
  }
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, response: aiErrorResponse("invalid_request", 400) };
  }
}
