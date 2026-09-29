// Configuración general de la web.
// Los datos de empresa vacíos se muestran como [pendiente] hasta que se rellenen aquí.

export const SITE = {
  // Dirección de la web. Cámbiala por el dominio propio cuando lo compres (p. ej. https://www.vertian.es).
  // Se usa en canonical, hreflang, Open Graph, el sitemap y el aviso legal.
  url: 'https://nuevawebvertian.netlify.app',

  // Los formularios envían las solicitudes a este correo mediante FormSubmit (https://formsubmit.co).
  // La primera vez que alguien envíe el formulario llegará un correo de activación a esta dirección.
  formEmail: 'vertianmail@gmail.com',

  // Dirección del CRM. Cada solicitud del formulario se guarda allí como cliente y oportunidad,
  // y el CRM envía el aviso y la confirmación al cliente. Vacía = se usa FormSubmit.
  crmUrl: 'https://crm-vertian.vercel.app',

  // Sección «Opiniones de clientes». Oculta hasta tener reseñas reales con permiso para publicarlas.
  mostrarOpiniones: false,

  // Asistente (chat) con IA en cada página. Responde el CRM; el chat solo aparece si en el CRM
  // está puesta la clave de Claude y el asistente de esa página está activo.
  asistente: true,

  // Número de WhatsApp (con prefijo 34, sin espacios ni +). Vacío = sin botón de WhatsApp.
  whatsapp: '34687084638',
};

export const COMPANY = {
  name: 'VERTIAN SOLUTIONS, S.L.',
  cif: 'B05630074',
  address: 'Calle La Fuente 4, bajo, 46199 La Cabezuela, Cortes de Pallás (Valencia)',
  registry: '',       // Registro Mercantil de [provincia] · tomo, folio, hoja
  phone: '+34 687 08 46 38',
  email: 'vertianmail@gmail.com', // correo público de contacto
  insurer: '',        // aseguradora de responsabilidad civil
  policy: '',         // número de póliza
};
