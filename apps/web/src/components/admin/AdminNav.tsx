"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "@/components/admin/admin.module.css";

const LINKS = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/lessons", label: "Уроки" },
  { href: "/admin/templates", label: "Шаблоны" },
] as const;

// Разделы админки. Активный раздел подсвечен.
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Разделы админки">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
