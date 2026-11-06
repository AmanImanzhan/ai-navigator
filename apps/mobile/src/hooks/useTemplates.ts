import { getTemplate, getTemplates } from "@/data/templates";
import { useAppStore } from "@/store/useAppStore";

// Шаблоны запросов на текущем языке приложения.

export function useTemplates() {
  const language = useAppStore((state) => state.language);
  return getTemplates(language);
}

export function useTemplate(id: string) {
  const language = useAppStore((state) => state.language);
  return getTemplate(id, language);
}
