# Чеклист перед релизом

Что сделать до публикации в App Store. Отмечайте `[x]`, когда готово.

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
- [ ] **Иконка сайта:** сейчас заглушка `apps/web/src/app/icon.svg`.
- [ ] **Свой домен** (по желанию) — затем `NEXT_PUBLIC_SITE_URL` на Vercel.
- [ ] **Тариф Vercel.** Hobby разрешён только для некоммерческих проектов. Перед запуском платной
      подписки перейти на Vercel Pro (или на другой хостинг).

## ИИ-помощник (apps/web/src/app/api/ai)

- [ ] **Миграция лимитов** `20261117120000_ai_usage_limits.sql` применена (`npm run db:push`).
- [ ] **`ANTHROPIC_API_KEY` на Vercel** (Production, при желании Preview) с пометкой **Sensitive**,
      затем Redeploy. Ключ — только в `.env.local` и в Vercel, никогда в git и в приложении.
- [ ] **Лимит расходов в Anthropic Console** (Settings → Limits): месячный потолок, чтобы ошибка
      или злоупотребление не обошлись дорого. Включить уведомление о расходах.
- [ ] **Дневной лимит** `FREE_DAILY_LIMIT` (`apps/web/src/lib/ai/config.ts`) — проверить значение;
      для подписчиков — больше (после подключения подписки).
- [ ] **Удалить тестового пользователя** `ai-smoke@example.com`: `npm run ai:smoke -- --delete`.
- [ ] **Политика конфиденциальности:** заполнить `[TODO]` про срок хранения данных у Anthropic.
- [ ] **Подключение в приложении** — Задача 28.

## Сборка и окружение

- [ ] **EAS environment variables** для `preview` и `production`
      (из `apps/mobile`):
      ```bash
      npx eas-cli@latest env:set --name EXPO_PUBLIC_SUPABASE_URL --value "https://<ref>.supabase.co" --environment preview --environment production --visibility plaintext
      npx eas-cli@latest env:set --name EXPO_PUBLIC_SUPABASE_KEY --value "sb_publishable_…" --environment preview --environment production --visibility sensitive
      ```
      Secret key в EAS не добавлять никогда.
- [ ] **Заставка:** сейчас синяя `#208AEF` из шаблона (`app.json` → плагин `expo-splash-screen`) —
      заменить на цвета приложения и свою картинку.
- [ ] **Иконка приложения:** сейчас иконка из шаблона (`assets/images/icon.png`, `assets/expo.icon`).

## Данные и безопасность

- [ ] **Платный контент читается всеми.** RLS для `lessons` и `lesson_translations` проверяет
      только `published`, а не подписку. Перед запуском подписки: отдавать содержимое платных
      направлений только подписчикам (RLS по таблице `subscriptions` или выдача через сервер).
- [x] **Политика конфиденциальности** — черновик на сайте (`/privacy`, `/ru/privacy`, `/es/privacy`):
      имя, почта, прогресс, сохранённые запросы, локальные уведомления, планы (ИИ-помощник,
      подписка, аналитика). Осталось заполнить `[TODO: …]` (см. «Сайт»).
- [ ] **App Store → App Privacy:** заполнить, какие данные собираются (контактная информация,
      идентификатор пользователя, контент пользователя).
