import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { useAuth, useAvailableProviders } from "@/hooks/useAuth";
import { useAppStore } from "@/store/useAppStore";

// Пауза, чтобы окно не выскакивало в ту же секунду, как открылся список уроков.
const PROMPT_DELAY_MS = 700;

// Один раз предлагает войти — после первого пройденного урока.
// Подключается в layout вкладок: срабатывает, когда человек возвращается к вкладкам
// с экрана победы — неважно, какой кнопкой или жестом.
export function useSaveProgressPrompt() {
  const { isSignedIn, initialized } = useAuth();
  const providers = useAvailableProviders();
  const hasCompleted = useAppStore(
    (state) => state.completedLessons.length > 0,
  );
  const shown = useAppStore((state) => state.saveProgressPromptShown);
  const markShown = useAppStore((state) => state.markSaveProgressPromptShown);

  const shouldPrompt =
    initialized &&
    !isSignedIn &&
    !shown &&
    hasCompleted &&
    providers !== null &&
    providers.length > 0;

  useFocusEffect(
    useCallback(() => {
      if (!shouldPrompt) return;
      const timer = setTimeout(() => {
        markShown();
        router.push("/save-progress");
      }, PROMPT_DELAY_MS);
      return () => clearTimeout(timer);
    }, [shouldPrompt, markShown]),
  );
}
