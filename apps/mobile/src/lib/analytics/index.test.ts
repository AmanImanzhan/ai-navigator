import { afterEach, describe, expect, it, jest } from "@jest/globals";

import type * as AnalyticsModule from "@/lib/analytics";
import type * as TelemetryModule from "@/store/useTelemetryStore";

// Обёртка PostHog: без ключа, без согласия или до чтения согласия — ничего не отправляем.
// PostHog подменён: проверяем, какие вызовы до него дошли.

type FakePostHog = Record<
  "capture" | "screen" | "identify" | "reset" | "optIn" | "optOut" | "register",
  jest.Mock
> & { calls: string[] };

const mockInstances: FakePostHog[] = [];

jest.mock("posthog-react-native", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    const calls: string[] = [];
    const method = (name: string) => jest.fn(() => calls.push(name));
    const instance = {
      calls,
      capture: method("capture"),
      screen: method("screen"),
      identify: method("identify"),
      reset: method("reset"),
      optIn: method("optIn"),
      optOut: method("optOut"),
      // Пометка окружения — отдельно от calls, чтобы не мешать проверкам порядка.
      register: jest.fn(async () => {}),
    };
    mockInstances.push(instance);
    return instance;
  }),
}));

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: { expoConfig: { extra: { appEnv: "production" } } },
}));

const ORIGINAL_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;

afterEach(() => {
  mockInstances.length = 0;
  process.env.EXPO_PUBLIC_POSTHOG_KEY = ORIGINAL_KEY;
});

// Свежие модули с нужным ключом и согласием. hydrate=false — согласие ещё не прочитано.
async function load(key: string, consent: boolean, hydrate = true) {
  process.env.EXPO_PUBLIC_POSTHOG_KEY = key;
  jest.resetModules();
  const analytics = jest.requireActual<typeof AnalyticsModule>("@/lib/analytics");
  const { useTelemetryStore } = jest.requireActual<typeof TelemetryModule>(
    "@/store/useTelemetryStore",
  );
  useTelemetryStore.setState({ enabled: consent });
  if (hydrate) await useTelemetryStore.persist.rehydrate();
  if (hydrate) useTelemetryStore.setState({ enabled: consent });
  return { analytics, useTelemetryStore };
}

const KEY = "phc_testProjectKey123";

describe("analytics", () => {
  it("consent on → events go to PostHog EU, without autocapture and replay", async () => {
    const { analytics } = await load(KEY, true);
    analytics.track("lesson_started", { lesson_id: "4", track_id: "basics" });
    analytics.screen("/lesson/4");

    const PostHog = jest.requireMock<{ default: jest.Mock }>("posthog-react-native").default;
    expect(PostHog).toHaveBeenCalledWith(
      KEY,
      expect.objectContaining({
        host: "https://eu.i.posthog.com",
        enableSessionReplay: false,
        captureAppLifecycleEvents: false,
        disableGeoip: true,
      }),
    );
    expect(mockInstances[0]?.capture).toHaveBeenCalledWith("lesson_started", {
      lesson_id: "4",
      track_id: "basics",
    });
    expect(mockInstances[0]?.screen).toHaveBeenCalledWith("/lesson/4");
  });

  it("every event is marked with the build environment, also after reset()", async () => {
    const { analytics } = await load(KEY, true);
    analytics.track("app_opened", { language: "en" });
    expect(mockInstances[0]?.register).toHaveBeenCalledWith({ environment: "production" });
    analytics.reset();
    expect(mockInstances[0]?.register).toHaveBeenCalledTimes(2);
  });

  it("identify sends only the Supabase id", async () => {
    const { analytics } = await load(KEY, true);
    analytics.identify("user-1");
    expect(mockInstances[0]?.identify).toHaveBeenCalledWith("user-1");
  });

  it("consent off → nothing is sent and PostHog is not even created", async () => {
    const { analytics } = await load(KEY, false);
    analytics.track("app_opened", { language: "en" });
    analytics.identify("user-1");
    analytics.screen("/");
    expect(mockInstances).toHaveLength(0);
  });

  it("consent not read from the phone yet → nothing is sent", async () => {
    const { analytics } = await load(KEY, true, false);
    analytics.track("app_opened", { language: "en" });
    expect(mockInstances).toHaveLength(0);
  });

  it("switching consent off after events → opt-out, later events are dropped", async () => {
    const { analytics, useTelemetryStore } = await load(KEY, true);
    analytics.track("app_opened", { language: "en" });
    useTelemetryStore.getState().setEnabled(false);
    analytics.setAnalyticsEnabled(false);
    analytics.track("lesson_started", { lesson_id: "1", track_id: null });

    expect(mockInstances[0]?.calls).toEqual(["capture", "optOut"]);
  });

  it("after reset() (sign-out) the opt-out stays", async () => {
    const { analytics, useTelemetryStore } = await load(KEY, true);
    analytics.track("app_opened", { language: "en" });
    useTelemetryStore.getState().setEnabled(false);
    analytics.setAnalyticsEnabled(false);
    analytics.reset();

    // PostHog.reset() снимает отказ — обёртка сразу ставит его снова.
    expect(mockInstances[0]?.calls).toEqual(["capture", "optOut", "reset", "optOut"]);
  });

  it("reset() with consent on → no opt-out", async () => {
    const { analytics } = await load(KEY, true);
    analytics.track("app_opened", { language: "en" });
    analytics.reset();
    expect(mockInstances[0]?.calls).toEqual(["capture", "reset"]);
  });

  it.each(["", "phx_personalSecretKey", "my-key", "phc_"])(
    "key %p is not a PostHog project key → analytics off",
    async (key) => {
      jest.spyOn(console, "warn").mockImplementation(() => {});
      const { analytics } = await load(key, true);
      analytics.track("app_opened", { language: "en" });
      expect(mockInstances).toHaveLength(0);
    },
  );
});
