// Calculadora de ahorro y amortización (página de apps e IA).
(function () {
  'use strict';
  var VT = window.VT, D = VT.data, I = D.i18n;
  var calc = document.querySelector('[data-ia-calc]');
  if (!calc) return;
  var $ = function (s) { return calc.querySelector(s); };
  var S = { sel: ['pres', 'fact', 'datos'], personas: 2, tarifa: 22, on: false };

  function compute() {
    var tareas = D.tasks.filter(function (t) { return S.sel.indexOf(t.id) > -1; });
    var horas = Math.round(tareas.reduce(function (a, t) { return a + t.h; }, 0) * S.personas * D.auto);
    var ahorro = horas * S.tarifa;
    var coste = tareas.length ? D.base + D.perTask * (tareas.length - 1) : 0;
    var meses = ahorro > 0 ? Math.ceil(coste / ahorro) : 0;
    return { tareas: tareas, horas: horas, ahorro: ahorro, coste: coste, meses: meses };
  }

  function render() {
    var c = compute();
    var top = Math.max(c.coste * 1.6, c.ahorro * 12, 1);
    Array.prototype.forEach.call(calc.querySelectorAll('[data-task]'), function (b) {
      b.setAttribute('aria-pressed', String(S.sel.indexOf(b.dataset.task) > -1));
    });
    $('[data-people-label]').textContent = S.personas;
    $('[data-rate-label]').textContent = VT.eur(S.tarifa);
    $('[data-months]').textContent = c.tareas.length ? c.meses : '–';
    $('[data-months-label]').textContent = c.meses === 1 ? I.month : I.months;
    $('[data-hours]').textContent = c.horas + ' h';
    $('[data-saving]').textContent = VT.eur(c.ahorro);
    $('[data-cost]').textContent = c.coste ? VT.eur(c.coste) : '–';
    var line = (c.coste / top * 100) + '%';
    $('[data-cost-line]').style.bottom = line;
    $('[data-cost-line-l]').style.bottom = line;
    Array.prototype.forEach.call(calc.querySelectorAll('[data-cum] .b'), function (b, i) {
      var v = c.ahorro * (i + 1);
      b.style.height = (S.on ? Math.min(100, v / top * 100) : 0) + '%';
      b.style.transitionDelay = (i * 0.03) + 's';
      b.classList.toggle('paid', !!c.coste && v >= c.coste);
    });
  }

  Array.prototype.forEach.call(calc.querySelectorAll('[data-task]'), function (b) {
    b.addEventListener('click', function () {
      var id = b.dataset.task, i = S.sel.indexOf(id);
      if (i > -1) S.sel.splice(i, 1); else S.sel.push(id);
      render();
    });
  });
  $('[data-people]').addEventListener('input', function (e) { S.personas = +e.target.value; render(); });
  $('[data-rate]').addEventListener('input', function (e) { S.tarifa = +e.target.value; render(); });

  $('[data-send]').addEventListener('click', function () {
    var c = compute();
    var msg = I.msgHead +
      '\n· ' + I.msgTasks + ': ' + (c.tareas.map(function (t) { return t.label; }).join(', ') || '—') +
      '\n· ' + I.msgPeople + ': ' + S.personas +
      '\n· ' + I.msgRate + ': ' + VT.eur(S.tarifa) +
      '\n· ' + I.msgHours + ': ' + c.horas + ' h' +
      '\n· ' + I.msgPayback + ': ' + c.meses + ' ' + (c.meses === 1 ? I.month : I.months);
    VT.prefill(I.assessment, msg);
  });

  render();
  VT.onVisible(calc, function () { S.on = true; render(); });
})();
