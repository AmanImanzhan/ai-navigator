import { useCallback, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { hasAiConsent, useAiConsentStore } from "@/store/useAiConsentStore";

// Перед отправкой текста ИИ — согласие (лист AiConsentSheet). Есть согласие — действие сразу;
// нет — показываем лист, а действие выполняем только после «Согласен». «Не сейчас» — ничего не уходит.
export function useAiConsentGate() {
  const [visible, setVisible] = useState(false);
  // Что сделать после согласия (например, отправить запрос).
  const pendingRef = useRef<(() => void) | null>(null);

  const run = useCallback((action: () => void) => {
    if (hasAiConsent()) {
      action();
      return;
    }
    pendingRef.current = action;
    setVisible(true);
    track("ai_consent", { action: "shown" });
  }, []);

  const agree = useCallback(() => {
    useAiConsentStore.getState().accept();
    track("ai_consent", { action: "given" });
    setVisible(false);
    const action = pendingRef.current;
    pendingRef.current = null;
    action?.();
  }, []);

  const decline = useCallback(() => {
    pendingRef.current = null;
    setVisible(false);
    track("ai_consent", { action: "declined" });
  }, []);

  return { run, visible, agree, decline };
}
