/**
 * VERTIAN SOLUTIONS · Formulario de contacto de la web.
 *
 * Cada solicitud de la web:
 *   1. se guarda como una fila en la hoja «Solicitudes» de esta hoja de cálculo,
 *   2. se envía por correo a AVISOS (vertianmail@gmail.com),
 *   3. y el cliente recibe una confirmación en su idioma desde esta cuenta de Gmail.
 *
 * Instalación: ver INSTRUCCIONES.md en esta misma carpeta.
 */

// Correo que recibe el aviso de cada solicitud.
var AVISOS = 'vertianmail@gmail.com';
// Nombre con el que salen los correos.
var REMITENTE = 'VERTIAN SOLUTIONS';
// Nombre de la pestaña donde se guardan las solicitudes.
var HOJA = 'Solicitudes';
var COLUMNAS = ['Fecha', 'Nombre', 'Correo', 'Teléfono', 'Servicio', 'Mensaje', 'Página', 'Idioma', 'Estado'];

var CONFIRMACION = {
  es: {
    asunto: 'Hemos recibido tu solicitud · VERTIAN SOLUTIONS',
    texto: 'Hola, {nombre}:\n\n' +
      'Hemos recibido tu solicitud sobre «{servicio}». Ya estamos trabajando en ella y te responderemos lo antes posible, como máximo en 24 horas en día laborable.\n\n' +
      'Si quieres añadir algo, responde a este correo.\n\n' +
      'Gracias por confiar en nosotros.\n' +
      'VERTIAN SOLUTIONS'
  },
  en: {
    asunto: 'We have received your request · VERTIAN SOLUTIONS',
    texto: 'Hello {nombre},\n\n' +
      'We have received your request about “{servicio}”. We are already working on it and will reply as soon as possible, within one working day at the latest.\n\n' +
      'If you would like to add anything, just reply to this email.\n\n' +
      'Thank you for your trust.\n' +
      'VERTIAN SOLUTIONS'
  }
};

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);

    // Trampa para bots: el campo oculto «web» solo lo rellenan programas automáticos.
    if (d.web) return respuesta({ ok: true });

    var s = {
      nombre: limpiar(d.nombre, 120),
      email: limpiar(d.email, 200).toLowerCase(),
      telefono: limpiar(d.telefono, 40),
      servicio: limpiar(d.servicio, 120),
      mensaje: limpiar(d.mensaje, 5000),
      pagina: limpiar(d.pagina, 80),
      idioma: d.idioma === 'en' ? 'en' : 'es'
    };
    if (!s.nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email) || d.privacidad !== 'aceptada') {
      return respuesta({ ok: false, error: 'datos' });
    }

    // Límite anti abuso: como mucho 3 solicitudes por correo cada hora.
    var cache = CacheService.getScriptCache();
    var clave = 'n:' + s.email;
    var veces = Number(cache.get(clave) || 0);
    if (veces >= 3) return respuesta({ ok: false, error: 'limite' });
    cache.put(clave, String(veces + 1), 3600);

    guardar(s);

    MailApp.sendEmail({
      to: AVISOS,
      replyTo: s.email,
      name: REMITENTE,
      subject: 'Nueva solicitud · ' + s.servicio + ' · ' + s.nombre,
      body: 'Nombre: ' + s.nombre + '\n' +
        'Correo: ' + s.email + '\n' +
        'Teléfono: ' + (s.telefono || '—') + '\n' +
        'Servicio: ' + s.servicio + '\n' +
        'Página: ' + s.pagina + ' (' + s.idioma + ')\n\n' +
        'Mensaje:\n' + (s.mensaje || '—') + '\n\n' +
        'Responde a este correo para contestar directamente al cliente.'
    });

    var c = CONFIRMACION[s.idioma];
    MailApp.sendEmail({
      to: s.email,
      replyTo: AVISOS,
      name: REMITENTE,
      subject: c.asunto,
      body: c.texto.replace('{nombre}', s.nombre).replace('{servicio}', s.servicio)
    });

    return respuesta({ ok: true });
  } catch (err) {
    console.error(err);
    return respuesta({ ok: false, error: 'servidor' });
  }
}

// Guarda la solicitud en la hoja (la crea con sus columnas si no existe).
function guardar(s) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var libro = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = libro.getSheetByName(HOJA);
    if (!hoja) {
      hoja = libro.insertSheet(HOJA);
      hoja.appendRow(COLUMNAS);
      hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold');
      hoja.setFrozenRows(1);
    }
    hoja.appendRow([new Date(), s.nombre, s.email, s.telefono, s.servicio, s.mensaje, s.pagina, s.idioma, 'Nueva']);
  } finally {
    lock.releaseLock();
  }
}

// Texto recortado y sin caracteres que una hoja de cálculo interpretaría como fórmula.
function limpiar(v, max) {
  var t = String(v == null ? '' : v).trim().slice(0, max);
  return /^[=+\-@]/.test(t) ? "'" + t : t;
}

function respuesta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Ejecuta esta función una vez desde el editor para dar los permisos y comprobar que todo funciona.
function probar() {
  doPost({ postData: { contents: JSON.stringify({
    nombre: 'Prueba', email: AVISOS, telefono: '', servicio: 'Prueba de instalación',
    mensaje: 'Si ves esta fila y los dos correos, todo funciona.', pagina: 'prueba', idioma: 'es', privacidad: 'aceptada'
  }) } });
}
