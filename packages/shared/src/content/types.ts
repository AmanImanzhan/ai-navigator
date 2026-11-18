// Карточки урока — общие типы для приложения и админки сайта.
// Их хранит jsonb-колонка lesson_translations.content (тип LessonContent).

// ---------- Карточки урока. У каждого типа свои поля, общее — только `type` ----------

// «Вот что получится». Заголовка может не быть — тогда только текст.
export type ResultCard = {
  type: "result";
  title?: string;
  text: string;
};

// Инструмент и ссылка на его официальный сайт.
export type ToolLink = {
  name: string;
  url: string;
};

// «Какой инструмент». В одном уроке может быть несколько инструментов.
export type ToolCard = {
  type: "tool";
  tools: ToolLink[];
  text: string;
};

// Объяснение без инструмента, например «Что важно знать» в уроках о безопасности.
export type InfoCard = {
  type: "info";
  label: string;
  title?: string;
  text: string;
};

export type HowtoItem = {
  title?: string;
  text: string;
};

// options — способы на выбор; steps — шаги по порядку; list — простой список.
export type HowtoLayout = "options" | "steps" | "list";

export type HowtoCard = {
  type: "howto";
  // Своя метка вместо «Как сделать», например «Что делать».
  label?: string;
  // Вступление перед списком: «Три способа:».
  intro?: string;
  layout: HowtoLayout;
  items: HowtoItem[];
  // Текст после списка: совет, предупреждение.
  note?: string;
};

export type QuizOption = {
  text: string;
  correct: boolean;
};

// Варианты в данных идут в любом порядке — на экране они перемешиваются.
export type QuizCard = {
  type: "quiz";
  situation: string;
  question: string;
  options: QuizOption[];
  explanation: string;
};

// Подсказка, что попросить дальше: «Доработка: „Сделай чуть формальнее“».
export type PracticeFollowUp = {
  hint: string;
  prompt: string;
};

// Кнопка «Поделиться»: подпись и текст, который уйдёт в системное окно отправки.
export type ShareAction = {
  label: string;
  message: string;
};

// «Попробуй сам». Всё необязательно: в разных уроках практика устроена по-разному.
export type PracticeCard = {
  type: "practice";
  userPrompt?: string;
  // Своя подпись над улучшенным текстом вместо «Лучше так:».
  improvedLabel?: string;
  improvedPrompt?: string;
  share?: ShareAction;
  followUp?: PracticeFollowUp;
  note?: string;
};

export type SummaryCard = {
  type: "summary";
  formula: string;
  // Текст после формулы.
  text?: string;
  share?: ShareAction;
};

// Карточка урока — одна из семи. По полю `type` TypeScript понимает, какая именно.
export type LessonCard =
  | ResultCard
  | ToolCard
  | InfoCard
  | HowtoCard
  | QuizCard
  | PracticeCard
  | SummaryCard;

// Содержимое урока на одном языке.
export type LessonContent = {
  // Что человек умеет после урока — показываем на экране победы.
  skill?: string;
  // Что должно быть в хорошем запросе. Понадобится AI-помощнику.
  helperCriteria?: string;
  cards: LessonCard[];
};
