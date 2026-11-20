import { afterEach, describe, expect, it, jest } from "@jest/globals";

import { getResetTime } from "@/lib/ai/format";
import { formatDate } from "@/lib/date";
import { planReminders, weekdayOf } from "@/lib/reminders/plan";

// Даты по местному времени телефона. Тесты идут в часовом поясе America/Los_Angeles
// (jest.config.js): там местный день и день по UTC расходятся по вечерам.

afterEach(() => {
  jest.useRealTimers();
});

// Местное время Лос-Анджелеса.
function local(year: number, month: number, day: number, hour: number, minute = 0): Date {
  return new Date(year, month - 1, day, hour, minute);
}

describe("test time zone", () => {
  it("is America/Los_Angeles (UTC-8 in November)", () => {
    expect(local(2026, 11, 20, 20).toISOString()).toBe("2026-11-21T04:00:00.000Z");
  });
});

describe("getResetTime (when the AI limit resets, in phone time)", () => {
  it("UTC midnight is 4 PM today in Los Angeles", () => {
    jest.useFakeTimers({ now: local(2026, 11, 20, 10) });
    expect(getResetTime("2026-11-21T00:00:00.000Z", "en")).toEqual({
      day: "today",
      time: "4:00 PM",
    });
    expect(getResetTime("2026-11-21T00:00:00.000Z", "ru")).toEqual({
      day: "today",
      time: "16:00",
    });
  });

  it("in the evening (already the next day in UTC) the reset is tomorrow", () => {
    jest.useFakeTimers({ now: local(2026, 11, 20, 20) });
    expect(getResetTime("2026-11-22T00:00:00.000Z", "es")).toEqual({
      day: "tomorrow",
      time: "16:00",
    });
  });

  it("broken date → null", () => {
    expect(getResetTime("not a date", "en")).toBeNull();
  });
});

describe("formatDate", () => {
  it("uses the phone's local date, per language", () => {
    // 2027-01-01 03:00 UTC — в Лос-Анджелесе ещё 31 декабря.
    expect(formatDate("2027-01-01T03:00:00.000Z", "en")).toBe("12/31/2026");
    expect(formatDate("2027-01-01T03:00:00.000Z", "ru")).toBe("31.12.2026");
    expect(formatDate("2027-01-01T03:00:00.000Z", "es")).toBe("31/12/2026");
    expect(formatDate("nope", "en")).toBeNull();
  });
});

describe("planReminders (do not remind if a lesson was done today)", () => {
  const time = { hour: 19, minute: 0 };

  it("lesson today → today's weekday becomes a one-off next week", () => {
    const now = local(2026, 11, 20, 8);
    const plan = planReminders(now, time, local(2026, 11, 20, 7).getTime());
    const today = plan.find((item) => item.weekday === weekdayOf(now));
    expect(today).toEqual({ kind: "once", weekday: weekdayOf(now), date: local(2026, 11, 27, 19) });
    expect(plan.filter((item) => item.kind === "weekly")).toHaveLength(6);
  });

  it("lesson late last night (same UTC day) does not count as today", () => {
    // 23:30 вчера по местному времени = 07:30 UTC сегодня — тот же день по UTC, что и now.
    const now = local(2026, 11, 20, 8);
    const plan = planReminders(now, time, local(2026, 11, 19, 23, 30).getTime());
    expect(plan.every((item) => item.kind === "weekly")).toBe(true);
  });

  it("lesson just after local midnight counts as today", () => {
    const now = local(2026, 11, 20, 18);
    const plan = planReminders(now, time, local(2026, 11, 20, 0, 5).getTime());
    expect(plan.filter((item) => item.kind === "once")).toHaveLength(1);
  });

  it("next week's reminder keeps the local hour across the DST change", () => {
    // 29 октября 2026 → 5 ноября 2026: в США 1 ноября переводят часы.
    const now = local(2026, 10, 29, 20);
    const plan = planReminders(now, time, local(2026, 10, 29, 9).getTime());
    const once = plan.find((item) => item.kind === "once");
    expect(once?.kind === "once" && once.date.getHours()).toBe(19);
    expect(once?.kind === "once" && once.date.getDate()).toBe(5);
  });

  it("no lessons yet → seven weekly reminders", () => {
    const plan = planReminders(local(2026, 11, 20, 8), time, null);
    expect(plan.map((item) => item.weekday)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});
