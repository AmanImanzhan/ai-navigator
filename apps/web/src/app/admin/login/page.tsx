import type { Metadata } from "next";
import { redirect } from "next/navigation";

import styles from "@/components/admin/admin.module.css";
import { signInWithGoogle } from "@/lib/admin/actions";
import { checkAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Вход" };

const ERRORS: Record<string, string> = {
  start: "Не получилось начать вход через Google. Попробуйте ещё раз.",
  callback:
    "Вход не завершился. Попробуйте ещё раз — если повторится, проверьте Redirect URLs в Supabase.",
};

// Вход в админку через Google (тот же аккаунт, что в приложении).
export default async function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const check = await checkAdmin();
  if (check.status === "admin") redirect("/admin");
  if (check.status === "forbidden") redirect("/admin/no-access");

  const { error } = await searchParams;
  const message = typeof error === "string" ? (ERRORS[error] ?? ERRORS.start) : null;

  return (
    <main className={styles.center}>
      <div className={`${styles.card} ${styles.loginCard}`}>
        <div className={styles.titleBlock}>
          <h1 className={styles.sectionTitle}>Админка AI Navigator</h1>
          <p className={styles.muted}>
            Вход только для команды. Войдите через Google — тем же аккаунтом, что и в
            приложении.
          </p>
        </div>
        {message ? (
          <p className={styles.errorBox} role="alert">
            {message}
          </p>
        ) : null}
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonLarge}`}
          >
            Войти через Google
          </button>
        </form>
      </div>
    </main>
  );
}
