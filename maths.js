'use strict';
/* =========================================================
   Exercices de maths inspirés de la méthode de la classe :
   représentations des nombres, suite des nombres,
   +1, comparer (< >), addition, soustraction, motifs,
   solides et formes planes, tracé des chiffres.
   (Chargé avant app.js : n'utilise ses fonctions qu'au moment de l'appel.)
   ========================================================= */

// Taille des nombres selon la période, comme conseillé par les fiches d'aide aux devoirs
// (septembre : jusqu'à 10 ; octobre-décembre : 30 ; janvier-mars : 60 ; ensuite : 90)
function numMax() {
  if (state.level !== 'auto' && +state.level) return +state.level;
  const m = new Date().getMonth();
  if (m === 8) return 10;
  if (m >= 9) return 30;
  if (m <= 2) return 60;
  return 90;
}
// Taille des calculs (additions, soustractions)
function calcMax() {
  if (state.level !== 'auto' && +state.level) return Math.min(20, Math.max(5, +state.level));
  const m = new Date().getMonth();
  if (m >= 8) return 10;
  if (m <= 2) return 20;
  return 30;
}

/* ---------- Représentations ---------- */
const NUM_WORDS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'];
// Boîte de 10 (cases 2 × 5) ; colors : classe de chaque point (b = bleu, g = vert)
function tenFrame(n, colors = []) {
  let html = '';
  for (let f = 0; f < Math.max(1, Math.ceil(n / 10)); f++) {
    html += '<div class="tf">';
    for (let i = 0; i < 10; i++) { const k = f * 10 + i; html += `<span>${k < n ? `<i class="${colors[k] || ''}"></i>` : ''}</span>`; }
    html += '</div>';
  }
  return `<div class="tfs">${html}</div>`;
}
const DICE = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[25, 25], [50, 50], [75, 75]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]], 6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]] };
const diceSVG = n => `<svg class="dice" viewBox="0 0 100 100"><rect x="5" y="5" width="90" height="90" rx="18"/>${DICE[n].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9"/>`).join('')}</svg>`;

/* ---------- Compter (objets, boîte de 10, dé) ---------- */
function compterQ() {
  const top = Math.min(numMax(), 20);
  const mode = pick(['objets', 'objets', 'boite', 'de']);
  let n, vis;
  if (mode === 'de') { n = rnd(1, 6); vis = diceSVG(n); }
  else if (mode === 'boite') { n = rnd(1, top); vis = tenFrame(n); }
  else { n = rnd(1, Math.min(10, top)); vis = `<div class="count">${emojis(pick(T().count), n)}</div>`; }
  return {
    key: mode + n, text: 'Combien y en a-t-il ?', say: 'Compte, et touche le bon nombre.',
    build: choiceBuild({ top: vis, choices: numChoices(n, 0, Math.max(10, top)), isRight: c => c === n }),
  };
}

/* ---------- Les nombres en chiffres et en lettres ---------- */
function nombresLettresQ() {
  const n = rnd(0, 10), ds = sample([...Array(11).keys()].filter(x => x !== n), 2);
  if (Math.random() < .5) return {
    key: 'w' + n, text: 'Quel est ce nombre ?', say: 'Lis le nombre écrit en lettres, et touche le bon chiffre.',
    build: choiceBuild({ top: `<div class="nword">${cursiveMini(NUM_WORDS[n], 'cw-big')}<span>${NUM_WORDS[n]}</span></div>`, choices: shuffle([n, ...ds]), isRight: x => x === n }),
  };
  return {
    key: 'n' + n, text: `Comment s'écrit ${n} en lettres ?`, say: `Touche le nombre ${n}, écrit en lettres.`,
    build: choiceBuild({ top: `<div class="bignum">${n}</div>`, choices: shuffle([n, ...ds]), isRight: x => x === n, label: x => esc(NUM_WORDS[x]), cls: 'words' }),
  };
}

/* ---------- La suite des nombres (à l'endroit, à rebours, avant / après) ---------- */
function suiteQ() {
  const M = numMax(), kind = pick(['suite', 'rebours', 'apres', 'avant']);
  if (kind === 'apres' || kind === 'avant') {
    const n = kind === 'apres' ? rnd(0, M - 1) : rnd(1, M), ans = kind === 'apres' ? n + 1 : n - 1, mot = kind === 'apres' ? 'après' : 'avant';
    return {
      key: kind + n, text: `Quel nombre vient juste ${mot} ${n} ?`, say: `Quel nombre vient juste ${mot} ${n} ?`,
      build: choiceBuild({
        top: `<div class="seq">${kind === 'avant' ? '<span class="q">?</span>' : ''}<span>${n}</span>${kind === 'apres' ? '<span class="q">?</span>' : ''}</div>`,
        choices: numChoices(ans, 0, M + 1), isRight: c => c === ans,
      }),
    };
  }
  const len = 4, s = rnd(0, Math.max(0, M - len + 1)), miss = rnd(0, len - 1);
  const seq = Array.from({ length: len }, (_, i) => s + i);
  if (kind === 'rebours') seq.reverse();
  const ans = seq[miss];
  return {
    key: kind + s + '-' + miss,
    text: kind === 'rebours' ? 'On compte à rebours : quel nombre manque ?' : 'Quel nombre manque ?',
    say: kind === 'rebours' ? 'On compte à rebours. Quel nombre manque ?' : 'Quel nombre manque dans la suite ?',
    build: choiceBuild({
      top: `<div class="seq">${seq.map((v, i) => i === miss ? '<span class="q">?</span>' : `<span>${v}</span>`).join('')}</div>`,
      choices: numChoices(ans, 0, M + 1), isRight: c => c === ans,
    }),
  };
}

/* ---------- Ajouter 1 à un nombre ---------- */
function plusUnQ() {
  const M = numMax(), n = rnd(0, M - 1);
  const vis = n < 10 ? tenFrame(n + 1, [...Array(n).fill('b'), 'g']) : '';
  return {
    key: 'p' + n, text: `Ajoute 1 à ${n}`, say: `Ajoute 1 au nombre ${n}.`, after: `${n} plus 1, c'est ${n + 1}.`,
    build: choiceBuild({ top: `${vis}<div class="eq">${n} + 1 = <span class="q">?</span></div>`, choices: numChoices(n + 1, 0, M + 1), isRight: c => c === n + 1 }),
  };
}

/* ---------- Comparer : plus / moins / autant, et les signes < = > ---------- */
function comparerQ() {
  if (Math.random() < .4) {
    const a = rnd(1, 7), b = Math.random() < .2 ? a : rnd(1, 7);
    const ans = a > b ? 'plus' : a < b ? 'moins' : 'autant';
    const dots = (n, c) => Array(n).fill(`<i class="dot ${c}"></i>`).join('');
    return {
      key: `c${a}-${b}`, text: 'Plus, moins ou autant ?',
      say: 'Y a-t-il plus, moins, ou autant de ronds orange que de ronds roses ?',
      after: `Il y a ${ans === 'autant' ? 'autant' : ans} de ronds orange que de ronds roses.`,
      build: choiceBuild({
        top: `<div class="cmp-col"><div>${dots(a, 'or')}</div><div>${dots(b, 'pk')}</div></div>`,
        choices: ['plus', 'moins', 'autant'], isRight: x => x === ans, cls: 'cmp3',
        label: x => `<span class="cmp-l">${x}</span><small>de <i class="dot or"></i> que de <i class="dot pk"></i></small>`,
      }),
    };
  }
  const M = numMax(), a = rnd(0, M), b = Math.random() < .15 ? a : rnd(0, M);
  const sign = a < b ? '<' : a > b ? '>' : '=';
  const cubes = n => n <= 10 ? `<div class="cubes">${'<i class="cube"></i>'.repeat(n)}</div>` : '';
  return {
    key: `s${a}-${b}`, text: 'Quel signe faut-il mettre ?', say: `Compare ${a} et ${b}. Quel signe faut-il mettre ?`,
    after: `${a} est ${sign === '<' ? 'plus petit que' : sign === '>' ? 'plus grand que' : 'égal à'} ${b}.`,
    build: choiceBuild({
      top: `<div class="cmp"><div>${cubes(a)}<b>${a}</b></div><span class="q">?</span><div>${cubes(b)}<b>${b}</b></div></div>`,
      choices: ['<', '=', '>'], isRight: x => x === sign, label: x => `<span class="sign">${esc(x)}</span>`,
    }),
  };
}

/* =========================================================
   Addition et soustraction en 3 étapes
   1. Je manipule (je complète la boîte / je barre les ronds)
   2. J'imagine (aide visuelle sans la réponse, bouton « Aide »)
   3. Je calcule (les nombres seulement)
   Mode « progressif » : 4 réussites du premier coup → étape suivante ;
   une erreur → étape précédente. Réglage parent : state.calcMode.
   ========================================================= */
const STAGE_NAMES = { add: ['', 'Je complète', 'Je compte à partir de', 'Je calcule'], sub: ['', 'Je barre', "J'imagine", 'Je calcule'] };
const STAGE_WINS = 4;
function calcStage(op) {
  const m = state.calcMode;
  if (m === 1 || m === 2 || m === 3) return m;
  return ((state.calc || {})[op] || {}).stage || 1;
}
// Retourne un message si l'enfant change d'étape
function calcResult(op, stage, firstTry, helped) {
  if (state.calcMode && state.calcMode !== 'auto') return '';
  state.calc = state.calc || {};
  const c = state.calc[op] = state.calc[op] || { stage: 1, wins: 0 };
  if (c.stage !== stage) return '';
  let msg = '';
  if (firstTry && !helped) {
    if (++c.wins >= STAGE_WINS && c.stage < 3) { c.stage++; c.wins = 0; msg = ' Tu passes à l\'étape suivante !'; }
  } else if (!firstTry) {
    c.wins = 0; if (c.stage > 1) c.stage--;
  }
  return msg;
}
const bondSVG = (a, b, t) => `<svg class="bond" viewBox="0 0 130 100"><line x1="30" y1="26" x2="98" y2="50"/><line x1="30" y1="74" x2="98" y2="50"/>
  <circle cx="30" cy="26" r="20" class="b"/><circle cx="30" cy="74" r="20" class="g"/><circle cx="98" cy="50" r="23" class="t"/>
  <text x="30" y="34" class="b">${a}</text><text x="30" y="82" class="g">${b}</text><text x="98" y="59" class="t">${t}</text></svg>`;

// Boutons de réponse (verrouillables) + gestion du premier essai et de la correction
function calcChoices(z, choices, right, onWrong, done) {
  const box = document.createElement('div');
  box.className = 'choices'; box.innerHTML = choices.map((c, k) => `<button class="choice" data-k="${k}">${c}</button>`).join('');
  z.appendChild(box);
  box.querySelectorAll('.choice').forEach(btn => btn.addEventListener('click', () => {
    const v = choices[+btn.dataset.k];
    if (v === right) { btn.classList.add('good'); box.querySelectorAll('.choice').forEach(x => x.disabled = true); done(true); }
    else { btn.classList.add('bad'); btn.disabled = true; onWrong(); done(false); }
  }));
  return box;
}

/* ---------- L'addition ---------- */
function additionQ() {
  const M = calcMax(), s = rnd(2, M), a = rnd(1, s - 1), b = s - a;
  const stage = s > 10 && calcStage('add') === 1 ? 2 : calcStage('add');   // boîte de 10 jusqu'à 10
  const N = STAGE_NAMES.add;
  return {
    key: `${a}+${b}`, tag: `Étape ${stage} · ${N[stage]}${stage === 2 ? ' ' + a : ''}`,
    text: `${a} + ${b} = ?`,
    say: stage === 1 ? `Combien font ${a} plus ${b} ? Ajoute ${b} billes dans la boîte, puis touche le résultat.`
      : stage === 2 ? `Combien font ${a} plus ${b} ? Pars de ${a}, et compte ${b} de plus.` : `Combien font ${a} plus ${b} ?`,
    after: `${a} plus ${b} est égal à ${s}.`,
    build(z, answer) {
      const q = this; let firstTry = true, helped = false;
      const cells = Math.max(10, Math.ceil(s / 10) * 10);
      const frameHTML = (filled, interactive) => `<div class="tfs">${Array.from({ length: cells / 10 }, (_, f) => `<div class="tf${interactive ? ' tap' : ''}">${Array.from({ length: 10 }, (_, k) => {
        const n = f * 10 + k; return `<span data-n="${n}">${n < a ? '<i class="b"></i>' : filled.has(n) ? '<i class="g pop-in"></i>' : ''}</span>`; }).join('')}</div>`).join('')}</div>`;
      const eq = `<div class="eq">${a} + ${b} = <span class="q">?</span></div>`;
      const showCorrection = () => {
        const old = z.querySelector('.calc-vis'); if (old) old.remove();
        z.insertAdjacentHTML('afterbegin', `<div class="calc-vis corr">${tenFrame(s, [...Array(a).fill('b'), ...Array(b).fill('g')])}<small>${a} et encore ${b}, ça fait ${s}</small></div>`);
      };
      const finish = ok => {
        if (!ok) { firstTry = false; return answer(false, `Regarde bien : ${a} plus ${b}.`); }
        q.after += calcResult('add', stage, firstTry, helped);
        answer(true);
      };
      const choices = () => calcChoices(z, numChoices(s, 0, M + 3), s, showCorrection, finish);
      const manipulate = () => {
        const added = new Set();
        z.innerHTML = `<div class="calc-vis">${frameHTML(added, true)}</div><div class="calc-cnt">Billes ajoutées : <b>0</b> / ${b}</div>${eq}`;
        const box = choices(); box.classList.add('locked');
        z.querySelector('.calc-vis').addEventListener('click', e => {
          const cell = e.target.closest('span[data-n]'); if (!cell) return;
          const n = +cell.dataset.n; if (n < a) return;
          if (added.has(n)) added.delete(n);
          else if (added.size < b) added.add(n);
          else { const c = z.querySelector('.calc-cnt'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); say(`Ajoute seulement ${b} billes.`); return; }
          sfxPop();
          z.querySelector('.calc-vis').innerHTML = frameHTML(added, true);
          z.querySelector('.calc-cnt b').textContent = added.size;
          if (added.size === b && box.classList.contains('locked')) { box.classList.remove('locked'); say('Combien de billes en tout ?'); }
          else if (added.size < b) box.classList.add('locked');
        });
      };
      if (stage === 1) return manipulate();
      if (stage === 2) {
        z.innerHTML = `<div class="calc-vis add2"><span class="from">${a}</span><span class="plus">+</span><span class="more">${'<i class="dotg"></i>'.repeat(b)}</span></div>${eq}`;
        choices();
        z.insertAdjacentHTML('beforeend', `<button class="m-link help" id="c-help">Aide : je complète la boîte</button>`);
        z.querySelector('#c-help').onclick = () => { helped = true; if (s <= 10) manipulate(); else showCorrection(); };
        return;
      }
      z.innerHTML = `<div class="calc-vis">${bondSVG(a, b, '?')}</div>${eq}`;
      choices();
    },
  };
}

/* ---------- La soustraction ---------- */
function soustractionQ() {
  const M = Math.min(calcMax(), 10), a = rnd(2, M), b = rnd(1, a - 1), d = a - b;
  const story = Math.random() < .3, stage = calcStage('sub'), N = STAGE_NAMES.sub;
  const thing = story ? 'billes' : 'ronds';
  return {
    key: `${a}-${b}`, tag: `Étape ${stage} · ${N[stage]}`,
    text: story ? `J'ai ${a} billes, j'en donne ${b}. Combien en reste-t-il ?` : `${a} − ${b} = ?`,
    say: (story ? `J'ai ${a} billes. J'en donne ${b}. Combien de billes me reste-t-il ?` : `Combien font ${a} moins ${b} ?`)
      + (stage === 1 ? ` Barre ${b} ${thing}, puis touche le résultat.` : ''),
    after: `${a} moins ${b} est égal à ${d}.`,
    build(z, answer) {
      const q = this; let firstTry = true, helped = false;
      const circles = (crossed, interactive) => `<div class="subs${interactive ? ' tap' : ''}">${Array.from({ length: a }, (_, i) =>
        `<${interactive ? 'button' : 'i'} class="sub${crossed.has(i) ? ' x now' : ''}${story ? ' marble' : ''}" data-i="${i}" aria-label="rond ${i + 1}"></${interactive ? 'button' : 'i'}>`).join('')}</div>`;
      const eq = `<div class="eq">${a} − ${b} = <span class="q">?</span></div>`;
      const showCorrection = () => {
        const old = z.querySelector('.calc-vis'); if (old) old.remove();
        z.insertAdjacentHTML('afterbegin', `<div class="calc-vis corr"><div class="subs">${Array.from({ length: a }, (_, i) => { const x = i >= d;
          return `<i class="sub${x ? ' x' : ''}${story ? ' marble' : ''}" style="--d:${x ? (i - d) * .3 + .2 : 0}s"></i>`; }).join('')}</div><small>On en enlève ${b}, il en reste ${d}</small></div>`);
      };
      const finish = ok => {
        if (!ok) { firstTry = false; return answer(false, `Regarde bien : ${a} moins ${b}.`); }
        q.after += calcResult('sub', stage, firstTry, helped);
        answer(true);
      };
      const choices = () => calcChoices(z, numChoices(d, 0, M), d, showCorrection, finish);
      const manipulate = () => {
        const crossed = new Set();
        z.innerHTML = `<div class="calc-vis">${circles(crossed, true)}</div><div class="calc-cnt">${story ? 'Billes données' : 'Ronds barrés'} : <b>0</b> / ${b}</div>${eq}`;
        const box = choices(); box.classList.add('locked');
        z.querySelector('.calc-vis').addEventListener('click', e => {
          const c = e.target.closest('.sub'); if (!c) return;
          const i = +c.dataset.i;
          if (crossed.has(i)) crossed.delete(i);
          else if (crossed.size < b) crossed.add(i);
          else { const k = z.querySelector('.calc-cnt'); k.classList.remove('shake'); void k.offsetWidth; k.classList.add('shake'); say(`Barre seulement ${b} ${thing}.`); return; }
          sfxPop();
          z.querySelector('.calc-vis').innerHTML = circles(crossed, true);
          z.querySelector('.calc-cnt b').textContent = crossed.size;
          if (crossed.size === b && box.classList.contains('locked')) { box.classList.remove('locked'); say(`Combien en reste-t-il ?`); }
          else if (crossed.size < b) box.classList.add('locked');
        });
      };
      if (stage === 1) return manipulate();
      if (stage === 2) {
        z.innerHTML = `<div class="calc-vis">${circles(new Set(), false)}</div>${eq}`;
        choices();
        z.insertAdjacentHTML('beforeend', `<button class="m-link help" id="c-help">Aide : je barre les ${thing}</button>`);
        z.querySelector('#c-help').onclick = () => { helped = true; manipulate(); };
        return;
      }
      z.innerHTML = eq; choices();
    },
  };
}

/* ---------- Les motifs (suites logiques) ---------- */
const BEADS = ['#3A86FF', '#E63946', '#F6C445', '#2EC4B6', '#9B5DE5'];
const PATTERNS = ['AB', 'AAB', 'ABB', 'ABC', 'AABB'];
function motifQ() {
  const pat = pick(PATTERNS), letters = [...new Set(pat)], useArt = Math.random() < .4;
  const pool = useArt ? T().count : BEADS;
  const items = sample(pool, letters.length);
  const map = Object.fromEntries(letters.map((l, i) => [l, items[i]]));
  const len = pat.length * 2 + rnd(0, pat.length - 1);
  const seq = Array.from({ length: len }, (_, i) => map[pat[i % pat.length]]);
  const ans = map[pat[len % pat.length]];
  const ds = [...items.filter(x => x !== ans), ...shuffle(pool.filter(x => !items.includes(x)))].slice(0, 2);
  const show = x => useArt ? artHTML(x, x) : `<i class="bead" style="--b:${x}"></i>`;
  return {
    key: pat + items.join(), text: 'Qu\'est-ce qui vient ensuite ?', say: 'Regarde bien le motif. Qu\'est-ce qui vient ensuite ?',
    build: choiceBuild({
      top: `<div class="motif${useArt ? ' art' : ''}">${seq.map(show).join('')}<span class="q">?</span></div>`,
      choices: shuffle([ans, ...ds]), isRight: x => x === ans, label: show, cls: 'pics',
    }),
  };
}

/* ---------- Les solides et les formes planes ---------- */
const SHAPES = {
  triangle: ['le', '<polygon points="50,10 92,86 8,86" fill="#F2A65A"/>'],
  carré: ['le', '<rect x="16" y="16" width="68" height="68" fill="#6FA8DC"/>'],
  rectangle: ['le', '<rect x="6" y="28" width="88" height="46" fill="#8CC084"/>'],
  disque: ['le', '<circle cx="50" cy="50" r="38" fill="#E8685A"/>'],
  cube: ['le', '<polygon points="18,36 56,36 56,88 18,88" fill="#4FA3A0"/><polygon points="18,36 38,16 76,16 56,36" fill="#7CC4C1"/><polygon points="56,36 76,16 76,68 56,88" fill="#3A8582"/>'],
  pavé: ['le', '<polygon points="26,30 54,30 54,94 26,94" fill="#D9566A"/><polygon points="26,30 42,12 70,12 54,30" fill="#EA8495"/><polygon points="54,30 70,12 70,76 54,94" fill="#B23F52"/>'],
  boule: ['la', '<defs><radialGradient id="g-boule" cx=".35" cy=".35"><stop offset="0" stop-color="#F6C6EC"/><stop offset="1" stop-color="#A64C9A"/></radialGradient></defs><circle cx="50" cy="52" r="38" fill="url(#g-boule)"/>'],
  cylindre: ['le', '<path d="M24 20 L24 82 A26 9 0 0 0 76 82 L76 20Z" fill="#5D7FD6"/><ellipse cx="50" cy="20" rx="26" ry="9" fill="#8EA7EC"/>'],
  cône: ['le', '<path d="M50 8 L82 80 A32 10 0 0 1 18 80Z" fill="#E8CE4A"/><path d="M18 80 A32 10 0 0 0 82 80" fill="none"/>'],
};
const shapeSVG = k => `<svg class="shape" viewBox="0 0 100 100">${SHAPES[k][1]}</svg>`;
function formesQ() {
  const names = Object.keys(SHAPES), target = pick(names);
  const choices = shuffle([target, ...sample(names.filter(n => n !== target), 2)]);
  return {
    key: target, text: `Touche ${SHAPES[target][0]} ${target}`, say: `Touche ${SHAPES[target][0]} ${target}.`,
    after: `C'est ${SHAPES[target][0] === 'la' ? 'une' : 'un'} ${target}.`,
    build: choiceBuild({ choices, isRight: x => x === target, label: shapeSVG, cls: 'pics shapes' }),
  };
}

/* ---------- Tracer les chiffres (point de départ et sens, comme dans la leçon) ---------- */
// Repère : bas du chiffre y = 0, haut y = -20, largeur 12. Le 1er tracé part du point vert.
const DIGITS = {
  0: ['M6 -20 C1.5 -20 0 -14.5 0 -10 C0 -4 2 0 6 0 C10 0 12 -4 12 -10 C12 -15.5 10.5 -20 6 -20'],
  1: ['M2 -14.5 L8.5 -20 L8.5 0'],
  2: ['M0.8 -15.5 C1.5 -20 11 -21 11 -15 C11 -10 3 -5 0.5 0 L12 0'],
  3: ['M1 -18 C4 -21 11 -20.5 11 -15.5 C11 -12.5 8.5 -11 6 -11 C9 -11 12 -9 12 -5.5 C12 0.5 3 1 0 -2'],
  4: ['M8.5 -20 L0 -6.5 L12 -6.5', 'M9 -12.5 L9 0'],
  5: ['M11 -20 L2.5 -20 L1.6 -11.5 C4 -13 12 -13.5 12 -6.5 C12 0.5 3.5 1 0 -2'],
  6: ['M10.5 -19 C7 -21.5 0 -18 0 -8.5 C0 -2.5 2.5 0 6 0 C10 0 12 -3 12 -6.5 C12 -10 9.5 -12.5 6 -12.5 C3 -12.5 0.6 -10.5 0.3 -7.5'],
  7: ['M0 -20 L12 -20 L4 0', 'M3.5 -10 L10.5 -10'],
  8: ['M11 -16 C11 -19 9 -20.5 6 -20.5 C3 -20.5 1 -19 1 -16 C1 -12 11 -9.5 11 -4.5 C11 -1.5 9 0 6 0 C3 0 1 -1.5 1 -4.5 C1 -9.5 11 -12 11 -16'],
  9: ['M11 -15.5 C11 -19 9 -20.5 6 -20.5 C2.5 -20.5 0.5 -18 0.5 -15 C0.5 -11.5 3 -10 6 -10 C9 -10 11 -12 11 -15.5 L11 -6 C11 -2 8 0 4.5 0 C3 0 1.8 -0.4 1 -1'],
};
function digitLayout(d) {
  const [main, ...extras] = DIGITS[d];
  const [sx, sy] = main.match(/^M(-?[\d.]+) (-?[\d.]+)/).slice(1).map(Number);
  return { main, extras, width: 12, start: [sx, sy] };
}
function chiffreTraceQ() {
  const d = String(rnd(0, 9));
  return cursiveQ(d, 'le chiffre', { layout: digitLayout, title: `Trace le chiffre <b class="cw">${d}</b>` });
}
