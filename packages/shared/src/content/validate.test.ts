import { describe, expect, it } from "vitest";

import { getTemplateFields } from "../templates";
import {
  cleanContent,
  isLessonContent,
  isToolList,
  lessonContentIssues,
  templateFieldsIssues,
  templateTextIssues,
  type TemplateTextInput,
} from "./validate";

type RawLesson = { skill: string; cards: Record<string, unknown>[] };

// Урок со всеми семью типами карточек — всё заполнено правильно.
function validLesson(): RawLesson {
  return {
    skill: "Писать письма с ИИ",
    cards: [
      { type: "result", text: "Готовое письмо за минуту" },
      {
        type: "tool",
        tools: [{ name: "ChatGPT", url: "https://chatgpt.com" }],
        text: "Подойдёт любой чат-бот",
      },
      { type: "info", label: "Важно", text: "Не вставляйте пароли" },
      { type: "howto", layout: "steps", items: [{ text: "Откройте чат" }] },
      {
        type: "quiz",
        situation: "Нужно письмо",
        question: "Что написать?",
        options: [
          { text: "Подробный запрос", correct: true },
          { text: "Одно слово", correct: false },
        ],
        explanation: "Чем подробнее, тем лучше",
      },
      { type: "practice", userPrompt: "Напиши письмо" },
      { type: "summary", formula: "Роль + задача + формат" },
    ],
  };
}

function validTemplate(): TemplateTextInput {
  return {
    title: "Письмо",
    purpose: "Написать письмо",
    prompt: "Напиши письмо для [кому] о [тема]",
    example: "Напиши письмо для начальника о отпуске",
    tools: [{ name: "Claude", url: "https://claude.ai" }],
  };
}

describe("lessonContentIssues", () => {
  it("accepts a lesson with every card type", () => {
    expect(lessonContentIssues(validLesson())).toEqual([]);
    expect(isLessonContent(validLesson())).toBe(true);
  });

  it("rejects non-objects and lessons without cards", () => {
    expect(lessonContentIssues(null)).toHaveLength(1);
    expect(lessonContentIssues([])).toHaveLength(1);
    expect(lessonContentIssues({ cards: [] })).toEqual(["в уроке нет ни одной карточки"]);
  });

  it("rejects an unknown card type (the app could not draw it)", () => {
    const lesson = { cards: [{ type: "video", url: "x" }] };
    expect(lessonContentIssues(lesson)).toEqual(["Карточка 1: неизвестный тип карточки «video»"]);
    expect(isLessonContent(lesson)).toBe(false);
  });

  it("points to the exact card and field", () => {
    const lesson = validLesson();
    lesson.cards[2] = { type: "info", label: "Важно", text: "" };
    expect(lessonContentIssues(lesson)).toEqual([
      "Карточка 3 («Объяснение»): не заполнено поле «Текст»",
    ]);
  });

  it("requires at least one correct quiz answer", () => {
    const lesson = validLesson();
    lesson.cards[4] = {
      type: "quiz",
      situation: "s",
      question: "q",
      options: [{ text: "a", correct: false }],
      explanation: "e",
    };
    expect(lessonContentIssues(lesson)).toContain(
      "Карточка 5 («Проверка»): нет ни одного правильного варианта ответа",
    );
  });

  it("checks howto layout and tool links", () => {
    const lesson = validLesson();
    lesson.cards[1] = { type: "tool", tools: [{ name: "", url: "https://x.y" }], text: "t" };
    lesson.cards[3] = { type: "howto", layout: "grid", items: [{ text: "a" }] };
    const issues = lessonContentIssues(lesson);
    expect(issues).toHaveLength(2);
    expect(issues[0]).toMatch(/^Карточка 2 .* пункт 1: не заполнено поле «Название»$/);
    expect(issues[1]).toMatch(/^Карточка 4 .*: не выбран «Вид списка»$/);
  });

  it("rejects tool links that are not http(s): the app could not open them", () => {
    const lesson = validLesson();
    lesson.cards[1] = { type: "tool", tools: [{ name: "Chat", url: "chatgpt.com" }], text: "t" };
    expect(lessonContentIssues(lesson)).toEqual([
      "Карточка 2 («Какой инструмент») → Инструменты → пункт 1: ссылка должна начинаться с https://",
    ]);
  });

  it("optional fields: absent is fine, empty string is not", () => {
    const lesson = validLesson();
    lesson.cards[0] = { type: "result", title: "", text: "t" };
    expect(lessonContentIssues(lesson)).toHaveLength(1);
  });
});

describe("cleanContent", () => {
  it("removes empty strings and empty objects before validation", () => {
    expect(
      cleanContent({
        type: "summary",
        formula: "f",
        text: "  ",
        share: { label: "", message: "" },
      }),
    ).toEqual({ type: "summary", formula: "f" });
  });

  it("keeps empty list items so validation can report them", () => {
    expect(cleanContent({ items: [{ text: "" }, { text: "a" }] })).toEqual({
      items: [{}, { text: "a" }],
    });
  });

  it("a cleaned form with an untouched optional block becomes valid", () => {
    const lesson = validLesson();
    const withEmptyShare: RawLesson = {
      ...lesson,
      cards: [...lesson.cards, { type: "summary", formula: "f", share: { label: "", message: "" } }],
    };
    expect(lessonContentIssues(withEmptyShare)).not.toEqual([]);
    expect(lessonContentIssues(cleanContent(withEmptyShare))).toEqual([]);
  });
});

describe("templates", () => {
  it("accepts a complete template", () => {
    expect(templateTextIssues(validTemplate())).toEqual([]);
  });

  it("requires every text, at least one https tool and one [field]", () => {
    const issues = templateTextIssues({
      ...validTemplate(),
      title: "",
      prompt: "Без полей",
      tools: [{ name: "Bad", url: "javascript:alert(1)" }],
    });
    expect(issues).toEqual([
      "не заполнено поле «Заголовок»",
      "Инструменты → пункт 1: ссылка должна начинаться с https://",
      "в запросе нет ни одного поля в [квадратных скобках]",
    ]);
    expect(templateTextIssues({ ...validTemplate(), tools: [] })).toEqual([
      "Инструменты: нужен хотя бы один пункт",
    ]);
  });

  it("all languages must have the same number of [fields]", () => {
    expect(templateFieldsIssues({ en: "[a] [b]", ru: "[а] [б]", es: "[x] [y]" })).toEqual([]);
    const issues = templateFieldsIssues({ en: "[topic]", ru: "[тема] [кому]" });
    expect(issues).toHaveLength(1);
    expect(issues[0]).toContain("en — 1 ([topic])");
  });

  it("getTemplateFields: in order, without repeats", () => {
    expect(getTemplateFields("[имя], привет! [тема] … [имя]")).toEqual(["имя", "тема"]);
    expect(getTemplateFields("нет полей")).toEqual([]);
  });

  it("isToolList: non-empty list of name + url", () => {
    expect(isToolList([{ name: "A", url: "https://a" }])).toBe(true);
    expect(isToolList([])).toBe(false);
    expect(isToolList([{ name: "A" }])).toBe(false);
  });
});
