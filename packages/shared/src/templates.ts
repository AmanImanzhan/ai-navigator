// Поля шаблона запроса — места в [квадратных скобках]: «Объясни, что такое [тема]».
// Та же логика, что getTemplateFields в apps/mobile/src/data/templates/index.ts.

const FIELD_PATTERN = /\[([^\]]+)\]/g;

// Поля по порядку, без повторов: "[имя] … [имя]" → ["имя"].
export function getTemplateFields(prompt: string): string[] {
  const names = Array.from(prompt.matchAll(FIELD_PATTERN), (match) => match[1]);
  return Array.from(new Set(names));
}
