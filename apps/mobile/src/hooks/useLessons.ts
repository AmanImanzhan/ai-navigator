import { getLesson, getTracks } from "@/data/lessons";
import { useAppStore } from "@/store/useAppStore";

// Уроки и направления на текущем языке приложения.
// Язык меняется — экраны с этими хуками сами перерисуются на новом языке.

export function useTracks() {
  const language = useAppStore((state) => state.language);
  return getTracks(language);
}

export function useLesson(id: string) {
  const language = useAppStore((state) => state.language);
  return getLesson(id, language);
}
