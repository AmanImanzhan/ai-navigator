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
  url: string;
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
  situation: string;
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

// Содержимое урока: что человек умеет после него и карточки.
export type LessonContent = {
  // Показываем на экране победы.
  skill: string;
  cards: LessonCard[];
};

export type Lesson = {
  id: string;
  title: string;
  level: 1 | 2;
  minutes: number;
  // Нет содержимого — урок «скоро».
  content?: LessonContent;
};

// Направление: тексты, картинки, видео… Платное — только по подписке.
export type Track = {
  id: string;
  title: string;
  premium: boolean;
  lessons: Lesson[];
};

// available — можно открыть; soon — ещё нет содержимого; premium — по подписке.
export type LessonStatus = "available" | "completed" | "soon" | "premium";

const POSTCARD: LessonContent = {
  skill:
    "Теперь вы умеете делать открытку с точной надписью — без ошибок в буквах",
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
      url: "https://ideogram.ai",
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
      situation: "Надпись вышла «С ЮБЕЛЕМ, МАМА».",
      question: "Почему так вышло?",
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
};

// Короткая запись урока. Время у всех уроков пока 7 минут.
function lesson(
  id: string,
  title: string,
  level: 1 | 2,
  content?: LessonContent,
): Lesson {
  return { id, title, level, minutes: 7, content };
}

export const TRACKS: Track[] = [
  {
    id: "texts",
    title: "Тексты",
    premium: false,
    lessons: [
      lesson("1", "Как задать вопрос, чтобы получить точный ответ", 1),
      lesson("2", "Письмо или поздравление за 2 минуты", 1),
      lesson("3", "Разобраться в сложном документе", 2),
    ],
  },
  {
    id: "images",
    title: "Картинки",
    premium: false,
    lessons: [
      lesson("4", "Открытка на праздник", 1, POSTCARD),
      lesson("5", "Портрет или аватар в любом стиле", 1),
      lesson("6", "Логотип для маленького бизнеса", 2),
    ],
  },
  {
    id: "video",
    title: "Видео",
    premium: false,
    lessons: [
      lesson("7", "Оживить старую семейную фотографию", 1),
      lesson("8", "Видеопоздравление", 2),
      lesson("9", "Короткий ролик для соцсетей", 2),
    ],
  },
  {
    id: "voice",
    title: "Голос и перевод",
    premium: false,
    lessons: [
      lesson("10", "Перевод разговора в поездке", 1),
      lesson("11", "Озвучить текст голосом", 2),
      lesson("12", "Расшифровать голосовое сообщение или запись", 2),
    ],
  },
  {
    id: "safety",
    title: "Безопасность",
    premium: false,
    lessons: [
      lesson("13", "Звонок „родственника“ в беде", 1),
      lesson("14", "Поддельные фото и видео", 2),
      lesson("15", "Что нельзя рассказывать AI", 1),
    ],
  },
  {
    id: "work",
    title: "Работа",
    premium: true,
    lessons: [
      lesson("16", "Таблица с формулами без знания Excel", 1),
      lesson("17", "Протокол встречи из записи разговора", 1),
      lesson("18", "Деловое письмо за минуту", 1),
      lesson("19", "Выжимка из длинного отчёта", 1),
      lesson("20", "Подготовка к встрече с командой", 1),
      lesson("21", "Постановка задачи сотруднику", 1),
    ],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return TRACKS.flatMap((track) => track.lessons).find(
    (item) => item.id === id,
  );
}

// Пройденный урок важнее всего: его можно открыть снова.
// «Подписка» важнее «Скоро»: пусть человек сразу видит, что направление платное.
export function getLessonStatus(
  lesson: Lesson,
  track: Track,
  completed: boolean,
): LessonStatus {
  if (completed) return "completed";
  if (track.premium) return "premium";
  if (!lesson.content) return "soon";
  return "available";
}

// Инструмент урока — из его карточки tool. Нужен, например, практике для кнопки «Открыть …».
export function getLessonTool(content: LessonContent): ToolCard | undefined {
  return content.cards.find((card) => card.type === "tool");
}
