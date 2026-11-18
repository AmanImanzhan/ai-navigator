"use client";

import { fieldLabel, type Json } from "@ai-navigator/shared";
import { useId } from "react";

import styles from "@/components/admin/admin.module.css";
import type { DraftRecord, FieldSpec } from "@/lib/admin/cardSpecs";

type FieldsProps = {
  specs: readonly FieldSpec[];
  value: DraftRecord;
  onChange: (value: DraftRecord) => void;
};

function isRecord(value: Json | undefined): value is DraftRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asText(value: Json | undefined): string {
  return typeof value === "string" ? value : "";
}

// Поля формы по описанию (lib/admin/cardSpecs.ts): текст, выбор, галочка, список, группа.
export function Fields({ specs, value, onChange }: FieldsProps) {
  function set(key: string, next: Json | undefined) {
    onChange({ ...value, [key]: next });
  }

  return (
    <>
      {specs.map((spec) => (
        <Field
          key={spec.key}
          spec={spec}
          value={value[spec.key]}
          onChange={(next) => set(spec.key, next)}
        />
      ))}
    </>
  );
}

type FieldProps = {
  spec: FieldSpec;
  value: Json | undefined;
  onChange: (value: Json | undefined) => void;
};

function Field({ spec, value, onChange }: FieldProps) {
  const id = useId();
  const label = fieldLabel(spec.key);

  switch (spec.kind) {
    case "text":
      return (
        <div className={styles.field}>
          <label className={styles.label} htmlFor={id}>
            {label}
            {spec.required ? <span className={styles.required}> *</span> : null}
          </label>
          {spec.multiline ? (
            <textarea
              id={id}
              className={`${styles.input} ${styles.textarea}`}
              value={asText(value)}
              onChange={(event) => onChange(event.target.value)}
            />
          ) : (
            <input
              id={id}
              className={styles.input}
              value={asText(value)}
              onChange={(event) => onChange(event.target.value)}
            />
          )}
          {spec.hint ? <span className={styles.caption}>{spec.hint}</span> : null}
        </div>
      );

    case "select":
      return (
        <div className={styles.field}>
          <label className={styles.label} htmlFor={id}>
            {label}
          </label>
          <select
            id={id}
            className={styles.input}
            value={asText(value)}
            onChange={(event) => onChange(event.target.value)}
          >
            {spec.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "checkbox":
      return (
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={value === true}
            onChange={(event) => onChange(event.target.checked)}
          />
          {label}
        </label>
      );

    case "group": {
      const group = isRecord(value) ? value : {};
      return (
        <fieldset className={styles.group}>
          <legend className={styles.groupTitle}>{label}</legend>
          {spec.hint ? <span className={styles.caption}>{spec.hint}</span> : null}
          <Fields specs={spec.fields} value={group} onChange={onChange} />
        </fieldset>
      );
    }

    case "list": {
      const items = Array.isArray(value) ? value : [];
      const update = (next: Json[]) => onChange(next);
      const move = (from: number, to: number) => {
        const next = [...items];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        update(next);
      };

      return (
        <fieldset className={styles.group}>
          <legend className={styles.groupTitle}>
            {label} <span className={styles.required}>*</span>
          </legend>
          {items.map((item, index) => (
            <div key={index} className={styles.group}>
              <div className={styles.listItemHeader}>
                <span className={styles.label}>
                  {spec.itemLabel} {index + 1}
                </span>
                <span className={styles.spacer} />
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonSmall}`}
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  aria-label={`${spec.itemLabel} ${index + 1}: выше`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonSmall}`}
                  onClick={() => move(index, index + 1)}
                  disabled={index === items.length - 1}
                  aria-label={`${spec.itemLabel} ${index + 1}: ниже`}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonSmall} ${styles.buttonDanger}`}
                  onClick={() => update(items.filter((_, i) => i !== index))}
                  aria-label={`Удалить: ${spec.itemLabel} ${index + 1}`}
                >
                  Удалить
                </button>
              </div>
              <Fields
                specs={spec.item}
                value={isRecord(item) ? item : {}}
                onChange={(next) =>
                  update(items.map((old, i) => (i === index ? next : old)))
                }
              />
            </div>
          ))}
          <div>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonSmall}`}
              onClick={() => update([...items, spec.newItem()])}
            >
              + {spec.itemLabel}
            </button>
          </div>
        </fieldset>
      );
    }
  }
}
