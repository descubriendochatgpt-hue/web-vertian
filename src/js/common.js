// Comportamiento común: menú móvil, idioma, formulario de contacto y dictado por voz.
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
          _template: 'table',
          _captcha: 'false'
        })
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (j) {
          if (!res.ok || String(j.success) === 'false') throw new Error(j.message || res.status);
        });
      }).then(function () {
        say('sent', F.sent);
        ['nombre', 'email', 'telefono', 'mensaje'].forEach(function (k) { f[k].value = ''; });
        f.privacidad.checked = false;
      }).catch(function () {
        say('error', F.fail);
      }).then(function () { submit.disabled = false; });
    });
  }

  // --- Dictado por voz (Web Speech API) ---
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  VT.voiceLang = D.lang === 'en' ? 'en-GB' : 'es-ES';
  VT.listen = function (opts) {
    if (!SR) { opts.unsupported && opts.unsupported(); return null; }
    var rec = new SR();
    rec.lang = VT.voiceLang; rec.interimResults = true; rec.continuous = false;
    rec.onresult = function (e) {
      var t = ''; for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      opts.result(t);
    };
    rec.onerror = function (e) { opts.error && opts.error(e.error); };
    rec.onend = function () { opts.end && opts.end(); };
    rec.start();
    opts.start && opts.start();
    return rec;
  };

  var dictBtn = document.querySelector('[data-dictate]');
  if (dictBtn && form) {
    var label = dictBtn.querySelector('[data-dictate-label]');
    var rec = null;
    var stop = function () {
      rec = null; dictBtn.setAttribute('aria-pressed', 'false'); label.textContent = D.dictate.dictate;
    };
    dictBtn.addEventListener('click', function () {
      if (rec) { rec.stop(); return; }
      var ta = form.elements.mensaje, before = ta.value;
      rec = VT.listen({
        start: function () { dictBtn.setAttribute('aria-pressed', 'true'); label.textContent = D.dictate.stop; },
        result: function (t) { ta.value = (before ? before + ' ' : '') + t; },
        end: stop,
        error: stop,
        unsupported: function () { form.querySelector('[data-status]').textContent = D.form.noVoice; }
      });
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
