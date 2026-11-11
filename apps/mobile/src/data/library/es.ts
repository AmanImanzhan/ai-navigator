// Справочник на испанском.

import type { LocaleLibrary } from "@/data/library/types";

export const ES: LocaleLibrary = {
  categories: {
    assistants: "Asistentes",
    search: "Búsqueda",
    images: "Imágenes",
    video: "Video",
    voice: "Voz",
    translation: "Traducción",
    spreadsheets: "Hojas de cálculo",
  },
  tools: {
    chatgpt: {
      name: "ChatGPT",
      about:
        "Un asistente de IA de OpenAI. Puedes escribirle, hablarle en voz alta y mandarle fotos y archivos.",
      strengths: [
        "Entiende el lenguaje de todos los días",
        "Puede buscar en internet, trabajar con archivos y crear imágenes",
        "Tiene modo de voz: útil, por ejemplo, para traducir en un viaje",
      ],
      free:
        "Hay un plan gratuito. Chatear no tiene un límite estricto, pero subir archivos, crear imágenes, usar la voz y analizar datos tienen sus propios límites. En algunos países, la versión gratuita puede mostrar anuncios.",
      notes: [
        "Edad: a partir de 13 años; los menores de 18 necesitan permiso de su madre, padre o tutor.",
        "Solo funciona en los países admitidos (la lista está en la ayuda de OpenAI). Si lo usas desde un país que no está en la lista, pueden bloquear tu cuenta.",
      ],
    },
    claude: {
      name: "Claude",
      about:
        "Un asistente de IA de Anthropic. Funciona especialmente bien con textos y documentos largos.",
      strengths: [
        "Lee con atención documentos largos: contratos, informes, cadenas de correos",
        "Escribe de forma tranquila y natural",
        "Puede conectarse a tus aplicaciones y servicios, buscar en internet y crear archivos",
      ],
      free:
        "Hay un plan gratuito con un límite de mensajes; el límite se renueva cada pocas horas y cada semana.",
      notes: [
        "Edad: a partir de 18 años.",
        "Solo funciona en los países de la lista oficial. Por ejemplo, no funciona en Rusia ni en China.",
      ],
    },
    gemini: {
      name: "Gemini",
      about:
        "Un asistente de IA de Google. Funciona en su propia app, en el navegador y dentro de otros servicios de Google.",
      strengths: [
        "Crea y edita imágenes, también a partir de tus fotos",
        "Tiene conversación por voz (Gemini Live) e investigaciones a fondo sobre un tema",
        "Está conectado con otros servicios de Google",
      ],
      free:
        "Hay una versión gratuita con una cuenta de Google. Incluye creación de imágenes, modo de voz y otras funciones, con límites. Los planes de pago dan más uso y modelos más potentes.",
      notes: [
        "Necesitas una cuenta de Google.",
        "Edad: a partir de 13 años con una cuenta personal (más en algunos países) y de 18 con una cuenta de trabajo.",
        "En el Espacio Económico Europeo, Suiza y el Reino Unido, los planes de pago son solo para mayores de 18.",
        "Funciona en la mayoría de los países, pero no en todos. La app para el teléfono puede estar disponible en lugares distintos que la versión web.",
      ],
    },
    copilot: {
      name: "Microsoft Copilot",
      about:
        "Un asistente de IA de Microsoft. Tiene su propia app y, con una suscripción de pago a Microsoft 365, viene integrado en Word, Excel, PowerPoint y Outlook.",
      strengths: [
        "Ayuda directamente en documentos de Word y hojas de Excel (con suscripción de pago)",
        "Puede chatear, hablar en voz alta y crear imágenes",
        "Práctico si ya usas productos de Microsoft",
      ],
      free:
        "Hay una versión gratuita; las funciones avanzadas son con suscripción.",
      notes: [
        "Necesitas una cuenta de Microsoft.",
        "Edad: a partir de 13 años, más en algunos países. Algunas funciones pueden no estar disponibles para menores de 18.",
        "En la suscripción Microsoft 365 Familia, por ahora las funciones de IA solo están disponibles para quien es titular de la suscripción.",
      ],
    },
    perplexity: {
      name: "Perplexity",
      about:
        "Un buscador con IA. Responde a tu pregunta con un texto claro y muestra de qué sitios web sacó la información.",
      strengths: [
        "Cada respuesta tiene enlaces a las fuentes: es fácil comprobarlas",
        "Sirve para preguntas sobre noticias y datos recientes",
        "Puede preparar un informe detallado sobre un tema complejo",
      ],
      free:
        "Hay una versión gratuita: búsqueda normal y unas pocas búsquedas «avanzadas» al día. La versión de pago Pro da más búsquedas, elección de modelos y creación de imágenes.",
      notes: [
        "Edad: a partir de 13 años; los menores necesitan el consentimiento de su madre, padre o tutor.",
      ],
    },
    ideogram: {
      name: "Ideogram",
      about:
        "Un servicio que crea imágenes a partir de una descripción. Escribe texto limpio y correcto en las imágenes mejor que la mayoría.",
      strengths: [
        "Los textos en tarjetas y logos salen sin errores en las letras",
        "Muchos estilos listos para usar",
        "Puedes usar las imágenes también con fines comerciales: así lo dice el sitio oficial",
      ],
      free:
        "Hay un plan gratuito con unas pocas generaciones que se renuevan cada semana. Según la ayuda oficial, las generaciones gratuitas solo se dan a quienes entran con Google, Apple o Microsoft, no con correo y contraseña.",
      notes: [
        "Todo lo que creas en el plan gratuito lo ve todo el mundo en una galería pública.",
        "Edad: a partir de 13 años; los menores necesitan el consentimiento de su madre, padre o tutor.",
      ],
    },
    kling: {
      name: "Kling",
      about:
        "Un servicio que convierte una foto o una descripción en un video corto.",
      strengths: [
        "Da vida a fotos antiguas",
        "Entiende descripciones detalladas del movimiento y de la cámara",
        "Hace videos a partir de texto y de imágenes",
      ],
      free:
        "Hay intentos gratis cada día. En el plan gratuito, los videos llevan marca de agua; solo se puede quitar con una suscripción de pago.",
      notes: [
        "Edad: a partir de 13 años (o más, si lo exige la ley de tu país); los menores solo pueden registrarse con el consentimiento de su madre, padre o tutor.",
        "Consulta en tu cuenta las condiciones de uso de los videos.",
      ],
    },
    dreamina: {
      name: "Dreamina",
      about:
        "Un servicio de los creadores de CapCut que crea imágenes y videos cortos a partir de una descripción o una foto.",
      strengths: [
        "Da créditos gratis cada día",
        "Hace videos a partir de texto y de tu propia foto",
        "Es fácil seguir editando el video en CapCut",
      ],
      free:
        "Cada día recibes créditos gratis. Cuántos depende de tu país, y cuántos videos salen con ellos depende del modelo, la duración y la calidad que elijas.",
      notes: [
        "Edad: a partir de 13 años; los menores de 18, solo con el consentimiento de su madre, padre o tutor. En algunos países la edad mínima es mayor.",
      ],
    },
    heygen: {
      name: "HeyGen",
      about:
        "Un servicio que crea videos en los que un «presentador», un avatar digital, lee tu texto.",
      strengths: [
        "Una gran biblioteca de avatares listos",
        "Puedes crear un avatar con tu propia foto y tu propia voz",
        "Un video se hace en unos minutos, sin grabar nada",
      ],
      free:
        "Hay un plan gratuito: unos pocos videos cortos al mes, con marca de agua. Sin marca de agua, solo en los planes de pago.",
      notes: [
        "Edad: a partir de 18 años.",
        "Crea un doble digital solo con tu propia foto y tu propia voz.",
      ],
    },
    capcut: {
      name: "CapCut",
      about:
        "Un editor de video para el teléfono y la computadora. Sirve para montar videos y añadir música, textos y efectos.",
      strengths: [
        "Edición sencilla desde el teléfono",
        "Muchas plantillas, tipografías y música",
        "Puedes unir varios videos cortos hechos con IA en uno solo",
      ],
      free:
        "Hay una versión gratuita con una selección limitada de plantillas, efectos y música. Algunas funciones son solo de Pro.",
      notes: [
        "Edad: a partir de 13 años; los menores de 18, solo con el consentimiento de su madre, padre o tutor. En algunos países la edad mínima es mayor.",
      ],
    },
    elevenlabs: {
      name: "ElevenLabs",
      about:
        "Un servicio que lee textos en voz alta con una voz muy natural y transcribe audio a texto.",
      strengths: [
        "Las voces suenan naturales, con entonación y pausas",
        "Una gran biblioteca de voces en distintos idiomas",
        "También hace lo contrario: convierte una grabación en texto",
      ],
      free:
        "Hay un plan gratuito con límites. Solo para uso personal, no comercial. Si publicas tu trabajo, tienes que indicar que la voz se hizo con ElevenLabs.",
      notes: [
        "Edad: a partir de 18 años.",
        "Para anuncios y canales monetizados necesitas un plan de pago.",
      ],
    },
    "google-translate": {
      name: "Traductor de Google",
      about:
        "El traductor de Google. Traduce textos, la voz y los carteles a través de la cámara del teléfono.",
      strengths: [
        "Modo Conversación: hablan por turnos y la traducción suena en voz alta",
        "La cámara traduce menús y carteles directamente en la pantalla",
        "Funciona sin internet si descargas los idiomas antes",
      ],
      free:
        "Sí. Descargar idiomas sin wifi gasta datos móviles.",
      notes: [
        "Descarga los idiomas con antelación, mejor con wifi.",
        "La cámara puede traducir con errores el texto pequeño, poco claro o decorativo.",
      ],
    },
    "google-lens": {
      name: "Google Lens",
      about:
        "La búsqueda por imagen de Google. Apunta con la cámara o sube una foto para encontrar imágenes parecidas, información sobre un objeto o el texto que contiene.",
      strengths: [
        "Muestra dónde más aparece una foto en internet: ayuda a detectar falsificaciones",
        "Puedes seleccionar una parte de la imagen y buscar solo eso",
        "Funciona en la app de Google y en Chrome, en Android y iPhone",
      ],
      free: "Sí.",
      notes: [
        "El historial de búsquedas visuales está desactivado por defecto: si no lo activas, las fotos que usas para buscar no se guardan en tu historial de actividad.",
      ],
    },
    "google-sheets": {
      name: "Hojas de cálculo de Google",
      about:
        "Las hojas de cálculo de Google, que funcionan en el navegador y en una app. Se parecen a Excel.",
      strengths: [
        "Funcionan en cualquier dispositivo, sin instalar nada",
        "Varias personas pueden trabajar a la vez en la misma hoja",
        "Entienden las fórmulas que propone la IA",
      ],
      free:
        "Gratis con una cuenta de Google. Las hojas ocupan espacio en tu almacenamiento gratuito, que se comparte entre Gmail, Google Drive y Google Fotos; si se acaba el espacio, no podrás crear archivos nuevos.",
      notes: [
        "Necesitas una cuenta de Google.",
        "Los nombres de las funciones y el separador de las fórmulas dependen del idioma y de la configuración regional de la hoja.",
      ],
    },
    excel: {
      name: "Excel",
      about:
        "Las hojas de cálculo de Microsoft. Hay un programa para la computadora y una versión web gratuita en el navegador.",
      strengths: [
        "El programa de hojas de cálculo más usado en el trabajo",
        "Entiende las fórmulas que propone la IA",
        "Con una suscripción de pago a Microsoft 365, Copilot viene integrado en Excel",
      ],
      free:
        "La versión web es gratis con una cuenta de Microsoft; los archivos se guardan en OneDrive. El programa para la computadora solo viene en una suscripción de pago a Microsoft 365.",
      notes: [
        "La versión web gratuita tiene menos funciones que el programa para la computadora y necesita internet.",
        "Los nombres de las funciones y el separador de las fórmulas dependen del idioma del programa.",
      ],
    },
  },
  concepts: {
    model: {
      title: "Modelo",
      text: "Un modelo es el «cerebro» de un asistente de IA: un programa entrenado con enormes cantidades de textos, imágenes y otros datos. ChatGPT, Claude y Gemini son aplicaciones, y dentro de cada una funcionan los modelos de su empresa. Un mismo servicio suele tener varios modelos: uno rápido para preguntas sencillas y otro más potente para tareas complejas. Es como en una app de taxis: el viaje es el mismo, pero puedes elegir la opción económica o la prémium.",
      example:
        "En la versión gratuita de un asistente puede responderte un modelo más sencillo, y en la de pago, uno más potente.",
    },
    "chatbot-vs-agent": {
      title: "Chatbot y agente: en qué se diferencian",
      text: "Un chatbot responde a tus mensajes: tú preguntas, él responde, y tú decides qué hacer con la respuesta. Un agente hace por su cuenta una tarea de varios pasos: por ejemplo, busca información en sitios web, rellena una hoja de cálculo y te manda el resultado. Al agente se le da más libertad, así que es aún más importante revisar lo que hace. En las lecciones usamos los asistentes en modo chat.",
      example:
        "Un chatbot te dirá qué hoteles mirar; un agente comparará él mismo los precios en varios sitios y hará una tabla.",
    },
    prompt: {
      title: "Petición (prompt)",
      text: "Una petición, o prompt, es lo que le escribes o le dices a la IA. Del prompt depende más que de nada el resultado: a una pregunta general, una respuesta general. Una buena petición explica la situación, la tarea, los límites y cómo quieres la respuesta.",
      example:
        "En lugar de «qué hago de cena»: «cocino para dos después del trabajo, tengo pollo y arroz, máximo 30 minutos, dame 3 opciones».",
    },
    context: {
      title: "Contexto",
      text: "El contexto es todo lo que la IA sabe de tu tarea en esta conversación: tus mensajes, los archivos que subiste y sus propias respuestas. Gracias al contexto no hace falta empezar de cero: puedes pedirle que mejore algo, como «hazlo más corto» o «cambia la segunda receta». En un chat nuevo, el asistente normalmente no recuerda de qué hablaron antes, salvo que el servicio tenga la memoria activada.",
      example:
        "La IA te propuso una receta con champiñones: basta con escribir «cambia los champiñones» y sabrá de qué receta hablas.",
    },
    hallucinations: {
      title: "«Alucinaciones» y cómo comprobar las respuestas",
      text: "Se llama «alucinación» a cuando la IA escribe con seguridad algo que no es cierto: confunde cifras o se inventa datos o enlaces. Pasa también en las versiones de pago. Por eso, pídele que cite del documento las cifras, fechas y cantidades importantes y compáralas con el original; para los datos, pide la fuente.",
      example:
        "En el resumen dice «las ventas crecieron un 18 %», pero en el informe es un 12 %. Pedir «cita la frase exacta de cada cifra» ayuda a encontrar el error.",
    },
    multimodal: {
      title: "Multimodal: texto, fotos y voz en un mismo lugar",
      text: "Multimodal significa que entiende distintos tipos de información: texto, fotos, voz, archivos. Los asistentes actuales pueden con todo eso en un mismo chat. Puedes sacarle una foto a una carta del banco y preguntar qué te piden, o hablar en voz alta, como por teléfono.",
      example:
        "Le sacas una foto a un menú en italiano y el asistente lo traduce y te explica qué son los platos.",
    },
    "plans-and-limits": {
      title: "Planes gratuitos y de pago, límites",
      text: "Casi todos los servicios de IA tienen un plan gratuito, pero con límites: cuántos mensajes, imágenes o videos puedes hacer al día, a la semana o al mes. Un plan de pago quita parte de los límites, da modelos más potentes y quita las marcas de agua. Los límites cambian a menudo, así que conviene revisarlos en el sitio del servicio antes de empezar. Si tienes pocos intentos gratis, primero piensa bien la petición y después genera.",
      example:
        "Tienes pocos videos gratis al día: mejor describir bien el movimiento una vez que gastar todos los intentos en «dale vida a esta foto».",
    },
    privacy: {
      title: "Privacidad: qué pasa con tus datos",
      text: "Lo que le escribes a la IA se guarda en el historial del chat y lo procesa el servicio. En muchos servicios puedes impedir que usen tus chats para entrenar modelos y borrar el historial. Nunca envíes contraseñas, códigos de SMS ni números de tarjetas o documentos, y comparte datos de otras personas solo con su permiso. Los nombres y números se pueden cambiar por marcas.",
      example:
        "En lugar de «mi documento es 12345678», escribe «mi documento es [número]»: la tarea es la misma, pero sin riesgo.",
    },
    "one-company-many-products": {
      title: "Una empresa, distintos productos",
      text: "Una misma empresa puede tener varios productos para tareas distintas. Por ejemplo, Claude es un asistente para todo el mundo, y Claude Code es una herramienta para programadores que trabaja directamente con código. OpenAI tiene una pareja parecida: ChatGPT para todo el mundo y Codex para programadores. Pueden funcionar con modelos de la misma empresa, pero son programas distintos y se aprenden por separado. Si no escribes código, lo que necesitas es un asistente normal.",
      example:
        "Una amiga programadora te recomienda Claude Code: para correos y tarjetas, te basta con Claude.",
    },
    "skills-and-connectors": {
      title: "Habilidades, complementos y conectores",
      text: "Son formas de enseñarle algo nuevo a un asistente o de darle acceso a tus servicios. Un conector une el asistente con, por ejemplo, Google Drive o tu calendario: después puede encontrar el archivo o la reunión que buscas. Las habilidades y los complementos son conjuntos listos de instrucciones y funciones para tareas concretas. Se activan en los ajustes del asistente, y el servicio siempre pide permiso para acceder a tus datos. Conecta solo lo que de verdad necesites.",
      example:
        "Con el calendario conectado, puedes preguntar «¿cuándo tengo tiempo libre esta semana?».",
    },
    "image-generation": {
      title: "Cómo dibuja la IA y por qué a veces fallan las letras",
      text: "Un generador de imágenes aprendió con millones de imágenes con descripciones y crea una imagen nueva a partir de la tuya, paso a paso, «revelándola» a partir de ruido. Para él, las letras son más un dibujo que un texto, así que las palabras a veces salen mal escritas: «FELIZ CUMPLAÑOS» en lugar de «FELIZ CUMPLEAÑOS». Ayuda dar el texto exacto entre comillas, decir dónde va y de qué tamaño, y usar un servicio que funcione bien con texto, como Ideogram.",
      example:
        "«Texto grande arriba: “¡Feliz cumpleaños, Pablo!”» funciona mejor que «una tarjeta de cumpleaños».",
    },
    deepfakes: {
      title: "Falsificaciones con IA (deepfakes): cómo funcionan",
      text: "Un deepfake es una foto, un video o una voz creados con IA para que parezcan y suenen como una persona real. A los estafadores les bastan unos segundos de una grabación de voz sacada de las redes sociales para imitarla. Detectar una falsificación a simple vista es cada vez más difícil, y ni siquiera la IA puede hacerlo con seguridad. Por eso, lo importante es comprobar el mensaje y la fuente, no la imagen: la prisa, el dinero y que te pidan hacer clic en un enlace son motivo para detenerte.",
      example:
        "Un «famoso» en un video promete dinero fácil: revisa su página oficial; si ahí no aparece, es un engaño.",
    },
  },
};
