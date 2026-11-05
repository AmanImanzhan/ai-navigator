import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/i18n/locales/en.json";
import es from "@/i18n/locales/es.json";
import ru from "@/i18n/locales/ru.json";
import { installPluralRulesFallback } from "@/i18n/pluralRules";
import { useAppStore } from "@/store/useAppStore";

installPluralRulesFallback();

export const defaultNS = "translation";

export const resources = {
  en: { translation: en },
  ru: { translation: ru },
  es: { translation: es },
} as const;

// Свой экземпляр i18next; initReactI18next передаёт его в useTranslation.
const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: useAppStore.getState().language,
  fallbackLng: "en",
  defaultNS,
  // Переводы уже в памяти — подключаемся сразу, без ожидания.
  initAsync: false,
  // React сам защищает текст, экранировать не нужно.
  interpolation: { escapeValue: false },
});

// Язык живёт в useAppStore. Как только он меняется (выбор, загрузка из памяти, сброс) —
// переключаем переводы, и все экраны с useTranslation перерисуются.
useAppStore.subscribe((state, previous) => {
  if (state.language !== previous.language) {
    i18n.changeLanguage(state.language);
  }
});

export default i18n;
