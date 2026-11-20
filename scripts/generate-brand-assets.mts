// Иконки, заставка и картинки сайта из одного рисунка (робот на оранжевом фоне).
//
// Исходники (не меняются): apps/mobile/assets/brand/ai-navigator-icon-1024.png и .svg.
// Запуск из корня: npm run brand:assets — перезаписывает только сгенерированные файлы ниже.
//
// Приложение (apps/mobile/assets/images):
//   icon.png                     — иконка iOS: 1024×1024, без прозрачности (так требует Apple);
//   android-icon-background.png  — адаптивная иконка Android: фон (оранжевый градиент);
//   android-icon-foreground.png  — адаптивная иконка Android: робот без фона;
//   android-icon-monochrome.png  — Android 13+: одноцветная иконка (только контуры);
//   splash-icon.png              — заставка: иконка со скруглёнными углами;
//   favicon.png                  — web-версия приложения.
// Сайт (apps/web):
//   src/app/icon.png, src/app/favicon.ico, src/app/apple-icon.png — иконки вкладки и iPhone;
//   public/og/og-{en,ru,es}.png — картинка для ссылок в соцсетях и мессенджерах (1200×630).

import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const BRAND = path.join(ROOT, "apps/mobile/assets/brand");
const MOBILE_IMAGES = path.join(ROOT, "apps/mobile/assets/images");
const WEB_APP = path.join(ROOT, "apps/web/src/app");
const WEB_OG = path.join(ROOT, "apps/web/public/og");

const SIZE = 1024;
// Цвета из дизайн-системы (CLAUDE.md): фон приложения и основной текст.
const BG = "#F8F5F0";
const TEXT = "#2A1E18";
const TEXT_SECONDARY = "#6E625B";
// Скругление углов как у иконок iOS (≈ 22,4% стороны).
const CORNER_RATIO = 0.2237;

// ---------- Исходники ----------

const iconPng = await readFile(path.join(BRAND, "ai-navigator-icon-1024.png"));
const iconSvg = await readFile(path.join(BRAND, "ai-navigator-icon.svg"), "utf8");

// Фон рисунка — первый <rect> на весь квадрат. Без него остаётся робот на прозрачном фоне.
const BG_RECT = '<rect width="1024" height="1024" fill="url(#bg)"/>';
if (!iconSvg.includes(BG_RECT)) {
  throw new Error("В SVG не найден фон — проверьте ai-navigator-icon.svg");
}
const robotSvg = Buffer.from(iconSvg.replace(BG_RECT, ""));
const backgroundSvg = Buffer.from(
  iconSvg.replace(/<g filter="url\(#wob\)">[\s\S]*<\/g><\/svg>\s*$/, "</svg>"),
);

function roundedMask(size: number): Buffer {
  const r = Math.round(size * CORNER_RATIO);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="#fff"/></svg>`,
  );
}

// Иконка нужного размера со скруглёнными углами (прозрачные углы).
async function roundedIcon(size: number): Promise<Buffer> {
  return sharp(iconPng)
    .resize(size, size)
    .composite([{ input: roundedMask(size), blend: "dest-in" }])
    .png()
    .toBuffer();
}

// ---------- Приложение ----------

async function mobileAssets() {
  await mkdir(MOBILE_IMAGES, { recursive: true });

  // iOS: квадрат без прозрачности — углы скругляет сама система.
  await sharp(iconPng)
    .resize(SIZE, SIZE)
    .removeAlpha()
    .png()
    .toFile(path.join(MOBILE_IMAGES, "icon.png"));

  // Android: фон и передний план одного размера (108×108 dp → 1024 px).
  // Видна только середина (≈ 66%), поэтому робот уменьшен до 66% и прижат к низу:
  // корпус уходит за край, как на исходной иконке, а пузырь и рука остаются в видимой зоне.
  await sharp(backgroundSvg)
    .resize(SIZE, SIZE)
    .png()
    .toFile(path.join(MOBILE_IMAGES, "android-icon-background.png"));

  const robotSize = Math.round(SIZE * 0.66);
  const robot = await sharp(robotSvg).resize(robotSize, robotSize).png().toBuffer();
  const foreground = await sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: robot, left: Math.round((SIZE - robotSize) / 2), top: SIZE - robotSize }])
    .png()
    .toBuffer();
  await writeFile(path.join(MOBILE_IMAGES, "android-icon-foreground.png"), foreground);

  // Одноцветная иконка: остаются только тёмные контуры (система сама красит их в цвет темы).
  const { data, info } = await sharp(foreground).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const luminance = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
    const ink = Math.max(0, Math.min(1, (0.6 - luminance) / 0.4));
    data[i + 3] = Math.round(data[i + 3] * ink);
    data[i] = data[i + 1] = data[i + 2] = 255;
  }
  await sharp(data, { raw: info }).png().toFile(path.join(MOBILE_IMAGES, "android-icon-monochrome.png"));

  // Заставка: иконка со скруглёнными углами на фоне приложения (размер задаёт app.json).
  await writeFile(path.join(MOBILE_IMAGES, "splash-icon.png"), await roundedIcon(SIZE));

  await writeFile(path.join(MOBILE_IMAGES, "favicon.png"), await roundedIcon(48));
}

// ---------- Сайт ----------

// favicon.ico из PNG-картинок 16, 32 и 48 (формат ICO позволяет хранить PNG внутри).
async function icoFile(sizes: number[]): Promise<Buffer> {
  const images = await Promise.all(sizes.map((size) => roundedIcon(size)));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map((image, index) => {
    const entry = Buffer.alloc(16);
    const size = sizes[index];
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(image.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += image.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images]);
}

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Слоганы — как home.title в apps/web/src/i18n/dictionaries (поменяли там — поменяйте здесь).
const OG_TEXTS = {
  en: ["Learn to use AI —", "one short lesson", "at a time"],
  ru: ["Научитесь", "пользоваться AI —", "по одному короткому", "уроку"],
  es: ["Aprende a usar la IA,", "una lección corta", "cada vez"],
} as const;

// Картинка для ссылок: 1200×630, иконка слева, название и слоган справа.
async function ogImage(lines: readonly string[]): Promise<Buffer> {
  const width = 1200;
  const height = 630;
  const iconSize = 400;
  const textX = 540;
  const lineHeight = 64;
  const titleY = 175;
  const sloganTop = titleY + 95;
  const font = "Helvetica Neue, Helvetica, Arial, sans-serif";
  const slogan = lines
    .map(
      (line, index) =>
        `<text x="${textX}" y="${sloganTop + index * lineHeight}" font-family="${font}" font-size="52" font-weight="600" fill="${TEXT}">${escapeXml(line)}</text>`,
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${BG}"/>
    <text x="${textX}" y="${titleY}" font-family="${font}" font-size="44" font-weight="700" fill="${TEXT_SECONDARY}">AI Navigator</text>
    ${slogan}
  </svg>`;
  return sharp(Buffer.from(svg))
    .composite([
      { input: await roundedIcon(iconSize), left: 80, top: Math.round((height - iconSize) / 2) },
    ])
    .png()
    .toBuffer();
}

async function webAssets() {
  await writeFile(path.join(WEB_APP, "icon.png"), await roundedIcon(512));
  await writeFile(path.join(WEB_APP, "favicon.ico"), await icoFile([16, 32, 48]));
  // apple-touch-icon: без прозрачности — iPhone сам скругляет углы.
  await sharp(iconPng).resize(180, 180).removeAlpha().png().toFile(path.join(WEB_APP, "apple-icon.png"));

  await mkdir(WEB_OG, { recursive: true });
  for (const [lang, lines] of Object.entries(OG_TEXTS)) {
    await writeFile(path.join(WEB_OG, `og-${lang}.png`), await ogImage(lines));
  }
}

await mobileAssets();
await webAssets();
console.log("Готово: иконки, заставка и картинки сайта обновлены.");
