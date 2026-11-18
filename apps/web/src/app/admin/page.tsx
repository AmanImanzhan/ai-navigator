import type { Metadata } from "next";
import Link from "next/link";

import styles from "@/components/admin/admin.module.css";
import { requireAdminPage } from "@/lib/admin/auth";
import { loadOverview } from "@/lib/admin/data";
import {
  actionLabel,
  describeDetails,
  entityLink,
  formatDateTime,
} from "@/lib/admin/format";

export const metadata: Metadata = { title: "Обзор" };

// Обзор: сводные цифры без личных данных и последние изменения контента.
export default async function AdminOverviewPage() {
  const admin = await requireAdminPage();
  const { stats, recent } = await loadOverview(admin);

  const cards = [
    { value: stats.users, label: "Пользователей всего" },
    { value: stats.aiRequestsToday, label: "Запросов к ИИ сегодня (UTC)" },
    { value: stats.aiRequests7d, label: "Запросов к ИИ за 7 дней" },
    { value: stats.aiUsersToday, label: "Человек спросили ИИ сегодня" },
    {
      value: `${stats.lessonsPublished} из ${stats.lessonsTotal}`,
      label: "Уроков опубликовано",
    },
    { value: stats.templatesTotal, label: "Шаблонов" },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>Обзор</h1>
        <p className={styles.subtitle}>
          Приложение подтягивает контент раз в 6 часов или при смене языка — правки
          появятся у людей не сразу.
        </p>
      </div>

      <section className={styles.stats} aria-label="Цифры">
        {cards.map((card) => (
          <div key={card.label} className={styles.stat}>
            <span className={styles.statValue}>{card.value}</span>
            <span className={styles.statLabel}>{card.label}</span>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Последние изменения</h2>
        {recent.length === 0 ? (
          <p className={styles.muted}>Пока ничего не меняли.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Когда</th>
                  <th>Кто</th>
                  <th>Что</th>
                  <th>Где</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((entry) => (
                  <tr key={entry.id}>
                    <td className={styles.nowrap}>{formatDateTime(entry.created_at)}</td>
                    <td>{entry.admin_email ?? "—"}</td>
                    <td>
                      {actionLabel(entry.action)}
                      {describeDetails(entry.details) ? (
                        <span className={styles.caption}>
                          {" "}
                          · {describeDetails(entry.details)}
                        </span>
                      ) : null}
                    </td>
                    <td className={styles.nowrap}>
                      <Link href={entityLink(entry)}>
                        {entry.action.startsWith("template.") ? "Шаблон" : "Урок"}{" "}
                        {entry.entity_id}
                      </Link>
                      {entry.locale ? ` · ${entry.locale}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
