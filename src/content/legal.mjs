// Aviso legal, política de privacidad y política de cookies.
// `c` trae los datos de empresa ya formateados (o el marcador [pendiente]).
// Revisa estos textos con un asesor antes de publicar: son una base, no asesoramiento jurídico.

export const LEGAL = {
  aviso: {
    slug: { es: 'aviso-legal', en: 'en/legal-notice' },
    title: { es: 'Aviso legal', en: 'Legal notice' },
    body: {
      es: (c) => `
<h2>1. Titular de la web</h2>
<p>En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:</p>
<table>
  <tr><th>Razón social</th><td>${c.name}</td></tr>
  <tr><th>CIF</th><td>${c.cif}</td></tr>
  <tr><th>Domicilio social</th><td>${c.address}</td></tr>
  <tr><th>Datos registrales</th><td>${c.registry}</td></tr>
  <tr><th>Correo electrónico</th><td>${c.email}</td></tr>
  <tr><th>Teléfono</th><td>${c.phone}</td></tr>
</table>
<h2>2. Objeto</h2>
<p>Este sitio web informa sobre los servicios de VERTIAN SOLUTIONS, S.L.: certificados de eficiencia energética, marketing de afiliados y desarrollo de aplicaciones y automatizaciones. El acceso y uso de la web atribuye la condición de usuario e implica la aceptación de este aviso legal.</p>
<h2>3. Condiciones de uso</h2>
<p>El usuario se compromete a hacer un uso adecuado de los contenidos y a no emplearlos para actividades ilícitas o contrarias a la buena fe. Los precios que aparecen en la web son orientativos y se identifican como tales; el precio vinculante es el que figura en el presupuesto aceptado por escrito.</p>
<h2>4. Propiedad intelectual e industrial</h2>
<p>Los textos, diseño, logotipos, código y demás contenidos de esta web son propiedad de VERTIAN SOLUTIONS, S.L. o se usan con licencia. Queda prohibida su reproducción, distribución o transformación sin autorización previa, salvo para uso personal y privado.</p>
<h2>5. Responsabilidad</h2>
<p>VERTIAN SOLUTIONS, S.L. procura que la información de la web sea exacta y esté actualizada, pero no garantiza la ausencia de errores ni se responsabiliza de los daños derivados del uso de la información o de interrupciones del servicio. Las calculadoras ofrecen estimaciones de ejemplo que no constituyen una oferta.</p>
<p>Los enlaces a sitios de terceros se ofrecen solo como referencia. No controlamos su contenido ni respondemos de él.</p>
<h2>6. Protección de datos</h2>
<p>El tratamiento de los datos personales que nos facilites se rige por nuestra <a href="{privacy}">política de privacidad</a>.</p>
<h2>7. Legislación aplicable</h2>
<p>Este aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa aplicable, incluida, cuando el usuario sea consumidor, la de su domicilio.</p>`,
      en: (c) => `
<p><em>This is an English translation for convenience. In case of discrepancy, the Spanish version prevails.</em></p>
<h2>1. Website owner</h2>
<p>In accordance with Article 10 of Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE), the owner of this website is:</p>
<table>
  <tr><th>Company name</th><td>${c.name}</td></tr>
  <tr><th>Tax ID (CIF)</th><td>${c.cif}</td></tr>
  <tr><th>Registered office</th><td>${c.address}</td></tr>
  <tr><th>Registry details</th><td>${c.registry}</td></tr>
  <tr><th>Email</th><td>${c.email}</td></tr>
  <tr><th>Phone</th><td>${c.phone}</td></tr>
</table>
<h2>2. Purpose</h2>
<p>This website provides information about the services of VERTIAN SOLUTIONS, S.L.: energy performance certificates, affiliate marketing, and app and automation development. Accessing and using the website makes you a user and implies acceptance of this legal notice.</p>
<h2>3. Terms of use</h2>
<p>Users agree to make appropriate use of the content and not to use it for unlawful purposes or in bad faith. Prices shown on the website are indicative and labelled as such; the binding price is the one in the quote accepted in writing.</p>
<h2>4. Intellectual and industrial property</h2>
<p>The text, design, logos, code and other content of this website belong to VERTIAN SOLUTIONS, S.L. or are used under licence. Reproduction, distribution or modification without prior authorisation is prohibited, except for personal and private use.</p>
<h2>5. Liability</h2>
<p>VERTIAN SOLUTIONS, S.L. strives to keep the information on this website accurate and up to date, but does not guarantee it is error-free and is not liable for damage arising from use of the information or service interruptions. The calculators provide sample estimates and do not constitute an offer.</p>
<p>Links to third-party sites are provided for reference only. We do not control or take responsibility for their content.</p>
<h2>6. Data protection</h2>
<p>Any personal data you provide is processed as described in our <a href="{privacy}">privacy policy</a>.</p>
<h2>7. Governing law</h2>
<p>This legal notice is governed by Spanish law. Any dispute will be submitted to the competent courts under applicable law, including, where the user is a consumer, those of their place of residence.</p>`,
    },
  },

  privacidad: {
    slug: { es: 'privacidad', en: 'en/privacy' },
    title: { es: 'Política de privacidad', en: 'Privacy policy' },
    body: {
      es: (c) => `
<h2>1. Responsable del tratamiento</h2>
<table>
  <tr><th>Responsable</th><td>${c.name}</td></tr>
  <tr><th>CIF</th><td>${c.cif}</td></tr>
  <tr><th>Domicilio</th><td>${c.address}</td></tr>
  <tr><th>Contacto</th><td>${c.email}</td></tr>
</table>
<h2>2. Qué datos tratamos</h2>
<p>Solo los que nos das en el formulario de contacto: nombre, correo electrónico, teléfono (opcional), el servicio que te interesa y tu mensaje, junto con los datos que pases desde la calculadora. No pedimos datos especialmente protegidos.</p>
<h2>3. Para qué los usamos y con qué base legal</h2>
<ul>
  <li><strong>Responder a tu solicitud</strong> y enviarte un presupuesto. Base legal: tu consentimiento al marcar la casilla del formulario y la aplicación de medidas precontractuales a petición tuya (art. 6.1.a y 6.1.b del RGPD).</li>
  <li><strong>Prestar el servicio</strong> si nos contratas. Base legal: ejecución del contrato (art. 6.1.b RGPD).</li>
  <li><strong>Cumplir obligaciones legales</strong> contables y fiscales. Base legal: obligación legal (art. 6.1.c RGPD).</li>
</ul>
<p>No tomamos decisiones automatizadas ni elaboramos perfiles con tus datos, y no te enviaremos publicidad sin tu permiso expreso.</p>
<h2>4. Cuánto tiempo los guardamos</h2>
<p>Si no llegas a contratar, borramos tu solicitud en un plazo máximo de 12 meses. Si nos contratas, conservamos los datos durante la relación comercial y, después, durante los plazos legales de prescripción (en general, 6 años para la documentación mercantil y contable).</p>
<h2>5. A quién se comunican</h2>
<p>No cedemos tus datos a terceros salvo obligación legal. Para funcionar usamos estos proveedores, que actúan como encargados del tratamiento:</p>
<ul>
  <li><strong>FormSubmit</strong> (formsubmit.co): recibe el formulario y nos lo reenvía por correo.</li>
  <li><strong>Google Ireland Ltd.</strong> (Gmail): servicio de correo electrónico donde recibimos las solicitudes.</li>
  <li><strong>El proveedor de alojamiento de la web</strong>, que puede registrar tu dirección IP por motivos técnicos y de seguridad.</li>
</ul>
<p>Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo. En ese caso, la transferencia se ampara en el Marco de Privacidad de Datos UE-EE. UU. o en cláusulas contractuales tipo aprobadas por la Comisión Europea.</p>
<h2>6. Tus derechos</h2>
<p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como retirar tu consentimiento en cualquier momento, escribiendo a ${c.email} o a nuestro domicilio. Indica el derecho que ejerces y cómo identificarte.</p>
<p>Si crees que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" rel="noopener">www.aepd.es</a>).</p>
<h2>7. Seguridad</h2>
<p>La web se sirve por conexión cifrada (HTTPS) y aplicamos medidas técnicas y organizativas razonables para proteger tus datos frente a pérdidas o accesos no autorizados.</p>`,
      en: (c) => `
<p><em>This is an English translation for convenience. In case of discrepancy, the Spanish version prevails.</em></p>
<h2>1. Data controller</h2>
<table>
  <tr><th>Controller</th><td>${c.name}</td></tr>
  <tr><th>Tax ID (CIF)</th><td>${c.cif}</td></tr>
  <tr><th>Address</th><td>${c.address}</td></tr>
  <tr><th>Contact</th><td>${c.email}</td></tr>
</table>
<h2>2. What data we process</h2>
<p>Only what you give us in the contact form: name, email, phone (optional), the service you’re interested in and your message, plus any details you pass from the calculator. We do not ask for special category data.</p>
<h2>3. Why we use it and on what legal basis</h2>
<ul>
  <li><strong>To answer your request</strong> and send you a quote. Legal basis: your consent when ticking the form checkbox and pre-contractual steps taken at your request (Art. 6(1)(a) and 6(1)(b) GDPR).</li>
  <li><strong>To provide the service</strong> if you hire us. Legal basis: performance of a contract (Art. 6(1)(b) GDPR).</li>
  <li><strong>To meet legal obligations</strong> such as accounting and tax. Legal basis: legal obligation (Art. 6(1)(c) GDPR).</li>
</ul>
<p>We do not make automated decisions or build profiles from your data, and we will not send you marketing without your express permission.</p>
<h2>4. How long we keep it</h2>
<p>If you don’t go on to hire us, we delete your request within 12 months at most. If you do, we keep the data for the duration of the business relationship and then for the statutory limitation periods (generally 6 years for commercial and accounting records).</p>
<h2>5. Who we share it with</h2>
<p>We do not pass your data to third parties unless legally required. To operate, we use the following providers, acting as data processors:</p>
<ul>
  <li><strong>FormSubmit</strong> (formsubmit.co): receives the form and forwards it to us by email.</li>
  <li><strong>Google Ireland Ltd.</strong> (Gmail): the email service where we receive requests.</li>
  <li><strong>The website hosting provider</strong>, which may log your IP address for technical and security reasons.</li>
</ul>
<p>Some of these providers may process data outside the European Economic Area. Where they do, the transfer relies on the EU-US Data Privacy Framework or on standard contractual clauses approved by the European Commission.</p>
<h2>6. Your rights</h2>
<p>You can exercise your rights of access, rectification, erasure, objection, restriction of processing and portability, and withdraw your consent at any time, by writing to ${c.email} or to our registered office. Say which right you are exercising and how we can identify you.</p>
<p>If you believe we have not handled your request properly, you can complain to the Spanish Data Protection Agency (<a href="https://www.aepd.es" rel="noopener">www.aepd.es</a>).</p>
<h2>7. Security</h2>
<p>The website is served over an encrypted connection (HTTPS) and we apply reasonable technical and organisational measures to protect your data against loss or unauthorised access.</p>`,
    },
  },

  cookies: {
    slug: { es: 'cookies', en: 'en/cookies' },
    title: { es: 'Política de cookies', en: 'Cookie policy' },
    body: {
      es: () => `
<h2>1. Qué son las cookies</h2>
<p>Las cookies y tecnologías similares (como el almacenamiento local del navegador) son pequeños archivos que una web guarda en tu dispositivo para recordar información entre visitas.</p>
<h2>2. Qué usa esta web</h2>
<p>Esta web <strong>no usa cookies de análisis, publicidad ni redes sociales</strong>, y no carga contenido de terceros que las instale: las tipografías y el resto de archivos se sirven desde nuestro propio dominio.</p>
<p>Solo usa este almacenamiento técnico, necesario para que la web funcione como pides:</p>
<table>
  <tr><th>Nombre</th><th>Tipo</th><th>Finalidad</th><th>Duración</th></tr>
  <tr><td>vt-lang</td><td>Almacenamiento local</td><td>Recordar el idioma que has elegido (español o inglés).</td><td>Hasta que lo borres</td></tr>
</table>
<p>Al ser estrictamente necesario, este almacenamiento está exento del deber de consentimiento según el artículo 22.2 de la LSSI-CE, por eso no mostramos un aviso de cookies.</p>
<h2>3. Cómo borrarlas o bloquearlas</h2>
<p>Puedes borrar o bloquear las cookies y el almacenamiento local desde la configuración de tu navegador. Si lo haces, la web seguirá funcionando, pero no recordará el idioma elegido.</p>
<h2>4. Cambios</h2>
<p>Si en el futuro añadimos herramientas de análisis u otras cookies no necesarias, actualizaremos esta política y te pediremos el consentimiento antes de instalarlas.</p>`,
      en: () => `
<p><em>This is an English translation for convenience. In case of discrepancy, the Spanish version prevails.</em></p>
<h2>1. What cookies are</h2>
<p>Cookies and similar technologies (such as the browser’s local storage) are small files a website stores on your device to remember information between visits.</p>
<h2>2. What this website uses</h2>
<p>This website <strong>does not use analytics, advertising or social media cookies</strong>, and does not load third-party content that sets them: fonts and all other files are served from our own domain.</p>
<p>It only uses the following technical storage, needed for the website to work as you ask:</p>
<table>
  <tr><th>Name</th><th>Type</th><th>Purpose</th><th>Duration</th></tr>
  <tr><td>vt-lang</td><td>Local storage</td><td>Remembers the language you chose (Spanish or English).</td><td>Until you clear it</td></tr>
</table>
<p>As it is strictly necessary, this storage is exempt from the consent requirement under Article 22.2 of Spain’s LSSI-CE, which is why we don’t show a cookie banner.</p>
<h2>3. How to delete or block them</h2>
<p>You can delete or block cookies and local storage in your browser settings. If you do, the website will still work but won’t remember your language choice.</p>
<h2>4. Changes</h2>
<p>If we add analytics or other non-essential cookies in the future, we will update this policy and ask for your consent before setting them.</p>`,
    },
  },
};
