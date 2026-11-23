import { describe, expect, it } from "vitest";

import { buildDeployEnv, deployEnvironment } from "@/lib/deploy";

describe("deploy info from build variables", () => {
  it.each([
    [{ CONTEXT: "production" }, "production"],
    [{ CONTEXT: "deploy-preview" }, "preview"],
    [{ CONTEXT: "branch-deploy" }, "preview"],
    [{ CONTEXT: "dev" }, "development"],
    // Без хостинга: локальная сборка / CI — по NODE_ENV.
    [{ NODE_ENV: "production" }, "production"],
    [{ NODE_ENV: "test" }, "development"],
    [{}, "development"],
  ])("%o → %s", (env, expected) => {
    expect(deployEnvironment(env)).toBe(expected);
  });

  it("Netlify build: environment, short commit and site address", () => {
    expect(
      buildDeployEnv({
        CONTEXT: "production",
        COMMIT_REF: "0123456789abcdef",
        URL: "https://ai-navigator-app.netlify.app",
      }),
    ).toEqual({
      NEXT_PUBLIC_DEPLOY_ENV: "production",
      NEXT_PUBLIC_DEPLOY_COMMIT: "0123456",
      NEXT_PUBLIC_DEPLOY_URL: "https://ai-navigator-app.netlify.app",
    });
  });

  it("no hosting variables → empty values, never Vercel-specific ones", () => {
    expect(buildDeployEnv({ VERCEL_ENV: "production", VERCEL_GIT_COMMIT_SHA: "abc" })).toEqual({
      NEXT_PUBLIC_DEPLOY_ENV: "development",
      NEXT_PUBLIC_DEPLOY_COMMIT: "",
      NEXT_PUBLIC_DEPLOY_URL: "",
    });
  });
});
