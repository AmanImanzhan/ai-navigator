import type { LanguageCode } from "@/data/onboarding";

// Оформление ответов помощника для экрана.

// ИИ иногда пишет разметку Markdown (**жирный**, # заголовок, - пункт). Мы показываем простой
// текст, поэтому убираем звёздочки и решётки, а пункты списка рисуем точками.
export function toPlainText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^(\s*)[-*]\s+/gm, "$1• ");
}

// Когда обновится лимит: «сегодня» или «завтра» и время по часам телефона.
export type ResetTime = {
  day: "today" | "tomorrow";
  time: string;
};

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

// Время без Intl: английский — «3:00 AM», русский и испанский — «03:00».
function formatTime(date: Date, language: LanguageCode): string {
  const minutes = pad(date.getMinutes());
  if (language === "en") {
    const hours = date.getHours() % 12 || 12;
    return `${hours}:${minutes} ${date.getHours() < 12 ? "AM" : "PM"}`;
  }
  return `${pad(date.getHours())}:${minutes}`;
}

// resetAt приходит с сервера как полночь по UTC (ISO). Переводим в местное время человека.
export function getResetTime(
  resetAt: string,
  language: LanguageCode,
): ResetTime | null {
  const reset = new Date(resetAt);
  if (Number.isNaN(reset.getTime())) return null;
  const today = new Date();
  const sameDay =
    reset.getFullYear() === today.getFullYear() &&
    reset.getMonth() === today.getMonth() &&
    reset.getDate() === today.getDate();
  return {
    day: sameDay ? "today" : "tomorrow",
    time: formatTime(reset, language),
  };
}
