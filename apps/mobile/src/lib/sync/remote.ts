import type { TablesInsert } from "@ai-navigator/shared";

import {
  DAILY_MINUTES,
  OCCUPATIONS,
  type DailyMinutes,
  type OccupationId,
} from "@/data/onboarding";
import { isTemplateId } from "@/data/templates";
import type { RemoteSyncData } from "@/lib/sync/merge";
import { supabase } from "@/lib/supabase";
import type { PendingSync, SavedPrompt } from "@/store/useAppStore";

// Запросы к базе для синхронизации. Права проверяет RLS: каждый видит и меняет только своё.

function requireSupabase() {
  if (!supabase) throw new Error("Supabase не настроен");
  return supabase;
}

function toMillis(date: string | null): number | null {
  return date === null ? null : new Date(date).getTime();
}

function isOccupation(value: string | null): value is OccupationId {
  return OCCUPATIONS.some((item) => item.id === value);
}

function isDailyMinutes(value: number): value is DailyMinutes {
  return (DAILY_MINUTES as number[]).includes(value);
}

// ---------- Загрузка ----------

export async function fetchRemoteData(userId: string): Promise<RemoteSyncData> {
  const db = requireSupabase();

  const [progress, prompts, profile] = await Promise.all([
    db.from("user_progress").select("lesson_id, completed_at"),
    db
      .from("saved_prompts")
      .select("id, template_id, title, text, created_at, deleted_at"),
    db
      .from("profiles")
      .select("language, occupation, minutes_per_day, onboarding_completed_at")
      .eq("id", userId)
      .maybeSingle(),
  ]);

  const error = progress.error ?? prompts.error ?? profile.error;
  if (error) throw new Error(error.message);

  const row = profile.data;
  return {
    progress: (progress.data ?? []).map((item) => ({
      lessonId: item.lesson_id,
      completedAt: new Date(item.completed_at).getTime(),
    })),
    prompts: (prompts.data ?? []).map((item) => ({
      id: item.id,
      templateId: item.template_id ?? "",
      title: item.title ?? "",
      text: item.text,
      createdAt: new Date(item.created_at).getTime(),
      deletedAt: toMillis(item.deleted_at),
    })),
    profile: row
      ? {
          language: row.language,
          occupation: isOccupation(row.occupation) ? row.occupation : null,
          minutesPerDay: isDailyMinutes(row.minutes_per_day)
            ? row.minutes_per_day
            : 10,
          onboardingCompleted: row.onboarding_completed_at !== null,
        }
      : null,
  };
}

// ---------- Отправка ----------

// Что нужно знать о телефоне, чтобы отправить очередь.
export type LocalPushData = {
  pendingSync: PendingSync;
  lessonCompletedAt: Record<string, number>;
  savedPrompts: SavedPrompt[];
  profile: {
    language: TablesInsert<"profiles">["language"];
    occupation: OccupationId | null;
    minutesPerDay: DailyMinutes;
    onboardingDone: boolean;
  };
};

// Отправляет очередь. Повторная отправка безопасна: upsert по ключам, а триггеры
// в базе не дают «испортить» данные (дата урока — самая ранняя, удалённое не оживает).
// Возвращает, что отправлено, — это и убираем из очереди.
export async function pushPending(
  userId: string,
  local: LocalPushData,
): Promise<PendingSync> {
  const db = requireSupabase();
  const { pendingSync } = local;
  const sent: PendingSync = {
    lessons: [],
    prompts: [],
    deletedPrompts: [],
    profile: false,
  };

  const lessons = pendingSync.lessons.filter(
    (id) => local.lessonCompletedAt[id] !== undefined,
  );
  if (lessons.length > 0) {
    const { error } = await db.from("user_progress").upsert(
      lessons.map((lessonId) => ({
        user_id: userId,
        lesson_id: lessonId,
        completed_at: new Date(local.lessonCompletedAt[lessonId]).toISOString(),
      })),
      { onConflict: "user_id,lesson_id" },
    );
    if (error) throw new Error(error.message);
  }
  // Уроки, которых уже нет на телефоне (сброс), тоже убираем из очереди.
  sent.lessons = pendingSync.lessons;

  const prompts = local.savedPrompts.filter((prompt) =>
    pendingSync.prompts.includes(prompt.id),
  );
  if (prompts.length > 0) {
    // ignoreDuplicates: уже отправленный запрос не трогаем (он не меняется).
    const { error } = await db.from("saved_prompts").upsert(
      prompts.map((prompt) => ({
        id: prompt.id,
        user_id: userId,
        template_id: isTemplateId(prompt.templateId) ? prompt.templateId : null,
        title: prompt.title,
        text: prompt.text,
        created_at: new Date(prompt.createdAt).toISOString(),
      })),
      { onConflict: "id", ignoreDuplicates: true },
    );
    if (error) throw new Error(error.message);
  }
  sent.prompts = pendingSync.prompts;

  if (pendingSync.deletedPrompts.length > 0) {
    // Мягкое удаление: строка остаётся с датой удаления — так узнают другие телефоны.
    const { error } = await db
      .from("saved_prompts")
      .update({ deleted_at: new Date().toISOString() })
      .in("id", pendingSync.deletedPrompts)
      .is("deleted_at", null);
    if (error) throw new Error(error.message);
  }
  sent.deletedPrompts = pendingSync.deletedPrompts;

  // Ответы онбординга отправляем, только когда онбординг пройден: иначе затёрли бы
  // в облаке настройки, которые потом пригодятся при входе на новом телефоне.
  if (pendingSync.profile && local.profile.onboardingDone) {
    const { error } = await db.from("profiles").upsert(
      {
        id: userId,
        language: local.profile.language,
        occupation: local.profile.occupation,
        minutes_per_day: local.profile.minutesPerDay,
        onboarding_completed_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    if (error) throw new Error(error.message);
    sent.profile = true;
  }

  return sent;
}

// ---------- Сброс ----------

// Очищает данные аккаунта одной транзакцией (функция reset_my_data в базе).
export async function resetRemoteData(): Promise<void> {
  const { error } = await requireSupabase().rpc("reset_my_data");
  if (error) throw new Error(error.message);
}
