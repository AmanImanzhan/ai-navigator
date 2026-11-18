import "server-only";

import type { Json } from "@ai-navigator/shared";

import type { AdminContext } from "@/lib/admin/auth";
import type { ContentLocale } from "@/lib/admin/locales";

// Журнал изменений: кто, когда, что поменял (таблица admin_audit_log, пишет только сервер).
// Тексты до и после не храним — только какие поля менялись.

export type AuditAction =
  "lesson.update" | "lesson.publish" | "lesson.hide" | "template.update";

export async function logChange(
  admin: AdminContext,
  action: AuditAction,
  entityId: string,
  details: Json,
  locale: ContentLocale | null = null,
): Promise<void> {
  const { error } = await admin.db.from("admin_audit_log").insert({
    admin_id: admin.user.id,
    admin_email: admin.user.email,
    action,
    entity_id: entityId,
    locale,
    details,
  });
  // Изменение уже сохранено — сбой журнала не повод показывать ошибку. Пишем только код.
  if (error) console.error(`admin audit log: ${error.code}`);
}
