# Страница в App Store — тексты (EN, RU, ES)

Куда вставлять: App Store Connect → приложение → **Distribution → App Information** (Name, Subtitle,
Category, Privacy Policy URL) и **iOS App → версия 1.0** (Promotional Text, Description, Keywords,
Support URL, Marketing URL, What's New — для 1.0 поля What's New нет, см. ниже).

Тексты — только о том, что есть в приложении 1.0: 21 урок в 7 темах, 100+ шаблонов запросов,
справочник (15 инструментов, 12 понятий), ИИ-помощник после бесплатного входа (3 запроса в день,
с Premium — 30), напоминания, синхронизация через аккаунт. Названия чужих сервисов (ChatGPT и т. п.)
в Name/Subtitle/Keywords не ставим — правило 2.3.7 (чужие товарные знаки в метаданных).

Длины проверены скриптом (символы, как считает App Store Connect): Name ≤ 30, Subtitle ≤ 30,
Promotional Text ≤ 170, Description ≤ 4000, Keywords ≤ 100. Меняете текст — проверьте длину
снова (в App Store Connect счётчик есть под каждым полем).

## Адреса (проверены curl → 200)

| Поле | Адрес |
|---|---|
| Privacy Policy URL | EN `https://ai-navigator-app.netlify.app/privacy` · RU `https://ai-navigator-app.netlify.app/ru/privacy` · ES `https://ai-navigator-app.netlify.app/es/privacy` |
| Support URL | EN `https://ai-navigator-app.netlify.app/support` · RU `…/ru/support` · ES `…/es/support` |
| Marketing URL | EN `https://ai-navigator-app.netlify.app/` · RU `…/ru` · ES `…/es` |
| Terms of Use (EULA) | `https://ai-navigator-app.netlify.app/terms` — ссылка есть в конце описания (Apple требует её для подписок: в описании или в поле License Agreement) |

Перед отправкой на ревью: на `/support` должна быть настоящая почта, а на `/privacy` и `/terms` — ни
одного `[TODO]` и без пометки «Черновик» (правило 2.1(a): никаких заглушек).

## Категория

- **Основная: Education.** Приложение — курс: уроки по порядку, проверочные вопросы, практика,
  прогресс. Это то, что человек ищет («научиться пользоваться ИИ»).
- **Дополнительная: Productivity.** Шаблоны запросов и ИИ-помощник решают рабочие задачи (письма,
  таблицы, протоколы встреч) — так приложение находят и те, кто ищет «инструмент для работы».

Не Utilities (это не утилита) и не Reference (справочник — только часть приложения).

---

## English (U.S.) — основной язык

### Name (≤30)
```
AI Navigator
```

### Subtitle (≤30)
```
Short AI lessons for real life
```

### Promotional Text (≤170)
```
Learn to use AI for everyday tasks: short lessons, ready-made prompts and an AI helper that reviews your prompts. All lessons and templates are free.
```

### Description (≤4000)
```
AI can do more than you think — AI Navigator shows you how, step by step, without technical jargon.

Each lesson takes 5–10 minutes and ends with something real: a letter, a greeting card, a logo, a short video, a translated conversation or a clear work email. You learn which tool to use, how to ask it, and what to do when the answer isn't right.

WHAT'S INSIDE
• 21 practical lessons in 7 topics: writing, images, video, voice and translation, safety, office work and managing a team
• 100+ ready-made prompt templates: fill in the blanks, copy, and paste into any AI tool
• A guide to popular AI tools and key concepts in plain language
• Quick checks and practice in every lesson
• A safety track: how to spot fake photos and videos, scam calls from a “relative”, and what not to tell AI
• Lessons picked for you: office work, managing people, your own business, studying or retirement
• An optional daily reminder at the time you choose

AI HELPER IN THE APP
Sign in for free with Apple or Google to ask AI right inside a lesson. It answers your prompt and shows what already works and what to improve. In templates, describe your situation in your own words and the helper fills in the fields for you.

• Free: 3 AI helper requests a day
• AI Navigator Premium: 30 requests a day

Lessons, templates and the guide stay free — with or without Premium.

YOUR PROGRESS, YOUR DATA
• Use the app without an account: progress stays on your phone
• Sign in to keep progress and saved prompts on all your devices
• No ads. You can turn off anonymous statistics in Settings
• Delete your account in the app at any time

Available in English, Russian and Spanish.

AI NAVIGATOR PREMIUM
Premium raises the AI helper limit from 3 to 30 requests a day. Monthly ($2.99) and yearly ($19.99) plans; U.S. prices, the price in your country is shown in the app. Both plans include a 3-day free trial for eligible new subscribers. Payment is charged to your Apple ID. The subscription renews automatically unless you cancel it at least 24 hours before the end of the current period. Manage or cancel it in your App Store account settings.

Terms of Use: https://ai-navigator-app.netlify.app/terms
Privacy Policy: https://ai-navigator-app.netlify.app/privacy
```

### Keywords (≤100, без пробелов, без слов из названия)
```
chatbot,prompts,assistant,lessons,learn,beginners,templates,artificial intelligence,course,writing
```

### What's New
Для первой версии 1.0 Apple поле «What's New» не показывает (оно появляется с первого обновления).
Текст для 1.0.1 и запасной:
```
Welcome to AI Navigator! Short lessons, 100+ prompt templates and an AI helper to learn AI step by step.
```

---

## Русский

### Name (≤30)
```
AI Navigator
```

### Subtitle (≤30)
```
Короткие уроки по нейросетям
```

### Promotional Text (≤170)
```
Научитесь пользоваться ИИ в обычной жизни: короткие уроки, готовые запросы и ИИ-помощник, который разберёт ваш запрос. Все уроки и шаблоны бесплатные.
```

### Description (≤4000)
```
ИИ умеет больше, чем кажется. AI Navigator шаг за шагом показывает, как им пользоваться — без технических терминов.

Урок занимает 5–10 минут, а в конце у вас настоящий результат: письмо, открытка, логотип, короткое видео, перевод разговора или понятное рабочее письмо. Вы узнаете, какой инструмент выбрать, как его попросить и что делать, если ответ не подошёл.

ЧТО ВНУТРИ
• 21 практический урок в 7 темах: тексты, картинки, видео, голос и перевод, безопасность, офисная работа и управление командой
• 100+ готовых шаблонов запросов: заполните пропуски, скопируйте и вставьте в любой ИИ-сервис
• Справочник по популярным ИИ-инструментам и главным понятиям простыми словами
• Проверочные вопросы и практика в каждом уроке
• Тема «Безопасность»: как распознать поддельные фото и видео, звонок «родственника» в беде и что не стоит рассказывать ИИ
• Уроки под вас: офис, руководство людьми, свой бизнес, учёба или пенсия
• Ежедневное напоминание в удобное время — по желанию

ИИ-ПОМОЩНИК В ПРИЛОЖЕНИИ
Войдите бесплатно через Apple или Google — и спрашивайте ИИ прямо в уроке. Он ответит на ваш запрос и подскажет, что уже хорошо, а что улучшить. В шаблонах опишите ситуацию своими словами — помощник сам заполнит поля.

• Бесплатно: 3 запроса к ИИ-помощнику в день
• AI Navigator Premium: 30 запросов в день

Уроки, шаблоны и справочник бесплатны — с Premium и без.

ВАШ ПРОГРЕСС И ВАШИ ДАННЫЕ
• Можно без аккаунта: прогресс хранится на телефоне
• Войдите, чтобы прогресс и сохранённые запросы были на всех ваших устройствах
• Без рекламы. Анонимную статистику можно выключить в настройках
• Аккаунт можно удалить в приложении в любой момент

Языки: английский, русский и испанский.

AI NAVIGATOR PREMIUM
Premium увеличивает лимит ИИ-помощника с 3 до 30 запросов в день. Подписка на месяц ($2.99) или на год ($19.99) — цены для США, цена в вашей стране показана в приложении. У обоих планов есть бесплатный пробный период 3 дня для новых подписчиков (право на него определяет Apple). Оплата списывается с Apple ID. Подписка продлевается автоматически, если не отменить её минимум за 24 часа до конца текущего периода. Управлять подпиской и отменить её можно в настройках учётной записи App Store.

Условия использования: https://ai-navigator-app.netlify.app/ru/terms
Политика конфиденциальности: https://ai-navigator-app.netlify.app/ru/privacy
```

### Keywords (≤100)
```
нейросети,ии,чат бот,промпты,уроки,обучение,для начинающих,шаблоны,искусственный интеллект,помощник
```

### What's New
```
Добро пожаловать в AI Navigator! Короткие уроки, 100+ шаблонов запросов и ИИ-помощник — осваивайте ИИ шаг за шагом.
```

---

## Español (México и España)

В App Store Connect добавьте обе локализации — **Spanish (Mexico)** (её видят в США и Латинской
Америке) и **Spanish (Spain)** — с одинаковым текстом ниже.

### Name (≤30)
```
AI Navigator
```

### Subtitle (≤30)
```
IA fácil en lecciones cortas
```

### Promotional Text (≤170)
```
Aprende a usar la IA en tu día a día: lecciones cortas, prompts listos y un asistente de IA que revisa tus prompts. Todas las lecciones y plantillas son gratis.
```

### Description (≤4000)
```
La IA puede hacer más de lo que crees. AI Navigator te enseña a usarla paso a paso, sin tecnicismos.

Cada lección dura 5–10 minutos y termina con algo real: una carta, una tarjeta de felicitación, un logotipo, un video corto, una conversación traducida o un correo de trabajo claro. Aprendes qué herramienta usar, cómo pedírselo y qué hacer si la respuesta no sirve.

QUÉ INCLUYE
• 21 lecciones prácticas en 7 temas: textos, imágenes, video, voz y traducción, seguridad, trabajo de oficina y gestión de equipos
• Más de 100 plantillas de prompts: completa los espacios, copia y pega en cualquier herramienta de IA
• Una guía de herramientas de IA populares y conceptos clave en palabras sencillas
• Preguntas rápidas y práctica en cada lección
• Tema de seguridad: cómo detectar fotos y videos falsos, llamadas de estafa de un «familiar» y qué no contarle a la IA
• Lecciones para ti: oficina, dirigir personas, tu propio negocio, estudios o jubilación
• Un recordatorio diario opcional a la hora que elijas

ASISTENTE DE IA EN LA APP
Inicia sesión gratis con Apple o Google para preguntar a la IA dentro de la lección. Responde a tu prompt y te muestra qué funciona y qué mejorar. En las plantillas, describe tu situación con tus palabras y el asistente completa los campos.

• Gratis: 3 consultas al asistente de IA al día
• AI Navigator Premium: 30 consultas al día

Las lecciones, plantillas y la guía siguen siendo gratis, con o sin Premium.

TU PROGRESO, TUS DATOS
• Usa la app sin cuenta: el progreso se queda en tu teléfono
• Inicia sesión para tener tu progreso y prompts guardados en todos tus dispositivos
• Sin anuncios. Puedes desactivar las estadísticas anónimas en Ajustes
• Elimina tu cuenta desde la app cuando quieras

Disponible en inglés, ruso y español.

AI NAVIGATOR PREMIUM
Premium sube el límite del asistente de IA de 3 a 30 consultas al día. Planes mensual ($2.99) y anual ($19.99); precios de EE. UU., el precio en tu país se muestra en la app. Ambos planes incluyen una prueba gratis de 3 días para nuevos suscriptores que cumplan los requisitos. El pago se carga a tu Apple ID. La suscripción se renueva automáticamente salvo que la canceles al menos 24 horas antes del final del periodo actual. Gestiónala o cancélala en los ajustes de tu cuenta del App Store.

Términos de uso: https://ai-navigator-app.netlify.app/es/terms
Política de privacidad: https://ai-navigator-app.netlify.app/es/privacy
```

### Keywords (≤100)
```
inteligencia artificial,ia,chatbot,prompts,lecciones,aprender,principiantes,plantillas,asistente
```

### What's New
```
¡Bienvenido a AI Navigator! Lecciones cortas, más de 100 plantillas de prompts y un asistente de IA para aprender paso a paso.
```

---

## App Review Information → Notes (по-английски)

Поле: версия 1.0 → **App Review Information**. Sign-in required — **No** (уроки работают без входа),
демо-аккаунт не нужен: вход только через Sign in with Apple и Google, почты с паролем в приложении нет —
ревьюер входит своим Apple ID. Contact Information — твои имя, телефон, почта.

```
AI Navigator teaches non-technical people to use AI tools through short lessons.

NO ACCOUNT NEEDED FOR LESSONS
Lessons, prompt templates and the Guide work without signing in.

SIGN IN (only needed for the AI helper and subscription)
Profile tab → "Sign in to save your progress" → Sign in with Apple (or Google). There is no email/password sign-in, so no demo account is needed: please use Sign in with Apple. Account deletion: Profile → Settings → Delete account.

AI HELPER (generated by Anthropic's Claude via our server)
1) Lessons tab → open lesson 1 → scroll to "Ask AI right here" → tap "Ask AI".
2) Prompts tab → open any template → "Fill in with the helper".
Free users get 3 requests per day (the counter is shown under the button).
Before the first AI request the app shows a consent sheet: what text is sent, to whom (Anthropic, Claude), why, that Anthropic doesn't train on it and deletes it within 30 days, with a link to the Privacy Policy. Nothing is sent until the user taps "I agree". Consent can be withdrawn in Profile → Settings → Privacy → "AI assistant".

IN-APP PURCHASE (auto-renewable subscription "AI Navigator Premium")
Profile → Settings → "AI Navigator Premium", or after the 3 free requests tap "More requests with Premium". Premium only raises the AI helper limit from 3 to 30 requests per day; all content stays free. Both plans (monthly, yearly) have a 3-day free trial for eligible users. Restore purchases is on the same screens.

The app has no ads and does not track users (no IDFA).
```

