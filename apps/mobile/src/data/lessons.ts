import type { LanguageCode } from "@/data/onboarding";

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

// Содержимое урока на одном языке: что человек умеет после него и карточки.
export type LessonContent = {
  // Показываем на экране победы.
  skill: string;
  cards: LessonCard[];
};

// ---------- Данные на всех языках (позже переедут в базу) ----------

export type Locale = LanguageCode;

// Короткий текст сразу на трёх языках: названия уроков и направлений.
export type LocalizedText = Record<Locale, string>;

// Урок на всех языках. Один язык одного урока = будущая строка таблицы
// lesson_translations (lesson_id, locale, title, content).
export type LessonData = {
  id: string;
  title: LocalizedText;
  level: 1 | 2;
  minutes: number;
  // Нет содержимого — урок «скоро».
  content?: Record<Locale, LessonContent>;
};

export type TrackData = {
  id: string;
  title: LocalizedText;
  premium: boolean;
  lessons: LessonData[];
};

// ---------- Урок на одном языке — с ним работают экраны ----------

export type Lesson = {
  id: string;
  title: string;
  level: 1 | 2;
  minutes: number;
  content?: LessonContent;
};

// Направление: тексты, картинки, видео… Платное — только по подписке.
export type Track = {
  id: string;
  title: string;
  premium: boolean;
  lessons: Lesson[];
};

// available — можно открыть; completed — пройден; soon — ещё нет содержимого; premium — по подписке.
export type LessonStatus = "available" | "completed" | "soon" | "premium";

// ---------- Урок 4: открытка ----------

const POSTCARD: Record<Locale, LessonContent> = {
  ru: {
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
  },
  en: {
    skill:
      "Now you can make a card with exactly the words you want — and no typos",
    cards: [
      {
        type: "result",
        title: "A birthday card for Mom",
        text: "Spring flowers, warm colors and a neat “Happy Birthday, Mom!” — with every letter in the right place.",
      },
      {
        type: "tool",
        name: "Ideogram",
        text: "It's the best at putting text on images — about 10 free pictures a day. If it doesn't work for you, try Gemini or ChatGPT.",
        url: "https://ideogram.ai",
      },
      {
        type: "howto",
        methods: [
          {
            title: "From a description",
            text: "Describe the occasion, the style, the colors and the exact words, in quotes.",
          },
          {
            title: "From your own photo",
            text: "Upload a photo of Mom or of flowers from the garden to Gemini or ChatGPT and ask it to turn it into a card with a greeting.",
          },
        ],
        tip: "Either way, write the greeting word for word in quotes, and say where it goes, how big it should be and what language it's in.",
      },
      {
        type: "quiz",
        situation: "The card came out saying “HAPPY BRITHDAY, MOM”.",
        question: "Why did that happen?",
        options: [
          { text: "AI isn't good at English", correct: false },
          {
            text: "The exact words weren't given in quotes",
            correct: true,
          },
          { text: "You need the paid version", correct: false },
        ],
        explanation:
          "Nobody gave it the exact words, so the AI made up its own text — and got it wrong.",
      },
      {
        type: "practice",
        userPrompt: "birthday card for a friend",
        improvedPrompt:
          "Birthday card for a friend, bright and fun style, balloons and confetti. Big letters at the top: “Happy Birthday, Sam!” — in English, spelled correctly",
        fixPrompt: "Fix only the text and keep everything else the same",
      },
      {
        type: "summary",
        formula:
          "Occasion + style and colors + exact words in quotes + where the text goes and how big",
      },
    ],
  },
  es: {
    skill:
      "Ya sabes hacer una tarjeta con el texto exacto que quieres, sin errores en las letras",
    cards: [
      {
        type: "result",
        title: "Una tarjeta de cumpleaños para mamá",
        text: "Flores de primavera, colores cálidos y un «¡Feliz cumpleaños, mamá!» bien escrito, sin errores en las letras.",
      },
      {
        type: "tool",
        name: "Ideogram",
        text: "Es la que mejor pone textos en las imágenes: unas 10 imágenes gratis al día. Si no te funciona, prueba con Gemini o ChatGPT.",
        url: "https://ideogram.ai",
      },
      {
        type: "howto",
        methods: [
          {
            title: "A partir de una descripción",
            text: "Describe la ocasión, el estilo, los colores y el texto exacto entre comillas.",
          },
          {
            title: "A partir de tu propia foto",
            text: "Sube a Gemini o ChatGPT una foto de mamá o de las flores del jardín y pídele que la convierta en una tarjeta con un mensaje.",
          },
        ],
        tip: "En los dos casos, escribe el texto palabra por palabra y entre comillas, y di dónde va, de qué tamaño y en qué idioma.",
      },
      {
        type: "quiz",
        situation: "La tarjeta salió con el texto «FELIZ CUMPLAÑOS, MAMÁ».",
        question: "¿Por qué pasó esto?",
        options: [
          { text: "La IA no sabe bien español", correct: false },
          {
            text: "No le diste el texto exacto entre comillas",
            correct: true,
          },
          { text: "Hace falta la versión de pago", correct: false },
        ],
        explanation:
          "Como no tenía el texto palabra por palabra, la IA inventó el suyo y se equivocó.",
      },
      {
        type: "practice",
        userPrompt: "tarjeta de cumpleaños para un amigo",
        improvedPrompt:
          "Tarjeta de cumpleaños para un amigo, estilo alegre y colorido, con globos y confeti. Texto grande arriba: «¡Feliz cumpleaños, Pablo!», en español y sin errores",
        fixPrompt: "Corrige solo el texto y deja todo lo demás igual",
      },
      {
        type: "summary",
        formula:
          "Ocasión + estilo y colores + texto exacto entre comillas + dónde va el texto y de qué tamaño",
      },
    ],
  },
};

// ---------- Направления и уроки ----------

// Короткая запись урока. Время у всех уроков пока 7 минут.
function lesson(
  id: string,
  title: LocalizedText,
  level: 1 | 2,
  content?: Record<Locale, LessonContent>,
): LessonData {
  return { id, title, level, minutes: 7, content };
}

export const TRACKS: TrackData[] = [
  {
    id: "texts",
    title: { ru: "Тексты", en: "Writing", es: "Textos" },
    premium: false,
    lessons: [
      lesson(
        "1",
        {
          ru: "Как задать вопрос, чтобы получить точный ответ",
          en: "How to ask so you get a precise answer",
          es: "Cómo preguntar para obtener una respuesta precisa",
        },
        1,
      ),
      lesson(
        "2",
        {
          ru: "Письмо или поздравление за 2 минуты",
          en: "A letter or greeting in 2 minutes",
          es: "Una carta o felicitación en 2 minutos",
        },
        1,
      ),
      lesson(
        "3",
        {
          ru: "Разобраться в сложном документе",
          en: "Make sense of a complicated document",
          es: "Entender un documento complicado",
        },
        2,
      ),
    ],
  },
  {
    id: "images",
    title: { ru: "Картинки", en: "Images", es: "Imágenes" },
    premium: false,
    lessons: [
      lesson(
        "4",
        {
          ru: "Открытка на праздник",
          en: "A card for a special day",
          es: "Una tarjeta para un día especial",
        },
        1,
        POSTCARD,
      ),
      lesson(
        "5",
        {
          ru: "Портрет или аватар в любом стиле",
          en: "A portrait or avatar in any style",
          es: "Un retrato o avatar en cualquier estilo",
        },
        1,
      ),
      lesson(
        "6",
        {
          ru: "Логотип для маленького бизнеса",
          en: "A logo for a small business",
          es: "Un logo para un pequeño negocio",
        },
        2,
      ),
    ],
  },
  {
    id: "video",
    title: { ru: "Видео", en: "Video", es: "Video" },
    premium: false,
    lessons: [
      lesson(
        "7",
        {
          ru: "Оживить старую семейную фотографию",
          en: "Bring an old family photo to life",
          es: "Darle vida a una foto familiar antigua",
        },
        1,
      ),
      lesson(
        "8",
        {
          ru: "Видеопоздравление",
          en: "A video greeting",
          es: "Un video de felicitación",
        },
        2,
      ),
      lesson(
        "9",
        {
          ru: "Короткий ролик для соцсетей",
          en: "A short video for social media",
          es: "Un video corto para redes sociales",
        },
        2,
      ),
    ],
  },
  {
    id: "voice",
    title: {
      ru: "Голос и перевод",
      en: "Voice and translation",
      es: "Voz y traducción",
    },
    premium: false,
    lessons: [
      lesson(
        "10",
        {
          ru: "Перевод разговора в поездке",
          en: "Translate a conversation while traveling",
          es: "Traducir una conversación cuando viajas",
        },
        1,
      ),
      lesson(
        "11",
        {
          ru: "Озвучить текст голосом",
          en: "Turn text into speech",
          es: "Convertir un texto en voz",
        },
        2,
      ),
      lesson(
        "12",
        {
          ru: "Расшифровать голосовое сообщение или запись",
          en: "Transcribe a voice message or recording",
          es: "Transcribir un mensaje de voz o una grabación",
        },
        2,
      ),
    ],
  },
  {
    id: "safety",
    title: { ru: "Безопасность", en: "Safety", es: "Seguridad" },
    premium: false,
    lessons: [
      lesson(
        "13",
        {
          ru: "Звонок „родственника“ в беде",
          en: "A call from a “relative” in trouble",
          es: "La llamada de un «familiar» en apuros",
        },
        1,
      ),
      lesson(
        "14",
        {
          ru: "Поддельные фото и видео",
          en: "Fake photos and videos",
          es: "Fotos y videos falsos",
        },
        2,
      ),
      lesson(
        "15",
        {
          ru: "Что нельзя рассказывать AI",
          en: "What not to tell AI",
          es: "Lo que no debes contarle a la IA",
        },
        1,
      ),
    ],
  },
  {
    id: "work",
    title: { ru: "Работа", en: "Work", es: "Trabajo" },
    premium: true,
    lessons: [
      lesson(
        "16",
        {
          ru: "Таблица с формулами без знания Excel",
          en: "A spreadsheet with formulas, no Excel skills needed",
          es: "Una hoja de cálculo con fórmulas sin saber Excel",
        },
        1,
      ),
      lesson(
        "17",
        {
          ru: "Протокол встречи из записи разговора",
          en: "Meeting notes from a recording",
          es: "El acta de una reunión a partir de una grabación",
        },
        1,
      ),
      lesson(
        "18",
        {
          ru: "Деловое письмо за минуту",
          en: "A work email in one minute",
          es: "Un correo de trabajo en un minuto",
        },
        1,
      ),
      lesson(
        "19",
        {
          ru: "Выжимка из длинного отчёта",
          en: "The key points of a long report",
          es: "Lo esencial de un informe largo",
        },
        1,
      ),
      lesson(
        "20",
        {
          ru: "Подготовка к встрече с командой",
          en: "Get ready for a team meeting",
          es: "Preparar una reunión con tu equipo",
        },
        1,
      ),
      lesson(
        "21",
        {
          ru: "Постановка задачи сотруднику",
          en: "Give a clear task to someone on your team",
          es: "Explicar bien una tarea a alguien de tu equipo",
        },
        1,
      ),
    ],
  },
];

// ---------- Урок и направление на нужном языке ----------

// Если перевода на язык нет — показываем английский.
const FALLBACK_LOCALE: Locale = "en";

function localizeLesson(data: LessonData, locale: Locale): Lesson {
  return {
    id: data.id,
    title: data.title[locale] ?? data.title[FALLBACK_LOCALE],
    level: data.level,
    minutes: data.minutes,
    content: data.content?.[locale] ?? data.content?.[FALLBACK_LOCALE],
  };
}

export function getTracks(locale: Locale): Track[] {
  return TRACKS.map((track) => ({
    id: track.id,
    title: track.title[locale] ?? track.title[FALLBACK_LOCALE],
    premium: track.premium,
    lessons: track.lessons.map((item) => localizeLesson(item, locale)),
  }));
}

export function getLesson(id: string, locale: Locale): Lesson | undefined {
  const data = TRACKS.flatMap((track) => track.lessons).find(
    (item) => item.id === id,
  );
  return data ? localizeLesson(data, locale) : undefined;
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
