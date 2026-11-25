import type { LegalDocument } from "@/content/legal/types";

export const PRIVACY_ES: LegalDocument = {
  updated: "1 de diciembre de 2026",
  intro:
    "Esta política explica qué datos recogen la app y el sitio web de AI Navigator, para qué, dónde se guardan y cómo puedes eliminarlos. Recogemos lo mínimo posible: la app funciona por completo sin cuenta.",
  sections: [
    {
      heading: "Quiénes somos",
      paragraphs: [
        "AI Navigator está desarrollado por Amangali Imanzhan, Georgia. Contacto: imanzhanaman2@gmail.com.",
      ],
    },
    {
      heading: "Si usas la app sin cuenta",
      paragraphs: [
        "Tu progreso, tus peticiones guardadas, tus ajustes y tus recordatorios se guardan solo en tu teléfono. No los recibimos.",
        "Para mostrar las lecciones, la app descarga sus textos de nuestro servidor. Como cualquier servidor, puede registrar brevemente datos técnicos, como tu dirección IP y la hora de la solicitud.",
      ],
    },
    {
      heading: "Si inicias sesión",
      paragraphs: [
        "Puedes iniciar sesión con Apple o Google para conservar tu progreso en otro dispositivo. En ese caso guardamos:",
      ],
      items: [
        "Tu nombre y tu correo de Apple o Google. Apple te permite ocultar tu correo: entonces solo recibimos una dirección de reenvío privada.",
        "Un identificador de tu cuenta de Apple o Google, para reconocerte la próxima vez.",
        "Tu progreso en las lecciones y las fechas en que las completaste.",
        "Las peticiones que guardaste en la app: es texto que escribes tú, así que no incluyas datos personales o sensibles.",
        "Tus respuestas de las primeras pantallas de la app: idioma, a qué te dedicas y cuánto tiempo al día quieres estudiar.",
      ],
    },
    {
      heading: "Recordatorios",
      paragraphs: [
        "Los recordatorios diarios los programa tu propio teléfono (notificaciones locales). No usamos notificaciones push ni recibimos tokens de notificaciones. Puedes desactivarlos en la app o en los Ajustes del iPhone.",
      ],
    },
    {
      heading: "Asistente de IA",
      paragraphs: [
        "En las lecciones puedes usar el asistente de IA integrado: responde a una petición que escribiste y la analiza brevemente, o propone valores para los campos de una plantilla. El asistente solo está disponible después de iniciar sesión.",
        "Para generar una respuesta, el texto que envías al asistente (tu petición o la descripción de tu situación), junto con la lección o plantilla a la que pertenece, se envía a Anthropic, la empresa que desarrolla los modelos de IA Claude. Según las condiciones comerciales de Anthropic, estos datos no se usan para entrenar sus modelos, y Anthropic los elimina en un plazo de 30 días.",
        "Antes de tu primera petición, la app te muestra qué se enviará y a quién, y te pide tu consentimiento. Sin él, no se envía nada al asistente. Puedes retirar el consentimiento cuando quieras: Perfil → Ajustes → Privacidad → «Asistente de IA». Si cambiamos cómo el asistente trata tu texto, la app te lo volverá a preguntar.",
        "No guardamos el texto de tus peticiones ni las respuestas del asistente. Solo guardamos cuántas veces usaste el asistente hoy (para aplicar el límite diario) y un registro técnico de cada uso, sin su contenido, durante un máximo de 2 días.",
        "No incluyas datos personales en tus peticiones: números de documentos o tarjetas, teléfonos, direcciones.",
      ],
    },
    {
      heading: "Herramientas de IA en las lecciones",
      paragraphs: [
        "Las lecciones enlazan a servicios de IA de terceros (por ejemplo, ChatGPT, Gemini, Claude). No les enviamos tus datos. Cuando usas esos servicios, se aplican sus propias políticas de privacidad.",
      ],
    },
    {
      heading: "Suscripción (AI Navigator Premium)",
      paragraphs: [
        "En la app puedes contratar la suscripción AI Navigator Premium, que aumenta el límite diario del asistente de IA. La suscripción se compra a través del App Store: el pago lo gestiona Apple y nunca vemos los datos de tu tarjeta ni tu Apple ID.",
        "Para comprobar la suscripción, la app usa RevenueCat (RevenueCat, Inc., EE. UU.). La app envía a RevenueCat el identificador de tu cuenta de AI Navigator (un código aleatorio, sin tu nombre ni tu correo) y la información de compra del App Store de tu teléfono. RevenueCat también recibe datos técnicos del dispositivo y de la app, como la versión del sistema y el país del App Store.",
        "De RevenueCat recibimos y guardamos solo: el estado de la suscripción (prueba, activa, cancelada, caducada), el plan (mensual o anual), la fecha de fin y si fue una compra de prueba. Lo usamos solo para aplicar el límite diario del asistente de IA.",
      ],
    },
    {
      heading: "Informes de errores y estadísticas de uso",
      paragraphs: [
        "Para encontrar errores y entender qué partes de la app son útiles, la app envía informes de errores (Sentry) y estadísticas de uso anónimas (PostHog). Ambos servicios guardan estos datos en la UE (Fráncfort, Alemania).",
      ],
      items: [
        "Informes de errores: qué falló y en qué pantalla, el modelo del dispositivo, la versión del sistema y de la app y, si has iniciado sesión, el identificador aleatorio de tu cuenta.",
        "Estadísticas de uso: eventos como «lección abierta», «lección completada», «plantilla copiada», «petición al asistente de IA» o «pantalla de suscripción abierta», con el número de la lección o plantilla, el idioma de la app y el plan de suscripción. Antes de iniciar sesión, los eventos se vinculan a un identificador aleatorio del teléfono; después, al identificador aleatorio de tu cuenta.",
      ],
      afterItems: [
        "Nunca enviamos: los textos que escribes, tus peticiones al asistente de IA ni sus respuestas, tus peticiones guardadas, tu nombre, correo, contraseñas ni tokens de inicio de sesión. No grabamos la pantalla, no usamos el identificador de publicidad (IDFA), no te rastreamos en otras apps y sitios web y no determinamos tu ubicación por la dirección IP.",
        "Puedes desactivarlo cuando quieras: Perfil → Ajustes → Privacidad → «Ayudar a mejorar la app». A partir de ese momento la app no envía ni estadísticas ni informes de errores.",
        "El sitio web no tiene analítica ni cookies publicitarias. Los errores del sitio se envían a Sentry sin datos personales.",
        "Los informes de errores se guardan hasta 30 días y las estadísticas, hasta 365 días.",
      ],
    },
    {
      heading: "Para qué usamos tus datos",
      items: [
        "Para ofrecerte la app y conservar tu progreso en tus dispositivos (ejecución de nuestro acuerdo contigo).",
        "Para mantener el servicio seguro, encontrar y corregir errores y entender qué funciones son útiles (nuestro interés legítimo; puedes oponerte desactivando «Ayudar a mejorar la app»).",
        "Para responder a tus peticiones al asistente de IA, solo con tu consentimiento, que puedes retirar cuando quieras.",
        "Para responder a tus solicitudes de soporte.",
      ],
      afterItems: [
        "No vendemos tus datos, no mostramos publicidad y no usamos tus datos para entrenar modelos de IA.",
      ],
    },
    {
      heading: "Dónde se guardan tus datos",
      items: [
        "Supabase: nuestra base de datos y servicio de inicio de sesión, con servidores en la UE (Fráncfort, Alemania).",
        "Apple y Google: cuando inicias sesión con ellos, según sus políticas.",
        "Netlify: alojamiento de este sitio web y su API.",
        "Anthropic: genera las respuestas del asistente de IA (servidores en EE. UU.).",
        "RevenueCat: comprueba la suscripción del App Store (servidores en EE. UU.).",
        "Sentry: informes de errores (Functional Software, Inc.; datos guardados en la UE, Fráncfort).",
        "PostHog: estadísticas de uso anónimas (PostHog, Inc.; EU Cloud, Fráncfort).",
      ],
    },
    {
      heading: "Cuánto tiempo los guardamos y cómo eliminarlos",
      paragraphs: [
        "Guardamos los datos de tu cuenta hasta que la eliminas. En la app: Perfil → Ajustes → Eliminar cuenta. Tu cuenta, tu progreso, tus peticiones guardadas y tus ajustes se eliminan de nuestros servidores al momento; si iniciaste sesión con Apple, también revocamos el acceso de la app a tu Apple ID. También se elimina el registro de la suscripción, pero la suscripción del App Store no se cancela: cancélala en Ajustes del iPhone → tu nombre → Suscripciones. RevenueCat conserva el historial de compras vinculado al código aleatorio de la cuenta; escríbenos si quieres eliminarlo también.",
        "Los datos que se guardan solo en tu teléfono se eliminan desde la app (Ajustes → Borrar datos) o al desinstalarla.",
      ],
    },
    {
      heading: "Tus derechos",
      paragraphs: [
        "Puedes pedirnos una copia de tus datos, corregirlos o eliminarlos, y oponerte a su uso. Si estás en la UE o el Reino Unido, también puedes reclamar ante tu autoridad de protección de datos. Escríbenos a imanzhanaman2@gmail.com.",
      ],
    },
    {
      heading: "Menores",
      paragraphs: [
        "AI Navigator no está dirigido a menores de 13 años. Algunos servicios de IA de las lecciones tienen sus propios límites de edad (por ejemplo, 18+).",
      ],
    },
    {
      heading: "Cambios en esta política",
      paragraphs: [
        "Si cambiamos esta política, actualizaremos la fecha de arriba y, si los cambios son importantes, te avisaremos en la app.",
      ],
    },
  ],
};
