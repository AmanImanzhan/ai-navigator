// Уроки на английском. Пока переведены названия и урок 4;
// у остальных уроков показываем русское содержимое (см. CONTENT_FALLBACK_LOCALE в index.ts).

import { IDEOGRAM } from "@/data/lessons/tools";
import type { LocaleLessons } from "@/data/lessons/types";

export const EN: LocaleLessons = {
  tracks: {
    texts: "Writing",
    images: "Images",
    video: "Video",
    voice: "Voice and translation",
    safety: "Safety",
    "work-admin": "Work: administration",
    "work-management": "Work: management",
  },
  lessons: {
    "1": {
      title: "How to ask so you get a precise answer",
    },
    "2": {
      title: "A letter or greeting in 2 minutes",
    },
    "3": {
      title: "Make sense of a complicated document",
    },
    "4": {
      title: "A card for a special day",
      content: {
        skill: "Now you can make a card with exactly the words you want — and no typos",
        cards: [
          {
            type: "result",
            title: "A birthday card for Mom",
            text: "Spring flowers, warm colors and a neat “Happy Birthday, Mom!” — with every letter in the right place.",
          },
          {
            type: "tool",
            tools: [IDEOGRAM],
            text: "It's the best at putting text on images — about 10 free pictures a day. If it doesn't work for you, try Gemini or ChatGPT.",
          },
          {
            type: "howto",
            layout: "options",
            items: [
              {
                title: "From a description",
                text: "Describe the occasion, the style, the colors and the exact words, in quotes.",
              },
              {
                title: "From your own photo",
                text: "Upload a photo of Mom or of flowers from the garden to Gemini or ChatGPT and ask it to turn it into a card with a greeting.",
              },
            ],
            note: "Either way, write the greeting word for word in quotes, and say where it goes, how big it should be and what language it's in.",
          },
          {
            type: "quiz",
            situation: "The card came out saying “HAPPY BRITHDAY, MOM”.",
            question: "Why did that happen?",
            options: [
              {
                text: "AI isn't good at English",
                correct: false,
              },
              {
                text: "The exact words weren't given in quotes",
                correct: true,
              },
              {
                text: "You need the paid version",
                correct: false,
              },
            ],
            explanation: "Nobody gave it the exact words, so the AI made up its own text — and got it wrong.",
          },
          {
            type: "practice",
            userPrompt: "birthday card for a friend",
            improvedPrompt: "Birthday card for a friend, bright and fun style, balloons and confetti. Big letters at the top: “Happy Birthday, Sam!” — in English, spelled correctly",
            followUp: {
              hint: "If the letters come out wrong",
              prompt: "Fix only the text and keep everything else the same",
            },
          },
          {
            type: "summary",
            formula: "Occasion + style and colors + exact words in quotes + where the text goes and how big",
          },
        ],
      },
    },
    "5": {
      title: "A portrait or avatar in any style",
    },
    "6": {
      title: "A logo for a small business",
    },
    "7": {
      title: "Bring an old family photo to life",
    },
    "8": {
      title: "A video greeting",
    },
    "9": {
      title: "A short video for social media",
    },
    "10": {
      title: "Translate a conversation while traveling",
    },
    "11": {
      title: "Turn text into speech",
    },
    "12": {
      title: "Transcribe a voice message or recording",
    },
    "13": {
      title: "A call from a “relative” in trouble",
    },
    "14": {
      title: "Fake photos and videos",
    },
    "15": {
      title: "What not to tell AI",
    },
    "16": {
      title: "A spreadsheet with formulas, no Excel skills needed",
    },
    "17": {
      title: "Meeting notes from a recording",
    },
    "18": {
      title: "A work email in one minute",
    },
    "19": {
      title: "The key points of a long report",
    },
    "20": {
      title: "Get ready for a team meeting",
    },
    "21": {
      title: "Give a clear task to someone on your team",
    },
  },
};
