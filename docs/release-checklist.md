# Чеклист перед релизом

Что сделать до публикации в App Store. Отмечайте `[x]`, когда готово.

## Аккаунты и вход

- [ ] **Google Auth Platform → Branding:** домашняя страница приложения, ссылка на политику
      конфиденциальности, (по желанию) логотип. Логотип и название на экране согласия требуют
      проверки бренда — заложите несколько дней.
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
- [ ] **Политика конфиденциальности** — нужна и для App Store, и для Google. Указать, что храним:
      имя, почту, прогресс, сохранённые запросы.
- [ ] **App Store → App Privacy:** заполнить, какие данные собираются (контактная информация,
      идентификатор пользователя, контент пользователя).
