import type { LegalDocument } from "@/content/legal/types";

export const TERMS_EN: LegalDocument = {
  updated: "[TODO: date]",
  intro:
    "These terms are the rules for using the AI Navigator app and website. By using them, you agree to these terms.",
  sections: [
    {
      heading: "Who provides the service",
      paragraphs: [
        "AI Navigator is provided by [TODO: developer name or company], [TODO: country]. Contact: [TODO: email].",
      ],
    },
    {
      heading: "What AI Navigator is",
      paragraphs: [
        "AI Navigator is an educational app with short lessons on using AI tools, prompt templates and reminders. Lessons are for general education and are not professional (legal, financial, medical or other) advice.",
      ],
    },
    {
      heading: "Your account",
      paragraphs: [
        "You can use the app without an account. If you sign in with Apple or Google, keep access to that account safe. You can delete your account at any time in the app: Profile → Settings → Delete account.",
      ],
    },
    {
      heading: "Acceptable use",
      items: [
        "Use the app only for lawful purposes.",
        "Don't try to break, overload or get unauthorized access to the app or its servers.",
        "Don't copy and resell the lessons and templates as your own product.",
      ],
    },
    {
      heading: "Third-party AI services",
      paragraphs: [
        "Lessons teach you to use services that we don't own or control (for example ChatGPT, Gemini, Claude). Their own terms, prices and age limits apply. Results from AI can be wrong — check important information yourself.",
      ],
    },
    {
      heading: "Paid features",
      paragraphs: [
        "Some tracks may become available only with a subscription. Subscriptions are bought and managed through the App Store under Apple's terms; you can cancel them in iPhone Settings → your name → Subscriptions. [TODO: prices, trial, what's included — before launching subscriptions]",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "Lessons, templates, texts and design of AI Navigator belong to [TODO: owner]. You may use the templates for your own needs, including at work. The texts you create with AI tools belong to you, under the terms of those tools.",
      ],
    },
    {
      heading: "Disclaimer and limitation of liability",
      paragraphs: [
        "The app is provided “as is”. We do our best to keep it working and the lessons accurate, but we can't guarantee that it will always be available or error-free. To the extent permitted by law, we aren't liable for indirect damages arising from the use of the app or third-party AI services. Nothing in these terms limits your rights as a consumer under the law of your country.",
      ],
    },
    {
      heading: "Ending use",
      paragraphs: [
        "You can stop using the app and delete your account at any time. We may suspend access if these terms are seriously violated.",
      ],
    },
    {
      heading: "Changes and applicable law",
      paragraphs: [
        "We may update these terms; we'll change the date at the top and announce important changes in the app. These terms are governed by the law of [TODO: country].",
      ],
    },
  ],
};
