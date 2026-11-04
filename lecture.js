'use strict';
/* =========================================================
   Exercices de lecture inspirés du fichier de la classe :
   lire les lettres, entendre un son, combiner les lettres,
   méli-mélo, fluence chronométrée.
   (Chargé avant app.js : n'utilise ses fonctions qu'au moment de l'appel.)
   ========================================================= */

// Hasard reproductible : la fiche de fluence reste la même tant que les sons étudiés ne changent pas
function seeded(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
}
const sShuffle = (r, a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const grapheme = id => GRAPHEMES.find(g => g[0] === id);
const repere = id => (grapheme(id) || [])[2] || '';
// Façon de dire un son : consonne prolongée + mot repère
const SOUND_SAY = { r: 'rrr', l: 'lll', s: 'sss', f: 'fff', m: 'mmm', n: 'nnn', ch: 'chhh', v: 'vvv', j: 'jjj', z: 'zzz' };
const soundSay = id => `${SOUND_SAY[id] || id}, comme dans ${repere(id)}`;

/* ---------- 1. Les lettres sous toutes leurs formes ---------- */
const VARIANTS = { a: ['à', 'â'], i: ['î', 'ï'], o: ['ô'], u: ['û'] };
function cursiveMini(text, cls = 'cw-mini') {
  if (!cursiveSupports(text)) return esc(text);
  const lay = cursiveLayout(text), x0 = -3, x1 = lay.width + 2;
  return `<svg class="${cls}" viewBox="${x0} -21 ${x1 - x0} 26" aria-label="${esc(text)}"><path d="${lay.main}"/>${lay.extras.map(e => `<path d="${e}"/>`).join('')}</svg>`;
}
function letterForms(id) {
  const out = [
    `<span class="lf-script">${esc(id)}</span>`,
    `<span class="lf-caps">${esc(id.toUpperCase())}</span>`,
    `<span class="lf-serif">${esc(id.toUpperCase())}</span>`,
    cursiveMini(id),
  ];
  if (id === 'a') out.push('<span class="lf-script">ɑ</span>');
  (VARIANTS[id] || []).forEach(v => out.push(`<span class="lf-script">${v}</span>`, cursiveMini(v)));
  return out;
}
const bandHTML = id => `
  <div class="lf-band">
    <span class="lfb-c">${cursiveMini(id)}</span><span class="lfb-s">${esc(id)}</span><span class="lfb-k">${esc(id.toUpperCase())}</span>
    <button class="lfb-pic" data-say="${esc(repere(id))}">${artHTML(repere(id), (grapheme(id) || [])[3])}</button>
  </div>`;

function lettresQ(force) {
  const K = state.known.filter(id => grapheme(id) && id !== 'ill');
  if (K.length < 2) return null;
  const target = force && K.includes(force) ? force : pick(K);
  const forms = shuffle(letterForms(target));
  const targets = Array.from({ length: 5 }, (_, i) => forms[i % forms.length]);
  const disIds = [];
  // Distracteurs : autres sons connus, sans ceux qui contiennent la lettre cherchée (o / ou…)
  const others = K.filter(d => d !== target && !d.includes(target) && !target.includes(d));
  const poolIds = others.length ? others : 'aiolrsfmn'.split('').filter(d => d !== target);
  const dis = Array.from({ length: 7 }, () => { const id = pick(poolIds); disIds.push(id); return pick(letterForms(id)); });
  return {
    key: target,
    text: `Touche toutes les lettres « ${esc(L(target))} »`,
    say: `Touche toutes les lettres ${soundSay(target)}.`,
    build(z, answer) {
      const tiles = shuffle([...targets.map(h => [h, true, target]), ...dis.map((h, k) => [h, false, disIds[k]])]);
      z.innerHTML = bandHTML(target) + `<div class="lf-grid">${tiles.map(([h], i) => `<button class="lf-tile" data-i="${i}">${h}</button>`).join('')}</div>`;
      let left = targets.length;
      z.querySelectorAll('.lf-tile').forEach(b => b.addEventListener('click', () => {
        if (b.classList.contains('good') || b.classList.contains('bad')) return;
        if (tiles[b.dataset.i][1]) { b.classList.add('good'); sfxPop(); if (--left === 0) answer(true); }
        else { const id = tiles[b.dataset.i][2]; b.classList.add('bad', 'shake'); answer(false, `Ça, c'est ${SOUND_SAY[id] || id}, comme dans ${repere(id)}. On cherche ${SOUND_SAY[target] || target}, comme dans ${repere(target)}.`); }
      }));
    },
  };
}

/* ---------- 2. Nomme le dessin : entends-tu le son ? ---------- */
// Graphèmes trop proches à l'oreille pour un enfant de CP : on écarte les mots qui en contiennent
const CONFUS = {
  a: ['an', 'oi', 'au', 'è'], i: ['in', 'oi', 'ill'], o: ['on', 'au', 'oi', 'ou'], u: ['ou', 'eu'], e: ['eu', 'è', 'é'],
  'é': ['è', 'e'], ou: ['o', 'u'], s: ['z', 'x', 'ch'], ch: ['s', 'j'], f: ['v', 'ph'], r: [], l: ['ill'], m: ['n'], n: ['m', 'gn'],
};
const hearIds = t => t.id === 'ph' ? ['f'] : t.id === 'x' ? ['c', 's'] : [t.id];
function entendsQ(force) {
  const K = state.known.filter(id => grapheme(id) && id !== 'ill');
  if (!K.length) return null;
  for (let tries = 0; tries < 20; tries++) {
    const target = force && K.includes(force) && tries < 12 ? force : pick(K), bad = CONFUS[target] || [];
    const W = LEXICON.filter(w => hasArt(w.text) && w.text !== repere(target) &&
      !w.toks.some(t => !t.silent && bad.includes(t.id)));
    const has = w => w.toks.some(t => !t.silent && hearIds(t).includes(target));
    const yes = Math.random() < .5;
    const pool = W.filter(w => has(w) === yes);
    if (!pool.length) continue;
    const w = pick(pool);
    return {
      key: w.text,
      text: `Entends-tu « ${esc(L(target))} » dans ce mot ?`,
      say: `Écoute : ${w.text}. Est-ce que tu entends ${soundSay(target)} ?`,
      after: `${w.text} : ${yes ? 'on entend' : "on n'entend pas"} ${SOUND_SAY[target] || target}.`,
      build: choiceBuild({
        top: `<div class="hear"><span class="hear-snd">${esc(L(target))}</span><button class="pic" data-say="${esc(w.text)}">${artHTML(w.text, w.e)}</button></div>`,
        choices: [true, false], isRight: x => x === yes, cls: 'vf',
        explain: () => yes ? `Écoute bien : ${w.text}. On entend ${SOUND_SAY[target] || target} dedans.` : `Écoute bien : ${w.text}. On n'entend pas ${SOUND_SAY[target] || target}.`,
        label: x => x ? ico('ear') + '<small>Oui, j\'entends</small>' : ico('no') + '<small>Non</small>',
      }),
    };
  }
  return null;
}

/* ---------- 3. Combine les lettres pour former des syllabes ---------- */
const VC_FINAL = ['r', 'l', 's', 'f'];
const VC_VOW = ['a', 'i', 'o', 'u', 'ou'];
function fusionPool() {
  const K = knownSet(), out = syllPool().map(([c, v]) => [c, v, c + v]);
  VC_VOW.forEach(v => K.has(v) && VC_FINAL.forEach(c => K.has(c) && out.push([v, c, v + c])));
  return out;
}
function fusionQ() {
  const P = fusionPool(); if (P.length < 3) return null;
  const [a, b, s] = pick(P), all = P.map(p => p[2]);
  const mirror = all.includes(b + a) ? [b + a] : [];
  const ds = [...mirror, ...sample(all.filter(x => x !== s && x !== b + a), 2 - mirror.length)];
  return {
    key: s,
    text: 'Combine les lettres : quelle syllabe ?',
    say: 'Lis les lettres, et touche la syllabe.',
    after: `${a}, ${b} : ${s}.`,
    build: choiceBuild({
      top: `<div class="fusion"><span class="chev">${esc(L(a))}</span><span class="chev">${esc(L(b))}</span><span class="farrow">→</span><span class="fbox q">?</span></div>`,
      choices: shuffle([s, ...ds]), isRight: x => x === s, label: x => esc(L(x)),
      explain: x => x === b + a ? `Attention à l'ordre : on lit d'abord ${a}, puis ${b}.` : `Tu as choisi ${x}. Lis les lettres dans l'ordre : ${a}, puis ${b}.`,
    }),
  };
}

/* ---------- 4. Écoute la syllabe (avec syllabes inversées : ra / ar) ---------- */
function syllabesQ() {
  const P = fusionPool().filter(([, b, s]) => s.length < 4 && !(VC_FINAL.includes(b) && !['r', 'l'].includes(b)));
  if (P.length < 3) return null;
  const [a, b, s] = pick(P), all = P.map(p => p[2]);
  const near = P.filter(([x, y, t]) => t !== s && (x === a || y === b || t === b + a)).map(p => p[2]);
  const ds = sample(near.length >= 2 ? near : all.filter(x => x !== s), 2);
  return {
    key: s,
    text: 'Écoute et touche la syllabe',
    say: `Touche la syllabe : ${s}`,
    build: choiceBuild({ top: `<button class="ear" data-say="${s}" aria-label="Écouter">${ico('ear')}</button>`, choices: shuffle([s, ...ds]), isRight: x => x === s, label: x => esc(L(x)),
      explain: x => `Tu as touché ${x}. Écoute encore : ${s}.` }),
  };
}

/* ---------- 5. Méli-mélo : deux écritures très proches ---------- */
function meliPairs() {
  const pairs = [], P = fusionPool(), S = new Set(P.map(p => p[2]));
  P.forEach(([a, b, s]) => { const m = b + a; if (S.has(m) && s < m) pairs.push([s, m]); });
  const W = [...DICT.values()].filter(w => decodable(w) && w.toks.length > 1);
  for (let i = 0; i < W.length; i++) for (let j = i + 1; j < W.length; j++) {
    const A = W[i].toks.filter(t => !t.silent), B = W[j].toks.filter(t => !t.silent);
    if (A.length !== B.length || W[i].text === W[j].text) continue;
    const diff = A.filter((t, k) => t.id !== B[k].id).length;
    if (diff === 1) pairs.push([W[i].text, W[j].text]);
  }
  return pairs;
}
const meliHTML = t => DICT.has(t) ? wordHTML(DICT.get(t)) : esc(L(t));
function meliQ() {
  const pairs = meliPairs(); if (!pairs.length) return null;
  const pair = pick(pairs), target = pick(pair);
  return {
    key: pair.join('/'),
    text: 'Écoute bien : lequel entends-tu ?',
    say: `Écoute bien : ${target}`,
    build: choiceBuild({ top: `<button class="ear" data-say="${esc(target)}" aria-label="Écouter">${ico('ear')}</button>`, choices: shuffle(pair), isRight: x => x === target, label: meliHTML, cls: 'words',
      explain: x => `Tu as touché ${x}. Écoute bien la différence : ${target}.` }),
  };
}

/* ---------- 6. Fluence : je lis et je me chronomètre ---------- */
function fluenceContent() {
  const raw = [...state.known].sort().join('|') + '#' + [...state.outils].sort().join('|');
  const r = seeded(raw), key = fluKey(raw);
  const syl = sShuffle(r, [...new Set(fusionPool().map(p => p[2]))]).slice(0, 8);
  const words = sShuffle(r, [...new Set([...DICT.values()].filter(w => decodable(w) && w.text.length > 2).map(w => w.text))]).slice(0, 8);
  const sents = sShuffle(r, readableSentences().map(p => p[0])).slice(0, 3);
  const meli = sShuffle(r, meliPairs()).slice(0, 6);
  return {
    key,
    parts: [
      { id: 'syl', title: 'Je lis des syllabes', items: syl, html: t => esc(L(t)), cls: 'fl-syl' },
      { id: 'mots', title: 'Je lis des mots', items: words, html: t => wordHTML(DICT.get(t)), cls: 'fl-mots' },
      { id: 'phrases', title: 'Je lis des phrases', items: sents, html: t => sentenceHTML(parseSentence(t)), cls: 'fl-phr' },
      { id: 'meli', title: 'Méli-mélo', items: meli, html: p => p.map(meliHTML).join(' <i class="sep">/</i> '), cls: 'fl-meli' },
    ].filter(p => p.items.length >= 2),
  };
}
const fmtTime = s => (Math.round(s * 10) / 10).toFixed(1).replace('.', ',') + ' s';

function fluenceScreen(dk, part = 0) {
  if (pauseLocked()) return pauseScreen();
  const F = fluenceContent();
  if (!F.parts.length) {
    render(`<header class="top"><button class="icon" id="back">${ico('back')}</button><div class="title">Fluence</div></header>
      <main class="end"><h2>Bientôt !</h2><p class="empty">Il faut encore apprendre quelques sons pour cette fiche.</p></main>`);
    $('#back').onclick = () => domain(dk);
    return;
  }
  const P = F.parts[part], color = ACTS[dk].color;
  state.fluence = state.fluence || {};
  const hist = (state.fluence[F.key] = state.fluence[F.key] || {})[P.id] || [];
  const allHist = fluenceAll(F.key, P.id);
  const best = allHist.length ? Math.min(...allHist) : null;
  render(`
    <header class="top">
      <button class="icon" id="back" aria-label="Retour">${ico('back')}</button>
      <div class="prog">${F.parts.map((_, j) => `<span class="${j < part ? 'done' : j === part ? 'cur' : ''}"></span>`).join('')}</div>
      <button class="icon" id="spk" aria-label="Consigne">${ico('speaker')}</button>
    </header>
    <main class="play fluence" style="--c:${color}">
      <h2 class="instr">${ico('timer')} ${P.title}</h2>
      <p class="fl-tip">Lis à voix haute à papa ou maman, le plus vite possible sans te tromper.</p>
      <div class="fl-box ${P.cls} blur">${P.items.map(t => `<div class="fl-item">${P.html(t)}</div>`).join('')}</div>
      <div class="fl-timer" id="tm">0,0 s</div>
      <div class="row"><button class="btn" id="go" style="--c:${color}">${ico('play')} C'est parti !</button></div>
      <div class="fl-hist">${allHist.slice(-3).map((t, i) => `<span>Temps ${i + 1} : <b>${fmtTime(t)}</b> · ${perMinute(P, t)} ${P.id === 'syl' ? 'syll.' : 'mots'}/min</span>`).join('') || '<span>Premier essai !</span>'}</div>
    </main>`, 'play');
  const speak = () => say(`${P.title}. Lis à voix haute, le plus vite possible sans te tromper. Appuie sur C'est parti pour lancer le chrono.`);
  $('#spk').onclick = speak; setTimeout(speak, 300);
  let t0 = 0, raf = 0, running = false;
  const tick = () => { $('#tm').textContent = fmtTime((performance.now() - t0) / 1000); raf = requestAnimationFrame(tick); };
  $('#back').onclick = () => { cancelAnimationFrame(raf); domain(dk); };
  $('#go').onclick = () => {
    if (!running) {
      running = true; window.speechSynthesis?.cancel();
      document.querySelector('.fl-box').classList.remove('blur');
      t0 = performance.now(); tick(); sfxPop();
      $('#go').innerHTML = ico('stop') + " J'ai fini";
      return;
    }
    cancelAnimationFrame(raf);
    const t = (performance.now() - t0) / 1000;
    hist.push(t); state.fluence[F.key][P.id] = hist.slice(-10);
    logTime(t + 20, part === F.parts.length - 1 ? 1 : 0);
    const record = best !== null && t < best;
    state.stars += record ? 2 : 1; state.act.fluence = (state.act.fluence || 0) + (record ? 2 : 1); save();
    sfxOK(); confetti();
    const msg = record ? `Record battu ! ${fmtTime(t)}` : best === null ? `Bravo ! ${fmtTime(t)}` : `Bien lu ! ${fmtTime(t)}`;
    say(msg.replace(' s', ' secondes') + (P.id === 'syl' ? '' : `. Tu lis ${perMinute(P, t)} mots par minute.`));
    const last = part === F.parts.length - 1;
    document.querySelector('.fluence').insertAdjacentHTML('beforeend', `
      <div class="fl-result">${record ? ico('trophy') : STAR} ${msg} <small>+${record ? 2 : 1} ${STAR}</small></div>
      ${fluenceGauge(P, t)}
      <div class="row"><button class="btn sec" id="again">${ico('replay')} Recommencer</button>
      <button class="btn" id="next" style="--c:${color}">${last ? ico('home') + ' Terminer' : 'Suivant ' + ico('next')}</button></div>`);
    $('#go').remove();
    $('#again').onclick = () => fluenceScreen(dk, part);
    $('#next').onclick = () => last ? domain(dk) : fluenceScreen(dk, part + 1);
    if (last) pauseCheck();
  };
}

/* ---------- La bonne phrase : quelle phrase va avec l'image ? ---------- */
// Noms féminins (pour « une » / « la ») ; les autres sont masculins. « amis » (pluriel) est écarté.
const FEMININ = new Set(['île', 'olive', 'lune', 'moto', 'fusée', 'pomme', 'tomate', 'banane', 'robe', 'poule', 'tortue', 'souris',
  'vache', 'étoile', 'salade', 'mouche', 'roue', 'porte', 'loupe', 'tulipe', 'pile', 'rue', 'niche', 'fourmi', 'louche', 'ruche',
  'farine', 'momie', 'rame', 'cheminée', 'mamie', 'coupe', 'épée', 'fée', 'magie', 'brique', 'tour']);
const NOT_COUNTABLE = new Set(['amis', 'magie', 'farine', 'riz', 'judo']);
function bonnePhraseQ() {
  const MO = new Set(state.outils), K = knownSet();
  const art = w => FEMININ.has(w.text) ? 'une' : 'un';
  const W = LEXICON.filter(w => hasArt(w.text) && !NOT_COUNTABLE.has(w.text) && decodable(w, K) && MO.has(art(w)));
  const tpl = [];
  if (['il', 'y', 'a'].every(m => MO.has(m))) tpl.push((w, a) => `Il y a ${a} ${w.text}.`);
  if (MO.has("c'est")) tpl.push((w, a) => `C'est ${a} ${w.text}.`);
  if (W.length < 3 || !tpl.length) return null;
  const w = pickWord(W), make = pick(tpl);
  // Phrases pièges : même début, un seul mot change ; de préférence un mot qui commence pareil ou de même longueur
  const near = W.filter(x => x !== w && (x.text[0] === w.text[0] || Math.abs(x.text.length - w.text.length) <= 1));
  const others = sample(near.length >= 2 ? near : W.filter(x => x !== w), 2);
  const good = make(w, art(w)), all = shuffle([good, ...others.map(x => make(x, art(x)))]);
  return {
    key: w.text,
    text: "Quelle phrase va avec l'image ?",
    say: "Regarde l'image. Lis les phrases, et touche la phrase qui va avec l'image.",
    after: good,
    build: choiceBuild({
      top: `<div class="pic">${artHTML(w.text, w.e)}</div>`,
      choices: all, isRight: s => s === good,
      explain: x => { const lw = x.replace(/[.!?]/g, '').split(' ').pop(); return `Tu as lu : ${x} Regarde bien l'image : est-ce ${FEMININ.has(lw) ? 'une' : 'un'} ${lw} ?`; },
      label: s => `<span class="sentence-choice">${sentenceHTML(parseSentence(s))}</span>`, cls: 'words phrases',
    }),
  };
}
