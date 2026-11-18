import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "@/components/admin/admin.module.css";
import { LessonEditors } from "@/components/admin/LessonEditor";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { requireAdminPage } from "@/lib/admin/auth";
import { loadLesson } from "@/lib/admin/data";

export async function generateMetadata({
  params,
}: PageProps<"/admin/lessons/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Урок ${id}` };
}

// Редактор урока: статус, вкладки ru / en / es с названием, карточками и заметкой.
export default async function AdminLessonPage({
  params,
}: PageProps<"/admin/lessons/[id]">) {
  const admin = await requireAdminPage();
  const { id } = await params;
  const lesson = await loadLesson(admin, id);
  if (!lesson) notFound();

  return (
    <main className={styles.main}>
      <Link href="/admin/lessons" className={styles.backLink}>
        ← Все уроки
      </Link>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>
          Урок {lesson.id}. {lesson.title}
        </h1>
        <p className={styles.subtitle}>
          {lesson.trackTitle} · уровень {lesson.level} · {lesson.minutes} мин
        </p>
      </div>
      <PublishToggle lessonId={lesson.id} published={lesson.published} />
      <p className={styles.infoBox}>
        Перед сохранением урок проверяется так же, как его проверит приложение: битые
        карточки сохранить нельзя. Поля со звёздочкой обязательны.
      </p>
      <LessonEditors lessonId={lesson.id} locales={lesson.locales} />
    </main>
  );
}
