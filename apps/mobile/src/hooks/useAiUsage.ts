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

// После покупки: сервер узнаёт о подписке из webhook RevenueCat, обычно за 5–60 секунд.
// Спрашиваем лимит несколько раз, пока сервер не ответит «premium» (или не кончатся попытки —
// тогда лимит обновится сам, когда человек откроет помощник).
const PREMIUM_WAIT_DELAYS_MS = [0, 3_000, 5_000, 10_000, 15_000, 30_000];

export async function waitForServerPremium(userId: string): Promise<boolean> {
  for (const delay of PREMIUM_WAIT_DELAYS_MS) {
    if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
    await refreshAiUsage(userId);
    const { userId: owner, usage } = useAiUsageStore.getState();
    if (owner === userId && usage?.premium) return true;
  }
  return false;
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
