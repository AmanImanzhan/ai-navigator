// Шаблоны на английском: все 105 шаблонов и предупреждения уроков.
// Один шаблон = будущая строка template_translations (template_id, locale = "en", …).

import {
  CHATGPT,
  CLAUDE,
  DREAMINA,
  ELEVENLABS,
  EXCEL,
  GEMINI,
  GOOGLE_LENS,
  GOOGLE_SHEETS,
  GOOGLE_TRANSLATE,
  HEYGEN,
  IDEOGRAM,
  KLING,
} from "@/data/lessons/tools";
import type { LocaleTemplates } from "@/data/templates/types";

export const EN: LocaleTemplates = {
  lessonNotes: {
    "3":
      "Before each prompt in this lesson: cover account numbers, ID numbers and your address in the photo, or delete them from the text.",
    "5":
      "Only upload photos of yourself or of people who said it's OK.",
    "6":
      "If the logo is for a real business, check the terms of use on the free plan.",
    "7":
      "Bring photos of loved ones to life only with your family's agreement.",
    "10":
      "Download the languages in Google Translate ahead of time — then it works offline.",
    "11":
      "ElevenLabs is for ages 18 and up. On the free plan, voice-overs are for personal use only.",
    "12":
      "If you record a conversation with other people, let them know.",
    "13":
      "These templates are checks and reminders. Don't put names, phone numbers, card numbers or ID numbers in your prompts.",
    "14":
      "AI can't reliably tell a fake from the real thing — so in these templates it helps you check, rather than giving a verdict.",
    "15":
      "These templates are checks and reminders. Don't put names, phone numbers, card numbers or ID numbers in your prompts.",
    "17":
      "Record meetings only with everyone's consent.",
    "19":
      "Before uploading a work document, check whether your company allows it.",
  },
  templates: {
    "1.1": {
      title: "A week of dinners",
      purpose: "So you don't have to figure out dinner every single night.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "I cook dinner for [how many people] after work. Make a dinner menu for the week. Limits: no more than [how many minutes] to cook, a budget of [amount] for the week, we don't eat [foods]. Answer as a table by day plus one shopping list",
      example:
        "A table of 7 dinners with cooking times and a shopping list grouped by store aisle.",
    },
    "1.2": {
      title: "Gift ideas",
      purpose: "When you need a gift and have no ideas.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "I need a gift for [who], the occasion is [occasion]. This person loves [hobbies]. Budget: up to [amount]. Suggest 5 ideas, each with one line on why it would work",
      example:
        "5 ideas like “A tea tasting set — she loves trying new kinds” with short explanations.",
    },
    "1.3": {
      title: "Compare products before you buy",
      purpose: "Pick a vacuum, a phone or a kettle without drowning in reviews.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "I'm choosing [what]. What matters to me: [what matters]. Budget: up to [amount]. Compare 3 good options in a table: pros, cons, approximate price. At the end, tell me which one you'd pick and why",
      example:
        "A table of three models with pros and cons and a short recommendation. Double-check prices in the store.",
    },
    "1.4": {
      title: "A home workout plan",
      purpose: "Start exercising without a gym or a trainer.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "I'm [age] years old and want to [goal] working out at home. Equipment I have: [what I have]. I have [how many minutes] a day. Make a 2-week plan: exercises by day, short, as a list. If any exercises need extra care, point them out",
      example:
        "A 14-day plan with 15–20 minutes a day of easy-to-follow exercises and notes on where to take it slow.",
    },
    "1.5": {
      title: "Explain a complicated topic simply",
      purpose: "Understand what everyone's talking about — from inflation to cloud storage.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Explain what [topic] is to someone who knows nothing about it. I need this to [why]. No jargon, under 150 words, and end with a real-life example",
      example:
        "A short half-page explanation and an everyday example that's easy to remember.",
    },
    "2.1": {
      title: "Milestone birthday message for a coworker",
      purpose: "When you want to say something warm, not just “best wishes”.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Write a message for my coworker [name] for [occasion]. What I know about them: [2–3 details]. Tone: [tone]. Under 80 words, give me 3 options",
      example:
        "Three short messages that mention his fishing trips and his favorite project.",
    },
    "2.2": {
      title: "A thank-you to a teacher or doctor",
      purpose: "Say thank you in a way that really means something.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Write a thank-you note to [who] from [from whom]. What we're grateful for: [specific moment]. Tone: warm, not over the top. For a card, 3–4 sentences, give me 2 options",
      example:
        "Two card messages that mention a specific moment — like how the teacher helped prepare for the science fair.",
    },
    "2.3": {
      title: "An apology",
      purpose: "When you were wrong and want to apologize like a human.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Help me apologize to [who] for [what happened]. What's important to know: [details]. Tone: sincere, no excuses. Short, for a text message, give me 3 options",
      example:
        "Three short messages with no “but” and no excuses, offering to make things right.",
    },
    "2.4": {
      title: "A toast for a celebration",
      purpose: "A wedding, a big birthday, a retirement party — when you need to say a few words out loud.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Write a toast for [occasion] for [who]. Details: [2–3 stories or traits]. Tone: [tone]. One minute to say out loud, give me 2 options",
      example:
        "Two one-minute toasts with a funny story and a warm wish at the end.",
    },
    "2.5": {
      title: "A polite complaint to building management",
      purpose: "When something's broken and you want your email read and answered.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Write an email to [organization] about a problem: [what happened], it started [when]. What I want: [what you want]. Tone: polite but firm. Under 150 words, give me 2 options",
      example:
        "Two calm emails that describe the problem, the date and a clear request.",
    },
    "3.1": {
      title: "Make sense of a utility bill",
      purpose: "Understand why this month's bill is what it is.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Explain this utility bill for [month] in plain words. Why is the total what it is? Which lines usually change from month to month? Quote the lines with the amounts and the due date",
      example:
        "A line-by-line breakdown: what costs what, what went up and when it's due — with quotes.",
    },
    "3.2": {
      title: "A contract before you sign",
      purpose: "Understand a lease, service agreement or loan before you sign.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "This is a [type of] contract. Explain in plain words: what I'm agreeing to do, what penalties and deadlines there are, and how to cancel it. Quote the clauses about money and deadlines. What should I pay attention to before signing?",
      example:
        "A short list of obligations, penalties and deadlines with clause numbers, plus 3 things worth asking about. Make big decisions with an expert.",
    },
    "3.3": {
      title: "A letter from a government agency",
      purpose: "When an official letter arrives and you're not sure what to do.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "I got a letter from [agency]. Explain in plain words: what they want from me, by what date, and what happens if I do nothing. Quote the sentences with deadlines and amounts",
      example:
        "3–4 sentences on what's required and exact quotes with the deadline and the amount.",
    },
    "3.4": {
      title: "Medical results before a doctor's visit",
      purpose: "Understand the terms in your test results and prepare questions for your doctor.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Explain these results in plain words: [what it is — a blood test, an ultrasound]. What do the terms mean, and which values are outside the normal range? Quote those parts. What questions should I ask my doctor? Don't make a diagnosis",
      example:
        "A list of terms with explanations, the flagged values and 5 questions for your doctor. Treatment decisions are up to your doctor.",
    },
    "3.5": {
      title: "Understand a user manual",
      purpose: "When the manual is long and you only need to do one thing.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Using this manual for [device], explain in plain words how to [what to do]. Step by step, short. Quote any important warnings",
      example:
        "5 steps instead of 40 pages, plus two warnings quoted from the manual.",
    },
    "4.1": {
      title: "A birthday party invitation",
      purpose: "Invite guests in style, not with a group text.",
      tools: [IDEOGRAM],
      prompt:
        "Birthday party invitation, style: [style], colors: [colors]. Large text at the top: “[invitation text]”, smaller text below: “[date, time and place]”. In English, spelled correctly",
      example:
        "A bright invitation with clean lettering — “Come celebrate my 40th!” — and the date at the bottom.",
    },
    "4.2": {
      title: "A holiday card",
      purpose: "Wish someone a happy Mother's Day, Thanksgiving or Teacher Appreciation Week.",
      tools: [IDEOGRAM],
      prompt:
        "A card for [holiday] for [who], style: [style], colors: [colors]. Large text in the center: “[text]”. In English, spelled correctly",
      example:
        "A watercolor card that says “Happy Mother's Day, Mom!” with no typos.",
    },
    "4.3": {
      title: "A notice for your building",
      purpose: "A notice people will actually notice and read.",
      tools: [IDEOGRAM, CHATGPT],
      prompt:
        "A notice for an apartment building: simple style, white background, large black letters. Heading at the top: “[heading]”, text below: “[notice text]”. In English, spelled correctly, readable from a distance",
      example:
        "A clean sheet with the heading “Water shut-off on November 12” and a short message.",
    },
    "4.4": {
      title: "A card from your own photo",
      purpose: "Turn a real family photo into a card.",
      tools: [GEMINI, CHATGPT],
      prompt:
        "Turn this photo into a card for [occasion]. Don't change the photo itself, add [decorations]. Text at the bottom: “[text]”, in medium-sized white letters. In English, spelled correctly",
      example:
        "Your photo in a frame of autumn leaves with the words “Happy Anniversary!”.",
    },
    "4.5": {
      title: "A label for homemade jars",
      purpose: "Label jars of jam or little gift jars.",
      tools: [IDEOGRAM],
      prompt:
        "A round label for homemade [product], style: [style], colors: [colors]. Text in the center: “[name]”, smaller text below: “[year or name]”. In English, spelled correctly",
      example:
        "A country-style label that says “Cherry Jam” and “Summer 2026”.",
    },
    "5.1": {
      title: "A professional photo for your résumé",
      purpose: "When you need a professional headshot and don't have a photographer.",
      tools: [GEMINI, CHATGPT],
      prompt:
        "Turn this photo into a professional headshot for my résumé. Keep my face, hairstyle and expression as in the photo. Clothes: [clothes], background: plain [color]. Head-and-shoulders portrait",
      example:
        "A neat portrait in a blazer on a light gray background where you're easy to recognize.",
    },
    "5.2": {
      title: "A family photo as a painting",
      purpose: "A gift for your parents or something for your wall.",
      tools: [GEMINI, CHATGPT],
      prompt:
        "Turn this family photo into a painting in the style of [style]. Keep everyone's faces and how they're standing. Background: [background]. Landscape format, for printing",
      example:
        "A family photo in an oil painting style — everyone recognizable, ready to print on canvas.",
    },
    "5.3": {
      title: "A pet portrait",
      purpose: "A funny profile picture or a gift for an animal lover.",
      tools: [GEMINI, CHATGPT],
      prompt:
        "Turn this photo of my [pet] into a portrait in the style of [style]. Keep the coat colors and the face. Background: [background], square format",
      example:
        "Your cat as a king in an old-fashioned royal portrait — same colors, same sly look.",
    },
    "5.4": {
      title: "A character for a children's story",
      purpose: "Draw the hero of a story you made up — no photo needed.",
      tools: [GEMINI, CHATGPT],
      prompt:
        "Draw a character for a children's story: [who and what they look like], clothes: [clothes]. Style: [style]. White background, full body",
      example:
        "A friendly hedgehog in a red scarf in a picture-book illustration style.",
    },
    "5.5": {
      title: "A portrait in costume",
      purpose: "A fun profile picture or a joke card.",
      tools: [GEMINI, CHATGPT],
      prompt:
        "Show me from this photo as [character]. Keep my facial features and hair color. Style: [style], background: [background], portrait format",
      example:
        "You in a space suit against the stars, face easy to recognize.",
    },
    "6.1": {
      title: "A logo for a home-based business",
      purpose: "Business cards and a social media page for a nail artist, a handyman or a home baker.",
      tools: [IDEOGRAM],
      prompt:
        "Logo for [type of business] called “[name]”. Personality: [personality]. Colors: [colors]. A simple badge with the name, white background. The name in English, large and easy to read. Give me 4 options",
      example:
        "4 versions of a “Cozy Nails” logo in soft pink tones with a neat badge.",
    },
    "6.2": {
      title: "An icon for a blog or channel",
      purpose: "A profile picture people will recognize in their feed.",
      tools: [IDEOGRAM],
      prompt:
        "A round icon for a blog about [topic] called “[name]”. Personality: [personality], colors: [colors]. A simple shape that's easy to see even when it's small. Give me 4 options",
      example:
        "4 round icons for the blog “Easy Garden” that are readable even at thumbnail size.",
    },
    "6.3": {
      title: "A logo from your own drawing",
      purpose: "When the idea is already drawn by hand but looks a bit rough.",
      tools: [CHATGPT],
      prompt:
        "Turn my drawing into a clean logo for “[name]”. Keep the idea of the drawing, make the lines smooth. Colors: [colors], white background. Give me 3 options",
      example:
        "Your sketch of a coffee cup turned into three clean logos.",
    },
    "6.4": {
      title: "An emblem for a team or club",
      purpose: "T-shirts, certificates, the team group chat.",
      tools: [IDEOGRAM],
      prompt:
        "An emblem for [team or club] called “[name]”. Symbol: [symbol]. Personality: [personality], colors: [colors]. A simple shield or circle shape, white background. Give me 4 options",
      example:
        "4 emblems for the chess club “The Rooks” with a clear symbol.",
    },
    "6.5": {
      title: "A monogram from initials",
      purpose: "Wedding invitations, gift wrapping, embroidery.",
      tools: [IDEOGRAM],
      prompt:
        "A monogram of the letters “[letters]” for [occasion]. Style: [style], color: [color]. Simple and easy to read at a small size, white background. Give me 4 options",
      example:
        "4 elegant “A&M” monograms for wedding invitations.",
    },
    "7.1": {
      title: "A portrait that turns toward you",
      purpose: "Bring an old portrait of your grandfather or grandmother to life.",
      tools: [KLING, DREAMINA],
      prompt:
        "Bring this photo to life: [who] slowly turns their head toward the camera and nods slightly. The camera stays still. Smooth, natural movements. Don't change the facial features",
      example:
        "A 5-second video where Grandpa in a 1960s photo looks into the camera and gives a small nod.",
    },
    "7.2": {
      title: "Your parents' wedding photo",
      purpose: "A gift for their wedding anniversary.",
      tools: [KLING, DREAMINA],
      prompt:
        "Bring this wedding photo to life: the couple looks at each other and smiles, [detail] moves gently in the breeze. The camera stays still. Slow movements. Don't change the faces",
      example:
        "A short video where your young parents smile at each other while the veil moves slightly.",
    },
    "7.3": {
      title: "Bring a landscape or place to life",
      purpose: "A photo of your hometown, a family cabin or a beach trip.",
      tools: [KLING, DREAMINA],
      prompt:
        "Bring this photo of [place] to life: [what moves] moves slowly. If there are people in the photo, leave them as they are — don't change their faces. The camera stays still. Calm, natural movement",
      example:
        "An old photo of a creek where the water flows quietly and the clouds drift by.",
    },
    "7.4": {
      title: "Restore a photo before animating it",
      purpose: "When a photo is scratched, stained or faded.",
      tools: [GEMINI],
      prompt:
        "Restore this old photo: remove the scratches and stains, [colorize it carefully or keep it black-and-white]. Don't change the faces, clothes or background",
      example:
        "The same photo without cracks or stains, ready to bring to life.",
    },
    "7.5": {
      title: "A childhood photo",
      purpose: "Bring your own childhood photo or a photo of the kids in your family to life.",
      tools: [KLING, DREAMINA],
      prompt:
        "Bring this childhood photo to life: [what the child is doing], slowly. The camera stays still. Soft, natural movements. Don't change the face",
      example:
        "A toddler in the photo laughs and waves — 5 seconds, no distortions.",
    },
    "8.1": {
      title: "A 30-second video greeting script",
      purpose: "Write a script the avatar will read with feeling.",
      tools: [CHATGPT, HEYGEN],
      prompt:
        "Write a 30-second video greeting for [name] for [occasion]. Details: [1–2 details]. Tone: [tone]. Add ellipses where you need a pause, and write the name the way it sounds",
      example:
        "A script of about 70 words with pauses and the name written as “Shiv-awn” so the avatar says it right.",
    },
    "8.2": {
      title: "A video invitation",
      purpose: "Invite people to a party, a reunion or a grand opening.",
      tools: [CHATGPT, HEYGEN],
      prompt:
        "A 20-second script for a video avatar: we're inviting [who] to [event], [date and place]. Tone: friendly. Short sentences, pauses marked with ellipses",
      example:
        "A 20-second invitation script that's easy to paste into HeyGen.",
    },
    "8.3": {
      title: "A short how-to video",
      purpose: "Show customers or new team members how to do something.",
      tools: [CHATGPT, HEYGEN],
      prompt:
        "Write a 45-second script for a video avatar: how to [what to do], for [who]. 3 steps, short sentences. Write tricky words the way they sound, pauses marked with ellipses",
      example:
        "A three-step script like “How to book an appointment on our website”.",
    },
    "8.4": {
      title: "A greeting from the whole team",
      purpose: "When the whole department, class or club is sending wishes.",
      tools: [CHATGPT, HEYGEN],
      prompt:
        "A 30-second script from [who] for [name] for [occasion]. Mention: [details]. Tone: warm. Pauses marked with ellipses, the name written the way it sounds",
      example:
        "A greeting “from the whole department” that mentions shared wins.",
    },
    "8.5": {
      title: "Get an existing script ready for the avatar",
      purpose: "When you have the text, but the avatar reads it without pauses and mixes up names.",
      tools: [CHATGPT],
      prompt:
        "Rewrite this text for an avatar to read: write the names [names] the way they sound, add pauses with ellipses, break up long sentences. Text: [text]",
      example:
        "The same text, but with short sentences, pauses and pronunciation hints.",
    },
    "9.1": {
      title: "A video of your product",
      purpose: "Show your product in Stories in a livelier way than a photo.",
      tools: [DREAMINA, KLING],
      prompt:
        "Vertical video, 9:16, 5 seconds, based on this photo of [product]. The product slowly turns on the table, lighting: [lighting]. The camera stays still. No text",
      example:
        "5 seconds of your handmade candle slowly turning in soft light.",
    },
    "9.2": {
      title: "The feel of your place",
      purpose: "Show how cozy your place is.",
      tools: [DREAMINA, KLING],
      prompt:
        "Vertical video, 9:16, 5 seconds, based on this photo of [place]. Light movement: [what moves]. Mood: [mood]. The camera slowly pans from left to right. No text",
      example:
        "Your coffee shop with steam rising from the cups and soft evening light.",
    },
    "9.3": {
      title: "A sale or event teaser",
      purpose: "A video background for a sale, a workshop or a party announcement.",
      tools: [DREAMINA, KLING],
      prompt:
        "Vertical video, 9:16, 5 seconds: [what's in the shot], lighting: [lighting], mood: [mood]. The camera slowly moves closer. No text — I'll add it later in CapCut",
      example:
        "A festive table of baked goods with soft string lights — a background for “Friday Sale”.",
    },
    "9.4": {
      title: "Behind the scenes of your craft",
      purpose: "Show how you work: a haircut, pottery, baking.",
      tools: [DREAMINA, KLING],
      prompt:
        "Vertical video, 9:16, 5 seconds: a close-up of [who is doing what]. Lighting: [lighting], calm mood. The camera stays still. No text",
      example:
        "A close-up of a potter's hands shaping a cup on the wheel.",
    },
    "9.5": {
      title: "A pretty background for Stories",
      purpose: "Nature or a city as a background for a greeting or a quote.",
      tools: [DREAMINA, KLING],
      prompt:
        "Vertical video, 9:16, 5 seconds: [landscape or scene], [time of day and lighting], mood: [mood]. The camera slowly tilts up. No people and no text",
      example:
        "An autumn park at sunrise with leaves slowly falling.",
    },
    "10.1": {
      title: "An interpreter at the doctor's abroad",
      purpose: "If you have to see a doctor while traveling.",
      tools: [CHATGPT],
      prompt:
        "You're my interpreter at a doctor's appointment in [country]. Translate what I say from English into [language], and the doctor's answers into English. Translate accurately, and explain medical terms to me in plain words. If something I say isn't clear, ask me",
      example:
        "An accurate translation of the conversation with the doctor and simple explanations of unfamiliar terms.",
    },
    "10.2": {
      title: "Tell a restaurant about an allergy",
      purpose: "An important sentence you can't afford to get wrong.",
      tools: [CHATGPT],
      prompt:
        "I'm at a restaurant in [country]. Translate into [language], politely and naturally: “[what I want to say]”. Give me the phrase, how to pronounce it, and what the waiter might say back. If anything in my phrase is unclear, ask me",
      example:
        "“I'm allergic to nuts — are there any in this dish?” in Italian, with pronunciation and possible answers.",
    },
    "10.3": {
      title: "Talking to your host or landlord",
      purpose: "Check-in, something broken, a question about the deposit.",
      tools: [GOOGLE_TRANSLATE.en, CHATGPT],
      prompt:
        "You're my interpreter in a conversation with the apartment owner in [country]. Translate what I say from English into [language], and what they say into English. Tone: polite and friendly. If something I say isn't clear, ask me",
      example:
        "A calm conversation where you understand each other without anything sounding harsh.",
    },
    "10.4": {
      title: "Translate a menu",
      purpose: "Know what you're ordering, especially if there's something you don't eat.",
      tools: [GOOGLE_TRANSLATE.en, CHATGPT],
      prompt:
        "Translate this menu from [language] into English. Explain any unfamiliar dishes in one line. Mark the dishes that contain [what I avoid]",
      example:
        "The menu in English with explanations and “contains pork” next to the right dishes.",
    },
    "10.5": {
      title: "Travel phrases ahead of time",
      purpose: "Get ready for hotel check-in, taxis or a market before the trip.",
      tools: [CHATGPT, GOOGLE_TRANSLATE.en],
      prompt:
        "I'm going to [country], the situation is [situation]. Give me 10 useful phrases in [language] with translations and how to pronounce them. Polite, the way locals say them",
      example:
        "10 phrases for checking into a hotel — from “I have a reservation under…” to “Can I get a late checkout?”.",
    },
    "11.1": {
      title: "Get a greeting ready for a voice-over",
      purpose: "So the voice doesn't stumble over dates and names.",
      tools: [CHATGPT, ELEVENLABS],
      prompt:
        "Get this text ready for a voice-over: write numbers and abbreviations out as words, add pauses with commas and ellipses, and show how to pronounce the names [names]. Text: [text]",
      example:
        "A text where “25th” becomes “twenty-fifth” and the names come with pronunciation hints.",
    },
    "11.2": {
      title: "An audio bedtime story",
      purpose: "A bedtime story read by a narrator's voice.",
      tools: [CHATGPT, ELEVENLABS],
      prompt:
        "Rewrite this story to be read aloud to a [age]-year-old: short sentences, pauses, help with tricky words. Mood: [mood]. Story: [text]",
      example:
        "A calm story ready for a voice-over and a tip on which voice to pick in ElevenLabs.",
    },
    "11.3": {
      title: "A letter for someone with poor eyesight",
      purpose: "So Grandma or Grandpa can listen to a letter instead of reading it.",
      tools: [CHATGPT, ELEVENLABS],
      prompt:
        "Get this letter ready for a voice-over for [who] — they have poor eyesight and will listen to it. Numbers and dates as words, pauses between thoughts, a warm tone. Text: [text]",
      example:
        "A letter that's pleasant to listen to: no abbreviations, with pauses, about 2 minutes long.",
    },
    "11.4": {
      title: "Your family story, read aloud",
      purpose: "Record your family's story so the grandkids can listen to it.",
      tools: [CHATGPT, ELEVENLABS],
      prompt:
        "Get this family story about [who] ready for a voice-over: dates as words, how to pronounce the names ([names]), pauses before the important moments. Suggest a voice — [what kind]. Text: [text]",
      example:
        "A story about your great-grandfather with dates in words and pauses, ready to record.",
    },
    "11.5": {
      title: "Hear your speech before you give it",
      purpose: "Check how a speech sounds before the big day.",
      tools: [CHATGPT, ELEVENLABS],
      prompt:
        "Get my speech ready for a voice-over so I can hear how it sounds. The speech is [how many] minutes long; numbers as words, pauses, help with hard words. Text: [text]",
      example:
        "A 3-minute text with pauses — after listening, you can tell where the sentences are too long.",
    },
    "12.1": {
      title: "A long voice message",
      purpose: "Find out what a five-minute voice message is about without listening to it.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Transcribe this voice message from [who]. Then sum it up in 3 points: what this person wants and what I need to do",
      example:
        "The message as text and 3 points like “Asks you to pick up a package by Friday”.",
    },
    "12.2": {
      title: "Notes from a lecture or webinar",
      purpose: "For classes or courses when there's no time to rewatch the recording.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Transcribe this recording of a lecture on [topic]. Terms: [terms]. Then write notes in 7 points and 3 questions to test myself",
      example:
        "One page of notes with the terms spelled correctly and questions for review.",
    },
    "12.3": {
      title: "Takeaways from a parent-teacher meeting",
      purpose: "When a lot was said at the meeting and you only need the key points.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Transcribe this recording of a parent-teacher meeting. The teacher's name is [name]. Then list what was decided, what parents need to do and by when, and any money to pay and when",
      example:
        "5 points: what to buy, when the field trip is and the deadline for the payment.",
    },
    "12.4": {
      title: "Voice notes → to-do list",
      purpose: "If you dictate your thoughts on the go.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Transcribe my voice notes from [day]. Then make a to-do list in order of importance and a separate shopping list",
      example:
        "8 tasks in order and a shopping list of 6 items.",
    },
    "12.5": {
      title: "A call with a client",
      purpose: "Don't miss anything after a call or meeting with a client.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Transcribe this recording of a conversation with the client [name or company]. Terms: [terms]. Then list what the client wants, deadlines, budget and my to-do list",
      example:
        "A short summary of the conversation and 4 tasks with deadlines.",
    },
    "13.1": {
      title: "A message to your parents about a code word",
      purpose: "Agree on a code word without causing unnecessary worry.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Help me write a message to [who] about a family code word in case scammers call. Explain it simply and calmly, without scaring anyone, in 4–5 sentences. Don't include the word itself — I'll tell them in person",
      example:
        "A warm message for Mom and Dad explaining why you need a code word and what to do if a call seems strange.",
    },
    "13.2": {
      title: "Check a suspicious call",
      purpose: "When you just had a strange call and you're not sure about it.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "I just got a phone call. What they said: [briefly, no names or numbers]. Go through the signs of a scam with me: urgency, a request to keep it secret, an unusual way to pay. Tell me what to do right now",
      example:
        "A breakdown: “There's urgency and a request to keep quiet — those are signs of a scam. Hang up and call your relative back on their own number.”",
    },
    "13.3": {
      title: "A cheat sheet for older parents",
      purpose: "Print it out and keep it by the phone.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Make a cheat sheet for [who] about scam calls: 5 rules in big, simple words and what to do step by step. No complicated words, one page, for printing",
      example:
        "One page: “Someone calling and asking for money? 1. Hang up…”.",
    },
    "13.4": {
      title: "Check a suspicious message",
      purpose: "“Hi Mom, I got a new number, can you send me some money?” — and messages like that.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "I got this message: “[message text without links, numbers or names]”. Does it have signs of a scam — urgency, secrecy, money? How can I check without replying to it?",
      example:
        "The signs of a scam in the message and how to check: call the old number, ask another relative.",
    },
    "13.5": {
      title: "What to do if “your bank” or “the police” calls",
      purpose: "Know ahead of time how to handle it.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Make a short plan for what to do if someone calls claiming to be from [organization] and asks me to [what they ask]. 4–5 steps, short, to keep by the phone",
      example:
        "A plan: “1. Never share codes. 2. Hang up. 3. Call your bank on the number on the back of your card…”.",
    },
    "14.1": {
      title: "Check a post with a “great offer”",
      purpose: "A celebrity telling you to invest, a promise of risk-free income.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "I came across a post: [briefly, what it promises]. Go through a checklist with me: what are they promising, is there urgency or a request to click a link, where can I find an official source? Don't tell me “real” or “fake” — tell me what to check",
      example:
        "3 signs of a scam in the post and where to check: the person's official page and major news outlets.",
    },
    "14.2": {
      title: "Check a news story before you share it",
      purpose: "So you don't forward a fake to the whole family.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Help me check this news story before I share it: [what the story is about]. Which sources would be reporting it if it were true? What are the signs it's fake? What should I search for?",
      example:
        "A list of sources to check and the signs of a fake in this particular story.",
    },
    "14.3": {
      title: "Find out where a photo came from",
      purpose: "Check whether a photo was taken from another place or time.",
      tools: [GOOGLE_LENS.en, CHATGPT],
      prompt:
        "Explain step by step how to use Google Lens on [phone] to find where else this photo appears and where it came from. Short, for a beginner",
      example:
        "4 steps with clear buttons — after them, you'll see where the photo was posted before.",
    },
    "14.4": {
      title: "A family cheat sheet on fake videos",
      purpose: "Warn your parents or teenagers.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Make a cheat sheet for [who] about fake celebrity videos: 5 signs of a scam based on the message, not the picture, and what to do. Simple words, one page",
      example:
        "A cheat sheet that says “If a celebrity in a video asks for money, it's almost always a scam” with five signs.",
    },
    "14.5": {
      title: "Check an online store before you pay",
      purpose: "A site with prices that seem too good to be true.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Help me check the online store “[name]” before I pay: what to look for in reviews, how to check the contact details and company info, what the signs of a fake store are. Step by step",
      example:
        "A 6-step checklist: from looking up reviews on independent sites to checking the payment method.",
    },
    "15.1": {
      title: "Set up your privacy",
      purpose: "Stop your chats from being used for training and delete your history.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Explain step by step how to stop my chats from being used for training and delete my history in [service] on my [phone or computer]. Short, for a beginner",
      example:
        "4–5 steps with the names of the buttons in the settings. Menus sometimes change — check against your screen.",
    },
    "15.2": {
      title: "Ask about a contract without personal data",
      purpose: "Get an explanation without sharing names, addresses or numbers.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Client A rents an apartment from Client B. The lease has this clause: “[clause text with names and numbers replaced by placeholders]”. Explain in plain words what it means and what risks Client A faces",
      example:
        "A clear explanation of the clause — and not a single piece of your personal data in the chat.",
    },
    "15.3": {
      title: "A checklist before you paste text into AI",
      purpose: "Quickly check yourself before you hit send.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Make a short checklist of 5 questions I'll go through before pasting text into AI [where I use it — at home or at work]: no passwords, card or ID numbers, other people's data or company secrets",
      example:
        "5 questions like “Is there a card number or a code from a text message in here?” that fit on one screen.",
    },
    "15.4": {
      title: "Describe a work task without secrets",
      purpose: "Get help with work without giving away company data.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Help me describe a work task without confidential details. The task in general terms: [what needs to be done]. Field: [field]. Use the placeholders “Company” and “Client” instead of names",
      example:
        "An anonymized prompt you can safely ask AI, plus tips on what else to remove.",
    },
    "15.5": {
      title: "Explain to your family what not to tell AI",
      purpose: "If your parents or kids have started using AI too.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Make a cheat sheet for [who] on what not to type into AI chats: 5 points with examples and what to use instead. Simple words, without scaring anyone",
      example:
        "A cheat sheet like “Instead of your ID number, write [number]” with five clear examples.",
    },
    "16.1": {
      title: "Family budget by category",
      purpose: "See how much goes on groceries, transportation and eating out.",
      tools: [CHATGPT, GOOGLE_SHEETS.en],
      prompt:
        "[Google Sheets or Excel], English (US) settings. Column A has dates, column B has spending categories, column C has amounts. The data is in rows 2 to [row number]. Write a formula that adds up each category for [month], and explain which cell to put it in",
      example:
        "A formula and an explanation: “Put it in cell F2 and drag it down.”",
    },
    "16.2": {
      title: "Find duplicates in a list",
      purpose: "When your list of clients or guests has repeats.",
      tools: [CHATGPT, GOOGLE_SHEETS.en],
      prompt:
        "[Google Sheets or Excel], English (US) settings. Column [letter] has [what's in it], in rows 2 to [row number]. How do I highlight duplicate values? Explain step by step what to click",
      example:
        "5 steps using conditional formatting — duplicates get highlighted in color.",
    },
    "16.3": {
      title: "Design a tracking spreadsheet",
      purpose: "Start tracking orders, expenses or clients.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Suggest a layout for a spreadsheet to track [what] in [Google Sheets or Excel]. I need to see: [what matters]. Give me the column names and 3 sample rows I can copy into the spreadsheet",
      example:
        "An orders table: date, customer, item, amount, paid, status — with sample rows.",
    },
    "16.4": {
      title: "Pull prices from another sheet",
      purpose: "Combine data from two lists into one.",
      tools: [CHATGPT, GOOGLE_SHEETS.en],
      prompt:
        "[Google Sheets or Excel], English (US) settings. On the sheet “[sheet 1]”, column A has item codes; on the sheet “[sheet 2]”, column A has item codes and column B has prices. Write a formula that brings the price into column B of the first sheet, starting at row 2, and explain what happens if a code isn't found",
      example:
        "A lookup formula with an explanation and a version that shows “no price” instead of an error.",
    },
    "16.5": {
      title: "Percent of target reached",
      purpose: "See at a glance who hit their target and who didn't.",
      tools: [CHATGPT, EXCEL],
      prompt:
        "[Google Sheets or Excel], English (US) settings. Column B has the target, column C has the actual result, in rows 2 to [row number]. Write a formula for column D: the percent of target reached, and explain how to turn on percent format and where to put the formula",
      example:
        "A formula for D2, instructions for the format and a tip on highlighting anyone below 100%.",
    },
    "17.1": {
      title: "Meeting minutes from your notes",
      purpose: "When you jotted things down quickly and all over the place.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Write minutes for a team check-in based on my notes. Structure: attendees, decisions, tasks as “who — what — by when”. If a deadline or owner wasn't mentioned, say so. Don't add anything of your own. Notes: [notes]",
      example:
        "Half-page minutes with 5 tasks, two of them marked “no deadline set”.",
    },
    "17.2": {
      title: "Takeaways from a residents' meeting",
      purpose: "Send your neighbors clear takeaways in the group chat.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Write a summary of the [who] meeting from this transcript for a group chat. Structure: what was decided, who's responsible for what, how much to pay and by when. Mark anything unclear as “not decided”. Nothing of your own. Transcript: [text]",
      example:
        "A short message: 3 decisions, who's responsible and the amount to pay with a deadline.",
    },
    "17.3": {
      title: "An email to attendees after the meeting",
      purpose: "So everyone has the same understanding of what was agreed.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Based on these minutes, write a short email to the people at the meeting about [topic]: decisions and tasks as “who — what — by when”, as a list. Tone: professional and friendly. Don't add anything of your own. Minutes: [text]",
      example:
        "A 100-word email with the decisions and tasks as a list.",
    },
    "17.4": {
      title: "Open questions for the next meeting",
      purpose: "Don't lose track of what wasn't agreed on.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "From this transcript of the meeting about [topic], list only the open questions and the tasks without a deadline or owner. Don't guess who should handle them if it wasn't said. Transcript: [text]",
      example:
        "A list of 4 open questions — a ready-made agenda for the next meeting.",
    },
    "17.5": {
      title: "Minutes of a client meeting",
      purpose: "Put agreements on record so there's nothing to argue about later.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Write minutes of the meeting with the client [company] from this transcript. Structure: what the client wants, what was agreed, tasks as “who — what — by when”, open questions. Numbers and dates only from the recording. Transcript: [text]",
      example:
        "Minutes you can send to the client for confirmation.",
    },
    "18.1": {
      title: "A payment reminder",
      purpose: "A client didn't pay an invoice on time.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Write an email to the client [company] about unpaid invoice #[number] for [amount], which was due on [date]. What we need: payment by [new date]. Tone: polite but firm. Under 100 words, write the subject line separately",
      example:
        "A short email with the invoice number, the amount and the new deadline, subject: “Payment reminder: invoice #125”.",
    },
    "18.2": {
      title: "Rescheduling a meeting",
      purpose: "Move a meeting without leaving a bad impression.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Write an email to [who] moving our meeting from [date] to [new date]. Reason: [reason]. Tone: polite, with an apology. Under 70 words, write the subject line separately",
      example:
        "4 sentences with an apology and the new date, subject: “Meeting moved to November 14”.",
    },
    "18.3": {
      title: "Replying to a customer complaint",
      purpose: "Reply calmly to an unhappy customer.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Help me reply to a customer complaint. What we can offer: [solution]. Tone: calm, apologetic, no excuses. Under 120 words, write the subject line separately. Complaint (no personal details): [text]",
      example:
        "A reply that acknowledges the problem and offers a solution and a timeline.",
    },
    "18.4": {
      title: "Asking a supplier for prices",
      purpose: "Get quotes from several suppliers.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Write an email to the supplier [company] asking for prices on [what], quantity: [how many], needed by [date]. Tone: professional. Under 100 words, write the subject line separately",
      example:
        "A request you can send to three suppliers, changing only the name.",
    },
    "18.5": {
      title: "A polite no",
      purpose: "Turn down a partner or a candidate and keep a good relationship.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Write a polite email to [who] declining their offer about [what]. Reason: [reason]. I want to keep a good relationship. Under 80 words, write the subject line separately",
      example:
        "A short, tactful no with a thank-you and a hint at working together in the future.",
    },
    "19.1": {
      title: "Summarize a contract before deciding",
      purpose: "Quickly understand a long contract with a contractor.",
      tools: [CLAUDE, CHATGPT],
      prompt:
        "I'm [job title], and tomorrow we decide whether to sign this contract. Summarize it: each side's obligations, deadlines, amounts and penalties, and the risks for us — with clause numbers. Don't add anything of your own. Then check every number against the text and give a quote",
      example:
        "A half-page summary with clause numbers and a quote for each amount.",
    },
    "19.2": {
      title: "Compare two proposals",
      purpose: "Choose a contractor based on facts, not a slick presentation.",
      tools: [CLAUDE, CHATGPT],
      prompt:
        "I'm [role], choosing a contractor for [what]. Compare the two proposals in a table: price, deadlines, guarantees, what's not included — with page numbers. If something is missing, say so. Then check the numbers with quotes",
      example:
        "A comparison table where gaps are honestly marked “not in the proposal”.",
    },
    "19.3": {
      title: "The key points of a research report",
      purpose: "Understand what an industry report means for your work.",
      tools: [CLAUDE, CHATGPT],
      prompt:
        "I'm [role] in [industry]. Summarize this research in half a page: 3 key takeaways, key figures with page numbers, what it means for us. Don't add anything that isn't in the text. Then check every figure with a quote",
      example:
        "3 takeaways, 5 figures with page numbers and 2 lines on “what it means for us”.",
    },
    "19.4": {
      title: "Questions for the report's authors",
      purpose: "Prepare for a discussion and don't miss the weak spots.",
      tools: [CLAUDE, CHATGPT],
      prompt:
        "I'm [role], and tomorrow I'm going over this report with [who]. List 5 questions worth asking: where the numbers contradict each other and what data is missing. For each one, give the page number and a quote. Don't make anything up",
      example:
        "5 questions like “Page 4 says 12% growth, page 9 says 18% — which is right?”.",
    },
    "19.5": {
      title: "Summarize a long email thread",
      purpose: "Get up to speed on a project that already has 50 emails.",
      tools: [CLAUDE, CHATGPT],
      prompt:
        "I'm joining the [name] project. From this email thread, summarize what's already been decided, who's responsible for what and the open questions — with the dates of the emails. Don't make anything up; if something's unclear, say so",
      example:
        "Half a page with decisions, owners and dates — instead of an hour of reading.",
    },
    "20.1": {
      title: "A weekly team meeting agenda",
      purpose: "So the meeting stays on time and is actually useful.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "I manage [who]. The meeting is [how many minutes] long, topics: [topics]. The team's mood right now: [mood]. Write an agenda with time for each item and a question to close the meeting with",
      example:
        "A 20-minute agenda with 4 items and a closing question: “What's getting in your way this week?”.",
    },
    "20.2": {
      title: "Sharing bad news with your team",
      purpose: "Budget cuts, a canceled bonus, an office move.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "I lead [team]. I need to tell them: [news]. The team will probably react like this: [reaction]. Write a plan for a conversation of [how many minutes], 5 likely questions and calm answers",
      example:
        "A conversation plan with an honest opening and 5 answers to tough questions.",
    },
    "20.3": {
      title: "Rehearse a difficult one-on-one",
      purpose: "Practice before a hard conversation with an employee.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Play an employee who [situation]. I'm the manager and I want us to agree on [goal]. Answer realistically and push back sometimes. After 5 lines, stop and give me feedback",
      example:
        "A realistic practice conversation and a breakdown of which phrases worked and which to say differently.",
    },
    "20.4": {
      title: "Meeting takeaways for the team",
      purpose: "Send the takeaways to the group chat right after the meeting.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Here are my notes from the team meeting: [notes]. Write a short message for the group chat: what we decided, tasks as “who — what — by when”, and when the next meeting is. Tone: friendly",
      example:
        "An 8-line message you can send right away.",
    },
    "20.5": {
      title: "A brainstorming session",
      purpose: "Gather ideas so everyone speaks up, not just the two loudest people.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "I'm running a brainstorming session for [team], [how many minutes] long, on [topic]. The team is [mood]. Write a plan with timing, 3 discussion questions and how to involve the people who usually stay quiet",
      example:
        "A 40-minute plan: warm-up, pair work, voting on the best ideas.",
    },
    "21.1": {
      title: "First-week tasks for a new hire",
      purpose: "So a newcomer isn't left idle or lost.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Help me set first-week tasks for a new [job title]. Goal: [what they should learn]. For each task: the result, why it matters, the deadline, how to know it's done, where to find materials, who to ask. Tone: friendly",
      example:
        "5 tasks for the week with clear “done” criteria and contacts.",
    },
    "21.2": {
      title: "A brief for a freelancer",
      purpose: "Order a design, text or website and get what you need.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Help me write a brief for [who] to [what to do]. Budget: [amount], deadline: [date]. Describe what result is needed, what it's for, how to know it's done, what I'll provide and how we'll stay in touch",
      example:
        "A one-page brief that leaves the freelancer with very few questions.",
    },
    "21.3": {
      title: "Turn a request from above into a task",
      purpose: "When a vague message comes from above and someone on your team will do the work.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Here's a request from [from whom]: [text]. Turn it into a task for [for whom]: the result, why it matters, the deadline, how to know it's done, where to get the data, who to ask",
      example:
        "From “we need something on sales” to a clear task with a period, a format and a deadline.",
    },
    "21.4": {
      title: "Check your own task for clarity",
      purpose: "Before you send it, make sure it'll be understood the first time.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Here's a task I want to give: [task text]. Find what's missing: the result, the goal, the deadline, how to know it's done, where the data is, who to ask. List the questions my team member would ask and suggest an improved version",
      example:
        "4 questions your team member would have, and a better version of the task.",
    },
    "21.5": {
      title: "A checklist for signing off on work",
      purpose: "Know the work is done well, not just “sort of done”.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "For the task “[task]”, make a sign-off checklist: how to know the result is ready and done well. 5–7 points that can be checked. Due date: [date]. Separately — where to get data for checking and who to go to if something doesn't add up",
      example:
        "A checklist like “The report covers all of October, numbers match the CRM, there's a 3-line conclusion”.",
    },
  },
};
