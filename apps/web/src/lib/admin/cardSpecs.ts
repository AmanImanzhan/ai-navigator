import {
  HOWTO_LAYOUT_LABELS,
  type Json,
  type LessonCardType,
} from "@ai-navigator/shared";

// Описание формы для каждого типа карточки урока: какие поля, обязательные ли, где списки.
// По нему components/admin/Fields.tsx рисует поля. Набор полей — как в
// packages/shared/src/content/types.ts; правила проверки — в content/validate.ts.

// Черновик из формы: пока человек печатает, в нём могут быть пустые строки.
export type DraftRecord = { [key: string]: Json | undefined };

export type FieldSpec =
  | {
      kind: "text";
      key: string;
      required?: boolean;
      multiline?: boolean;
      hint?: string;
    }
  | {
      kind: "select";
      key: string;
      options: readonly { value: string; label: string }[];
    }
  | { kind: "checkbox"; key: string }
  | {
      kind: "list";
      key: string;
      // Подпись пункта: «Вариант 1», «Шаг 2».
      itemLabel: string;
      item: readonly FieldSpec[];
      newItem: () => DraftRecord;
    }
  // Необязательный объект: «Поделиться», «Что попросить дальше». Пустой — уберётся при сохранении.
  | { kind: "group"; key: string; fields: readonly FieldSpec[]; hint?: string };

const share: FieldSpec = {
  kind: "group",
  key: "share",
  hint: "Необязательно. Оставьте пустым — кнопки не будет.",
  fields: [
    { kind: "text", key: "label", required: true },
    { kind: "text", key: "message", required: true, multiline: true },
  ],
};

const toolList: FieldSpec = {
  kind: "list",
  key: "tools",
  itemLabel: "Инструмент",
  item: [
    { kind: "text", key: "name", required: true },
    { kind: "text", key: "url", required: true, hint: "https://…" },
  ],
  newItem: () => ({ name: "", url: "" }),
};

export const CONTENT_SPECS: readonly FieldSpec[] = [
  {
    kind: "text",
    key: "skill",
    multiline: true,
    hint: "Показывается на экране «Урок пройден» и подсказывает AI-помощнику цель урока.",
  },
  {
    kind: "text",
    key: "helperCriteria",
    multiline: true,
    hint: "По ним AI-помощник разбирает запрос в «Попробуй сам».",
  },
];

export const CARD_SPECS: Record<LessonCardType, readonly FieldSpec[]> = {
  result: [
    { kind: "text", key: "title" },
    { kind: "text", key: "text", required: true, multiline: true },
  ],
  tool: [toolList, { kind: "text", key: "text", required: true, multiline: true }],
  info: [
    { kind: "text", key: "label", required: true, hint: "Например, «Что важно знать»." },
    { kind: "text", key: "title" },
    { kind: "text", key: "text", required: true, multiline: true },
  ],
  howto: [
    { kind: "text", key: "label", hint: "Своя метка вместо «Как сделать»." },
    { kind: "text", key: "intro", hint: "Например, «Три способа:»." },
    {
      kind: "select",
      key: "layout",
      options: Object.entries(HOWTO_LAYOUT_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      kind: "list",
      key: "items",
      itemLabel: "Пункт",
      item: [
        { kind: "text", key: "title" },
        { kind: "text", key: "text", required: true, multiline: true },
      ],
      newItem: () => ({ text: "" }),
    },
    { kind: "text", key: "note", multiline: true },
  ],
  quiz: [
    { kind: "text", key: "situation", required: true, multiline: true },
    { kind: "text", key: "question", required: true },
    {
      kind: "list",
      key: "options",
      itemLabel: "Вариант",
      item: [
        { kind: "text", key: "text", required: true },
        { kind: "checkbox", key: "correct" },
      ],
      newItem: () => ({ text: "", correct: false }),
    },
    { kind: "text", key: "explanation", required: true, multiline: true },
  ],
  practice: [
    { kind: "text", key: "userPrompt", multiline: true },
    { kind: "text", key: "improvedLabel", hint: "Своя подпись вместо «Лучше так:»." },
    {
      kind: "text",
      key: "improvedPrompt",
      multiline: true,
      hint: "С него AI-помощник начинает в приложении («Спросите AI прямо здесь»).",
    },
    share,
    {
      kind: "group",
      key: "followUp",
      hint: "Необязательно: «Доработка: „Сделай чуть формальнее“».",
      fields: [
        { kind: "text", key: "hint", required: true },
        { kind: "text", key: "prompt", required: true },
      ],
    },
    { kind: "text", key: "note", multiline: true },
  ],
  summary: [
    { kind: "text", key: "formula", required: true, multiline: true },
    { kind: "text", key: "text", multiline: true },
    share,
  ],
};

// Новая карточка с пустыми обязательными полями.
export function newCard(type: LessonCardType): DraftRecord {
  switch (type) {
    case "result":
      return { type, text: "" };
    case "tool":
      return { type, tools: [{ name: "", url: "" }], text: "" };
    case "info":
      return { type, label: "", text: "" };
    case "howto":
      return { type, layout: "steps", items: [{ text: "" }] };
    case "quiz":
      return {
        type,
        situation: "",
        question: "",
        options: [
          { text: "", correct: true },
          { text: "", correct: false },
        ],
        explanation: "",
      };
    case "practice":
      return { type };
    case "summary":
      return { type, formula: "" };
  }
}
