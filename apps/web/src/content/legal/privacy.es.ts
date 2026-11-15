import type { LegalDocument } from "@/content/legal/types";

export const PRIVACY_ES: LegalDocument = {
  updated: "[TODO: fecha]",
  intro:
    "Esta política explica qué datos recogen la app y el sitio web de AI Navigator, para qué, dónde se guardan y cómo puedes eliminarlos. Recogemos lo mínimo posible: la app funciona por completo sin cuenta.",
  sections: [
    {
      heading: "Quiénes somos",
      paragraphs: [
        "AI Navigator está desarrollado por [TODO: nombre del desarrollador o empresa], [TODO: país]. Contacto: [TODO: correo].",
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
      heading: "Herramientas de IA en las lecciones",
      paragraphs: [
        "Las lecciones enlazan a servicios de IA de terceros (por ejemplo, ChatGPT, Gemini, Claude). No les enviamos tus datos. Cuando usas esos servicios, se aplican sus propias políticas de privacidad.",
      ],
    },
    {
      heading: "Funciones previstas",
      paragraphs: ["Actualizaremos esta política antes de lanzar:"],
      items: [
        "Un asistente de IA en la app: el texto de tus peticiones se enviará a [TODO: proveedor de IA] para generar una respuesta, y contaremos las peticiones diarias para aplicar límites.",
        "Suscripciones a través del App Store: recibiremos el estado de tu suscripción (activa, caducada). Los pagos los gestiona Apple: nunca vemos los datos de tu tarjeta. [TODO: RevenueCat, si se usa]",
        "Analítica: [TODO: ahora no hay ninguna; describir la herramienta si se añade].",
      ],
    },
    {
      heading: "Para qué usamos tus datos",
      items: [
        "Para ofrecerte la app y conservar tu progreso en tus dispositivos (ejecución de nuestro acuerdo contigo).",
        "Para mantener el servicio seguro y corregir errores (nuestro interés legítimo).",
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
        "Vercel: alojamiento de este sitio web.",
      ],
      afterItems: [
        "[TODO: revisar la lista de proveedores antes del lanzamiento]",
      ],
    },
    {
      heading: "Cuánto tiempo los guardamos y cómo eliminarlos",
      paragraphs: [
        "Guardamos los datos de tu cuenta hasta que la eliminas. En la app: Perfil → Ajustes → Eliminar cuenta. Tu cuenta, tu progreso, tus peticiones guardadas y tus ajustes se eliminan de nuestros servidores al momento; si iniciaste sesión con Apple, también revocamos el acceso de la app a tu Apple ID.",
        "Las copias de seguridad del servidor pueden conservar datos hasta [TODO: número] días después de eliminarlos.",
        "Los datos que se guardan solo en tu teléfono se eliminan desde la app (Ajustes → Borrar datos) o al desinstalarla.",
      ],
    },
    {
      heading: "Tus derechos",
      paragraphs: [
        "Puedes pedirnos una copia de tus datos, corregirlos o eliminarlos, y oponerte a su uso. Si estás en la UE o el Reino Unido, también puedes reclamar ante tu autoridad de protección de datos. Escríbenos a [TODO: correo].",
      ],
    },
    {
      heading: "Menores",
      paragraphs: [
        "AI Navigator no está dirigido a menores de [TODO: 13 o 16] años. Algunos servicios de IA de las lecciones tienen sus propios límites de edad (por ejemplo, 18+).",
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
