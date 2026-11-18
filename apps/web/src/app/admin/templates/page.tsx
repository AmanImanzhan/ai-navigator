import type { Metadata } from "next";
import Link from "next/link";

import styles from "@/components/admin/admin.module.css";
import { requireAdminPage } from "@/lib/admin/auth";
import { loadTemplateList } from "@/lib/admin/data";
import { CONTENT_LOCALES } from "@/lib/admin/locales";

export const metadata: Metadata = { title: "Шаблоны" };

// Шаблоны запросов: поиск, число [полей] по языкам (разное — помечено), ссылка на редактор.
export default async function AdminTemplatesPage({
  searchParams,
}: PageProps<"/admin/templates">) {
  const admin = await requireAdminPage();
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const templates = await loadTemplateList(admin, query);

  return (
    <main className={styles.main}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>Шаблоны</h1>
        <p className={styles.subtitle}>
          Шаблон виден в приложении, если опубликован его урок.
        </p>
      </div>

      <form className={styles.searchForm} role="search">
        <input
          name="q"
          defaultValue={query}
          className={styles.input}
          placeholder="Номер (2.3), название или текст запроса на любом языке"
          aria-label="Поиск шаблонов"
        />
        <button type="submit" className={styles.button}>
          Найти
        </button>
        {query ? (
          <Link href="/admin/templates" className={styles.button}>
            Сбросить
          </Link>
        ) : null}
      </form>

      {templates.length === 0 ? (
        <p className={styles.muted}>Ничего не нашлось.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>№</th>
                <th>Название</th>
                <th>Урок</th>
                <th>[Поля] ru / en / es</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => {
                const counts = CONTENT_LOCALES.map(
                  (locale) => template.fieldCounts[locale],
                );
                const mismatch = new Set(counts).size > 1;
                return (
                  <tr key={template.id}>
                    <td>{template.id}</td>
                    <td>
                      <Link href={`/admin/templates/${template.id}`}>{template.title}</Link>
                    </td>
                    <td>
                      {template.lessonId}. {template.lessonTitle}
                    </td>
                    <td className={styles.nowrap}>
                      <span
                        className={`${styles.badge} ${mismatch ? styles.badgeWarn : ""}`}
                        title={mismatch ? "Разное число полей в языках" : undefined}
                      >
                        {counts.map((count) => count ?? "—").join(" / ")}
                        {mismatch ? " ⚠" : ""}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
