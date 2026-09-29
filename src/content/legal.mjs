// Aviso legal, política de privacidad y política de cookies.
// `c` trae los datos de empresa ya formateados (o el marcador [pendiente]).
// Basado en la plantilla facilitada por VERTIAN; conviene que lo revise un asesor antes de darlo por definitivo.

// Encargados del tratamiento que usa la web (y el CRM, si está conectado).
const proveedores = {
  es: (c) => [
    '<li><strong>Netlify, Inc.</strong>: alojamiento de este sitio web.</li>',
    ...(c.crm
      ? [
          '<li><strong>Vercel Inc.</strong>: alojamiento de nuestro programa de gestión de clientes (CRM), que recibe los formularios.</li>',
          '<li><strong>Supabase Inc.</strong>: base de datos del CRM, donde guardamos las solicitudes, los pedidos y los documentos que nos envíes.</li>',
          '<li><strong>Google Ireland Ltd.</strong> (Gmail): correo electrónico con el que te enviamos la confirmación y nos comunicamos contigo.</li>',
          '<li><strong>Telegram Messenger Inc.</strong>: aviso interno a nuestro equipo de cada nueva solicitud.</li>',
          '<li><strong>Anthropic, PBC</strong> (Claude): genera las respuestas del asistente automático de la web a partir del texto de la conversación. Según sus condiciones comerciales, no usa estas conversaciones para entrenar sus modelos.</li>',
          '<li><strong>Stripe Payments Europe, Ltd.</strong>: procesa los pagos con tarjeta. Los datos de la tarjeta los recibe Stripe directamente; nosotros no los vemos.</li>',
          '<li><strong>WhatsApp Ireland Ltd.</strong>: solo si decides escribirnos por WhatsApp.</li>',
          '<li><strong>FormSubmit</strong> (formsubmit.co): solo si el CRM no está disponible, reenvía tu solicitud por correo para que no se pierda.</li>',
        ]
      : [
          '<li><strong>FormSubmit</strong> (formsubmit.co): recibe el formulario, nos lo reenvía por correo y te envía la confirmación.</li>',
          '<li><strong>Google Ireland Ltd.</strong> (Gmail): correo electrónico donde recibimos las solicitudes.</li>',
        ]),
  ].join('\n  '),
  en: (c) => [
    '<li><strong>Netlify, Inc.</strong>: hosting for this website.</li>',
    ...(c.crm
      ? [
          '<li><strong>Vercel Inc.</strong>: hosting for our customer management software (CRM), which receives the forms.</li>',
          '<li><strong>Supabase Inc.</strong>: the CRM database, where we store requests, orders and any documents you send us.</li>',
          '<li><strong>Google Ireland Ltd.</strong> (Gmail): the email service we use to send you the confirmation and communicate with you.</li>',
          '<li><strong>Telegram Messenger Inc.</strong>: internal notification to our team of each new request.</li>',
          '<li><strong>Anthropic, PBC</strong> (Claude): generates the answers of the website’s automated assistant from the text of the conversation. Under its commercial terms, it does not use these conversations to train its models.</li>',
          '<li><strong>Stripe Payments Europe, Ltd.</strong>: processes card payments. Card details go directly to Stripe; we never see them.</li>',
          '<li><strong>WhatsApp Ireland Ltd.</strong>: only if you choose to message us on WhatsApp.</li>',
          '<li><strong>FormSubmit</strong> (formsubmit.co): only if the CRM is unavailable, it forwards your request by email so it isn’t lost.</li>',
        ]
      : [
          '<li><strong>FormSubmit</strong> (formsubmit.co): receives the form, forwards it to us by email and sends you the confirmation.</li>',
          '<li><strong>Google Ireland Ltd.</strong> (Gmail): the email service where we receive requests.</li>',
        ]),
  ].join('\n  '),
};

const TRADUCCION = '<p><em>This is an English translation for convenience. In case of discrepancy, the Spanish version prevails.</em></p>';

export const LEGAL = {
  aviso: {
    slug: { es: 'aviso-legal', en: 'en/legal-notice' },
    title: { es: 'Aviso legal', en: 'Legal notice' },
    body: {
      es: (c) => `
<h2>1. Datos identificativos del titular</h2>
<p>En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que el titular de este sitio web es:</p>
<table>
  <tr><th>Titular</th><td>${c.name}</td></tr>
  <tr><th>CIF</th><td>${c.cif}</td></tr>
  <tr><th>Domicilio</th><td>${c.address}</td></tr>
  <tr><th>Correo electrónico</th><td>${c.email}</td></tr>
  <tr><th>Teléfono</th><td>${c.phone}</td></tr>
  <tr><th>Datos registrales</th><td>${c.registry}</td></tr>
  <tr><th>Dominio</th><td>${c.dominio}</td></tr>
</table>
<h2>2. Objeto y ámbito de aplicación</h2>
<p>El presente Aviso Legal regula el acceso y uso del sitio web ${c.dominio} (en adelante, «el Sitio Web»). El acceso a la web es gratuito, salvo el coste de la conexión a internet, y atribuye la condición de usuario a quien lo utilice, lo que implica la aceptación plena de estas condiciones.</p>
<h2>3. Condiciones de uso</h2>
<p>El usuario se compromete a hacer un uso adecuado del Sitio Web y de sus contenidos, conforme a la ley, la buena fe, el orden público y el presente Aviso Legal. En particular, se compromete a no:</p>
<ul>
  <li>Realizar actividades ilícitas o contrarias a la buena fe.</li>
  <li>Difundir contenidos de carácter ilegal, ofensivo, discriminatorio o que vulneren derechos de terceros.</li>
  <li>Introducir virus u otros sistemas que puedan dañar o inutilizar el Sitio Web o los equipos de terceros.</li>
  <li>Intentar acceder a áreas restringidas o vulnerar las medidas de seguridad.</li>
</ul>
<p>Los precios que aparecen en el Sitio Web y los resultados de sus calculadoras son orientativos y se identifican como tales; el precio vinculante es el que figura en el presupuesto aceptado por escrito.</p>
<h2>4. Propiedad intelectual e industrial</h2>
<p>Todos los contenidos del Sitio Web (textos, imágenes, logotipos, diseño, código fuente, marcas, etc.) son propiedad de ${c.name} o de terceros que han autorizado su uso, y están protegidos por la normativa española e internacional sobre propiedad intelectual e industrial.</p>
<p>Queda prohibida su reproducción, distribución, comunicación pública o transformación sin autorización expresa y por escrito del titular, salvo para uso personal y privado.</p>
<h2>5. Responsabilidad</h2>
<p>${c.name} no se hace responsable de:</p>
<ul>
  <li>Errores u omisiones en los contenidos, ni de que estos estén actualizados en todo momento.</li>
  <li>Interrupciones, fallos técnicos o falta de disponibilidad del Sitio Web.</li>
  <li>Daños derivados de virus u otros elementos dañinos, siempre que se hayan adoptado las medidas de seguridad razonables.</li>
  <li>El uso que los usuarios hagan de la información publicada.</li>
</ul>
<h2>6. Enlaces a terceros</h2>
<p>El Sitio Web puede contener enlaces a páginas de terceros. ${c.name} no controla ni asume responsabilidad sobre sus contenidos, políticas o prácticas. La inclusión de un enlace no implica recomendación ni relación con el titular de la página enlazada.</p>
<p>Si detectas un enlace que dirija a contenidos ilícitos, puedes comunicarlo a ${c.email}.</p>
<h2>7. Protección de datos y cookies</h2>
<p>El tratamiento de datos personales se rige por la <a href="{privacy}">Política de Privacidad</a> y el uso de cookies por la <a href="{cookies}">Política de Cookies</a>, disponibles en este Sitio Web.</p>
<h2>8. Modificaciones</h2>
<p>${c.name} se reserva el derecho a modificar en cualquier momento el contenido del Sitio Web y del presente Aviso Legal, sin previo aviso. Se recomienda revisarlo periódicamente.</p>
<h2>9. Legislación aplicable y jurisdicción</h2>
<p>Este Aviso Legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Valencia, salvo que la normativa aplicable establezca otro fuero (en particular, cuando el usuario tenga la condición de consumidor, será competente el tribunal de su domicilio).</p>`,
      en: (c) => `${TRADUCCION}
<h2>1. Owner details</h2>
<p>In accordance with Article 10 of Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE), the owner of this website is:</p>
<table>
  <tr><th>Owner</th><td>${c.name}</td></tr>
  <tr><th>Tax ID (CIF)</th><td>${c.cif}</td></tr>
  <tr><th>Registered office</th><td>${c.address}</td></tr>
  <tr><th>Email</th><td>${c.email}</td></tr>
  <tr><th>Phone</th><td>${c.phone}</td></tr>
  <tr><th>Registry details</th><td>${c.registry}</td></tr>
  <tr><th>Domain</th><td>${c.dominio}</td></tr>
</table>
<h2>2. Purpose and scope</h2>
<p>This Legal Notice governs access to and use of the website ${c.dominio} (the “Website”). Access is free of charge, except for the cost of your internet connection, and makes whoever uses it a user, which implies full acceptance of these terms.</p>
<h2>3. Terms of use</h2>
<p>Users agree to make appropriate use of the Website and its content, in accordance with the law, good faith, public order and this Legal Notice. In particular, users agree not to:</p>
<ul>
  <li>Carry out unlawful activities or activities contrary to good faith.</li>
  <li>Spread illegal, offensive or discriminatory content, or content that infringes the rights of others.</li>
  <li>Introduce viruses or other systems that could damage or disable the Website or other people’s equipment.</li>
  <li>Try to access restricted areas or breach security measures.</li>
</ul>
<p>Prices shown on the Website and the results of its calculators are indicative and labelled as such; the binding price is the one in the quote accepted in writing.</p>
<h2>4. Intellectual and industrial property</h2>
<p>All Website content (text, images, logos, design, source code, trademarks, etc.) belongs to ${c.name} or to third parties who have authorised its use, and is protected by Spanish and international intellectual and industrial property law.</p>
<p>Reproduction, distribution, public communication or modification is prohibited without the owner’s express written authorisation, except for personal and private use.</p>
<h2>5. Liability</h2>
<p>${c.name} is not liable for:</p>
<ul>
  <li>Errors or omissions in the content, or for the content not being up to date at all times.</li>
  <li>Interruptions, technical faults or unavailability of the Website.</li>
  <li>Damage caused by viruses or other harmful elements, provided reasonable security measures have been taken.</li>
  <li>The use users make of the published information.</li>
</ul>
<h2>6. Third-party links</h2>
<p>The Website may contain links to third-party pages. ${c.name} does not control or take responsibility for their content, policies or practices. Including a link does not imply a recommendation or any relationship with the owner of the linked page.</p>
<p>If you find a link leading to unlawful content, you can report it to ${c.email}.</p>
<h2>7. Data protection and cookies</h2>
<p>The processing of personal data is governed by the <a href="{privacy}">Privacy Policy</a> and the use of cookies by the <a href="{cookies}">Cookie Policy</a>, both available on this Website.</p>
<h2>8. Changes</h2>
<p>${c.name} reserves the right to change the content of the Website and of this Legal Notice at any time without prior notice. We recommend reviewing it periodically.</p>
<h2>9. Governing law and jurisdiction</h2>
<p>This Legal Notice is governed by Spanish law. For any dispute, the parties submit to the courts of Valencia, unless applicable law provides otherwise (in particular, where the user is a consumer, the courts of their place of residence will be competent).</p>`,
    },
  },

  privacidad: {
    slug: { es: 'privacidad', en: 'en/privacy' },
    title: { es: 'Política de privacidad', en: 'Privacy policy' },
    body: {
      es: (c) => `
<h2>1. Responsable del tratamiento</h2>
<table>
  <tr><th>Identidad</th><td>${c.name}</td></tr>
  <tr><th>CIF</th><td>${c.cif}</td></tr>
  <tr><th>Dirección</th><td>${c.address}</td></tr>
  <tr><th>Correo electrónico</th><td>${c.email}</td></tr>
  <tr><th>Teléfono</th><td>${c.phone}</td></tr>
</table>
<p>Esta política se ha elaborado conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</p>
<h2>2. Qué datos recogemos, para qué y con qué base legal</h2>
<table>
  <tr><th>Finalidad</th><th>Datos tratados</th><th>Base legal</th><th>Plazo de conservación</th></tr>
  <tr><td>Atender consultas enviadas mediante el formulario de contacto, email o teléfono</td><td>Nombre, email, teléfono, contenido del mensaje y datos de la calculadora</td><td>Consentimiento del interesado (art. 6.1.a RGPD)</td><td>Durante el tiempo necesario para atender la consulta y, después, durante los plazos legales de prescripción</td></tr>
  <tr><td>Prestación de servicios y gestión de clientes, incluidos los pedidos hechos con el enlace de pedidos del cliente</td><td>Datos identificativos, de contacto y de facturación; datos del encargo (por ejemplo, del inmueble) y documentos que nos envíes</td><td>Ejecución de un contrato (art. 6.1.b RGPD)</td><td>Duración de la relación contractual y, después, los plazos legales aplicables</td></tr>
${c.crm ? `  <tr><td>Responder a tus preguntas con el asistente automático (chat) de la web y mejorar sus respuestas</td><td>Las preguntas y respuestas de la conversación, la página y el idioma, y un identificador cifrado de tu conexión que solo sirve para limitar el número de preguntas. No guardamos tu dirección IP.</td><td>Consentimiento del interesado, al usar voluntariamente el asistente (art. 6.1.a RGPD)</td><td>12 meses; después se borran automáticamente</td></tr>
` : ''}  <tr><td>Cumplimiento de obligaciones fiscales y contables</td><td>Datos de facturación</td><td>Obligación legal (art. 6.1.c RGPD)</td><td>Mínimo 6 años (Código de Comercio) y hasta 4 años (normativa tributaria)</td></tr>
</table>
<p>No enviamos comunicaciones comerciales sin tu consentimiento expreso, no usamos herramientas de analítica web y no tomamos decisiones automatizadas ni elaboramos perfiles con tus datos.</p>
<h2>3. Veracidad de los datos</h2>
<p>El usuario garantiza que los datos facilitados son veraces y se compromete a comunicar cualquier modificación. Si facilita datos de terceros (por ejemplo, la persona de contacto para una visita), declara contar con su consentimiento.</p>
<h2>4. Destinatarios de los datos</h2>
<p>Tus datos no se cederán a terceros salvo obligación legal. Podrán acceder a ellos proveedores que prestan servicios a ${c.name} en calidad de encargados del tratamiento, con los que se ha suscrito el contrato exigido por el artículo 28 RGPD:</p>
<ul>
  ${proveedores.es(c)}
</ul>
<h2>5. Transferencias internacionales</h2>
<p>Algunos proveedores pueden estar ubicados fuera del Espacio Económico Europeo (por ejemplo, en EE. UU.). En esos casos, las transferencias se amparan en el Marco de Privacidad de Datos UE-EE. UU., en cláusulas contractuales tipo aprobadas por la Comisión Europea u otra garantía adecuada conforme al RGPD.</p>
<h2>6. Tus derechos</h2>
<p>Puedes ejercer en cualquier momento los siguientes derechos:</p>
<ul>
  <li><strong>Acceso:</strong> conocer qué datos tuyos tratamos.</li>
  <li><strong>Rectificación:</strong> corregir datos inexactos.</li>
  <li><strong>Supresión:</strong> solicitar que eliminemos tus datos.</li>
  <li><strong>Oposición:</strong> oponerte al tratamiento en determinadas circunstancias.</li>
  <li><strong>Limitación:</strong> solicitar que se restrinja el tratamiento.</li>
  <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado y de uso común.</li>
  <li><strong>Retirada del consentimiento:</strong> en cualquier momento, sin que afecte a la licitud del tratamiento previo.</li>
</ul>
<p>Para ejercerlos, escribe a ${c.email} o a ${c.address}, indicando el derecho que deseas ejercer y adjuntando una copia de tu DNI o documento equivalente.</p>
<p>Si consideras que tus derechos no han sido atendidos correctamente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" rel="noopener">www.aepd.es</a>), C/ Jorge Juan, 6, 28001 Madrid.</p>
<h2>7. Medidas de seguridad</h2>
<p>${c.name} aplica las medidas técnicas y organizativas adecuadas para garantizar un nivel de seguridad acorde al riesgo y evitar la alteración, pérdida, tratamiento o acceso no autorizado a tus datos. Entre ellas: conexión cifrada (HTTPS), acceso al CRM solo con usuario y contraseña, y almacenamiento privado de los documentos que nos envías.</p>
<h2>8. Menores de edad</h2>
<p>Este Sitio Web no está dirigido a menores de 14 años. Si eres menor de esa edad, necesitas el consentimiento de tus padres o tutores para facilitarnos datos personales.</p>
<h2>9. Modificaciones</h2>
<p>Esta política puede actualizarse para adaptarse a cambios legislativos o del servicio. La versión vigente será siempre la publicada en esta página.</p>`,
      en: (c) => `${TRADUCCION}
<h2>1. Data controller</h2>
<table>
  <tr><th>Identity</th><td>${c.name}</td></tr>
  <tr><th>Tax ID (CIF)</th><td>${c.cif}</td></tr>
  <tr><th>Address</th><td>${c.address}</td></tr>
  <tr><th>Email</th><td>${c.email}</td></tr>
  <tr><th>Phone</th><td>${c.phone}</td></tr>
</table>
<p>This policy has been drawn up in accordance with Regulation (EU) 2016/679 (GDPR) and Spanish Organic Law 3/2018 on Personal Data Protection and Guarantee of Digital Rights (LOPDGDD).</p>
<h2>2. What data we collect, why, and on what legal basis</h2>
<table>
  <tr><th>Purpose</th><th>Data processed</th><th>Legal basis</th><th>Retention period</th></tr>
  <tr><td>Answering enquiries sent through the contact form, email or phone</td><td>Name, email, phone, message content and calculator details</td><td>Consent of the data subject (Art. 6(1)(a) GDPR)</td><td>As long as needed to answer the enquiry and then for the statutory limitation periods</td></tr>
  <tr><td>Providing services and managing clients, including orders placed with the client’s order link</td><td>Identification, contact and billing data; details of the job (for example, the property) and documents you send us</td><td>Performance of a contract (Art. 6(1)(b) GDPR)</td><td>For the duration of the contract and then for the applicable statutory periods</td></tr>
${c.crm ? `  <tr><td>Answering your questions with the website’s automated assistant (chat) and improving its answers</td><td>The questions and answers in the conversation, the page and language, and an encrypted identifier of your connection used only to limit the number of questions. We do not store your IP address.</td><td>Consent of the data subject, by voluntarily using the assistant (Art. 6(1)(a) GDPR)</td><td>12 months; then deleted automatically</td></tr>
` : ''}  <tr><td>Meeting tax and accounting obligations</td><td>Billing data</td><td>Legal obligation (Art. 6(1)(c) GDPR)</td><td>At least 6 years (Commercial Code) and up to 4 years (tax law)</td></tr>
</table>
<p>We do not send marketing without your express consent, we do not use web analytics tools, and we do not make automated decisions or build profiles from your data.</p>
<h2>3. Accuracy of data</h2>
<p>Users guarantee that the data they provide is accurate and agree to report any changes. If you provide data about third parties (for example, the contact person for a visit), you confirm you have their consent.</p>
<h2>4. Recipients</h2>
<p>Your data will not be passed to third parties unless legally required. Providers that offer services to ${c.name} as data processors, with whom the contract required by Article 28 GDPR has been signed, may access it:</p>
<ul>
  ${proveedores.en(c)}
</ul>
<h2>5. International transfers</h2>
<p>Some providers may be located outside the European Economic Area (for example, in the USA). In those cases, transfers rely on the EU-US Data Privacy Framework, standard contractual clauses approved by the European Commission or another appropriate safeguard under the GDPR.</p>
<h2>6. Your rights</h2>
<p>You can exercise the following rights at any time:</p>
<ul>
  <li><strong>Access:</strong> find out what data about you we process.</li>
  <li><strong>Rectification:</strong> correct inaccurate data.</li>
  <li><strong>Erasure:</strong> ask us to delete your data.</li>
  <li><strong>Objection:</strong> object to processing in certain circumstances.</li>
  <li><strong>Restriction:</strong> ask us to restrict processing.</li>
  <li><strong>Portability:</strong> receive your data in a structured, commonly used format.</li>
  <li><strong>Withdrawal of consent:</strong> at any time, without affecting the lawfulness of prior processing.</li>
</ul>
<p>To exercise them, write to ${c.email} or to ${c.address}, stating the right you wish to exercise and enclosing a copy of your ID card or equivalent document.</p>
<p>If you believe your rights have not been properly respected, you can file a complaint with the Spanish Data Protection Agency (<a href="https://www.aepd.es" rel="noopener">www.aepd.es</a>), C/ Jorge Juan, 6, 28001 Madrid.</p>
<h2>7. Security measures</h2>
<p>${c.name} applies appropriate technical and organisational measures to ensure a level of security suited to the risk and to prevent alteration, loss, processing or unauthorised access to your data. These include an encrypted connection (HTTPS), CRM access only with username and password, and private storage of the documents you send us.</p>
<h2>8. Minors</h2>
<p>This Website is not aimed at children under 14. If you are under that age, you need your parents’ or guardians’ consent to provide us with personal data.</p>
<h2>9. Changes</h2>
<p>This policy may be updated to reflect changes in legislation or in the service. The version in force will always be the one published on this page.</p>`,
    },
  },

  cookies: {
    slug: { es: 'cookies', en: 'en/cookies' },
    title: { es: 'Política de cookies', en: 'Cookie policy' },
    body: {
      es: () => `
<h2>1. Qué son las cookies</h2>
<p>Las cookies son pequeños archivos que se almacenan en tu dispositivo al visitar una web y permiten recordar tus preferencias o analizar tu navegación. Esta política se aplica también a tecnologías similares, como el almacenamiento local del navegador.</p>
<h2>2. Cookies que utiliza este sitio web</h2>
<p>Este sitio web <strong>no utiliza cookies de analítica, publicidad ni redes sociales</strong>, y no carga contenido de terceros que las instale: las tipografías y el resto de archivos se sirven desde el propio sitio. Solo usa este almacenamiento técnico:</p>
<table>
  <tr><th>Nombre</th><th>Titular</th><th>Finalidad</th><th>Duración</th><th>Tipo</th></tr>
  <tr><td>vt-lang</td><td>Propia</td><td>Recordar el idioma elegido (español o inglés)</td><td>Hasta que lo borres</td><td>Técnica (almacenamiento local, exenta de consentimiento)</td></tr>
  <tr><td>vt-chat-…</td><td>Propia</td><td>Mantener la conversación con el asistente mientras navegas por la página</td><td>Se borra al cerrar la pestaña</td><td>Técnica (almacenamiento de sesión, exenta de consentimiento)</td></tr>
</table>
<p>Al ser estrictamente necesaria, está exenta del deber de consentimiento según el artículo 22.2 de la LSSI-CE. Por eso la web no muestra un banner de cookies. Si en el futuro se añaden cookies de analítica o publicidad, se pedirá tu consentimiento antes de instalarlas, con opción de aceptar y rechazar con la misma facilidad.</p>
<h2>3. Cómo gestionar o eliminar las cookies</h2>
<p>Puedes bloquearlas o eliminarlas desde tu navegador. La web seguirá funcionando, aunque no recordará el idioma elegido:</p>
<ul>
  <li><strong>Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies</li>
  <li><strong>Firefox:</strong> Ajustes &gt; Privacidad y seguridad</li>
  <li><strong>Safari:</strong> Preferencias &gt; Privacidad</li>
  <li><strong>Edge:</strong> Configuración &gt; Cookies y permisos del sitio</li>
</ul>`,
      en: () => `${TRADUCCION}
<h2>1. What cookies are</h2>
<p>Cookies are small files stored on your device when you visit a website that let it remember your preferences or analyse your browsing. This policy also covers similar technologies, such as the browser’s local storage.</p>
<h2>2. Cookies used on this website</h2>
<p>This website <strong>does not use analytics, advertising or social media cookies</strong>, and does not load third-party content that sets them: fonts and all other files are served from the site itself. It only uses this technical storage:</p>
<table>
  <tr><th>Name</th><th>Owner</th><th>Purpose</th><th>Duration</th><th>Type</th></tr>
  <tr><td>vt-lang</td><td>First party</td><td>Remembers the chosen language (Spanish or English)</td><td>Until you clear it</td><td>Technical (local storage, exempt from consent)</td></tr>
  <tr><td>vt-chat-…</td><td>First party</td><td>Keeps your conversation with the assistant while you browse the page</td><td>Deleted when you close the tab</td><td>Technical (session storage, exempt from consent)</td></tr>
</table>
<p>As it is strictly necessary, it is exempt from the consent requirement under Article 22.2 of Spain’s LSSI-CE, which is why the website shows no cookie banner. If analytics or advertising cookies are added in the future, your consent will be requested before setting them, with the option to accept or reject just as easily.</p>
<h2>3. How to manage or delete cookies</h2>
<p>You can block or delete them in your browser. The website will still work, but won’t remember your language choice:</p>
<ul>
  <li><strong>Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies</li>
  <li><strong>Firefox:</strong> Settings &gt; Privacy &amp; Security</li>
  <li><strong>Safari:</strong> Preferences &gt; Privacy</li>
  <li><strong>Edge:</strong> Settings &gt; Cookies and site permissions</li>
</ul>`,
    },
  },
};
