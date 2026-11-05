import type { defaultNS, resources } from "@/i18n";

// Подсказываем TypeScript, какие ключи переводов существуют: опечатка в ключе — ошибка tsc.
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["en"];
  }
}
