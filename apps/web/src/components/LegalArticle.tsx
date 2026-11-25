import styles from "@/components/LegalArticle.module.css";
import { TodoText } from "@/components/TodoText";
import type { LegalDocument } from "@/content/legal";

type LegalArticleProps = {
  title: string;
  document: LegalDocument;
  updatedLabel: string;
};

// Юридический документ: заголовок, дата и разделы.
export function LegalArticle({
  title,
  document,
  updatedLabel,
}: LegalArticleProps) {
  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.updated}>
          {updatedLabel}: <TodoText text={document.updated} />
        </p>
      </header>

      <p className={styles.intro}>
        <TodoText text={document.intro} />
      </p>

      {document.sections.map((section) => (
        <section key={section.heading} className={styles.section}>
          <h2 className={styles.heading}>{section.heading}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>
              <TodoText text={paragraph} />
            </p>
          ))}
          {section.items ? (
            <ul className={styles.list}>
              {section.items.map((item) => (
                <li key={item}>
                  <TodoText text={item} />
                </li>
              ))}
            </ul>
          ) : null}
          {section.afterItems?.map((paragraph) => (
            <p key={paragraph}>
              <TodoText text={paragraph} />
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
