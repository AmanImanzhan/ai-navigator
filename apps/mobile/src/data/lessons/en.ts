// Уроки на английском: названия направлений и уроков, содержимое уроков.
// Один урок здесь = будущая строка lesson_translations (lesson_id, locale = "en", title, content).

import {
  CHATGPT,
  CLAUDE,
  DREAMINA,
  ELEVENLABS,
  EXCEL,
  GEMINI,
  HEYGEN,
  IDEOGRAM,
  KLING,
} from "@/data/lessons/tools";
import type { LocaleLessons, ToolLink } from "@/data/lessons/types";

// Инструменты, у которых название зависит от языка.
const GOOGLE_TRANSLATE: ToolLink = {
  name: "Google Translate",
  url: "https://translate.google.com",
};
const GOOGLE_SHEETS: ToolLink = {
  name: "Google Sheets",
  url: "https://sheets.google.com",
};

// Сообщение семье из урока 13: им делятся и из практики, и с карточки «Готово».
const FAMILY_MESSAGE =
  "Let's agree on a family code word, in case someone ever calls pretending to be one of us and asks for money. I suggest the word “…”. We don't share it with anyone outside the family";

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
      content: {
        skill: "Now you can ask questions that get AI to give you clear, useful answers",
        helperCriteria: "situation, task, limits, format",
        cards: [
          {
            type: "result",
            text: "We usually ask AI “What should I make for dinner?” and get a long, generic list. Instead, you can get three recipes using what's already in your fridge, each ready in 30 minutes, with clear steps. The difference is in how you ask.",
          },
          {
            type: "tool",
            tools: [CHATGPT, GEMINI, CLAUDE],
            text: "Any AI assistant: ChatGPT, Gemini or Claude. They all have a free version. Pick the one you already have — it works the same way everywhere.",
          },
          {
            type: "howto",
            intro: "A good question has four parts:",
            layout: "steps",
            items: [
              {
                title: "The situation — who you are and what's going on",
                text: "“I'm making dinner for two after work.”",
              },
              {
                title: "The task — what you need",
                text: "“Suggest what I could cook.”",
              },
              {
                title: "The limits — time, money, what you have or can't have",
                text: "“I have chicken, rice and tomatoes. No more than 30 minutes.”",
              },
              {
                title: "The answer format",
                text: "“Give me 3 options, short, with the steps as a list.”",
              },
            ],
          },
          {
            type: "quiz",
            situation: "AI suggested three recipes, but the second one has mushrooms, and you don't eat them.",
            question: "What do you say to AI next?",
            options: [
              {
                text: "Start a new chat and ask again",
                correct: false,
              },
              {
                text: "Ask it to replace the mushroom recipe",
                correct: true,
              },
              {
                text: "Try a different app",
                correct: false,
              },
            ],
            explanation: "Ask it to replace it — AI remembers the whole conversation, so you can keep improving the result.",
          },
          {
            type: "practice",
            userPrompt: "where to go this weekend",
            improvedPrompt: "My partner and I want a weekend getaway not far from the city. We don't have a car, and our budget is up to $300 for the two of us. We love nature and good food. Suggest 3 options with a 2-day plan for each, keep it short",
          },
          {
            type: "summary",
            formula: "Situation + task + limits + format",
            text: "If the answer isn't perfect, don't start over — ask it to improve.",
          },
        ],
      },
    },
    "2": {
      title: "A letter or greeting in 2 minutes",
      content: {
        skill: "Now you can write letters and greetings in a couple of minutes that sound like you",
        helperCriteria: "who it's for and the occasion, personal details, tone, length, number of options",
        cards: [
          {
            type: "result",
            text: "A warm birthday message for your sister — with memories you share, the right length and in your own voice. Not a card from the internet, but a message that sounds like you.",
          },
          {
            type: "tool",
            tools: [CHATGPT, GEMINI, CLAUDE],
            text: "ChatGPT, Gemini or Claude — any of these assistants is good at writing.",
          },
          {
            type: "howto",
            layout: "steps",
            items: [
              {
                title: "Who it's for and the occasion",
                text: "“A birthday message for my sister, who's turning 30.”",
              },
              {
                title: "Two or three personal details",
                text: "“We went to Italy together, she loves cats and she recently took up running.”",
              },
              {
                title: "Tone",
                text: "Warm, funny, formal.",
              },
              {
                title: "Length and number of options",
                text: "“Short, for a text message. Give me 3 options.”",
              },
            ],
          },
          {
            type: "quiz",
            situation: "Prompt: “Write a birthday message for a coworker.”",
            question: "What will you get?",
            options: [
              {
                text: "A warm message with stories you share",
                correct: false,
              },
              {
                text: "A generic message that could fit anyone",
                correct: true,
              },
              {
                text: "A short poem",
                correct: false,
              },
            ],
            explanation: "A generic message that could fit anyone — AI knows nothing about your coworker. Personal details turn a template into a real greeting.",
          },
          {
            type: "practice",
            userPrompt: "birthday message for a friend",
            improvedPrompt: "Write a birthday message for my friend Emma. We've been friends since school, she loves to travel and she recently opened her own coffee shop. Tone: warm, with a bit of humor. Short, for a text message. Give me 3 options",
            followUp: {
              hint: "To fine-tune it",
              prompt: "Make the second option shorter and add a wish for the coffee shop's success",
            },
          },
          {
            type: "summary",
            formula: "Who it's for and the occasion + personal details + tone + length and options",
            text: "If you only like part of an option, ask for a specific change: “warmer”, “shorter”, “less over the top”.",
          },
        ],
      },
    },
    "3": {
      title: "Make sense of a complicated document",
      content: {
        skill: "Now you can make sense of complicated documents without mixing up deadlines and amounts",
        helperCriteria: "asks to explain in plain words, questions about deadlines and amounts, asks for quotes; reminder to remove personal details",
        cards: [
          {
            type: "result",
            text: "A confusing letter from your bank or a rental agreement → a plain-language explanation: what they want from you, the deadlines and amounts, and what to watch out for.",
          },
          {
            type: "tool",
            tools: [CHATGPT, CLAUDE],
            text: "ChatGPT or Claude: you can take a photo of the document or upload the file. Important: before uploading, hide your personal details — account number, ID number, address. On a photo, you can simply cover them in a photo editor.",
          },
          {
            type: "howto",
            intro: "Pick the easiest way to share the document:",
            layout: "options",
            items: [
              {
                title: "Take a photo — for paper letters",
                text: "A sharp photo with no glare, personal details covered.",
              },
              {
                title: "Copy the text — for emails, banking apps or websites",
                text: "Select, copy, paste into the chat and delete personal details. This is the most accurate way — AI won't misread numbers from a bad photo.",
              },
              {
                title: "Upload the file",
                text: "For PDF and Word.",
              },
            ],
            note: "Next: ask it to explain in plain words what they're asking for, the deadlines, the amounts and what happens if you don't act; ask it to quote the exact sentences with deadlines and amounts. For important decisions, check with the bank, a lawyer or whoever sent the document.",
          },
          {
            type: "quiz",
            situation: "AI wrote “pay by the 15th”, but the letter says the 5th.",
            question: "Why did that happen?",
            options: [
              {
                text: "The photo was blurry and AI couldn't make out the number",
                correct: true,
              },
              {
                text: "AI can't read letters",
                correct: false,
              },
              {
                text: "Banks often get deadlines wrong",
                correct: false,
              },
            ],
            explanation: "The photo was blurry, so AI guessed the number. That's why you should ask it to quote important dates and amounts — and check them against the original.",
          },
          {
            type: "practice",
            improvedPrompt: "Explain this letter in plain words. What do they want from me? What are the deadlines and amounts? What happens if I do nothing? Quote the exact sentences that mention deadlines and amounts",
          },
          {
            type: "summary",
            formula: "Remove personal details + sharp photo + “explain in plain words” + quotes of deadlines and amounts",
            text: "AI helps you understand the document, but you make the call on important matters — with an expert if needed.",
          },
        ],
      },
    },
    "4": {
      title: "A card for a special day",
      content: {
        skill: "Now you can make a card with exactly the words you want — and no typos",
        helperCriteria: "occasion, style, colors, exact words in quotes, where the text goes",
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
      content: {
        skill: "Now you can turn a photo into a portrait in any style — and still be easy to recognize",
        helperCriteria: "style, what to keep from the original photo, background, format",
        cards: [
          {
            type: "result",
            text: "Your photo becomes a portrait in a cartoon, oil painting or comic book style — and it still looks like you.",
          },
          {
            type: "tool",
            tools: [GEMINI, CHATGPT],
            text: "Gemini gives you about 20 free images a day and works well with photos. The alternative is ChatGPT, but it only gives you 2–3 free images a day.",
          },
          {
            type: "howto",
            intro: "Two ways:",
            layout: "options",
            items: [
              {
                title: "From your own photo",
                text: "Upload a sharp photo of your face in good light and describe the style.",
              },
              {
                title: "From a description — if you'd rather not upload a photo",
                text: "Describe the appearance, the clothes and the style.",
              },
            ],
            note: "Important: only upload photos of yourself or of people who said it's OK. Don't use photos of other people's children.",
          },
          {
            type: "quiz",
            situation: "The style turned out great, but the face doesn't look like you.",
            question: "What do you say to AI next?",
            options: [
              {
                text: "Ask it to keep the face and change only the style",
                correct: true,
              },
              {
                text: "Upload a different photo and start over",
                correct: false,
              },
              {
                text: "Ask for a higher resolution",
                correct: false,
              },
            ],
            explanation: "Ask it to keep the face: “Keep the facial features exactly as in the original photo, change only the style and the background.”",
          },
          {
            type: "practice",
            userPrompt: "make me look like a cartoon",
            improvedPrompt: "Turn this photo into a portrait in the style of a Pixar movie. Keep my facial features, hairstyle and eye color as in the photo. Background: plain light blue. Head-and-shoulders portrait, for a profile picture",
          },
          {
            type: "summary",
            formula: "Sharp photo + style + what to keep + background and format",
          },
        ],
      },
    },
    "6": {
      title: "A logo for a small business",
      content: {
        skill: "Now you can make a simple logo with your business name and brand colors",
        helperCriteria: "name in quotes, type of business, personality, colors, simple background, number of options",
        cards: [
          {
            type: "result",
            text: "A simple logo for a coffee shop, a workshop or a blog: the name, a clear symbol and brand colors — in several versions to choose from.",
          },
          {
            type: "tool",
            tools: [IDEOGRAM, CHATGPT],
            text: "Ideogram is the best at putting a name into a logo. The alternative is ChatGPT. Important: if the logo is for a real business, check the terms of use — free plans may limit commercial use, and on Ideogram free images are visible to everyone in a public gallery.",
          },
          {
            type: "howto",
            intro: "Two ways:",
            layout: "options",
            items: [
              {
                title: "From scratch",
                text: "The name, type of business, personality (cozy, serious, playful), colors and a simple background.",
              },
              {
                title: "From a sketch",
                text: "Take a photo of your hand drawing and ask it to turn it into a clean logo.",
              },
            ],
            note: "Ask for several options right away and a simple shape — a logo should be easy to read even when it's small.",
          },
          {
            type: "quiz",
            situation: "Prompt: “logo for a coffee shop”.",
            question: "What will you get?",
            options: [
              {
                text: "A coffee cup and a random name",
                correct: true,
              },
              {
                text: "Your own brand mark with your name",
                correct: false,
              },
              {
                text: "A photo of a real coffee shop",
                correct: false,
              },
            ],
            explanation: "A coffee cup and a random name — AI knows neither the name nor the personality of your business.",
          },
          {
            type: "practice",
            userPrompt: "logo for my bakery",
            improvedPrompt: "Logo for a family bakery called “Warm Loaf”. Style: cozy, simple, like a badge. Symbol: an ear of wheat or a loaf of bread. Colors: warm brown and cream. The name in English, large and easy to read. White background. Give me 4 options",
          },
          {
            type: "summary",
            formula: "Name + type of business + personality + colors + simple shape + several options",
            text: "For a real business, check that you have the rights to use it.",
          },
        ],
      },
    },
    "7": {
      title: "Bring an old family photo to life",
      content: {
        skill: "Now you can gently bring old family photos to life",
        helperCriteria: "a specific movement, pace, camera position, what to keep",
        cards: [
          {
            type: "result",
            text: "A black-and-white photo of your grandmother as a young woman — and for a few seconds she comes to life: she smiles, blinks, and a breeze gently moves her hair.",
          },
          {
            type: "tool",
            tools: [KLING, DREAMINA],
            text: "Kling or Dreamina — both turn a photo into a short video. There aren't many free tries — about 2 videos a day in Kling — so think your prompt through first.",
          },
          {
            type: "howto",
            intro: "Two ways:",
            layout: "options",
            items: [
              {
                title: "Bring it to life right away",
                text: "Upload the photo and describe the movement.",
              },
              {
                title: "Restore it first, then bring it to life",
                text: "Ask Gemini to remove the scratches and carefully colorize the photo, then animate it in Kling or Dreamina.",
              },
            ],
            note: "Tips: light, slow movements look more natural; keep the camera still; ask it not to change the face. Be thoughtful: bring photos of loved ones to life only with your family's blessing, and don't make videos that could mislead anyone.",
          },
          {
            type: "quiz",
            situation: "The person in the video moved strangely and their face got distorted.",
            question: "Why did that happen?",
            options: [
              {
                text: "You didn't describe the movement you wanted",
                correct: true,
              },
              {
                text: "The photo is too old for AI",
                correct: false,
              },
              {
                text: "The free version always does this",
                correct: false,
              },
            ],
            explanation: "You didn't describe the movement, so AI made up its own — and overdid it.",
          },
          {
            type: "practice",
            userPrompt: "animate this photo",
            improvedPrompt: "Bring this photo to life: the woman smiles slightly and blinks slowly, a light breeze moves her hair. The camera stays still. Smooth, natural movements. Don't change the facial features",
          },
          {
            type: "summary",
            formula: "Which movement + how slow + still camera + don't change the face",
          },
        ],
      },
    },
    "8": {
      title: "A video greeting",
      content: {
        skill: "Now you can make a video greeting where the avatar says the name right",
        helperCriteria: "about 30 seconds long, name and occasion, pauses, tone",
        cards: [
          {
            type: "result",
            text: "A 30-second video where an avatar host warmly congratulates a coworker by name — using your words.",
          },
          {
            type: "tool",
            tools: [HEYGEN],
            text: "HeyGen turns text into a talking avatar. Free: 3 videos a month, with a watermark.",
          },
          {
            type: "howto",
            intro: "Two ways:",
            layout: "options",
            items: [
              {
                title: "A ready-made avatar",
                text: "Pick a host from the library and paste in your text.",
              },
              {
                title: "Your digital twin",
                text: "An avatar made from your own photo — only your own photo and your own voice, never someone else's.",
              },
            ],
            note: "You can write the greeting in ChatGPT — using the formula from lesson 2.",
          },
          {
            type: "quiz",
            situation: "The avatar mispronounces the name “Siobhan” and talks without pauses.",
            question: "What do you say to AI next?",
            options: [
              {
                text: "Spell the name the way it sounds and add pauses",
                correct: true,
              },
              {
                text: "Choose a different avatar",
                correct: false,
              },
              {
                text: "Translate the text into another language",
                correct: false,
              },
            ],
            explanation: "Help it with the pronunciation and the pauses — for example, write the name the way it sounds (“Shiv-awn”) and add periods or ellipses where you need a pause.",
          },
          {
            type: "practice",
            userPrompt: "congratulate a coworker on a promotion",
            improvedPrompt: "Siobhan, congratulations on your promotion! You've earned it — with your hard work and your kindness to the team. … May your new role bring you joy and exciting challenges. We're so proud of you!",
          },
          {
            type: "summary",
            formula: "Short text + the name written the way it sounds + pauses + your own avatar only from your own photo",
          },
        ],
      },
    },
    "9": {
      title: "A short video for social media",
      content: {
        skill: "Now you can make short social media videos about your business",
        helperCriteria: "format, length, scene, lighting, camera movement",
        cards: [
          {
            type: "result",
            text: "A vertical 5-second video for Stories: a close-up of a barista drawing a heart on a cappuccino, in warm morning light.",
          },
          {
            type: "tool",
            tools: [DREAMINA, KLING],
            text: "Dreamina gives you free video credits every day. The alternative is Kling. On free plans, videos have a watermark.",
          },
          {
            type: "howto",
            intro: "Two ways:",
            layout: "options",
            items: [
              {
                title: "From text",
                text: "Describe the scene, the lighting, the camera movement and the format.",
              },
              {
                title: "From your own photo",
                text: "Upload a photo of your product or your place — so the video is about you, not some random spot.",
              },
            ],
            note: "Make 2–3 versions and pick the best one; you can put several clips together in CapCut.",
          },
          {
            type: "quiz",
            situation: "Prompt: “video about my coffee shop”.",
            question: "What will you get?",
            options: [
              {
                text: "A random pretty coffee shop, not yours",
                correct: true,
              },
              {
                text: "A video of your coffee shop with your logo",
                correct: false,
              },
              {
                text: "A long commercial",
                correct: false,
              },
            ],
            explanation: "A random coffee shop — AI doesn't know what yours looks like. Use your own photo as a starting point.",
          },
          {
            type: "practice",
            improvedPrompt: "Vertical video, 9:16, 5 seconds. Close-up: a barista pours milk into a cappuccino and draws a heart. Warm morning light, cozy atmosphere, the camera slowly moves closer. No text",
          },
          {
            type: "summary",
            formula: "9:16 format + length + what's in the shot + lighting and mood + camera movement + your own photo as a base",
          },
        ],
      },
    },
    "10": {
      title: "Translate a conversation while traveling",
      content: {
        skill: "Now you can get by in another language when you travel — politely and naturally",
        helperCriteria: "language pair, translation direction, tone, asking to clarify",
        cards: [
          {
            type: "result",
            text: "You're at a café in Italy: you speak English, the waiter hears Italian, and you hear the reply in English.",
          },
          {
            type: "tool",
            tools: [GOOGLE_TRANSLATE, CHATGPT],
            text: "Conversation mode in Google Translate — free. Or ChatGPT's voice mode.",
          },
          {
            type: "howto",
            intro: "Three ways:",
            layout: "options",
            items: [
              {
                title: "Google Translate, Conversation mode",
                text: "Pick two languages and take turns speaking. Download the languages ahead of time so it works offline.",
              },
              {
                title: "ChatGPT voice mode",
                text: "Ask it to be the interpreter between you and the other person.",
              },
              {
                title: "The camera in Google Translate",
                text: "Point it at a menu or a sign — the translation appears on top of the text.",
              },
            ],
          },
          {
            type: "quiz",
            situation: "The translation sounds too literal and blunt — the apartment owner gives you a puzzled look.",
            question: "What do you say to AI next?",
            options: [
              {
                text: "Ask it to translate politely and naturally, like a local",
                correct: true,
              },
              {
                text: "Speak slower and louder",
                correct: false,
              },
              {
                text: "Just try speaking English",
                correct: false,
              },
            ],
            explanation: "Ask it to translate politely and naturally.",
          },
          {
            type: "practice",
            improvedPrompt: "You're my interpreter on a trip to Italy. Translate what I say from English into Italian, and what the other person says from Italian into English. Translate politely and naturally, the way locals talk. If something I say isn't clear, ask me",
          },
          {
            type: "summary",
            formula: "Which languages + who speaks which + polite and natural + ask if anything's unclear",
            text: "And download the languages in advance.",
          },
        ],
      },
    },
    "11": {
      title: "Turn text into speech",
      content: {
        skill: "Now you can get text ready for a voice-over so it sounds natural and mistake-free",
        helperCriteria: "no abbreviations or digits, pauses marked, tricky pronunciations marked",
        cards: [
          {
            type: "result",
            text: "Your greeting or story, read by a narrator's voice — lively, with intonation and pauses.",
          },
          {
            type: "tool",
            tools: [ELEVENLABS],
            text: "ElevenLabs — about 10,000 characters a month for free. On the free plan it's for personal use only, and you have to say the voice was made with ElevenLabs. For voice-overs in ads or on a monetized channel, you need a paid plan.",
          },
          {
            type: "howto",
            intro: "Two ways:",
            layout: "options",
            items: [
              {
                title: "A ready-made voice",
                text: "Pick a voice from the library, paste in your text and listen.",
              },
              {
                title: "Your phone's built-in reader",
                text: "Most phones can read text aloud — look in the accessibility settings. It's free, with no sign-up, but the voice is simpler.",
              },
            ],
            note: "Before the voice-over, get your text ready: write numbers and abbreviations out as words, and put commas and periods where you want pauses.",
          },
          {
            type: "quiz",
            situation: "Text: “B/c in 2026 there were approx. 15M guests…”",
            question: "What will you get?",
            options: [
              {
                text: "The voice will read the abbreviations oddly or letter by letter",
                correct: true,
              },
              {
                text: "The voice will neatly figure everything out on its own",
                correct: false,
              },
              {
                text: "The numbers will be skipped",
                correct: false,
              },
            ],
            explanation: "The abbreviations will sound odd. Write it out in words: “because in twenty twenty-six there were approximately fifteen million guests”.",
          },
          {
            type: "practice",
            note: "Get your text ready for the voice-over: write out abbreviations and numbers, add pauses, and show how to say tricky words and names. You can ask an AI assistant to do this for you.",
          },
          {
            type: "summary",
            formula: "Numbers and abbreviations as words + pauses with punctuation + help with tricky words + a voice that fits the mood",
          },
        ],
      },
    },
    "12": {
      title: "Transcribe a voice message or recording",
      content: {
        skill: "Now you can turn voice messages and recordings into text and a to-do list",
        helperCriteria: "participants' names, terms, result format",
        cards: [
          {
            type: "result",
            text: "A long voice message or meeting recording → text, a 5-point summary and a to-do list with names.",
          },
          {
            type: "tool",
            tools: [CHATGPT, GEMINI, ELEVENLABS],
            text: "Your phone's built-in transcription, ChatGPT or Gemini with an audio upload, or transcription in ElevenLabs.",
          },
          {
            type: "howto",
            intro: "Three ways:",
            layout: "options",
            items: [
              {
                title: "Built-in transcription",
                text: "On many phones, voice messages and voice memos can be turned into text right in the app.",
              },
              {
                title: "An AI assistant",
                text: "Upload the audio file to ChatGPT or Gemini and ask it to transcribe it.",
              },
              {
                title: "If you already have the text",
                text: "Paste it into AI and ask for a summary and a to-do list.",
              },
            ],
            note: "If you're recording a conversation with other people, let them know and get their consent.",
          },
          {
            type: "quiz",
            situation: "The transcript mixes up names and work terms.",
            question: "Why did that happen?",
            options: [
              {
                text: "A noisy recording and unfamiliar words — you need to give them in advance",
                correct: true,
              },
              {
                text: "AI doesn't understand spoken English",
                correct: false,
              },
              {
                text: "The recording was too short",
                correct: false,
              },
            ],
            explanation: "Noise and unfamiliar words. Give the participants' names and the terms in advance, and record in a quiet place.",
          },
          {
            type: "practice",
            improvedPrompt: "Transcribe this recording. Participants: Sarah and Mike. Terms: Supabase, Expo. After the transcript, give me a 5-point summary and a to-do list with the name of the person responsible for each task",
          },
          {
            type: "summary",
            formula: "Quiet recording + names and terms in advance + transcript + summary + tasks",
            text: "Everyone's consent is a must.",
          },
        ],
      },
    },
    "13": {
      title: "A call from a “relative” in trouble",
      content: {
        skill: "Now you can spot a scam call and know how to protect your family with a code word",
        cards: [
          {
            type: "result",
            text: "You know exactly what to do if your “son” or “grandson” calls in tears and asks you to send money right away. And your family has a code word.",
          },
          {
            type: "info",
            label: "What you need to know",
            text: "Scammers need just a few seconds of someone's voice from social media to fake it with AI. That's why the best protection isn't trying to recognize the voice by ear, but judging the situation itself. The number on the screen can be faked too.",
          },
          {
            type: "howto",
            label: "What to do",
            layout: "steps",
            items: [
              {
                title: "Stop",
                text: "Urgency, being asked to keep it secret and an unusual way to pay — gift cards, a wire transfer, crypto — are the main signs of a scam.",
              },
              {
                text: "Ask for the code word or something only your loved one would know.",
              },
              {
                text: "Hang up and call back on the number you already have.",
              },
              {
                text: "Get in touch with another family member.",
              },
              {
                text: "Never send money during a call like this.",
              },
            ],
          },
          {
            type: "quiz",
            situation: "Your “grandson” calls in tears: he's been in a car accident, he needs money, and he asks you not to tell anyone.",
            question: "What do you do next?",
            options: [
              {
                text: "Hang up and call your grandson back on his own number",
                correct: true,
              },
              {
                text: "Send a little money to help him right away",
                correct: false,
              },
              {
                text: "Keep talking and ask follow-up questions",
                correct: false,
              },
            ],
            explanation: "Hang up and call back. A scammer will try to keep you on the line — don't let them.",
          },
          {
            type: "practice",
            improvedLabel: "Message for your family:",
            improvedPrompt: FAMILY_MESSAGE,
            share: {
              label: "Send to family",
              message: FAMILY_MESSAGE,
            },
          },
          {
            type: "summary",
            formula: "Urgent + secret + money = stop",
            text: "Hang up, call back on the number you have, ask for the code word.",
            share: {
              label: "Share this lesson with your parents",
              message: FAMILY_MESSAGE,
            },
          },
        ],
      },
    },
    "14": {
      title: "Fake photos and videos",
      content: {
        skill: "Now you can check in a minute whether a photo or video is fake",
        cards: [
          {
            type: "result",
            text: "You see a “video of a celebrity” telling people to invest — and within a minute you realize it's most likely a fake, and you know how to check.",
          },
          {
            type: "info",
            label: "What you need to know",
            text: "AI fakes are getting more and more realistic, and it's harder and harder to spot them just by looking. So the key isn't to inspect the pixels, but to check the message and the source. Even AI can't reliably spot a fake, so an AI telling you “this is real” isn't proof.",
          },
          {
            type: "howto",
            label: "How to check",
            intro: "Three ways:",
            layout: "options",
            items: [
              {
                title: "The message",
                text: "Promises of easy money, pressure to act fast, asking you to click a link or send money — these are the strongest signs of a scam.",
              },
              {
                title: "The source",
                text: "Is this video or story on the person's official pages or in major news outlets?",
              },
              {
                title: "Reverse image search",
                text: "With Google Lens, you can find where else a photo appears and where it really came from.",
              },
            ],
            note: "There can be visual clues too — strange hands and fingers, a “melting” background, garbled text, lips out of sync with the words — but not seeing them doesn't mean the video is real.",
          },
          {
            type: "quiz",
            situation: "A famous businessman in a video invites you to invest in a “new platform” with guaranteed returns.",
            question: "What's the main sign of a scam?",
            options: [
              {
                text: "The celebrity promises easy money and asks you to click a link",
                correct: true,
              },
              {
                text: "The video is high quality",
                correct: false,
              },
              {
                text: "The person is speaking your language",
                correct: false,
              },
            ],
            explanation: "The promise of easy money and the link — the message matters more than the picture quality.",
          },
          {
            type: "practice",
            note: "See a suspicious post or video? Answer three questions: what are they promising, where does the link go, and is this on the person's official pages? Still not sure? Check the source.",
          },
          {
            type: "summary",
            formula: "Message + source + reverse image search",
            text: "Money, urgency and a link = stop, even if the video looks perfect.",
          },
        ],
      },
    },
    "15": {
      title: "What not to tell AI",
      content: {
        skill: "Now you can use AI without sharing your personal data with it",
        cards: [
          {
            type: "result",
            text: "You use AI for personal and work tasks without giving it anything that could harm you or anyone else.",
          },
          {
            type: "info",
            label: "What you need to know",
            text: "Whatever you write to AI is saved in your chat history and processed by the service. In the settings of many services, you can stop your chats from being used for training and delete your history — it's worth doing.",
          },
          {
            type: "howto",
            label: "What never to share",
            layout: "list",
            items: [
              {
                text: "Passwords and codes from text messages.",
              },
              {
                text: "Card numbers and CVV codes, bank account details.",
              },
              {
                text: "Social Security, passport and other ID numbers.",
              },
              {
                text: "Other people's personal details without their consent.",
              },
              {
                text: "Confidential company documents without permission.",
              },
            ],
            note: "How to get around it: replace names and numbers with placeholders — “Client A”, “[ID number]” — and describe the task without extra details.",
          },
          {
            type: "quiz",
            situation: "Someone pasted a whole bank statement into AI, with the account number and their ID details.",
            question: "What will happen?",
            options: [
              {
                text: "The data will be saved in the chat history and stay with the service",
                correct: true,
              },
              {
                text: "AI will delete everything right away",
                correct: false,
              },
              {
                text: "Nothing — it's safe",
                correct: false,
              },
            ],
            explanation: "The data will be saved in the history. It would have been better to remove the numbers first.",
          },
          {
            type: "practice",
            userPrompt: "My Social Security number is 123-45-6789 and I live at 42 Oak Street",
            improvedPrompt: "My Social Security number is [number] and I live at [address]",
            note: "Same task, no risk.",
          },
          {
            type: "summary",
            formula: "No passwords, cards or documents + other people's data only with consent + use placeholders + check your privacy settings",
          },
        ],
      },
    },
    "16": {
      title: "A spreadsheet with formulas, no Excel skills needed",
      content: {
        skill: "Now you can get spreadsheet formulas from AI — even if you don't know Excel",
        helperCriteria: "the app and its settings, where the data is, the row range, what to calculate",
        cards: [
          {
            type: "result",
            text: "A sales spreadsheet where each employee's monthly total adds up by itself — with a formula AI wrote for you.",
          },
          {
            type: "tool",
            tools: [CHATGPT, GEMINI, GOOGLE_SHEETS, EXCEL],
            text: "ChatGPT or Gemini for the formulas; Google Sheets or Excel for the spreadsheet itself.",
          },
          {
            type: "howto",
            intro: "Three ways:",
            layout: "options",
            items: [
              {
                title: "Ask for a formula",
                text: "Describe what's in each column, which row the data starts on and what you need to calculate.",
              },
              {
                title: "Ask for a table layout",
                text: "AI will suggest columns and sample rows you can paste into your spreadsheet.",
              },
              {
                title: "Upload your spreadsheet and ask for an analysis",
                text: "Only if it has no confidential data.",
              },
            ],
            note: "Important: formulas depend on your spreadsheet's language and region settings — in some countries you use a semicolon instead of a comma. Tell AI which app and settings you have, and if a formula doesn't work, let it know.",
          },
          {
            type: "quiz",
            situation: "AI gave you a formula, but the spreadsheet shows an error.",
            question: "Why did that happen?",
            options: [
              {
                text: "You didn't say which columns the data is in and which row it starts on",
                correct: true,
              },
              {
                text: "Google Sheets doesn't accept formulas from AI",
                correct: false,
              },
              {
                text: "You need a paid version of AI",
                correct: false,
              },
            ],
            explanation: "You didn't name the columns and rows — AI guessed where the data was and got it wrong.",
          },
          {
            type: "practice",
            improvedPrompt: "Google Sheets, English (US) settings. Column A has dates, column B has employee names, column C has the sale amount. The data is in rows 2 to 200. Write a formula that adds up each employee's sales for October 2026, and explain which cell to put it in",
          },
          {
            type: "summary",
            formula: "Which app and settings + what's in which column + which row the data starts on + what to calculate + where to put it",
          },
        ],
      },
    },
    "17": {
      title: "Meeting notes from a recording",
      content: {
        skill: "Now you can turn a meeting recording into clear minutes with tasks and deadlines",
        helperCriteria: "structure, task format, flagging gaps, no making things up",
        cards: [
          {
            type: "result",
            text: "An hour-long meeting recording → one page of meeting minutes: who attended, decisions, tasks with owners and deadlines, open questions.",
          },
          {
            type: "tool",
            tools: [CHATGPT, CLAUDE],
            text: "ChatGPT or Claude. Make the transcript as shown in lesson 12.",
          },
          {
            type: "howto",
            intro: "Three ways:",
            layout: "options",
            items: [
              {
                title: "From a transcript",
                text: "Paste in the text of the recording.",
              },
              {
                title: "From your notes",
                text: "Paste in your quick notes from the meeting — AI will turn them into minutes.",
              },
              {
                title: "From audio",
                text: "Upload the recording to an AI assistant that accepts audio.",
              },
            ],
            note: "Record meetings only with everyone's consent; confidential meetings only if your company allows these services.",
          },
          {
            type: "quiz",
            situation: "The tasks in the minutes have no deadlines.",
            question: "What do you say to AI next?",
            options: [
              {
                text: "Ask it to add the deadlines and mark any that weren't set as “no deadline set”",
                correct: true,
              },
              {
                text: "Make up the deadlines yourself and add them",
                correct: false,
              },
              {
                text: "Transcribe the recording again",
                correct: false,
              },
            ],
            explanation: "Ask it to add deadlines and flag the missing ones — that way you can see right away what still needs to be agreed on.",
          },
          {
            type: "practice",
            improvedPrompt: "Write meeting minutes from this transcript. Structure: date, attendees, decisions made, action items in the format “who — what — by when”, open questions. If a deadline or owner wasn't mentioned, say so. Don't add anything of your own",
          },
          {
            type: "summary",
            formula: "Source (transcript, notes or audio) + clear structure + “who — what — by when” + flagged gaps + nothing made up",
          },
        ],
      },
    },
    "18": {
      title: "A work email in one minute",
      content: {
        skill: "Now you can write a business email in a minute — polite, precise and with the facts",
        helperCriteria: "recipient, facts, request, tone, length, subject line",
        cards: [
          {
            type: "result",
            text: "A clear email to a supplier about a late order: polite but firm, with the order number, dates and what you need — plus a subject line.",
          },
          {
            type: "tool",
            tools: [CHATGPT, CLAUDE, GEMINI],
            text: "ChatGPT, Claude or Gemini.",
          },
          {
            type: "howto",
            intro: "Three ways:",
            layout: "options",
            items: [
              {
                title: "From scratch",
                text: "Who it's to, what it's about, the facts (numbers, dates), what you want, the tone and the length.",
              },
              {
                title: "Replying to an email",
                text: "Paste in the email you got — without confidential details — and say what you want to reply.",
              },
              {
                title: "Improving a draft",
                text: "Paste in your text and ask it to make it shorter, more polite or firmer.",
              },
            ],
          },
          {
            type: "quiz",
            situation: "Prompt: “write an email to a supplier about a delay”.",
            question: "What will you get?",
            options: [
              {
                text: "A polite but generic email without your dates or order number",
                correct: true,
              },
              {
                text: "A precise email with your dates and requests",
                correct: false,
              },
              {
                text: "A harsh complaint full of threats",
                correct: false,
              },
            ],
            explanation: "Polite but generic — AI doesn't know the facts, so you'll have to rewrite the email.",
          },
          {
            type: "practice",
            improvedPrompt: "Write an email to our supplier, Fresh Foods Co. Order #[number], placed on October 20, was due on October 27 but hasn't arrived. What we need: the exact delivery date by the end of today, and a replacement if they can't deliver by Friday. Tone: polite but firm. Under 120 words. Write the subject line separately",
            followUp: {
              hint: "To fine-tune it",
              prompt: "Make it a little more formal and add a thank-you for working with us so far",
            },
          },
          {
            type: "summary",
            formula: "Recipient + facts (numbers, dates) + what you want + tone + length + subject line",
          },
        ],
      },
    },
    "19": {
      title: "The key points of a long report",
      content: {
        skill: "Now you can boil a long report down to the key points and check the numbers in it",
        helperCriteria: "role, goal, structure, source references, no making things up, a fact-check step",
        cards: [
          {
            type: "result",
            text: "A 15-page report → a half-page summary: three key takeaways, key figures with page numbers, risks and decisions to make. An hour of reading becomes 5 minutes — but there's a catch, and we'll cover it in this lesson.",
          },
          {
            type: "tool",
            tools: [CLAUDE, CHATGPT],
            text: "Claude or ChatGPT — you can upload a PDF or Word file to either one. Before uploading a work document, check whether your company allows it; don't upload anything confidential without permission.",
          },
          {
            type: "howto",
            layout: "steps",
            items: [
              {
                text: "Upload the file.",
              },
              {
                title: "Say who you are and why",
                text: "“I'm a department head, and tomorrow I'm going over this report with our CEO.”",
              },
              {
                title: "Set the structure",
                text: "Key takeaways, figures, risks, decisions.",
              },
              {
                text: "Ask for a page number for every figure.",
              },
              {
                title: "Tell it not to make things up",
                text: "“Don't add anything that isn't in the report. If there's not enough data, say so.”",
              },
            ],
          },
          {
            type: "quiz",
            situation: "The summary says “sales grew 18%”, but the report says 12%.",
            question: "Why did that happen?",
            options: [
              {
                text: "There was a typo in the report",
                correct: false,
              },
              {
                text: "AI can mix up or make up numbers",
                correct: true,
              },
              {
                text: "You should have used the paid version",
                correct: false,
              },
            ],
            explanation: "AI can mix up or make up numbers — it's called a “hallucination”, and it happens in paid versions too. Always double-check key figures.",
          },
          {
            type: "practice",
            improvedPrompt: "I'm the head of the sales department. Tomorrow I'm going over this report with our CEO. Write a summary no longer than half a page: 1) three key takeaways; 2) key figures with page numbers; 3) risks; 4) decisions that need to be made. Don't add anything that isn't in the report. If there's not enough data, say so",
            followUp: {
              hint: "Step two",
              prompt: "Check every figure in the summary against the report and give an exact quote for each one",
            },
          },
          {
            type: "summary",
            formula: "Role and goal + structure + page references + no making things up + checking the numbers",
            text: "AI saves you an hour of reading, but you're the one responsible for the numbers.",
          },
        ],
      },
    },
    "20": {
      title: "Get ready for a team meeting",
      content: {
        skill: "Now you can prepare for a team meeting: an agenda, answers to pushback and a follow-up",
        helperCriteria: "role, topic, length, team context, result format",
        cards: [
          {
            type: "result",
            text: "A plan for a 30-minute meeting with time for each item, ready answers to your team's objections and a short follow-up message afterwards.",
          },
          {
            type: "tool",
            tools: [CHATGPT, CLAUDE],
            text: "ChatGPT or Claude.",
          },
          {
            type: "howto",
            intro: "Three ways:",
            layout: "options",
            items: [
              {
                title: "Agenda",
                text: "Topic, length, attendees, goal — AI will split the time between the items.",
              },
              {
                title: "Rehearsal",
                text: "Ask AI to play an employee who's against the changes, and practice your answers.",
              },
              {
                title: "Follow-up",
                text: "After the meeting, paste in your notes — AI will write a message for the team with the decisions and tasks.",
              },
            ],
          },
          {
            type: "quiz",
            situation: "AI wrote a 2-hour agenda, but you only have 30 minutes.",
            question: "What do you say to AI next?",
            options: [
              {
                text: "Ask it to fit it into 30 minutes and keep the 3 main items",
                correct: true,
              },
              {
                text: "Delete items yourself at random",
                correct: false,
              },
              {
                text: "Make the meeting 2 hours long",
                correct: false,
              },
            ],
            explanation: "Ask it to fit it into 30 minutes — AI will pick what matters most and rebalance the time.",
          },
          {
            type: "practice",
            improvedPrompt: "I manage a team of 6. On Friday we have a 30-minute meeting about switching to a new shift schedule, and the team may not be happy about it. Write an agenda with time for each item. Then list 5 objections that might come up and how to answer them calmly",
            followUp: {
              hint: "Bonus",
              prompt: "Now play an employee who's against the new schedule — I'll practice my answers",
            },
          },
          {
            type: "summary",
            formula: "Who you are + topic and length + team mood + agenda with timing + objections and answers + rehearsal",
          },
        ],
      },
    },
    "21": {
      title: "Give a clear task to someone on your team",
      content: {
        skill: "Now you can give tasks that people understand the first time",
        helperCriteria: "result, goal, deadline, definition of done, resources, who to ask",
        cards: [
          {
            type: "result",
            text: "A task your team member gets the first time: what the result is, why it matters, when it's due, how to know it's done and who to go to with questions.",
          },
          {
            type: "tool",
            tools: [CHATGPT, CLAUDE],
            text: "ChatGPT or Claude.",
          },
          {
            type: "howto",
            intro: "Three ways:",
            layout: "options",
            items: [
              {
                title: "From quick notes",
                text: "Jot down what you need — AI will turn it into a clear task.",
              },
              {
                title: "From a request from above",
                text: "Paste in a message from your manager or a client — AI will turn it into a task for your team member.",
              },
              {
                title: "A check",
                text: "Paste in a task you've already written and ask what might be unclear.",
              },
            ],
          },
          {
            type: "quiz",
            situation: "The task: “Get the sales report ready by Friday.”",
            question: "What will you get?",
            options: [
              {
                text: "They'll make a report, but not the one you expected",
                correct: true,
              },
              {
                text: "They'll do exactly what you need",
                correct: false,
              },
              {
                text: "They'll refuse",
                correct: false,
              },
            ],
            explanation: "You'll get a report, but not the right one — it's unclear what period it covers, who it's for and what should be in it.",
          },
          {
            type: "practice",
            improvedPrompt: "Help me give a task to someone on my team. Notes: a sales report for October, needed for a meeting with our CEO on Monday. Spell out: the result, why it's needed, the deadline, what the report should include, where to get the data and who to ask with questions. Friendly tone. Then list the questions they might ask — I'll answer them in advance",
          },
          {
            type: "summary",
            formula: "Result + why + deadline + definition of done + where to get the data + who to ask",
          },
        ],
      },
    },
  },
};
