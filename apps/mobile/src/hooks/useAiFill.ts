import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { refreshAiUsage } from "@/hooks/useAiUsage";
import { requestAiFill } from "@/lib/ai/client";
import { toAiClientError, type AiClientError } from "@/lib/ai/errors";
import { track } from "@/lib/analytics";
import { useAiUsageStore } from "@/store/useAiUsageStore";
import { useAppStore } from "@/store/useAppStore";

export type AiFillStatus = "idle" | "loading" | "done" | "error";

type AiFillState = {
  status: AiFillStatus;
  // Совет от ИИ: что уточнить или проверить.
  tip: string;
  // Сколько полей ИИ заполнил в последний раз.
  filledCount: number;
  error: AiClientError | null;
};

const INITIAL: AiFillState = {
  status: "idle",
  tip: "",
  filledCount: 0,
  error: null,
};

// «Заполнить с помощником»: по описанию ситуации ИИ предлагает значения полей шаблона.
// fields — поля шаблона на экране: значения для других полей не берём.
export function useAiFill(templateId: string, fields: string[]) {
  const userId = useAuth().user?.id ?? null;
  const locale = useAppStore((state) => state.language);
  const [state, setState] = useState<AiFillState>(INITIAL);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  // Возвращает значения полей или null, если не получилось.
  const fill = useCallback(
    async (situation: string): Promise<Record<string, string> | null> => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      setState({ ...INITIAL, status: "loading" });
      // Только факт запроса и шаблон — без описания ситуации.
      track("ai_request_sent", { feature: "fill", template_id: templateId });

      try {
        const result = await requestAiFill(
          { templateId, locale, situation },
          controller.signal,
        );
        if (userId) useAiUsageStore.getState().setUsage(userId, result.usage);
        const values: Record<string, string> = {};
        for (const field of fields) {
          const value = result.values[field]?.trim();
          if (value) values[field] = value;
        }
        setState({
          status: "done",
          tip: result.tip,
          filledCount: Object.keys(values).length,
          error: null,
        });
        return values;
      } catch (caught) {
        if (controllerRef.current !== controller) return null;
        const error = toAiClientError(caught);
        if (error.code === "cancelled") {
          setState(INITIAL);
          return null;
        }
        setState({ ...INITIAL, status: "error", error });
        if (error.code === "limit_reached") {
          track("ai_limit_reached", {
            feature: "fill",
            premium: useAiUsageStore.getState().usage?.premium ?? false,
          });
        }
        if (userId) refreshAiUsage(userId);
        return null;
      }
    },
    [templateId, locale, fields, userId],
  );

  return { ...state, fill };
}
