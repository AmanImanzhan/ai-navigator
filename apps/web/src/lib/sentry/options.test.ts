import type { ErrorEvent } from "@sentry/nextjs";
import { describe, expect, it } from "vitest";

import { scrubBreadcrumb, scrubEvent } from "@/lib/sentry/options";

// Отчёт об ошибке сайта: никаких данных человека перед отправкой в Sentry.

describe("web Sentry scrubbing", () => {
  it("removes body, headers, cookies, query and user", () => {
    const event: ErrorEvent = {
      type: undefined,
      request: {
        url: "https://ainavigator.app/api/ai/try?email=a@b.c#x",
        data: { prompt: "secret text" },
        headers: { authorization: "Bearer token" },
        cookies: { sb: "session" },
        query_string: "email=a@b.c",
      },
      user: { id: "u1", email: "a@b.c", ip_address: "1.2.3.4" },
      breadcrumbs: [
        { category: "console", message: "prompt: secret text" },
        {
          category: "fetch",
          data: { method: "POST", url: "https://x.test/a?token=1", status_code: 500, body: "x" },
        },
        { category: "navigation", data: { from: "/a?q=1", to: "/b" } },
      ],
    };
    const scrubbed = scrubEvent(event);
    expect(scrubbed.request).toEqual({ url: "https://ainavigator.app/api/ai/try" });
    expect(scrubbed.user).toBeUndefined();
    expect(scrubbed.breadcrumbs).toEqual([
      {
        category: "fetch",
        data: { method: "POST", url: "https://x.test/a", status_code: 500 },
      },
      { category: "navigation", data: undefined },
    ]);
    expect(JSON.stringify(scrubbed)).not.toMatch(/secret|Bearer|a@b\.c|1\.2\.3\.4/);
  });

  it("drops console breadcrumbs", () => {
    expect(scrubBreadcrumb({ category: "console", message: "x" })).toBeNull();
  });
});
