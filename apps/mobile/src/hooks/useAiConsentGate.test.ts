import { beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react-native";

import { useAiConsentGate } from "@/hooks/useAiConsentGate";
import { hasAiConsent, useAiConsentStore } from "@/store/useAiConsentStore";

// Запрос к ИИ (действие) выполняется только с согласием: без него — сначала лист,
// «Согласен» — согласие сохраняется и запрос уходит, «Не сейчас» — не уходит.

jest.mock("@/lib/analytics", () => ({ track: jest.fn() }));

beforeAll(async () => {
  await useAiConsentStore.persist.rehydrate();
});

beforeEach(() => {
  useAiConsentStore.setState({ acceptedVersion: null });
});

describe("useAiConsentGate", () => {
  it("without consent: shows the sheet and doesn't send", async () => {
    const send = jest.fn();
    const { result } = await renderHook(() => useAiConsentGate());

    await act(() => result.current.run(send));
    expect(result.current.visible).toBe(true);
    expect(send).not.toHaveBeenCalled();
  });

  it("'Not now': the request is never sent", async () => {
    const send = jest.fn();
    const { result } = await renderHook(() => useAiConsentGate());

    await act(() => result.current.run(send));
    await act(() => result.current.decline());
    expect(result.current.visible).toBe(false);
    expect(send).not.toHaveBeenCalled();
    expect(hasAiConsent()).toBe(false);
  });

  it("'I agree': consent is saved and the request goes once", async () => {
    const send = jest.fn();
    const { result } = await renderHook(() => useAiConsentGate());

    await act(() => result.current.run(send));
    await act(() => result.current.agree());
    expect(hasAiConsent()).toBe(true);
    expect(send).toHaveBeenCalledTimes(1);
    expect(result.current.visible).toBe(false);
  });

  it("with consent: sends right away, no sheet", async () => {
    useAiConsentStore.getState().accept();
    const send = jest.fn();
    const { result } = await renderHook(() => useAiConsentGate());

    await act(() => result.current.run(send));
    expect(send).toHaveBeenCalledTimes(1);
    expect(result.current.visible).toBe(false);
  });
});
