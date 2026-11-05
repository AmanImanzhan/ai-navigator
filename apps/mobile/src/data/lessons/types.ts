import type { LanguageCode } from "@/data/onboarding";

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

// ---------- Структура: одинакова для всех языков ----------

export type Locale = LanguageCode;

export type TrackId =
  | "texts"
  | "images"
  | "video"
  | "voice"
  | "safety"
  | "work-admin"
  | "work-management";

export type LessonId =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21";

export type LessonLevel = 1 | 2 | 3;

export type LessonData = {
  id: LessonId;
  level: LessonLevel;
  minutes: number;
};

export type TrackData = {
  id: TrackId;
  premium: boolean;
  lessons: LessonData[];
};

// ---------- Тексты на одном языке (файлы ru.ts, en.ts, es.ts) ----------

// Урок на одном языке = будущая строка lesson_translations (lesson_id, locale, title, content).
// Нет content — урока на этом языке ещё нет.
export type LessonTranslation = {
  title: string;
  content?: LessonContent;
};

// Record требует все id: забыть название урока или направления не получится.
export type LocaleLessons = {
  tracks: Record<TrackId, string>;
  lessons: Record<LessonId, LessonTranslation>;
};

// ---------- Урок на одном языке — с ним работают экраны ----------

export type Lesson = {
  id: LessonId;
  title: string;
  level: LessonLevel;
  minutes: number;
  // Нет содержимого — урок «скоро».
  content?: LessonContent;
};

// Направление: тексты, картинки, видео… Платное — только по подписке.
export type Track = {
  id: TrackId;
  title: string;
  premium: boolean;
  lessons: Lesson[];
};

// available — можно открыть; completed — пройден; soon — ещё нет содержимого; premium — по подписке.
export type LessonStatus = "available" | "completed" | "soon" | "premium";
