#!/usr/bin/env bash
# Скриншоты для App Store с симулятора iPhone 17 Pro Max (6.9", 1320×2868 — обязательный размер).
#
# Что делает: включает симулятор, ставит «красивый» статус-бар (9:41, полная батарея, сеть),
# затем по Enter снимает экран в apps/mobile/build/screenshots/<язык>/NN-имя.png
# (папка в .gitignore). Сборку НЕ запускает: приложение должно быть уже установлено на симулятор
# (см. docs/release-checklist.md → «App Store» → «Скриншоты»).
#
# Запуск из корня репозитория:
#   bash scripts/app-store-screenshots.sh en
#   bash scripts/app-store-screenshots.sh ru
#   bash scripts/app-store-screenshots.sh es
# Перед каждым языком переключи язык в приложении: Профиль → Язык.

set -euo pipefail

LANG_CODE="${1:-en}"
DEVICE="${DEVICE:-iPhone 17 Pro Max}"
OUT_DIR="apps/mobile/build/screenshots/${LANG_CODE}"

# Экраны по порядку — те же, что в плане в чеклисте.
SHOTS=(
  "01-lessons:Вкладка «Уроки» — список тем и уроков"
  "02-lesson:Урок — карточка «Что получится» с примером результата"
  "03-ask-ai:Урок — «Спросите AI прямо здесь» с ответом и разбором"
  "04-fill:Шаблон — «Заполнить с помощником», поля заполнены"
  "05-templates:Вкладка «Промпты» — список шаблонов"
  "06-guide:Справочник — страница инструмента или понятия"
)

mkdir -p "$OUT_DIR"

UDID="$(xcrun simctl list devices available | grep -F "    ${DEVICE} (" | head -1 | sed -E 's/.*\(([0-9A-F-]{36})\).*/\1/')"
if [[ -z "$UDID" ]]; then
  echo "Симулятор «${DEVICE}» не найден. Список: xcrun simctl list devices available" >&2
  exit 1
fi

xcrun simctl boot "$UDID" 2>/dev/null || true
open -a Simulator --args -CurrentDeviceUDID "$UDID"
xcrun simctl bootstatus "$UDID" -b >/dev/null

xcrun simctl status_bar "$UDID" override \
  --time "9:41" --dataNetwork wifi --wifiMode active --wifiBars 3 \
  --cellularMode active --cellularBars 4 --batteryState charged --batteryLevel 100

echo "Симулятор: ${DEVICE} (${UDID}). Язык снимков: ${LANG_CODE}. Папка: ${OUT_DIR}"
for entry in "${SHOTS[@]}"; do
  name="${entry%%:*}"
  hint="${entry#*:}"
  read -r -p "Открой: ${hint}. Enter — снять, s — пропустить: " answer
  [[ "$answer" == "s" ]] && continue
  file="${OUT_DIR}/${name}.png"
  xcrun simctl io "$UDID" screenshot --type=png "$file" >/dev/null
  # App Store не принимает прозрачность: если у PNG есть альфа-канал — пересохраняем в JPEG.
  if [[ "$(sips -g hasAlpha "$file" | awk '/hasAlpha/ {print $2}')" == "yes" ]]; then
    sips -s format jpeg "$file" --out "${file%.png}.jpg" >/dev/null && rm "$file"
    file="${file%.png}.jpg"
  fi
  size="$(sips -g pixelWidth -g pixelHeight "$file" | awk '/pixel/ {print $2}' | paste -sd x -)"
  echo "  ✓ ${file} (${size})"
done

xcrun simctl status_bar "$UDID" clear
echo "Готово. Нужный размер для 6.9\": 1320x2868."
