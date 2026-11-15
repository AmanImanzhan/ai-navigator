import type { Metadata } from "next";
import { notFound } from "next/navigation";

import styles from "@/app/[lang]/page.module.css";
import { SiteShell } from "@/components/SiteShell";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return {
    // На главной — полный заголовок без шаблона «… · AI Navigator».
    ...pageMetadata(lang, "", meta.homeTitle, meta.homeDescription),
    title: { absolute: meta.homeTitle },
  };
}

// Главная: что такое AI Navigator, для кого, преимущества и место под кнопку App Store.
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { home } = getDictionary(lang);

  return (
    <SiteShell lang={lang} path="">
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{home.eyebrow}</p>
        <h1 className={styles.title}>{home.title}</h1>
        <p className={styles.lead}>{home.lead}</p>
        {/* Место под официальный значок App Store — после выхода приложения. */}
        <p className={styles.appStore} role="status">
          {home.appStoreSoon}
        </p>
        <p className={styles.note}>{home.languagesNote}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{home.benefitsTitle}</h2>
        <ul className={styles.benefits}>
          {home.benefits.map((benefit) => (
            <li key={benefit.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{benefit.title}</h3>
              <p className={styles.cardText}>{benefit.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{home.audienceTitle}</h2>
        <p className={styles.text}>{home.audienceText}</p>
        <ul className={styles.audience}>
          {home.audience.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </SiteShell>
  );
}
