# App Store Connect → App Privacy — ответы

Составлено по коду (ноябрь 2026) и определениям Apple
(<https://developer.apple.com/app-store/app-privacy-details/>). Если меняется то, что собираем, —
обновить и этот файл, и `/privacy` (en/ru/es).

## Что приложение отправляет с телефона (по коду)

| Куда | Что | Когда | Где в коде |
|---|---|---|---|
| Supabase (наш сервер, ЕС) | email и имя из Apple/Google, id аккаунта; профиль (язык, род занятий, минуты в день, напоминания вкл/выкл), пройденные уроки, сохранённые запросы (текст), счётчик ИИ-запросов, статус подписки | только после входа | `lib/auth`, `lib/sync`, миграции `supabase/migrations` |
| Наш API → Anthropic (США) | текст запроса к ИИ-помощнику / описание ситуации + id урока или шаблона. Id пользователя в Anthropic не уходит; Anthropic хранит данные API до 30 дней и не обучает на них модели | только после входа, по нажатию и после согласия (лист `AiConsentSheet`, правило 5.1.2(i)) | `lib/ai`, `apps/web/src/lib/ai` |
| RevenueCat (США) | id аккаунта (app user ID = Supabase id), покупки App Store | после входа, при покупке/восстановлении/проверке | `lib/purchases` |
| Sentry (ЕС) | отчёты о сбоях, ошибки, замеры скорости (10% в production), модель устройства, версии; id аккаунта (после входа). Без IP (`sendDefaultPii: false`), без текстов | если включено «Помогать улучшать приложение» | `lib/monitoring` |
| PostHog (ЕС) | события («урок открыт» и т. п.) с id уроков/шаблонов, язык, план; случайный id установки, после входа — id аккаунта. Без IP-геолокации, без autocapture и записи экрана | если включено «Помогать улучшать приложение» | `lib/analytics` |
| Только на телефоне (AsyncStorage) | прогресс, сохранённые запросы, настройки, напоминания (локальные уведомления) | всегда | `lib/storage.ts` |

Без отслеживания (tracking): нет рекламы, нет IDFA и ATT, данные не объединяются с чужими данными для
рекламы и не передаются брокерам данных. Вход через Google (Google Sign-In SDK) — только для
входа.

## Шаги анкеты

**Шаг 1. «Do you or your third-party partners collect data from this app?»** → **Yes, we collect data from this app.**

**Шаг 2. Типы данных — отметить:**

| Категория | Тип | Почему |
|---|---|---|
| Contact Info | **Name** | имя из Apple/Google → `profiles.full_name` |
| Contact Info | **Email Address** | email аккаунта (в т. ч. скрытый адрес Apple) |
| User Content | **Other User Content** | сохранённые запросы (синхронизация) и тексты для ИИ-помощника |
| Identifiers | **User ID** | id аккаунта: Supabase, RevenueCat, Sentry, PostHog |
| Identifiers | **Device ID** | случайный id установки в PostHog до входа (Apple: «other device-level ID») |
| Purchases | **Purchase History** | подписка: RevenueCat и `subscriptions` |
| Usage Data | **Product Interaction** | события PostHog |
| Diagnostics | **Crash Data** | Sentry |
| Diagnostics | **Performance Data** | Sentry, замеры скорости |
| Diagnostics | **Other Diagnostic Data** | ошибки без сбоя (Sentry, в т. ч. ошибки ИИ-запросов) |

**Не отмечать:** Phone, Physical Address, Health, Fitness, Financial (Payment Info — оплату обрабатывает
Apple, мы её не видим), Location (геолокация PostHog выключена, IP Sentry не хранит), Sensitive Info,
Contacts, Emails or Text Messages, Photos/Videos, Audio, Gameplay, Customer Support (поддержка — по
почте, не в приложении), Browsing History, Search History (поиск по шаблонам не отправляется),
Advertising Data, Other Usage Data, Surroundings, Body, Other Data.

> Profile (род занятий, минуты в день) Apple отдельным типом не выделяет; это настройки, которые
> выбирает человек, — их покрывает App Functionality у User ID. Если хотите максимально осторожно —
> отметьте ещё «Other Data Types» → App Functionality, Linked, No tracking.

**Шаг 3. Для каждого типа — цели, связь с личностью, отслеживание.**

| Тип | Цели (Purposes) | Linked to user? | Used for tracking? |
|---|---|---|---|
| Name | App Functionality | Yes | No |
| Email Address | App Functionality | Yes | No |
| Other User Content | App Functionality | Yes | No |
| User ID | App Functionality, Analytics | Yes | No |
| Device ID | Analytics | Yes | No |
| Purchase History | App Functionality, Analytics | Yes | No |
| Product Interaction | Analytics | Yes | No |
| Crash Data | App Functionality | Yes | No |
| Performance Data | App Functionality | Yes | No |
| Other Diagnostic Data | App Functionality | Yes | No |

Почему везде «Linked: Yes»: после входа и Sentry, и PostHog получают id аккаунта, RevenueCat — тоже
(а аккаунт содержит email). Apple считает такие данные связанными с личностью. «Purchase History →
Analytics» — RevenueCat требует отмечать обе цели (их документация по App Privacy).
Цели «Third-Party Advertising», «Developer's Advertising or Marketing», «Product Personalization»
не отмечать: рекламы и маркетинговых рассылок нет; подбор уроков по роду занятий происходит на
телефоне.

**Шаг 4.** Publish — карточка «Data Linked to You» покажет: Contact Info, User Content, Identifiers,
Purchases, Usage Data, Diagnostics. «Data Used to Track You» — пусто.

## Если человек выключил «Помогать улучшать приложение»

Переключатель (Профиль → Настройки → Конфиденциальность) отключает PostHog (optOut) и Sentry
(beforeSend отбрасывает события). Тогда фактически не уходят: **Product Interaction, Device ID,
Crash Data, Performance Data, Other Diagnostic Data** (и User ID в Sentry/PostHog).

В анкете это **ничего не меняет**: анкета описывает приложение, а не одного человека, и по
умолчанию переключатель включён. Исключение Apple «Product Improvement Programs» к нам не подходит
— оно требует, чтобы сбор был выключен по умолчанию (явное согласие) и данные не были связаны с
личностью. Если когда-нибудь сделать переключатель выключенным по умолчанию и убрать id аккаунта из
Sentry/PostHog — тогда эти типы можно будет не указывать.

Без входа в аккаунт тоже не уходят Name, Email, Other User Content, Purchase History — но и это в
анкете не влияет: вход есть в приложении.

## Где ещё должно совпадать

- `/privacy` (en/ru/es) — те же сервисы и типы данных; срок хранения Anthropic (до 30 дней) и
  согласие на ИИ описаны в разделе про AI-помощника.
- Privacy Manifest (`ios.privacyManifests` в app.json) — причины API; типы собираемых данных в
  манифесте приходят из SDK (Sentry, PostHog, RevenueCat) и должны не противоречить анкете.
