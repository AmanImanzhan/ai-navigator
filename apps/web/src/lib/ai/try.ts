import type { AiErrorCode, AiTryEvent, AiUsage } from "@ai-navigator/shared";
import {
  streamText,
  type LanguageModel,
  type TextStreamPart,
  type ToolSet,
} from "ai";

import {
  AI_MAX_RETRIES,
  AI_PROVIDER_OPTIONS,
  MAX_OUTPUT_TOKENS_TRY,
  REVIEW_MARKER,
  TRY_TIMEOUT,
} from "@/lib/ai/config";
import { ReviewSplitter, type SplitPart } from "@/lib/ai/splitter";
import { aiErrorResponse } from "@/lib/api/responses";

// «Попробуй сам»: ответ ИИ потоком в формате NDJSON (по одному JSON-событию на строку):
//   meta → answer… → review… → done   (или error вместо done при сбое посреди ответа).
//
// До первого слова ответа мы ничего не отправляем: если ИИ упал сразу — возвращаем обычный
// JSON с кодом ошибки (и возвращаем попытку). После первого слова статус ответа уже 200,
// поэтому сбой приходит событием { type: "error" }.

export type TryRunParams = {
  model: LanguageModel;
  instructions: string;
  userText: string;
  usage: AiUsage;
  // Вернуть попытку пользователю (ИИ не ответил).
  refund: () => Promise<void>;
  // Сигнал отмены: человек закрыл экран — останавливаем ИИ и не тратим токены.
  abortSignal?: AbortSignal;
};

type Part = TextStreamPart<ToolSet>;

// Чем закончился поток (до первого слова или после).
type Outcome = "text" | "done" | AiErrorCode | "aborted";

const encoder = new TextEncoder();

function encode(event: AiTryEvent): Uint8Array {
  return encoder.encode(`${JSON.stringify(event)}\n`);
}

function toEvents(parts: SplitPart[]): AiTryEvent[] {
  return parts.map((part) => ({ type: part.type, text: part.text }));
}

// Что значит очередная часть потока.
function classify(
  part: Part,
): "text" | "finish" | AiErrorCode | "aborted" | null {
  switch (part.type) {
    case "text-delta":
      return "text";
    case "finish":
      // content-filter — ИИ отказался отвечать (сработала защита модели).
      return part.finishReason === "content-filter" ? "ai_declined" : "finish";
    case "error":
      return "ai_unavailable";
    case "abort":
      return "aborted";
    default:
      return null;
  }
}

export async function runTryStream({
  model,
  instructions,
  userText,
  usage,
  refund,
  abortSignal,
}: TryRunParams): Promise<Response> {
  const result = streamText({
    model,
    instructions,
    prompt: userText,
    maxOutputTokens: MAX_OUTPUT_TOKENS_TRY,
    maxRetries: AI_MAX_RETRIES,
    timeout: TRY_TIMEOUT,
    abortSignal,
    providerOptions: AI_PROVIDER_OPTIONS,
    // Ошибки приходят частями потока (type: "error") — обрабатываем их ниже.
    // Сюда же они попадают для журнала: пишем только тип, без текста запроса.
    onError: ({ error }) => {
      console.error(
        `ai try stream error: ${error instanceof Error ? error.name : "unknown"}`,
      );
    },
  });

  const parts = result.fullStream[Symbol.asyncIterator]();
  const splitter = new ReviewSplitter(REVIEW_MARKER);

  // Читаем до первого слова ответа, чтобы успеть вернуть понятную ошибку.
  const firstEvents: AiTryEvent[] = [];
  let early: Outcome | null = null;
  while (early === null) {
    const next = await parts.next();
    if (next.done) {
      early = "done";
      break;
    }
    const kind = classify(next.value);
    if (kind === "text" && next.value.type === "text-delta") {
      firstEvents.push(...toEvents(splitter.push(next.value.text)));
      if (firstEvents.length > 0) early = "text";
    } else if (kind === "finish") {
      early = "done";
    } else if (kind !== null && kind !== "text") {
      early = kind;
    }
  }

  // Ответа не было совсем: ошибка, отказ, пустой ответ или человек ушёл.
  if (early !== "text") {
    await refund();
    if (early === "ai_declined") return aiErrorResponse("ai_declined", 422);
    return aiErrorResponse("ai_unavailable", 503);
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encode({ type: "meta", usage }));
      for (const event of firstEvents) controller.enqueue(encode(event));

      let outcome: Outcome = "done";
      try {
        for (;;) {
          const next = await parts.next();
          if (next.done) break;
          const kind = classify(next.value);
          if (kind === "text" && next.value.type === "text-delta") {
            for (const event of toEvents(splitter.push(next.value.text))) {
              controller.enqueue(encode(event));
            }
          } else if (kind !== null && kind !== "text" && kind !== "finish") {
            outcome = kind;
            break;
          }
        }
      } catch {
        outcome = "ai_unavailable";
      }

      for (const event of toEvents(splitter.flush())) {
        controller.enqueue(encode(event));
      }

      if (outcome === "done") {
        controller.enqueue(encode({ type: "done" }));
      } else if (outcome !== "aborted") {
        // ИИ упал посреди ответа — попытку возвращаем.
        // Если человек сам закрыл экран (aborted), попытку не возвращаем: ответ он уже получал.
        await refund();
        controller.enqueue(encode({ type: "error", error: outcome }));
      }
      controller.close();
    },
    async cancel() {
      // Приложение закрыло соединение — останавливаем чтение ответа ИИ.
      await parts.return?.();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
