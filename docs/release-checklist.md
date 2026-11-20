# Чеклист перед релизом

Что сделать до публикации в App Store. Отмечайте `[x]`, когда готово.

## Проверки (CI)

- [ ] **CI зелёный** на коммите, из которого собирается релиз: GitHub → вкладка **Actions** →
  workflow **CI** → последний запуск на `main` с зелёной галочкой (typecheck, lint, тесты,
  `next build`). Красный — сначала починить, потом `eas build` и деплой.
- [ ] **Перед EAS-сборкой локально:** `npm test` в корне — все тесты проходят.
- [ ] **Защита ветки `main`** (по желанию, GitHub → Settings → Branches → Add rule): «Require status
  checks to pass» → `Typecheck, lint, test, build`. Тогда в `main` не попадёт код с красным CI.

## Аккаунты и вход

- [ ] **Google Auth Platform → Branding:** Application home page — `https://<проект>.vercel.app/`,
      Privacy policy — `…/privacy`, Terms of service — `…/terms`; в Authorized domains — домен сайта.
      (По желанию) логотип: логотип и название на экране согласия требуют проверки бренда —
      заложите несколько дней; для неё лучше свой домен, а не *.vercel.app.
- [ ] **Google Auth Platform → Audience:** нажать **Publish app** (сейчас Testing — войти могут
      только тест-пользователи). Для scopes `openid`, `email`, `profile` полная проверка Google
      не нужна.
- [x] **Удаление аккаунта в приложении** — требование App Store 5.1.1(v) (Задача 25.2):
      Настройки → «Удалить аккаунт»; Edge Function `delete-account` отзывает доступ Apple
      и удаляет пользователя (данные — каскадом); Google — `revokeAccess`; отзыв «Входа с Apple»
      в настройках iOS разлогинивает.
- [ ] **Секреты и деплой `delete-account`** для production-проекта Supabase:
      `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_CLIENT_ID`, `APPLE_PRIVATE_KEY`
      (`supabase secrets set`), затем `supabase functions deploy delete-account`.
      Проверить в логах функции, что нет записей «доступ Apple не отозван».

## Сайт (apps/web)

- [ ] **Деплой на Vercel** (Root Directory `apps/web`) и переменные `SUPABASE_URL`,
      `SUPABASE_PUBLISHABLE_KEY` для Production и Preview. Проверка: `…/api/health` отвечает `ok`.
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
- [ ] **Свой домен** (по желанию) — затем `NEXT_PUBLIC_SITE_URL` на Vercel.
- [ ] **Тариф Vercel.** Hobby разрешён только для некоммерческих проектов. Перед запуском платной
      подписки перейти на Vercel Pro (или на другой хостинг).

## ИИ-помощник (apps/web/src/app/api/ai)

- [ ] **Миграция лимитов** `20261117120000_ai_usage_limits.sql` применена (`npm run db:push`).
- [ ] **`ANTHROPIC_API_KEY` на Vercel** (Production, при желании Preview) с пометкой **Sensitive**,
      затем Redeploy. Ключ — только в `.env.local` и в Vercel, никогда в git и в приложении.
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
      (в журнале Vercel: `revenuecat webhook: TEST → ignore:…`).
- [ ] **`REVENUECAT_WEBHOOK_SECRET` на Vercel** (Production) с пометкой **Sensitive**, затем Redeploy.
      Секрет — длинная случайная строка (`openssl rand -hex 32`), только в Vercel, RevenueCat и
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
- [ ] **Тариф Vercel Pro** перед запуском подписки (см. «Сайт»).
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
      `https://ai-navigator-omega-dusky.vercel.app`); в Redirect URLs есть
      `https://<домен>/admin/auth/callback`. Перед релизом убрать `http://localhost:3000/**`.
      При смене домена — обновить оба поля.
- [ ] **`SUPABASE_SECRET_KEY` на Vercel** (Production) с пометкой **Sensitive**, затем Redeploy.
      Только сервер; в приложении и в `NEXT_PUBLIC_` — никогда.
- [ ] **Список админов** проверен: `select a.user_id, u.email from public.admins a join auth.users u on u.id = a.user_id;`
      Лишних удалить: `delete from public.admins where user_id = '…';` (действует сразу).
- [ ] **Google Cloud → OAuth consent screen:** если приложение в статусе Testing, войти могут только
      тестовые пользователи — добавить почты команды (или опубликовать, вместе с приложением).
- [ ] **Журнал изменений** (`admin_audit_log`) растёт без ограничений — раз в год проверить размер.
- [ ] **Одновременная правка:** если двое правят один урок, сохранится последнее — договориться
      в команде или добавить проверку версии.

## Сборка и окружение

- [ ] **EAS environment variables** для `preview` и `production`
      (из `apps/mobile`):
      ```bash
      npx eas-cli@latest env:set --name EXPO_PUBLIC_SUPABASE_URL --value "https://<ref>.supabase.co" --environment preview --environment production --visibility plaintext
      npx eas-cli@latest env:set --name EXPO_PUBLIC_SUPABASE_KEY --value "sb_publishable_…" --environment preview --environment production --visibility sensitive
      npx eas-cli@latest env:set --name EXPO_PUBLIC_API_URL --value "https://ai-navigator-omega-dusky.vercel.app" --environment preview --environment production --visibility plaintext
      npx eas-cli@latest env:set --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "appl_…" --environment preview --environment production --visibility plaintext
      ```
      `EXPO_PUBLIC_API_URL` — адрес сайта с API ИИ-помощника, без `/` в конце. Если подключите
      свой домен — указать его и пересобрать (переменные `EXPO_PUBLIC_` вшиваются при сборке).
      `EXPO_PUBLIC_REVENUECAT_IOS_KEY` — публичный iOS-ключ RevenueCat (`appl_…`), его можно
      вшивать в приложение. Secret key Supabase и секреты RevenueCat в EAS не добавлять никогда.
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
- [ ] **EAS environment variables** (из `apps/mobile`, preview и production):
      ```bash
      npx eas-cli@latest env:set --name EXPO_PUBLIC_SENTRY_DSN --value "https://…ingest.de.sentry.io/…" --environment preview --environment production --visibility plaintext
      npx eas-cli@latest env:set --name EXPO_PUBLIC_POSTHOG_KEY --value "phc_…" --environment preview --environment production --visibility plaintext
      npx eas-cli@latest env:set --name SENTRY_ORG --value "<slug организации>" --environment preview --environment production --visibility plaintext
      npx eas-cli@latest env:set --name SENTRY_PROJECT --value "<slug проекта приложения>" --environment preview --environment production --visibility plaintext
      ```
- [ ] **Source maps приложения (Задача 35):** секрет `SENTRY_AUTH_TOKEN` (Sentry → Settings →
      Auth Tokens → Organization token) в EAS только для preview и production, visibility **secret**:
      `npx eas-cli@latest env:set --name SENTRY_AUTH_TOKEN --value "sntrys_…" --environment preview --environment production --visibility secret`.
      Для development не нужен (`app.config.ts` выключает загрузку). Без токена сборка не падает,
      но в отчётах будут непонятные строки кода. В git и в чат токен не попадает.
- [ ] **Vercel → Environment Variables (Production):** `SENTRY_DSN` и `NEXT_PUBLIC_SENTRY_DSN`
      (DSN проекта Next.js). По желанию для source maps: `SENTRY_ORG`, `SENTRY_PROJECT`,
      `SENTRY_AUTH_TOKEN` (Sensitive). Затем Redeploy.
- [ ] **Проверка:** в development-сборке Настройки → Конфиденциальность → «Тест Sentry» → ошибка в
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
- [ ] **App Store → App Privacy:** заполнить, какие данные собираются (контактная информация,
      идентификатор пользователя, контент пользователя, покупки), а также:
      **Diagnostics** — Crash Data и Performance Data (Sentry); **Usage Data** — Product Interaction
      (PostHog). Для обоих: используется для App Functionality / Analytics, **связано с пользователем**
      (id аккаунта), **не используется для трекинга** (Tracking — No; IDFA и ATT не используем).
