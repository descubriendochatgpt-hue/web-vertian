# Web de VERTIAN SOLUTIONS

Web estática en español e inglés con cuatro páginas de servicio, sacadas del diseño de Claude Design:

| Página | Español | Inglés |
|---|---|---|
| Certificados energéticos Gijón | `/certificado-energetico-gijon/` | `/en/energy-certificate-gijon/` |
| Certificados energéticos Alzira | `/certificado-energetico-alzira/` | `/en/energy-certificate-alzira/` |
| Marketing de afiliados | `/marketing-de-afiliados/` | `/en/affiliate-marketing/` |
| Apps y automatización con IA | `/apps-automatizacion-ia/` | `/en/apps-ai-automation/` |

También lleva aviso legal, política de privacidad y política de cookies en los dos idiomas. La raíz (`/`) redirige a la página de Gijón en el idioma del visitante.

## Cómo está organizada

```
src/                  ← lo que se edita
  site.config.mjs     ← dominio, correo del formulario y DATOS DE LA EMPRESA
  content/            ← todos los textos (español e inglés juntos)
  css/site.css        ← estilos
  js/                 ← menú, formulario y calculadoras
  assets/img/         ← logo, favicon y fotos
build.mjs             ← genera la web
docs/                 ← la web ya generada (esto es lo que se publica)
```

Después de cualquier cambio en `src/`, ejecuta:

```
node build.mjs
```

Solo necesita Node.js 18 o superior, sin instalar nada más.

## Pendiente de rellenar

1. **Datos de empresa** en `src/site.config.mjs`: CIF, domicilio, registro mercantil, teléfono, correo público, seguro de RC y año de fundación. Mientras estén vacíos, la web muestra `[pendiente]` en amarillo.
2. **Personas**: nombre, titulación y biografía de cada responsable, en `person` dentro de cada archivo de `src/content/`.
3. **Fotos**: guarda cada foto en `src/assets/img/` con el nombre de su hueco y ejecuta el build. Se muestran en blanco y negro, como en el diseño.
   - `gijon-hero.jpg`, `gijon-explica.jpg`, `gijon-tecnico.jpg`
   - `alzira-hero.jpg`, `alzira-explica.jpg`, `alzira-tecnico.jpg`
   - `afiliados-hero.jpg`, `afiliados-explica.jpg`, `afiliados-responsable.jpg`
   - `ia-hero.jpg`, `ia-explica.jpg`, `ia-responsable.jpg`
   - Opcional, para compartir en redes (1200×630): `og-gijon.jpg`, `og-alzira.jpg`, `og-afiliados.jpg`, `og-ia.jpg`
4. **Precios**: son las cifras de ejemplo del diseño y aparecen marcadas como «pendientes de confirmar». Los de las calculadoras están en `js` dentro de cada archivo de `src/content/`.
5. **Opiniones**: los tres huecos por página están reservados hasta que haya reseñas reales.
6. **Dominio**: cuando lo compres, cambia `url` en `src/site.config.mjs` (lo usan el canonical, el sitemap y las etiquetas para redes).
7. **Textos legales**: son una base razonable, pero conviene que los revise un asesor antes de publicar.

## Formulario de contacto

Los formularios envían las solicitudes a **vertianmail@gmail.com** mediante [FormSubmit](https://formsubmit.co), un servicio gratuito que no necesita servidor.

- **La primera vez** que alguien envíe el formulario desde la web publicada, llegará a vertianmail@gmail.com un correo de FormSubmit para activarlo. Hay que pulsar el enlace; hasta entonces no llegan las solicitudes.
- Cada solicitud llega con nombre, correo, teléfono, servicio, mensaje (incluidos los datos de la calculadora), página e idioma.
- Tras activarlo, FormSubmit te da un alias aleatorio. Si lo pones en `formEmail` de `src/site.config.mjs`, tu correo deja de aparecer en el código de la web.

## Publicar

La carpeta `docs/` es la web completa. Opciones gratuitas:

- **GitHub Pages**: en el repositorio, *Settings → Pages → Deploy from a branch*, rama `main` y carpeta `/docs`. Después puedes conectar tu dominio en la misma pantalla.
- **Netlify** o **Vercel**: importa el repositorio y pon `docs` como carpeta de publicación (sin comando de build, o `node build.mjs` si quieres que la genere él).

## Notas técnicas

- Las tipografías (Schibsted Grotesk y JetBrains Mono, licencia OFL) se sirven desde la propia web: no se conecta con Google y no hacen falta cookies ni banner.
- El dictado por voz de las páginas de certificados usa el reconocimiento de voz del navegador (Chrome, Edge, Safari). Donde no existe, se avisa y se pueden tocar las opciones.
- Se respeta «reducir movimiento» del sistema y la web se adapta al móvil.
