"use client";

import { useEffect } from "react";

// Есть несохранённые правки — браузер переспросит перед закрытием или перезагрузкой вкладки.
export function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}
