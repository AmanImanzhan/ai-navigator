import type {
  DailyMinutes,
  LanguageCode,
  OccupationId,
} from "@/data/onboarding";
import type { PendingSync, SavedPrompt } from "@/store/useAppStore";

// Чистая функция слияния данных телефона и облака: без сети и без хранилищ —
// поэтому её легко проверить тестом. Всё, что меняет данные, — в lib/sync/index.ts.

// ---------- Что есть на телефоне ----------

export type LocalSyncData = {
  language: LanguageCode;
  occupation: OccupationId | null;
  minutesPerDay: DailyMinutes;
  onboardingDone: boolean;
  completedLessons: string[];
  lessonCompletedAt: Record<string, number>;
  savedPrompts: SavedPrompt[];
  pendingSync: PendingSync;
};

// ---------- Что есть в облаке ----------

export type RemoteProfile = {
  language: LanguageCode;
  occupation: OccupationId | null;
  minutesPerDay: DailyMinutes;
  onboardingCompleted: boolean;
};

export type RemoteSyncData = {
  progress: { lessonId: string; completedAt: number }[];
  // Удалённые запросы тоже приходят — с датой удаления.
  prompts: (SavedPrompt & { deletedAt: number | null })[];
  profile: RemoteProfile | null;
};

export type MergeOptions = {
  // Другой аккаунт, человек выбрал «показать прогресс этого аккаунта»:
  // ответы онбординга тоже берём из облака.
  preferRemoteProfile: boolean;
};

// ---------- Результат ----------

export type MergeResult = {
  completedLessons: string[];
  lessonCompletedAt: Record<string, number>;
  savedPrompts: SavedPrompt[];
  // Что отправить в облако, чтобы оно сравнялось с телефоном.
  pendingSync: PendingSync;
  // Ответы онбординга из облака, если их нужно взять (иначе null). Язык не трогаем:
  // его человек только что выбрал на этом телефоне.
  onboarding: Pick<RemoteProfile, "occupation" | "minutesPerDay"> | null;
};

// Правила:
// - уроки: объединение; если урок пройден и там и там — самая ранняя дата;
// - запросы: объединение по id, но удалённое где угодно остаётся удалённым —
//   и в облаке (deletedAt), и на телефоне (pendingSync.deletedPrompts);
// - напоминания не синхронизируются: у каждого телефона свои (useReminderStore);
// - онбординг: телефон главнее; облако — только если на телефоне онбординг не пройден
//   (вход через «У меня уже есть аккаунт») или человек выбрал прогресс аккаунта.
export function mergeSyncData(
  local: LocalSyncData,
  remote: RemoteSyncData,
  options: MergeOptions = { preferRemoteProfile: false },
): MergeResult {
  // ---------- Уроки ----------

  const remoteLessons = new Map(
    remote.progress.map((item) => [item.lessonId, item.completedAt]),
  );
  const lessonCompletedAt: Record<string, number> = {};
  const lessonsToUpload: string[] = [];

  for (const [lessonId, completedAt] of remoteLessons) {
    lessonCompletedAt[lessonId] = completedAt;
  }
  for (const lessonId of local.completedLessons) {
    // Даты может не быть у очень старых данных — тогда считаем, что пройден «сейчас»
    // и облако со своей датой (если есть) победит.
    const localDate = local.lessonCompletedAt[lessonId] ?? Date.now();
    const remoteDate = remoteLessons.get(lessonId);
    if (remoteDate === undefined || localDate < remoteDate) {
      lessonCompletedAt[lessonId] = localDate;
      lessonsToUpload.push(lessonId);
    }
  }

  // По порядку прохождения.
  const completedLessons = Object.keys(lessonCompletedAt).sort(
    (a, b) => lessonCompletedAt[a] - lessonCompletedAt[b],
  );

  // ---------- Запросы ----------

  const deletedOnPhone = new Set(local.pendingSync.deletedPrompts);
  const deletedInCloud = new Set(
    remote.prompts
      .filter((prompt) => prompt.deletedAt !== null)
      .map((prompt) => prompt.id),
  );
  const aliveInCloud = new Map(
    remote.prompts
      .filter((prompt) => prompt.deletedAt === null)
      .map(({ deletedAt: _deletedAt, ...prompt }) => [prompt.id, prompt]),
  );
  const isDeleted = (id: string) =>
    deletedOnPhone.has(id) || deletedInCloud.has(id);

  const byId = new Map<string, SavedPrompt>();
  for (const prompt of local.savedPrompts) {
    if (!isDeleted(prompt.id)) byId.set(prompt.id, prompt);
  }
  for (const [id, prompt] of aliveInCloud) {
    if (!isDeleted(id) && !byId.has(id)) byId.set(id, prompt);
  }
  // Новые сверху.
  const savedPrompts = [...byId.values()].sort(
    (a, b) => b.createdAt - a.createdAt,
  );

  // Отправить: запросы, которых в облаке нет совсем.
  const promptsToUpload = savedPrompts
    .filter((prompt) => !aliveInCloud.has(prompt.id))
    .map((prompt) => prompt.id);
  // Удалить в облаке: удалённые на телефоне, которые в облаке ещё живы.
  // Остальные удаления уже не нужны: в облаке запрос удалён или его там не было.
  const deletesToUpload = [...deletedOnPhone].filter((id) =>
    aliveInCloud.has(id),
  );

  // ---------- Онбординг ----------

  const cloud = remote.profile;
  const takeCloudProfile =
    cloud !== null &&
    cloud.onboardingCompleted &&
    (!local.onboardingDone || options.preferRemoteProfile);

  let onboarding: MergeResult["onboarding"] = null;
  let uploadProfile: boolean;

  if (takeCloudProfile) {
    onboarding = {
      occupation: cloud.occupation,
      minutesPerDay: cloud.minutesPerDay,
    };
    // Язык остаётся с телефона — если он другой, сообщаем облаку.
    uploadProfile = cloud.language !== local.language;
  } else if (local.onboardingDone) {
    uploadProfile =
      local.pendingSync.profile ||
      cloud === null ||
      !cloud.onboardingCompleted ||
      cloud.language !== local.language ||
      cloud.occupation !== local.occupation ||
      cloud.minutesPerDay !== local.minutesPerDay;
  } else {
    // Онбординг ещё не пройден — отправим, когда пройдёт.
    uploadProfile = local.pendingSync.profile;
  }

  return {
    completedLessons,
    lessonCompletedAt,
    savedPrompts,
    pendingSync: {
      lessons: lessonsToUpload,
      prompts: promptsToUpload,
      deletedPrompts: deletesToUpload,
      profile: uploadProfile,
    },
    onboarding,
  };
}
