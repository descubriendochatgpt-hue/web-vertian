# Conectar el formulario con Supabase

Con esto, cada solicitud de la web:

1. se guarda en la tabla **solicitudes** de tu proyecto de Supabase,
2. te llega un aviso a vertianmail@gmail.com (si respondes, le contestas directamente al cliente),
3. y el cliente recibe una confirmación en su idioma, enviada desde vertianmail@gmail.com.

Son cuatro pasos. Todo se hace desde el navegador, sin instalar nada.

## 1. Proyecto de Supabase

Si aún no lo tienes, crea uno en [supabase.com](https://supabase.com). Elige una **región de la Unión Europea** (por ejemplo *Frankfurt* o *Paris*): la política de privacidad de la web dice que los datos están en la UE.

## 2. Crear la tabla

En el panel del proyecto: **SQL Editor → New query**. Pega todo el contenido de `migrations/20260928000000_solicitudes.sql` y pulsa **Run**.

La tabla queda protegida: la web no puede leerla, solo añadir solicitudes a través de la función del paso 4.

## 3. Contraseña de aplicación de Gmail

La función envía los correos con tu cuenta de Gmail. Google no deja usar tu contraseña normal para esto, sino una «contraseña de aplicación»:

1. Con vertianmail@gmail.com, entra en [myaccount.google.com/security](https://myaccount.google.com/security) y activa la **Verificación en dos pasos** si no la tienes.
2. Entra en [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), escribe como nombre «Supabase VERTIAN» y pulsa **Crear**.
3. Copia la contraseña de 16 letras que aparece. Solo se muestra una vez.

## 4. Crear la función «contacto»

1. En Supabase: **Edge Functions → Secrets** y añade:
   - `GMAIL_USER` = `vertianmail@gmail.com`
   - `GMAIL_APP_PASSWORD` = la contraseña de 16 letras del paso 3
   - Opcional: `ORIGENES` = las direcciones de tu web separadas por comas (p. ej. `https://tu-sitio.netlify.app,https://www.vertian.es`). Si la dejas vacía, se acepta cualquier web.
2. **Edge Functions → Deploy a new function → Via Editor.** Ponle de nombre exactamente **`contacto`**, borra el código de ejemplo, pega todo el contenido de `functions/contacto/index.ts` y pulsa **Deploy function**.
3. En los ajustes de la función, **desactiva «Verify JWT»** (o «Enforce JWT verification»). La web llama a la función sin iniciar sesión; si esto está activado, rechazará todas las solicitudes.
4. **Pásame la URL del proyecto** (Project Settings → Data API → Project URL, algo como `https://abcdefghijkl.supabase.co`), o ponla tú en `supabaseUrl` de `src/site.config.mjs`.

## Día a día

- **Ver las solicitudes:** Table Editor → **solicitudes**. Una fila por solicitud, las más recientes primero si ordenas por *creado*.
- **Seguimiento:** cambia la columna **estado** («nueva», «presupuestada», «cliente», «descartada»…) y apunta lo que quieras en **notas**.
- **Exportar:** en el Table Editor puedes descargar la tabla como CSV para abrirla en Excel.
- **Si un correo no llega:** Edge Functions → contacto → **Logs** muestra el motivo. La solicitud se guarda igualmente aunque falle el correo.
- **Protección de datos:** la política de privacidad dice que las solicitudes que no acaban en contrato se borran en 12 meses. Bórralas de vez en cuando desde el Table Editor.
- **Límites:** Gmail permite unos 500 correos al día; cada solicitud usa 2. Un mismo correo solo puede enviar 3 solicitudes por hora, para evitar abusos.

## Con la CLI de Supabase (opcional, para desarrolladores)

```
supabase link --project-ref TU_PROYECTO
supabase db push
supabase secrets set GMAIL_USER=vertianmail@gmail.com GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
supabase functions deploy contacto
deno test --allow-env supabase/functions/contacto/   # pruebas
```
