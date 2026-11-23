// Сведения о деплое без привязки к хостингу: окружение, коммит, адрес сайта.
// Хостинг (Netlify) даёт их только во время сборки — next.config.ts вшивает их в код
// как NEXT_PUBLIC_DEPLOY_* (buildDeployEnv). Код сайта читает только эти переменные.

export type DeployEnvironment = "production" | "preview" | "development";

export type BuildEnv = Record<string, string | undefined>;

// Окружение по переменным сборки. Netlify: CONTEXT = production / deploy-preview /
// branch-deploy / dev. Без хостинга (локально, CI) — по NODE_ENV.
export function deployEnvironment(env: BuildEnv): DeployEnvironment {
  switch (env.CONTEXT) {
    case "production":
      return "production";
    case "deploy-preview":
    case "branch-deploy":
      return "preview";
    case "dev":
      return "development";
    default:
      return env.NODE_ENV === "production" ? "production" : "development";
  }
}

// Что вшить в код при сборке (next.config.ts → env). Пустая строка — значения нет.
export function buildDeployEnv(env: BuildEnv): Record<string, string> {
  return {
    NEXT_PUBLIC_DEPLOY_ENV: deployEnvironment(env),
    // Короткий хеш коммита (Netlify: COMMIT_REF).
    NEXT_PUBLIC_DEPLOY_COMMIT: (env.COMMIT_REF ?? "").slice(0, 7),
    // Основной адрес сайта (Netlify: URL — …netlify.app или свой домен).
    NEXT_PUBLIC_DEPLOY_URL: env.URL ?? "",
  };
}

export function deployCommit(): string | null {
  return process.env.NEXT_PUBLIC_DEPLOY_COMMIT || null;
}
