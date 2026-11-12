import { getLesson, getTracks } from "@/data/lessons";
import { useAppStore } from "@/store/useAppStore";
import { useContentStore } from "@/store/useContentStore";

// Уроки и направления на текущем языке приложения.
// Источник: кэш из Supabase на этом языке, а если его нет — встроенные данные.
// Язык меняется — экраны с этими хуками сами перерисуются на новом языке.

// Контент из базы, если он загружен на текущем языке.
export function useRemoteContent() {
  const language = useAppStore((state) => state.language);
  const snapshot = useContentStore((state) => state.snapshot);
  return snapshot?.locale === language ? snapshot : undefined;
}

export function useTracks() {
  const language = useAppStore((state) => state.language);
  const remote = useRemoteContent();
  return remote?.tracks ?? getTracks(language);
}

export function useLesson(id: string) {
  const language = useAppStore((state) => state.language);
  const remote = useRemoteContent();
  if (!remote) return getLesson(id, language);
  return remote.tracks
    .flatMap((track) => track.lessons)
    .find((lesson) => lesson.id === id);
}
