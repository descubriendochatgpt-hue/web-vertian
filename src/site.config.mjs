// Configuración general de la web.
// Los datos de empresa vacíos se muestran como [pendiente] hasta que se rellenen aquí.

export const SITE = {
  // Dominio definitivo (cámbialo cuando lo compres). Se usa en canonical, hreflang y Open Graph.
  url: 'https://www.vertian.es',

  // Los formularios envían las solicitudes a este correo mediante FormSubmit (https://formsubmit.co).
  // La primera vez que alguien envíe el formulario llegará un correo de activación a esta dirección.
  formEmail: 'vertianmail@gmail.com',

  // URL de la aplicación web de Google Apps Script (ver google-apps-script/INSTRUCCIONES.md).
  // Cuando está puesta, cada solicitud se guarda en tu hoja de Google y el cliente recibe
  // la confirmación desde tu Gmail. Vacía = se usa FormSubmit.
  formEndpoint: '',
};

export const COMPANY = {
  name: 'VERTIAN SOLUTIONS, S.L.',
  cif: '',            // p. ej. B-12345678
  address: '',        // domicilio social completo
  registry: '',       // Registro Mercantil de [provincia] · tomo, folio, hoja
  phone: '',          // p. ej. +34 600 000 000
  email: '',          // correo público de contacto, p. ej. hola@vertian.es
  insurer: '',        // aseguradora de responsabilidad civil
  policy: '',         // número de póliza
  founded: '',        // año de fundación
};
