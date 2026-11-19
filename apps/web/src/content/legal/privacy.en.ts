import type { LegalDocument } from "@/content/legal/types";

export const PRIVACY_EN: LegalDocument = {
  updated: "[TODO: date]",
  intro:
    "This policy explains what data the AI Navigator app and website collect, why, where it is stored and how you can delete it. We collect as little as possible: the app works fully without an account.",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        "AI Navigator is developed by [TODO: developer name or company], [TODO: country]. Contact: [TODO: email].",
      ],
    },
    {
      heading: "If you use the app without an account",
      paragraphs: [
        "Your progress, saved prompts, settings and reminder settings are stored only on your phone. We don't receive them.",
        "To show lessons, the app downloads lesson texts from our server. Like any server, it may briefly record technical data such as your IP address and the time of the request.",
      ],
    },
    {
      heading: "If you sign in",
      paragraphs: [
        "You can sign in with Apple or Google to keep your progress on another device. Then we store:",
      ],
      items: [
        "Your name and email address from Apple or Google. Apple lets you hide your email: then we only receive a private relay address.",
        "An identifier of your Apple or Google account, so we can recognize you next time.",
        "Your lesson progress and the dates you completed lessons.",
        "The prompts you saved in the app — this is text you wrote yourself, so please don't put personal or sensitive information in it.",
        "Your answers from the app's first screens: language, what you do, and how much time per day you want to study.",
      ],
    },
    {
      heading: "Reminders",
      paragraphs: [
        "Daily reminders are scheduled on your phone itself (local notifications). We don't use push notifications and don't receive any notification tokens. You can turn reminders off in the app or in iPhone Settings.",
      ],
    },
    {
      heading: "AI assistant",
      paragraphs: [
        "In lessons you can use the built-in AI assistant: it answers a prompt you wrote and briefly reviews it, or suggests values for the fields of a prompt template. The assistant is available only after you sign in.",
        "To generate an answer, the text you send to the assistant (your prompt or the description of your situation), together with the lesson or template it belongs to, is sent to Anthropic, the company that makes the Claude AI models. Under Anthropic's commercial terms, this data isn't used to train their models. [TODO: check how long Anthropic keeps API data]",
        "We don't store the text of your requests or the assistant's answers. We only store how many times you used the assistant today (to apply the daily limit) and a technical record of each use, without its content, for up to 2 days.",
        "Please don't include personal data in your requests: document or card numbers, phone numbers, addresses.",
      ],
    },
    {
      heading: "AI tools in lessons",
      paragraphs: [
        "Lessons link to third-party AI services (for example ChatGPT, Gemini, Claude). We don't send your data to them. When you use those services, their own privacy policies apply.",
      ],
    },
    {
      heading: "Subscription (AI Navigator Premium)",
      paragraphs: [
        "You can buy the AI Navigator Premium subscription in the app (it raises the AI assistant's daily limit). The subscription is bought through the App Store: payment is handled by Apple — we never see your card details or your Apple ID.",
        "To check the subscription, the app uses RevenueCat (RevenueCat, Inc., USA). The app sends RevenueCat your AI Navigator account identifier (a random code, without your name or email) and the App Store purchase information from your device. RevenueCat also receives technical data about the device and the app, such as the system version and the App Store country. [TODO: check against RevenueCat's privacy guide]",
        "From RevenueCat we receive and store only: the subscription status (trial, active, cancelled, expired), the plan (monthly or yearly), the end date and whether it was a test purchase. We use this only to apply the AI assistant's daily limit.",
      ],
    },
    {
      heading: "Planned features",
      paragraphs: [
        "We'll update this policy before launching:",
      ],
      items: [
        "Analytics: [TODO: currently none; describe the tool if added].",
      ],
    },
    {
      heading: "Why we use your data",
      items: [
        "To provide the app and keep your progress across devices (performance of our agreement with you).",
        "To keep the service secure and fix errors (our legitimate interest).",
        "To answer your support requests.",
      ],
      afterItems: [
        "We don't sell your data, don't show ads and don't use your data to train AI models.",
      ],
    },
    {
      heading: "Where your data is stored",
      items: [
        "Supabase — our database and sign-in service, servers in the EU (Frankfurt, Germany).",
        "Apple and Google — when you sign in with them, according to their policies.",
        "Vercel — hosting of this website.",
        "Anthropic — generates the AI assistant's answers (servers in the USA).",
        "RevenueCat — checks the App Store subscription (servers in the USA).",
      ],
      afterItems: ["[TODO: check the list of service providers before launch]"],
    },
    {
      heading: "How long we keep it and how to delete it",
      paragraphs: [
        "We keep your account data until you delete your account. In the app: Profile → Settings → Delete account. Your account, progress, saved prompts and settings are deleted from our servers right away; if you signed in with Apple, we also revoke the app's access to your Apple ID. The subscription record is deleted too, but the App Store subscription itself is not cancelled — cancel it in iPhone Settings → your name → Subscriptions. RevenueCat keeps the purchase history linked to the random account code; write to us if you want it deleted.",
        "Server backups may keep data for up to [TODO: number of days] days after deletion.",
        "Data stored only on your phone is removed when you delete it in the app (Settings → Reset data) or uninstall the app.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "You can ask us for a copy of your data, to correct it or to delete it, and you can object to its use. If you are in the EU or UK, you can also complain to your data protection authority. Write to [TODO: email].",
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        "AI Navigator is not intended for children under [TODO: 13 or 16]. Some AI services used in lessons have their own age limits (for example, 18+).",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "If we change this policy, we'll update the date at the top and, for important changes, let you know in the app.",
      ],
    },
  ],
};
