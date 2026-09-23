// Panel de métricas animado con datos de ejemplo (página de afiliados).
(function () {
  'use strict';
  var VT = window.VT, D = VT.data, I = D.i18n;
  var panel = document.querySelector('[data-panel]');
  if (!panel) return;
  var $ = function (s) { return panel.querySelector(s); };
  var S = { k: 0, tick: 0, period: 'mes' };
  var num = VT.num;

  function render() {
    var k = S.k, trim = S.period === 'trim';
    var live = (S.tick * 37) % 140;
    var ING = D.ing, COST = D.cost;
    var ing = trim ? ING[9] + ING[10] + ING[11] + live : ING[11] + live;
    var cost = trim ? COST[9] * 3 : COST[11];
    var clics = Math.round((trim ? 38400 : 13900) + live * 3), conv = trim ? 2.8 : 3.1;
    var prev = trim ? ING[6] + ING[7] + ING[8] : ING[10];
    var max = Math.max.apply(null, ING);
    var pct = D.lang === 'en' ? '%' : ' %';

    var kpis = [
      [I.income, VT.eur(ing * k), '+' + Math.round((ing / prev - 1) * 100) + pct + ' ' + I.vsPrev, false, true],
      [I.cost, VT.eur(cost * k), I.costSub],
      [I.margin, VT.eur((ing - cost) * k), Math.round((1 - cost / ing) * 100) + pct + ' ' + I.marginSub, true],
      [I.clicks, num(Math.round(clics * k)), I.clicksSub],
      [I.conv, num(conv * k, 1) + pct, I.convSub],
      [I.epc, D.lang === 'en' ? '€' + num((ing / clics) * k, 2) : num((ing / clics) * k, 2) + ' €', 'EPC']
    ];
    $('[data-kpis]').innerHTML = kpis.map(function (m) {
      return '<div><div class="k">' + m[0] + '</div><div class="v' + (m[3] ? ' hl' : '') + '">' + m[1] + '</div><div class="d' + (m[4] ? ' hl' : '') + '">' + m[2] + '</div></div>';
    }).join('');

    Array.prototype.forEach.call(panel.querySelectorAll('[data-chart] .m'), function (m, i) {
      m.children[0].style.height = Math.round(ING[i] / max * 100 * k) + '%';
      m.children[1].style.height = Math.round(COST[i] / max * 100 * k) + '%';
      m.children[0].style.transitionDelay = m.children[1].style.transitionDelay = (i * 0.04) + 's';
    });

    Array.prototype.forEach.call(panel.querySelectorAll('[data-progs] tr'), function (tr, i) {
      var sh = D.progs[i][1];
      tr.children[1].textContent = VT.eur(ing * sh * k);
      tr.children[2].textContent = VT.eur((ing - cost) * sh * k);
    });
  }

  Array.prototype.forEach.call(panel.querySelectorAll('[data-period]'), function (b) {
    b.addEventListener('click', function () {
      S.period = b.dataset.period;
      Array.prototype.forEach.call(panel.querySelectorAll('[data-period]'), function (x) { x.setAttribute('aria-selected', String(x === b)); });
      render();
    });
  });

  render();
  VT.onVisible(panel, function () {
    if (VT.reduceMotion) { S.k = 1; render(); return; }
    var t0 = performance.now();
    var step = function (t) {
      var p = Math.min(1, (t - t0) / 1400);
      S.k = 1 - Math.pow(1 - p, 3);
      render();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // Pequeña variación periódica para que el panel parezca en vivo.
    setInterval(function () { S.tick++; render(); }, 2200);
  });
})();
