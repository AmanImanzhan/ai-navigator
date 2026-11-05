import type { LanguageCode } from "@/data/onboarding";

// Типы карточек урока. У каждого типа свои поля, общее — только `type`.

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

// «Попробуй сам». Всё необязательно: в разных уроках практика устроена по-разному.
export type PracticeCard = {
  type: "practice";
  userPrompt?: string;
  improvedPrompt?: string;
  followUp?: PracticeFollowUp;
  note?: string;
};

export type SummaryCard = {
  type: "summary";
  formula: string;
  // Текст после формулы.
  text?: string;
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
  // Нет содержимого — урок «скоро». Переводы могут быть не на всех языках.
  content?: Partial<Record<Locale, LessonContent>>;
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

// ---------- Официальные сайты инструментов ----------

const CHATGPT: ToolLink = { name: "ChatGPT", url: "https://chatgpt.com" };
const GEMINI: ToolLink = { name: "Gemini", url: "https://gemini.google.com" };
const CLAUDE: ToolLink = { name: "Claude", url: "https://claude.ai" };
const IDEOGRAM: ToolLink = { name: "Ideogram", url: "https://ideogram.ai" };
const KLING: ToolLink = { name: "Kling", url: "https://klingai.com" };
const DREAMINA: ToolLink = {
  name: "Dreamina",
  url: "https://dreamina.capcut.com",
};
const HEYGEN: ToolLink = { name: "HeyGen", url: "https://www.heygen.com" };
const ELEVENLABS: ToolLink = {
  name: "ElevenLabs",
  url: "https://elevenlabs.io",
};
const GOOGLE_TRANSLATE_RU: ToolLink = {
  name: "Google Переводчик",
  url: "https://translate.google.com",
};
const GOOGLE_SHEETS_RU: ToolLink = {
  name: "Google Таблицы",
  url: "https://sheets.google.com",
};
const EXCEL: ToolLink = { name: "Excel", url: "https://excel.cloud.microsoft" };

// ---------- Урок 1 ----------

const QUESTIONS: LessonData["content"] = {
  ru: {
    helperCriteria: "ситуация, задача, ограничения, формат",
    cards: [
      {
        type: "result",
        text: "Обычно мы спрашиваем AI: «Что приготовить на ужин?» — и получаем длинный общий список. А можно получить три рецепта из того, что уже есть в холодильнике, каждый — за 30 минут, с понятными шагами. Разница — в том, как задан вопрос.",
      },
      {
        type: "tool",
        tools: [CHATGPT, GEMINI, CLAUDE],
        text: "Любой AI-ассистент: ChatGPT, Gemini или Claude. У всех есть бесплатная версия. Выберите тот, что уже установлен — принцип везде одинаковый.",
      },
      {
        type: "howto",
        intro: "Хороший вопрос состоит из четырёх частей:",
        layout: "steps",
        items: [
          {
            title: "Ситуация — кто вы и что происходит",
            text: "«Я готовлю ужин на двоих после работы».",
          },
          {
            title: "Задача — что нужно получить",
            text: "«Предложи, что приготовить».",
          },
          {
            title: "Ограничения — время, деньги, что есть или чего нельзя",
            text: "«Есть курица, рис, помидоры. Не больше 30 минут».",
          },
          {
            title: "Формат ответа",
            text: "«Дай 3 варианта, коротко, шаги списком».",
          },
        ],
      },
      {
        type: "quiz",
        situation:
          "AI предложил три рецепта, но во втором есть грибы, а вы их не едите.",
        question: "Что сказать AI дальше?",
        options: [
          { text: "Начать новый чат и спросить снова", correct: false },
          { text: "Попросить заменить рецепт с грибами", correct: true },
          { text: "Попробовать другое приложение", correct: false },
        ],
        explanation:
          "Попросить заменить — AI помнит весь разговор, результат можно дорабатывать.",
      },
      {
        type: "practice",
        userPrompt: "куда поехать на выходные",
        improvedPrompt:
          "Мы с женой хотим отдохнуть на выходных недалеко от города. Машины нет, бюджет — до 300 долларов на двоих. Любим природу и вкусную еду. Предложи 3 варианта с планом на 2 дня, коротко",
      },
      {
        type: "summary",
        formula: "Ситуация + задача + ограничения + формат",
        text: "Если ответ не идеальный — не начинайте заново, а попросите доработать.",
      },
    ],
  },
};

// ---------- Урок 2 ----------

const GREETING: LessonData["content"] = {
  ru: {
    helperCriteria:
      "адресат и повод, личные детали, тон, длина, количество вариантов",
    cards: [
      {
        type: "result",
        text: "Тёплое поздравление сестре с днём рождения — с вашими общими воспоминаниями, нужной длины и в вашем тоне. Не открытка из интернета, а текст, который звучит как вы.",
      },
      {
        type: "tool",
        tools: [CHATGPT, GEMINI, CLAUDE],
        text: "ChatGPT, Gemini или Claude — любой ассистент хорошо пишет тексты.",
      },
      {
        type: "howto",
        layout: "steps",
        items: [
          {
            title: "Кому и по какому поводу",
            text: "«Поздравление сестре с 30-летием».",
          },
          {
            title: "Две-три личные детали",
            text: "«Мы вместе ездили в Грузию, она обожает кошек, недавно начала бегать».",
          },
          { title: "Тон", text: "Тёплый, весёлый, официальный." },
          {
            title: "Длина и количество вариантов",
            text: "«Коротко, для сообщения. Дай 3 варианта».",
          },
        ],
      },
      {
        type: "quiz",
        situation: "Запрос: «Напиши поздравление коллеге с днём рождения».",
        question: "Что получится?",
        options: [
          { text: "Тёплый текст с вашими общими историями", correct: false },
          { text: "Общий текст, подходящий кому угодно", correct: true },
          { text: "Короткое стихотворение", correct: false },
        ],
        explanation:
          "Общий текст, подходящий кому угодно — AI ничего не знает о вашем коллеге. Личные детали превращают шаблон в живое поздравление.",
      },
      {
        type: "practice",
        userPrompt: "поздравление подруге",
        improvedPrompt:
          "Напиши поздравление подруге Ане с днём рождения. Мы дружим со школы, она любит путешествовать и недавно открыла свою кофейню. Тон — тёплый и с юмором. Коротко, для сообщения. Дай 3 варианта",
        followUp: {
          hint: "Подсказка на доработку",
          prompt:
            "Сделай второй вариант короче и добавь пожелание удачи кофейне",
        },
      },
      {
        type: "summary",
        formula: "Кому и повод + личные детали + тон + длина и варианты",
        text: "Понравился вариант не полностью — попросите изменить конкретное: «теплее», «короче», «без пафоса».",
      },
    ],
  },
};

// ---------- Урок 3 ----------

const DOCUMENT: LessonData["content"] = {
  ru: {
    helperCriteria:
      "просьба объяснить простыми словами, вопросы о сроках и суммах, просьба процитировать; напоминание убрать личные данные",
    cards: [
      {
        type: "result",
        text: "Непонятное письмо из банка или договор аренды → объяснение простыми словами: что от вас хотят, какие сроки и суммы, на что обратить внимание.",
      },
      {
        type: "tool",
        tools: [CHATGPT, CLAUDE],
        text: "ChatGPT или Claude: можно сфотографировать документ или загрузить файл. Важно: перед загрузкой закройте личные данные — номер счёта, паспорта, адрес. На фото их можно просто замазать в редакторе.",
      },
      {
        type: "howto",
        intro: "Выберите удобный способ передать документ:",
        layout: "options",
        items: [
          {
            title: "Сфотографировать — для бумажных писем",
            text: "Чёткое фото без бликов, личные данные замазать.",
          },
          {
            title:
              "Скопировать текст — для писем на почте, в приложении банка или на сайте",
            text: "Выделить, скопировать, вставить в чат, личные данные удалить. Самый точный способ — AI не ошибётся с цифрами из-за плохого фото.",
          },
          { title: "Загрузить файл", text: "Для PDF и Word." },
        ],
        note: "Дальше: попросите объяснить простыми словами, что требуют, сроки, суммы и что будет, если не сделать; попросите процитировать точные фразы со сроками и суммами. Для важных решений — уточните у банка, юриста или в организации, которая прислала документ.",
      },
      {
        type: "quiz",
        situation:
          "AI написал «оплатить до 15-го числа», а в письме срок — 5-е.",
        question: "Почему так вышло?",
        options: [
          { text: "Фото было размытым, AI не разобрал цифру", correct: true },
          { text: "AI не умеет читать письма", correct: false },
          { text: "Банки часто пишут сроки неправильно", correct: false },
        ],
        explanation:
          "Фото было размытым — AI додумал цифру. Поэтому важные даты и суммы просите процитировать и сверяйте с оригиналом.",
      },
      {
        type: "practice",
        improvedPrompt:
          "Объясни простыми словами это письмо. Что от меня хотят? Какие сроки и суммы? Что будет, если ничего не делать? Процитируй точные фразы, где указаны сроки и суммы",
      },
      {
        type: "summary",
        formula:
          "Убрать личные данные + чёткое фото + «объясни простыми словами» + цитаты сроков и сумм",
        text: "AI помогает понять документ, но решение по важным вопросам принимаете вы — при необходимости со специалистом.",
      },
    ],
  },
};

// ---------- Урок 4: открытка ----------

const POSTCARD: LessonData["content"] = {
  ru: {
    skill:
      "Теперь вы умеете делать открытку с точной надписью — без ошибок в буквах",
    helperCriteria:
      "повод, стиль, цвета, текст в кавычках, расположение надписи",
    cards: [
      {
        type: "result",
        title: "Открытка на юбилей мамы",
        text: "Весенние цветы, тёплые тона и ровная надпись «С юбилеем, мама!» — без ошибок в буквах.",
      },
      {
        type: "tool",
        tools: [IDEOGRAM],
        text: "Лучше всего справляется с надписями — около 10 бесплатных генераций в день. Если недоступен, подойдут Gemini или ChatGPT.",
      },
      {
        type: "howto",
        layout: "options",
        items: [
          {
            title: "С нуля по описанию",
            text: "Опишите повод, стиль, цвета и точный текст надписи в кавычках.",
          },
          {
            title: "По своему фото",
            text: "В Gemini или ChatGPT загрузите фото мамы или цветов из сада и попросите сделать из него открытку с надписью.",
          },
        ],
        note: "В обоих случаях пишите текст надписи дословно в кавычках, место и размер надписи, язык надписи.",
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
        followUp: {
          hint: "Если буквы искажены",
          prompt: "Исправь только надпись, остальное оставь как есть",
        },
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
        tools: [IDEOGRAM],
        text: "It's the best at putting text on images — about 10 free pictures a day. If it doesn't work for you, try Gemini or ChatGPT.",
      },
      {
        type: "howto",
        layout: "options",
        items: [
          {
            title: "From a description",
            text: "Describe the occasion, the style, the colors and the exact words, in quotes.",
          },
          {
            title: "From your own photo",
            text: "Upload a photo of Mom or of flowers from the garden to Gemini or ChatGPT and ask it to turn it into a card with a greeting.",
          },
        ],
        note: "Either way, write the greeting word for word in quotes, and say where it goes, how big it should be and what language it's in.",
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
        followUp: {
          hint: "If the letters come out wrong",
          prompt: "Fix only the text and keep everything else the same",
        },
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
        tools: [IDEOGRAM],
        text: "Es la que mejor pone textos en las imágenes: unas 10 imágenes gratis al día. Si no te funciona, prueba con Gemini o ChatGPT.",
      },
      {
        type: "howto",
        layout: "options",
        items: [
          {
            title: "A partir de una descripción",
            text: "Describe la ocasión, el estilo, los colores y el texto exacto entre comillas.",
          },
          {
            title: "A partir de tu propia foto",
            text: "Sube a Gemini o ChatGPT una foto de mamá o de las flores del jardín y pídele que la convierta en una tarjeta con un mensaje.",
          },
        ],
        note: "En los dos casos, escribe el texto palabra por palabra y entre comillas, y di dónde va, de qué tamaño y en qué idioma.",
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
        followUp: {
          hint: "Si las letras salen mal",
          prompt: "Corrige solo el texto y deja todo lo demás igual",
        },
      },
      {
        type: "summary",
        formula:
          "Ocasión + estilo y colores + texto exacto entre comillas + dónde va el texto y de qué tamaño",
      },
    ],
  },
};

// ---------- Урок 5 ----------

const PORTRAIT: LessonData["content"] = {
  ru: {
    helperCriteria: "стиль, что сохранить из исходного фото, фон, формат",
    cards: [
      {
        type: "result",
        text: "Ваше фото превращается в портрет в стиле мультфильма, масляной живописи или комикса — и вы на нём узнаваемы.",
      },
      {
        type: "tool",
        tools: [GEMINI, CHATGPT],
        text: "Gemini — около 20 бесплатных картинок в день и хорошо работает с фотографиями. Альтернатива — ChatGPT, но бесплатно там всего 2–3 картинки в день.",
      },
      {
        type: "howto",
        intro: "Два способа:",
        layout: "options",
        items: [
          {
            title: "По своему фото",
            text: "Загрузите чёткое фото лица при хорошем свете и опишите стиль.",
          },
          {
            title: "С нуля по описанию — если не хотите загружать фото",
            text: "Опишите внешность, одежду и стиль.",
          },
        ],
        note: "Важно: загружайте только свои фото или фото людей, которые разрешили. Не используйте фото детей других людей.",
      },
      {
        type: "quiz",
        situation: "Стиль получился отличный, но лицо не похоже на вас.",
        question: "Что сказать AI дальше?",
        options: [
          {
            text: "Попросить сохранить лицо и поменять только стиль",
            correct: true,
          },
          { text: "Загрузить другое фото и начать заново", correct: false },
          { text: "Написать запрос заново на английском", correct: false },
        ],
        explanation:
          "Попросить сохранить лицо — «Сохрани черты лица как на исходном фото, меняй только стиль и фон».",
      },
      {
        type: "practice",
        userPrompt: "сделай меня как в мультике",
        improvedPrompt:
          "Преврати это фото в портрет в стиле мультфильма Pixar. Сохрани черты лица, причёску и цвет глаз как на фото. Фон — однотонный светло-голубой. Портрет по плечи, для аватарки",
      },
      {
        type: "summary",
        formula: "Чёткое фото + стиль + что сохранить + фон и формат",
      },
    ],
  },
};

// ---------- Урок 6 ----------

const LOGO: LessonData["content"] = {
  ru: {
    helperCriteria:
      "название в кавычках, сфера, характер, цвета, простой фон, количество вариантов",
    cards: [
      {
        type: "result",
        text: "Простой логотип для кофейни, мастерской или блога: название, понятный символ и фирменные цвета — в нескольких вариантах на выбор.",
      },
      {
        type: "tool",
        tools: [IDEOGRAM, CHATGPT],
        text: "Ideogram — лучше всех пишет название в логотипе. Альтернатива — ChatGPT. Важно: если логотип нужен для настоящего бизнеса, проверьте условия использования — на бесплатных тарифах коммерческие права могут быть ограничены, а в Ideogram бесплатные картинки видны всем в общей галерее.",
      },
      {
        type: "howto",
        intro: "Два способа:",
        layout: "options",
        items: [
          {
            title: "С нуля",
            text: "Название, сфера бизнеса, характер (уютный, строгий, игривый), цвета, простой фон.",
          },
          {
            title: "По наброску",
            text: "Сфотографируйте свой рисунок от руки и попросите сделать из него аккуратный логотип.",
          },
        ],
        note: "Просите сразу несколько вариантов и простую форму — логотип должен читаться и в маленьком размере.",
      },
      {
        type: "quiz",
        situation: "Запрос: «логотип для кофейни».",
        question: "Что получится?",
        options: [
          { text: "Чашка кофе и случайное название", correct: true },
          { text: "Ваш фирменный знак с вашим названием", correct: false },
          { text: "Фото настоящей кофейни", correct: false },
        ],
        explanation:
          "Чашка кофе и случайное название — AI не знает ни названия, ни характера вашего бизнеса.",
      },
      {
        type: "practice",
        userPrompt: "логотип для моей пекарни",
        improvedPrompt:
          "Логотип для семейной пекарни „Тёплый хлеб“. Стиль — уютный, простой, в виде значка. Символ — колосок или буханка. Цвета — тёплый коричневый и кремовый. Название по-русски, крупно и разборчиво. Белый фон. Дай 4 варианта",
      },
      {
        type: "summary",
        formula:
          "Название + сфера + характер + цвета + простая форма + несколько вариантов",
        text: "Для настоящего бизнеса — проверьте права на использование.",
      },
    ],
  },
};

// ---------- Урок 7 ----------

const OLD_PHOTO: LessonData["content"] = {
  ru: {
    helperCriteria:
      "конкретное движение, темп, положение камеры, что сохранить",
    cards: [
      {
        type: "result",
        text: "Чёрно-белое фото бабушки в молодости — и она на несколько секунд оживает: улыбается, моргает, ветер чуть шевелит волосы.",
      },
      {
        type: "tool",
        tools: [KLING, DREAMINA],
        text: "Kling или Dreamina — оба превращают фото в короткое видео. Бесплатных попыток немного — примерно 2 ролика в день в Kling, — поэтому сначала продумайте запрос.",
      },
      {
        type: "howto",
        intro: "Два способа:",
        layout: "options",
        items: [
          {
            title: "Сразу оживить",
            text: "Загрузите фото и опишите движение.",
          },
          {
            title: "Сначала восстановить, потом оживить",
            text: "В Gemini попросите убрать царапины и аккуратно раскрасить фото, а уже потом оживите его в Kling или Dreamina.",
          },
        ],
        note: "Советы: лёгкие, медленные движения выглядят естественнее; камера неподвижна; лицо просите не менять. Деликатно: оживляйте фото близких с согласия семьи и не создавайте видео, которые могут ввести кого-то в заблуждение.",
      },
      {
        type: "quiz",
        situation: "Человек на видео странно задвигался, а лицо исказилось.",
        question: "Почему так вышло?",
        options: [
          { text: "Не описали, какое нужно движение", correct: true },
          { text: "Фото слишком старое для AI", correct: false },
          { text: "Бесплатная версия всегда так делает", correct: false },
        ],
        explanation:
          "Не описали движение — AI сам придумал, как двигаться, и перестарался.",
      },
      {
        type: "practice",
        userPrompt: "оживи фото",
        improvedPrompt:
          "Оживи это фото: женщина слегка улыбается и медленно моргает, лёгкий ветер шевелит волосы. Камера неподвижна. Движения плавные и естественные. Черты лица не менять",
      },
      {
        type: "summary",
        formula:
          "Какое движение + насколько медленно + камера неподвижна + лицо не менять",
      },
    ],
  },
};

// ---------- Урок 8 ----------

const VIDEO_GREETING: LessonData["content"] = {
  ru: {
    helperCriteria: "длина около 30 секунд, имя и повод, паузы, тон",
    cards: [
      {
        type: "result",
        text: "30-секундное видео, где ведущий-аватар тепло поздравляет коллегу по имени — с вашим текстом.",
      },
      {
        type: "tool",
        tools: [HEYGEN],
        text: "HeyGen — создаёт говорящих аватаров из текста. Бесплатно — 3 видео в месяц, с водяным знаком.",
      },
      {
        type: "howto",
        intro: "Два способа:",
        layout: "options",
        items: [
          {
            title: "Готовый аватар",
            text: "Выберите ведущего из библиотеки и вставьте текст.",
          },
          {
            title: "Ваш цифровой двойник",
            text: "Аватар из вашего собственного фото — только из своего фото и со своим голосом, никогда из чужих.",
          },
        ],
        note: "Текст поздравления можно подготовить в ChatGPT — по формуле из урока 2.",
      },
      {
        type: "quiz",
        situation: "Аватар неправильно произносит имя «Нино» и говорит без пауз.",
        question: "Что сказать AI дальше?",
        options: [
          {
            text: "Написать имя так, как оно звучит, и поставить паузы",
            correct: true,
          },
          { text: "Выбрать другого аватара", correct: false },
          { text: "Перевести текст на английский", correct: false },
        ],
        explanation:
          "Подсказать произношение и паузы — например, ударение и точки или многоточия там, где нужна пауза.",
      },
      {
        type: "practice",
        userPrompt: "поздравить коллегу с повышением",
        improvedPrompt:
          "Нино, поздравляем с повышением! Ты это заслужила — своим упорством и добротой к команде. … Пусть новая должность приносит радость и интересные задачи. Мы гордимся тобой!",
      },
      {
        type: "summary",
        formula:
          "Короткий текст + имя так, как оно звучит + паузы + свой аватар только из своего фото",
      },
    ],
  },
};

// ---------- Урок 9 ----------

const SOCIAL_VIDEO: LessonData["content"] = {
  ru: {
    helperCriteria: "формат, длительность, сцена, свет, движение камеры",
    cards: [
      {
        type: "result",
        text: "Вертикальный 5-секундный ролик для сторис: крупный план, как бариста рисует сердечко на капучино, тёплый утренний свет.",
      },
      {
        type: "tool",
        tools: [DREAMINA, KLING],
        text: "Dreamina — ежедневные бесплатные кредиты на видео. Альтернатива — Kling. На бесплатных тарифах ролики с водяным знаком.",
      },
      {
        type: "howto",
        intro: "Два способа:",
        layout: "options",
        items: [
          {
            title: "Из текста",
            text: "Опишите сцену, свет, движение камеры и формат.",
          },
          {
            title: "Из своего фото",
            text: "Загрузите фото своего продукта или заведения — так ролик будет про вас, а не про случайное место.",
          },
        ],
        note: "Сделайте 2–3 варианта и выберите лучший; несколько роликов можно склеить в CapCut.",
      },
      {
        type: "quiz",
        situation: "Запрос: «видео про мою кофейню».",
        question: "Что получится?",
        options: [
          { text: "Случайная красивая кофейня, не ваша", correct: true },
          { text: "Ролик о вашей кофейне с вашим логотипом", correct: false },
          { text: "Длинный рекламный фильм", correct: false },
        ],
        explanation:
          "Случайная кофейня — AI не знает, как выглядит ваша. Используйте своё фото как основу.",
      },
      {
        type: "practice",
        improvedPrompt:
          "Вертикальное видео 9:16, 5 секунд. Крупный план: бариста наливает молоко в капучино и рисует сердечко. Тёплый утренний свет, уютная атмосфера, камера медленно приближается. Без текста",
      },
      {
        type: "summary",
        formula:
          "Формат 9:16 + длительность + что в кадре + свет и настроение + движение камеры + своё фото как основа",
      },
    ],
  },
};

// ---------- Урок 10 ----------

const TRAVEL_TRANSLATION: LessonData["content"] = {
  ru: {
    helperCriteria:
      "пара языков, направление перевода, тон, просьба переспрашивать",
    cards: [
      {
        type: "result",
        text: "Вы в кафе в Испании: говорите по-русски, официант слышит испанский, а его ответ вы слышите по-русски.",
      },
      {
        type: "tool",
        tools: [GOOGLE_TRANSLATE_RU, CHATGPT],
        text: "Режим «Разговор» в Google Переводчике — бесплатно. Или голосовой режим ChatGPT.",
      },
      {
        type: "howto",
        intro: "Три способа:",
        layout: "options",
        items: [
          {
            title: "Google Переводчик, режим «Разговор»",
            text: "Выберите два языка и говорите по очереди. Заранее скачайте языки для работы без интернета.",
          },
          {
            title: "Голосовой режим ChatGPT",
            text: "Попросите его быть переводчиком между вами и собеседником.",
          },
          {
            title: "Камера в Google Переводчике",
            text: "Наведите на меню или вывеску — перевод появится поверх текста.",
          },
        ],
      },
      {
        type: "quiz",
        situation:
          "Перевод звучит слишком дословно и резко — хозяин квартиры удивлённо смотрит.",
        question: "Что сказать AI дальше?",
        options: [
          {
            text: "Попросить переводить вежливо и естественно, как местный",
            correct: true,
          },
          { text: "Говорить медленнее и громче", correct: false },
          { text: "Перейти на английский", correct: false },
        ],
        explanation: "Попросить переводить вежливо и естественно.",
      },
      {
        type: "practice",
        improvedPrompt:
          "Ты мой переводчик в поездке по Испании. Мои фразы переводи с русского на испанский, ответы собеседника — с испанского на русский. Переводи вежливо и естественно, как говорят местные. Если фраза неясна — переспроси меня",
      },
      {
        type: "summary",
        formula:
          "Какие языки + кто говорит на каком + вежливо и естественно + переспрашивай, если неясно",
        text: "И скачайте языки заранее.",
      },
    ],
  },
};

// ---------- Урок 11 ----------

const VOICEOVER: LessonData["content"] = {
  ru: {
    helperCriteria:
      "нет сокращений и цифр, расставлены паузы, отмечены сложные ударения",
    cards: [
      {
        type: "result",
        text: "Ваше поздравление или рассказ звучит голосом диктора — живо, с интонациями и паузами.",
      },
      {
        type: "tool",
        tools: [ELEVENLABS],
        text: "ElevenLabs — около 10 000 символов в месяц бесплатно. На бесплатном тарифе — только для личного использования и с указанием, что голос создан ElevenLabs. Для озвучки в рекламе или на монетизированном канале нужен платный тариф.",
      },
      {
        type: "howto",
        intro: "Два способа:",
        layout: "options",
        items: [
          {
            title: "Готовый голос",
            text: "Выберите голос из библиотеки, вставьте текст, прослушайте.",
          },
          {
            title: "Встроенная озвучка телефона",
            text: "В настройках доступности большинства телефонов есть чтение текста вслух — бесплатно и без регистрации, но голос проще.",
          },
        ],
        note: "Перед озвучкой подготовьте текст: цифры и сокращения словами, запятые и точки там, где нужны паузы.",
      },
      {
        type: "quiz",
        situation: "Текст: «Т.к. в 2026 г. было 15 млн гостей…».",
        question: "Что получится?",
        options: [
          {
            text: "Голос прочтёт сокращения странно или по буквам",
            correct: true,
          },
          { text: "Голос сам аккуратно всё расшифрует", correct: false },
          { text: "Цифры будут пропущены", correct: false },
        ],
        explanation:
          "Сокращения прозвучат странно. Пишите словами: «так как в две тысячи двадцать шестом году было пятнадцать миллионов гостей».",
      },
      {
        type: "practice",
        note: "Помощник переписывает текст для озвучки: раскрывает сокращения и цифры, расставляет паузы, отмечает ударения в сложных словах и именах.",
      },
      {
        type: "summary",
        formula:
          "Цифры и сокращения словами + паузы знаками препинания + ударения в сложных словах + выбор голоса под настроение",
      },
    ],
  },
};

// ---------- Урок 12 ----------

const TRANSCRIPTION: LessonData["content"] = {
  ru: {
    helperCriteria: "имена участников, термины, формат результата",
    cards: [
      {
        type: "result",
        text: "Длинное голосовое сообщение или запись встречи → текст, краткое содержание в 5 пунктах и список задач с именами.",
      },
      {
        type: "tool",
        tools: [CHATGPT, GEMINI, ELEVENLABS],
        text: "Встроенная расшифровка телефона, ChatGPT или Gemini с загрузкой аудио, расшифровка в ElevenLabs.",
      },
      {
        type: "howto",
        intro: "Три способа:",
        layout: "options",
        items: [
          {
            title: "Встроенная расшифровка",
            text: "Во многих телефонах голосовые сообщения и диктофонные записи можно перевести в текст прямо в приложении.",
          },
          {
            title: "AI-ассистент",
            text: "Загрузите аудиофайл в ChatGPT или Gemini и попросите расшифровать.",
          },
          {
            title: "Если текст уже есть",
            text: "Вставьте его в AI и попросите краткое содержание и список задач.",
          },
        ],
        note: "Записывая разговор с другими людьми, предупредите их и получите согласие.",
      },
      {
        type: "quiz",
        situation: "В расшифровке перепутаны имена и рабочие термины.",
        question: "Почему так вышло?",
        options: [
          {
            text: "Шумная запись и незнакомые слова — их нужно подсказать заранее",
            correct: true,
          },
          { text: "AI не понимает русскую речь", correct: false },
          { text: "Запись была слишком короткой", correct: false },
        ],
        explanation:
          "Шум и незнакомые слова. Назовите участников и термины заранее, записывайте в тихом месте.",
      },
      {
        type: "practice",
        improvedPrompt:
          "Расшифруй эту запись. Участники: Анна и Георгий. Термины: Supabase, Expo. После расшифровки — краткое содержание в 5 пунктах и список задач с именами ответственных",
      },
      {
        type: "summary",
        formula:
          "Тихая запись + имена и термины заранее + расшифровка + краткое содержание + задачи",
        text: "Согласие участников — обязательно.",
      },
    ],
  },
};

// ---------- Урок 13 ----------

const SCAM_CALL: LessonData["content"] = {
  ru: {
    cards: [
      {
        type: "result",
        text: "Вы точно знаете, что делать, если звонит «сын» или «внук», плачет и просит срочно перевести деньги. А у вашей семьи есть кодовое слово.",
      },
      {
        type: "info",
        label: "Что важно знать",
        text: "Мошенникам хватает нескольких секунд записи голоса из соцсетей, чтобы подделать его с помощью AI. Поэтому лучшая защита — не пытаться узнать голос на слух, а оценивать саму ситуацию. Номер на экране тоже можно подделать.",
      },
      {
        type: "howto",
        label: "Что делать",
        layout: "steps",
        items: [
          {
            title: "Остановиться",
            text: "Срочность, просьба никому не говорить и необычный способ оплаты — главные признаки мошенничества.",
          },
          {
            text: "Спросить кодовое слово или то, что знает только родной человек.",
          },
          {
            text: "Положить трубку и перезвонить по номеру, который у вас уже есть.",
          },
          { text: "Связаться с другим членом семьи." },
          { text: "Никогда не переводить деньги во время такого звонка." },
        ],
      },
      {
        type: "quiz",
        situation:
          "Звонит «внук», плачет: попал в аварию, нужны деньги, просит никому не говорить.",
        question: "Что делать дальше?",
        options: [
          {
            text: "Положить трубку и перезвонить внуку на его номер",
            correct: true,
          },
          { text: "Перевести немного, чтобы помочь срочно", correct: false },
          {
            text: "Продолжить разговор и задать уточняющие вопросы",
            correct: false,
          },
        ],
        explanation:
          "Положить трубку и перезвонить. Мошенник постарается удержать вас на линии — не давайте ему этого.",
      },
      {
        type: "practice",
        improvedPrompt:
          "Давайте договоримся о кодовом слове на случай, если кто-то позвонит от имени одного из нас и попросит деньги. Предлагаю слово „…“. Никому, кроме семьи, его не говорим",
      },
      {
        type: "summary",
        formula: "Срочно + секрет + деньги = стоп",
        text: "Положить трубку, перезвонить по своему номеру, спросить кодовое слово.",
      },
    ],
  },
};

// ---------- Урок 14 ----------

const FAKES: LessonData["content"] = {
  ru: {
    cards: [
      {
        type: "result",
        text: "Вы видите «видео со знаменитостью», которая советует вложить деньги, — и за минуту понимаете, что это, скорее всего, подделка, и как это проверить.",
      },
      {
        type: "info",
        label: "Что важно знать",
        text: "AI-подделки становятся всё реалистичнее, и по картинке их распознать всё сложнее. Поэтому главное — не разглядывать пиксели, а проверять смысл и источник. Даже AI не может надёжно определить подделку, поэтому ответ AI «это настоящее» — не доказательство.",
      },
      {
        type: "howto",
        label: "Как проверить",
        intro: "Три способа:",
        layout: "options",
        items: [
          {
            title: "Смысл",
            text: "Обещание лёгких денег, срочность, просьба перейти по ссылке или перевести деньги — сильнейшие признаки обмана.",
          },
          {
            title: "Источник",
            text: "Есть ли это видео или новость на официальных страницах человека или в крупных СМИ?",
          },
          {
            title: "Поиск по картинке",
            text: "В Google Объективе можно найти, где ещё встречается фото и откуда оно на самом деле.",
          },
        ],
        note: "Визуальные подсказки тоже бывают — странные руки и пальцы, «плывущий» фон, искажённый текст, губы не совпадают со словами, — но их отсутствие не значит, что видео настоящее.",
      },
      {
        type: "quiz",
        situation:
          "Известный бизнесмен в видео приглашает вложиться в «новую платформу» с гарантированным доходом.",
        question: "Что главный признак обмана?",
        options: [
          {
            text: "Знаменитость обещает лёгкий заработок и просит перейти по ссылке",
            correct: true,
          },
          { text: "Видео снято в хорошем качестве", correct: false },
          { text: "Человек говорит на вашем языке", correct: false },
        ],
        explanation:
          "Обещание лёгкого заработка и ссылка — смысл важнее качества картинки.",
      },
      {
        type: "practice",
        note: "Помощник проводит по чек-листу: пользователь описывает подозрительный пост или видео, помощник задаёт вопросы — что обещают, куда ведёт ссылка, есть ли это на официальных страницах — и подсказывает, как проверить источник.",
      },
      {
        type: "summary",
        formula: "Смысл + источник + поиск по картинке",
        text: "Деньги, срочность и ссылка = стоп, даже если видео выглядит идеально.",
      },
    ],
  },
};

// ---------- Урок 15 ----------

const PRIVACY: LessonData["content"] = {
  ru: {
    cards: [
      {
        type: "result",
        text: "Вы пользуетесь AI для личных и рабочих дел и при этом не отдаёте ему ничего, что может навредить вам или другим.",
      },
      {
        type: "info",
        label: "Что важно знать",
        text: "То, что вы пишете в AI, сохраняется в истории чата и обрабатывается сервисом. В настройках многих сервисов можно отключить использование ваших чатов для обучения и удалить историю — стоит это сделать.",
      },
      {
        type: "howto",
        label: "Что никогда не писать",
        layout: "list",
        items: [
          { text: "Пароли и коды из SMS." },
          { text: "Номера карт и CVV, данные банковских счетов." },
          { text: "Номера паспорта и других документов." },
          { text: "Чужие личные данные без согласия." },
          { text: "Конфиденциальные документы компании без разрешения." },
        ],
        note: "Как обойти: заменяйте имена и номера пометками — «Клиент А», «[номер паспорта]», — а задачу описывайте без лишних деталей.",
      },
      {
        type: "quiz",
        situation:
          "Человек вставил в AI выписку из банка целиком, с номером счёта и паспортными данными.",
        question: "Что получится?",
        options: [
          {
            text: "Данные сохранятся в истории чата и останутся в сервисе",
            correct: true,
          },
          { text: "AI сразу всё удалит", correct: false },
          { text: "Ничего не произойдёт, это безопасно", correct: false },
        ],
        explanation:
          "Данные сохранятся в истории. Лучше было убрать номера заранее.",
      },
      {
        type: "practice",
        userPrompt: "Мой паспорт 4510 123456, живу на ул. Ленина 5",
        improvedPrompt: "Мой паспорт [номер], живу по адресу [адрес]",
        note: "Задача та же, а риска нет.",
      },
      {
        type: "summary",
        formula:
          "Никаких паролей, карт и документов + чужие данные только с согласия + заменять пометками + проверить настройки приватности",
      },
    ],
  },
};

// ---------- Урок 16 ----------

const SPREADSHEET: LessonData["content"] = {
  ru: {
    helperCriteria:
      "программа, расположение данных, диапазон строк, задача расчёта",
    cards: [
      {
        type: "result",
        text: "Таблица продаж, где сумма по каждому сотруднику за месяц считается сама — по формуле, которую написал AI.",
      },
      {
        type: "tool",
        tools: [CHATGPT, GEMINI, GOOGLE_SHEETS_RU, EXCEL],
        text: "ChatGPT или Gemini — для формул; Google Таблицы или Excel — для самой таблицы.",
      },
      {
        type: "howto",
        intro: "Три способа:",
        layout: "options",
        items: [
          {
            title: "Попросить формулу",
            text: "Опишите, в каких столбцах что лежит, с какой строки начинаются данные и что нужно посчитать.",
          },
          {
            title: "Попросить структуру таблицы",
            text: "AI предложит столбцы и примеры строк, которые можно вставить в таблицу.",
          },
          {
            title: "Загрузить файл таблицы и попросить проанализировать",
            text: "Только если в нём нет конфиденциальных данных.",
          },
        ],
        note: "Важно: в таблицах с русскими настройками в формулах вместо запятой ставится точка с запятой. Если формула не работает — скажите об этом AI.",
      },
      {
        type: "quiz",
        situation: "AI дал формулу, а таблица показывает ошибку.",
        question: "Почему так вышло?",
        options: [
          {
            text: "Не назвали, в каких столбцах данные и с какой строки",
            correct: true,
          },
          { text: "Google Таблицы не принимают формулы от AI", correct: false },
          { text: "Нужна платная версия AI", correct: false },
        ],
        explanation:
          "Не назвали столбцы и строки — AI угадал расположение данных и ошибся.",
      },
      {
        type: "practice",
        improvedPrompt:
          "Google Таблицы, русские настройки. В столбце A — даты, в B — имена сотрудников, в C — сумма продажи. Данные со строки 2 по 200. Напиши формулу, которая считает сумму продаж каждого сотрудника за октябрь 2026, и объясни, в какую ячейку её вставить",
      },
      {
        type: "summary",
        formula:
          "Какая программа и настройки + что в каких столбцах + с какой строки данные + что посчитать + куда вставить",
      },
    ],
  },
};

// ---------- Урок 17 ----------

const MEETING_NOTES: LessonData["content"] = {
  ru: {
    helperCriteria:
      "структура, формат задач, отметка пробелов, запрет додумывать",
    cards: [
      {
        type: "result",
        text: "Из часовой записи встречи — протокол на одну страницу: участники, решения, задачи с ответственными и сроками, открытые вопросы.",
      },
      {
        type: "tool",
        tools: [CHATGPT, CLAUDE],
        text: "ChatGPT или Claude. Расшифровку записи сделайте по уроку 12.",
      },
      {
        type: "howto",
        intro: "Три способа:",
        layout: "options",
        items: [
          { title: "Из расшифровки", text: "Вставьте текст записи." },
          {
            title: "Из заметок",
            text: "Вставьте свои короткие заметки со встречи — AI оформит их в протокол.",
          },
          {
            title: "Из аудио",
            text: "Загрузите запись в AI-ассистента, который принимает аудио.",
          },
        ],
        note: "Запись встречи — только с согласия участников; конфиденциальные встречи — только если компания разрешает такие сервисы.",
      },
      {
        type: "quiz",
        situation: "В протоколе у задач нет сроков.",
        question: "Что сказать AI дальше?",
        options: [
          {
            text: "Попросить указать сроки, а где их не называли — пометить «срок не определён»",
            correct: true,
          },
          { text: "Придумать сроки самому и вписать", correct: false },
          { text: "Расшифровать запись заново", correct: false },
        ],
        explanation:
          "Попросить указать сроки и пометить неопределённые — тогда сразу видно, о чём нужно договориться.",
      },
      {
        type: "practice",
        improvedPrompt:
          "Сделай протокол встречи по этой расшифровке. Структура: дата, участники, принятые решения, задачи в формате „кто — что — срок“, открытые вопросы. Если срок или ответственный не назван — так и напиши. Ничего не добавляй от себя",
      },
      {
        type: "summary",
        formula:
          "Источник (расшифровка, заметки или аудио) + чёткая структура + «кто — что — срок» + отметки о пробелах + ничего от себя",
      },
    ],
  },
};

// ---------- Урок 18 ----------

const BUSINESS_EMAIL: LessonData["content"] = {
  ru: {
    helperCriteria: "адресат, факты, требование, тон, длина, тема",
    cards: [
      {
        type: "result",
        text: "Чёткое письмо поставщику о задержке заказа: вежливое, но твёрдое, с номером заказа, датами и тем, что вам нужно, — и с темой письма.",
      },
      {
        type: "tool",
        tools: [CHATGPT, CLAUDE, GEMINI],
        text: "ChatGPT, Claude или Gemini.",
      },
      {
        type: "howto",
        intro: "Три способа:",
        layout: "options",
        items: [
          {
            title: "С нуля",
            text: "Кому, о чём, факты (номера, даты), чего вы хотите, тон и длина.",
          },
          {
            title: "Ответ на входящее",
            text: "Вставьте полученное письмо — без конфиденциальных данных — и скажите, что хотите ответить.",
          },
          {
            title: "Улучшить черновик",
            text: "Вставьте свой текст и попросите сделать короче, вежливее или твёрже.",
          },
        ],
      },
      {
        type: "quiz",
        situation: "Запрос: «напиши письмо поставщику о задержке».",
        question: "Что получится?",
        options: [
          {
            text: "Вежливое, но общее письмо без ваших дат и номера заказа",
            correct: true,
          },
          {
            text: "Точное письмо с вашими датами и требованиями",
            correct: false,
          },
          { text: "Жёсткая претензия с угрозами", correct: false },
        ],
        explanation:
          "Вежливое, но общее — AI не знает фактов, и письмо придётся переписывать.",
      },
      {
        type: "practice",
        improvedPrompt:
          "Напиши письмо поставщику „Свежие продукты“. Заказ №[номер] от 20 октября должен был прийти 27-го, но не пришёл. Нам нужно: точная дата доставки до конца дня и замена, если не успевают к пятнице. Тон — вежливый, но твёрдый. До 120 слов. Тему письма напиши отдельно",
        followUp: {
          hint: "Доработка",
          prompt:
            "Сделай чуть формальнее и добавь благодарность за прошлое сотрудничество",
        },
      },
      {
        type: "summary",
        formula:
          "Кому + факты (номера, даты) + чего вы хотите + тон + длина + тема письма",
      },
    ],
  },
};

// ---------- Урок 19 ----------

const REPORT_SUMMARY: LessonData["content"] = {
  ru: {
    helperCriteria:
      "роль, цель, структура, ссылки на источник, запрет додумывать, шаг проверки",
    cards: [
      {
        type: "result",
        text: "Отчёт на 15 страниц → выжимка на полстраницы: три главных вывода, ключевые цифры с номерами страниц, риски и решения, которые нужно принять. Час чтения превращается в 5 минут — но есть ловушка, которую разберём в уроке.",
      },
      {
        type: "tool",
        tools: [CLAUDE, CHATGPT],
        // В источнике дальше: «Для практики есть учебный отчёт.» — учебного отчёта в приложении пока нет.
        text: "Claude или ChatGPT — в оба можно загрузить PDF или Word. Прежде чем загружать рабочий документ, узнайте, разрешает ли это компания; конфиденциальное без разрешения не загружайте.",
      },
      {
        type: "howto",
        layout: "steps",
        items: [
          { text: "Загрузите файл." },
          {
            title: "Скажите, кто вы и зачем",
            text: "«Я руководитель отдела, завтра обсуждаю отчёт с директором».",
          },
          {
            title: "Задайте структуру",
            text: "Главные выводы, цифры, риски, решения.",
          },
          { text: "Попросите номер страницы у каждой цифры." },
          {
            title: "Запретите додумывать",
            text: "«Не добавляй ничего, чего нет в отчёте. Если данных не хватает — так и напиши».",
          },
        ],
      },
      {
        type: "quiz",
        situation: "В выжимке «продажи выросли на 18%», а в отчёте — на 12%.",
        question: "Почему так вышло?",
        options: [
          { text: "В отчёте была опечатка", correct: false },
          { text: "AI может путать или выдумывать цифры", correct: true },
          { text: "Нужно было использовать платную версию", correct: false },
        ],
        explanation:
          "AI может путать или выдумывать цифры — это называется «галлюцинация», бывает и в платных версиях. Ключевые цифры всегда сверяйте.",
      },
      {
        type: "practice",
        improvedPrompt:
          "Я руководитель отдела продаж. Завтра обсуждаю этот отчёт с директором. Сделай выжимку не длиннее полстраницы: 1) три главных вывода; 2) ключевые цифры с номером страницы; 3) риски; 4) решения, которые нужно принять. Не добавляй ничего, чего нет в отчёте. Если данных не хватает — так и напиши",
        followUp: {
          hint: "Второй шаг",
          prompt:
            "Проверь каждую цифру в выжимке по тексту отчёта и для каждой приведи точную цитату",
        },
      },
      {
        type: "summary",
        formula:
          "Роль и цель + структура + ссылки на страницы + запрет додумывать + проверка цифр",
        text: "AI экономит час чтения, но ответственность за цифры — на вас.",
      },
    ],
  },
};

// ---------- Урок 20 ----------

const TEAM_MEETING: LessonData["content"] = {
  ru: {
    helperCriteria:
      "роль, тема, длительность, контекст команды, формат результата",
    cards: [
      {
        type: "result",
        text: "План 30-минутной встречи с временем на каждый пункт, готовые ответы на возражения команды и короткое сообщение-итог после встречи.",
      },
      {
        type: "tool",
        tools: [CHATGPT, CLAUDE],
        text: "ChatGPT или Claude.",
      },
      {
        type: "howto",
        intro: "Три способа:",
        layout: "options",
        items: [
          {
            title: "Повестка",
            text: "Тема, длительность, участники, цель — AI распределит время по пунктам.",
          },
          {
            title: "Репетиция",
            text: "Попросите AI сыграть сотрудника, который против изменений, и потренируйтесь отвечать.",
          },
          {
            title: "Итог",
            text: "После встречи вставьте свои заметки — AI составит сообщение для команды с решениями и задачами.",
          },
        ],
      },
      {
        type: "quiz",
        situation: "AI составил повестку на 2 часа, а у вас 30 минут.",
        question: "Что сказать AI дальше?",
        options: [
          {
            text: "Попросить уложить в 30 минут и оставить 3 главных пункта",
            correct: true,
          },
          { text: "Удалить пункты вручную наугад", correct: false },
          { text: "Перенести встречу на 2 часа", correct: false },
        ],
        explanation:
          "Попросить уложить в 30 минут — AI сам выберет главное и перераспределит время.",
      },
      {
        type: "practice",
        improvedPrompt:
          "Я руководитель отдела из 6 человек. В пятницу встреча на 30 минут: обсуждаем переход на новый график смен, команда может быть недовольна. Составь повестку с временем на каждый пункт. Затем перечисли 5 возражений, которые могут прозвучать, и как спокойно на них ответить",
        followUp: {
          hint: "Бонус",
          prompt:
            "Теперь сыграй сотрудника, который против нового графика, — я потренируюсь отвечать",
        },
      },
      {
        type: "summary",
        formula:
          "Кто вы + тема и длительность + настроение команды + повестка с временем + возражения и ответы + репетиция",
      },
    ],
  },
};

// ---------- Урок 21 ----------

const TASK_BRIEF: LessonData["content"] = {
  ru: {
    helperCriteria:
      "результат, цель, срок, критерии готовности, ресурсы, контакт для вопросов",
    cards: [
      {
        type: "result",
        text: "Задача, которую сотрудник понимает с первого раза: какой результат, зачем, к какому сроку, как понять, что готово, и к кому идти с вопросами.",
      },
      {
        type: "tool",
        tools: [CHATGPT, CLAUDE],
        text: "ChatGPT или Claude.",
      },
      {
        type: "howto",
        intro: "Три способа:",
        layout: "options",
        items: [
          {
            title: "Из тезисов",
            text: "Напишите коротко, что нужно, — AI развернёт в понятную задачу.",
          },
          {
            title: "Из запроса сверху",
            text: "Вставьте сообщение директора или клиента — AI превратит его в задачу для сотрудника.",
          },
          {
            title: "Проверка",
            text: "Вставьте уже написанную задачу и попросите найти, что в ней может быть непонятно.",
          },
        ],
      },
      {
        type: "quiz",
        situation: "Задача: «Подготовь отчёт по продажам к пятнице».",
        question: "Что получится?",
        options: [
          {
            text: "Сотрудник сделает отчёт, но не тот, что вы ждали",
            correct: true,
          },
          { text: "Сотрудник сделает ровно то, что нужно", correct: false },
          { text: "Сотрудник откажется", correct: false },
        ],
        explanation:
          "Отчёт будет, но не тот — непонятно, за какой период, для кого и что в нём должно быть.",
      },
      {
        type: "practice",
        improvedPrompt:
          "Помоги поставить задачу сотруднику. Тезисы: отчёт по продажам за октябрь, нужен для встречи с директором в понедельник. Сформулируй: какой результат, зачем он нужен, срок, что должно быть в отчёте, где взять данные, к кому обращаться с вопросами. Тон дружелюбный. Затем перечисли вопросы, которые может задать сотрудник, — я отвечу на них заранее",
      },
      {
        type: "summary",
        formula:
          "Результат + зачем + срок + критерии готовности + где взять данные + к кому с вопросами",
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
  content?: LessonData["content"],
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
        QUESTIONS,
      ),
      lesson(
        "2",
        {
          ru: "Письмо или поздравление за 2 минуты",
          en: "A letter or greeting in 2 minutes",
          es: "Una carta o felicitación en 2 minutos",
        },
        1,
        GREETING,
      ),
      lesson(
        "3",
        {
          ru: "Разобраться в сложном документе",
          en: "Make sense of a complicated document",
          es: "Entender un documento complicado",
        },
        2,
        DOCUMENT,
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
        PORTRAIT,
      ),
      lesson(
        "6",
        {
          ru: "Логотип для маленького бизнеса",
          en: "A logo for a small business",
          es: "Un logo para un pequeño negocio",
        },
        2,
        LOGO,
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
        OLD_PHOTO,
      ),
      lesson(
        "8",
        {
          ru: "Видеопоздравление",
          en: "A video greeting",
          es: "Un video de felicitación",
        },
        2,
        VIDEO_GREETING,
      ),
      lesson(
        "9",
        {
          ru: "Короткий ролик для соцсетей",
          en: "A short video for social media",
          es: "Un video corto para redes sociales",
        },
        2,
        SOCIAL_VIDEO,
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
        TRAVEL_TRANSLATION,
      ),
      lesson(
        "11",
        {
          ru: "Озвучить текст голосом",
          en: "Turn text into speech",
          es: "Convertir un texto en voz",
        },
        2,
        VOICEOVER,
      ),
      lesson(
        "12",
        {
          ru: "Расшифровать голосовое сообщение или запись",
          en: "Transcribe a voice message or recording",
          es: "Transcribir un mensaje de voz o una grabación",
        },
        2,
        TRANSCRIPTION,
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
        SCAM_CALL,
      ),
      lesson(
        "14",
        {
          ru: "Поддельные фото и видео",
          en: "Fake photos and videos",
          es: "Fotos y videos falsos",
        },
        2,
        FAKES,
      ),
      lesson(
        "15",
        {
          ru: "Что нельзя рассказывать AI",
          en: "What not to tell AI",
          es: "Lo que no debes contarle a la IA",
        },
        1,
        PRIVACY,
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
        SPREADSHEET,
      ),
      lesson(
        "17",
        {
          ru: "Протокол встречи из записи разговора",
          en: "Meeting notes from a recording",
          es: "El acta de una reunión a partir de una grabación",
        },
        1,
        MEETING_NOTES,
      ),
      lesson(
        "18",
        {
          ru: "Деловое письмо за минуту",
          en: "A work email in one minute",
          es: "Un correo de trabajo en un minuto",
        },
        1,
        BUSINESS_EMAIL,
      ),
      lesson(
        "19",
        {
          ru: "Выжимка из длинного отчёта",
          en: "The key points of a long report",
          es: "Lo esencial de un informe largo",
        },
        1,
        REPORT_SUMMARY,
      ),
      lesson(
        "20",
        {
          ru: "Подготовка к встрече с командой",
          en: "Get ready for a team meeting",
          es: "Preparar una reunión con tu equipo",
        },
        1,
        TEAM_MEETING,
      ),
      lesson(
        "21",
        {
          ru: "Постановка задачи сотруднику",
          en: "Give a clear task to someone on your team",
          es: "Explicar bien una tarea a alguien de tu equipo",
        },
        1,
        TASK_BRIEF,
      ),
    ],
  },
];

// ---------- Урок и направление на нужном языке ----------

// ВРЕМЕННО: пока у уроков нет английского и испанского, показываем русский текст.
// Когда переводы будут готовы — вернуть "en".
const CONTENT_FALLBACK_LOCALE: Locale = "ru";

function localizeLesson(data: LessonData, locale: Locale): Lesson {
  return {
    id: data.id,
    title: data.title[locale],
    level: data.level,
    minutes: data.minutes,
    content: data.content?.[locale] ?? data.content?.[CONTENT_FALLBACK_LOCALE],
  };
}

export function getTracks(locale: Locale): Track[] {
  return TRACKS.map((track) => ({
    id: track.id,
    title: track.title[locale],
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

// Главный инструмент урока — первый в карточке tool. Нужен практике для кнопки «Открыть …».
export function getLessonTool(content: LessonContent): ToolLink | undefined {
  return content.cards.find((card) => card.type === "tool")?.tools[0];
}
