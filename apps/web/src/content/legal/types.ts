// Юридический документ на одном языке. Места, где нужны данные владельца,
// помечены в тексте как «[TODO: …]» — на странице они подсвечиваются.

// Порядок на странице: абзацы → список → абзацы после списка.
export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
  afterItems?: string[];
};

export type LegalDocument = {
  // Дата последнего изменения. Пока «[TODO: …]» — заполнить перед публикацией.
  updated: string;
  intro: string;
  sections: LegalSection[];
};
