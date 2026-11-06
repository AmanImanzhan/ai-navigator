// Уроки на испанском: названия направлений и уроков, содержимое уроков.
// Один урок здесь = будущая строка lesson_translations (lesson_id, locale = "es", title, content).

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
  name: "Traductor de Google",
  url: "https://translate.google.com",
};
const GOOGLE_SHEETS: ToolLink = {
  name: "Hojas de cálculo de Google",
  url: "https://sheets.google.com",
};

// Сообщение семье из урока 13: им делятся и из практики, и с карточки «Готово».
const FAMILY_MESSAGE =
  "Pongámonos de acuerdo en una palabra clave por si alguien llama haciéndose pasar por uno de nosotros y pide dinero. Propongo la palabra «…». No se la decimos a nadie fuera de la familia";

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
        helperCriteria: "ocasión, estilo, colores, texto entre comillas, posición del texto",
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
      content: {
        skill: "Ya sabes reconocer una llamada de estafa y cómo proteger a tu familia con una palabra clave",
        cards: [
          {
            type: "result",
            text: "Sabes exactamente qué hacer si te llama tu «hijo» o tu «nieto» llorando y te pide que le mandes dinero ya. Y tu familia tiene una palabra clave.",
          },
          {
            type: "info",
            label: "Lo que debes saber",
            text: "A los estafadores les bastan unos segundos de una voz sacada de las redes sociales para imitarla con IA. Por eso, la mejor protección no es intentar reconocer la voz de oído, sino fijarse en la situación. El número que aparece en la pantalla también se puede falsificar.",
          },
          {
            type: "howto",
            label: "Qué hacer",
            layout: "steps",
            items: [
              {
                title: "Parar",
                text: "Las prisas, que te pidan no contárselo a nadie y una forma de pago rara (tarjetas regalo, una transferencia urgente, criptomonedas) son las principales señales de estafa.",
              },
              {
                text: "Preguntar la palabra clave o algo que solo sepa tu familiar.",
              },
              {
                text: "Colgar y llamar tú al número que ya tienes guardado.",
              },
              {
                text: "Hablar con otra persona de la familia.",
              },
              {
                text: "No mandar nunca dinero durante una llamada así.",
              },
            ],
          },
          {
            type: "quiz",
            situation: "Te llama tu «nieto» llorando: tuvo un accidente, necesita dinero y te pide que no se lo cuentes a nadie.",
            question: "¿Qué haces ahora?",
            options: [
              {
                text: "Colgar y llamar a tu nieto a su número",
                correct: true,
              },
              {
                text: "Mandarle un poco de dinero para ayudarlo rápido",
                correct: false,
              },
              {
                text: "Seguir hablando y hacerle más preguntas",
                correct: false,
              },
            ],
            explanation: "Colgar y volver a llamar. El estafador intentará que no cuelgues: no se lo permitas.",
          },
          {
            type: "practice",
            improvedLabel: "Mensaje para tu familia:",
            improvedPrompt: FAMILY_MESSAGE,
            share: {
              label: "Enviar a la familia",
              message: FAMILY_MESSAGE,
            },
          },
          {
            type: "summary",
            formula: "Prisa + secreto + dinero = alto",
            text: "Cuelga, llama tú al número que tienes y pregunta la palabra clave.",
            share: {
              label: "Compartir la lección con tus padres",
              message: FAMILY_MESSAGE,
            },
          },
        ],
      },
    },
    "14": {
      title: "Fotos y videos falsos",
      content: {
        skill: "Ya sabes comprobar en un minuto si una foto o un video es falso",
        cards: [
          {
            type: "result",
            text: "Ves un «video de un famoso» que recomienda invertir dinero y en un minuto te das cuenta de que lo más probable es que sea falso, y sabes cómo comprobarlo.",
          },
          {
            type: "info",
            label: "Lo que debes saber",
            text: "Las falsificaciones hechas con IA son cada vez más realistas, y cada vez cuesta más detectarlas solo mirando. Por eso, lo importante no es revisar los píxeles, sino comprobar el mensaje y la fuente. Ni siquiera la IA puede detectar una falsificación con seguridad, así que, si una IA te dice «esto es real», eso no es una prueba.",
          },
          {
            type: "howto",
            label: "Cómo comprobarlo",
            intro: "Tres formas:",
            layout: "options",
            items: [
              {
                title: "El mensaje",
                text: "Prometer dinero fácil, meter prisa, pedirte que hagas clic en un enlace o que mandes dinero: son las señales más claras de engaño.",
              },
              {
                title: "La fuente",
                text: "¿Está este video o esta noticia en las páginas oficiales de esa persona o en medios importantes?",
              },
              {
                title: "Búsqueda por imagen",
                text: "Con Google Lens puedes ver dónde más aparece una foto y de dónde viene en realidad.",
              },
            ],
            note: "También puede haber pistas visuales (manos y dedos raros, un fondo que «se derrite», texto deformado, labios que no coinciden con lo que se dice), pero que no las veas no significa que el video sea real.",
          },
          {
            type: "quiz",
            situation: "Un empresario famoso aparece en un video invitando a invertir en una «nueva plataforma» con ganancias garantizadas.",
            question: "¿Cuál es la principal señal de engaño?",
            options: [
              {
                text: "El famoso promete dinero fácil y pide que hagas clic en un enlace",
                correct: true,
              },
              {
                text: "El video tiene buena calidad",
                correct: false,
              },
              {
                text: "La persona habla en tu idioma",
                correct: false,
              },
            ],
            explanation: "La promesa de dinero fácil y el enlace: el mensaje importa más que la calidad de la imagen.",
          },
          {
            type: "practice",
            note: "¿Ves una publicación o un video sospechoso? Responde tres preguntas: qué prometen, adónde lleva el enlace y si aparece en las páginas oficiales de esa persona. Si tienes dudas, comprueba la fuente.",
          },
          {
            type: "summary",
            formula: "Mensaje + fuente + búsqueda por imagen",
            text: "Dinero, prisa y un enlace = alto, aunque el video se vea perfecto.",
          },
        ],
      },
    },
    "15": {
      title: "Lo que no debes contarle a la IA",
      content: {
        skill: "Ya sabes usar la IA sin compartir con ella tus datos personales",
        cards: [
          {
            type: "result",
            text: "Usas la IA para asuntos personales y de trabajo sin darle nada que pueda perjudicarte a ti o a otras personas.",
          },
          {
            type: "info",
            label: "Lo que debes saber",
            text: "Lo que le escribes a la IA se guarda en el historial del chat y lo procesa el servicio. En los ajustes de muchos servicios puedes impedir que usen tus chats para entrenar la IA y borrar el historial: vale la pena hacerlo.",
          },
          {
            type: "howto",
            label: "Lo que nunca debes escribir",
            layout: "list",
            items: [
              {
                text: "Contraseñas y códigos que te llegan por SMS.",
              },
              {
                text: "Números de tarjeta y CVV, datos de tus cuentas bancarias.",
              },
              {
                text: "Números de tu documento de identidad, pasaporte u otros documentos.",
              },
              {
                text: "Datos personales de otras personas sin su permiso.",
              },
              {
                text: "Documentos confidenciales de la empresa sin autorización.",
              },
            ],
            note: "Cómo hacerlo sin riesgo: cambia los nombres y números por marcas como «Cliente A» o «[número de documento]», y describe la tarea sin detalles de más.",
          },
          {
            type: "quiz",
            situation: "Alguien pegó en la IA un extracto bancario completo, con el número de cuenta y los datos de su documento de identidad.",
            question: "¿Qué pasará?",
            options: [
              {
                text: "Los datos se guardarán en el historial del chat y quedarán en el servicio",
                correct: true,
              },
              {
                text: "La IA lo borrará todo enseguida",
                correct: false,
              },
              {
                text: "No pasará nada, es seguro",
                correct: false,
              },
            ],
            explanation: "Los datos se guardarán en el historial. Habría sido mejor quitar los números antes.",
          },
          {
            type: "practice",
            userPrompt: "Mi número de documento es 12345678 y vivo en la calle Los Olivos 5",
            improvedPrompt: "Mi número de documento es [número] y vivo en [dirección]",
            note: "La tarea es la misma, pero sin riesgo.",
          },
          {
            type: "summary",
            formula: "Nada de contraseñas, tarjetas ni documentos + datos de otros solo con permiso + cambiarlos por marcas + revisar los ajustes de privacidad",
          },
        ],
      },
    },
    "16": {
      title: "Una hoja de cálculo con fórmulas sin saber Excel",
      content: {
        skill: "Ya sabes conseguir fórmulas para tus hojas de cálculo con la IA, aunque no sepas Excel",
        helperCriteria: "programa e idioma, ubicación de los datos, rango de filas, qué calcular",
        cards: [
          {
            type: "result",
            text: "Una hoja de ventas en la que el total del mes de cada empleado se calcula solo, con una fórmula que escribió la IA.",
          },
          {
            type: "tool",
            tools: [CHATGPT, GEMINI, GOOGLE_SHEETS, EXCEL],
            text: "ChatGPT o Gemini para las fórmulas; Hojas de cálculo de Google o Excel para la hoja en sí.",
          },
          {
            type: "howto",
            intro: "Tres formas:",
            layout: "options",
            items: [
              {
                title: "Pedir una fórmula",
                text: "Explica qué hay en cada columna, en qué fila empiezan los datos y qué quieres calcular.",
              },
              {
                title: "Pedir la estructura de la hoja",
                text: "La IA te propondrá columnas y filas de ejemplo que puedes pegar en tu hoja.",
              },
              {
                title: "Subir el archivo y pedir que lo analice",
                text: "Solo si no tiene datos confidenciales.",
              },
            ],
            note: "Importante: en Excel y en Hojas de cálculo de Google en español, las funciones tienen nombres en español (SUMA, SI, BUSCARV) y muchas veces se separan con punto y coma. Dile a la IA qué programa usas y en qué idioma, y si la fórmula no funciona, avísale.",
          },
          {
            type: "quiz",
            situation: "La IA te dio una fórmula, pero la hoja muestra un error.",
            question: "¿Por qué pasó esto?",
            options: [
              {
                text: "No dijiste en qué columnas están los datos ni en qué fila empiezan",
                correct: true,
              },
              {
                text: "Hojas de cálculo de Google no acepta fórmulas de la IA",
                correct: false,
              },
              {
                text: "Hace falta la versión de pago de la IA",
                correct: false,
              },
            ],
            explanation: "No dijiste las columnas ni las filas: la IA adivinó dónde estaban los datos y se equivocó.",
          },
          {
            type: "practice",
            improvedPrompt: "Uso Hojas de cálculo de Google en español. En la columna A hay fechas, en la B nombres de empleados y en la C el total de cada venta. Los datos van de la fila 2 a la 200. Escribe una fórmula que sume las ventas de cada empleado en octubre de 2026, con los nombres de las funciones en español. Dime si debo separar los argumentos con coma o con punto y coma y en qué celda ponerla",
          },
          {
            type: "summary",
            formula: "Qué programa y en qué idioma + qué hay en cada columna + en qué fila empiezan los datos + qué calcular + dónde ponerla",
          },
        ],
      },
    },
    "17": {
      title: "El acta de una reunión a partir de una grabación",
      content: {
        skill: "Ya sabes convertir la grabación de una reunión en un acta clara con tareas y plazos",
        helperCriteria: "estructura, formato de las tareas, marcar lo que falta, no inventar nada",
        cards: [
          {
            type: "result",
            text: "De la grabación de una reunión de una hora → un acta de una página: asistentes, decisiones, tareas con responsables y plazos, y temas pendientes.",
          },
          {
            type: "tool",
            tools: [CHATGPT, CLAUDE],
            text: "ChatGPT o Claude. Haz la transcripción como en la lección 12.",
          },
          {
            type: "howto",
            intro: "Tres formas:",
            layout: "options",
            items: [
              {
                title: "A partir de la transcripción",
                text: "Pega el texto de la grabación.",
              },
              {
                title: "A partir de tus notas",
                text: "Pega tus notas breves de la reunión y la IA les dará forma de acta.",
              },
              {
                title: "A partir del audio",
                text: "Sube la grabación a un asistente de IA que acepte audio.",
              },
            ],
            note: "Graba las reuniones solo con el permiso de los participantes; las reuniones confidenciales, solo si tu empresa permite estos servicios.",
          },
          {
            type: "quiz",
            situation: "En el acta, las tareas no tienen plazos.",
            question: "¿Qué le dices a la IA ahora?",
            options: [
              {
                text: "Pedirle que ponga los plazos y que marque «sin plazo definido» donde no se dijeron",
                correct: true,
              },
              {
                text: "Inventarte tú los plazos y añadirlos",
                correct: false,
              },
              {
                text: "Volver a transcribir la grabación",
                correct: false,
              },
            ],
            explanation: "Pedirle que ponga los plazos y marque los que faltan: así ves enseguida qué queda por acordar.",
          },
          {
            type: "practice",
            improvedPrompt: "Haz el acta de la reunión a partir de esta transcripción. Estructura: fecha, asistentes, decisiones tomadas, tareas con el formato «quién — qué — para cuándo» y temas pendientes. Si no se mencionó un plazo o un responsable, indícalo. No añadas nada por tu cuenta",
          },
          {
            type: "summary",
            formula: "Fuente (transcripción, notas o audio) + estructura clara + «quién — qué — para cuándo» + marcar lo que falta + nada inventado",
          },
        ],
      },
    },
    "18": {
      title: "Un correo de trabajo en un minuto",
      content: {
        skill: "Ya sabes escribir un correo de trabajo en un minuto: educado, preciso y con datos",
        helperCriteria: "destinatario, datos, petición, tono, extensión, asunto",
        cards: [
          {
            type: "result",
            text: "Un correo claro a un proveedor sobre un pedido que se retrasa: educado pero firme, con el número de pedido, las fechas y lo que necesitas, y con su asunto.",
          },
          {
            type: "tool",
            tools: [CHATGPT, CLAUDE, GEMINI],
            text: "ChatGPT, Claude o Gemini.",
          },
          {
            type: "howto",
            intro: "Tres formas:",
            layout: "options",
            items: [
              {
                title: "Desde cero",
                text: "A quién, de qué trata, los datos (números, fechas), qué quieres, el tono y la extensión.",
              },
              {
                title: "Responder a un correo",
                text: "Pega el correo que recibiste, sin datos confidenciales, y di qué quieres responder.",
              },
              {
                title: "Mejorar un borrador",
                text: "Pega tu texto y pide que lo haga más corto, más amable o más firme.",
              },
            ],
          },
          {
            type: "quiz",
            situation: "Petición: «escribe un correo al proveedor sobre un retraso».",
            question: "¿Qué vas a obtener?",
            options: [
              {
                text: "Un correo educado pero genérico, sin tus fechas ni el número de pedido",
                correct: true,
              },
              {
                text: "Un correo preciso con tus fechas y tus condiciones",
                correct: false,
              },
              {
                text: "Una queja dura con amenazas",
                correct: false,
              },
            ],
            explanation: "Educado pero genérico: la IA no conoce los datos y tendrás que reescribir el correo.",
          },
          {
            type: "practice",
            improvedPrompt: "Escribe un correo al proveedor «Productos Frescos». El pedido n.º [número] del 20 de octubre tenía que llegar el día 27, pero aún no lo hemos recibido. Necesitamos: la fecha exacta de entrega antes de que acabe el día y un reemplazo si no pueden entregarlo antes del viernes. Tono: educado pero firme. Máximo 120 palabras. Escribe el asunto aparte",
            followUp: {
              hint: "Para pulirlo",
              prompt: "Hazlo un poco más formal y agradece la colaboración hasta ahora",
            },
          },
          {
            type: "summary",
            formula: "Destinatario + datos (números, fechas) + qué quieres + tono + extensión + asunto",
          },
        ],
      },
    },
    "19": {
      title: "Lo esencial de un informe largo",
      content: {
        skill: "Ya sabes resumir un informe largo y comprobar las cifras del resumen",
        helperCriteria: "rol, objetivo, estructura, referencias a la fuente, no inventar, paso de comprobación",
        cards: [
          {
            type: "result",
            text: "Un informe de 15 páginas → un resumen de media página: tres conclusiones principales, cifras clave con número de página, riesgos y decisiones que hay que tomar. Una hora de lectura se convierte en 5 minutos, pero hay una trampa que veremos en esta lección.",
          },
          {
            type: "tool",
            tools: [CLAUDE, CHATGPT],
            text: "Claude o ChatGPT: en los dos puedes subir un PDF o un Word. Antes de subir un documento de trabajo, averigua si tu empresa lo permite; no subas nada confidencial sin permiso.",
          },
          {
            type: "howto",
            layout: "steps",
            items: [
              {
                text: "Sube el archivo.",
              },
              {
                title: "Di quién eres y para qué",
                text: "«Soy responsable de un departamento y mañana voy a revisar este informe con la dirección».",
              },
              {
                title: "Marca la estructura",
                text: "Conclusiones principales, cifras, riesgos, decisiones.",
              },
              {
                text: "Pide el número de página de cada cifra.",
              },
              {
                title: "Prohíbele inventar",
                text: "«No añadas nada que no esté en el informe. Si faltan datos, dilo».",
              },
            ],
          },
          {
            type: "quiz",
            situation: "En el resumen dice «las ventas crecieron un 18 %», pero en el informe es un 12 %.",
            question: "¿Por qué pasó esto?",
            options: [
              {
                text: "Había una errata en el informe",
                correct: false,
              },
              {
                text: "La IA puede confundir o inventarse cifras",
                correct: true,
              },
              {
                text: "Había que usar la versión de pago",
                correct: false,
              },
            ],
            explanation: "La IA puede confundir o inventarse cifras: se llama «alucinación» y también pasa en las versiones de pago. Comprueba siempre las cifras clave.",
          },
          {
            type: "practice",
            improvedPrompt: "Soy responsable del departamento de ventas. Mañana voy a revisar este informe con la dirección. Haz un resumen de media página como máximo: 1) tres conclusiones principales; 2) cifras clave con el número de página; 3) riesgos; 4) decisiones que hay que tomar. No añadas nada que no esté en el informe. Si faltan datos, dilo",
            followUp: {
              hint: "Segundo paso",
              prompt: "Comprueba cada cifra del resumen con el texto del informe y cita la frase exacta de cada una",
            },
          },
          {
            type: "summary",
            formula: "Rol y objetivo + estructura + referencias a páginas + no inventar + comprobar las cifras",
            text: "La IA te ahorra una hora de lectura, pero la responsabilidad de las cifras es tuya.",
          },
        ],
      },
    },
    "20": {
      title: "Preparar una reunión con tu equipo",
      content: {
        skill: "Ya sabes preparar una reunión con tu equipo: agenda, respuestas a las objeciones y resumen",
        helperCriteria: "rol, tema, duración, contexto del equipo, formato del resultado",
        cards: [
          {
            type: "result",
            text: "La agenda de una reunión de 30 minutos con el tiempo de cada punto, respuestas preparadas a las objeciones del equipo y un breve mensaje de resumen para después.",
          },
          {
            type: "tool",
            tools: [CHATGPT, CLAUDE],
            text: "ChatGPT o Claude.",
          },
          {
            type: "howto",
            intro: "Tres formas:",
            layout: "options",
            items: [
              {
                title: "Agenda",
                text: "Tema, duración, participantes, objetivo: la IA repartirá el tiempo entre los puntos.",
              },
              {
                title: "Ensayo",
                text: "Pídele a la IA que haga de alguien del equipo que está en contra de los cambios y practica tus respuestas.",
              },
              {
                title: "Resumen",
                text: "Después de la reunión, pega tus notas y la IA escribirá un mensaje para el equipo con las decisiones y las tareas.",
              },
            ],
          },
          {
            type: "quiz",
            situation: "La IA preparó una agenda de 2 horas, pero tienes 30 minutos.",
            question: "¿Qué le dices a la IA ahora?",
            options: [
              {
                text: "Pedirle que la ajuste a 30 minutos y deje los 3 puntos principales",
                correct: true,
              },
              {
                text: "Borrar puntos a mano, al azar",
                correct: false,
              },
              {
                text: "Alargar la reunión a 2 horas",
                correct: false,
              },
            ],
            explanation: "Pedirle que la ajuste a 30 minutos: la IA elegirá lo importante y volverá a repartir el tiempo.",
          },
          {
            type: "practice",
            improvedPrompt: "Dirijo un equipo de 6 personas. El viernes tenemos una reunión de 30 minutos para hablar del cambio a un nuevo horario de turnos, y puede que el equipo no esté contento. Prepara una agenda con el tiempo de cada punto. Después, enumera 5 objeciones que pueden surgir y cómo responderlas con calma",
            followUp: {
              hint: "Extra",
              prompt: "Ahora haz de alguien del equipo que está en contra del nuevo horario: voy a practicar mis respuestas",
            },
          },
          {
            type: "summary",
            formula: "Quién eres + tema y duración + ánimo del equipo + agenda con tiempos + objeciones y respuestas + ensayo",
          },
        ],
      },
    },
    "21": {
      title: "Explicar bien una tarea a alguien de tu equipo",
      content: {
        skill: "Ya sabes asignar tareas para que se entiendan a la primera",
        helperCriteria: "resultado, objetivo, plazo, cuándo está terminada, recursos, a quién preguntar",
        cards: [
          {
            type: "result",
            text: "Una tarea que la persona de tu equipo entiende a la primera: qué resultado se espera, para qué, para cuándo, cómo saber que está lista y a quién acudir con dudas.",
          },
          {
            type: "tool",
            tools: [CHATGPT, CLAUDE],
            text: "ChatGPT o Claude.",
          },
          {
            type: "howto",
            intro: "Tres formas:",
            layout: "options",
            items: [
              {
                title: "A partir de unas notas",
                text: "Escribe en pocas palabras lo que necesitas y la IA lo convertirá en una tarea clara.",
              },
              {
                title: "A partir de una petición de arriba",
                text: "Pega el mensaje de la dirección o de un cliente y la IA lo convertirá en una tarea para tu equipo.",
              },
              {
                title: "Una revisión",
                text: "Pega una tarea que ya escribiste y pide que busque lo que podría no entenderse.",
              },
            ],
          },
          {
            type: "quiz",
            situation: "La tarea: «Prepara el informe de ventas para el viernes».",
            question: "¿Qué vas a obtener?",
            options: [
              {
                text: "Hará un informe, pero no el que esperabas",
                correct: true,
              },
              {
                text: "Hará exactamente lo que necesitas",
                correct: false,
              },
              {
                text: "Se negará a hacerlo",
                correct: false,
              },
            ],
            explanation: "Habrá un informe, pero no el correcto: no está claro de qué periodo, para quién ni qué debe incluir.",
          },
          {
            type: "practice",
            improvedPrompt: "Ayúdame a asignar una tarea a alguien de mi equipo. Notas: informe de ventas de octubre, lo necesito para una reunión con la dirección el lunes. Explica: qué resultado se espera, para qué sirve, el plazo, qué debe incluir el informe, de dónde sacar los datos y a quién preguntar las dudas. Tono cercano. Después, enumera las preguntas que podría hacerme esa persona: las responderé de antemano",
          },
          {
            type: "summary",
            formula: "Resultado + para qué + plazo + cuándo está terminada + de dónde sacar los datos + a quién preguntar",
          },
        ],
      },
    },
  },
};
