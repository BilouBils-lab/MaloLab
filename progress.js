'use strict';
/* =========================================================
   Valoriser les progrès plutôt que les étoiles
   - « Mes progrès » : écran pour l'enfant (sons, mots réussis, calcul, série, fluence)
   - Félicitations centrées sur l'effort et la correction des erreurs
   - Fluence en mots par minute, avec le repère de fin de CP (50 mots/min)
   (Chargé avant app.js : n'utilise ses fonctions qu'au moment de l'appel.)
   ========================================================= */
const FLUENCE_CP = 50;   // repère Éduscol : mots lus correctement par minute en fin de CP

/* ---------- Ce que l'enfant maîtrise ---------- */
const READ_ACTS = ['lismot', 'quelmot', 'bonnephrase', 'meli', 'entends', 'premierson'];
const WRITE_ACTS = ['ecrismot', 'dictee', 'papier-mots', 'papier-syllabes', 'papier-copie', 'cursive-mots', 'cursive-syllabes'];
function mastered(ids) {
  let n = 0;
  (ids || Object.values(ACTS).flatMap(d => d.list.map(a => a.id))).forEach(id => {
    Object.values(memGet(id)).forEach(v => { const s = +v[1] || 0, e = +v[2] || 0; if (s >= 2 && e === 0 || s >= 3 && s > 2 * e) n++; });
  });
  return n;
}
function wordsRead() {
  const W = new Set();
  ['lismot', 'quelmot', 'ecrismot', 'papier-mots', 'cursive-mots'].forEach(id => Object.entries(memGet(id)).forEach(([k, v]) => { if ((+v[1] || 0) > 0) W.add(unsafe(k)); }));
  return W.size;
}

/* ---------- Fluence : mots par minute ---------- */
function partWords(P) {
  if (P.id === 'syl') return P.items.length;
  if (P.id === 'mots') return P.items.length;
  if (P.id === 'meli') return P.items.length * 2;
  if (P.id === 'phrases') return P.items.reduce((n, t) => n + t.replace(/[.!?,]/g, '').split(/\s+/).filter(Boolean).length, 0);
  return P.items.length;
}
const perMinute = (P, seconds) => seconds > 0 ? Math.round(partWords(P) / seconds * 60) : 0;
function fluenceGauge(P, seconds) {
  const v = perMinute(P, seconds), unit = P.id === 'syl' ? 'syllabes' : 'mots';
  if (P.id === 'syl') return `<div class="fl-wpm"><b>${v}</b> ${unit} par minute</div>`;
  const max = 80, pos = Math.min(100, v / max * 100), mark = FLUENCE_CP / max * 100;
  return `<div class="fl-wpm"><b>${v}</b> mots par minute
    <span class="fl-gauge"><i style="width:${pos}%"></i><em style="left:${mark}%" title="repère fin de CP"></em></span>
    <small>${v >= FLUENCE_CP ? 'Bravo, tu lis aussi vite qu\'un grand de fin de CP !' : `Objectif de fin de CP : ${FLUENCE_CP} mots par minute`}</small></div>`;
}

/* ---------- Félicitations : l'effort plutôt que le résultat ---------- */
const PROCESS_PRAISE = {
  lecture: ['Tu as bien lu chaque son', 'Tu as bien écouté', 'Tu as pris le temps de lire'],
  maths: ['Tu as bien compté', 'Tu as bien réfléchi', 'Tu as pris ton temps'],
  ecriture: ['Tu as bien écouté les sons', 'Tu as bien regardé le modèle', 'Tu t\'es bien appliqué'],
};
const FIX_PRAISE = ['Bravo, tu as corrigé ton erreur', 'Tu as persévéré, bravo', 'Tu as réessayé, et tu as trouvé'];
// Après une bonne réponse : des mots courts et variés, sans le prénom (lassant à la longue)
const SHORT_PRAISE = ['Oui !', 'Bravo !', "C'est ça !", 'Très bien !', 'Exact !', 'Super !', 'Bien joué !', 'Parfait !'];
const Praise = { last: '', theme: false };
const praiseReset = () => { Praise.theme = false; };   // au début de chaque partie
function praiseFor(dk, firstTry) {
  let pool;
  if (!firstTry) pool = FIX_PRAISE;
  else {
    const r = Math.random();
    if (r < .2) pool = PROCESS_PRAISE[dk] || PROCESS_PRAISE.lecture;              // l'effort, de temps en temps
    else if (r < .28 && !Praise.theme) { Praise.theme = true; pool = T().praise; } // l'univers : une fois par partie au plus
    else pool = SHORT_PRAISE;
  }
  pool = pool.map(x => /[!.]$/.test(x) ? x : x + ' !');
  let p, n = 0;
  do p = pick(pool); while (p === Praise.last && pool.length > 1 && ++n < 10);
  Praise.last = p;
  return p;
}

/* ---------- Écran « Mes progrès » (pour l'enfant) ---------- */
function progressScreen() {
  const K = GRAPHEMES.filter(g => state.known.includes(g[0]));
  const st = typeof dailyStreak === 'function' ? dailyStreak() : 0;
  let flu = null;
  try {
    const F = fluenceContent(), P = F.parts.find(p => p.id === 'mots') || F.parts[0];
    const h = P ? fluenceAll(F.key, P.id) : [];
    if (h.length) flu = { P, best: Math.min(...h) };
  } catch {}
  const stageBar = (op, label) => { const s = calcStage(op); return `<div class="pg-stage"><span>${label}</span>
    <span class="pg-steps">${[1, 2, 3].map(i => `<i class="${i <= s ? 'on' : ''}">${i}</i>`).join('')}</span><small>${STAGE_NAMES[op][s]}</small></div>`; };
  render(`
    <header class="top">
      <button class="icon" id="back" aria-label="Retour">${ico('back')}</button>
      <div class="title">Mes progrès</div>
    </header>
    <main class="progress">
      <section class="pg-card lec">
        <h3><span class="dt-ic">${domainIcon('lecture')}</span>Je lis</h3>
        <div class="pg-big"><b>${K.length}</b> sons appris</div>
        <div class="pg-sounds">${K.map(g => `<span>${esc(L(g[0]))}</span>`).join('')}</div>
        <div class="pg-big"><b>${wordsRead()}</b> mots déjà lus ou écrits</div>
        ${flu ? `<div class="pg-big"><b>${perMinute(flu.P, flu.best)}</b> mots par minute <small>(mon record)</small></div>` : ''}
      </section>
      <section class="pg-card mat">
        <h3><span class="dt-ic">${domainIcon('maths')}</span>Je calcule</h3>
        ${stageBar('add', 'Additions')}${stageBar('sub', 'Soustractions')}
        <small class="pg-note">Nombres jusqu'à ${numMax()}</small>
      </section>
      <section class="pg-card eff">
        <h3>${ico('trophy')} Mes efforts</h3>
        <div class="pg-big"><b>${mastered()}</b> questions que je maîtrise</div>
        ${st ? `<div class="pg-big"><b>${st}</b> jour${st > 1 ? 's' : ''} d'entraînement d'affilée</div>` : ''}
        <div class="pg-big"><b>${Math.round(Object.values(logAll()).reduce((s, v) => s + v[1], 0) / 60)}</b> minutes de travail en tout</div>
      </section>
    </main>`);
  say(`Bravo ! Tu connais ${K.length} sons, et tu maîtrises ${mastered()} questions.`);
  $('#back').onclick = home;
  window.__screen = 'progress';
}
