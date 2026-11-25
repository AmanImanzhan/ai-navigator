import { beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { AiConsentSettings } from "@/components/settings/AiConsentSettings";
import "@/i18n";
import { track } from "@/lib/analytics";
import { hasAiConsent, useAiConsentStore } from "@/store/useAiConsentStore";

// Настройки → Конфиденциальность → «AI-помощник»: включить можно только через лист согласия,
// выключить — отозвать согласие.

jest.mock("@/lib/analytics", () => ({ track: jest.fn() }));
jest.mock("@/lib/site", () => ({ openSitePage: jest.fn() }));

beforeAll(async () => {
  await useAiConsentStore.persist.rehydrate();
});

beforeEach(() => {
  useAiConsentStore.setState({ acceptedVersion: null });
});

const toggle = () => screen.getByRole("switch", { name: "AI assistant" });

describe("AiConsentSettings", () => {
  it("turning on shows the consent sheet; 'Not now' keeps it off", async () => {
    await render(<AiConsentSettings />);
    expect(toggle()).not.toBeChecked();

    await fireEvent(toggle(), "valueChange", true);
    expect(screen.getByText("Before you ask AI")).toBeOnTheScreen();
    expect(screen.getByText(/Anthropic deletes it within 30 days/)).toBeOnTheScreen();

    await fireEvent.press(screen.getByText("Not now"));
    expect(hasAiConsent()).toBe(false);
    expect(toggle()).not.toBeChecked();
    expect(track).toHaveBeenCalledWith("ai_consent", { action: "declined" });
  });

  it("'I agree' on the sheet gives consent", async () => {
    await render(<AiConsentSettings />);
    await fireEvent(toggle(), "valueChange", true);
    await fireEvent.press(screen.getByText("I agree"));

    expect(hasAiConsent()).toBe(true);
    expect(toggle()).toBeChecked();
  });

  it("turning off withdraws consent", async () => {
    useAiConsentStore.getState().accept();
    await render(<AiConsentSettings />);
    expect(toggle()).toBeChecked();

    await fireEvent(toggle(), "valueChange", false);
    expect(hasAiConsent()).toBe(false);
    expect(track).toHaveBeenCalledWith("ai_consent", { action: "revoked" });
  });
});
