import type { Metadata } from "next";
import Link from "next/link";

import styles from "@/components/admin/admin.module.css";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { requireAdminPage } from "@/lib/admin/auth";
import { loadLessonList } from "@/lib/admin/data";
import { CONTENT_LOCALES } from "@/lib/admin/locales";

export const metadata: Metadata = { title: "Уроки" };

// Уроки по направлениям: статус, на каких языках есть карточки, ссылка на редактор.
export default async function AdminLessonsPage() {
  const admin = await requireAdminPage();
  const tracks = await loadLessonList(admin);

  return (
    <main className={styles.main}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>Уроки</h1>
        <p className={styles.subtitle}>
          Скрытый урок не виден в приложении вместе с его шаблонами. Языки без карточек
          приложение покажет на английском.
        </p>
      </div>

      {tracks.map((track) => (
        <section key={track.id} className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {track.title}{" "}
            {track.premium ? <span className={styles.badge}>По подписке</span> : null}
          </h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Название</th>
                  <th>Уровень, мин</th>
                  <th>Карточки</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {track.lessons.map((lesson) => (
                  <tr key={lesson.id}>
                    <td>{lesson.id}</td>
                    <td>
                      <Link href={`/admin/lessons/${lesson.id}`}>{lesson.title}</Link>
                    </td>
                    <td className={styles.nowrap}>
                      {lesson.level} · {lesson.minutes} мин
                    </td>
                    <td>
                      <span className={styles.badges}>
                        {CONTENT_LOCALES.map((locale) => (
                          <span
                            key={locale}
                            className={`${styles.badge} ${
                              lesson.contentLocales.includes(locale) ? styles.badgeOk : ""
                            }`}
                            title={
                              lesson.contentLocales.includes(locale)
                                ? "Карточки есть"
                                : "Карточек нет"
                            }
                          >
                            {locale}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td>
                      <PublishToggle lessonId={lesson.id} published={lesson.published} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </main>
  );
}
