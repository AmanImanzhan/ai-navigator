import type { Metadata } from "next";
import { redirect } from "next/navigation";

import styles from "@/components/admin/admin.module.css";
import { signOut } from "@/lib/admin/actions";
import { checkAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Нет доступа" };

// Вошёл, но не админ.
export default async function NoAccessPage() {
  const check = await checkAdmin();
  if (check.status === "signedOut") redirect("/admin/login");
  if (check.status === "admin") redirect("/admin");

  return (
    <main className={styles.center}>
      <div className={`${styles.card} ${styles.loginCard}`}>
        <h1 className={styles.sectionTitle}>Нет доступа</h1>
        <p className={styles.muted}>
          Аккаунт {check.email ?? "без почты"} не админ. Если вы из команды — попросите
          владельца проекта добавить вас, затем обновите страницу.
        </p>
        <form action={signOut}>
          <button type="submit" className={styles.button}>
            Выйти и войти другим аккаунтом
          </button>
        </form>
      </div>
    </main>
  );
}
