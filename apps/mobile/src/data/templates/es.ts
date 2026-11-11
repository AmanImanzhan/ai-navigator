// Шаблоны на испанском: все 105 шаблонов и предупреждения уроков.
// Один шаблон = будущая строка template_translations (template_id, locale = "es", …).

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

export const ES: LocaleTemplates = {
  lessonNotes: {
    "3":
      "Antes de cada petición de esta lección: tapa en la foto los números de cuenta, de documentos y tu dirección, o bórralos del texto.",
    "5":
      "Sube solo fotos tuyas o de personas que te hayan dado permiso.",
    "6":
      "Si el logo es para un negocio real, revisa las condiciones de uso del plan gratuito.",
    "7":
      "Da vida a fotos de tus seres queridos solo si tu familia está de acuerdo.",
    "10":
      "Descarga los idiomas en el Traductor de Google antes de viajar: así funciona sin internet.",
    "11":
      "ElevenLabs se puede usar a partir de los 18 años. En el plan gratuito, las locuciones son solo para uso personal.",
    "12":
      "Si grabas una conversación con otras personas, avísales.",
    "13":
      "Estas plantillas son comprobaciones y recordatorios. No escribas en las peticiones nombres, teléfonos ni números de tarjetas o documentos.",
    "14":
      "La IA no puede distinguir con seguridad una falsificación, así que en estas plantillas te ayuda a comprobar, no da un veredicto.",
    "15":
      "Estas plantillas son comprobaciones y recordatorios. No escribas en las peticiones nombres, teléfonos ni números de tarjetas o documentos.",
    "17":
      "Graba las reuniones solo con el permiso de los participantes.",
    "19":
      "Antes de subir un documento de trabajo, averigua si tu empresa lo permite.",
  },
  templates: {
    "1.1": {
      title: "Las cenas de la semana",
      purpose: "Para no tener que pensar cada noche qué cocinar.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Preparo la cena para [cuántas personas] después del trabajo. Haz un menú de cenas para la semana. Límites: no más de [cuántos minutos] para cocinar, un presupuesto de [cantidad] a la semana, no comemos [alimentos]. Responde con una tabla por días y una lista de compras",
      example:
        "Una tabla con 7 cenas y su tiempo de preparación, y una lista de compras ordenada por secciones del súper.",
    },
    "1.2": {
      title: "Ideas de regalo",
      purpose: "Cuando necesitas un regalo y no se te ocurre nada.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Necesito un regalo para [quién], la ocasión es [ocasión]. A esta persona le gusta [aficiones]. Presupuesto: hasta [cantidad]. Propón 5 ideas, cada una con una línea de por qué le gustaría",
      example:
        "5 ideas como «Un set para probar tés: le encanta descubrir sabores nuevos», con explicaciones breves.",
    },
    "1.3": {
      title: "Comparar productos antes de comprar",
      purpose: "Elegir una aspiradora, un teléfono o un hervidor sin perderte entre opiniones.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Estoy eligiendo [qué]. Lo que me importa: [qué te importa]. Presupuesto: hasta [cantidad]. Compara 3 buenas opciones en una tabla: ventajas, desventajas y precio aproximado. Al final, dime cuál elegirías y por qué",
      example:
        "Una tabla con tres modelos, sus ventajas y desventajas, y una recomendación breve. Confirma los precios en la tienda.",
    },
    "1.4": {
      title: "Un plan de ejercicio en casa",
      purpose: "Empezar a hacer ejercicio sin gimnasio ni entrenador.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Tengo [edad] años y quiero [objetivo] haciendo ejercicio en casa. Tengo [qué tienes]. Dispongo de [cuántos minutos] al día. Haz un plan de 2 semanas: ejercicios por día, breve, en una lista. Si algún ejercicio requiere más cuidado, márcalo",
      example:
        "Un plan de 14 días, de 15 a 20 minutos diarios, con ejercicios fáciles de seguir y notas sobre dónde ir con calma.",
    },
    "1.5": {
      title: "Explicar un tema complicado con palabras sencillas",
      purpose: "Entender eso de lo que todos hablan, desde la inflación hasta la nube.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Explícale qué es [tema] a alguien que no sabe nada del tema. Lo necesito para [para qué]. Sin tecnicismos, en menos de 150 palabras y termina con un ejemplo de la vida diaria",
      example:
        "Una explicación breve de media página y un ejemplo cotidiano fácil de recordar.",
    },
    "2.1": {
      title: "Felicitación a un compañero por un cumpleaños especial",
      purpose: "Cuando quieres decir algo cariñoso y no solo «muchas felicidades».",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Escribe una felicitación para mi compañero de trabajo [nombre] por [ocasión]. Lo que sé de él: [2–3 detalles]. Tono: [tono]. Menos de 80 palabras, dame 3 opciones",
      example:
        "Tres mensajes breves que mencionan su afición a la pesca y su proyecto favorito.",
    },
    "2.2": {
      title: "Agradecimiento a una maestra o a un médico",
      purpose: "Dar las gracias de una forma que de verdad se note.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Escribe un agradecimiento para [a quién] de parte de [de quién]. Lo que agradecemos: [momento concreto]. Tono: cariñoso, sin exagerar. Para una tarjeta, 3–4 frases, dame 2 opciones",
      example:
        "Dos textos para una tarjeta con un momento concreto, como la ayuda de la maestra para preparar la feria de ciencias.",
    },
    "2.3": {
      title: "Una disculpa",
      purpose: "Cuando te equivocaste y quieres disculparte de verdad.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Ayúdame a pedirle perdón a [quién] por [qué pasó]. Lo importante: [detalles]. Tono: sincero, sin excusas. Breve, para un mensaje, dame 3 opciones",
      example:
        "Tres mensajes breves sin «pero» ni excusas, con una propuesta para arreglarlo.",
    },
    "2.4": {
      title: "Un brindis para una celebración",
      purpose: "Una boda, un cumpleaños especial, una jubilación: cuando toca decir unas palabras en voz alta.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Escribe un brindis para [ocasión] para [quién]. Detalles: [2–3 historias o rasgos]. Tono: [tono]. Para decirlo en un minuto, dame 2 opciones",
      example:
        "Dos brindis de un minuto con una anécdota divertida y un deseo cariñoso al final.",
    },
    "2.5": {
      title: "Una queja educada a la administración del edificio",
      purpose: "Cuando algo no funciona y quieres que lean tu mensaje y te respondan.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Escribe un correo a [organización] sobre un problema: [qué pasó], empezó [cuándo]. Lo que quiero: [qué quieres]. Tono: educado pero firme. Menos de 150 palabras, dame 2 opciones",
      example:
        "Dos correos tranquilos que describen el problema, la fecha y una petición concreta.",
    },
    "3.1": {
      title: "Entender una factura de servicios",
      purpose: "Saber por qué este mes la factura de luz o agua salió así.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Explícame con palabras sencillas esta factura de [mes]. ¿Por qué el total es ese? ¿Qué líneas suelen cambiar de un mes a otro? Cita las líneas con las cantidades y la fecha límite de pago",
      example:
        "Un desglose línea por línea: cuánto cuesta cada cosa, qué subió y hasta cuándo pagar, con citas.",
    },
    "3.2": {
      title: "Un contrato antes de firmar",
      purpose: "Entender un contrato de alquiler, de servicios o un préstamo antes de firmarlo.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Este es un contrato de [tipo]. Explícame con palabras sencillas: a qué me comprometo, qué penalizaciones y plazos hay y cómo cancelarlo. Cita las cláusulas sobre dinero y plazos. ¿En qué debo fijarme antes de firmar?",
      example:
        "Una lista breve de obligaciones, penalizaciones y plazos con el número de cláusula, y 3 puntos para preguntar. Las decisiones importantes, con un especialista.",
    },
    "3.3": {
      title: "Una carta de un organismo público",
      purpose: "Cuando llega una carta oficial y no sabes qué hacer.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Recibí una carta de [organismo]. Explícame con palabras sencillas: qué me piden, para qué fecha y qué pasa si no hago nada. Cita las frases con plazos y cantidades",
      example:
        "3–4 frases sobre lo que te piden y citas exactas con el plazo y la cantidad.",
    },
    "3.4": {
      title: "Resultados médicos antes de la consulta",
      purpose: "Entender los términos de tus análisis y preparar preguntas para el médico.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Explícame con palabras sencillas estos resultados: [qué son: un análisis de sangre, una ecografía]. ¿Qué significan los términos y qué valores están fuera de lo normal? Cita esas partes. ¿Qué preguntas le hago al médico? No hagas un diagnóstico",
      example:
        "Una lista de términos explicados, los valores señalados y 5 preguntas para el médico. Las decisiones sobre el tratamiento las toma el médico.",
    },
    "3.5": {
      title: "Entender un manual de instrucciones",
      purpose: "Cuando el manual es largo y solo necesitas hacer una cosa.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Con este manual de [aparato], explícame con palabras sencillas cómo [qué hacer]. Paso a paso, breve. Cita las advertencias importantes",
      example:
        "5 pasos en vez de 40 páginas y dos advertencias citadas del manual.",
    },
    "4.1": {
      title: "Una invitación de cumpleaños",
      purpose: "Invitar con estilo y no con un mensaje en el grupo.",
      tools: [IDEOGRAM],
      prompt:
        "Invitación de cumpleaños, estilo: [estilo], colores: [colores]. Texto grande arriba: «[texto de la invitación]», debajo en pequeño: «[fecha, hora y lugar]». En español y sin errores",
      example:
        "Una invitación alegre con el texto bien escrito, «¡Te espero en mis 40!», y la fecha abajo.",
    },
    "4.2": {
      title: "Una tarjeta para una fecha especial",
      purpose: "Felicitar el Día de la Madre, el Día del Maestro o Navidad.",
      tools: [IDEOGRAM],
      prompt:
        "Una tarjeta para [fecha especial] para [quién], estilo: [estilo], colores: [colores]. Texto grande en el centro: «[texto]». En español y sin errores",
      example:
        "Una tarjeta en acuarela con el texto «¡Feliz Día de la Madre, mamá!» sin errores en las letras.",
    },
    "4.3": {
      title: "Un aviso para el edificio",
      purpose: "Un aviso que la gente vea y lea.",
      tools: [IDEOGRAM, CHATGPT],
      prompt:
        "Un aviso para un edificio de viviendas: estilo sencillo, fondo blanco, letras grandes y negras. Título arriba: «[título]», debajo el texto: «[texto del aviso]». En español, sin errores y que se lea de lejos",
      example:
        "Una hoja limpia con el título «Corte de agua el 12 de noviembre» y un texto breve.",
    },
    "4.4": {
      title: "Una tarjeta con tu propia foto",
      purpose: "Convertir una foto familiar de verdad en una tarjeta.",
      tools: [GEMINI, CHATGPT],
      prompt:
        "Convierte esta foto en una tarjeta para [ocasión]. No cambies la foto, añade [adornos]. Texto abajo: «[texto]», en letras blancas de tamaño medio. En español y sin errores",
      example:
        "Tu foto con un marco de hojas de otoño y el texto «¡Feliz aniversario!».",
    },
    "4.5": {
      title: "Una etiqueta para frascos caseros",
      purpose: "Etiquetar frascos de mermelada o frasquitos para regalar.",
      tools: [IDEOGRAM],
      prompt:
        "Una etiqueta redonda para [producto] casero, estilo: [estilo], colores: [colores]. Texto en el centro: «[nombre]», debajo en pequeño: «[año o nombre]». En español y sin errores",
      example:
        "Una etiqueta de estilo rústico con «Mermelada de cereza» y «Verano 2026».",
    },
    "5.1": {
      title: "Una foto profesional para tu currículum",
      purpose: "Cuando necesitas una foto profesional y no tienes fotógrafo.",
      tools: [GEMINI, CHATGPT],
      prompt:
        "Convierte esta foto en un retrato profesional para mi currículum. Conserva mi cara, mi peinado y mi expresión como en la foto. Ropa: [ropa], fondo: [color] liso. Retrato de los hombros hacia arriba",
      example:
        "Un retrato cuidado con chaqueta sobre fondo gris claro en el que se te reconoce.",
    },
    "5.2": {
      title: "Una foto familiar convertida en cuadro",
      purpose: "Un regalo para tus padres o algo para decorar la casa.",
      tools: [GEMINI, CHATGPT],
      prompt:
        "Convierte esta foto familiar en un cuadro al estilo de [estilo]. Conserva las caras de todos y cómo están colocados. Fondo: [fondo]. Formato horizontal, para imprimir",
      example:
        "Una foto familiar al estilo de la pintura al óleo, con todos reconocibles, lista para imprimir en lienzo.",
    },
    "5.3": {
      title: "Un retrato de tu mascota",
      purpose: "Una foto de perfil divertida o un regalo para alguien que adora a los animales.",
      tools: [GEMINI, CHATGPT],
      prompt:
        "Convierte esta foto de mi [mascota] en un retrato al estilo de [estilo]. Conserva los colores del pelaje y los rasgos de la cara. Fondo: [fondo], formato cuadrado",
      example:
        "Tu gato como un rey en un retrato antiguo, con los mismos colores y la misma mirada pícara.",
    },
    "5.4": {
      title: "Un personaje para un cuento infantil",
      purpose: "Dibujar al protagonista de un cuento que inventaste, sin fotos.",
      tools: [GEMINI, CHATGPT],
      prompt:
        "Dibuja un personaje para un cuento infantil: [quién es y cómo es], ropa: [ropa]. Estilo: [estilo]. Fondo blanco, de cuerpo entero",
      example:
        "Un erizo simpático con bufanda roja al estilo de las ilustraciones de cuentos.",
    },
    "5.5": {
      title: "Un retrato disfrazado",
      purpose: "Una foto de perfil divertida o una tarjeta en broma.",
      tools: [GEMINI, CHATGPT],
      prompt:
        "Muéstrame, a partir de esta foto, como [personaje]. Conserva los rasgos de mi cara y el color de mi pelo. Estilo: [estilo], fondo: [fondo], formato vertical",
      example:
        "Tú con traje de astronauta sobre un fondo de estrellas, con la cara bien reconocible.",
    },
    "6.1": {
      title: "Un logo para un negocio desde casa",
      purpose: "Tarjetas de visita y redes sociales para una manicurista, un técnico a domicilio o repostería por encargo.",
      tools: [IDEOGRAM],
      prompt:
        "Logo para [tipo de negocio] llamado «[nombre]». Carácter: [carácter]. Colores: [colores]. Un emblema sencillo con el nombre, fondo blanco. El nombre en español, grande y fácil de leer. Dame 4 opciones",
      example:
        "4 versiones del logo «Uñas con Encanto» en tonos rosa pálido con un emblema cuidado.",
    },
    "6.2": {
      title: "Un ícono para un blog o canal",
      purpose: "Una foto de perfil que la gente reconozca en su feed.",
      tools: [IDEOGRAM],
      prompt:
        "Un ícono redondo para un blog sobre [tema] llamado «[nombre]». Carácter: [carácter], colores: [colores]. Una forma sencilla que se vea bien incluso en tamaño pequeño. Dame 4 opciones",
      example:
        "4 íconos redondos para el blog «Huerto Fácil» que se leen bien incluso en miniatura.",
    },
    "6.3": {
      title: "Un logo a partir de tu dibujo",
      purpose: "Cuando la idea ya está dibujada a mano, pero se ve poco prolija.",
      tools: [CHATGPT],
      prompt:
        "Convierte mi dibujo en un logo limpio para «[nombre]». Conserva la idea del dibujo y deja las líneas uniformes. Colores: [colores], fondo blanco. Dame 3 opciones",
      example:
        "Tu boceto de una taza de café convertido en tres logos limpios.",
    },
    "6.4": {
      title: "Un escudo para un equipo o club",
      purpose: "Camisetas, diplomas, el grupo del equipo.",
      tools: [IDEOGRAM],
      prompt:
        "Un escudo para [equipo o club] llamado «[nombre]». Símbolo: [símbolo]. Carácter: [carácter], colores: [colores]. Forma sencilla de escudo o círculo, fondo blanco. Dame 4 opciones",
      example:
        "4 escudos para el club de ajedrez «La Torre» con un símbolo claro.",
    },
    "6.5": {
      title: "Un monograma con iniciales",
      purpose: "Invitaciones de boda, envoltorios de regalo, bordados.",
      tools: [IDEOGRAM],
      prompt:
        "Un monograma con las letras «[letras]» para [ocasión]. Estilo: [estilo], color: [color]. Sencillo y fácil de leer en tamaño pequeño, fondo blanco. Dame 4 opciones",
      example:
        "4 monogramas elegantes «A&M» para invitaciones de boda.",
    },
    "7.1": {
      title: "Un retrato que se gira hacia ti",
      purpose: "Dar vida a un retrato antiguo de tu abuelo o tu abuela.",
      tools: [KLING, DREAMINA],
      prompt:
        "Dale vida a esta foto: [quién] gira la cabeza despacio hacia la cámara y asiente un poco. La cámara no se mueve. Movimientos suaves y naturales. No cambies los rasgos de la cara",
      example:
        "Un video de 5 segundos en el que el abuelo, en una foto de los años 60, mira a la cámara y asiente.",
    },
    "7.2": {
      title: "La foto de boda de tus padres",
      purpose: "Un regalo para su aniversario de boda.",
      tools: [KLING, DREAMINA],
      prompt:
        "Dale vida a esta foto de boda: la pareja se mira y sonríe, [detalle] se mueve un poco con la brisa. La cámara no se mueve. Movimientos lentos. No cambies las caras",
      example:
        "Un video corto en el que tus padres, de jóvenes, se sonríen mientras el velo se mueve un poco.",
    },
    "7.3": {
      title: "Dar vida a un paisaje o un lugar",
      purpose: "Una foto de tu pueblo, de la casa de campo o de un viaje a la playa.",
      tools: [KLING, DREAMINA],
      prompt:
        "Dale vida a esta foto de [lugar]: [qué se mueve] se mueve despacio. Si en la foto hay personas, déjalas como están y no cambies sus caras. La cámara no se mueve. Movimiento tranquilo y natural",
      example:
        "Una foto antigua de un río en la que el agua corre tranquila y las nubes pasan.",
    },
    "7.4": {
      title: "Restaurar una foto antes de darle vida",
      purpose: "Cuando la foto tiene rayones, manchas o está descolorida.",
      tools: [GEMINI],
      prompt:
        "Restaura esta foto antigua: quita los rayones y las manchas, [coloréala con cuidado o déjala en blanco y negro]. No cambies las caras, la ropa ni el fondo",
      example:
        "La misma foto sin grietas ni manchas, lista para darle vida.",
    },
    "7.5": {
      title: "Una foto de la infancia",
      purpose: "Dar vida a una foto de tu infancia o de los niños de la familia.",
      tools: [KLING, DREAMINA],
      prompt:
        "Dale vida a esta foto de infancia: [qué hace el niño o la niña], despacio. La cámara no se mueve. Movimientos suaves y naturales. No cambies la cara",
      example:
        "Un bebé de la foto se ríe y saluda con la mano: 5 segundos, sin deformaciones.",
    },
    "8.1": {
      title: "El texto de una felicitación en video de 30 segundos",
      purpose: "Preparar un texto que el avatar lea con naturalidad.",
      tools: [CHATGPT, HEYGEN],
      prompt:
        "Escribe el texto de una felicitación en video de 30 segundos para [nombre] por [ocasión]. Detalles: [1–2 detalles]. Tono: [tono]. Pon puntos suspensivos donde haga falta una pausa y escribe el nombre como suena",
      example:
        "Un texto de unas 70 palabras con pausas y el nombre escrito como «Jimena» para que el avatar lo diga bien.",
    },
    "8.2": {
      title: "Una invitación en video",
      purpose: "Invitar a una fiesta, un reencuentro o una inauguración.",
      tools: [CHATGPT, HEYGEN],
      prompt:
        "Un texto de 20 segundos para un avatar: invitamos a [quién] a [evento], [fecha y lugar]. Tono: cercano. Frases cortas y pausas con puntos suspensivos",
      example:
        "Un texto de invitación de 20 segundos, fácil de pegar en HeyGen.",
    },
    "8.3": {
      title: "Un video corto de instrucciones",
      purpose: "Explicar a clientes o a gente nueva del equipo cómo hacer algo.",
      tools: [CHATGPT, HEYGEN],
      prompt:
        "Escribe un texto de 45 segundos para un avatar: cómo [qué hacer], para [quién]. 3 pasos, frases cortas. Escribe las palabras difíciles como suenan y las pausas con puntos suspensivos",
      example:
        "Un texto de tres pasos como «Cómo pedir cita en nuestra página web».",
    },
    "8.4": {
      title: "Una felicitación de todo el equipo",
      purpose: "Cuando felicita todo el departamento, la clase o el club.",
      tools: [CHATGPT, HEYGEN],
      prompt:
        "Un texto de 30 segundos de parte de [quién] para [nombre] por [ocasión]. Menciona: [detalles]. Tono: cariñoso. Pausas con puntos suspensivos y el nombre escrito como suena",
      example:
        "Una felicitación «de todo el departamento» que menciona logros compartidos.",
    },
    "8.5": {
      title: "Preparar un texto ya escrito para el avatar",
      purpose: "Cuando ya tienes el texto, pero el avatar lo lee sin pausas y pronuncia mal los nombres.",
      tools: [CHATGPT],
      prompt:
        "Reescribe este texto para que lo lea un avatar: escribe los nombres [nombres] como suenan, añade pausas con puntos suspensivos y divide las frases largas. Texto: [texto]",
      example:
        "El mismo texto, pero con frases cortas, pausas y pistas de pronunciación.",
    },
    "9.1": {
      title: "Un video de tu producto",
      purpose: "Mostrar tu producto en historias con más vida que en una foto.",
      tools: [DREAMINA, KLING],
      prompt:
        "Video vertical 9:16, 5 segundos, a partir de esta foto de [producto]. El producto gira despacio sobre la mesa, luz: [luz]. La cámara no se mueve. Sin texto",
      example:
        "5 segundos de tu vela artesanal girando despacio con luz suave.",
    },
    "9.2": {
      title: "El ambiente de tu local",
      purpose: "Mostrar lo acogedor que es tu local.",
      tools: [DREAMINA, KLING],
      prompt:
        "Video vertical 9:16, 5 segundos, a partir de esta foto de [local]. Movimiento suave: [qué se mueve]. Ambiente: [ambiente]. La cámara se desplaza despacio de izquierda a derecha. Sin texto",
      example:
        "Tu cafetería con vapor saliendo de las tazas y una luz suave de tarde.",
    },
    "9.3": {
      title: "Anuncio de una oferta o un evento",
      purpose: "Un fondo en video para anunciar rebajas, un taller o una fiesta.",
      tools: [DREAMINA, KLING],
      prompt:
        "Video vertical 9:16, 5 segundos: [qué sale en la imagen], luz: [luz], ambiente: [ambiente]. La cámara se acerca despacio. Sin texto: lo añadiré después en CapCut",
      example:
        "Una mesa de fiesta con repostería y luces suaves: el fondo para «Rebajas el viernes».",
    },
    "9.4": {
      title: "Tu oficio, de cerca",
      purpose: "Mostrar cómo trabajas: un corte de pelo, cerámica, repostería.",
      tools: [DREAMINA, KLING],
      prompt:
        "Video vertical 9:16, 5 segundos: primer plano de [quién hace qué]. Luz: [luz], ambiente tranquilo. La cámara no se mueve. Sin texto",
      example:
        "Un primer plano de las manos de un alfarero dando forma a una taza en el torno.",
    },
    "9.5": {
      title: "Un fondo bonito para historias",
      purpose: "La naturaleza o la ciudad como fondo para una felicitación o una frase.",
      tools: [DREAMINA, KLING],
      prompt:
        "Video vertical 9:16, 5 segundos: [paisaje o escena], [momento del día y luz], ambiente: [ambiente]. La cámara sube despacio. Sin personas y sin texto",
      example:
        "Un parque en otoño al amanecer, con hojas cayendo despacio.",
    },
    "10.1": {
      title: "Un intérprete en el médico en el extranjero",
      purpose: "Si tienes que ir al médico durante un viaje.",
      tools: [CHATGPT],
      prompt:
        "Eres mi intérprete en una consulta médica en [país]. Traduce lo que digo del español al [idioma] y las respuestas del médico al español. Traduce con precisión y explícame los términos médicos con palabras sencillas. Si algo de lo que digo no está claro, pregúntame",
      example:
        "Una traducción precisa de la consulta y explicaciones sencillas de los términos que no conoces.",
    },
    "10.2": {
      title: "Avisar de una alergia en un restaurante",
      purpose: "Una frase importante que no puede salir mal traducida.",
      tools: [CHATGPT],
      prompt:
        "Estoy en un restaurante en [país]. Traduce al [idioma], con educación y naturalidad: «[lo que quiero decir]». Dame la frase, cómo se pronuncia y qué podría responder quien te atienda. Si algo de mi frase no está claro, pregúntame",
      example:
        "«Tengo alergia a los frutos secos, ¿este plato lleva?» en italiano, con la pronunciación y las posibles respuestas.",
    },
    "10.3": {
      title: "Hablar con el dueño del alojamiento",
      purpose: "La llegada, algo que se rompió, una pregunta sobre el depósito.",
      tools: [GOOGLE_TRANSLATE.es, CHATGPT],
      prompt:
        "Eres mi intérprete en una conversación con el dueño del apartamento en [país]. Traduce lo que digo del español al [idioma] y lo que dice esa persona al español. Tono: educado y amable. Si algo de lo que digo no está claro, pregúntame",
      example:
        "Una conversación tranquila en la que se entienden sin que nada suene brusco.",
    },
    "10.4": {
      title: "Traducir el menú de un restaurante",
      purpose: "Saber qué pides, sobre todo si hay algo que no comes.",
      tools: [GOOGLE_TRANSLATE.es, CHATGPT],
      prompt:
        "Traduce este menú del [idioma] al español. Explica en una línea los platos que no se entiendan. Marca los platos que llevan [lo que evito]",
      example:
        "El menú en español, con explicaciones y «lleva cerdo» junto a los platos que corresponde.",
    },
    "10.5": {
      title: "Frases para el viaje, con antelación",
      purpose: "Prepararte para el check-in del hotel, el taxi o el mercado antes de viajar.",
      tools: [CHATGPT, GOOGLE_TRANSLATE.es],
      prompt:
        "Voy a [país], la situación es [situación]. Dame 10 frases útiles en [idioma] con su traducción y cómo se pronuncian. Educadas, como las dice la gente de allí",
      example:
        "10 frases para registrarte en un hotel, desde «Tengo una reserva a nombre de…» hasta «¿Puedo dejar la habitación más tarde?».",
    },
    "11.1": {
      title: "Preparar una felicitación para la locución",
      purpose: "Para que la voz no se trabe con fechas y nombres.",
      tools: [CHATGPT, ELEVENLABS],
      prompt:
        "Prepara este texto para la locución: escribe con letras los números y las abreviaturas, añade pausas con comas y puntos suspensivos e indica cómo se pronuncian los nombres [nombres]. Texto: [texto]",
      example:
        "Un texto en el que «25 años» pasa a ser «veinticinco años» y los nombres llevan pistas de pronunciación.",
    },
    "11.2": {
      title: "Un cuento en audio para dormir",
      purpose: "Un cuento antes de dormir con voz de narrador.",
      tools: [CHATGPT, ELEVENLABS],
      prompt:
        "Reescribe este cuento para leérselo en voz alta a un niño o niña de [edad] años: frases cortas, pausas y ayuda con las palabras difíciles. Ambiente: [ambiente]. Cuento: [texto]",
      example:
        "Un cuento tranquilo listo para la locución y una sugerencia de qué voz elegir en ElevenLabs.",
    },
    "11.3": {
      title: "Una carta para alguien que ve poco",
      purpose: "Para que tu abuela o tu abuelo pueda escuchar una carta en vez de leerla.",
      tools: [CHATGPT, ELEVENLABS],
      prompt:
        "Prepara esta carta para la locución para [quién]: ve poco y la va a escuchar. Números y fechas con letras, pausas entre ideas y un tono cariñoso. Texto: [texto]",
      example:
        "Una carta agradable de escuchar: sin abreviaturas, con pausas, de unos 2 minutos.",
    },
    "11.4": {
      title: "Tu historia familiar, en voz alta",
      purpose: "Grabar la historia de tu familia para que la escuchen los nietos.",
      tools: [CHATGPT, ELEVENLABS],
      prompt:
        "Prepara para la locución esta historia familiar sobre [quién]: fechas con letras, cómo se pronuncian los nombres ([nombres]) y pausas antes de los momentos importantes. Recomiéndame una voz: [qué tipo]. Texto: [texto]",
      example:
        "La historia de tu bisabuelo con las fechas en palabras y pausas, lista para grabar.",
    },
    "11.5": {
      title: "Escuchar tu discurso antes de darlo",
      purpose: "Comprobar cómo suena un discurso antes del gran día.",
      tools: [CHATGPT, ELEVENLABS],
      prompt:
        "Prepara mi discurso para la locución, para escuchar cómo suena. Dura [cuántos] minutos; números con letras, pausas y ayuda con las palabras difíciles. Texto: [texto]",
      example:
        "Un texto de 3 minutos con pausas: al escucharlo, ves dónde las frases son demasiado largas.",
    },
    "12.1": {
      title: "Un mensaje de voz largo",
      purpose: "Saber de qué trata un audio de cinco minutos sin escucharlo.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Transcribe este mensaje de voz de [quién]. Después, resúmelo en 3 puntos: qué quiere esta persona y qué tengo que hacer yo",
      example:
        "El mensaje en texto y 3 puntos como «Te pide recoger un paquete antes del viernes».",
    },
    "12.2": {
      title: "Apuntes de una clase o un webinar",
      purpose: "Para estudiar o hacer cursos cuando no hay tiempo de volver a ver la grabación.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Transcribe la grabación de esta clase sobre [tema]. Términos: [términos]. Después, haz un resumen en 7 puntos y 3 preguntas para repasar",
      example:
        "Una página de apuntes con los términos bien escritos y preguntas para repasar.",
    },
    "12.3": {
      title: "Lo importante de la reunión del colegio",
      purpose: "Cuando en la reunión se habló mucho y solo necesitas lo esencial.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Transcribe la grabación de la reunión del colegio. El docente se llama [nombre]. Después, di qué se decidió, qué tienen que hacer las familias y para cuándo, y si hay que pagar algo y cuándo",
      example:
        "5 puntos: qué comprar, cuándo es la excursión y hasta qué fecha hay que pagar.",
    },
    "12.4": {
      title: "Notas de voz → lista de tareas",
      purpose: "Si dictas tus ideas sobre la marcha.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Transcribe mis notas de voz de [día]. Después, haz una lista de tareas por orden de importancia y, aparte, una lista de compras",
      example:
        "8 tareas en orden y una lista de compras de 6 cosas.",
    },
    "12.5": {
      title: "Una conversación con un cliente",
      purpose: "No perderte nada después de una llamada o reunión con un cliente.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Transcribe esta grabación de una conversación con el cliente [nombre o empresa]. Términos: [términos]. Después, di qué quiere el cliente, los plazos, el presupuesto y mi lista de tareas",
      example:
        "Un resumen breve de la conversación y 4 tareas con plazos.",
    },
    "13.1": {
      title: "Un mensaje a tus padres sobre la palabra clave",
      purpose: "Acordar una palabra clave sin preocupar a nadie de más.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Ayúdame a escribir un mensaje para [quién] sobre una palabra clave por si llaman estafadores. Explícalo de forma sencilla y tranquila, sin asustar, en 4–5 frases. No pongas la palabra: se la diré en persona",
      example:
        "Un mensaje cariñoso para mamá y papá que explica para qué sirve la palabra y qué hacer ante una llamada extraña.",
    },
    "13.2": {
      title: "Comprobar una llamada sospechosa",
      purpose: "Cuando acabas de recibir una llamada rara y tienes dudas.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Acabo de recibir una llamada. Lo que me dijeron: [en pocas palabras, sin nombres ni números]. Repasa conmigo las señales de estafa: prisa, que te pidan guardar el secreto y una forma de pago rara. Dime qué hacer ahora",
      example:
        "Un análisis: «Hay prisa y te piden silencio: son señales de estafa. Cuelga y llama a tu familiar a su número de siempre».",
    },
    "13.3": {
      title: "Una guía para padres mayores",
      purpose: "Para imprimirla y tenerla junto al teléfono.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Haz una guía para [quién] sobre las llamadas de estafadores: 5 reglas con palabras sencillas y qué hacer paso a paso. Sin palabras difíciles, en una página, para imprimir",
      example:
        "Una página: «¿Te llaman y te piden dinero? 1. Cuelga…».",
    },
    "13.4": {
      title: "Comprobar un mensaje sospechoso",
      purpose: "«Hola, mamá, cambié de número, ¿me haces una transferencia?» y mensajes parecidos.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Me escribieron: “[texto del mensaje sin enlaces, números ni nombres]”. ¿Tiene señales de estafa: prisa, secreto, dinero? ¿Cómo puedo comprobarlo sin responder?",
      example:
        "Las señales de estafa del mensaje y cómo comprobarlo: llamar al número de siempre, preguntar a otro familiar.",
    },
    "13.5": {
      title: "Qué hacer si llaman «del banco» o «de la policía»",
      purpose: "Saber de antemano cómo actuar.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Haz un plan breve de qué hacer si alguien llama diciendo que es de [organización] y me pide [qué piden]. 4–5 pasos, breves, para tener junto al teléfono",
      example:
        "Un plan: «1. No des ningún código. 2. Cuelga. 3. Llama al banco al número que aparece en tu tarjeta…».",
    },
    "14.1": {
      title: "Comprobar una publicación con una «oferta increíble»",
      purpose: "Un famoso recomienda invertir y prometen ganancias sin riesgo.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Vi una publicación: [en pocas palabras, qué promete]. Repasa conmigo una lista: qué prometen, si hay prisa o piden hacer clic en un enlace, dónde buscar la fuente oficial. No me digas «real» o «falso»: dime qué comprobar",
      example:
        "3 señales de engaño en la publicación y dónde comprobarlo: la página oficial de esa persona y los medios importantes.",
    },
    "14.2": {
      title: "Comprobar una noticia antes de reenviarla",
      purpose: "Para no mandarle un bulo a toda la familia.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Ayúdame a comprobar esta noticia antes de reenviarla: [de qué trata]. ¿Qué fuentes lo publicarían si fuera verdad? ¿Qué señales indican que es falsa? ¿Qué debería buscar?",
      example:
        "Una lista de fuentes para comprobar y las señales de que esta noticia puede ser falsa.",
    },
    "14.3": {
      title: "Averiguar de dónde viene una foto",
      purpose: "Saber si una foto se sacó de otro lugar o de otra época.",
      tools: [GOOGLE_LENS.es, CHATGPT],
      prompt:
        "Explícame paso a paso cómo usar Google Lens en [teléfono] para ver dónde más aparece esta foto y de dónde viene. Breve, para principiantes",
      example:
        "4 pasos con botones claros: al terminar ves dónde se publicó la foto antes.",
    },
    "14.4": {
      title: "Una guía familiar sobre videos falsos",
      purpose: "Avisar a tus padres o a los adolescentes de la casa.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Haz una guía para [quién] sobre videos falsos de famosos: 5 señales de engaño por el mensaje, no por la imagen, y qué hacer. Con palabras sencillas, en una página",
      example:
        "Una guía que dice «Si un famoso en un video te pide dinero, casi siempre es un engaño», con cinco señales.",
    },
    "14.5": {
      title: "Comprobar una tienda online antes de pagar",
      purpose: "Una web con precios demasiado buenos para ser verdad.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Ayúdame a comprobar la tienda «[nombre]» antes de pagar: qué buscar en las opiniones, cómo comprobar los datos de contacto y de la empresa, qué señales tiene una tienda falsa. Paso a paso",
      example:
        "Una lista de 6 pasos: desde buscar opiniones en webs independientes hasta revisar la forma de pago.",
    },
    "15.1": {
      title: "Configurar tu privacidad",
      purpose: "Impedir que usen tus chats para entrenar la IA y borrar el historial.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Explícame paso a paso cómo impedir que usen mis chats para entrenar la IA y cómo borrar el historial en [servicio] desde mi [teléfono o computadora]. Breve, para principiantes",
      example:
        "4–5 pasos con los nombres de los botones de los ajustes. Los menús cambian a veces: guíate por lo que ves en pantalla.",
    },
    "15.2": {
      title: "Preguntar por un contrato sin datos personales",
      purpose: "Que te lo expliquen sin mostrar nombres, direcciones ni números.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Cliente A le alquila un apartamento a Cliente B. En el contrato hay esta cláusula: “[texto de la cláusula con nombres y números cambiados por marcas]”. Explica con palabras sencillas qué significa y qué riesgos tiene Cliente A",
      example:
        "Una explicación clara de la cláusula, sin ni un solo dato personal tuyo en el chat.",
    },
    "15.3": {
      title: "Lista rápida antes de pegar un texto en la IA",
      purpose: "Revisar rápido antes de enviar.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Haz una lista breve de 5 preguntas que revisaré antes de pegar un texto en la IA [dónde la uso: en casa o en el trabajo]: que no haya contraseñas, números de tarjeta o documentos, datos de otras personas ni secretos de la empresa",
      example:
        "5 preguntas como «¿Hay un número de tarjeta o un código de SMS en el texto?» que caben en una pantalla.",
    },
    "15.4": {
      title: "Describir una tarea de trabajo sin secretos",
      purpose: "Pedir ayuda con el trabajo sin revelar datos de la empresa.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Ayúdame a describir una tarea de trabajo sin detalles confidenciales. La tarea en términos generales: [qué hay que hacer]. Sector: [sector]. En lugar de nombres, usa las marcas «Empresa» y «Cliente»",
      example:
        "Una petición anónima que puedes hacerle a la IA sin riesgo, con pistas de qué más quitar.",
    },
    "15.5": {
      title: "Explicar a tu familia qué no contarle a la IA",
      purpose: "Si tus padres o tus hijos también empezaron a usar la IA.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Haz una guía para [quién] sobre lo que no se debe escribir en los chats de IA: 5 puntos con ejemplos y qué poner en su lugar. Con palabras sencillas, sin asustar",
      example:
        "Una guía como «En lugar de tu número de documento, escribe [número]» con cinco ejemplos claros.",
    },
    "16.1": {
      title: "Presupuesto familiar por categorías",
      purpose: "Ver cuánto se va en comida, transporte y salidas.",
      tools: [CHATGPT, GOOGLE_SHEETS.es],
      prompt:
        "Uso [Hojas de cálculo de Google o Excel] en español. En la columna A hay fechas, en la B categorías de gastos y en la C cantidades. Los datos van de la fila 2 a la [número de fila]. Escribe una fórmula que sume cada categoría en [mes], con los nombres de las funciones en español. Dime si separo los argumentos con coma o con punto y coma y en qué celda ponerla",
      example:
        "Una fórmula y una explicación: «Ponla en la celda F2 y arrástrala hacia abajo».",
    },
    "16.2": {
      title: "Encontrar duplicados en una lista",
      purpose: "Cuando en tu lista de clientes o invitados hay repetidos.",
      tools: [CHATGPT, GOOGLE_SHEETS.es],
      prompt:
        "Uso [Hojas de cálculo de Google o Excel] en español. En la columna [letra] hay [qué contiene], de la fila 2 a la [número de fila]. ¿Cómo resalto los valores repetidos? Explícame paso a paso dónde tocar",
      example:
        "5 pasos con formato condicional: los repetidos se resaltan en color.",
    },
    "16.3": {
      title: "Diseñar una hoja de control",
      purpose: "Empezar a llevar el control de pedidos, gastos o clientes.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Propón la estructura de una hoja para llevar el control de [qué] en [Hojas de cálculo de Google o Excel]. Necesito ver: [qué es importante]. Dame los nombres de las columnas y 3 filas de ejemplo que pueda copiar en la hoja",
      example:
        "Una tabla de pedidos: fecha, cliente, producto, cantidad, pagado, estado, con filas de ejemplo.",
    },
    "16.4": {
      title: "Traer precios de otra hoja",
      purpose: "Juntar datos de dos listas en una.",
      tools: [CHATGPT, GOOGLE_SHEETS.es],
      prompt:
        "Uso [Hojas de cálculo de Google o Excel] en español. En la hoja «[hoja 1]» la columna A tiene códigos de producto; en la hoja «[hoja 2]» la A tiene códigos y la B, precios. Escribe una fórmula, con los nombres de las funciones en español, que traiga el precio a la columna B de la primera hoja desde la fila 2, dime qué separador usar y explica qué pasa si un código no aparece",
      example:
        "Una fórmula de búsqueda con su explicación y una versión que muestra «sin precio» en lugar de un error.",
    },
    "16.5": {
      title: "Porcentaje de cumplimiento del objetivo",
      purpose: "Ver de un vistazo quién cumplió su objetivo y quién no.",
      tools: [CHATGPT, EXCEL],
      prompt:
        "Uso [Hojas de cálculo de Google o Excel] en español. En la columna B está el objetivo y en la C el resultado real, de la fila 2 a la [número de fila]. Escribe una fórmula para la columna D, con los nombres de las funciones en español: el porcentaje de cumplimiento. Explica cómo poner el formato de porcentaje, qué separador usar y dónde poner la fórmula",
      example:
        "Una fórmula para D2, instrucciones para el formato y una idea para resaltar a quien esté por debajo del 100 %.",
    },
    "17.1": {
      title: "Acta de una reunión a partir de tus notas",
      purpose: "Cuando en la reunión tomaste notas rápidas y desordenadas.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Haz el acta de una reunión de equipo a partir de mis notas. Estructura: asistentes, decisiones, tareas con el formato «quién — qué — para cuándo». Si no se dijo un plazo o un responsable, indícalo. No añadas nada por tu cuenta. Notas: [notas]",
      example:
        "Un acta de media página con 5 tareas, dos de ellas marcadas «sin plazo definido».",
    },
    "17.2": {
      title: "Resumen de la reunión de vecinos",
      purpose: "Mandar a los vecinos un resumen claro en el grupo de chat.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Haz un resumen de la reunión de [quiénes] a partir de esta transcripción para el grupo de chat. Estructura: qué se decidió, quién se encarga de qué, cuánto hay que pagar y hasta cuándo. Marca lo que no quedó claro como «sin decidir». Nada por tu cuenta. Transcripción: [texto]",
      example:
        "Un mensaje breve: 3 decisiones, responsables y la cantidad a pagar con su fecha límite.",
    },
    "17.3": {
      title: "Un correo a los participantes después de la reunión",
      purpose: "Para que todos entiendan lo mismo sobre lo que se acordó.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "A partir de esta acta, escribe un correo breve a los participantes de la reunión sobre [tema]: decisiones y tareas con el formato «quién — qué — para cuándo», en lista. Tono: profesional y cercano. No añadas nada por tu cuenta. Acta: [texto]",
      example:
        "Un correo de 100 palabras con las decisiones y las tareas en lista.",
    },
    "17.4": {
      title: "Temas pendientes para la próxima reunión",
      purpose: "No perder de vista lo que quedó sin acordar.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "A partir de la transcripción de la reunión sobre [tema], enumera solo los temas pendientes y las tareas sin plazo o sin responsable. No supongas quién debería encargarse si no se dijo. Transcripción: [texto]",
      example:
        "Una lista de 4 temas pendientes: la agenda de la próxima reunión, ya lista.",
    },
    "17.5": {
      title: "Acta de una reunión con un cliente",
      purpose: "Dejar los acuerdos por escrito para evitar discusiones después.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Haz el acta de la reunión con el cliente [empresa] a partir de esta transcripción. Estructura: qué quiere el cliente, qué se acordó, tareas con el formato «quién — qué — para cuándo» y temas pendientes. Cifras y fechas, solo las de la grabación. Transcripción: [texto]",
      example:
        "Un acta que puedes mandarle al cliente para que la confirme.",
    },
    "18.1": {
      title: "Recordatorio de pago",
      purpose: "Un cliente no pagó una factura a tiempo.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Escribe un correo al cliente [empresa] sobre la factura n.º [número] de [cantidad], que vencía el [fecha]. Lo que necesitamos: el pago antes del [nueva fecha]. Tono: educado pero firme. Máximo 100 palabras, escribe el asunto aparte",
      example:
        "Un correo breve con el número de factura, la cantidad y la nueva fecha; asunto: «Recordatorio de pago: factura n.º 125».",
    },
    "18.2": {
      title: "Cambiar la fecha de una reunión",
      purpose: "Mover una reunión sin dar mala impresión.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Escribe un correo a [quién] para mover nuestra reunión del [fecha] al [nueva fecha]. Motivo: [motivo]. Tono: educado, con una disculpa. Máximo 70 palabras, escribe el asunto aparte",
      example:
        "4 frases con una disculpa y la nueva fecha; asunto: «Cambio de fecha de la reunión al 14 de noviembre».",
    },
    "18.3": {
      title: "Responder a la queja de un cliente",
      purpose: "Contestar con calma a un cliente molesto.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Ayúdame a responder a la queja de un cliente. Lo que podemos ofrecer: [solución]. Tono: tranquilo, con una disculpa y sin excusas. Máximo 120 palabras, escribe el asunto aparte. Queja (sin datos personales): [texto]",
      example:
        "Una respuesta que reconoce el problema y ofrece una solución y un plazo.",
    },
    "18.4": {
      title: "Pedir precios a un proveedor",
      purpose: "Reunir presupuestos de varios proveedores.",
      tools: [CHATGPT, GEMINI],
      prompt:
        "Escribe un correo al proveedor [empresa] para pedir precios de [qué], cantidad: [cuánto], para el [fecha]. Tono: profesional. Máximo 100 palabras, escribe el asunto aparte",
      example:
        "Una solicitud que puedes mandar a tres proveedores cambiando solo el nombre.",
    },
    "18.5": {
      title: "Un «no» educado",
      purpose: "Rechazar a un socio o a un candidato sin estropear la relación.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Escribe un correo educado a [quién] para rechazar su propuesta sobre [qué]. Motivo: [motivo]. Quiero mantener una buena relación. Máximo 80 palabras, escribe el asunto aparte",
      example:
        "Un rechazo breve y con tacto, con un agradecimiento y la puerta abierta a colaborar en el futuro.",
    },
    "19.1": {
      title: "Resumir un contrato antes de decidir",
      purpose: "Entender rápido un contrato largo con un proveedor.",
      tools: [CLAUDE, CHATGPT],
      prompt:
        "Soy [cargo] y mañana decidimos si firmamos este contrato. Haz un resumen: obligaciones de cada parte, plazos, importes y penalizaciones, y los riesgos para nosotros, con el número de cláusula. No añadas nada por tu cuenta. Después, comprueba cada cifra con el texto y cítala",
      example:
        "Un resumen de media página con números de cláusula y una cita para cada importe.",
    },
    "19.2": {
      title: "Comparar dos propuestas",
      purpose: "Elegir proveedor por los datos, no por una presentación bonita.",
      tools: [CLAUDE, CHATGPT],
      prompt:
        "Soy [rol] y estoy eligiendo un proveedor para [qué]. Compara las dos propuestas en una tabla: precio, plazos, garantías y qué no incluye, con el número de página. Si falta algún dato, indícalo. Después, comprueba las cifras con citas",
      example:
        "Una tabla comparativa en la que los huecos aparecen marcados como «no está en la propuesta».",
    },
    "19.3": {
      title: "Lo esencial de un estudio",
      purpose: "Entender qué significa un informe del sector para tu trabajo.",
      tools: [CLAUDE, CHATGPT],
      prompt:
        "Soy [rol] en [sector]. Resume este estudio en media página: 3 conclusiones principales, cifras clave con número de página y qué significa para nosotros. No añadas nada que no esté en el texto. Después, comprueba cada cifra con una cita",
      example:
        "3 conclusiones, 5 cifras con su página y 2 líneas de «qué significa para nosotros».",
    },
    "19.4": {
      title: "Preguntas para los autores del informe",
      purpose: "Prepararte para la reunión sin pasar por alto los puntos débiles.",
      tools: [CLAUDE, CHATGPT],
      prompt:
        "Soy [rol] y mañana voy a revisar este informe con [quién]. Enumera 5 preguntas que valga la pena hacer: dónde se contradicen las cifras y qué datos faltan. Para cada una, indica la página y una cita. No inventes nada",
      example:
        "5 preguntas como «En la pág. 4 el crecimiento es del 12 % y en la pág. 9, del 18 %: ¿cuál es el correcto?».",
    },
    "19.5": {
      title: "Resumir un hilo largo de correos",
      purpose: "Ponerte al día en un proyecto que ya tiene 50 correos.",
      tools: [CLAUDE, CHATGPT],
      prompt:
        "Me sumo al proyecto [nombre]. A partir de estos correos, resume qué se decidió ya, quién se encarga de qué y qué temas quedan pendientes, con las fechas de los correos. No inventes nada; si algo no está claro, indícalo",
      example:
        "Media página con decisiones, responsables y fechas, en lugar de una hora de lectura.",
    },
    "20.1": {
      title: "La agenda de la reunión semanal",
      purpose: "Para que la reunión dure lo previsto y sirva de algo.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Dirijo [a quién]. La reunión dura [cuántos minutos] y los temas son: [temas]. Ahora mismo el equipo está [ánimo]. Prepara una agenda con el tiempo de cada punto y una pregunta para cerrar la reunión",
      example:
        "Una agenda de 20 minutos con 4 puntos y una pregunta final: «¿Qué te está frenando esta semana?».",
    },
    "20.2": {
      title: "Dar una mala noticia al equipo",
      purpose: "Recorte de presupuesto, un bono cancelado, una mudanza de oficina.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Dirijo [equipo]. Tengo que comunicar: [noticia]. Lo más probable es que el equipo reaccione así: [reacción]. Prepara un plan para una conversación de [cuántos minutos], 5 preguntas probables y respuestas tranquilas",
      example:
        "Un plan de conversación con un comienzo honesto y 5 respuestas a preguntas difíciles.",
    },
    "20.3": {
      title: "Ensayar una conversación difícil a solas",
      purpose: "Practicar antes de una conversación complicada con alguien del equipo.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Haz de alguien del equipo que [situación]. Yo dirijo el equipo y quiero que acordemos [objetivo]. Responde de forma realista y a veces lleva la contraria. Después de 5 intervenciones, detente y dame tu opinión",
      example:
        "Un diálogo de práctica realista y un análisis de qué frases funcionaron y cuáles conviene decir de otra forma.",
    },
    "20.4": {
      title: "Resumen de la reunión para el equipo",
      purpose: "Mandar el resumen al grupo de chat justo después de la reunión.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Estas son mis notas de la reunión de equipo: [notas]. Escribe un mensaje breve para el grupo de chat: qué decidimos, tareas con el formato «quién — qué — para cuándo» y cuándo es la próxima reunión. Tono: cercano",
      example:
        "Un mensaje de 8 líneas que puedes enviar al momento.",
    },
    "20.5": {
      title: "Una lluvia de ideas con el equipo",
      purpose: "Reunir ideas para que hable todo el mundo, no solo las dos personas de siempre.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Voy a dirigir una lluvia de ideas para [equipo], de [cuántos minutos], sobre [tema]. El equipo está [ánimo]. Prepara un plan con tiempos, 3 preguntas para debatir y cómo hacer participar a quienes suelen quedarse callados",
      example:
        "Un plan de 40 minutos: calentamiento, trabajo en parejas y votación de las mejores ideas.",
    },
    "21.1": {
      title: "Tareas para la primera semana de alguien nuevo",
      purpose: "Para que quien llega no se quede sin hacer nada ni se sienta perdido.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Ayúdame a asignar tareas para la primera semana de una persona nueva en el puesto de [cargo]. Objetivo: [qué debe aprender]. Para cada tarea: resultado, para qué sirve, plazo, cómo saber que está terminada, dónde encontrar los materiales y a quién preguntar. Tono: cercano",
      example:
        "5 tareas para la semana con criterios claros de «terminado» y contactos.",
    },
    "21.2": {
      title: "Un encargo para un freelance",
      purpose: "Encargar un diseño, un texto o una web y recibir lo que necesitas.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Ayúdame a escribir un encargo para [quién] para [qué hacer]. Presupuesto: [cantidad], plazo: [fecha]. Describe qué resultado se necesita, para qué es, cómo saber que está terminado, qué voy a aportar yo y cómo nos vamos a comunicar",
      example:
        "Un encargo de una página después del cual a quien lo hace le quedan muy pocas dudas.",
    },
    "21.3": {
      title: "Convertir una petición de arriba en una tarea",
      purpose: "Cuando llega un mensaje poco claro de la dirección y el trabajo lo hará alguien del equipo.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Esta es una petición de [de quién]: [texto]. Conviértela en una tarea para [para quién]: resultado, para qué sirve, plazo, cómo saber que está terminada, de dónde sacar los datos y a quién preguntar",
      example:
        "De «necesitamos algo sobre ventas» a una tarea clara con periodo, formato y plazo.",
    },
    "21.4": {
      title: "Comprobar si tu tarea se entiende",
      purpose: "Antes de enviarla, asegurarte de que se entenderá a la primera.",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Esta es la tarea que quiero asignar: [texto de la tarea]. Busca qué le falta: resultado, objetivo, plazo, cómo saber que está terminada, dónde están los datos y a quién preguntar. Enumera las preguntas que haría la persona que la recibe y propón una versión mejorada",
      example:
        "4 preguntas que tendría la persona del equipo y una versión mejor de la tarea.",
    },
    "21.5": {
      title: "Lista para dar por terminado un trabajo",
      purpose: "Saber que el trabajo está bien hecho y no solo «más o menos listo».",
      tools: [CHATGPT, CLAUDE],
      prompt:
        "Para la tarea «[tarea]», haz una lista de revisión: cómo saber que el resultado está listo y bien hecho. 5–7 puntos que se puedan comprobar. Fecha de entrega: [fecha]. Aparte, de dónde sacar los datos para comprobarlo y a quién acudir si algo no cuadra",
      example:
        "Una lista como «El informe cubre todo octubre, las cifras coinciden con el CRM y hay una conclusión de 3 líneas».",
    },
  },
};
