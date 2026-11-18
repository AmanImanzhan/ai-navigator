"use client";

import { useState, useTransition } from "react";

import styles from "@/components/admin/admin.module.css";
import { setLessonPublished } from "@/lib/admin/actions";

type PublishToggleProps = {
  lessonId: string;
  published: boolean;
};

// Переключатель «опубликован / скрыт». Скрыть — с подтверждением: урок и его шаблоны
// пропадут из приложения при следующем обновлении контента.
export function PublishToggle({ lessonId, published }: PublishToggleProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (
      published &&
      !window.confirm(
        `Скрыть урок ${lessonId}? Он и его шаблоны пропадут из приложения при следующем обновлении контента.`,
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await setLessonPublished(lessonId, !published);
      if (!result.ok) setError(result.errors.join(" "));
    });
  }

  return (
    <span className={styles.toolbar}>
      <span className={`${styles.badge} ${published ? styles.badgeOk : ""}`}>
        {published ? "Опубликован" : "Скрыт"}
      </span>
      <button
        type="button"
        className={`${styles.button} ${styles.buttonSmall}`}
        onClick={handleClick}
        disabled={pending}
        aria-label={`${published ? "Скрыть" : "Опубликовать"} урок ${lessonId}`}
      >
        {pending ? "…" : published ? "Скрыть" : "Опубликовать"}
      </button>
      {error ? (
        <span className={styles.caption} role="alert">
          {error}
        </span>
      ) : null}
    </span>
  );
}
