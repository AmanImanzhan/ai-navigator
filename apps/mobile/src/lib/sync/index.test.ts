import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import type * as RemoteModule from "@/lib/sync/remote";
import type * as SyncModule from "@/lib/sync";
import type * as AppStoreModule from "@/store/useAppStore";
import type * as AuthStoreModule from "@/store/useAuthStore";

// Очередь изменений (pendingSync): отправленное убираем, при сбое — оставляем и повторяем.
// Сеть подменена: lib/sync/remote — моки.

jest.mock("@/lib/supabase", () => ({ supabase: {} }));
jest.mock("@/i18n", () => ({ __esModule: true, default: { t: (key: string) => key } }));
jest.mock("@/lib/sync/remote", () => ({
  fetchRemoteData: jest.fn(),
  pushPending: jest.fn(),
  resetRemoteData: jest.fn(),
}));

const USER = "user-1";

// Каждый тест — с чистыми модулями: у синхронизации есть состояние (с кем уже слились).
function load() {
  jest.resetModules();
  const remote = jest.requireMock<typeof RemoteModule>("@/lib/sync/remote");
  const sync = jest.requireActual<typeof SyncModule>("@/lib/sync");
  const { useAppStore } = jest.requireActual<typeof AppStoreModule>("@/store/useAppStore");
  const { useAuthStore } = jest.requireActual<typeof AuthStoreModule>("@/store/useAuthStore");
  return { remote, sync, useAppStore, useAuthStore };
}

function signIn(useAuthStore: typeof AuthStoreModule.useAuthStore) {
  useAuthStore.setState({
    session: { user: { id: USER } } as unknown as NonNullable<
      ReturnType<typeof useAuthStore.getState>["session"]
    >,
    initialized: true,
  });
}

const EMPTY_REMOTE = { progress: [], prompts: [], profile: null };

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("syncNow", () => {
  it("not signed in → nothing is sent", async () => {
    const { remote, sync, useAppStore } = load();
    useAppStore.getState().markLessonCompleted("1");
    await sync.syncNow();
    expect(remote.fetchRemoteData).not.toHaveBeenCalled();
    expect(remote.pushPending).not.toHaveBeenCalled();
  });

  it("sends the queue and removes what was sent", async () => {
    const { remote, sync, useAppStore, useAuthStore } = load();
    jest.mocked(remote.fetchRemoteData).mockResolvedValue(EMPTY_REMOTE);
    jest.mocked(remote.pushPending).mockImplementation(async (_user, data) => data.pendingSync);
    useAppStore.getState().markLessonCompleted("1");
    signIn(useAuthStore);

    await sync.syncNow();

    expect(remote.pushPending).toHaveBeenCalledTimes(1);
    expect(jest.mocked(remote.pushPending).mock.calls[0]?.[1].pendingSync.lessons).toEqual(["1"]);
    expect(useAppStore.getState().pendingSync).toEqual(
      expect.objectContaining({ lessons: [], prompts: [], deletedPrompts: [] }),
    );
    expect(useAppStore.getState().accountId).toBe(USER);
  });

  it("no network → the queue stays on the phone and is retried later", async () => {
    const { remote, sync, useAppStore, useAuthStore } = load();
    jest.mocked(remote.fetchRemoteData).mockResolvedValue(EMPTY_REMOTE);
    jest.mocked(remote.pushPending).mockRejectedValueOnce(new Error("offline"));
    useAppStore.getState().markLessonCompleted("1");
    signIn(useAuthStore);

    await sync.syncNow();
    expect(useAppStore.getState().pendingSync.lessons).toEqual(["1"]);

    // Повтор через 15 секунд — теперь сеть есть.
    jest.mocked(remote.pushPending).mockImplementation(async (_user, data) => data.pendingSync);
    await jest.advanceTimersByTimeAsync(15_000);
    expect(remote.pushPending).toHaveBeenCalledTimes(2);
    expect(useAppStore.getState().pendingSync.lessons).toEqual([]);
  });

  it("a change made while sending stays in the queue", async () => {
    const { remote, sync, useAppStore, useAuthStore } = load();
    jest.mocked(remote.fetchRemoteData).mockResolvedValue(EMPTY_REMOTE);
    jest.mocked(remote.pushPending).mockImplementation(async (_user, data) => {
      // Пока шла отправка, человек прошёл ещё один урок.
      useAppStore.getState().markLessonCompleted("2");
      return data.pendingSync;
    });
    useAppStore.getState().markLessonCompleted("1");
    signIn(useAuthStore);

    await sync.syncNow();
    expect(useAppStore.getState().pendingSync.lessons).toEqual(["2"]);
  });
});
