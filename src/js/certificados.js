// Calculadora de precio, escala energética y mapa de la zona (páginas de certificados).
(function () {
  'use strict';
  var VT = window.VT, D = VT.data, I = D.i18n;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var norm = function (t) { return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };

  // Recargo por desplazamiento según los tramos [hasta km, €] (null = sin límite).
  var fee = function (km) {
    for (var i = 0; i < D.fee.length; i++) if (D.fee[i][0] === null || km <= D.fee[i][0]) return D.fee[i][1];
    return 0;
  };
  var freeKm = D.fee[0][0];

  var S = { tipo: D.tipos[0].id, sup: 80, zone: D.zones[0].name, motivo: 0, urgente: false, letter: 4, listening: null };

  // ---------- Calculadora ----------
  var calc = $('[data-cert-calc]');
  var supIn = $('[data-sup]', calc), zoneSel = $('[data-zone]', calc);

  function price() {
    var t = D.tipos.filter(function (x) { return x.id === S.tipo; })[0];
    var z = D.zones.filter(function (x) { return x.name === S.zone; })[0];
    var sup = S.tipo === 'edificio' ? 0 : S.sup > 150 ? 40 : S.sup > 100 ? 20 : 0;
    var d = fee(z.km), u = S.urgente ? 30 : 0;
    return { t: t, z: z, base: t.base, sup: sup, d: d, u: u, total: t.base + sup + d + u };
  }

  var supText = function () { return S.tipo === 'edificio' ? I.noSup : S.sup + ' m²'; };

  function render() {
    var p = price();
    $$('[data-tipos] .opt', calc).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.id === S.tipo)); });
    $$('[data-motivo]', calc).forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.motivo === S.motivo)); });
    $$('[data-urgente]', calc).forEach(function (b) { b.setAttribute('aria-pressed', String(!!+b.dataset.urgente === S.urgente)); });
    supIn.value = S.sup;
    supIn.disabled = S.tipo === 'edificio';
    $('[data-sup-label]', calc).textContent = supText();
    zoneSel.value = S.zone;
    $('[data-total]', calc).textContent = p.total;
    var rows = [
      [p.t.label + ' · ' + I.base, p.base + ' €'],
      [I.surface, p.sup ? '+' + p.sup + ' €' : '0 €'],
      [I.travel + ' · ' + p.z.name, p.d ? '+' + p.d + ' €' : I.included],
      [I.term, p.u ? '+' + p.u + ' €' : '0 €']
    ];
    $('[data-breakdown]', calc).innerHTML = rows.map(function (r) {
      return '<div><span class="k">' + r[0] + '</span><span class="v">' + r[1] + '</span></div>';
    }).join('');
    $('[data-summary]', calc).textContent = p.t.code + ' · ' + (S.tipo === 'edificio' ? '—' : S.sup + ' m²') + ' · ' + I.motivos[S.motivo].toUpperCase();
    renderMap();
  }

  $$('[data-tipos] .opt', calc).forEach(function (b) { b.addEventListener('click', function () { S.tipo = b.dataset.id; render(); }); });
  $$('[data-motivo]', calc).forEach(function (b) { b.addEventListener('click', function () { S.motivo = +b.dataset.motivo; render(); }); });
  $$('[data-urgente]', calc).forEach(function (b) { b.addEventListener('click', function () { S.urgente = !!+b.dataset.urgente; render(); }); });
  supIn.addEventListener('input', function () { S.sup = +supIn.value; render(); });
  zoneSel.addEventListener('change', function () { S.zone = zoneSel.value; render(); });

  $('[data-send]', calc).addEventListener('click', function () {
    var p = price();
    var msg = I.msgHead +
      '\n· ' + I.msgType + ': ' + p.t.label +
      '\n· ' + I.surface + ': ' + (S.tipo === 'edificio' ? '—' : S.sup + ' m²') +
      '\n· ' + D.zoneWord + ': ' + p.z.name +
      '\n· ' + I.msgReason + ': ' + I.motivos[S.motivo] +
      '\n· ' + I.msgTerm + ': ' + (S.urgente ? I.msgUrgent : I.msgNormal) +
      '\n· ' + I.msgPrice + ': ' + p.total + ' ' + I.vat;
    VT.prefill(p.t.svc, msg);
  });

  // ---------- Voz ----------
  // Reconoce tipo, superficie, municipio, motivo y urgencia en español o inglés.
  function parseVoice(txt) {
    var s = norm(txt), o = {};
    if (/\b(piso|apartamento|atico|estudio|duplex|flat|apartment|studio)\b/.test(s)) o.tipo = 'piso';
    if (/\b(casa|chalet|unifamiliar|adosad|house|villa|cottage)/.test(s)) o.tipo = 'casa';
    if (/\b(local|oficina|nave|tienda|comercio|office|shop|store|premises)\b/.test(s)) o.tipo = 'local';
    if (/\b(edificio|comunidad|bloque|building|block)\b/.test(s)) o.tipo = 'edificio';
    var m = s.match(/(\d{2,3})\s*(m2|m²|metros|mts|square|sq|m\b)/) || s.match(/(\d{2,3})/);
    if (m) o.sup = Math.max(20, Math.min(400, Math.round(+m[1] / 5) * 5));
    D.zones.forEach(function (z) { if (s.indexOf(norm(z.name)) > -1) o.zone = z.name; });
    D.aliases.forEach(function (a) { if (new RegExp(a[0]).test(s)) o.zone = a[1]; });
    if (/(vend|venta|sell|sale)/.test(s)) o.motivo = 0;
    if (/(alquil|arrend|rent|let\b|lease)/.test(s)) o.motivo = 1;
    if (/(ayuda|subvencion|reforma|rehabilit|grant|renovat|refurb)/.test(s)) o.motivo = 2;
    if (/(urgente|rapido|cuanto antes|esta semana|urgent|asap|quick|this week)/.test(s)) o.urgente = true;
    return o;
  }

  var mic = $('[data-voice]', calc), hint = $('[data-voice-hint]', calc), rec = null;
  var micOff = function () { rec = null; mic.setAttribute('aria-pressed', 'false'); };
  mic.addEventListener('click', function () {
    if (rec) { rec.stop(); return; }
    rec = VT.listen({
      start: function () { mic.setAttribute('aria-pressed', 'true'); hint.textContent = I.listening; },
      result: function (t) {
        hint.textContent = '«' + t + '»';
        var o = parseVoice(t);
        for (var k in o) S[k] = o[k];
        render();
      },
      end: micOff,
      error: function (e) { micOff(); hint.textContent = e === 'not-allowed' ? I.noPerm : I.noUnderstand; },
      unsupported: function () { hint.textContent = I.noVoice; }
    });
  });

  // ---------- Escala de letras ----------
  var lettersEl = $('[data-letters]');
  if (lettersEl) {
    var info = $('[data-letter-info]');
    lettersEl.innerHTML = D.letters.map(function (l, i) {
      return '<button type="button" class="letter" data-i="' + i + '" aria-pressed="false"><span class="bar" style="background:' + l.c + ';color:' + l.fg + '">' + l.k + '</span><span class="mark"></span></button>';
    }).join('');
    var drawLetters = function () {
      $$('.letter', lettersEl).forEach(function (b, i) {
        var on = i === S.letter;
        b.setAttribute('aria-pressed', String(on));
        $('.bar', b).style.width = (34 + i * 9 + (on ? 8 : 0)) + '%';
        $('.mark', b).textContent = on ? '◀ ' + D.letters[i].k : '';
      });
      var L = D.letters[S.letter];
      info.style.borderLeftColor = L.c;
      $('[data-letter-k]', info).textContent = L.k;
      $('[data-letter-t]', info).textContent = L.t;
    };
    $$('.letter', lettersEl).forEach(function (b) {
      b.addEventListener('click', function () { S.letter = +b.dataset.i; drawLetters(); });
    });
    drawLetters();
  }

  // ---------- Zona: tabla y mapa ----------
  var rows = $$('[data-zone-rows] tr');
  D.zones.forEach(function (z, i) {
    var f = fee(z.km), cell = $('.fee', rows[i]);
    cell.textContent = f ? '+' + f + ' €' : I.included;
    if (!f) cell.classList.add('incl');
    $('.fill', rows[i]).style.background = z.km <= freeKm ? 'var(--ac-hi)' : 'rgba(243,244,242,.55)';
  });

  var mapEl = $('[data-zone-map]');
  var NS = 'http://www.w3.org/2000/svg', SC = 9;
  var el = function (tag, attrs, text) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  };
  var svg = el('svg', { viewBox: '-380 -380 760 760', 'aria-hidden': 'true' });
  var rings = [10, 20, 30, 40].map(function (km, i) {
    var L = 2 * Math.PI * km * SC;
    var c = el('circle', { cx: 0, cy: 0, r: km * SC, fill: 'none', stroke: 'rgba(243,244,242,.28)', 'stroke-width': 1, 'stroke-dasharray': L, 'stroke-dashoffset': L });
    c.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1) ' + (i * 0.15) + 's';
    var t = el('text', { x: 4, y: -km * SC - 5, fill: 'rgba(243,244,242,.55)', 'font-size': 10, 'font-family': 'JetBrains Mono, monospace' }, km + ' km');
    t.style.opacity = 0; t.style.transition = 'opacity .6s ' + (0.6 + i * 0.15) + 's';
    svg.appendChild(c); svg.appendChild(t);
    return { c: c, t: t };
  });
  // Zona con desplazamiento incluido
  var freeC = el('circle', { cx: 0, cy: 0, r: freeKm * SC, 'stroke-width': 1.5 });
  freeC.style.fill = 'rgba(var(--ac-rgb),.12)';
  freeC.style.stroke = 'var(--ac-hi)';
  var FL = 2 * Math.PI * freeKm * SC;
  freeC.setAttribute('stroke-dasharray', FL); freeC.setAttribute('stroke-dashoffset', FL);
  freeC.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1) .2s, fill-opacity .6s';
  svg.insertBefore(freeC, svg.firstChild);
  svg.appendChild(el('line', { x1: -400, y1: 0, x2: 400, y2: 0, stroke: 'rgba(243,244,242,.1)' }));
  svg.appendChild(el('line', { x1: 0, y1: -400, x2: 0, y2: 400, stroke: 'rgba(243,244,242,.1)' }));
  D.mapLabels.forEach(function (m) {
    svg.appendChild(el('text', { x: m.x, y: m.y, 'text-anchor': m.a, fill: 'rgba(243,244,242,.4)', 'font-size': 10, 'letter-spacing': 2, 'font-family': 'JetBrains Mono, monospace' }, m.t));
  });
  var nodes = D.zones.map(function (z, i) {
    var x = z.dx * SC, y = z.dy * SC, hub = z.km === 0, d = 0.9 + i * 0.09;
    var g = el('g', {});
    g.style.cssText = 'opacity:0;transform:translateY(6px);transition:opacity .5s ' + d + 's, transform .5s ' + d + 's;cursor:pointer';
    var line = hub ? null : el('line', { x1: 0, y1: 0, x2: x, y2: y, 'stroke-dasharray': '2 3' });
    if (line) g.appendChild(line);
    var s = hub ? 12 : 8;
    var rect = el('rect', { x: x - s / 2, y: y - s / 2, width: s, height: s });
    var label = el('text', { x: x + 10, y: y + 4, 'font-size': hub ? 13 : 11, 'font-family': 'Schibsted Grotesk, sans-serif' }, z.name);
    g.appendChild(rect); g.appendChild(label);
    g.addEventListener('click', function () { S.zone = z.name; render(); });
    svg.appendChild(g);
    return { z: z, g: g, line: line, rect: rect, label: label, hub: hub };
  });
  mapEl.appendChild(svg);

  function renderMap() {
    nodes.forEach(function (n) {
      var sel = n.z.name === S.zone;
      if (n.line) n.line.style.stroke = sel ? 'var(--ac-hi)' : 'rgba(243,244,242,.14)';
      n.rect.style.fill = n.hub ? '#00B4A2' : sel ? 'var(--ac-hi)' : '#F3F4F2';
      n.label.setAttribute('fill', sel || n.hub ? '#fff' : 'rgba(243,244,242,.8)');
      n.label.setAttribute('font-weight', sel || n.hub ? 600 : 400);
    });
  }

  VT.onVisible(mapEl, function () {
    freeC.setAttribute('stroke-dashoffset', 0);
    rings.forEach(function (r) { r.c.setAttribute('stroke-dashoffset', 0); r.t.style.opacity = 1; });
    nodes.forEach(function (n) { n.g.style.opacity = 1; n.g.style.transform = 'none'; });
    D.zones.forEach(function (z, i) { $('.fill', rows[i]).style.width = Math.max(3, z.km / D.barMax * 100) + '%'; });
  }, 0.3);

  render();
})();
