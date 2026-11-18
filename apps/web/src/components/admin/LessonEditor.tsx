"use client";

import {
  CARD_TYPE_LABELS,
  CARD_TYPES,
  type Json,
  type LessonCardType,
} from "@ai-navigator/shared";
import { useId, useState, useTransition } from "react";

import styles from "@/components/admin/admin.module.css";
import { Fields } from "@/components/admin/Fields";
import { SaveResult } from "@/components/admin/SaveResult";
import { useUnsavedWarning } from "@/components/admin/useUnsavedWarning";
import { saveLessonTranslation, type ActionResult } from "@/lib/admin/actions";
import {
  CARD_SPECS,
  CONTENT_SPECS,
  newCard,
  type DraftRecord,
} from "@/lib/admin/cardSpecs";
import {
  CONTENT_LOCALE_NAMES,
  CONTENT_LOCALES,
  type ContentLocale,
} from "@/lib/admin/locales";

export type LessonLocaleInitial = {
  title: string;
  content: Json | null;
  note: string;
};

type LessonEditorsProps = {
  lessonId: string;
  locales: Record<ContentLocale, LessonLocaleInitial>;
};

// Урок на трёх языках: вкладки ru / en / es. Черновики всех вкладок живут одновременно —
// переключение вкладки ничего не теряет. Каждый язык сохраняется своей кнопкой.
export function LessonEditors({ lessonId, locales }: LessonEditorsProps) {
  const [active, setActive] = useState<ContentLocale>("ru");
  const tabsId = useId();

  return (
    <div className={styles.section}>
      <div className={styles.tabs} role="tablist" aria-label="Язык урока">
        {CONTENT_LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            role="tab"
            id={`${tabsId}-${locale}`}
            aria-selected={active === locale}
            className={`${styles.tab} ${active === locale ? styles.tabActive : ""}`}
            onClick={() => setActive(locale)}
          >
            {CONTENT_LOCALE_NAMES[locale]}
          </button>
        ))}
      </div>
      {CONTENT_LOCALES.map((locale) => (
        <div
          key={locale}
          role="tabpanel"
          aria-labelledby={`${tabsId}-${locale}`}
          hidden={active !== locale}
        >
          <LessonEditor
            lessonId={lessonId}
            locale={locale}
            initial={locales[locale]}
            english={locales.en.content}
          />
        </div>
      ))}
    </div>
  );
}

function isRecord(value: Json | undefined): value is DraftRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toDraft(content: Json | null): DraftRecord | null {
  if (content === null) return null;
  return isRecord(content) ? content : { cards: [] };
}

function cardsOf(draft: DraftRecord): DraftRecord[] {
  return Array.isArray(draft.cards) ? draft.cards.filter(isRecord) : [];
}

type LessonEditorProps = {
  lessonId: string;
  locale: ContentLocale;
  initial: LessonLocaleInitial;
  // Карточки на английском — чтобы начать перевод с копии.
  english: Json | null;
};

type Mode = "form" | "json";

function LessonEditor({ lessonId, locale, initial, english }: LessonEditorProps) {
  const [title, setTitle] = useState(initial.title);
  const [note, setNote] = useState(initial.note);
  const [content, setContent] = useState<DraftRecord | null>(() =>
    toDraft(initial.content),
  );
  const [mode, setMode] = useState<Mode>("form");
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const [newType, setNewType] = useState<LessonCardType>("result");
  const ids = useId();

  // Что сохранено в базе — чтобы понять, есть ли несохранённые правки.
  const [saved, setSaved] = useState(() =>
    JSON.stringify({ title: initial.title, note: initial.note, content: toDraft(initial.content) }),
  );
  const dirty =
    mode === "json" ||
    JSON.stringify({ title, note, content }) !== saved;
  useUnsavedWarning(dirty);

  // JSON → форма. Ошибка разбора — остаёмся в JSON и показываем, что не так.
  function parseJson(): DraftRecord | null | undefined {
    try {
      const parsed: Json = JSON.parse(jsonText);
      if (parsed !== null && !isRecord(parsed)) {
        setJsonError("Нужен объект { \"cards\": [ … ] } или null.");
        return undefined;
      }
      setJsonError(null);
      return parsed;
    } catch (error) {
      setJsonError(
        `Это не JSON: ${error instanceof Error ? error.message : "ошибка разбора"}`,
      );
      return undefined;
    }
  }

  function switchMode(next: Mode) {
    if (next === mode) return;
    if (next === "json") {
      setJsonText(JSON.stringify(content, null, 2));
      setJsonError(null);
      setMode("json");
      return;
    }
    const parsed = parseJson();
    if (parsed === undefined) return;
    setContent(parsed);
    setMode("form");
  }

  function handleSave() {
    let toSave = content;
    if (mode === "json") {
      const parsed = parseJson();
      if (parsed === undefined) return;
      toSave = parsed;
      setContent(parsed);
    }
    setResult(null);
    startTransition(async () => {
      const response = await saveLessonTranslation({
        lessonId,
        locale,
        title,
        note,
        content: toSave,
      });
      setResult(response);
      if (response.ok) {
        setSaved(JSON.stringify({ title, note, content: toSave }));
        if (mode === "json") setMode("form");
      }
    });
  }

  const cards = content ? cardsOf(content) : [];

  function setCards(next: DraftRecord[]) {
    if (content) setContent({ ...content, cards: next });
  }

  function moveCard(from: number, to: number) {
    const next = [...cards];
    const [card] = next.splice(from, 1);
    next.splice(to, 0, card);
    setCards(next);
  }

  return (
    <div className={styles.form}>
      <div className={styles.card}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${ids}-title`}>
            Название урока <span className={styles.required}>*</span>
          </label>
          <input
            id={`${ids}-title`}
            className={styles.input}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${ids}-note`}>
            Заметка для шаблонов урока
          </label>
          <textarea
            id={`${ids}-note`}
            className={`${styles.input} ${styles.textarea}`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <span className={styles.caption}>
            Показывается над шаблонами этого урока, например «Закройте номера счетов».
            Пусто — заметки нет.
          </span>
        </div>
      </div>

      {content === null ? (
        <div className={styles.infoBox}>
          <p>
            На этом языке карточек нет — приложение покажет урок на английском.
          </p>
          <div className={styles.toolbar}>
            {english !== null && locale !== "en" ? (
              <button
                type="button"
                className={styles.button}
                onClick={() => setContent(toDraft(english))}
              >
                Скопировать карточки с английского
              </button>
            ) : null}
            <button
              type="button"
              className={styles.button}
              onClick={() => setContent({ cards: [newCard("result")] })}
            >
              Начать с пустого
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.toolbar}>
            <h2 className={styles.sectionTitle}>Карточки</h2>
            <span className={styles.spacer} />
            <div className={styles.tabs} role="group" aria-label="Режим редактора">
              <button
                type="button"
                className={`${styles.tab} ${mode === "form" ? styles.tabActive : ""}`}
                aria-pressed={mode === "form"}
                onClick={() => switchMode("form")}
              >
                Форма
              </button>
              <button
                type="button"
                className={`${styles.tab} ${mode === "json" ? styles.tabActive : ""}`}
                aria-pressed={mode === "json"}
                onClick={() => switchMode("json")}
              >
                JSON
              </button>
            </div>
          </div>

          {mode === "json" ? (
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${ids}-json`}>
                Содержимое урока в JSON (запасной вариант — проверка та же)
              </label>
              <textarea
                id={`${ids}-json`}
                className={`${styles.input} ${styles.textarea} ${styles.code}`}
                value={jsonText}
                onChange={(event) => setJsonText(event.target.value)}
                spellCheck={false}
              />
              {jsonError ? (
                <p className={styles.errorBox} role="alert">
                  {jsonError}
                </p>
              ) : null}
            </div>
          ) : (
            <>
              <div className={styles.card}>
                <Fields specs={CONTENT_SPECS} value={content} onChange={setContent} />
              </div>

              {cards.map((card, index) => {
                const type = card.type;
                const known =
                  typeof type === "string" &&
                  Object.prototype.hasOwnProperty.call(CARD_SPECS, type);
                return (
                  <section key={index} className={styles.lessonCard}>
                    <div className={styles.lessonCardHeader}>
                      <h3 className={styles.lessonCardTitle}>
                        {index + 1}.{" "}
                        {known
                          ? CARD_TYPE_LABELS[type as LessonCardType]
                          : `Неизвестный тип «${String(type)}»`}
                      </h3>
                      <button
                        type="button"
                        className={`${styles.button} ${styles.buttonSmall}`}
                        onClick={() => moveCard(index, index - 1)}
                        disabled={index === 0}
                        aria-label={`Карточка ${index + 1}: выше`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className={`${styles.button} ${styles.buttonSmall}`}
                        onClick={() => moveCard(index, index + 1)}
                        disabled={index === cards.length - 1}
                        aria-label={`Карточка ${index + 1}: ниже`}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className={`${styles.button} ${styles.buttonSmall} ${styles.buttonDanger}`}
                        onClick={() => {
                          if (window.confirm(`Удалить карточку ${index + 1}?`)) {
                            setCards(cards.filter((_, i) => i !== index));
                          }
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                    {known ? (
                      <Fields
                        specs={CARD_SPECS[type as LessonCardType]}
                        value={card}
                        onChange={(next) =>
                          setCards(cards.map((old, i) => (i === index ? next : old)))
                        }
                      />
                    ) : (
                      <p className={styles.warningBox}>
                        Приложение не умеет показывать такую карточку. Исправьте её в режиме
                        JSON или удалите.
                      </p>
                    )}
                  </section>
                );
              })}

              <div className={styles.toolbar}>
                <label className={styles.label} htmlFor={`${ids}-new`}>
                  Новая карточка:
                </label>
                <select
                  id={`${ids}-new`}
                  className={`${styles.input} ${styles.inputInline}`}
                  value={newType}
                  onChange={(event) => setNewType(event.target.value as LessonCardType)}
                >
                  {CARD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {CARD_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => setCards([...cards, newCard(newType)])}
                >
                  + Добавить в конец
                </button>
              </div>
            </>
          )}
        </>
      )}

      <div className={styles.saveBar}>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleSave}
          disabled={pending}
        >
          {pending ? "Сохраняем…" : `Сохранить (${locale})`}
        </button>
        <span className={styles.caption}>
          {dirty ? "Есть несохранённые правки" : "Всё сохранено"}
        </span>
      </div>
      {/* «Сохранено» прячется при следующей правке, ошибки остаются до нового сохранения. */}
      <SaveResult result={result?.ok && dirty ? null : result} />
    </div>
  );
}
