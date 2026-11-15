import type { Metadata } from "next";
import { notFound } from "next/navigation";

import styles from "@/app/[lang]/support/page.module.css";
import { SiteShell } from "@/components/SiteShell";
import { TodoText } from "@/components/TodoText";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/support">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return pageMetadata(
    lang,
    "/support",
    meta.supportTitle,
    meta.supportDescription,
  );
}

// Поддержка: как связаться и как удалить аккаунт (это требуют App Store и Google).
export default async function Support({
  params,
}: PageProps<"/[lang]/support">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { support } = getDictionary(lang);
  const hasEmail = !support.email.startsWith("[TODO");

  return (
    <SiteShell lang={lang} path="/support">
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>{support.title}</h1>
          <p className={styles.lead}>{support.lead}</p>
        </header>

        <section className={styles.contact}>
          <h2 className={styles.heading}>{support.contactTitle}</h2>
          <p>{support.contactText}</p>
          <p className={styles.email}>
            {hasEmail ? (
              <a href={`mailto:${support.email}`}>{support.email}</a>
            ) : (
              <TodoText text={support.email} />
            )}
          </p>
        </section>

        <section className={styles.faq}>
          <h2 className={styles.heading}>{support.faqTitle}</h2>
          {support.faq.map((item) => (
            <div key={item.question} className={styles.question}>
              <h3 className={styles.questionTitle}>{item.question}</h3>
              {item.answer.map((paragraph) => (
                <p key={paragraph} className={styles.answer}>
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </section>
      </div>
    </SiteShell>
  );
}
