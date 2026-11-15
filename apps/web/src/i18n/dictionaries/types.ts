// Тексты сайта на одном языке. Все три словаря обязаны иметь одинаковую форму —
// TypeScript не даст забыть перевод.

export type Benefit = {
  title: string;
  text: string;
};

export type FaqItem = {
  question: string;
  // Абзацы ответа.
  answer: string[];
};

export type Dictionary = {
  meta: {
    siteName: string;
    homeTitle: string;
    homeDescription: string;
    privacyTitle: string;
    privacyDescription: string;
    termsTitle: string;
    termsDescription: string;
    supportTitle: string;
    supportDescription: string;
  };
  nav: {
    home: string;
    support: string;
    privacy: string;
    terms: string;
    language: string;
  };
  footer: {
    rights: string;
  };
  home: {
    eyebrow: string;
    title: string;
    lead: string;
    appStoreSoon: string;
    audienceTitle: string;
    audienceText: string;
    audience: string[];
    benefitsTitle: string;
    benefits: Benefit[];
    languagesNote: string;
  };
  legal: {
    draftNote: string;
    updated: string;
  };
  support: {
    title: string;
    lead: string;
    contactTitle: string;
    contactText: string;
    // Почта поддержки. Пока не заполнена — показываем пометку TODO.
    email: string;
    faqTitle: string;
    faq: FaqItem[];
  };
};
