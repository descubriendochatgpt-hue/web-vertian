# Instalar el formulario con Google (10 minutos)

Con esto, cada solicitud de la web se guarda en una hoja de cálculo de Google, te llega un aviso a vertianmail@gmail.com y el cliente recibe una confirmación enviada desde ese mismo correo.

Hazlo todo con la cuenta **vertianmail@gmail.com**.

1. **Crea la hoja.** Entra en [sheets.google.com](https://sheets.google.com), crea una hoja en blanco y llámala, por ejemplo, «Clientes VERTIAN».
2. **Abre el editor de scripts.** En la hoja: menú *Extensiones → Apps Script*.
3. **Pega el código.** Borra lo que haya en el editor, pega todo el contenido de `Codigo.gs` y pulsa el icono de guardar.
4. **Da los permisos y prueba.** Arriba, en el desplegable de funciones, elige `probar` y pulsa *Ejecutar*. Google pedirá permiso: *Revisar permisos* → elige tu cuenta → *Configuración avanzada* → *Ir a (proyecto sin título)* → *Permitir*. Es tu propio script, por eso Google avisa de que no está verificado.
   - Comprueba que en la hoja aparece la pestaña «Solicitudes» con una fila de prueba y que te han llegado dos correos.
5. **Publícalo.** Botón azul *Implementar → Nueva implementación*. En el engranaje elige *Aplicación web* y pon:
   - *Ejecutar como*: **Yo (vertianmail@gmail.com)**
   - *Quién tiene acceso*: **Cualquier usuario**

   Pulsa *Implementar* y copia la **URL de la aplicación web** (empieza por `https://script.google.com/macros/s/…/exec`).
6. **Pásame esa URL** (o ponla tú en `formEndpoint` de `src/site.config.mjs`). A partir de ahí la web usa este sistema.

## Día a día

- **Todas las solicitudes** están en la pestaña «Solicitudes», una por fila. La columna *Estado* empieza en «Nueva»; cámbiala a mano («Presupuestada», «Cliente», «Descartada»…) para llevar el seguimiento.
- **Para contestar a un cliente**, responde al correo de aviso: la respuesta le llega directamente a él.
- **Protección de datos:** la política de privacidad dice que las solicitudes que no acaban en contrato se borran en 12 meses. Borra esas filas de vez en cuando.
- **Límites de Gmail:** una cuenta gratuita puede enviar unos 100 correos al día con este sistema. Cada solicitud usa 2.

## Si cambias el código más adelante

Después de editar el script: *Implementar → Gestionar implementaciones → lápiz → Versión: Nueva versión → Implementar*. Así la URL sigue siendo la misma.
