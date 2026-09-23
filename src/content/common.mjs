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
  p1: T('VERTIAN SOLUTIONS nace en {year} con una idea sencilla: medir antes de empezar y decir lo que cuesta. El nombre viene del vernier, la escala del calibre que permite leer décimas de milímetro donde a simple vista solo hay una raya.',
        'VERTIAN SOLUTIONS was founded in {year} on a simple idea: measure before starting and say what it costs. The name comes from the vernier, the calliper scale that lets you read tenths of a millimetre where the naked eye sees a single line.'),
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
  dictate: T('Dictar', 'Dictate'),
  stop: T('Parar', 'Stop'),
};

// Mensajes que usa el JavaScript del formulario.
export const FORM_I18N = {
  sent: T('Enviado. Te respondemos en 24 h.', 'Sent. We’ll reply within 24 h.'),
  check: T('Revisa el nombre y el correo.', 'Please check your name and email.'),
  privacy: T('Tienes que aceptar la política de privacidad.', 'You need to accept the privacy policy.'),
  sending: T('Enviando…', 'Sending…'),
  fail: T('No se ha podido enviar. Inténtalo de nuevo o escríbenos por correo.', 'We couldn’t send it. Please try again or email us.'),
  noVoice: T('Tu navegador no permite dictado. Prueba con Chrome, Edge o Safari.', 'Your browser doesn’t support dictation. Try Chrome, Edge or Safari.'),
  subject: T('Nueva solicitud desde la web', 'New request from the website'),
};

export const PENDING = {
  cif: T('[B-00000000]', '[B-00000000]'),
  address: T('[Domicilio social]', '[Registered office]'),
  registry: T('Registro Mercantil de [provincia] · [tomo, folio, hoja]', 'Companies Registry of [province] · [volume, folio, sheet]'),
  insurer: T('[Aseguradora]', '[Insurer]'),
  policy: T('[0000]', '[0000]'),
  phone: T('[+34 000 000 000]', '[+34 000 000 000]'),
  email: T('[correo de contacto]', '[contact email]'),
  year: T('[año]', '[year]'),
  footAddress: T('[Domicilio social pendiente]', '[Registered office pending]'),
  footRegistry: T('[Registro Mercantil pendiente]', '[Registry details pending]'),
};
