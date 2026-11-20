import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { ErrorEvent } from "@sentry/react-native";

import type * as MonitoringModule from "@/lib/monitoring";
import type * as TelemetryModule from "@/store/useTelemetryStore";

// Sentry в приложении: включается только с правильным DSN и согласием; отчёт без данных человека.

jest.mock("@sentry/react-native", () => ({
  init: jest.fn(),
  setUser: jest.fn(),
  captureException: jest.fn(),
  wrap: (component: unknown) => component,
  reactNavigationIntegration: () => ({ name: "ReactNavigation" }),
}));

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: { expoConfig: { extra: { appEnv: "preview" } } },
}));

type SentryMock = Record<"init" | "setUser" | "captureException", jest.Mock>;

const ORIGINAL_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;
const DSN = "https://0123456789abcdef0123456789abcdef@o123.ingest.de.sentry.io/456";

afterEach(() => {
  process.env.EXPO_PUBLIC_SENTRY_DSN = ORIGINAL_DSN;
});

async function load(dsn: string, consent: boolean) {
  process.env.EXPO_PUBLIC_SENTRY_DSN = dsn;
  jest.resetModules();
  const sentry = jest.requireMock<SentryMock>("@sentry/react-native");
  const monitoring = jest.requireActual<typeof MonitoringModule>("@/lib/monitoring");
  const { useTelemetryStore } = jest.requireActual<typeof TelemetryModule>(
    "@/store/useTelemetryStore",
  );
  await useTelemetryStore.persist.rehydrate();
  useTelemetryStore.setState({ enabled: consent });
  return { sentry, monitoring, useTelemetryStore };
}

describe("monitoring", () => {
  it("valid DSN + consent → Sentry starts once, without PII and replay", async () => {
    const { sentry, monitoring } = await load(DSN, true);
    monitoring.initMonitoring();
    monitoring.initMonitoring();

    expect(sentry.init).toHaveBeenCalledTimes(1);
    expect(sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: DSN,
        environment: "preview",
        sendDefaultPii: false,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
      }),
    );
    expect(monitoring.isMonitoringOn()).toBe(true);
  });

  it.each([
    "",
    "not-a-dsn",
    "https://sentry.io/456",
    "https://key@o123.ingest.sentry.io",
    "phc_wrongVariable",
  ])("DSN %p is invalid → Sentry does not start", async (dsn) => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    const { sentry, monitoring } = await load(dsn, true);
    monitoring.initMonitoring();
    monitoring.captureError(new Error("x"));
    monitoring.setMonitoringUser("user-1");

    expect(sentry.init).not.toHaveBeenCalled();
    expect(sentry.captureException).not.toHaveBeenCalled();
    expect(sentry.setUser).not.toHaveBeenCalled();
    expect(monitoring.isMonitoringOn()).toBe(false);
  });

  it("consent off → Sentry does not start", async () => {
    const { sentry, monitoring } = await load(DSN, false);
    monitoring.initMonitoring();
    expect(sentry.init).not.toHaveBeenCalled();
  });

  it("consent turned off after start → reports are dropped", async () => {
    const { monitoring, useTelemetryStore } = await load(DSN, true);
    useTelemetryStore.getState().setEnabled(false);
    expect(monitoring.scrubEvent({ type: undefined, message: "x" })).toBeNull();
  });

  it("a report keeps only the user id and no request data", async () => {
    const { monitoring } = await load(DSN, true);
    const event: ErrorEvent = {
      type: undefined,
      user: { id: "user-1", email: "a@b.c", ip_address: "1.2.3.4" },
      request: {
        url: "https://api.test/api/ai/try?x=1",
        data: { prompt: "secret" },
        headers: { Authorization: "Bearer t" },
      },
      breadcrumbs: [
        { category: "console", message: "secret" },
        { category: "xhr", data: { method: "POST", url: "https://a.test/p?token=1", status_code: 429, body: "secret" } },
        { category: "touch", data: { text: "secret" } },
      ],
    };
    const scrubbed = monitoring.scrubEvent(event);
    expect(scrubbed?.user).toEqual({ id: "user-1" });
    expect(scrubbed?.request).toEqual({ url: "https://api.test/api/ai/try" });
    expect(JSON.stringify(scrubbed)).not.toMatch(/secret|Bearer|a@b\.c|1\.2\.3\.4|token=/);
    expect(scrubbed?.breadcrumbs).toHaveLength(2);
  });

  it("isSentryDsn accepts EU and US DSNs", async () => {
    const { monitoring } = await load(DSN, true);
    expect(monitoring.isSentryDsn(DSN)).toBe(true);
    expect(monitoring.isSentryDsn("https://abc123@o1.ingest.us.sentry.io/99")).toBe(true);
  });
});
