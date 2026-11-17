import type { AiUsage } from "@ai-navigator/shared";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { useAuth } from "@/hooks/useAuth";
import { fetchAiUsage } from "@/lib/ai/client";
import { useAiUsageStore } from "@/store/useAiUsageStore";

// Спрашивает сервер, сколько запросов осталось, и запоминает ответ.
// Не получилось (нет сети) — не страшно: просто не покажем «Осталось N из M».
export async function refreshAiUsage(userId: string): Promise<void> {
  try {
    const usage = await fetchAiUsage();
    useAiUsageStore.getState().setUsage(userId, usage);
  } catch (error) {
    if (__DEV__) console.log("ИИ: не получилось узнать остаток лимита", error);
  }
}

// Остаток запросов на сегодня для вошедшего. null — не вошёл или ещё не знаем.
// Обновляется каждый раз, когда экран снова на виду (например, вернулись на него на следующий день).
export function useAiUsage(): AiUsage | null {
  const userId = useAuth().user?.id ?? null;
  const usage = useAiUsageStore((state) =>
    userId !== null && state.userId === userId ? state.usage : null,
  );

  useFocusEffect(
    useCallback(() => {
      if (userId) refreshAiUsage(userId);
    }, [userId]),
  );

  return usage;
}
