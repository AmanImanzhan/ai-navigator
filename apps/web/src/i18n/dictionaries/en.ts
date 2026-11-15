import type { Dictionary } from "@/i18n/dictionaries/types";

export const EN: Dictionary = {
  meta: {
    siteName: "AI Navigator",
    homeTitle: "AI Navigator — learn to use AI in short lessons",
    homeDescription:
      "Short, practical lessons that teach anyone to use AI tools: write texts, create images, edit video and voice, and stay safe online.",
    privacyTitle: "Privacy Policy",
    privacyDescription:
      "What data AI Navigator collects, why, where it is stored and how to delete it.",
    termsTitle: "Terms of Use",
    termsDescription: "The rules for using the AI Navigator app and website.",
    supportTitle: "Support",
    supportDescription:
      "How to contact AI Navigator support and how to delete your account.",
  },
  nav: {
    home: "Home",
    support: "Support",
    privacy: "Privacy",
    terms: "Terms",
    language: "Language",
  },
  footer: {
    rights: "All rights reserved.",
  },
  home: {
    eyebrow: "For people who aren't tech experts",
    title: "Learn to use AI — one short lesson at a time",
    lead: "AI Navigator teaches practical AI skills in lessons of 5–10 minutes. No jargon: you learn by doing real everyday tasks — at work and at home.",
    appStoreSoon: "Coming soon to the App Store",
    audienceTitle: "Who it's for",
    audienceText:
      "For anyone who has heard about AI but doesn't know where to start:",
    audience: [
      "Office workers who want to save time on routine tasks",
      "Managers who prepare reports, meetings and plans",
      "Small business owners who write texts and make visuals themselves",
      "Students who want to learn faster",
      "Retirees who want to stay up to date",
    ],
    benefitsTitle: "Why AI Navigator",
    benefits: [
      {
        title: "Short and practical",
        text: "Each lesson takes 5–10 minutes and ends with a real task you try in a real AI tool.",
      },
      {
        title: "Ready-made prompts",
        text: "105 prompt templates: fill in the blanks, copy and get a good result the first time.",
      },
      {
        title: "Safety first",
        text: "Learn to spot scams and deepfakes and keep your personal data out of the wrong hands.",
      },
      {
        title: "Your pace, your progress",
        text: "Gentle daily reminders if you want them. Sign in to keep your progress on a new phone.",
      },
    ],
    languagesNote: "Available in English, Russian and Spanish.",
  },
  legal: {
    draftNote:
      "Draft. This document is being prepared and will be finalized before the app launches.",
    updated: "Last updated",
  },
  support: {
    title: "Support",
    lead: "Questions, problems or ideas? We're happy to help.",
    contactTitle: "Contact us",
    contactText: "Write to us and we'll reply as soon as we can:",
    email: "[TODO: support email]",
    faqTitle: "Common questions",
    faq: [
      {
        question: "How do I delete my account?",
        answer: [
          "In the app, open Profile → Settings → Delete account and confirm. If you signed in with Apple, you'll be asked to confirm with Apple once more.",
          "Your account, lesson progress, saved prompts and settings are deleted from our servers right away. This can't be undone.",
          "Deleting your account doesn't cancel an App Store subscription. To cancel it: iPhone Settings → your name → Subscriptions.",
          "If you can't use the app, email us from the address linked to your account and we'll delete it for you.",
        ],
      },
      {
        question: "How do I keep my progress on a new phone?",
        answer: [
          "Sign in with the same Apple or Google account on the new phone. Your progress and saved prompts will load automatically.",
        ],
      },
      {
        question: "Do I need an account?",
        answer: [
          "No. Everything works without an account — your progress is stored only on your phone. An account is needed only to keep your progress on another device.",
        ],
      },
      {
        question: "Reminders don't arrive",
        answer: [
          "Check that reminders are on in the app (Settings → Reminders) and that notifications for AI Navigator are allowed in iPhone Settings → Notifications.",
          "If you already completed a lesson today, we won't remind you that day.",
        ],
      },
    ],
  },
};
