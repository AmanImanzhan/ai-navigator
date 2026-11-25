# App Store Connect → Age Rating — ответы

Где: App Store Connect → приложение → **Distribution → App Information → Age Rating → Edit**.
Анкета Apple (новая система рейтингов 4+ / 9+ / 13+ / 16+ / 18+, вопросы про возможности
приложения, медицину, «Dating and Relationships» и др.). Apple отдельно просит учитывать **ИИ-помощников
и чат-боты**: ответы по частоте контента — с учётом того, что может написать ИИ.
Справка: <https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions/>.

## Что в приложении важно для рейтинга

- Уроки и шаблоны — наш текст, проверенный в админке. Тема «Безопасность» рассказывает о
  мошенничестве (звонок «родственника», поддельные фото и видео) — без насилия и сцен.
- ИИ-помощник (Claude от Anthropic) отвечает на запрос человека в рамках урока или шаблона:
  системный промпт держит роль «помощник в обучающем приложении», опасные и незаконные запросы
  отклоняет (`apps/web/src/lib/ai/prompts`). Это не «компаньон», не ролевая игра, ответы видит только
  автор запроса.
- Между пользователями нет общения и обмена контентом; рекламы нет; геолокации нет.
- Ссылки «Открыть сайт» (инструменты в справочнике и уроках) и наши Условия/Политика открываются во
  встроенном Safari (SFSafariViewController) на конкретном адресе; адресной строки и поиска нет.

## Ответы

**1. In-App Controls**
| Вопрос | Ответ | Почему |
|---|---|---|
| Parental Controls | No | нет родительского контроля |
| Age Assurance | No | возраст не проверяем |

**2. Capabilities**
| Вопрос | Ответ | Почему |
|---|---|---|
| Unrestricted Web Access | **No** | нет браузера с адресной строкой; открываем только заданные ссылки |
| User-Generated Content | No | то, что пишет человек, никто другой не видит |
| Social Media | No | |
| Messaging and Chat | No | нет общения между людьми; ИИ-помощник — не чат с людьми |
| Shared Location | No | |
| Advertising | No | рекламы нет |

> Если ревьюер сочтёт встроенный браузер «неограниченным доступом к вебу», рейтинг станет 16+.
> Ответ «No» — обычная практика для приложений, которые открывают конкретные ссылки в Safari View.

**3. Mature Themes** — все **None**
(Profanity or Crude Humor, Horror/Fear Themes, Alcohol/Tobacco/Drug Use or References, Dating and
Relationships — **No**: ИИ не виртуальный компаньон).

**4. Medical or Wellness**
| Вопрос | Ответ |
|---|---|
| Medical or Treatment Information | None |
| Health or Wellness Topics | No |

**5. Sexuality or Nudity** — все **None**.

**6. Violence** — все **None** (Cartoon/Fantasy, Realistic, Prolonged Graphic, Guns or Other Weapons).

**7. Chance-Based Activities** — Gambling **No**, Simulated Gambling **None**, Contests **None**,
Loot Boxes **No**.

**8. Additional Information**
- Made for Kids — **Not Applicable** (не для детей).
- **Override to Higher Age Rating — 13+** (рекомендация, решение за тобой, см. ниже).
- Age Suitability URL — пусто.

## Итог

- **Рассчитанный рейтинг: 4+** (ни одного пункта выше 4+).
- **Рекомендуемый: 13+ через Override.** Причины:
  1. В политике конфиденциальности стоит «не для детей младше [TODO: 13 или 16]». Apple: если
     ваши условия задают минимальный возраст выше рассчитанного рейтинга — нужно поднять рейтинг
     через Override. Выберешь 16 в политике → Override 16+.
  2. ИИ-помощник отвечает на свободный текст: даже с ограничениями изредка возможны ответы не для
     маленьких детей. Apple прямо просит учитывать ИИ.
  3. Anthropic допускает использование своих моделей несовершеннолетними в чужих продуктах только с
     дополнительными мерами безопасности — проще не ориентироваться на детей.
- Итоговая анкета и `/privacy` («Children») должны говорить одно и то же.
