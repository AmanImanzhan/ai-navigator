import { getTemplates } from "@/data/templates";
import { useRemoteContent } from "@/hooks/useLessons";
import { useAppStore } from "@/store/useAppStore";

// Шаблоны запросов на текущем языке приложения.
// Источник: кэш из Supabase на этом языке, а если его нет — встроенные данные.

export function useTemplates() {
  const language = useAppStore((state) => state.language);
  const remote = useRemoteContent();
  return remote?.templates ?? getTemplates(language);
}

export function useTemplate(id: string) {
  return useTemplates().find((template) => template.id === id);
}

// Шаблоны одного урока — для экрана победы.
export function useLessonTemplates(lessonId: string) {
  return useTemplates().filter((template) => template.lessonId === lessonId);
}
