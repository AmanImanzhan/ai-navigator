# Чеклист перед релизом

Что сделать до публикации в App Store. Отмечайте `[x]`, когда готово.

## Аккаунты и вход

- [ ] **Google Auth Platform → Branding:** домашняя страница приложения, ссылка на политику
      конфиденциальности, (по желанию) логотип. Логотип и название на экране согласия требуют
      проверки бренда — заложите несколько дней.
- [ ] **Google Auth Platform → Audience:** нажать **Publish app** (сейчас Testing — войти могут
      только тест-пользователи). Для scopes `openid`, `email`, `profile` полная проверка Google
      не нужна.
- [ ] **Удаление аккаунта в приложении** — требование App Store (Задача 25):
  - кнопка «Удалить аккаунт» в Профиле с подтверждением; предупредить, что подписка
    App Store сама не отменяется;
  - для Apple: перед удалением ещё раз вызвать вход Apple и получить свежий
    `authorizationCode` (Supabase токены Apple при нативном входе не хранит);
  - серверная функция (Edge Function или Next.js API, с secret key): проверить пользователя,
    обменять `authorizationCode` на токен и отозвать его через Apple `/auth/revoke`
    (нужен ключ `.p8` с Sign in with Apple, Team ID, Key ID), затем
    `auth.admin.deleteUser` — данные удалятся каскадом;
  - в приложении после удаления — выход и сброс данных на телефоне;
  - `addRevokeListener` из `expo-apple-authentication`: если человек отключил вход через
    Apple в настройках iOS — выйти из аккаунта.

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
