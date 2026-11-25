import { beforeAll, beforeEach, describe, expect, it } from "@jest/globals";

import {
  AI_CONSENT_VERSION,
  hasAiConsent,
  useAiConsentStore,
} from "@/store/useAiConsentStore";

// Согласие отправлять текст ИИ: по умолчанию нет; дали — есть; отозвали или текст
// согласия изменился (новая версия) — снова нет.

beforeAll(async () => {
  await useAiConsentStore.persist.rehydrate();
});

beforeEach(() => {
  useAiConsentStore.setState({ acceptedVersion: null });
});

describe("useAiConsentStore", () => {
  it("there is no consent by default", () => {
    expect(hasAiConsent()).toBe(false);
  });

  it("accepting saves the current version of the text", () => {
    useAiConsentStore.getState().accept();
    expect(useAiConsentStore.getState().acceptedVersion).toBe(AI_CONSENT_VERSION);
    expect(hasAiConsent()).toBe(true);
  });

  it("withdrawing removes consent", () => {
    useAiConsentStore.getState().accept();
    useAiConsentStore.getState().revoke();
    expect(hasAiConsent()).toBe(false);
  });

  it("consent to an older version of the text doesn't count — the app asks again", () => {
    useAiConsentStore.setState({ acceptedVersion: AI_CONSENT_VERSION - 1 });
    expect(hasAiConsent()).toBe(false);
  });
});
