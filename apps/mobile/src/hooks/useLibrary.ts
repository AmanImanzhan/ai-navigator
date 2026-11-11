import { getConcept, getConcepts, getTool, getTools } from "@/data/library";
import { useAppStore } from "@/store/useAppStore";

// Справочник на текущем языке приложения.

export function useLibraryTools() {
  const language = useAppStore((state) => state.language);
  return getTools(language);
}

export function useLibraryConcepts() {
  const language = useAppStore((state) => state.language);
  return getConcepts(language);
}

export function useLibraryTool(id: string) {
  const language = useAppStore((state) => state.language);
  return getTool(id, language);
}

export function useLibraryConcept(id: string) {
  const language = useAppStore((state) => state.language);
  return getConcept(id, language);
}
