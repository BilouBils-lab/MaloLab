'use strict';
/* =========================================================
   « Mon entraînement du jour » (bêta)
   10 questions mêlant lecture, maths et écriture, choisies selon :
   - le dernier son étudié (coché en dernier dans la progression),
   - les exercices les moins réussis récemment (mémoire des questions),
   - les exercices peu pratiqués.
   Une fois par jour : 2 étoiles bonus et une série de jours d'affilée.
   Jours réussis enregistrés dans state.act['jYYYYMMDD'] (déjà synchronisé).
   (Chargé avant app.js : n'utilise ses fonctions qu'au moment de l'appel.)
   ========================================================= */
const DAILY_BONUS = 2;
const DAILY_TOTAL = 10;
const actById = id => { for (const [dk, d] of Object.entries(ACTS)) { const a = d.list.find(x => x.id === id); if (a) return { a, dk, d }; } return null; };
const dailyOn = () => state.dailyOn !== false;

/* ---------- Jours réussis et série ---------- */
function dailyDays() {
  const days = new Set();
  [state.act || {}, ...others().map(d => d.act || {})].forEach(A => Object.keys(A).forEach(k => { if (/^j\d{8}$/.test(k)) days.add(k.slice(1)); }));
  return days;
}
const dailyDoneToday = () => dailyDays().has(dayKey());
function dailyStreak() {
  const D = dailyDays(), d = new Date();
  if (!D.has(dayKey(d))) d.setDate(d.getDate() - 1);   // la série reste valable jusqu'à ce soir
  let n = 0;
  while (D.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/* ---------- Le dernier son étudié ---------- */
function newestSound() {
  const K = knownSet();
  for (let i = GRAPHEMES.length - 1; i >= 0; i--) if (K.has(GRAPHEMES[i][0])) return GRAPHEMES[i][0];
  return null;
}

/* ---------- Choix des exercices ---------- */
// Score d'un exercice : faible réussite et peu pratiqué = prioritaire
function needScore(id) {
  const M = memGet(id); let ok = 0, ko = 0, recentKo = 0;
  Object.values(M).forEach(([, s, e, last]) => { ok += s; ko += e; if (last === 0) recentKo++; });
  const n = ok + ko, rate = n ? ok / n : .7;
  return (1 - rate) * 3 + recentKo * .6 + (n < 6 ? 1.2 : 0) + Math.random() * .8;
}
const usable = id => { const x = actById(id); try { return x && x.a.make && x.a.make(); } catch { return null; } };

function dailyPlan() {
  const ns = newestSound();
  const plan = [];
  const add = (id, n, extra = {}) => { if (usable(id)) for (let k = 0; k < n; k++) plan.push({ id, ...extra }); };
  // 1. Le dernier son (3 questions)
  add('lettres', 1, { force: ns, why: 'son' });
  add('entends', 1, { force: ns, why: 'son' });
  add(pick(['syllabes', 'fusion']), 1, { why: 'son' });
  // 2. Lecture de mots ou de phrases (2 questions), selon le besoin
  const read = ['lismot', 'quelmot', 'bonnephrase', 'meli', 'premierson'].filter(usable).sort((a, b) => needScore(b) - needScore(a));
  read.slice(0, 2).forEach(id => add(id, 1));
  // 3. Maths (3 questions) : les deux exercices qui en ont le plus besoin
  const maths = ['compter', 'nlettres', 'suite', 'plusun', 'comparer', 'additions', 'soustractions', 'motifs', 'formes'].filter(usable).sort((a, b) => needScore(b) - needScore(a));
  if (maths[0]) add(maths[0], 2);
  if (maths[1]) add(maths[1], 1);
  // 4. Écriture (2 questions)
  const write = ['ecrismot', 'dictee'].filter(usable).sort((a, b) => needScore(b) - needScore(a));
  if (write[0]) add(write[0], 1);
  add(pick(['ecrismot', 'dictee', 'cursive-syllabes'].filter(usable)) || 'ecrismot', 1);
  // Compléter si besoin, puis limiter à 10
  const fill = Object.values(ACTS).flatMap(d => d.list).filter(a => a.make && !/^cursive|trace/.test(a.id)).map(a => a.id);
  while (plan.length < DAILY_TOTAL && fill.length) add(pick(fill), 1);
  return plan.slice(0, DAILY_TOTAL);
}

/* ---------- Écran d'accueil de l'entraînement ---------- */
function dailyCardHTML() {
  if (!dailyOn()) return '';
  const done = dailyDoneToday(), st = dailyStreak();
  return `<button class="daily ${done ? 'done' : ''}" id="daily">
    <span class="dl-ic">${done ? ico('check') : ico('sparkle')}</span>
    <span class="dl-txt"><b>${done ? 'Entraînement du jour réussi !' : 'Mon entraînement du jour'}</b>
      <small>${done ? (st > 1 ? `${st} jours d'affilée · encore une fois ?` : 'Bravo ! Tu peux le refaire.') : `10 questions · +${DAILY_BONUS} étoiles bonus${st ? ` · série de ${st} jour${st > 1 ? 's' : ''}` : ''}`}</small></span>
    <span class="dl-go">${ico('next')}</span>
  </button>`;
}

function startDaily() {
  if (pauseLocked()) return pauseScreen();
  const plan = dailyPlan();
  if (!plan.length) return;
  const wasDone = dailyDoneToday();
  const act = {
    id: 'jour', title: 'Mon entraînement du jour', total: plan.length, color: 'var(--good)', noReplay: true,
    back: home,
    make: () => true,
    pick(i, seen) {
      const step = plan[i], x = actById(step.id);
      let q = null;
      for (let t = 0; t < 12 && (!q || seen.has(q.key)); t++) {
        q = step.force && t < 6 ? x.a.make(step.force) : (t < 6 ? memChoose(x.a, seen) : x.a.make());
      }
      return Object.assign(q, { actId: step.id, tag: `${x.d.title} · ${x.a.title}`, color: x.d.color });
    },
    onFinish(got, total) {
      if (wasDone) return { title: 'Entraînement terminé !', say: `Bravo ! Tu as gagné ${etoiles(got)}.` };
      state.act['j' + dayKey()] = 1;
      state.stars += DAILY_BONUS;
      const st = dailyStreak();
      return {
        title: `Entraînement du jour réussi${state.name ? ', ' + state.name : ''} !`,
        html: `<div class="daily-bonus">+${DAILY_BONUS} ${STAR} bonus${st > 1 ? ` · ${st} jours d'affilée !` : ''}</div>`,
        say: `Bravo ! Entraînement du jour réussi. Tu gagnes ${etoiles(got)}, et ${DAILY_BONUS} étoiles bonus.${st > 1 ? ` Ça fait ${st} jours d'affilée !` : ''}`,
      };
    },
  };
  runSession(act, 'lecture');
}
