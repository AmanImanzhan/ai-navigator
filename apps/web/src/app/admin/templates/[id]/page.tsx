import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "@/components/admin/admin.module.css";
import { TemplateEditor } from "@/components/admin/TemplateEditor";
import { requireAdminPage } from "@/lib/admin/auth";
import { loadTemplate } from "@/lib/admin/data";

export async function generateMetadata({
  params,
}: PageProps<"/admin/templates/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Шаблон ${id}` };
}

// Редактор шаблона: три языка, сохраняются вместе.
export default async function AdminTemplatePage({
  params,
}: PageProps<"/admin/templates/[id]">) {
  const admin = await requireAdminPage();
  const { id } = await params;
  const template = await loadTemplate(admin, id);
  if (!template) notFound();

  return (
    <main className={styles.main}>
      <Link href="/admin/templates" className={styles.backLink}>
        ← Все шаблоны
      </Link>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>
          Шаблон {template.id}. {template.title}
        </h1>
        <p className={styles.subtitle}>
          Урок <Link href={`/admin/lessons/${template.lessonId}`}>{template.lessonId}</Link>
        </p>
      </div>
      <TemplateEditor templateId={template.id} texts={template.texts} />
    </main>
  );
}
