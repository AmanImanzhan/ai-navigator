import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { refreshAiUsage } from "@/hooks/useAiUsage";
import { streamAiTry } from "@/lib/ai/client";
import { toAiClientError, type AiClientError } from "@/lib/ai/errors";
import { useAiUsageStore } from "@/store/useAiUsageStore";
import { useAppStore } from "@/store/useAppStore";

// idle — ещё не спрашивали; streaming — ответ идёт; done — ответ целиком;
// stopped — человек нажал «Стоп»; error — сбой (часть ответа могла успеть прийти).
export type AiTryStatus = "idle" | "streaming" | "done" | "stopped" | "error";

type AiTryState = {
  status: AiTryStatus;
  answer: string;
  review: string;
  error: AiClientError | null;
};

const INITIAL: AiTryState = {
  status: "idle",
  answer: "",
  review: "",
  error: null,
};

// «Попробуй сам» с ИИ: отправляет запрос человека и собирает ответ и разбор по кусочкам.
export function useAiTry(lessonId: string) {
  const userId = useAuth().user?.id ?? null;
  const locale = useAppStore((state) => state.language);
  const [state, setState] = useState<AiTryState>(INITIAL);
  // Текущий запрос — чтобы остановить его кнопкой «Стоп» или при уходе с экрана.
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const ask = useCallback(
    async (prompt: string) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      setState({ ...INITIAL, status: "streaming" });

      try {
        await streamAiTry(
          { lessonId, locale, prompt },
          (event) => {
            switch (event.type) {
              case "meta":
                if (userId) {
                  useAiUsageStore.getState().setUsage(userId, event.usage);
                }
                break;
              case "answer":
              case "review": {
                const { type, text } = event;
                setState((current) => ({
                  ...current,
                  [type]: current[type] + text,
                }));
                break;
              }
              case "done":
                break;
            }
          },
          controller.signal,
        );
        setState((current) => ({ ...current, status: "done" }));
      } catch (caught) {
        // Уже идёт новый запрос — старый нам неинтересен.
        if (controllerRef.current !== controller) return;
        const error = toAiClientError(caught);
        if (error.code === "cancelled") {
          setState((current) => ({ ...current, status: "stopped" }));
          return;
        }
        setState((current) => ({ ...current, status: "error", error }));
        // Сервер мог вернуть попытку (сбой ИИ) или сказать, что лимит исчерпан, — обновим остаток.
        if (userId) refreshAiUsage(userId);
      }
    },
    [lessonId, locale, userId],
  );

  const stop = useCallback(() => controllerRef.current?.abort(), []);

  return { ...state, ask, stop };
}
