// Типы карточек урока. У каждого типа свои поля, общее — только `type`.

export type ResultCard = {
  type: "result";
  title: string;
  text: string;
};

export type ToolCard = {
  type: "tool";
  name: string;
  text: string;
};

export type HowtoMethod = {
  title: string;
  text: string;
};

export type HowtoCard = {
  type: "howto";
  methods: HowtoMethod[];
  tip: string;
};

export type QuizOption = {
  text: string;
  correct: boolean;
};

export type QuizCard = {
  type: "quiz";
  question: string;
  options: QuizOption[];
  explanation: string;
};

export type PracticeCard = {
  type: "practice";
  userPrompt: string;
  improvedPrompt: string;
  fixPrompt: string;
};

export type SummaryCard = {
  type: "summary";
  formula: string;
};

// Карточка урока — одна из шести. По полю `type` TypeScript понимает, какая именно.
export type LessonCard =
  | ResultCard
  | ToolCard
  | HowtoCard
  | QuizCard
  | PracticeCard
  | SummaryCard;

export type Lesson = {
  id: string;
  title: string;
  level: number;
  minutes: number;
  cards: LessonCard[];
};

export const LESSONS: Lesson[] = [
  {
    id: "4",
    title: "Открытка на праздник",
    level: 1,
    minutes: 7,
    cards: [
      {
        type: "result",
        title: "Открытка на юбилей мамы",
        text: "Весенние цветы, тёплые тона и ровная надпись «С юбилеем, мама!» — без ошибок в буквах.",
      },
      {
        type: "tool",
        name: "Ideogram",
        text: "Лучше всего справляется с надписями — около 10 бесплатных генераций в день. Если недоступен, подойдут Gemini или ChatGPT.",
      },
      {
        type: "howto",
        methods: [
          {
            title: "С нуля по описанию",
            text: "Опишите повод, стиль, цвета и точный текст надписи в кавычках.",
          },
          {
            title: "По своему фото",
            text: "В Gemini или ChatGPT загрузите фото мамы или цветов из сада и попросите сделать из него открытку с надписью.",
          },
        ],
        tip: "В обоих случаях пишите текст надписи дословно в кавычках, место и размер надписи, язык надписи.",
      },
      {
        type: "quiz",
        question: "Надпись вышла «С ЮБЕЛЕМ, МАМА». Почему?",
        options: [
          { text: "AI плохо знает русский язык", correct: false },
          {
            text: "Текст надписи не дали дословно, в кавычках",
            correct: true,
          },
          { text: "Нужна платная версия", correct: false },
        ],
        explanation:
          "Текст не дали дословно — AI сам придумал надпись и ошибся.",
      },
      {
        type: "practice",
        userPrompt: "открытка другу на день рождения",
        improvedPrompt:
          "Открытка на день рождения другу, стиль — яркий и весёлый, воздушные шары и конфетти. Надпись крупными буквами вверху: „С днём рождения, Саша!“ — по-русски, без ошибок",
        fixPrompt: "Исправь только надпись, остальное оставь как есть",
      },
      {
        type: "summary",
        formula:
          "Повод + стиль и цвета + точный текст в кавычках + где и каким размером надпись",
      },
    ],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}
