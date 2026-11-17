// Данные, из которых собираются системные промпты. Всё берётся из базы, не из запроса человека.

export type TryPromptContext = {
  lessonTitle: string;
  // Чему учит урок (skill из содержимого урока).
  skill: string | null;
  // Что должно быть в хорошем запросе (helperCriteria из содержимого урока).
  criteria: string | null;
  // Строка-разделитель ответа и разбора.
  marker: string;
};

export type FillPromptContext = {
  templateTitle: string;
  purpose: string;
  // Текст шаблона с полями в [квадратных скобках].
  templatePrompt: string;
  fields: string[];
};
