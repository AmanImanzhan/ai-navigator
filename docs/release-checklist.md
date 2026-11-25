# Чеклист перед релизом

Что сделать до публикации в App Store. Отмечайте `[x]`, когда готово.

## Проверки (CI)

- [ ] **CI зелёный** на коммите, из которого собирается релиз: GitHub → вкладка **Actions** →
  workflow **CI** → последний запуск на `main` с зелёной галочкой (typecheck, lint, тесты,
  `next build`). Красный — сначала починить, потом `eas build` и деплой.
- [ ] **Перед EAS-сборкой локально:** `npm test` в корне — все тесты проходят.
- [ ] **Защита ветки `main`** (по желанию, GitHub → Settings → Branches → Add rule): «Require status
  checks to pass» → `Typecheck, lint, test, build`. Тогда в `main` не попадёт код с красным CI.

## TestFlight (Задача 35)

Подготовлено в коде: версия 1.0.0, номер сборки ведёт EAS (`appVersionSource: remote`,
`autoIncrement`), `ITSAppUsesNonExemptEncryption = false` (вопрос об экспорте шифрования не
появится), Privacy Manifest (`ios.privacyManifests` в app.json — причины из манифестов библиотек),
языки en/ru/es для системных окон (`locales` → `languages/*.json`), dev-кнопки только в `__DEV__`,
в production-профиле нет dev-меню (`developmentClient` только у development). `.env` в сборку не
попадает (в `.gitignore`; проверено `eas build:inspect`) — ключи берутся из переменных EAS.

- [ ] **Переменные EAS** (из `apps/mobile`, окружения preview и production) — значения из
      `apps/mobile/.env`; `SENTRY_AUTH_TOKEN` — visibility **secret**, вводить в терминале,
      не в чат и не в git. Проверка: `npx eas-cli@latest env:list --environment production`.
      `EXPO_PUBLIC_API_URL` — адрес сайта на Netlify по https (`https://ai-navigator-app.netlify.app`,
      не адрес компьютера в сети).
- [ ] **Приложение создано в App Store Connect** (Мои приложения → «+» → Новое приложение,
      bundle id `com.amanimanzhan.ainavigator`, SKU любой). Apple ID приложения (число из
      «Информация о приложении») вписан в `apps/mobile/eas.json` → `submit.production.ios.ascAppId`
      вместо `REPLACE_WITH_APPLE_ID`.
- [ ] **Сборка:** `npx eas-cli@latest build --profile production --platform ios` → в логе шага
      «Bundle React Native code and images» — загрузка source maps в Sentry без ошибок.
- [ ] **Отправка:** `npx eas-cli@latest submit --platform ios --latest` → через 5–30 минут сборка в
      App Store Connect → TestFlight (статус «Обработка» → «Готово к тестированию»).
- [ ] **TestFlight → Внутреннее тестирование:** группа с собой (и командой) как тестировщиками.
- [ ] **RevenueCat → Integrations → Webhooks:** события для Sandbox **и** Production (в TestFlight
      все покупки — Sandbox; сервер принимает оба, `environment` сохраняется в `subscriptions`).
- [ ] **Письмо от Apple после загрузки** (ITMS-91053 и т.п. про Privacy Manifest) — если пришло,
      добавить указанные причины в `ios.privacyManifests` и пересобрать.
- [ ] **Проверка на iPhone по списку** из отчёта Задачи 35: вход Apple и Google, уроки и синхронизация,
      ИИ (лимит 3), покупка в Sandbox без списания, отмена, Sentry и PostHog с `production`.

## Локальная сборка iOS (если кончился лимит облачных сборок EAS)

Бесплатный тариф EAS — 15 облачных iOS-сборок; сборка на своём Mac их не тратит, отправка
(Expo Submit) входит в бесплатный тариф.

- [ ] **Инструменты:** Xcode 26.4+ (SDK 58), `xcode-select -p` → `/Applications/Xcode.app/…`,
      лицензия принята (`xcodebuild -license check` → 0; иначе `sudo xcodebuild -license accept`),
      Node `^22.13` / 24 / 26, npm 11.20.0, Homebrew, `brew install cocoapods fastlane`.
      Свободно 20+ ГБ.
- [ ] **Номер сборки:** `npx eas-cli@latest build:version:get -p ios --profile production` — сборка
      возьмёт «это число + 1». Если число больше последней загруженной сборки (неудачная попытка уже
      подняла счётчик), вернуть: `npx eas-cli@latest build:version:set -p ios --profile production`.
- [ ] **Сборка** (из `apps/mobile`, 20–40 минут):
      `npx eas-cli@latest build --platform ios --profile production --local --output ./build/AINavigator.ipa`.
      Переменные plaintext/sensitive окружения production EAS подтягивает сам; secret
      (`SENTRY_AUTH_TOKEN`) — нет, поэтому source maps не загружаются (сборка не падает).
      Сертификат и профиль — с серверов EAS (remote credentials).
- [ ] **Отправка:** `npx eas-cli@latest submit --platform ios --path ./build/AINavigator.ipa`.
      Запасной путь — приложение Transporter (Mac App Store): войти Apple ID → перетащить .ipa → Deliver.
- [ ] **Source maps для этой сборки** (по желанию): без токена Sentry покажет код без понятных строк.
- [ ] `apps/mobile/build/` — в `.gitignore` (.ipa в git не попадает).

## App Store (Задача 36): страница, анкеты, скриншоты

Тексты и ответы — в `docs/app-store/`: `listing.md` (страница, категории, адреса, заметки для
ревью), `privacy-answers.md` (App Privacy), `age-rating.md` (возрастной рейтинг).

- [x] **Сайт без заглушек** (правило 2.1(a)): `/privacy`, `/terms`, `/support` (en/ru/es) заполнены
      (Amangali Imanzhan, Грузия, imanzhanaman2@gmail.com, дата 1 декабря 2026), пометки «Черновик»
      нет. Тест `apps/web/src/content/legal/legal.test.ts` не даст вернуть `[TODO`.
      После деплоя открыть страницы и проверить глазами. Меняете текст — обновите дату.
- [x] **Согласие на отправку текста ИИ** (правило 5.1.2(i), «third-party AI»): лист
      `AiConsentSheet` перед первым запросом («Спросите AI» и «Заполнить с помощником»): что, кому
      (Anthropic, Claude), зачем, без обучения, удаление через 30 дней, ссылка на политику. Без
      согласия клиент (`lib/ai/client.ts`) не отправляет запрос. Хранится на телефоне с версией
      текста (`AI_CONSENT_VERSION`); отозвать — Настройки → Конфиденциальность → «AI-помощник».
- [ ] **Проверить согласие в TestFlight:** первый запрос → лист; «Не сейчас» → ничего не ушло
      (счётчик запросов не изменился); «Согласен» → ответ; в Настройках выключить → следующий
      запрос снова показывает лист. Изменили смысл текста листа — увеличить `AI_CONSENT_VERSION`.
- [ ] **App Information:** Name, Subtitle, Category (Education / Productivity), Privacy Policy URL —
      для EN, RU, Spanish (Mexico), Spanish (Spain); Content Rights — честно ответить,
      есть ли в приложении чужой контент (тексты уроков и справочника — наши).
- [ ] **Версия 1.0:** Promotional Text, Description, Keywords, Support URL, Marketing URL — из
      `listing.md`; Copyright — `2026 <имя или компания>`. Подписки (обе) прикреплены к версии в
      разделе In-App Purchases and Subscriptions.
- [ ] **App Privacy** — по `privacy-answers.md` → Publish. Совпадает с `/privacy`.
- [ ] **Age Rating** — по `age-rating.md`; Override → тот же возраст, что в `/privacy` («Children»).
- [ ] **App Review Information:** Sign-in required — No; Notes — из `listing.md`; контакты.
      Google-вход опубликован (Testing → In production), иначе ревьюер не войдёт через Google.
- [ ] **Скриншоты** — iPhone 6.9" (1320×2868), 3–10 штук на каждый язык; iPad не нужен
      (`supportsTablet` в app.json нет — приложение только для iPhone). Сборка для симулятора
      (облачный лимит не тратит, нужны CocoaPods):
      `cd apps/mobile && npx expo run:ios --configuration Release --device "iPhone 17 Pro Max"`
      (Release — без меню разработчика; 10–20 минут первый раз). Затем из корня:
      `bash scripts/app-store-screenshots.sh en` (и `ru`, `es` после смены языка в приложении).
      Файлы — в `apps/mobile/build/screenshots/` (не в git). Без личных данных на экране:
      войти тестовым Apple ID, в полях — выдуманные примеры.
- [ ] **Перед «Submit for Review»:** сборка выбрана (TestFlight прошла), Export Compliance —
      `usesNonExemptEncryption: false` уже в app.json; цена приложения — Free; страны доступности.

## Аккаунты и вход

- [ ] **Google Auth Platform → Branding:** App name `AI Navigator`, User support email и Developer
      contact — твоя почта; Application home page — `https://ai-navigator-app.netlify.app/`,
      Privacy policy — `…/privacy`, Terms of service — `…/terms`; Authorized domains —
      `ai-navigator-app.netlify.app` (netlify.app в Public Suffix List, поэтому поддомен считается
      отдельным доменом) и уже добавленный домен Supabase — не удалять (через него вход в админку).
      **Логотип не загружать:** логотип включает проверку бренда, а для неё все Authorized domains
      нужно подтвердить в Search Console — домен `*.supabase.co` подтвердить нельзя.
- [ ] **Google Auth Platform → Audience:** нажать **Publish app** → Confirm (статус Testing →
      In production). Пока Testing — войти через Google могут только тест-пользователи (и ревьюер
      Apple — нет!). Для scopes `openid`, `email`, `profile` проверка Google не нужна, публикация
      сразу. Проверка: войти через Google аккаунтом, которого нет в Test users.
- [x] **Удаление аккаунта в приложении** — требование App Store 5.1.1(v) (Задача 25.2):
      Настройки → «Удалить аккаунт»; Edge Function `delete-account` отзывает доступ Apple
      и удаляет пользователя (данные — каскадом); Google — `revokeAccess`; отзыв «Входа с Apple»
      в настройках iOS разлогинивает.
- [ ] **Секреты и деплой `delete-account`** для production-проекта Supabase:
      `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_CLIENT_ID`, `APPLE_PRIVATE_KEY`
      (`supabase secrets set`), затем `supabase functions deploy delete-account`.
      Проверить в логах функции, что нет записей «доступ Apple не отозван».

## Netlify (Задача 36): хостинг сайта и API

Переехали с Vercel: iOS-приложение в production не доставало до *.vercel.app (сервер, транспорт,
Sentry и сеть исключены). Адрес: `https://ai-navigator-app.netlify.app`.

- [ ] **Сайт создан из GitHub-репозитория:** Base directory — пусто, Package directory — `apps/web`;
      сборка, Node 24 и npm 11.20.0 — из `apps/web/netlify.toml`. Next.js собирает адаптер OpenNext
      (Netlify подключает сам).
- [ ] **Environment variables** (Production): `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`,
      `SUPABASE_SECRET_KEY`, `ANTHROPIC_API_KEY`, `REVENUECAT_WEBHOOK_SECRET`, `SENTRY_DSN`,
      `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_SITE_URL`; для source maps — `SENTRY_ORG`, `SENTRY_PROJECT`,
      `SENTRY_URL=https://de.sentry.io/`, `SENTRY_AUTH_TOKEN`. Секреты — с пометкой
      «Contains secret values». После изменения переменных — новый деплой.
- [ ] **Проверка:** `…/api/health` отвечает `ok` и `commit` — с Mac (curl) и с iPhone (Safari).
- [ ] **EAS:** `EXPO_PUBLIC_API_URL` (preview и production) → адрес Netlify, затем новая сборка.
- [ ] **RevenueCat:** вебхук → `https://ai-navigator-app.netlify.app/api/revenuecat/webhook`, Send test event → 200.
- [ ] **Supabase → URL Configuration:** Site URL и Redirect URL админки — на адрес Netlify.
- [ ] **ИИ в TestFlight работает** (usage, «Попробуй сам», «Заполнить»), вебхук — покупка в Sandbox.
- [ ] **Vercel удалить** только после всех проверок выше (до этого он — запасной вариант).
- [ ] **Лимиты Netlify:** функции — до 60 секунд (ИИ укладывается: `HOSTING_FUNCTION_LIMIT_MS` в
      `apps/web/src/lib/ai/config.ts`). Раз в месяц смотреть расход бесплатного тарифа (Usage).

## Сайт (apps/web)

- [ ] **Деплой на Netlify** — см. раздел «Netlify». Проверка: `…/api/health` отвечает `ok`.
- [ ] **Заполнить все `[TODO: …]`** в политике, условиях и поддержке
      (`apps/web/src/content/legal/*`, `support.email` в `src/i18n/dictionaries/*`): имя
      разработчика, страна, почта, дата, возраст, срок резервных копий, список сервисов.
      После этого убрать пометку «Черновик» (`legal.draftNote`).
- [ ] **App Store Connect:** Privacy Policy URL — `…/privacy`, Support URL — `…/support`,
      Marketing URL — главная.
- [ ] **Значок App Store** на главной вместо «Скоро в App Store» — после выхода приложения,
      по правилам Apple Marketing Guidelines.
- [x] **Иконка сайта:** `src/app/icon.png`, `favicon.ico`, `apple-icon.png` и картинки для ссылок
      `public/og/og-{en,ru,es}.png` — из рисунка робота (`npm run brand:assets`).
- [ ] **Свой домен** (по желанию) — затем `NEXT_PUBLIC_SITE_URL` на Netlify, Supabase URL
      Configuration, вебхук RevenueCat и `EXPO_PUBLIC_API_URL` (новая сборка приложения).

## ИИ-помощник (apps/web/src/app/api/ai)

- [ ] **Миграция лимитов** `20261117120000_ai_usage_limits.sql` применена (`npm run db:push`).
- [ ] **`ANTHROPIC_API_KEY` на Netlify** (Production) с пометкой **Contains secret values**,
      затем новый деплой. Ключ — только в `.env.local` и в Netlify, никогда в git и в приложении.
- [ ] **Лимит расходов в Anthropic Console** (Settings → Limits): месячный потолок, чтобы ошибка
      или злоупотребление не обошлись дорого. Включить уведомление о расходах.
- [x] **Дневной лимит:** 3 запроса без подписки, 30 с подпиской — `AI_DAILY_LIMITS` в
      `packages/shared/src/subscription.ts`. Какой применить, решает база (`consume_ai_request`).
- [x] **Тестовый пользователь** `ai-smoke@example.com` удалён. Вход по почте в Supabase выключен
      (только Apple и Google), поэтому `npm run ai:smoke` больше не может создать пользователя и
      получить токен. Для ручной проверки: временно включить Email (Authentication → Sign In /
      Providers), прогнать скрипт, затем `npm run ai:smoke -- --delete` и снова выключить Email.
- [ ] **Политика конфиденциальности:** заполнить `[TODO]` про срок хранения данных у Anthropic.
- [x] **Подключение в приложении** — Задача 28 (`apps/mobile/src/lib/ai`, `components/ai`).
- [x] **Подписка:** больше запросов для подписчиков — Задача 30 (см. «Подписка»).
- [x] **Кнопка «Больше запросов с Premium»** в `LimitReachedText`
      (`apps/mobile/src/components/ai/AiUsageNote.tsx`) и экран подписки `/paywall` — Задача 31.

## Подписка (RevenueCat, App Store)

- [ ] **Миграция** `20261119120000_subscriptions.sql` применена (`npm run db:push`), типы обновлены
      (`npm run db:types`). Сразу после неё — деплой сайта: старый сервер вызывает старую
      `consume_ai_request(p_limit)`, которой больше нет (пока не задеплоено, помощник отвечает ошибкой).
- [ ] **App Store Connect:** группа подписок «AI Navigator Premium», товары
      `ainavigator_premium_monthly` ($2.99) и `ainavigator_premium_yearly` ($19.99), пробный период
      3 дня (Introductory Offer → Free) у обоих, названия на en/ru/es, скриншот для проверки,
      статус Ready to Submit. Paid Apps Agreement — Active, банк и налоги заполнены.
- [ ] **Первую подписку отправить на проверку вместе с версией приложения** (App Store Connect →
      версия → In-App Purchases and Subscriptions → выбрать оба товара). Отдельно Apple первую
      подписку не принимает.
- [ ] **RevenueCat:** iOS-приложение с In-App Purchase Key (.p8), entitlement `premium` с обоими
      товарами, offering `default` (Monthly + Annual) — текущий. Project settings → Transfer behavior:
      **Transfer to new App User ID** (по умолчанию).
- [ ] **App Store Server Notifications** (App Store Connect → приложение → App Information):
      URL из RevenueCat (Apps → iOS-приложение → Apple Server to Server notification settings) для
      Production и Sandbox — так RevenueCat узнаёт об отменах и возвратах сразу.
- [ ] **Webhook RevenueCat** → `https://<домен>/api/revenuecat/webhook`, Authorization header =
      `Bearer <REVENUECAT_WEBHOOK_SECRET>`, окружение — Both. Кнопка Send test event → 200
      (в журнале функций Netlify: `revenuecat webhook: TEST → ignore:…`).
- [ ] **`REVENUECAT_WEBHOOK_SECRET` на Netlify** (Production) с пометкой **Contains secret values**,
      затем новый деплой. Секрет — длинная случайная строка (`openssl rand -hex 32`), только в Netlify,
      RevenueCat и
      `.env.local`; в git, чат и приложение — никогда.
- [ ] **Webhook работает:** покупка в Sandbox → строка в `subscriptions`
      (`select status, product_id, expires_at, environment from public.subscriptions;`), в приложении
      «Осталось N из 30». Выключение автопродления → `cancelled`, истечение → `expired` и снова «из 3».
- [ ] **Тестовые покупки в проде:** события из Sandbox (TestFlight, ревью Apple) тоже дают Premium —
      так задумано, чтобы ревьюер мог проверить подписку. Колонка `environment` показывает, какая это покупка.
- [x] **Временная панель «Подписка (тест)»** удалена (Задача 31): покупка — через `/paywall`,
      статус и «Восстановить покупки» — в Настройках → AI Navigator Premium.
- [ ] **Экран подписки проверен на iPhone** в Sandbox: цены в местной валюте, «3 дня бесплатно» только
      у тестера без истории покупок (после Clear Purchase History), ссылки на Условия и Политику
      открываются, крестик закрывает экран, крупный шрифт и VoiceOver — без обрезанного текста.
- [ ] **App Review → Notes** (App Store Connect → версия): где подписка — «Профиль → Настройки →
      AI Navigator Premium» или «Больше запросов с Premium», когда кончились 3 запроса; покупка
      требует входа через Apple. Указать, что все уроки бесплатные, а подписка увеличивает лимит ИИ.
- [ ] **App Store → App Privacy:** добавить «Покупки» (Purchase History) — их видит RevenueCat.
- [ ] **Скриншот для проверки товаров.** App Store Connect → оба товара (`ainavigator_premium_yearly`
      и `ainavigator_premium_monthly`) → «Информация для проверки»: сейчас стоит временный скриншот
      онбординга. Заменить на скриншот экрана подписки `/paywall` с ценой и кнопкой покупки, без кнопки
      dev-меню: release-сборка (TestFlight) или development-сборка со скрытым меню разработчика.
- [ ] **Срок пробного периода.** Вводные предложения (3 дня бесплатно) у обоих товаров созданы с датой
      окончания — до этой даты создать новое предложение, иначе пробный период пропадёт (экран подписки
      сам перестанет обещать пробный период: он берёт его из App Store).
- [ ] **Декларация AIGC** (контент, созданный ИИ) в App Store Connect — заполнить перед отправкой
      на проверку.

## Админка (apps/web/src/app/admin)

- [ ] **Миграция** `20261118120000_admin.sql` применена (`npm run db:push`), типы обновлены
      (`npm run db:types`).
- [ ] **Supabase → Authentication → URL Configuration:** Site URL — адрес сайта (сейчас
      `https://ai-navigator-app.netlify.app`); в Redirect URLs есть
      `https://<домен>/admin/auth/callback`. Перед релизом убрать `http://localhost:3000/**`.
      При смене домена — обновить оба поля.
- [ ] **`SUPABASE_SECRET_KEY` на Netlify** (Production) с пометкой **Contains secret values**,
      затем новый деплой.
      Только сервер; в приложении и в `NEXT_PUBLIC_` — никогда.
- [ ] **Список админов** проверен: `select a.user_id, u.email from public.admins a join auth.users u on u.id = a.user_id;`
      Лишних удалить: `delete from public.admins where user_id = '…';` (действует сразу).
- [ ] **Google Cloud → OAuth consent screen:** если приложение в статусе Testing, войти могут только
      тестовые пользователи — добавить почты команды (или опубликовать, вместе с приложением).
- [ ] **Журнал изменений** (`admin_audit_log`) растёт без ограничений — раз в год проверить размер.
- [ ] **Одновременная правка:** если двое правят один урок, сохранится последнее — договориться
      в команде или добавить проверку версии.

## Сборка и окружение

- [ ] **EAS environment variables** — все команды в разделе «TestFlight» (и в отчёте Задачи 35).
      Secret key Supabase и секреты RevenueCat в EAS не добавлять никогда. Если подключите свой
      домен — поменять `EXPO_PUBLIC_API_URL` и пересобрать (`EXPO_PUBLIC_` вшиваются при сборке).
- [x] **Заставка:** фон `#F8F5F0` (как у первого экрана), по центру иконка 160 pt, плавное исчезновение
      (`app.json` → `expo-splash-screen`, `SplashScreen.setOptions` в `_layout.tsx`). Окончательно проверить
      на release-сборке (TestFlight) — в development-сборке заставка может отличаться.
- [x] **Иконка приложения:** робот на оранжевом фоне. Исходники — `apps/mobile/assets/brand`
      (не менять руками), размеры генерирует `npm run brand:assets`. iOS — `icon.png` 1024×1024 без
      прозрачности; Android — адаптивная (фон, робот, одноцветная). Иконка шаблона (`assets/expo.icon`) удалена.
- [ ] **Icon Composer (по желанию):** для «стеклянного» вида iOS 26 и своих вариантов для тёмной и
      тонированной темы — собрать `.icon` в Icon Composer из слоёв (фон + робот) и указать в `ios.icon`.

## Ошибки и статистика (Sentry, PostHog)

- [ ] **Sentry: организация в регионе ЕС** (при регистрации — Data Storage Location: EU, адрес
      `de.sentry.io`). Два проекта: React Native (приложение) и Next.js (сайт).
- [ ] **Sentry → проекты → Settings → Security & Privacy:** включены Data Scrubber и
      «Prevent Storing of IP Addresses». Срок хранения совпадает с текстом в `/privacy`.
- [ ] **PostHog: проект в EU Cloud** (`eu.posthog.com`). Project settings: Autocapture — off,
      Session replay — off, Web analytics — off, «Discard client IP data» — on.
- [ ] **EAS environment variables и source maps приложения** — см. раздел «TestFlight» выше
      (все `EXPO_PUBLIC_*`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_URL` и секрет `SENTRY_AUTH_TOKEN`).
      Организация в EU, поэтому `SENTRY_URL=https://de.sentry.io/` обязателен: sentry-cli берёт адрес
      из того же места, что и токен (переменные EAS), иначе загрузка уходит на sentry.io.
- [ ] **Netlify → Environment variables (Production):** `SENTRY_DSN` и `NEXT_PUBLIC_SENTRY_DSN`
      (DSN проекта Next.js). По желанию для source maps: `SENTRY_ORG`, `SENTRY_PROJECT`,
      `SENTRY_URL=https://de.sentry.io/` и `SENTRY_AUTH_TOKEN` (Contains secret values). Затем новый деплой.
- [ ] **Проверка:** в production-сборке (TestFlight) ошибки и события приходят с environment
      `production` (Sentry → Issues; PostHog → свойство `environment` у событий). В development-сборке Настройки → Конфиденциальность → «Тест Sentry» → ошибка в
      Sentry (Issues, environment development). В PostHog → Activity появляются `app_opened`,
      `lesson_started` и просмотры экранов. Переключатель выключен — новых событий нет.
- [ ] **На сайте PostHog нет** (нет cookie-баннера). Добавлять аналитику на сайт — только с баннером
      согласия и обновлением `/privacy`.

## Данные и безопасность

- [x] **Платного контента нет.** Все уроки и шаблоны бесплатные (`tracks.premium = false`, приложение
      флаг не читает), поэтому RLS по подписке для уроков не нужна. По подписке — только лимит
      ИИ-помощника, его проверяет сервер (`consume_ai_request` по таблице `subscriptions`).
- [x] **Подписки пишет только сервер:** у `subscriptions` нет политик на запись, функции
      `apply_subscription_*` доступны только `service_role`; при удалении аккаунта строка удаляется
      каскадом. Подписку в App Store удаление не отменяет — приложение предупреждает.
- [x] **Политика конфиденциальности** — черновик на сайте (`/privacy`, `/ru/privacy`, `/es/privacy`):
      имя, почта, прогресс, сохранённые запросы, локальные уведомления, ИИ-помощник, подписка
      (Apple и RevenueCat), отчёты об ошибках (Sentry) и статистика (PostHog) — регион ЕС, что
      собираем и чего нет, как отключить. Осталось заполнить `[TODO: …]` (см. «Сайт»), в том числе
      срок хранения отчётов и статистики (как в настройках Sentry и PostHog).
- [x] **Условия использования** (`/terms`): подписка, цены, пробный период, автопродление, как
      отменить — по требованиям Apple. При смене цен — обновить текст.
- [ ] **App Store → App Privacy** (готовые ответы — `docs/app-store/privacy-answers.md`):
      заполнить, какие данные собираются (контактная информация,
      идентификатор пользователя, контент пользователя, покупки), а также:
      **Diagnostics** — Crash Data и Performance Data (Sentry); **Usage Data** — Product Interaction
      (PostHog). Для обоих: используется для App Functionality / Analytics, **связано с пользователем**
      (id аккаунта), **не используется для трекинга** (Tracking — No; IDFA и ATT не используем).
