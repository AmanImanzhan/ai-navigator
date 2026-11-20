import { beforeEach, describe, expect, it } from "@jest/globals";

import { EMPTY_PENDING_SYNC, useAppStore } from "@/store/useAppStore";

// Данные телефона: онбординг, пройденные уроки, сохранённые запросы и очередь
// на отправку в аккаунт (pendingSync).

const initial = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState(initial, true);
});

const state = () => useAppStore.getState();

describe("useAppStore", () => {
  it("starts with onboarding not done and nothing to sync", () => {
    expect(state().onboardingDone).toBe(false);
    expect(state().pendingSync).toEqual(EMPTY_PENDING_SYNC);
  });

  it("onboarding answers are saved and queued for the account", () => {
    state().setLanguage("ru");
    state().saveOccupation("office");
    state().completeOnboarding(15);
    expect(state()).toMatchObject({
      language: "ru",
      occupation: "office",
      minutesPerDay: 15,
      onboardingDone: true,
    });
    expect(state().pendingSync.profile).toBe(true);
  });

  it("markLessonCompleted does not add the same lesson twice", () => {
    state().markLessonCompleted("1");
    const firstDate = state().lessonCompletedAt["1"];
    state().markLessonCompleted("1");
    state().markLessonCompleted("2");

    expect(state().completedLessons).toEqual(["1", "2"]);
    expect(state().pendingSync.lessons).toEqual(["1", "2"]);
    // Повтор урока не меняет дату первого прохождения.
    expect(state().lessonCompletedAt["1"]).toBe(firstDate);
  });

  it("repeating a lesson still counts as studied today (for reminders)", () => {
    state().markLessonCompleted("1");
    useAppStore.setState({ lastLessonAt: 0 });
    state().markLessonCompleted("1");
    expect(state().lastLessonAt).toBeGreaterThan(0);
  });

  it("saved prompts get a UUID, newest first, and go to the queue", () => {
    state().savePrompt("t1", "Email", "Write to [boss]");
    state().savePrompt("t2", "Plan", "Make a plan");
    const [newest, oldest] = state().savedPrompts;
    expect(newest?.templateId).toBe("t2");
    expect(oldest?.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(state().pendingSync.prompts).toEqual([oldest?.id, newest?.id]);
  });

  it("deleting a prompt removes it from the upload queue and queues the deletion", () => {
    state().savePrompt("t1", "Email", "text");
    const id = state().savedPrompts[0]?.id ?? "";
    state().deletePrompt(id);
    state().deletePrompt(id);
    expect(state().savedPrompts).toEqual([]);
    expect(state().pendingSync.prompts).toEqual([]);
    expect(state().pendingSync.deletedPrompts).toEqual([id]);
  });

  it("resetAll clears everything but keeps whose phone it is", () => {
    state().markLessonCompleted("1");
    state().completeOnboarding(5);
    state().resetAll("user-1");
    expect(state()).toMatchObject({
      completedLessons: [],
      onboardingDone: false,
      pendingSync: EMPTY_PENDING_SYNC,
      accountId: "user-1",
    });
  });
});
