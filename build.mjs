// Genera la web estática en docs/ a partir de src/.
// Uso: node build.mjs   (no necesita dependencias)
import { mkdirSync, writeFileSync, rmSync, cpSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE, COMPANY } from './src/site.config.mjs';
import { resolve, UI, COMPANY_SECTION, REVIEWS, CONTACT, FORM_I18N, PENDING } from './src/content/common.mjs';
import { gijon, alzira } from './src/content/certificados.mjs';
import { afiliados } from './src/content/afiliados.mjs';
import { ia } from './src/content/ia.mjs';
import { LEGAL } from './src/content/legal.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
// VT_PREVIEW=<carpeta> genera una copia para vista previa con enlaces explícitos a index.html.
const PREVIEW = process.env.VT_PREVIEW;
const OUT = PREVIEW ? PREVIEW : join(ROOT, 'docs');
const IDX = PREVIEW ? 'index.html' : '';
const LANGS = ['es', 'en'];
const PAGES = [gijon, alzira, afiliados, ia];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const r = (v, lang) => resolve(v, lang);
const up = slug => '../'.repeat(slug.split('/').length);
const pad2 = i => String(i + 1).padStart(2, '0');

// Foto: si existe src/assets/img/<id>.jpg se usa; si no, se muestra el hueco con su descripción.
function slot(img, cls, base, lang) {
  const ph = r(img.ph, lang);
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    if (existsSync(join(SRC, 'assets/img', `${img.id}.${ext}`)))
      return `<div class="slot ${cls}"><img src="${base}assets/img/${img.id}.${ext}" alt="${esc(ph)}" loading="lazy"></div>`;
  }
  return `<div class="slot ${cls}" role="img" aria-label="${esc(r(UI.photoPending, lang))}: ${esc(ph)}"><span class="ph">${esc(ph)}</span></div>`;
}

function company(lang) {
  const p = k => `<span class="pending">${r(PENDING[k], lang)}</span>`;
  const c = COMPANY;
  return {
    name: c.name,
    cif: c.cif ? esc(c.cif) : p('cif'),
    address: c.address ? esc(c.address) : p('address'),
    registry: c.registry ? esc(c.registry) : p('registry'),
    insurance: `${c.insurer ? esc(c.insurer) : p('insurer')} · ${r(COMPANY_SECTION.policyWord, lang)} ${c.policy ? esc(c.policy) : p('policy')}`,
    phone: c.phone ? `<a href="tel:${esc(c.phone.replace(/\s/g, ''))}">${esc(c.phone)}</a>` : p('phone'),
    email: c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : p('email'),
    year: c.founded ? esc(c.founded) : p('year'),
    footAddress: c.address ? esc(c.address) : r(PENDING.footAddress, lang),
    footRegistry: c.registry ? esc(c.registry) : r(PENDING.footRegistry, lang),
    footCif: c.cif ? esc(c.cif) : r(PENDING.cif, lang),
  };
}

function head({ lang, title, description, slug, alt, base, og, jsonld, theme }) {
  const url = s => `${SITE.url}/${s}/`;
  const ogImg = og?.image && existsSync(join(SRC, og.image)) ? `\n<meta property="og:image" content="${SITE.url}/${og.image}">` : '';
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#0F2232">
<link rel="canonical" href="${url(slug)}">
<link rel="alternate" hreflang="es" href="${url(lang === 'es' ? slug : alt)}">
<link rel="alternate" hreflang="en" href="${url(lang === 'en' ? slug : alt)}">
<link rel="alternate" hreflang="x-default" href="${url(lang === 'es' ? slug : alt)}">${og ? `
<meta property="og:type" content="website">
<meta property="og:locale" content="${lang === 'es' ? 'es_ES' : 'en_GB'}">
<meta property="og:site_name" content="VERTIAN SOLUTIONS">
<meta property="og:title" content="${esc(og.title)}">
<meta property="og:description" content="${esc(og.desc)}">
<meta property="og:url" content="${url(slug)}">${ogImg}` : ''}
<link rel="icon" type="image/png" href="${base}assets/img/favicon.png">
<link rel="apple-touch-icon" href="${base}assets/img/apple-touch-icon.png">
<link rel="preload" href="${base}assets/fonts/schibsted-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${base}css/site.css">${jsonld ? `
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body class="${theme}">
<a class="skip" href="#inicio">${r(UI.skip, lang)}</a>`;
}

function langSwitch(lang, altHref) {
  const other = lang === 'es' ? 'en' : 'es';
  const cur = `<span aria-current="true">${lang.toUpperCase()}</span>`;
  const link = `<a href="${altHref}" hreflang="${other}" lang="${other}" data-lang="${other}">${other.toUpperCase()}</a>`;
  return `<nav class="lang" aria-label="${r(UI.langLabel, lang)}">${lang === 'es' ? cur + link : link + cur}</nav>`;
}

function header(p, lang, altHref, base) {
  const nav = r(p.nav, lang);
  const ask = r(UI.askInfo, lang);
  return `
<header class="site-header" id="top">
  <div class="wrap bar">
    <a class="brand" href="#inicio" aria-label="${r(UI.home, lang)}"><img src="${base}assets/img/logo-vertian.png" alt="VERTIAN SOLUTIONS" width="124" height="28"></a>
    <nav class="nav" aria-label="${r(UI.sectionsNav, lang)}">
      ${nav.map(n => `<a href="${n.href}">${n.short}</a>`).join('\n      ')}
    </nav>
    <span class="spacer"></span>
    ${langSwitch(lang, altHref)}
    <a class="btn-dark" href="#contacto">${ask} →</a>
    <button type="button" class="menu-btn" aria-expanded="false" aria-controls="menu-movil" aria-label="${r(UI.menuOpen, lang)}"><span></span><span></span><span></span></button>
  </div>
  <nav class="mobile-nav" id="menu-movil" aria-label="${r(UI.mobileNav, lang)}">
    ${nav.map(n => `<a href="${n.href}">${n.long}</a>`).join('\n    ')}
    <a class="cta" href="#contacto">${ask} <span aria-hidden="true">→</span></a>
  </nav>
</header>`;
}

function hero(h, lang, base) {
  return `
<section class="wrap hero" aria-labelledby="h1">
  <div class="kicker"><span class="dot">${h.kicker}</span><span>${h.region}</span></div>
  <h1 id="h1" class="h1">${h.h1}</h1>
  <div class="hero-row">
    <p class="hero-lead">${h.lead}</p>
    <div class="ctas">
      <a class="btn-accent" href="${h.cta1.href}">${h.cta1.label} <span aria-hidden="true">${h.cta1.arrow}</span></a>
      <a class="btn-ghost" href="#contacto">${r(UI.askInfo, lang)}</a>
    </div>
  </div>
  <figure class="hero-fig">
    ${slot(h.img, 'slot-hero', base, lang)}
    <figcaption class="facts">
      ${h.facts.map(f => `<span><span class="k">${f.k}</span><span class="v${f.hl ? ' hl' : ''}">${f.v}</span></span>`).join('\n      ')}
    </figcaption>
  </figure>
</section>`;
}

const commit = (items, lang) => `
<section class="wrap" aria-label="${lang === 'es' ? 'Compromisos' : 'Commitments'}">
  <div class="commit">
    ${items.map(i => `<div><div class="v">${i.v}</div><div class="t">${i.t}</div></div>`).join('\n    ')}
  </div>
</section>`;

const sectionHead = (num, h, id, extra = '') => `<div class="eyebrow">${num}</div>
      <h2 id="${id}" class="h2">${h}</h2>${extra}`;

function certCalc(c, js, lang) {
  return `
<section id="precio" class="wrap section" aria-labelledby="h-calc">
  <div class="head-row rule-top">
    <div>${sectionHead(c.num, c.h, 'h-calc')}</div>
    <p class="lead-muted">${c.lead}</p>
  </div>
  <div class="tool" data-cert-calc>
    <div class="inputs">
      <div class="voice">
        <button type="button" class="mic" data-voice aria-pressed="false" aria-label="${esc(c.voiceAria)}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"></rect><path d="M19 10v1a7 7 0 0 1-14 0v-1"></path><path d="M12 18v4"></path></svg>
        </button>
        <div class="txt"><div class="t1">${c.voiceT}</div><div class="t2" data-voice-hint aria-live="polite">${js.voiceExample}</div></div>
      </div>
      <fieldset>
        <legend>${c.l1}</legend>
        <div class="opts" data-tipos>
          ${js.tipos.map((t, i) => `<button type="button" class="opt" data-id="${t.id}" aria-pressed="${i === 0}"><div class="l">${t.label}</div><div class="c">${t.code}</div></button>`).join('\n          ')}
        </div>
      </fieldset>
      <fieldset>
        <legend>${c.l2}</legend>
        <div class="fields">
          <label><span class="lbl">${c.sup} <span class="mono" data-sup-label>80 m²</span></span><input type="range" min="20" max="400" step="5" value="80" data-sup></label>
          <label><span class="lbl">${c.zone}</span><select data-zone>${js.zones.map(z => `<option value="${esc(z.name)}">${esc(z.name)}${z.km ? ` · ${z.km} km` : ''}</option>`).join('')}</select></label>
        </div>
      </fieldset>
      <fieldset>
        <legend>${c.l3}</legend>
        <div class="chips">
          ${js.i18n.motivos.map((m, i) => `<button type="button" class="chip" data-motivo="${i}" aria-pressed="${i === 0}">${m}</button>`).join('\n          ')}
          <span class="sep" aria-hidden="true"></span>
          ${js.i18n.plazos.map((m, i) => `<button type="button" class="chip" data-urgente="${i}" aria-pressed="${i === 0}">${m}</button>`).join('\n          ')}
        </div>
      </fieldset>
    </div>
    <div class="result" aria-live="polite">
      <div class="head"><span>${c.resHead}</span><span class="ex">${c.example}</span></div>
      <div class="big"><span class="n" data-total>90</span><span class="u">${c.unit}</span></div>
      <div class="rows" data-breakdown></div>
      <div class="summary" data-summary></div>
      <div class="grow"></div>
      <button type="button" class="btn-block" data-send>${c.send} <span aria-hidden="true">→</span></button>
      <p class="fine">${c.fine}</p>
    </div>
  </div>
</section>`;
}

function iaCalc(c, js) {
  return `
<section id="calculadora" class="wrap section" aria-labelledby="h-calc">
  <div class="head-row rule-top">
    <div>${sectionHead(c.num, c.h, 'h-calc')}</div>
    <p class="lead-muted">${c.lead}</p>
  </div>
  <div class="tool ac" data-ia-calc>
    <div class="inputs">
      <fieldset>
        <legend>${c.l1}</legend>
        <div class="opts wide">
          ${js.tasks.map(t => `<button type="button" class="opt" data-task="${t.id}" aria-pressed="${['pres', 'fact', 'datos'].includes(t.id)}"><div class="l">${t.label}</div><div class="c">${t.h} ${c.perPerson}</div></button>`).join('\n          ')}
        </div>
      </fieldset>
      <div class="fields">
        <label><span class="lbl">${c.people} <span class="mono" data-people-label>2</span></span><input type="range" min="1" max="10" step="1" value="2" data-people></label>
        <label><span class="lbl">${c.rate} <span class="mono" data-rate-label>22 €</span></span><input type="range" min="12" max="45" step="1" value="22" data-rate></label>
      </div>
    </div>
    <div class="result" aria-live="polite">
      <div class="head"><span>${c.resHead}</span><span class="ex">${c.example}</span></div>
      <div class="big"><span class="n" data-months>–</span><span class="u" data-months-label></span></div>
      <div class="triple">
        <div><div class="k">${c.hours}</div><div class="v" data-hours>–</div></div>
        <div><div class="k">${c.saving}</div><div class="v" data-saving>–</div></div>
        <div><div class="k">${c.project}</div><div class="v" data-cost>–</div></div>
      </div>
      <div class="cum" aria-hidden="true" data-cum>
        <div class="line" data-cost-line></div>
        <div class="line-l" data-cost-line-l>${c.costLine}</div>
        ${Array.from({ length: 12 }, () => '<div class="b"></div>').join('')}
      </div>
      <div class="cum-cap">${c.cumCap}</div>
      <div class="grow"></div>
      <button type="button" class="btn-block" data-send>${c.send} <span aria-hidden="true">→</span></button>
      <p class="fine">${c.fine}</p>
    </div>
  </div>
</section>`;
}

function panel(c, js) {
  return `
<section id="panel" class="wrap section" aria-labelledby="h-panel">
  <div class="head-row rule-top">
    <div>${sectionHead(c.num, c.h, 'h-panel')}</div>
    <p class="lead-muted">${c.lead}</p>
  </div>
  <div class="panel" data-panel>
    <div class="top">
      <div class="tabs" role="tablist" aria-label="${esc(c.periodAria)}">
        ${c.periods.map((p, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-period="${i ? 'trim' : 'mes'}">${p}</button>`).join('\n        ')}
      </div>
      <span class="tag-warn sm">${c.sample}</span>
    </div>
    <div class="kpis" data-kpis aria-live="off"></div>
    <div class="body">
      <div>
        <div class="legend"><span><i style="background:var(--ac)"></i>${c.income}</span><span><i style="background:rgba(243,244,242,.35)"></i>${c.cost}</span></div>
        <div class="chart" aria-hidden="true" data-chart>
          ${js.months.map(() => '<div class="m"><div style="background:var(--ac)"></div><div style="background:rgba(243,244,242,.35)"></div></div>').join('')}
        </div>
        <div class="chart-x" aria-hidden="true">${js.months.map(m => `<div>${m}</div>`).join('')}</div>
      </div>
      <div>
        <div class="label-sm" style="color:var(--fg-60)">${c.byProgram}</div>
        <table class="progs">
          <thead><tr><th>${c.program}</th><th>${c.income}</th><th>${c.margin}</th></tr></thead>
          <tbody data-progs>${js.progs.map(([n]) => `<tr><td>${n}</td><td></td><td></td></tr>`).join('')}</tbody>
        </table>
        <div class="report">
          <div class="label-sm" style="color:var(--fg-60)">${c.reportH}</div>
          <ul>${c.report.map(x => `<li>${x}</li>`).join('')}</ul>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function services(s, lang) {
  const from = r(UI.from, lang), vat = r(UI.vat, lang);
  return `
<section id="servicios" class="wrap section" aria-labelledby="h-precios">
  <div class="head-flex rule-top">
    <div>${sectionHead(s.num, s.h, 'h-precios')}</div>
    <span class="tag-warn">${r(UI.examplePrices, lang)}</span>
  </div>
  <div class="cells cells-4">
    ${s.items.map(i => `<article class="card">
      <div class="code">${i.code}</div>
      <h3>${i.h}</h3>
      <p>${i.p}</p>
      <div class="price"><span class="s">${from}</span><span class="n">${i.n}</span><span class="s">${i.post === 'vat' ? vat : i.post}</span></div>
    </article>`).join('\n    ')}
  </div>
  <p class="note">${s.foot}</p>
</section>`;
}

function explain(e, lang, base) {
  const letters = e.letters ? `
      <div class="letters" role="group" aria-label="${esc(e.letterAria)}" data-letters></div>
      <div class="letter-info" data-letter-info><div class="k">${e.letterWord} <span data-letter-k>E</span></div><p data-letter-t></p></div>` : '';
  return `
<section class="wrap section" aria-labelledby="h-que">
  <div class="two-col rule-top">
    <div>
      ${slot(e.img, 'slot-explain', base, lang)}
      <div class="figcap"><span>${r(UI.fig, lang)}</span><span>${e.img.capR}</span></div>
    </div>
    <div>
      ${sectionHead(e.num, e.h, 'h-que')}
      ${e.paras.map((p, i) => `<p class="body-p" style="margin-top:${i ? 14 : 20}px">${p}</p>`).join('\n      ')}${letters}
      <dl class="dl">
        ${e.dl.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('\n        ')}
      </dl>
    </div>
  </div>
</section>`;
}

function zone(z, js) {
  return `
<section id="zona" class="wrap section" aria-labelledby="h-zona">
  <div class="two-col rule-top" style="align-items:center">
    <div>
      ${sectionHead(z.num, z.h, 'h-zona')}
      <p class="body-p" style="margin-top:20px;max-width:32em">${z.p}</p>
      <table class="zone-table">
        <caption>${z.caption}</caption>
        <tbody data-zone-rows>
          ${js.zones.map(c => `<tr><td>${esc(c.name)}</td><td style="width:40%"><div class="track"><div class="fill"></div></div></td><td class="num">${c.km} km</td><td class="num fee"></td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
    <div class="zone-map" data-zone-map role="img" aria-label="${esc(z.aria)}"></div>
  </div>
</section>`;
}

const process_ = p => `
<section id="proceso" class="wrap section" aria-labelledby="h-proceso">
  <div class="rule-top">${sectionHead(p.num, p.h, 'h-proceso')}</div>
  <ol class="cells cells-3">
    ${p.steps.map((s, i) => `<li class="card step"><div class="num">${pad2(i)}</div><div class="when">${s.when}</div><h3>${s.h}</h3><p>${s.p}</p></li>`).join('\n    ')}
  </ol>
</section>`;

const guarantees = g => `
<section class="wrap section" aria-labelledby="h-garantias">
  <div class="split guar">
    <div class="lead"><div class="eyebrow">${g.num}</div><h2 id="h-garantias">${g.h}</h2></div>
    <ul>
      ${g.items.map((it, i) => `<li><div class="code">G-${pad2(i)}</div><div class="t">${it.t}</div><p>${it.p}</p></li>`).join('\n      ')}
    </ul>
  </div>
</section>`;

function companySec(c, lang, base) {
  const S = r(COMPANY_SECTION, lang), C = company(lang), P = c.person;
  const rows = [
    [S.rows.name, C.name], [S.rows.cif, `<span class="mono">${C.cif}</span>`], [S.rows.address, C.address],
    [S.rows.registry, C.registry], [S.rows.insurance, C.insurance], ...c.extraRows, [S.rows.data, S.dataText],
  ];
  return `
<section id="empresa" class="wrap section" aria-labelledby="h-empresa">
  <div class="two-col rule-top">
    <div>
      ${sectionHead(c.num, S.h, 'h-empresa')}
      <p class="body-p" style="margin-top:20px">${S.p1.replace('{year}', C.year)}</p>
      <p class="body-p" style="margin-top:14px">${c.p2}</p>
      <div class="person">
        ${slot(P.img, 'slot-portrait', base, lang)}
        <div>
          <div class="label-sm">${P.label}</div>
          <div class="name">${P.name}</div>
          <div class="role">${P.role}</div>
          <p>${P.bio}</p>
        </div>
      </div>
    </div>
    <div>
      <div class="label-sm" style="margin-bottom:10px">${S.factsLabel}</div>
      <dl class="dl lg" style="margin-top:0">
        ${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('\n        ')}
      </dl>
      <div class="label-sm" style="margin:32px 0 10px">${S.notsLabel}</div>
      <ul class="nots">
        ${c.nots.map(n => `<li>${n}</li>`).join('\n        ')}
      </ul>
    </div>
  </div>
</section>`;
}

function reviews(v, lang) {
  const R = r(REVIEWS, lang);
  const card = `<figure class="review">
      <span class="tag-warn sm">${R.reserved}</span>
      <blockquote>${R.quote}</blockquote>
      <figcaption>${v.cap}</figcaption>
    </figure>`;
  return `
<section id="opiniones" class="wrap section" aria-labelledby="h-opiniones">
  <div class="head-row rule-top" style="margin-bottom:0">
    <div>${sectionHead(v.num, v.h || R.h, 'h-opiniones')}</div>
    <div class="score"><div class="n">–,–</div><div class="t">${R.score}<br><span class="mono" style="font-size:12px">${R.count}</span></div></div>
  </div>
  <div class="reviews">
    ${card}
    ${card}
    ${card}
  </div>
  <p class="note">${v.foot || R.foot}</p>
</section>`;
}

const faq = f => `
<section id="preguntas" class="wrap section" aria-labelledby="h-faq">
  <div class="split faq-grid rule-top">
    <div>${sectionHead(f.num, f.h, 'h-faq')}</div>
    <div class="faq">
      ${f.items.map(([q, a]) => `<details><summary>${q} <span class="plus" aria-hidden="true">+</span></summary><p>${a}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>`;

function contact(c, lang, links) {
  const K = r(CONTACT, lang), C = company(lang);
  const mic = c.dictate ? `
          <button type="button" class="mic-sm" data-dictate aria-pressed="false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"></rect><path d="M19 10v1a7 7 0 0 1-14 0v-1"></path></svg><span data-dictate-label>${K.dictate}</span></button>` : '';
  return `
<section id="contacto" class="wrap section contact" aria-labelledby="h-contacto">
  <div class="split contact-box">
    <div>
      <div class="eyebrow">${c.num}</div>
      <h2 id="h-contacto" class="h2">${K.h}</h2>
      <p class="sub">${c.lead}</p>
      <dl class="dl">
        <dt>${K.phone}</dt><dd class="mono">${C.phone}</dd>
        <dt>${K.email}</dt><dd class="mono">${C.email}</dd>${c.hours ? `
        <dt>${K.hours}</dt><dd>${c.hours}</dd>` : ''}
      </dl>
    </div>
    <form class="form" data-contact-form novalidate>
      <label><span class="lbl">${K.name} *</span><input name="nombre" autocomplete="name" required></label>
      <label><span class="lbl">${K.mail} *</span><input type="email" name="email" autocomplete="email" required></label>
      <label><span class="lbl">${K.tel}</span><input type="tel" name="telefono" autocomplete="tel"></label>
      <label><span class="lbl">${K.service} *</span>
        <select name="servicio">
          ${[...c.services, K.other].map(s => `<option value="${esc(s)}">${s}</option>`).join('\n          ')}
        </select>
      </label>
      <label class="full"><span class="lbl">${K.message}${mic}</span>
        <textarea name="mensaje" rows="${c.dictate ? 6 : 5}"${c.dictate ? ' class="mono"' : ''}></textarea>
      </label>
      <div class="hp" aria-hidden="true"><label>Web<input name="web" tabindex="-1" autocomplete="off"></label></div>
      <label class="full check">
        <input type="checkbox" name="privacidad" required>
        <span>${K.privacy.replace('{privacy}', links.privacy)} *</span>
      </label>
      <div class="full row">
        <button type="submit" class="btn-submit">${K.submit} →</button>
        <div class="status" role="status" aria-live="polite" data-status></div>
      </div>
    </form>
  </div>
</section>`;
}

function footer(lang, links, tagline, tag, base) {
  const C = company(lang);
  return `
<footer class="site-footer">
  <div class="wrap top">
    <div><div class="logo-box"><img src="${base}assets/img/logo-vertian.png" alt="VERTIAN SOLUTIONS" width="115" height="26"></div>${tagline ? `<p style="margin-top:14px">${tagline}</p>` : ''}</div>
    <div class="legal-id">VERTIAN SOLUTIONS, S.L.<br>CIF ${C.footCif}<br>${C.footAddress}<br>${C.footRegistry}</div>
    <div class="links">
      <a href="${links.aviso}">${r(UI.legalNotice, lang)}</a>
      <a href="${links.privacy}">${r(UI.privacy, lang)}</a>
      <a href="${links.cookies}">${r(UI.cookies, lang)}</a>
    </div>
  </div>
  <div class="wrap bottom"><span>© ${new Date().getFullYear()} VERTIAN SOLUTIONS, S.L.</span><span>${tag}</span></div>
</footer>`;
}

const legalLinks = (lang, base) => ({
  aviso: `${base}${LEGAL.aviso.slug[lang]}/${IDX}`,
  privacy: `${base}${LEGAL.privacidad.slug[lang]}/${IDX}`,
  cookies: `${base}${LEGAL.cookies.slug[lang]}/${IDX}`,
});

function renderPage(page, lang) {
  const p = r(page, lang);
  const slug = page.slug[lang], alt = page.slug[lang === 'es' ? 'en' : 'es'];
  const base = up(slug);
  const altHref = `${base}${alt}/${IDX}`;
  const links = legalLinks(lang, base);
  const jsonld = { ...p.jsonld, url: `${SITE.url}/${slug}/`, ...(COMPANY.email && { email: COMPANY.email }), ...(COMPANY.phone && { telephone: COMPANY.phone }) };
  if (jsonld.address && COMPANY.address) jsonld.address.streetAddress = COMPANY.address;

  const data = {
    lang, page: page.slug.es, endpoint: `https://formsubmit.co/ajax/${SITE.formEmail}`,
    form: r(FORM_I18N, lang), dictate: { dictate: r(CONTACT.dictate, lang), stop: r(CONTACT.stop, lang) },
    ...(p.js || {}),
  };

  let main = hero(p.hero, lang, base) + commit(p.commit, lang);
  if (page.type === 'cert') main += certCalc(p.calc, p.js, lang);
  if (page.type === 'afiliados') main += panel(p.panel, p.js);
  if (page.type === 'ia') main += iaCalc(p.calc, p.js);
  main += services(p.services, lang) + explain(p.explain, lang, base);
  if (page.type === 'cert') main += zone(p.zone, p.js);
  main += process_(p.process) + guarantees(p.guarantees) + companySec(p.company, lang, base)
    + reviews(p.reviews, lang) + faq(p.faq) + contact(p.contact, lang, links);

  const script = { cert: 'certificados', afiliados: 'afiliados', ia: 'ia' }[page.type];
  return head({ lang, title: p.meta.title, description: p.meta.description, slug, alt, base, theme: p.theme, jsonld,
    og: { title: p.meta.ogTitle, desc: p.meta.ogDesc, image: page.meta.ogImage } })
    + header(p, lang, altHref, base)
    + `\n<main id="inicio">${main}\n</main>`
    + footer(lang, links, p.footer.tagline, p.footer.tag, base)
    + `\n<script type="application/json" id="vt-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
<script src="${base}js/common.js" defer></script>
<script src="${base}js/${script}.js" defer></script>
</body>
</html>
`;
}

function renderLegal(doc, lang) {
  const slug = doc.slug[lang], alt = doc.slug[lang === 'es' ? 'en' : 'es'];
  const base = up(slug);
  const links = legalLinks(lang, base);
  const body = doc.body[lang](company(lang)).replace(/\{privacy\}/g, links.privacy);
  const title = doc.title[lang];
  const updated = lang === 'es' ? 'Última actualización' : 'Last updated';
  const date = new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return head({ lang, title: `${title} | VERTIAN SOLUTIONS`, description: `${title} · VERTIAN SOLUTIONS, S.L.`, slug, alt, base, theme: 'theme-teal' })
    + `
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="${base}${IDX}" aria-label="${r(UI.home, lang)}"><img src="${base}assets/img/logo-vertian.png" alt="VERTIAN SOLUTIONS" width="124" height="28"></a>
    <span style="flex:1"></span>
    ${langSwitch(lang, `${base}${alt}/${IDX}`)}
  </div>
</header>
<main id="inicio" class="wrap legal">
  <div class="doc">
    <div class="kicker"><span class="dot">VERTIAN SOLUTIONS, S.L.</span><span>${lang === 'es' ? 'INFORMACIÓN LEGAL' : 'LEGAL INFORMATION'}</span></div>
    <h1>${title}</h1>
    <p class="updated">${updated}: ${date}</p>
    ${body}
  </div>
</main>`
    + footer(lang, links, '', lang === 'es' ? 'LEGAL' : 'LEGAL', base)
    + `
<script src="${base}js/common.js" defer></script>
</body>
</html>
`;
}

// La raíz no tiene portada: lleva a la página de certificados en el idioma guardado o del navegador.
function renderRoot() {
  const first = PAGES[0].slug;
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>VERTIAN SOLUTIONS</title>
<meta name="robots" content="noindex">
<link rel="icon" type="image/png" href="assets/img/favicon.png">
<script>
(function () {
  var l = null;
  try { l = localStorage.getItem('vt-lang'); } catch (e) {}
  if (!l) l = (navigator.language || 'es').slice(0, 2) === 'en' ? 'en' : 'es';
  location.replace(l === 'en' ? '${first.en}/' : '${first.es}/');
})();
</script>
<noscript><meta http-equiv="refresh" content="0; url=${first.es}/"></noscript>
</head>
<body style="background:#0F2232;color:#F3F4F2;font-family:system-ui,sans-serif;padding:24px">
<ul>
${PAGES.map(p => `  <li><a style="color:#F3F4F2" href="${p.slug.es}/">${p.slug.es}</a></li>`).join('\n')}
</ul>
</body>
</html>
`;
}

function write(rel, html) {
  const file = join(OUT, rel, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const dir of ['css', 'js', 'assets']) cpSync(join(SRC, dir), join(OUT, dir), { recursive: true });

for (const lang of LANGS) {
  for (const page of PAGES) write(page.slug[lang], renderPage(page, lang));
  for (const doc of Object.values(LEGAL)) write(doc.slug[lang], renderLegal(doc, lang));
}
writeFileSync(join(OUT, 'index.html'), renderRoot());
writeFileSync(join(OUT, '.nojekyll'), '');

const urls = LANGS.flatMap(l => [...PAGES.map(p => p.slug[l]), ...Object.values(LEGAL).map(d => d.slug[l])]);
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE.url}/${u}/</loc></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`);

console.log(`Web generada en docs/ (${urls.length} páginas).`);
