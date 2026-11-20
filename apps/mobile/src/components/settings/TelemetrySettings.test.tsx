import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Alert } from "react-native";

import { TelemetrySettings } from "@/components/settings/TelemetrySettings";
import "@/i18n";
import { captureError, isMonitoringOn } from "@/lib/monitoring";
import { useTelemetryStore } from "@/store/useTelemetryStore";

// Переключатель «Помогать улучшать приложение» и кнопка «Тест Sentry» (только в разработке).

jest.mock("@/lib/monitoring", () => ({
  captureError: jest.fn(),
  isMonitoringOn: jest.fn(),
}));

beforeEach(() => {
  useTelemetryStore.setState({ enabled: true });
  jest.spyOn(Alert, "alert").mockImplementation(() => {});
});

describe("TelemetrySettings", () => {
  it("is on by default and turning it off saves the choice", async () => {
    await render(<TelemetrySettings />);
    const toggle = screen.getByRole("switch", { name: "Help improve the app" });
    expect(toggle).toBeChecked();

    await fireEvent(toggle, "valueChange", false);
    expect(useTelemetryStore.getState().enabled).toBe(false);
    expect(screen.getByRole("switch", { name: "Help improve the app" })).not.toBeChecked();
  });

  it("'Test Sentry' sends a test error when Sentry is on", async () => {
    jest.mocked(isMonitoringOn).mockReturnValue(true);
    await render(<TelemetrySettings />);
    await fireEvent.press(screen.getByText("Test Sentry"));
    expect(captureError).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith("Sentry", "Test error sent — check Issues in Sentry.");
  });

  it("'Test Sentry' explains when Sentry is off and sends nothing", async () => {
    jest.mocked(isMonitoringOn).mockReturnValue(false);
    await render(<TelemetrySettings />);
    await fireEvent.press(screen.getByText("Test Sentry"));
    expect(captureError).not.toHaveBeenCalled();
    expect(jest.mocked(Alert.alert).mock.calls[0]?.[1]).toMatch(/^Sentry is off/);
  });
});
