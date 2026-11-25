// Юридический документ на одном языке. Если в тексте появится «[TODO: …]» — на странице
// он подсвечивается, а тест legal.test.ts не даст выпустить такой текст.

// Порядок на странице: абзацы → список → абзацы после списка.
export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
  afterItems?: string[];
};

export type LegalDocument = {
  // Дата последнего изменения — обновлять при каждой правке текста.
  updated: string;
  intro: string;
  sections: LegalSection[];
};
