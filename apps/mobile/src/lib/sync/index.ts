import { Alert } from "react-native";

import i18n from "@/i18n";
import { mergeSyncData, type MergeOptions } from "@/lib/sync/merge";
import {
  fetchRemoteData,
  pushPending,
  resetRemoteData,
} from "@/lib/sync/remote";
import { supabase } from "@/lib/supabase";
import {
  EMPTY_PENDING_SYNC,
  useAppStore,
  type PendingSync,
} from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";

// Синхронизация данных телефона с аккаунтом.
//
// Телефон — главный: всё пишется сначала в useAppStore, экраны читают только его.
// Облако — копия для вошедших. Как это работает:
// 1. Вход (или запуск, если уже вошли) → полная синхронизация: скачиваем данные аккаунта,
//    сливаем с телефоном (merge.ts), отправляем то, чего нет в облаке.
// 2. Изменение на телефоне → попадает в очередь pendingSync → отправляется через секунду.
// 3. Нет сети или ошибка → очередь остаётся на телефоне; повторяем с паузой
//    (15 с, 30 с, … до 5 мин) и при каждом возвращении в приложение.

// Пауза перед отправкой: несколько изменений подряд уйдут одним разом.
const PUSH_DELAY_MS = 1000;
// Как часто при возвращении в приложение заново скачивать данные аккаунта
// (вдруг человек что-то сделал на другом телефоне).
const PULL_INTERVAL_MS = 5 * 60 * 1000;
const RETRY_MIN_MS = 15 * 1000;
const RETRY_MAX_MS = 5 * 60 * 1000;
// Сколько ждём отправку перед выходом из аккаунта.
const SIGN_OUT_PUSH_TIMEOUT_MS = 5000;

// С каким аккаунтом уже слились в этом запуске приложения и когда последний раз скачивали.
let mergedUserId: string | null = null;
let lastPullAt = 0;
// Синхронизация идёт — второй раз не запускаем, а просим повторить после.
let running: Promise<void> | null = null;
let runAgain = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let retryDelay = RETRY_MIN_MS;

function currentUserId(): string | null {
  return useAuthStore.getState().session?.user.id ?? null;
}

function hasPending(pending: PendingSync): boolean {
  return (
    pending.lessons.length > 0 ||
    pending.prompts.length > 0 ||
    pending.deletedPrompts.length > 0 ||
    pending.profile
  );
}

function without(list: string[], sent: string[]): string[] {
  return list.filter((id) => !sent.includes(id));
}

// ---------- Другой аккаунт на этом телефоне ----------

type AccountChoice = "replace" | "merge";

// Данные на телефоне принадлежат другому аккаунту — спрашиваем, а не сливаем молча.
function askAboutOtherAccount(): Promise<AccountChoice> {
  return new Promise((resolve) => {
    Alert.alert(
      i18n.t("sync.otherAccountTitle"),
      i18n.t("sync.otherAccountMessage"),
      [
        {
          text: i18n.t("sync.otherAccountReplace"),
          onPress: () => resolve("replace"),
        },
        {
          text: i18n.t("sync.otherAccountMerge"),
          onPress: () => resolve("merge"),
        },
      ],
      { cancelable: false },
    );
  });
}

// Решает, чей это телефон. Возвращает настройки слияния.
async function claimPhoneData(userId: string): Promise<MergeOptions> {
  const state = useAppStore.getState();
  const hasProgress =
    state.completedLessons.length > 0 || state.savedPrompts.length > 0;

  // Данные этого же аккаунта, или ещё ничьи (пользовались без входа), или их нет —
  // спокойно сливаем.
  if (state.accountId === null || state.accountId === userId || !hasProgress) {
    useAppStore.setState({ accountId: userId });
    return { preferRemoteProfile: false };
  }

  const choice = await askAboutOtherAccount();
  if (choice === "replace") {
    // Прогресс другого аккаунта убираем с телефона (он остался в том аккаунте).
    useAppStore.setState({
      accountId: userId,
      completedLessons: [],
      lessonCompletedAt: {},
      savedPrompts: [],
      pendingSync: EMPTY_PENDING_SYNC,
    });
    return { preferRemoteProfile: true };
  }
  useAppStore.setState({ accountId: userId });
  return { preferRemoteProfile: false };
}

// ---------- Синхронизация ----------

// Скачать данные аккаунта и слить с телефоном.
async function pull(userId: string, options: MergeOptions) {
  const remote = await fetchRemoteData(userId);
  // Читаем телефон только после загрузки — чтобы не потерять то, что сделали, пока ждали.
  const local = useAppStore.getState();
  const result = mergeSyncData(local, remote, options);

  useAppStore.setState({
    completedLessons: result.completedLessons,
    lessonCompletedAt: result.lessonCompletedAt,
    savedPrompts: result.savedPrompts,
    pendingSync: result.pendingSync,
    // Онбординг из облака: экран «Начать» пропустится сам (Stack.Protected в _layout).
    ...(result.onboarding
      ? { ...result.onboarding, onboardingDone: true }
      : {}),
  });
  mergedUserId = userId;
  lastPullAt = Date.now();
}

// Отправить очередь. Отправленное убираем из очереди; то, что добавилось за это время, остаётся.
async function push(userId: string) {
  const state = useAppStore.getState();
  if (!hasPending(state.pendingSync)) return;

  const sent = await pushPending(userId, {
    pendingSync: state.pendingSync,
    lessonCompletedAt: state.lessonCompletedAt,
    savedPrompts: state.savedPrompts,
    profile: {
      language: state.language,
      occupation: state.occupation,
      minutesPerDay: state.minutesPerDay,
      reminderEnabled: state.reminderEnabled,
      onboardingDone: state.onboardingDone,
    },
  });

  useAppStore.setState((current) => ({
    pendingSync: {
      lessons: without(current.pendingSync.lessons, sent.lessons),
      prompts: without(current.pendingSync.prompts, sent.prompts),
      deletedPrompts: without(
        current.pendingSync.deletedPrompts,
        sent.deletedPrompts,
      ),
      // Профиль могли изменить ещё раз, пока отправляли, — тогда оставляем в очереди.
      profile:
        current.pendingSync.profile &&
        !(sent.profile && current.pendingSync === state.pendingSync),
    },
  }));
}

function scheduleRetry() {
  if (retryTimer) return;
  retryTimer = setTimeout(() => {
    retryTimer = null;
    syncNow();
  }, retryDelay);
  retryDelay = Math.min(retryDelay * 2, RETRY_MAX_MS);
}

async function runSync(forcePull: boolean) {
  const userId = currentUserId();
  if (!supabase || !userId) return;

  try {
    if (mergedUserId !== userId) {
      const options = await claimPhoneData(userId);
      await pull(userId, options);
    } else if (forcePull || Date.now() - lastPullAt > PULL_INTERVAL_MS) {
      await pull(userId, { preferRemoteProfile: false });
    }
    await push(userId);
    retryDelay = RETRY_MIN_MS;
  } catch (error) {
    if (__DEV__) console.log("Синхронизация не удалась:", String(error));
    scheduleRetry();
  }
}

// Полная синхронизация (если давно не скачивали) + отправка очереди.
// Безопасно вызывать сколько угодно раз: одновременно идёт только одна.
export function syncNow(forcePull = false): Promise<void> {
  if (running) {
    runAgain = true;
    return running;
  }
  running = runSync(forcePull).finally(() => {
    running = null;
    if (runAgain) {
      runAgain = false;
      syncNow();
    }
  });
  return running;
}

// Изменение на телефоне — отправим через секунду (несколько изменений уйдут вместе).
export function schedulePush() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    syncNow();
  }, PUSH_DELAY_MS);
}

// ---------- Выход и сброс ----------

// Перед выходом пробуем отправить очередь (не дольше 5 секунд), чтобы ничего не потерять.
export async function syncBeforeSignOut() {
  const userId = currentUserId();
  if (userId && mergedUserId === userId) {
    const timeout = new Promise<void>((resolve) =>
      setTimeout(resolve, SIGN_OUT_PUSH_TIMEOUT_MS),
    );
    await Promise.race([push(userId).catch(() => {}), timeout]);
  }
  mergedUserId = null;
}

// Вышли из аккаунта (в том числе сессия истекла) — следующий вход снова сольёт данные.
export function forgetMergedAccount() {
  mergedUserId = null;
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = null;
  retryDelay = RETRY_MIN_MS;
}

// «Сбросить данные». Вошёл — сначала очищаем аккаунт: не получилось (нет сети) —
// бросаем ошибку и телефон не трогаем, чтобы данные не разошлись.
export async function resetAllData() {
  const userId = currentUserId();
  if (userId && supabase) {
    await resetRemoteData();
  }
  useAppStore.getState().resetAll(userId);
  // После сброса облако и телефон одинаково пустые — скачивать заново незачем.
  lastPullAt = Date.now();
}
