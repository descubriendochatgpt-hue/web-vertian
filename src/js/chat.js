// Asistente (chat) de la página: pregunta al CRM, que responde con Claude y la base de conocimiento de la página.
// Solo aparece si el CRM dice que el asistente está activo.
(function () {
  'use strict';

  var D = (window.VT && window.VT.data) || {};
  var C = D.chat;
  if (!C || !window.fetch) return;
  var I = C.i18n;
  var CLAVE = 'vt-chat-' + C.asistente;

  // Lo hablado en esta pestaña (se pierde al cerrarla)
  var estado = { conversacion: null, mensajes: [] };
  try { estado = JSON.parse(sessionStorage.getItem(CLAVE)) || estado; } catch (e) {}
  var guardar = function () { try { sessionStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) {} };

  var esc = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  // Texto del asistente: negritas, saltos de línea, correos y teléfonos con enlace
  var formato = function (t) {
    return esc(t)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, '<a href="mailto:$1">$1</a>')
      .replace(/(\+34[\s\d]{9,13}\d)/g, function (m) { return '<a href="tel:' + m.replace(/\s/g, '') + '">' + m + '</a>'; })
      .replace(/\n/g, '<br>');
  };
  var textoFallo = function () { return I.fail.replace('{correo}', D.contactEmail || '').replace('{tel}', C.tel || ''); };

  var boton, panel, lista, campo, enviar, sugerencias, abierto = false, ocupado = false;

  function crear() {
    boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'chat-btn';
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-controls', 'vt-chat');
    boton.innerHTML = '<span class="chat-dot" aria-hidden="true"></span>' + esc(I.open);

    panel = document.createElement('section');
    panel.id = 'vt-chat';
    panel.className = 'chat';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', I.title);
    panel.innerHTML =
      '<header class="chat-head"><div><p class="chat-title">' + esc(I.title) + '</p><p class="chat-tag">' + esc(I.tag) + '</p></div>' +
      '<button type="button" class="chat-x" aria-label="' + esc(I.close) + '">×</button></header>' +
      '<div class="chat-log" aria-live="polite"></div>' +
      '<div class="chat-sug"></div>' +
      '<form class="chat-form"><label class="sr-only" for="vt-chat-q">' + esc(I.placeholder) + '</label>' +
      '<input id="vt-chat-q" name="q" maxlength="800" autocomplete="off" placeholder="' + esc(I.placeholder) + '">' +
      '<button type="submit">' + esc(I.send) + '</button></form>' +
      '<p class="chat-note">' + esc(I.notice) + ' <a href="' + esc(C.privacidad) + '">' + esc(I.privacy) + '</a> · <a href="#contacto" data-humano>' + esc(I.contact) + '</a></p>';

    lista = panel.querySelector('.chat-log');
    campo = panel.querySelector('input');
    enviar = panel.querySelector('.chat-form button');
    sugerencias = panel.querySelector('.chat-sug');

    (C.sugerencias || []).forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = s;
      b.addEventListener('click', function () { preguntar(s); });
      sugerencias.appendChild(b);
    });

    burbuja('asistente', I.hello);
    estado.mensajes.forEach(function (m) { burbuja(m.rol, m.texto); });
    sugerencias.hidden = estado.mensajes.length > 0;

    boton.addEventListener('click', function () { mostrar(!abierto); });
    panel.querySelector('.chat-x').addEventListener('click', function () { mostrar(false); });
    panel.querySelector('[data-humano]').addEventListener('click', function () { mostrar(false); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') mostrar(false); });
    panel.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      preguntar(campo.value);
    });

    document.body.appendChild(panel);
    document.body.appendChild(boton);
    document.documentElement.classList.add('tiene-chat');
  }

  function mostrar(si) {
    abierto = si;
    panel.hidden = !si;
    boton.setAttribute('aria-expanded', String(si));
    document.documentElement.classList.toggle('chat-abierto', si);
    if (si) { bajar(); campo.focus(); } else boton.focus();
  }

  function burbuja(rol, texto) {
    var p = document.createElement('p');
    p.className = 'chat-msg ' + (rol === 'usuario' ? 'yo' : 'bot');
    if (rol === 'usuario') p.textContent = texto; else p.innerHTML = formato(texto);
    lista.appendChild(p);
    bajar();
    return p;
  }
  function bajar() { lista.scrollTop = lista.scrollHeight; }

  function preguntar(texto) {
    texto = String(texto || '').trim();
    if (!texto || ocupado) return;
    ocupado = true;
    enviar.disabled = true;
    campo.value = '';
    sugerencias.hidden = true;
    burbuja('usuario', texto);
    var p = burbuja('asistente', '');
    p.classList.add('escribiendo');
    p.textContent = I.writing;

    var terminar = function (respuesta, guardarla) {
      p.classList.remove('escribiendo');
      p.innerHTML = formato(respuesta);
      if (guardarla) {
        estado.mensajes.push({ rol: 'usuario', texto: texto }, { rol: 'asistente', texto: respuesta });
        estado.mensajes = estado.mensajes.slice(-40);
        guardar();
      }
      ocupado = false;
      enviar.disabled = false;
      bajar();
      if (abierto) campo.focus();
    };

    fetch(C.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asistente: C.asistente, conversacion: estado.conversacion, pregunta: texto, pagina: D.page, idioma: D.lang })
    }).then(function (res) {
      if (!res.ok) {
        return res.json().catch(function () { return {}; }).then(function (j) { terminar(j.mensaje || textoFallo(), false); });
      }
      var id = res.headers.get('x-conversacion');
      if (id) { estado.conversacion = id; guardar(); }
      // Respuesta según se escribe (si el navegador no puede, llega entera)
      if (!res.body || !res.body.getReader || !window.TextDecoder) return res.text().then(function (t) { terminar(t, true); });
      var lector = res.body.getReader(), dec = new TextDecoder(), acumulado = '';
      var leer = function () {
        return lector.read().then(function (r) {
          if (r.done) { terminar(acumulado.trim() || textoFallo(), !!acumulado.trim()); return; }
          acumulado += dec.decode(r.value, { stream: true });
          p.classList.remove('escribiendo');
          p.innerHTML = formato(acumulado);
          bajar();
          return leer();
        });
      };
      return leer();
    }).catch(function () {
      terminar(textoFallo(), false);
    });
  }

  // Se pregunta al CRM si el asistente está activo, sin retrasar la carga de la página
  var comprobar = function () {
    fetch(C.endpoint + '?asistente=' + encodeURIComponent(C.asistente))
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (j) { if (j.activo) crear(); })
      .catch(function () { /* sin CRM, sin chat */ });
  };
  if ('requestIdleCallback' in window) requestIdleCallback(comprobar, { timeout: 3000 }); else setTimeout(comprobar, 1500);
})();
