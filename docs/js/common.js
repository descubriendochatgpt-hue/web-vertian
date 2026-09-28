// Comportamiento común: menú móvil, idioma y formulario de contacto.
(function () {
  'use strict';

  var dataEl = document.getElementById('vt-data');
  var D = dataEl ? JSON.parse(dataEl.textContent) : {};
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Idioma: se recuerda solo para la redirección de la raíz ---
  document.querySelectorAll('[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('vt-lang', a.getAttribute('data-lang')); } catch (e) {}
    });
  });

  // --- Menú móvil ---
  var header = document.querySelector('.site-header');
  var menuBtn = document.querySelector('.menu-btn');
  if (header && menuBtn) {
    var setMenu = function (open) {
      header.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    };
    menuBtn.addEventListener('click', function () { setMenu(!header.classList.contains('open')); });
    document.querySelectorAll('.mobile-nav a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // --- Formulario ---
  var form = document.querySelector('[data-contact-form]');
  var VT = window.VT = { data: D, reduceMotion: reduceMotion };

  // Lleva los datos de una calculadora al formulario y baja hasta él.
  VT.prefill = function (servicio, mensaje) {
    if (!form) return;
    var sel = form.elements.servicio;
    for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === servicio) sel.selectedIndex = i;
    form.elements.mensaje.value = mensaje;
    var el = document.getElementById('contacto');
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(function () { form.elements.nombre.focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
  };

  if (form) {
    var status = form.querySelector('[data-status]');
    var submit = form.querySelector('[type=submit]');
    var F = D.form || {};
    var say = function (kind, msg) { status.className = 'status' + (kind ? ' ' + kind : ''); status.textContent = msg; };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      if (f.web.value) { say('sent', F.sent); return; } // trampa para bots
      if (!f.nombre.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) { say('error', F.check); return; }
      if (!f.privacidad.checked) { say('error', F.privacy); return; }
      say('', F.sending);
      submit.disabled = true;
      fetch(D.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nombre: f.nombre.value.trim(),
          email: f.email.value.trim(),
          telefono: f.telefono.value.trim(),
          servicio: f.servicio.value,
          mensaje: f.mensaje.value,
          pagina: D.page,
          idioma: D.lang,
          privacidad: 'aceptada',
          _subject: F.subject + ' · ' + D.page,
          // Confirmación automática al correo que ha escrito el cliente.
          _autoresponse: F.autoreply
            .replace('{nombre}', f.nombre.value.trim())
            .replace('{servicio}', f.servicio.value)
            .replace('{correo}', D.contactEmail),
          _template: 'table',
          _captcha: 'false'
        })
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (j) {
          if (!res.ok || String(j.success) === 'false') throw new Error(j.message || 'HTTP ' + res.status);
        });
      }).then(function () {
        say('sent', F.sent);
        ['nombre', 'email', 'telefono', 'mensaje'].forEach(function (k) { f[k].value = ''; });
        f.privacidad.checked = false;
      }).catch(function (err) {
        // El motivo queda en la consola del navegador para poder diagnosticarlo.
        if (window.console) console.error('Formulario no enviado:', err && err.message);
        say('error', /activat/i.test(err && err.message) ? F.activation : F.fail);
      }).then(function () { submit.disabled = false; });
    });
  }

  // Ejecuta fn una vez cuando el elemento entra en pantalla.
  VT.onVisible = function (el, fn, threshold) {
    if (!el) return;
    if (reduceMotion || !('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) {
      // También si ya quedó por encima (p. ej. al saltar directamente a #contacto).
      if (es.some(function (e) { return e.isIntersecting || e.boundingClientRect.bottom < 0; })) { io.disconnect(); fn(); }
    }, { threshold: threshold || 0.2 });
    io.observe(el);
  };

  // Números con separador de miles también en cifras de 4 dígitos (1.900 / 1,900).
  VT.num = function (n, dec) {
    var parts = Number(n).toFixed(dec || 0).split('.');
    var es = D.lang !== 'en';
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, es ? '.' : ',');
    return parts.join(es ? ',' : '.');
  };
  VT.eur = function (n) {
    return D.lang === 'en' ? '€' + VT.num(Math.round(n)) : VT.num(Math.round(n)) + ' €';
  };
})();
