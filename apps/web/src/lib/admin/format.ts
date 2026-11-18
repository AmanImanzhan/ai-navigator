import { fieldLabel, type Json } from "@ai-navigator/shared";

import type { AuditEntry } from "@/lib/admin/data";

// Подписи для журнала изменений и дат в админке.

const ACTION_LABELS: Record<string, string> = {
  "lesson.update": "Изменён урок",
  "lesson.publish": "Урок опубликован",
  "lesson.hide": "Урок скрыт",
  "template.update": "Изменён шаблон",
};

export function actionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action;
}

const EXTRA_LABELS: Record<string, string> = {
  content: "карточки",
  note: "заметка урока",
  title: "название",
};

function label(key: string): string {
  return (EXTRA_LABELS[key] ?? fieldLabel(key)).toLocaleLowerCase("ru");
}

// { fields: ["title", "content"] } → «название, карточки»;
// { fields: { ru: ["prompt"] } } → «ru: запрос».
export function describeDetails(details: Json): string {
  if (typeof details !== "object" || details === null || Array.isArray(details)) {
    return "";
  }
  const fields = details.fields;
  if (Array.isArray(fields)) {
    return fields.filter((key) => typeof key === "string").map(label).join(", ");
  }
  if (typeof fields === "object" && fields !== null) {
    return Object.entries(fields)
      .map(([locale, keys]) =>
        Array.isArray(keys)
          ? `${locale}: ${keys.filter((key) => typeof key === "string").map(label).join(", ")}`
          : locale,
      )
      .join("; ");
  }
  return "";
}

// Дата и время по UTC: сервер на Vercel живёт в UTC, а часовой пояс админа мы не знаем.
export function formatDateTime(iso: string): string {
  return `${new Date(iso).toLocaleString("ru-RU", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })} UTC`;
}

export function entityLink(entry: Pick<AuditEntry, "action" | "entity_id">): string {
  return entry.action.startsWith("template.")
    ? `/admin/templates/${entry.entity_id}`
    : `/admin/lessons/${entry.entity_id}`;
}
