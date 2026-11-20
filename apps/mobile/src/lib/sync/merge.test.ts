import { describe, expect, it } from "@jest/globals";

import { mergeSyncData, type LocalSyncData, type RemoteSyncData } from "@/lib/sync/merge";
import { EMPTY_PENDING_SYNC, type SavedPrompt } from "@/store/useAppStore";

// Слияние телефона и аккаунта: ничего не теряем, удалённое не оживает.

function local(fields: Partial<LocalSyncData> = {}): LocalSyncData {
  return {
    language: "en",
    occupation: "office",
    minutesPerDay: 10,
    onboardingDone: true,
    completedLessons: [],
    lessonCompletedAt: {},
    savedPrompts: [],
    pendingSync: EMPTY_PENDING_SYNC,
    ...fields,
  };
}

function remote(fields: Partial<RemoteSyncData> = {}): RemoteSyncData {
  return { progress: [], prompts: [], profile: null, ...fields };
}

function prompt(id: string, createdAt: number): SavedPrompt {
  return { id, templateId: "t", title: id, text: id, createdAt };
}

describe("mergeSyncData", () => {
  it("lessons: union, earliest date wins, only newer-on-phone lessons are uploaded", () => {
    const result = mergeSyncData(
      local({ completedLessons: ["1", "2"], lessonCompletedAt: { "1": 100, "2": 500 } }),
      remote({
        progress: [
          { lessonId: "2", completedAt: 200 },
          { lessonId: "3", completedAt: 300 },
        ],
      }),
    );
    expect(result.completedLessons).toEqual(["1", "2", "3"]);
    expect(result.lessonCompletedAt).toEqual({ "1": 100, "2": 200, "3": 300 });
    expect(result.pendingSync.lessons).toEqual(["1"]);
  });

  it("prompts: union by id, newest first, phone-only prompts are uploaded", () => {
    const result = mergeSyncData(
      local({ savedPrompts: [prompt("a", 1)] }),
      remote({ prompts: [{ ...prompt("b", 2), deletedAt: null }] }),
    );
    expect(result.savedPrompts.map((item) => item.id)).toEqual(["b", "a"]);
    expect(result.pendingSync.prompts).toEqual(["a"]);
  });

  it("a prompt deleted on another phone does not come back", () => {
    const result = mergeSyncData(
      local({ savedPrompts: [prompt("a", 1)] }),
      remote({ prompts: [{ ...prompt("a", 1), deletedAt: 5 }] }),
    );
    expect(result.savedPrompts).toEqual([]);
    expect(result.pendingSync.prompts).toEqual([]);
  });

  it("a prompt deleted on this phone is deleted in the cloud too", () => {
    const result = mergeSyncData(
      local({ pendingSync: { ...EMPTY_PENDING_SYNC, deletedPrompts: ["a", "gone"] } }),
      remote({ prompts: [{ ...prompt("a", 1), deletedAt: null }] }),
    );
    expect(result.savedPrompts).toEqual([]);
    expect(result.pendingSync.deletedPrompts).toEqual(["a"]);
  });

  it("onboarding: the phone wins, the cloud is used when the phone has none", () => {
    const cloud = {
      language: "ru" as const,
      occupation: "manager" as const,
      minutesPerDay: 15 as const,
      onboardingCompleted: true,
    };
    expect(mergeSyncData(local(), remote({ profile: cloud })).onboarding).toBeNull();
    expect(
      mergeSyncData(local({ onboardingDone: false }), remote({ profile: cloud })).onboarding,
    ).toEqual({ occupation: "manager", minutesPerDay: 15 });
    expect(
      mergeSyncData(local(), remote({ profile: cloud }), { preferRemoteProfile: true }).onboarding,
    ).toEqual({ occupation: "manager", minutesPerDay: 15 });
  });

  it("profile is uploaded when the cloud has none or it differs", () => {
    expect(mergeSyncData(local(), remote()).pendingSync.profile).toBe(true);
    const same = {
      language: "en" as const,
      occupation: "office" as const,
      minutesPerDay: 10 as const,
      onboardingCompleted: true,
    };
    expect(mergeSyncData(local(), remote({ profile: same })).pendingSync.profile).toBe(false);
  });
});
