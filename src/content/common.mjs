// Textos compartidos por todas las páginas. T(es, en) marca un texto bilingüe.
export const T = (es, en) => ({ __t: true, es, en });

// Sustituye recursivamente cada T() por el texto del idioma pedido.
export function resolve(v, lang) {
  if (Array.isArray(v)) return v.map(x => resolve(x, lang));
  if (v && typeof v === 'object') {
    if (v.__t) return v[lang];
    const o = {};
    for (const k in v) o[k] = resolve(v[k], lang);
    return o;
  }
  return v;
}

export const UI = {
  skip: T('Saltar al contenido', 'Skip to content'),
  menuOpen: T('Abrir menú', 'Open menu'),
  sectionsNav: T('Secciones', 'Sections'),
  mobileNav: T('Menú móvil', 'Mobile menu'),
  home: T('VERTIAN SOLUTIONS, inicio', 'VERTIAN SOLUTIONS, home'),
  askInfo: T('Pedir información', 'Get in touch'),
  langLabel: T('Idioma', 'Language'),
  from: T('desde', 'from'),
  vat: T('+ IVA', '+ VAT'),
  examplePrices: T('CIFRAS DE EJEMPLO · PENDIENTES DE CONFIRMAR', 'SAMPLE FIGURES · TO BE CONFIRMED'),
  fig: T('FIG. 01', 'FIG. 01'),
  photoPending: T('Foto pendiente', 'Photo pending'),
  legalNotice: T('Aviso legal', 'Legal notice'),
  privacy: T('Política de privacidad', 'Privacy policy'),
  cookies: T('Política de cookies', 'Cookie policy'),
};

export const COMMIT = (feeText) => [
  { v: '24 h', t: T('Respuesta a toda solicitud en día laborable.', 'We reply to every request within one working day.') },
  { v: '0 €', t: feeText },
  { v: 'S.L.', t: T('Factura de VERTIAN SOLUTIONS, S.L. con CIF.', 'Invoiced by VERTIAN SOLUTIONS, S.L. with a tax ID.') },
  { v: 'RC', t: T('Seguro de responsabilidad civil profesional.', 'Professional liability insurance.') },
];

export const COMPANY_SECTION = {
  h: T('Una empresa nueva, con los datos a la vista.', 'A new company, with everything on the table.'),
  historia: [
    T('VERTIAN SOLUTIONS nace de una idea sencilla: medir antes de empezar y decir lo que cuesta. El nombre viene del vernier, la escala del calibre que permite leer décimas de milímetro donde a simple vista solo hay una raya. Así queremos trabajar: mirar de cerca y con datos antes de dar una cifra.',
      'VERTIAN SOLUTIONS was born from a simple idea: measure before starting and say what it costs. The name comes from the vernier, the calliper scale that lets you read tenths of a millimetre where the naked eye sees a single line. That is how we want to work: look closely, with data, before giving a figure.'),
    T('Hacemos tres cosas que parecen distintas y tienen el mismo fondo: certificados energéticos, marketing de afiliados y aplicaciones con automatización. En las tres, quien nos contrata necesita saber qué va a recibir, cuánto le va a costar y cómo comprobar el resultado. En un certificado es una letra de la A a la G; en afiliación, lo que entra cada mes en tu cuenta; en una automatización, las horas que vuelven a tu semana.',
      'We do three things that look different but share the same core: energy certificates, affiliate marketing, and apps with automation. In all three, whoever hires us needs to know what they will get, what it will cost and how to check the result. In a certificate it is a letter from A to G; in affiliate marketing, what lands in your account each month; in an automation, the hours that come back to your week.'),
    T('Somos una empresa pequeña y lo decimos sin rodeos. Hablas con quien hace el trabajo, no con una centralita. Preferimos un presupuesto cerrado a una sorpresa en la factura, y un informe que se entienda a uno que impresione. Trabajamos en persona en Gijón y en la Ribera Alta, y en remoto para toda España.',
      'We are a small company and we say so plainly. You talk to the person doing the work, not to a switchboard. We prefer a fixed quote to a surprise on the invoice, and a report you can understand to one that tries to impress. We work in person in Gijón and the Ribera Alta, and remotely across Spain.'),
  ],
  factsLabel: T('FICHA VERIFICABLE', 'VERIFIABLE DETAILS'),
  notsLabel: T('LO QUE NO HACEMOS', 'WHAT WE DON’T DO'),
  rows: {
    name: T('RAZÓN SOCIAL', 'COMPANY NAME'),
    cif: T('CIF', 'TAX ID (CIF)'),
    address: T('DOMICILIO', 'REGISTERED OFFICE'),
    registry: T('REGISTRO', 'REGISTRY'),
    insurance: T('SEGURO RC', 'LIABILITY INSURANCE'),
    data: T('DATOS', 'DATA'),
  },
  dataText: T('Tratamiento conforme al RGPD. No cedemos datos a terceros.', 'Processed under the GDPR. We never pass data to third parties.'),
  policyWord: T('póliza n.º', 'policy no.'),
};

export const REVIEWS = {
  h: T('Lo que dicen quienes ya nos han contratado.', 'What our clients say.'),
  score: T('Puntuación media en Google', 'Average Google rating'),
  count: T('0 RESEÑAS · SE ACTUALIZA SOLA', '0 REVIEWS · UPDATES AUTOMATICALLY'),
  reserved: T('EJEMPLO · ESPACIO RESERVADO', 'SAMPLE · RESERVED SPACE'),
  quote: T('[Texto de la opinión real del cliente, sin editar.]', '[Real client review text, unedited.]'),
  foot: T('Solo publicamos opiniones de clientes reales, con nombre, fecha y enlace a la fuente.', 'We only publish reviews from real clients, with name, date and a link to the source.'),
};

export const CONTACT = {
  h: T('Pide información.', 'Get in touch.'),
  phone: T('TELÉFONO', 'PHONE'),
  email: T('CORREO', 'EMAIL'),
  hours: T('HORARIO', 'HOURS'),
  name: T('Nombre', 'Name'),
  mail: T('Correo', 'Email'),
  tel: T('Teléfono', 'Phone'),
  service: T('Servicio', 'Service'),
  message: T('Mensaje', 'Message'),
  other: T('Otra consulta', 'Other enquiry'),
  privacy: T('He leído y acepto la <a href="{privacy}">política de privacidad</a>. VERTIAN SOLUTIONS, S.L. tratará mis datos para responder a esta solicitud.',
             'I have read and accept the <a href="{privacy}">privacy policy</a>. VERTIAN SOLUTIONS, S.L. will process my data to answer this request.'),
  submit: T('Enviar solicitud', 'Send request'),
};

// Mensajes que usa el JavaScript del formulario.
export const FORM_I18N = {
  sent: T('Enviado. Te respondemos en 24 h.', 'Sent. We’ll reply within 24 h.'),
  check: T('Revisa el nombre y el correo.', 'Please check your name and email.'),
  privacy: T('Tienes que aceptar la política de privacidad.', 'You need to accept the privacy policy.'),
  sending: T('Enviando…', 'Sending…'),
  fail: T('No se ha podido enviar. Inténtalo de nuevo o escríbenos por correo.', 'We couldn’t send it. Please try again or email us.'),
  limit: T('Ya hemos recibido varias solicitudes tuyas en la última hora. Te responderemos pronto; si es urgente, escríbenos por correo.', 'We’ve already received several requests from you in the last hour. We’ll reply soon; if it’s urgent, please email us.'),
  subject: T('Nueva solicitud desde la web', 'New request from the website'),
  // Correo automático que recibe el cliente al enviar el formulario.
  // {nombre}, {servicio} y {correo} se sustituyen al enviar.
  autoreply: T(
    'Hola, {nombre}:\n\n' +
    'Hemos recibido tu solicitud sobre «{servicio}». Ya estamos trabajando en ella y te responderemos lo antes posible, como máximo en 24 horas en día laborable.\n\n' +
    'Si quieres añadir algo, escríbenos a {correo}.\n\n' +
    'Gracias por confiar en nosotros.\n' +
    'VERTIAN SOLUTIONS',
    'Hello {nombre},\n\n' +
    'We have received your request about “{servicio}”. We are already working on it and will reply as soon as possible, within one working day at the latest.\n\n' +
    'If you would like to add anything, email us at {correo}.\n\n' +
    'Thank you for your trust.\n' +
    'VERTIAN SOLUTIONS'),
  // Formulario sin activar en FormSubmit (solo ocurre hasta que se confirma el correo de activación).
  activation: T('El formulario aún no está activado. Revisa el correo de activación de FormSubmit en vertianmail@gmail.com.', 'The form isn’t activated yet. Check the FormSubmit activation email.'),
};

export const PENDING = {
  cif: T('[B-00000000]', '[B-00000000]'),
  address: T('[Domicilio social]', '[Registered office]'),
  registry: T('Registro Mercantil de [provincia] · [tomo, folio, hoja]', 'Companies Registry of [province] · [volume, folio, sheet]'),
  insurer: T('[Aseguradora]', '[Insurer]'),
  policy: T('[0000]', '[0000]'),
  phone: T('[+34 000 000 000]', '[+34 000 000 000]'),
  email: T('[correo de contacto]', '[contact email]'),
  footAddress: T('[Domicilio social pendiente]', '[Registered office pending]'),
  footRegistry: T('[Registro Mercantil pendiente]', '[Registry details pending]'),
};

// Asistente (chat) de cada página. Responde el CRM con Claude y la base de conocimiento de cada página.
export const CHAT_I18N = {
  open: T('¿Dudas? Pregunta', 'Questions? Ask'),
  title: T('Asistente VERTIAN', 'VERTIAN assistant'),
  tag: T('RESPUESTAS AUTOMÁTICAS · IA', 'AUTOMATED ANSWERS · AI'),
  close: T('Cerrar el asistente', 'Close the assistant'),
  hello: T(
    'Hola. Soy el asistente automático de VERTIAN. Te respondo con la información de esta página; si no sé algo, te digo cómo hablar con el equipo. ¿En qué te ayudo?',
    'Hi. I’m VERTIAN’s automated assistant. I answer with the information on this page; if I don’t know something, I’ll tell you how to reach the team. How can I help?'),
  placeholder: T('Escribe tu pregunta…', 'Type your question…'),
  send: T('Enviar', 'Send'),
  writing: T('Escribiendo…', 'Typing…'),
  notice: T(
    'Asistente con inteligencia artificial: puede equivocarse, el precio definitivo te lo confirmamos por escrito. No compartas datos sensibles. Guardamos la conversación para mejorar el servicio.',
    'AI assistant: it may make mistakes; we confirm the final price in writing. Don’t share sensitive data. We keep the conversation to improve our service.'),
  privacy: T('Privacidad', 'Privacy'),
  contact: T('Hablar con una persona', 'Talk to a person'),
  fail: T('No se ha podido conectar. Escríbenos a {correo} o llama al {tel}.', 'Couldn’t connect. Email us at {correo} or call {tel}.'),
  suggestions: {
    'certificados-gijon': [
      T('¿Cuánto cuesta para un piso?', 'How much for a flat?'),
      T('¿Tengo que estar en la visita?', 'Do I need to be at the visit?'),
      T('¿Cuánto tardáis?', 'How long does it take?'),
    ],
    'certificados-alzira': [
      T('¿Cuánto cuesta para un piso?', 'How much for a flat?'),
      T('¿Trabajáis en Algemesí?', 'Do you work in Algemesí?'),
      T('¿Qué documentos necesito?', 'What documents do I need?'),
    ],
    afiliados: [
      T('¿Cómo funciona?', 'How does it work?'),
      T('¿Hay permanencia?', 'Is there a minimum term?'),
      T('¿Necesito una web?', 'Do I need a website?'),
    ],
    'apps-ia': [
      T('¿Qué podéis automatizar?', 'What can you automate?'),
      T('¿Cuánto cuesta?', 'How much does it cost?'),
      T('¿Dónde están mis datos?', 'Where is my data stored?'),
    ],
  },
};
