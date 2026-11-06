// Уроки на испанском. Переведены названия всех уроков и содержимое уроков 1–12;
// у уроков 13–21 пока показываем русское содержимое (см. CONTENT_FALLBACK_LOCALE в index.ts).

import {
  CHATGPT,
  CLAUDE,
  DREAMINA,
  ELEVENLABS,
  GEMINI,
  HEYGEN,
  IDEOGRAM,
  KLING,
} from "@/data/lessons/tools";
import type { LocaleLessons, ToolLink } from "@/data/lessons/types";

// Инструменты, у которых название зависит от языка.
const GOOGLE_TRANSLATE: ToolLink = {
  name: "Traductor de Google",
  url: "https://translate.google.com",
};

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
      content: {
        skill: "Ya sabes hacer preguntas para que la IA te responda con precisión y al grano",
        helperCriteria: "situación, tarea, límites, formato",
        cards: [
          {
            type: "result",
            text: "Normalmente le preguntamos a la IA «¿Qué hago de cena?» y recibimos una lista larga y genérica. Pero puedes conseguir tres recetas con lo que ya tienes en el refrigerador, cada una lista en 30 minutos y con pasos claros. La diferencia está en cómo haces la pregunta.",
          },
          {
            type: "tool",
            tools: [CHATGPT, GEMINI, CLAUDE],
            text: "Cualquier asistente de IA: ChatGPT, Gemini o Claude. Todos tienen versión gratuita. Elige el que ya tengas instalado: funcionan igual.",
          },
          {
            type: "howto",
            intro: "Una buena pregunta tiene cuatro partes:",
            layout: "steps",
            items: [
              {
                title: "La situación — quién eres y qué pasa",
                text: "«Estoy preparando la cena para dos después del trabajo».",
              },
              {
                title: "La tarea — qué necesitas",
                text: "«Sugiéreme qué cocinar».",
              },
              {
                title: "Los límites — tiempo, dinero, qué tienes o qué no puedes comer",
                text: "«Tengo pollo, arroz y tomates. No más de 30 minutos».",
              },
              {
                title: "El formato de la respuesta",
                text: "«Dame 3 opciones, breves, con los pasos en una lista».",
              },
            ],
          },
          {
            type: "quiz",
            situation: "La IA te propuso tres recetas, pero la segunda lleva champiñones y tú no los comes.",
            question: "¿Qué le dices a la IA ahora?",
            options: [
              {
                text: "Abrir un chat nuevo y volver a preguntar",
                correct: false,
              },
              {
                text: "Pedirle que cambie la receta de los champiñones",
                correct: true,
              },
              {
                text: "Probar otra aplicación",
                correct: false,
              },
            ],
            explanation: "Pedirle que la cambie: la IA recuerda toda la conversación, así que puedes ir mejorando el resultado.",
          },
          {
            type: "practice",
            userPrompt: "adónde ir el fin de semana",
            improvedPrompt: "Mi pareja y yo queremos descansar el fin de semana cerca de la ciudad. Vamos en transporte público y nuestro presupuesto es de hasta 300 dólares para los dos. Nos gustan la naturaleza y la buena comida. Propón 3 opciones con un plan para 2 días, en pocas palabras",
          },
          {
            type: "summary",
            formula: "Situación + tarea + límites + formato",
            text: "Si la respuesta no es perfecta, no empieces de cero: pídele que la mejore.",
          },
        ],
      },
    },
    "2": {
      title: "Una carta o felicitación en 2 minutos",
      content: {
        skill: "Ya sabes escribir en un par de minutos cartas y felicitaciones que suenan a ti",
        helperCriteria: "destinatario y ocasión, detalles personales, tono, extensión, número de opciones",
        cards: [
          {
            type: "result",
            text: "Una felicitación de cumpleaños cariñosa para tu hermana, con recuerdos que comparten, del largo justo y con tu manera de hablar. No una tarjeta sacada de internet, sino un texto que suena a ti.",
          },
          {
            type: "tool",
            tools: [CHATGPT, GEMINI, CLAUDE],
            text: "ChatGPT, Gemini o Claude: cualquiera de estos asistentes escribe bien.",
          },
          {
            type: "howto",
            layout: "steps",
            items: [
              {
                title: "Para quién y por qué",
                text: "«Una felicitación para mi hermana, que cumple 30».",
              },
              {
                title: "Dos o tres detalles personales",
                text: "«Hicimos un viaje a Italia, le encantan los gatos y hace poco empezó a correr».",
              },
              {
                title: "El tono",
                text: "Cariñoso, divertido, formal.",
              },
              {
                title: "Extensión y número de opciones",
                text: "«Corto, para un mensaje. Dame 3 opciones».",
              },
            ],
          },
          {
            type: "quiz",
            situation: "Petición: «Escribe una felicitación de cumpleaños para un compañero de trabajo».",
            question: "¿Qué vas a obtener?",
            options: [
              {
                text: "Un texto cariñoso con historias que comparten",
                correct: false,
              },
              {
                text: "Un texto genérico que sirve para cualquiera",
                correct: true,
              },
              {
                text: "Un poema corto",
                correct: false,
              },
            ],
            explanation: "Un texto genérico que sirve para cualquiera: la IA no sabe nada de tu compañero. Los detalles personales convierten una plantilla en una felicitación de verdad.",
          },
          {
            type: "practice",
            userPrompt: "felicitación para una amiga",
            improvedPrompt: "Escribe una felicitación de cumpleaños para mi amiga Lucía. Nos conocemos desde el colegio, le encanta viajar y hace poco abrió su propia cafetería. Tono: cariñoso y con humor. Breve, para un mensaje. Dame 3 opciones",
            followUp: {
              hint: "Para pulirla",
              prompt: "Haz la segunda opción más corta e incluye un deseo de éxito para la cafetería",
            },
          },
          {
            type: "summary",
            formula: "Para quién y por qué + detalles personales + tono + extensión y opciones",
            text: "Si una opción te gusta solo en parte, pide un cambio concreto: «más cariñosa», «más corta», «menos solemne».",
          },
        ],
      },
    },
    "3": {
      title: "Entender un documento complicado",
      content: {
        skill: "Ya sabes entender documentos complicados sin confundirte con plazos y cantidades",
        helperCriteria: "pide explicar con palabras sencillas, pregunta por plazos y cantidades, pide citas; recuerda quitar los datos personales",
        cards: [
          {
            type: "result",
            text: "Una carta confusa del banco o un contrato de alquiler → una explicación con palabras sencillas: qué te piden, qué plazos y cantidades hay y en qué fijarte.",
          },
          {
            type: "tool",
            tools: [CHATGPT, CLAUDE],
            text: "ChatGPT o Claude: puedes sacarle una foto al documento o subir el archivo. Importante: antes de subirlo, tapa tus datos personales: número de cuenta, de documento de identidad, dirección. En una foto basta con taparlos en un editor de imágenes.",
          },
          {
            type: "howto",
            intro: "Elige la forma más cómoda de pasarle el documento:",
            layout: "options",
            items: [
              {
                title: "Sacar una foto — para cartas en papel",
                text: "Una foto nítida, sin reflejos y con los datos personales tapados.",
              },
              {
                title: "Copiar el texto — para correos, la app del banco o una página web",
                text: "Selecciona, copia, pega en el chat y borra los datos personales. Es la forma más precisa: la IA no se equivocará con los números por culpa de una mala foto.",
              },
              {
                title: "Subir el archivo",
                text: "Para PDF y Word.",
              },
            ],
            note: "Después: pídele que te explique con palabras sencillas qué te piden, los plazos, las cantidades y qué pasa si no haces nada; pídele que cite las frases exactas con plazos y cantidades. Para decisiones importantes, consulta con el banco, un abogado o quien te envió el documento.",
          },
          {
            type: "quiz",
            situation: "La IA escribió «pagar antes del día 15», pero en la carta el plazo es el día 5.",
            question: "¿Por qué pasó esto?",
            options: [
              {
                text: "La foto estaba borrosa y la IA no distinguió el número",
                correct: true,
              },
              {
                text: "La IA no sabe leer cartas",
                correct: false,
              },
              {
                text: "Los bancos suelen poner mal los plazos",
                correct: false,
              },
            ],
            explanation: "La foto estaba borrosa y la IA se inventó el número. Por eso, pídele que cite las fechas y cantidades importantes y compáralas con el original.",
          },
          {
            type: "practice",
            improvedPrompt: "Explícame esta carta con palabras sencillas. ¿Qué me piden? ¿Qué plazos y cantidades hay? ¿Qué pasa si no hago nada? Cita las frases exactas donde aparecen los plazos y las cantidades",
          },
          {
            type: "summary",
            formula: "Quitar los datos personales + foto nítida + «explícamelo con palabras sencillas» + citas de plazos y cantidades",
            text: "La IA te ayuda a entender el documento, pero las decisiones importantes las tomas tú, con un especialista si hace falta.",
          },
        ],
      },
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
      content: {
        skill: "Ya sabes convertir una foto en un retrato de cualquier estilo, y que se te reconozca a la primera",
        helperCriteria: "estilo, qué conservar de la foto original, fondo, formato",
        cards: [
          {
            type: "result",
            text: "Tu foto se convierte en un retrato al estilo de dibujos animados, pintura al óleo o cómic, y se te sigue reconociendo.",
          },
          {
            type: "tool",
            tools: [GEMINI, CHATGPT],
            text: "Gemini: unas 20 imágenes gratis al día, y funciona bien con fotos. La alternativa es ChatGPT, pero gratis solo da 2–3 imágenes al día.",
          },
          {
            type: "howto",
            intro: "Dos formas:",
            layout: "options",
            items: [
              {
                title: "A partir de tu foto",
                text: "Sube una foto nítida de tu cara con buena luz y describe el estilo.",
              },
              {
                title: "A partir de una descripción — si prefieres no subir fotos",
                text: "Describe el aspecto, la ropa y el estilo.",
              },
            ],
            note: "Importante: sube solo fotos tuyas o de personas que te hayan dado permiso. No uses fotos de hijos de otras personas.",
          },
          {
            type: "quiz",
            situation: "El estilo quedó genial, pero la cara no se parece a ti.",
            question: "¿Qué le dices a la IA ahora?",
            options: [
              {
                text: "Pedirle que mantenga la cara y cambie solo el estilo",
                correct: true,
              },
              {
                text: "Subir otra foto y empezar de nuevo",
                correct: false,
              },
              {
                text: "Escribir la petición otra vez en inglés",
                correct: false,
              },
            ],
            explanation: "Pedirle que mantenga la cara: «Conserva los rasgos de la cara como en la foto original, cambia solo el estilo y el fondo».",
          },
          {
            type: "practice",
            userPrompt: "hazme como en los dibujos animados",
            improvedPrompt: "Convierte esta foto en un retrato al estilo de las películas de Pixar. Conserva los rasgos de la cara, el peinado y el color de ojos como en la foto. Fondo: azul claro liso. Retrato de los hombros hacia arriba, para foto de perfil",
          },
          {
            type: "summary",
            formula: "Foto nítida + estilo + qué conservar + fondo y formato",
          },
        ],
      },
    },
    "6": {
      title: "Un logo para un pequeño negocio",
      content: {
        skill: "Ya sabes hacer un logo sencillo con el nombre de tu negocio y sus colores",
        helperCriteria: "nombre entre comillas, sector, carácter, colores, fondo sencillo, número de opciones",
        cards: [
          {
            type: "result",
            text: "Un logo sencillo para una cafetería, un taller o un blog: el nombre, un símbolo claro y los colores de la marca, en varias versiones para elegir.",
          },
          {
            type: "tool",
            tools: [IDEOGRAM, CHATGPT],
            text: "Ideogram es la que mejor escribe el nombre dentro del logo. La alternativa es ChatGPT. Importante: si el logo es para un negocio real, revisa las condiciones de uso: en los planes gratuitos el uso comercial puede estar limitado, y en Ideogram las imágenes gratuitas se ven en una galería pública.",
          },
          {
            type: "howto",
            intro: "Dos formas:",
            layout: "options",
            items: [
              {
                title: "Desde cero",
                text: "El nombre, el sector, el carácter (acogedor, serio, divertido), los colores y un fondo sencillo.",
              },
              {
                title: "A partir de un boceto",
                text: "Sácale una foto a tu dibujo a mano y pídele que lo convierta en un logo limpio.",
              },
            ],
            note: "Pide varias opciones desde el principio y una forma sencilla: el logo tiene que leerse bien incluso en tamaño pequeño.",
          },
          {
            type: "quiz",
            situation: "Petición: «logo para una cafetería».",
            question: "¿Qué vas a obtener?",
            options: [
              {
                text: "Una taza de café y un nombre cualquiera",
                correct: true,
              },
              {
                text: "Tu propio logotipo con el nombre de tu negocio",
                correct: false,
              },
              {
                text: "Una foto de una cafetería real",
                correct: false,
              },
            ],
            explanation: "Una taza de café y un nombre cualquiera: la IA no conoce ni el nombre ni el carácter de tu negocio.",
          },
          {
            type: "practice",
            userPrompt: "logo para mi panadería",
            improvedPrompt: "Logo para una panadería familiar llamada «Pan de Casa». Estilo: acogedor, sencillo, tipo insignia. Símbolo: una espiga de trigo o un pan. Colores: marrón cálido y crema. El nombre en español, grande y fácil de leer. Fondo blanco. Dame 4 opciones",
          },
          {
            type: "summary",
            formula: "Nombre + sector + carácter + colores + forma sencilla + varias opciones",
            text: "Para un negocio real, revisa los derechos de uso.",
          },
        ],
      },
    },
    "7": {
      title: "Darle vida a una foto familiar antigua",
      content: {
        skill: "Ya sabes dar vida con cuidado a viejas fotos familiares",
        helperCriteria: "movimiento concreto, ritmo, posición de la cámara, qué conservar",
        cards: [
          {
            type: "result",
            text: "Una foto en blanco y negro de tu abuela de joven, y durante unos segundos cobra vida: sonríe, parpadea y la brisa le mueve un poco el pelo.",
          },
          {
            type: "tool",
            tools: [KLING, DREAMINA],
            text: "Kling o Dreamina: las dos convierten una foto en un video corto. Hay pocos intentos gratis (unos 2 videos al día en Kling), así que piensa bien la petición antes.",
          },
          {
            type: "howto",
            intro: "Dos formas:",
            layout: "options",
            items: [
              {
                title: "Darle vida directamente",
                text: "Sube la foto y describe el movimiento.",
              },
              {
                title: "Primero restaurarla, luego darle vida",
                text: "Pídele a Gemini que quite los rayones y coloree la foto con cuidado, y después dale vida en Kling o Dreamina.",
              },
            ],
            note: "Consejos: los movimientos suaves y lentos se ven más naturales; la cámara, quieta; pide que no cambie la cara. Con delicadeza: da vida a fotos de tus seres queridos solo si tu familia está de acuerdo, y no crees videos que puedan engañar a nadie.",
          },
          {
            type: "quiz",
            situation: "La persona del video se movió de forma rara y se le deformó la cara.",
            question: "¿Por qué pasó esto?",
            options: [
              {
                text: "No describiste qué movimiento querías",
                correct: true,
              },
              {
                text: "La foto es demasiado antigua para la IA",
                correct: false,
              },
              {
                text: "La versión gratuita siempre hace esto",
                correct: false,
              },
            ],
            explanation: "No describiste el movimiento, así que la IA se lo inventó y se pasó.",
          },
          {
            type: "practice",
            userPrompt: "dale vida a esta foto",
            improvedPrompt: "Dale vida a esta foto: la mujer sonríe un poco y parpadea despacio, una brisa suave le mueve el pelo. La cámara no se mueve. Movimientos suaves y naturales. No cambies los rasgos de la cara",
          },
          {
            type: "summary",
            formula: "Qué movimiento + a qué ritmo + cámara quieta + no cambiar la cara",
          },
        ],
      },
    },
    "8": {
      title: "Un video de felicitación",
      content: {
        skill: "Ya sabes hacer un video de felicitación en el que el avatar dice bien el nombre",
        helperCriteria: "unos 30 segundos, nombre y ocasión, pausas, tono",
        cards: [
          {
            type: "result",
            text: "Un video de 30 segundos en el que un presentador virtual felicita con cariño a una compañera de trabajo por su nombre, con tu texto.",
          },
          {
            type: "tool",
            tools: [HEYGEN],
            text: "HeyGen crea avatares que hablan a partir de un texto. Gratis: 3 videos al mes, con marca de agua.",
          },
          {
            type: "howto",
            intro: "Dos formas:",
            layout: "options",
            items: [
              {
                title: "Un avatar ya hecho",
                text: "Elige un presentador de la biblioteca y pega tu texto.",
              },
              {
                title: "Tu doble digital",
                text: "Un avatar hecho con tu propia foto: solo con tu foto y tu voz, nunca con las de otra persona.",
              },
            ],
            note: "Puedes preparar el texto de la felicitación en ChatGPT, con la fórmula de la lección 2.",
          },
          {
            type: "quiz",
            situation: "El avatar pronuncia mal el nombre «Ximena» y habla sin pausas.",
            question: "¿Qué le dices a la IA ahora?",
            options: [
              {
                text: "Escribir el nombre como se pronuncia y poner pausas",
                correct: true,
              },
              {
                text: "Elegir otro avatar",
                correct: false,
              },
              {
                text: "Traducir el texto al inglés",
                correct: false,
              },
            ],
            explanation: "Ayudarle con la pronunciación y las pausas: por ejemplo, escribir «Jimena» en lugar de «Ximena» y poner puntos o puntos suspensivos donde haga falta una pausa.",
          },
          {
            type: "practice",
            userPrompt: "felicitar a una compañera por su ascenso",
            improvedPrompt: "¡Ximena, felicidades por tu ascenso! Te lo has ganado con tu constancia y tu amabilidad con el equipo. … Que el nuevo puesto te traiga alegrías y retos interesantes. ¡Estamos muy orgullosos de ti!",
          },
          {
            type: "summary",
            formula: "Texto corto + el nombre escrito como suena + pausas + tu propio avatar solo con tu foto",
          },
        ],
      },
    },
    "9": {
      title: "Un video corto para redes sociales",
      content: {
        skill: "Ya sabes hacer videos cortos para redes sociales sobre tu negocio",
        helperCriteria: "formato, duración, escena, luz, movimiento de cámara",
        cards: [
          {
            type: "result",
            text: "Un video vertical de 5 segundos para historias: un primer plano de un barista dibujando un corazón en un capuchino, con luz cálida de la mañana.",
          },
          {
            type: "tool",
            tools: [DREAMINA, KLING],
            text: "Dreamina da créditos gratis para video todos los días. La alternativa es Kling. En los planes gratuitos, los videos llevan marca de agua.",
          },
          {
            type: "howto",
            intro: "Dos formas:",
            layout: "options",
            items: [
              {
                title: "A partir de un texto",
                text: "Describe la escena, la luz, el movimiento de la cámara y el formato.",
              },
              {
                title: "A partir de tu foto",
                text: "Sube una foto de tu producto o de tu local: así el video será sobre ti y no sobre un lugar cualquiera.",
              },
            ],
            note: "Haz 2–3 versiones y quédate con la mejor; puedes unir varios videos en CapCut.",
          },
          {
            type: "quiz",
            situation: "Petición: «video sobre mi cafetería».",
            question: "¿Qué vas a obtener?",
            options: [
              {
                text: "Una cafetería bonita cualquiera, no la tuya",
                correct: true,
              },
              {
                text: "Un video de tu cafetería con tu logo",
                correct: false,
              },
              {
                text: "Un anuncio largo",
                correct: false,
              },
            ],
            explanation: "Una cafetería cualquiera: la IA no sabe cómo es la tuya. Usa tu propia foto como base.",
          },
          {
            type: "practice",
            improvedPrompt: "Video vertical 9:16, 5 segundos. Primer plano: un barista vierte leche en un capuchino y dibuja un corazón. Luz cálida de la mañana, ambiente acogedor, la cámara se acerca despacio. Sin texto",
          },
          {
            type: "summary",
            formula: "Formato 9:16 + duración + qué sale en la imagen + luz y ambiente + movimiento de cámara + tu foto como base",
          },
        ],
      },
    },
    "10": {
      title: "Traducir una conversación cuando viajas",
      content: {
        skill: "Ya sabes entenderte en otro idioma cuando viajas, con educación y naturalidad",
        helperCriteria: "par de idiomas, dirección de la traducción, tono, que pregunte si algo no está claro",
        cards: [
          {
            type: "result",
            text: "Estás en un café en Italia: tú hablas en español, el camarero oye italiano y tú oyes su respuesta en español.",
          },
          {
            type: "tool",
            tools: [GOOGLE_TRANSLATE, CHATGPT],
            text: "El modo Conversación del Traductor de Google, gratis. O el modo de voz de ChatGPT.",
          },
          {
            type: "howto",
            intro: "Tres formas:",
            layout: "options",
            items: [
              {
                title: "Traductor de Google, modo Conversación",
                text: "Elige los dos idiomas y habla por turnos con la otra persona. Descarga los idiomas antes para usarlo sin internet.",
              },
              {
                title: "Modo de voz de ChatGPT",
                text: "Pídele que haga de intérprete entre tú y la otra persona.",
              },
              {
                title: "La cámara del Traductor de Google",
                text: "Apunta a un menú o a un cartel y la traducción aparece encima del texto.",
              },
            ],
          },
          {
            type: "quiz",
            situation: "La traducción suena demasiado literal y brusca, y el dueño del apartamento te mira sorprendido.",
            question: "¿Qué le dices a la IA ahora?",
            options: [
              {
                text: "Pedirle que traduzca con educación y naturalidad, como la gente de allí",
                correct: true,
              },
              {
                text: "Hablar más despacio y más alto",
                correct: false,
              },
              {
                text: "Pasarte al inglés",
                correct: false,
              },
            ],
            explanation: "Pedirle que traduzca con educación y naturalidad.",
          },
          {
            type: "practice",
            improvedPrompt: "Eres mi intérprete en un viaje por Italia. Traduce lo que yo digo del español al italiano, y lo que dice la otra persona, del italiano al español. Traduce con educación y naturalidad, como habla la gente de allí. Si una frase mía no está clara, pregúntame",
          },
          {
            type: "summary",
            formula: "Qué idiomas + quién habla cuál + con educación y naturalidad + que pregunte si algo no está claro",
            text: "Y descarga los idiomas antes.",
          },
        ],
      },
    },
    "11": {
      title: "Convertir un texto en voz",
      content: {
        skill: "Ya sabes preparar un texto para que la voz lo lea con vida y sin errores",
        helperCriteria: "sin abreviaturas ni cifras, pausas marcadas, pronunciaciones difíciles indicadas",
        cards: [
          {
            type: "result",
            text: "Tu felicitación o tu historia, leída por una voz de locutor: con vida, entonación y pausas.",
          },
          {
            type: "tool",
            tools: [ELEVENLABS],
            text: "ElevenLabs: unos 10 000 caracteres al mes gratis. En el plan gratuito, solo para uso personal y mencionando que la voz es de ElevenLabs. Para locuciones en anuncios o en un canal monetizado hace falta un plan de pago.",
          },
          {
            type: "howto",
            intro: "Dos formas:",
            layout: "options",
            items: [
              {
                title: "Una voz ya hecha",
                text: "Elige una voz de la biblioteca, pega el texto y escúchalo.",
              },
              {
                title: "La lectura en voz alta del teléfono",
                text: "La mayoría de los teléfonos pueden leer texto en voz alta: búscalo en los ajustes de accesibilidad. Es gratis y sin registro, pero la voz es más sencilla.",
              },
            ],
            note: "Antes de grabar la voz, prepara el texto: escribe con letras los números y las abreviaturas, y pon comas y puntos donde quieras pausas.",
          },
          {
            type: "quiz",
            situation: "Texto: «En 2026 hubo aprox. 15 mill. de visitantes…».",
            question: "¿Qué vas a obtener?",
            options: [
              {
                text: "La voz leerá las abreviaturas de forma rara o letra por letra",
                correct: true,
              },
              {
                text: "La voz lo descifrará todo sola",
                correct: false,
              },
              {
                text: "Se saltará los números",
                correct: false,
              },
            ],
            explanation: "Las abreviaturas sonarán raras. Escríbelo con palabras: «en dos mil veintiséis hubo aproximadamente quince millones de visitantes».",
          },
          {
            type: "practice",
            note: "Prepara tu texto para la voz: escribe con letras las abreviaturas y los números, marca las pausas e indica cómo se pronuncian las palabras y los nombres difíciles. Puedes pedirle ayuda a un asistente de IA.",
          },
          {
            type: "summary",
            formula: "Números y abreviaturas con letras + pausas con signos de puntuación + pronunciación de palabras difíciles + una voz que encaje con el tono",
          },
        ],
      },
    },
    "12": {
      title: "Transcribir un mensaje de voz o una grabación",
      content: {
        skill: "Ya sabes convertir mensajes de voz y grabaciones en texto y en una lista de tareas",
        helperCriteria: "nombres de los participantes, términos, formato del resultado",
        cards: [
          {
            type: "result",
            text: "Un mensaje de voz largo o la grabación de una reunión → texto, un resumen en 5 puntos y una lista de tareas con nombres.",
          },
          {
            type: "tool",
            tools: [CHATGPT, GEMINI, ELEVENLABS],
            text: "La transcripción integrada del teléfono, ChatGPT o Gemini subiendo el audio, o la transcripción de ElevenLabs.",
          },
          {
            type: "howto",
            intro: "Tres formas:",
            layout: "options",
            items: [
              {
                title: "Transcripción integrada",
                text: "En muchos teléfonos, los mensajes de voz y las notas de voz se pueden pasar a texto en la propia app.",
              },
              {
                title: "Un asistente de IA",
                text: "Sube el archivo de audio a ChatGPT o Gemini y pídele que lo transcriba.",
              },
              {
                title: "Si ya tienes el texto",
                text: "Pégalo en la IA y pide un resumen y una lista de tareas.",
              },
            ],
            note: "Si grabas una conversación con otras personas, avísales y pide su permiso.",
          },
          {
            type: "quiz",
            situation: "En la transcripción salen mal los nombres y los términos de trabajo.",
            question: "¿Por qué pasó esto?",
            options: [
              {
                text: "La grabación tenía ruido y palabras desconocidas: hay que dárselas antes",
                correct: true,
              },
              {
                text: "La IA no entiende el español hablado",
                correct: false,
              },
              {
                text: "La grabación era demasiado corta",
                correct: false,
              },
            ],
            explanation: "El ruido y las palabras desconocidas. Di antes los nombres de los participantes y los términos, y graba en un lugar tranquilo.",
          },
          {
            type: "practice",
            improvedPrompt: "Transcribe esta grabación. Participantes: Lucía y Javier. Términos: Supabase, Expo. Después de la transcripción, haz un resumen en 5 puntos y una lista de tareas con el nombre de la persona responsable de cada una",
          },
          {
            type: "summary",
            formula: "Grabación sin ruido + nombres y términos antes + transcripción + resumen + tareas",
            text: "El permiso de todos los participantes es obligatorio.",
          },
        ],
      },
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
