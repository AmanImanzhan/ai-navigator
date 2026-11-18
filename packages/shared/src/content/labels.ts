import type { LessonCard } from "./types";

// Русские названия для админки сайта: типы карточек и поля. Ими же подписаны ошибки проверки.

export type LessonCardType = LessonCard["type"];

export const CARD_TYPES: readonly LessonCardType[] = [
  "result",
  "tool",
  "info",
  "howto",
  "quiz",
  "practice",
  "summary",
];

export const CARD_TYPE_LABELS: Record<LessonCardType, string> = {
  result: "Вот что получится",
  tool: "Какой инструмент",
  info: "Объяснение",
  howto: "Как сделать",
  quiz: "Проверка",
  practice: "Попробуй сам",
  summary: "Итог",
};

// Подписи полей. Ключ — имя поля в jsonb.
export const FIELD_LABELS: Record<string, string> = {
  skill: "Что человек умеет после урока",
  helperCriteria: "Критерии хорошего запроса (для AI-помощника)",
  cards: "Карточки",
  type: "Тип карточки",
  title: "Заголовок",
  text: "Текст",
  tools: "Инструменты",
  name: "Название",
  url: "Ссылка",
  label: "Метка",
  intro: "Вступление",
  layout: "Вид списка",
  items: "Пункты",
  note: "Примечание",
  situation: "Ситуация",
  question: "Вопрос",
  options: "Варианты ответа",
  correct: "Правильный",
  explanation: "Объяснение ответа",
  userPrompt: "Запрос человека",
  improvedLabel: "Подпись над улучшенным запросом",
  improvedPrompt: "Улучшенный запрос",
  share: "Кнопка «Поделиться»",
  message: "Текст для отправки",
  followUp: "Подсказка, что попросить дальше",
  hint: "Подсказка",
  prompt: "Запрос",
  formula: "Формула",
  purpose: "Для чего",
  example: "Пример результата",
};

export const HOWTO_LAYOUT_LABELS = {
  options: "Способы на выбор",
  steps: "Шаги по порядку",
  list: "Простой список",
} as const;

export function fieldLabel(key: string): string {
  return FIELD_LABELS[key] ?? key;
}
