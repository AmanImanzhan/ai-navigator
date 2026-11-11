// Справочник на английском.

import type { LocaleLibrary } from "@/data/library/types";

export const EN: LocaleLibrary = {
  categories: {
    assistants: "Assistants",
    search: "Search",
    images: "Images",
    video: "Video",
    voice: "Voice",
    translation: "Translation",
    spreadsheets: "Spreadsheets",
  },
  tools: {
    chatgpt: {
      name: "ChatGPT",
      about:
        "An AI assistant from OpenAI. You can chat with it, talk to it out loud and send it photos and files.",
      strengths: [
        "Understands everyday, conversational language",
        "Can search the web, work with files and create images",
        "Has a voice mode — handy, for example, for translating on a trip",
      ],
      free:
        "There's a free plan. Regular chatting has no strict limit, while file uploads, image creation, voice and data analysis each have their own limits. In some countries, the free version may show ads.",
      notes: [
        "Age: 13 and up; under 18 you need permission from a parent or guardian.",
        "Only works in supported countries (the list is in OpenAI's help center). If you use it from a country that isn't on the list, your account may be blocked.",
      ],
    },
    claude: {
      name: "Claude",
      about:
        "An AI assistant from Anthropic. It's especially good with long texts and documents.",
      strengths: [
        "Reads long documents carefully — contracts, reports, email threads",
        "Writes in a calm, natural way",
        "Can connect to your apps and services, search the web and create files",
      ],
      free:
        "There's a free plan with a limit on the number of messages; the limit resets every few hours and every week.",
      notes: [
        "Age: 18 and up.",
        "Only works in the countries on the official list. For example, it doesn't work in Russia or China.",
      ],
    },
    gemini: {
      name: "Gemini",
      about:
        "An AI assistant from Google. It works in its own app, in the browser and inside other Google services.",
      strengths: [
        "Creates and edits images, including from your own photos",
        "Has voice conversations (Gemini Live) and in-depth research on a topic",
        "Connects with other Google services",
      ],
      free:
        "There's a free version with a Google Account. It includes image creation, voice mode and other features, with limits. Paid plans give you more usage and stronger models.",
      notes: [
        "You need a Google Account.",
        "Age: 13 and up with a personal account (higher in some countries), 18 and up with a work account.",
        "In the European Economic Area, Switzerland and the UK, paid plans are 18+ only.",
        "Works in most countries, but not all. The mobile app may be available in different places than the web version.",
      ],
    },
    copilot: {
      name: "Microsoft Copilot",
      about:
        "An AI assistant from Microsoft. It has its own app, and with a paid Microsoft 365 subscription it's built into Word, Excel, PowerPoint and Outlook.",
      strengths: [
        "Helps right inside Word documents and Excel spreadsheets (with a paid subscription)",
        "Can chat, talk out loud and create images",
        "Handy if you already use Microsoft products",
      ],
      free: "There's a free version; advanced features come with a subscription.",
      notes: [
        "You need a Microsoft account.",
        "Age: 13 and up, higher in some countries. Some features may be unavailable for users under 18.",
        "In a Microsoft 365 Family subscription, AI features are currently available only to the subscription owner.",
      ],
    },
    perplexity: {
      name: "Perplexity",
      about:
        "A search engine with AI. It answers your question in plain text and shows which websites the information came from.",
      strengths: [
        "Every answer has links to sources — easy to double-check",
        "Good for questions about recent news and facts",
        "Can put together a detailed report on a complex topic",
      ],
      free:
        "There's a free version: regular search and a few “advanced” searches a day. The paid Pro version gives you more searches, a choice of models and image creation.",
      notes: [
        "Age: 13 and up; minors need consent from a parent or guardian.",
      ],
    },
    ideogram: {
      name: "Ideogram",
      about:
        "A service that creates images from a description. It's better than most at putting clean, correct text on images.",
      strengths: [
        "Text on cards and logos comes out without spelling mistakes",
        "Lots of ready-made styles",
        "You can use the images commercially too — that's what the official site says",
      ],
      free:
        "There's a free plan with a small number of generations that renews every week. According to the official help center, free generations are only given to people who sign in with Google, Apple or Microsoft, not with an email and password.",
      notes: [
        "Everything you create on the free plan is visible to everyone in a public gallery.",
        "Age: 13 and up; minors need consent from a parent or guardian.",
      ],
    },
    kling: {
      name: "Kling",
      about:
        "A service that turns a photo or a text description into a short video.",
      strengths: [
        "Brings old photos to life",
        "Understands detailed descriptions of movement and camera work",
        "Makes videos from both text and images",
      ],
      free:
        "There are free tries every day. On the free plan, videos come with a watermark; you can only remove it with a paid subscription.",
      notes: [
        "Age: 13 and up (or higher if the law in your country requires it); minors can only sign up with consent from a parent or guardian.",
        "Check the terms for using your videos in your account.",
      ],
    },
    dreamina: {
      name: "Dreamina",
      about:
        "A service from the makers of CapCut that creates images and short videos from a description or a photo.",
      strengths: [
        "Gives you free credits every day",
        "Makes videos from both text and your own photo",
        "Easy to keep working on your video in CapCut",
      ],
      free:
        "You get free credits every day. How many depends on your country, and how many videos they cover depends on the model, length and quality you choose.",
      notes: [
        "Age: 13 and up; under 18 only with consent from a parent or guardian. Some countries have higher age limits.",
      ],
    },
    heygen: {
      name: "HeyGen",
      about:
        "A service that creates videos where a “host” — a digital avatar — reads your text.",
      strengths: [
        "A large library of ready-made avatars",
        "You can make an avatar from your own photo and with your own voice",
        "A video takes a few minutes, no filming needed",
      ],
      free:
        "There's a free plan: a few short videos a month, with a watermark. Videos without a watermark are only on paid plans.",
      notes: [
        "Age: 18 and up.",
        "Make a digital twin only from your own photo and with your own voice.",
      ],
    },
    capcut: {
      name: "CapCut",
      about:
        "A video editor for your phone and computer. You use it to edit clips and add music, text and effects.",
      strengths: [
        "Simple editing right on your phone",
        "Lots of templates, fonts and music",
        "You can put several short AI clips together into one video",
      ],
      free:
        "There's a free version with a limited set of templates, effects and music. Some features are Pro only.",
      notes: [
        "Age: 13 and up; under 18 only with consent from a parent or guardian. Some countries have higher age limits.",
      ],
    },
    elevenlabs: {
      name: "ElevenLabs",
      about:
        "A service that reads text aloud in a lifelike voice and transcribes audio into text.",
      strengths: [
        "The voices sound natural, with intonation and pauses",
        "A large library of voices in different languages",
        "It also works the other way — turning a recording into text",
      ],
      free:
        "There's a free plan with limits. For personal, non-commercial use only. If you publish your work, you need to say the voice was made with ElevenLabs.",
      notes: [
        "Age: 18 and up.",
        "For ads and monetized channels, you need a paid plan.",
      ],
    },
    "google-translate": {
      name: "Google Translate",
      about:
        "Google's translator. It translates text, speech and signs through your phone's camera.",
      strengths: [
        "Conversation mode: you take turns speaking and the translation plays out loud",
        "The camera translates menus and signs right on the screen",
        "Works offline if you download the languages ahead of time",
      ],
      free:
        "Yes. Downloading languages without Wi-Fi uses mobile data.",
      notes: [
        "Download languages ahead of time, ideally over Wi-Fi.",
        "Small, unclear or decorative text may be translated with mistakes by the camera.",
      ],
    },
    "google-lens": {
      name: "Google Lens",
      about:
        "Google's image search. Point your camera or upload a photo to find similar images, information about an object or the text in it.",
      strengths: [
        "Shows where else a photo appears online — helps you spot a fake",
        "You can select part of an image and search just that",
        "Works in the Google app and in Chrome on Android and iPhone",
      ],
      free: "Yes.",
      notes: [
        "Visual search history is off by default: unless you turn it on, the photos you search with aren't saved to your activity history.",
      ],
    },
    "google-sheets": {
      name: "Google Sheets",
      about:
        "Spreadsheets from Google that work in the browser and in an app. Similar to Excel.",
      strengths: [
        "Work on any device, nothing to install",
        "Several people can work on the same spreadsheet together",
        "Understand the formulas AI suggests",
      ],
      free:
        "Free with a Google Account. Spreadsheets take up space in your free storage, which is shared between Gmail, Google Drive and Google Photos; if you run out of space, you won't be able to create new files.",
      notes: [
        "You need a Google Account.",
        "Function names and the separator in formulas depend on the spreadsheet's language and region settings.",
      ],
    },
    excel: {
      name: "Excel",
      about:
        "Spreadsheets from Microsoft. There's a program for your computer and a free web version in the browser.",
      strengths: [
        "The most widely used spreadsheet program at work",
        "Understands the formulas AI suggests",
        "With a paid Microsoft 365 subscription, Copilot is built into Excel",
      ],
      free:
        "The web version is free with a Microsoft account; files are saved to OneDrive. The computer program is only included in a paid Microsoft 365 subscription.",
      notes: [
        "The free web version has fewer features than the computer program, and you need an internet connection.",
        "Function names and the separator in formulas depend on the program's language.",
      ],
    },
  },
  concepts: {
    model: {
      title: "Model",
      text: "A model is the “brain” of an AI assistant: a program trained on huge amounts of text, images and other data. ChatGPT, Claude and Gemini are apps, and each one runs its company's models inside. One service often has several models: a fast one for simple questions and a stronger one for complex tasks. It's like a taxi app: same ride, but you can choose economy or premium.",
      example:
        "In the free version of an assistant, a simpler model may answer you, and in the paid version — a stronger one.",
    },
    "chatbot-vs-agent": {
      title: "Chatbot vs. agent — what's the difference",
      text: "A chatbot answers your messages: you ask, it answers, and you decide what to do with the answer. An agent carries out a multi-step task on its own: for example, it finds information on websites, fills in a spreadsheet and sends you the result. An agent gets more freedom, so it's even more important to check its work. In our lessons, we use assistants in chat mode.",
      example:
        "A chatbot will suggest which hotels to look at; an agent will compare prices on several websites itself and make a table.",
    },
    prompt: {
      title: "Prompt",
      text: "A prompt is what you write or say to AI. The prompt matters more than anything else for the result: a general question gets a general answer. A good prompt explains the situation, the task, the limits and what kind of answer you need.",
      example:
        "Instead of “what should I make for dinner” — “cooking for two after work, I have chicken and rice, 30 minutes max, give me 3 options”.",
    },
    context: {
      title: "Context",
      text: "Context is everything AI knows about your task in this conversation: your messages, the files you uploaded and its own answers. Thanks to context, you don't have to start over — you can ask it to improve: “make it shorter”, “replace the second recipe”. In a new chat, the assistant usually doesn't remember what you talked about before, unless the service has memory turned on.",
      example:
        "AI suggested a recipe with mushrooms — just write “replace the mushrooms” and it'll know which recipe you mean.",
    },
    hallucinations: {
      title: "“Hallucinations” and how to check answers",
      text: "A “hallucination” is when AI confidently writes something that isn't true: it mixes up numbers or makes up facts or links. This happens in paid versions too. So ask it to quote important numbers, dates and amounts from the document and check them against the original, and ask for sources for facts.",
      example:
        "The summary says “sales grew 18%”, but the report says 12%. Asking “give me an exact quote for every number” helps catch the mistake.",
    },
    multimodal: {
      title: "Multimodal: text, photos and voice in one place",
      text: "Multimodal means it understands different kinds of information: text, photos, voice, files. Modern assistants can handle all of it in one chat. You can take a photo of a letter from your bank and ask what they want from you, or talk out loud, like on the phone.",
      example:
        "You take a photo of a menu in Italian — the assistant translates it and explains what the dishes are.",
    },
    "plans-and-limits": {
      title: "Free and paid plans, limits",
      text: "Almost every AI service has a free plan, but with limits: how many messages, images or videos you can make per day, week or month. A paid plan removes some limits, gives you stronger models and removes watermarks. Limits change often, so it's worth checking them on the service's website before you start. If you only have a few free tries, think your prompt through first, then generate.",
      example:
        "You only get a few free videos a day — better to describe the movement well once than to use up every try on “animate this photo”.",
    },
    privacy: {
      title: "Privacy: what happens to your data",
      text: "What you write to AI is saved in your chat history and processed by the service. Many services let you stop your chats from being used to train models and delete your history. Never send passwords, codes from text messages, card numbers or ID numbers, and share other people's data only with their consent. You can replace names and numbers with placeholders.",
      example:
        "Instead of “my ID number is 4510 123456”, write “my ID number is [number]” — same task, no risk.",
    },
    "one-company-many-products": {
      title: "One company — different products",
      text: "One company can make several products for different jobs. For example, Claude is an assistant for everyone, while Claude Code is a tool for programmers that works directly with code. OpenAI has a similar pair: ChatGPT for everyone and Codex for programmers. They may run on the same company's models, but they're different programs, and you learn them separately. If you don't write code, a regular assistant is what you need.",
      example:
        "A programmer friend recommends Claude Code — for emails and cards, regular Claude is all you need.",
    },
    "skills-and-connectors": {
      title: "Skills, plugins and connectors",
      text: "These are ways to teach an assistant something new or give it access to your services. A connector links the assistant to, say, Google Drive or your calendar: after that, it can find the right file or meeting. Skills and plugins are ready-made sets of instructions and abilities for specific tasks. You turn them on in the assistant's settings, and the service always asks for permission to access your data. Only connect what you really need.",
      example:
        "Once your calendar is connected, you can ask “when do I have free time this week?”.",
    },
    "image-generation": {
      title: "How AI draws pictures and why letters sometimes come out wrong",
      text: "An image generator learned from millions of pictures with captions and creates a new image from your description, step by step, “developing” it out of noise. To it, letters are more like a drawing than text, so words sometimes come out misspelled: “HAPPY BRITHDAY” instead of “HAPPY BIRTHDAY”. It helps to give the exact text in quotes, say where the text goes and how big it is, and use a service that's good with text, like Ideogram.",
      example:
        "“Large text at the top: ‘Happy Birthday, Sam!’” works better than “a birthday card”.",
    },
    deepfakes: {
      title: "AI fakes (deepfakes) — how they work",
      text: "A deepfake is a photo, video or voice created by AI to look and sound like a real person. Scammers need just a few seconds of a voice recording from social media to fake it. Spotting a fake by eye keeps getting harder, and even AI can't do it reliably. So the key is to check the message and the source, not the picture: urgency, money and a request to click a link are a reason to stop.",
      example:
        "A “celebrity” in a video promises easy money — check their official page; if it's not there, it's a scam.",
    },
  },
};
