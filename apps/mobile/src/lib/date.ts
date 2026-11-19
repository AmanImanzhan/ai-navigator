import type { LanguageCode } from "@/data/onboarding";

// Дата без Intl (как время в lib/ai/format.ts): английский — 12/31/2026,
// русский — 31.12.2026, испанский — 31/12/2026. Не смогли разобрать — null.
export function formatDate(iso: string, language: LanguageCode): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  if (language === "en") return `${month}/${day}/${year}`;
  if (language === "ru") return `${day}.${month}.${year}`;
  return `${day}/${month}/${year}`;
}
