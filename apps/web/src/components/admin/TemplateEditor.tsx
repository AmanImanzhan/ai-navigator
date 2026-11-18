"use client";

import {
  fieldLabel,
  getTemplateFields,
  templateFieldsIssues,
  type Json,
} from "@ai-navigator/shared";
import { useId, useState, useTransition } from "react";

import styles from "@/components/admin/admin.module.css";
import { SaveResult } from "@/components/admin/SaveResult";
import { useUnsavedWarning } from "@/components/admin/useUnsavedWarning";
import { saveTemplate, type ActionResult } from "@/lib/admin/actions";
import {
  CONTENT_LOCALE_NAMES,
  CONTENT_LOCALES,
  type ContentLocale,
} from "@/lib/admin/locales";

type Tool = { name: string; url: string };

type TemplateDraft = {
  title: string;
  purpose: string;
  prompt: string;
  example: string;
  tools: Tool[];
};

export type TemplateTextInitial = {
  title: string;
  purpose: string;
  prompt: string;
  example: string;
  tools: Json;
};

type TemplateEditorProps = {
  templateId: string;
  texts: Record<ContentLocale, TemplateTextInitial>;
};

// Инструменты из базы → строки формы (кривые элементы превращаются в пустые строки,
// проверка при сохранении о них скажет).
function toTools(value: Json): Tool[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const record =
      typeof item === "object" && item !== null && !Array.isArray(item) ? item : {};
    return {
      name: typeof record.name === "string" ? record.name : "",
      url: typeof record.url === "string" ? record.url : "",
    };
  });
}

function toDrafts(
  texts: Record<ContentLocale, TemplateTextInitial>,
): Record<ContentLocale, TemplateDraft> {
  return Object.fromEntries(
    CONTENT_LOCALES.map((locale) => [
      locale,
      { ...texts[locale], tools: toTools(texts[locale].tools) },
    ]),
  ) as Record<ContentLocale, TemplateDraft>;
}

const TEXT_FIELDS = [
  { key: "title", multiline: false },
  { key: "purpose", multiline: true },
  { key: "prompt", multiline: true },
  { key: "example", multiline: true },
] as const;

// Шаблон на трёх языках. Сохраняется целиком: так проверяем, что [полей] во всех языках поровну.
export function TemplateEditor({ templateId, texts }: TemplateEditorProps) {
  const [drafts, setDrafts] = useState(() => toDrafts(texts));
  const [active, setActive] = useState<ContentLocale>("ru");
  const [saved, setSaved] = useState(() => JSON.stringify(toDrafts(texts)));
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const ids = useId();

  const dirty = JSON.stringify(drafts) !== saved;
  useUnsavedWarning(dirty);

  const fieldsByLocale = Object.fromEntries(
    CONTENT_LOCALES.map((locale) => [locale, getTemplateFields(drafts[locale].prompt)]),
  ) as Record<ContentLocale, string[]>;
  const mismatch = templateFieldsIssues(
    Object.fromEntries(CONTENT_LOCALES.map((locale) => [locale, drafts[locale].prompt])),
  );

  const draft = drafts[active];

  function update(patch: Partial<TemplateDraft>) {
    setDrafts((current) => ({
      ...current,
      [active]: { ...current[active], ...patch },
    }));
  }

  function updateTool(index: number, patch: Partial<Tool>) {
    update({
      tools: draft.tools.map((tool, i) => (i === index ? { ...tool, ...patch } : tool)),
    });
  }

  function handleSave() {
    setResult(null);
    const snapshot = drafts;
    startTransition(async () => {
      const response = await saveTemplate({ templateId, texts: snapshot });
      setResult(response);
      if (response.ok) setSaved(JSON.stringify(snapshot));
    });
  }

  return (
    <div className={styles.form}>
      <div className={styles.infoBox}>
        Слова в <strong>[квадратных скобках]</strong> — поля, которые человек заполнит сам
        (или AI-помощник по описанию ситуации). Названия полей переводятся, но их число
        должно быть одинаковым во всех языках.
      </div>

      <div className={styles.card}>
        <span className={styles.label}>[Поля] по языкам</span>
        {CONTENT_LOCALES.map((locale) => (
          <div key={locale} className={styles.toolbar}>
            <span className={styles.badge}>{locale}</span>
            {fieldsByLocale[locale].length === 0 ? (
              <span className={styles.caption}>нет полей</span>
            ) : (
              <span className={styles.badges}>
                {fieldsByLocale[locale].map((field) => (
                  <span key={field} className={`${styles.badge} ${styles.badgeOk}`}>
                    [{field}]
                  </span>
                ))}
              </span>
            )}
          </div>
        ))}
        {mismatch.length > 0 ? (
          <p className={styles.warningBox} role="status">
            {mismatch[0]}
          </p>
        ) : null}
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Язык шаблона">
        {CONTENT_LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            role="tab"
            aria-selected={active === locale}
            className={`${styles.tab} ${active === locale ? styles.tabActive : ""}`}
            onClick={() => setActive(locale)}
          >
            {CONTENT_LOCALE_NAMES[locale]}
          </button>
        ))}
      </div>

      <div className={styles.card} role="tabpanel">
        {TEXT_FIELDS.map(({ key, multiline }) => {
          const id = `${ids}-${active}-${key}`;
          return (
            <div key={key} className={styles.field}>
              <label className={styles.label} htmlFor={id}>
                {fieldLabel(key)} <span className={styles.required}>*</span>
              </label>
              {multiline ? (
                <textarea
                  id={id}
                  className={`${styles.input} ${styles.textarea}`}
                  value={draft[key]}
                  onChange={(event) => update({ [key]: event.target.value })}
                />
              ) : (
                <input
                  id={id}
                  className={styles.input}
                  value={draft[key]}
                  onChange={(event) => update({ [key]: event.target.value })}
                />
              )}
              {key === "prompt" ? (
                <span className={styles.caption}>
                  Например: «Объясни, что такое [тема], простыми словами».
                </span>
              ) : null}
            </div>
          );
        })}

        <fieldset className={styles.group}>
          <legend className={styles.groupTitle}>
            {fieldLabel("tools")} <span className={styles.required}>*</span>
          </legend>
          {draft.tools.map((tool, index) => (
            <div key={index} className={styles.twoColumns}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${ids}-${active}-tool-${index}-name`}>
                  {fieldLabel("name")}
                </label>
                <input
                  id={`${ids}-${active}-tool-${index}-name`}
                  className={styles.input}
                  value={tool.name}
                  onChange={(event) => updateTool(index, { name: event.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${ids}-${active}-tool-${index}-url`}>
                  {fieldLabel("url")}
                </label>
                <div className={styles.toolbar}>
                  <input
                    id={`${ids}-${active}-tool-${index}-url`}
                    className={styles.input}
                    value={tool.url}
                    placeholder="https://…"
                    onChange={(event) => updateTool(index, { url: event.target.value })}
                  />
                  <button
                    type="button"
                    className={`${styles.button} ${styles.buttonSmall} ${styles.buttonDanger}`}
                    onClick={() =>
                      update({ tools: draft.tools.filter((_, i) => i !== index) })
                    }
                    aria-label={`Удалить инструмент ${index + 1}`}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonSmall}`}
              onClick={() => update({ tools: [...draft.tools, { name: "", url: "" }] })}
            >
              + Инструмент
            </button>
          </div>
        </fieldset>
      </div>

      <div className={styles.saveBar}>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleSave}
          disabled={pending}
        >
          {pending ? "Сохраняем…" : "Сохранить все языки"}
        </button>
        <span className={styles.caption}>
          {dirty ? "Есть несохранённые правки" : "Всё сохранено"}
        </span>
      </div>
      <SaveResult result={result?.ok && dirty ? null : result} />
    </div>
  );
}
