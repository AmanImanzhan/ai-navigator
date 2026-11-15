import type { Metadata } from "next";
import Link from "next/link";

import "@/styles/globals.css";
import styles from "@/app/global-not-found.module.css";

export const metadata: Metadata = {
  title: "404 · AI Navigator",
};

// Страница 404 для адресов, которых нет. Язык адреса неизвестен — пишем на всех трёх.
// Отдельный файл нужен, потому что корневой layout лежит в app/[lang].
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className={styles.page}>
          <p className={styles.code}>404</p>
          <h1 className={styles.title} lang="en">
            Page not found
          </h1>
          <p className={styles.translation} lang="ru">
            Страница не найдена
          </p>
          <p className={styles.translation} lang="es">
            Página no encontrada
          </p>
          <Link href="/" className={styles.link}>
            AI Navigator
          </Link>
        </main>
      </body>
    </html>
  );
}
