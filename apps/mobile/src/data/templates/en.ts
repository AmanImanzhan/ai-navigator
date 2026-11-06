// Шаблоны на английском. Переведены шаблоны 1.1–10.5; остальные пока показываем на русском (см. FALLBACK_LOCALE в index.ts).
// Один шаблон = будущая строка template_translations (template_id, locale = "en", …).

import {
  CHATGPT,
  CLAUDE,
  DREAMINA,
  GEMINI,
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
  },
};
