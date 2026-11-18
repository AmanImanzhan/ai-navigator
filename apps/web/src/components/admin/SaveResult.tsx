import styles from "@/components/admin/admin.module.css";
import type { ActionResult } from "@/lib/admin/actions";

// Итог сохранения: «Сохранено» или список того, что исправить.
export function SaveResult({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  if (result.ok) {
    return (
      <p className={styles.successBox} role="status">
        Сохранено. В приложении появится при следующем обновлении контента (до 6 часов).
      </p>
    );
  }
  return (
    <div className={styles.errorBox} role="alert">
      <strong>Не сохранено — исправьте:</strong>
      <ul>
        {result.errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
