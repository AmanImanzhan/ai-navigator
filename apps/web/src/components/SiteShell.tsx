import Link from "next/link";
import type { ReactNode } from "react";

import styles from "@/components/SiteShell.module.css";
import {
  LOCALES,
  LOCALE_NAMES,
  localizedPath,
  type Locale,
  type SitePath,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type SiteShellProps = {
  lang: Locale;
  // Текущая страница без языка — чтобы переключатель вёл на неё же на другом языке.
  path: SitePath;
  children: ReactNode;
};

// Общий каркас страниц: шапка с логотипом и выбором языка, содержимое, подвал со ссылками.
// Серверный компонент: в браузер не уходит ни строчки JavaScript.
export function SiteShell({ lang, path, children }: SiteShellProps) {
  const dict = getDictionary(lang);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href={localizedPath(lang, "")} className={styles.logo}>
          {dict.meta.siteName}
        </Link>

        <nav aria-label={dict.nav.language} className={styles.languages}>
          {LOCALES.map((locale) => (
            <Link
              key={locale}
              href={localizedPath(locale, path)}
              hrefLang={locale}
              lang={locale}
              aria-current={locale === lang ? "true" : undefined}
              className={
                locale === lang ? styles.languageActive : styles.language
              }
            >
              {LOCALE_NAMES[locale]}
            </Link>
          ))}
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <nav className={styles.footerLinks}>
          <Link href={localizedPath(lang, "/support")}>{dict.nav.support}</Link>
          <Link href={localizedPath(lang, "/privacy")}>{dict.nav.privacy}</Link>
          <Link href={localizedPath(lang, "/terms")}>{dict.nav.terms}</Link>
        </nav>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} {dict.meta.siteName}.{" "}
          {dict.footer.rights}
        </p>
      </footer>
    </div>
  );
}
