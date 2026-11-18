import type { Metadata } from "next";

import "@/styles/globals.css";
import { AdminNav } from "@/components/admin/AdminNav";
import styles from "@/components/admin/admin.module.css";
import { signOut } from "@/lib/admin/actions";
import { checkAdmin } from "@/lib/admin/auth";

// Админка: свой корневой layout, без языков сайта (интерфейс на русском).
// Поисковикам — не индексировать (плюс заголовок X-Robots-Tag в next.config.ts). В sitemap её нет.
export const metadata: Metadata = {
  title: { default: "Админка", template: "%s · Админка AI Navigator" },
  robots: { index: false, follow: false },
};

// Меню — только админу. Сам доступ проверяет каждая страница (requireAdminPage).
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const check = await checkAdmin();

  return (
    <html lang="ru">
      <body>
        <div className={styles.page}>
          {check.status === "admin" ? (
            <header className={styles.header}>
              <span className={styles.logo}>AI Navigator · админка</span>
              <AdminNav />
              <div className={styles.account}>
                <span>{check.admin.user.email}</span>
                <form action={signOut}>
                  <button type="submit" className={`${styles.button} ${styles.buttonSmall}`}>
                    Выйти
                  </button>
                </form>
              </div>
            </header>
          ) : null}
          {children}
        </div>
      </body>
    </html>
  );
}
