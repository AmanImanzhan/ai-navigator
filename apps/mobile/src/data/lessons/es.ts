// Уроки на испанском. Пока переведены названия и урок 4;
// у остальных уроков показываем русское содержимое (см. CONTENT_FALLBACK_LOCALE в index.ts).

import { IDEOGRAM } from "@/data/lessons/tools";
import type { LocaleLessons } from "@/data/lessons/types";

export const ES: LocaleLessons = {
  tracks: {
    texts: "Textos",
    images: "Imágenes",
    video: "Video",
    voice: "Voz y traducción",
    safety: "Seguridad",
    "work-admin": "Trabajo: administración",
    "work-management": "Trabajo: dirección de equipos",
  },
  lessons: {
    "1": {
      title: "Cómo preguntar para obtener una respuesta precisa",
    },
    "2": {
      title: "Una carta o felicitación en 2 minutos",
    },
    "3": {
      title: "Entender un documento complicado",
    },
    "4": {
      title: "Una tarjeta para un día especial",
      content: {
        skill: "Ya sabes hacer una tarjeta con el texto exacto que quieres, sin errores en las letras",
        cards: [
          {
            type: "result",
            title: "Una tarjeta de cumpleaños para mamá",
            text: "Flores de primavera, colores cálidos y un «¡Feliz cumpleaños, mamá!» bien escrito, sin errores en las letras.",
          },
          {
            type: "tool",
            tools: [IDEOGRAM],
            text: "Es la que mejor pone textos en las imágenes: unas 10 imágenes gratis al día. Si no te funciona, prueba con Gemini o ChatGPT.",
          },
          {
            type: "howto",
            layout: "options",
            items: [
              {
                title: "A partir de una descripción",
                text: "Describe la ocasión, el estilo, los colores y el texto exacto entre comillas.",
              },
              {
                title: "A partir de tu propia foto",
                text: "Sube a Gemini o ChatGPT una foto de mamá o de las flores del jardín y pídele que la convierta en una tarjeta con un mensaje.",
              },
            ],
            note: "En los dos casos, escribe el texto palabra por palabra y entre comillas, y di dónde va, de qué tamaño y en qué idioma.",
          },
          {
            type: "quiz",
            situation: "La tarjeta salió con el texto «FELIZ CUMPLAÑOS, MAMÁ».",
            question: "¿Por qué pasó esto?",
            options: [
              {
                text: "La IA no sabe bien español",
                correct: false,
              },
              {
                text: "No le diste el texto exacto entre comillas",
                correct: true,
              },
              {
                text: "Hace falta la versión de pago",
                correct: false,
              },
            ],
            explanation: "Como no tenía el texto palabra por palabra, la IA inventó el suyo y se equivocó.",
          },
          {
            type: "practice",
            userPrompt: "tarjeta de cumpleaños para un amigo",
            improvedPrompt: "Tarjeta de cumpleaños para un amigo, estilo alegre y colorido, con globos y confeti. Texto grande arriba: «¡Feliz cumpleaños, Pablo!», en español y sin errores",
            followUp: {
              hint: "Si las letras salen mal",
              prompt: "Corrige solo el texto y deja todo lo demás igual",
            },
          },
          {
            type: "summary",
            formula: "Ocasión + estilo y colores + texto exacto entre comillas + dónde va el texto y de qué tamaño",
          },
        ],
      },
    },
    "5": {
      title: "Un retrato o avatar en cualquier estilo",
    },
    "6": {
      title: "Un logo para un pequeño negocio",
    },
    "7": {
      title: "Darle vida a una foto familiar antigua",
    },
    "8": {
      title: "Un video de felicitación",
    },
    "9": {
      title: "Un video corto para redes sociales",
    },
    "10": {
      title: "Traducir una conversación cuando viajas",
    },
    "11": {
      title: "Convertir un texto en voz",
    },
    "12": {
      title: "Transcribir un mensaje de voz o una grabación",
    },
    "13": {
      title: "La llamada de un «familiar» en apuros",
    },
    "14": {
      title: "Fotos y videos falsos",
    },
    "15": {
      title: "Lo que no debes contarle a la IA",
    },
    "16": {
      title: "Una hoja de cálculo con fórmulas sin saber Excel",
    },
    "17": {
      title: "El acta de una reunión a partir de una grabación",
    },
    "18": {
      title: "Un correo de trabajo en un minuto",
    },
    "19": {
      title: "Lo esencial de un informe largo",
    },
    "20": {
      title: "Preparar una reunión con tu equipo",
    },
    "21": {
      title: "Explicar bien una tarea a alguien de tu equipo",
    },
  },
};
