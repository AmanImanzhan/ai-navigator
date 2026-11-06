// Шаблоны на испанском. Переведены шаблоны 1.1–10.5; остальные пока показываем на русском (см. FALLBACK_LOCALE в index.ts).
// Один шаблон = будущая строка template_translations (template_id, locale = "es", …).

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
        "Estoy en un restaurante en [país]. Traduce al [idioma], con educación y naturalidad: «[lo que quiero decir]». Dame la frase, cómo se pronuncia y qué podría responder el camarero. Si algo de mi frase no está claro, pregúntame",
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
  },
};
