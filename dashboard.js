'use strict';
/* =========================================================
   Tableau de bord parents : temps passé, réussite par exercice,
   points à retravailler, acquis, fluence. Tous appareils confondus.
   (Chargé avant app.js : n'utilise ses fonctions qu'au moment de l'appel.)
   ========================================================= */

/* ---------- Journal du temps : state.log[AAAAMMJJ] = [parties, secondes] ---------- */
const dayKey = (d = new Date()) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
function logTime(seconds, parties = 0) {
  const s = Math.round(Math.min(Math.max(seconds, 0), 15 * 60));
  if (s < 5 && !parties) return;
  state.log = state.log || {};
  const k = dayKey(), e = state.log[k] || [0, 0];
  e[0] += parties; e[1] += s; state.log[k] = e;
  const keys = Object.keys(state.log).sort();
  keys.slice(0, Math.max(0, keys.length - 60)).forEach(x => delete state.log[x]);
}
function logAll() {
  const all = {};
  [...others().map(d => d.log || {}), state.log || {}].forEach(L => Object.entries(L).forEach(([k, [p, s]]) => {
    const e = all[k] || [0, 0]; e[0] += p || 0; e[1] += s || 0; all[k] = e;
  }));
  return all;
}

/* ---------- Libellés lisibles des questions ---------- */
const unsafe = k => String(k).replace(/%([0-9A-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
function questionLabel(actId, key) {
  const k = unsafe(key);
  let m;
  switch (actId) {
    case 'compter': return (m = k.match(/(\d+)$/)) ? `compter ${m[1]}` : k;
    case 'nlettres': return k.slice(1);
    case 'suite': {
      if ((m = k.match(/^(apres|avant)(\d+)$/))) return `${m[1] === 'apres' ? 'après' : 'avant'} ${m[2]}`;
      if ((m = k.match(/^(suite|rebours)(\d+)-/))) return `${m[1] === 'rebours' ? 'à rebours' : 'suite'} dès ${m[2]}`;
      return k;
    }
    case 'plusun': return `${k.slice(1)} + 1`;
    case 'comparer': return (m = k.match(/^[cs](\d+)-(\d+)$/)) ? `${m[1]} et ${m[2]}` : k;
    case 'soustractions': return k.replace('-', ' − ');
    case 'additions': return k.replace('+', ' + ');
    case 'motifs': return 'un motif';
    case 'meli': return k.replace('/', ' / ');
    default: return k;
  }
}
const ACT_NAMES = () => Object.fromEntries(Object.values(ACTS).flatMap(d => d.list.map(a => [a.id, [a.title, d.title, d.color]])));
const pct = (a, b) => b ? Math.round(a / b * 100) : null;
const fmtMin = s => s >= 3600 ? `${Math.floor(s / 3600)} h ${String(Math.round(s % 3600 / 60)).padStart(2, '0')}` : `${Math.round(s / 60)} min`;

/* ---------- Écran ---------- */
function dashboard() {
  const N = ACT_NAMES(), L = logAll(), now = new Date();
  // 7 derniers jours
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(now); d.setDate(d.getDate() - (6 - i)); return d; });
  const week = days.map(d => ({ d, v: L[dayKey(d)] || [0, 0] }));
  const wSec = week.reduce((s, x) => s + x.v[1], 0), wParts = week.reduce((s, x) => s + x.v[0], 0), wDays = week.filter(x => x.v[1] > 0).length;
  const maxSec = Math.max(60, ...week.map(x => x.v[1]));
  const totalSec = Object.values(L).reduce((s, v) => s + v[1], 0);

  // Réussite par exercice (1re réponse) et points à retravailler
  const rows = [], weak = [], solid = [];
  Object.keys(N).forEach(id => {
    const M = memGet(id); let ok = 0, ko = 0;
    Object.entries(M).forEach(([q, [at, s, e, last]]) => {
      ok += s; ko += e;
      if (e > 0 && (last === 0 || e > s)) weak.push({ id, q, at, s, e });
      else if (s >= 2 && e === 0) solid.push({ id, q });
    });
    if (ok + ko) rows.push({ id, ok, ko, rate: pct(ok, ok + ko) });
  });
  weak.sort((a, b) => (b.e - b.s) - (a.e - a.s) || b.at - a.at);
  const byDomain = Object.entries(ACTS).map(([k, d]) => {
    const r = rows.filter(x => d.list.some(a => a.id === x.id));
    const ok = r.reduce((s, x) => s + x.ok, 0), ko = r.reduce((s, x) => s + x.ko, 0);
    return { k, d, ok, ko, rate: pct(ok, ok + ko), rows: r.sort((a, b) => a.rate - b.rate) };
  });

  // Fluence (fiche actuelle)
  let flu = '';
  try {
    const F = fluenceContent();
    flu = F.parts.map(P => { const h = fluenceAll(F.key, P.id); return h.length ? `<div class="db-flu"><span>${P.title}</span><b>${h.slice(-3).map(fmtTime).join(' → ')}</b></div>` : ''; }).join('');
  } catch {}

  const bar = (rate, color) => rate === null ? '' : `<span class="db-bar"><i style="width:${rate}%;background:${rate >= 80 ? '#2EB67D' : rate >= 60 ? '#F2A23A' : '#E5566D'}"></i></span>`;
  const dayName = d => d.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');

  render(`
    <header class="top">
      <button class="icon" id="back" aria-label="Retour">${ico('back')}</button>
      <div class="title">Tableau de bord</div>
    </header>
    <main class="settings dashboard">
      <section class="db-card">
        <h3>Cette semaine</h3>
        <div class="db-kpis">
          <div><b>${fmtMin(wSec)}</b><small>de jeu</small></div>
          <div><b>${wParts}</b><small>partie${wParts > 1 ? 's' : ''}</small></div>
          <div><b>${wDays}/7</b><small>jours actifs</small></div>
        </div>
        <div class="db-week">${week.map(x => `<div class="db-day${dayKey(x.d) === dayKey() ? ' today' : ''}">
          <span class="db-col"><i style="height:${Math.round(x.v[1] / maxSec * 100)}%"></i></span>
          <small>${dayName(x.d)}</small><em>${x.v[1] ? Math.round(x.v[1] / 60) + "'" : ''}</em></div>`).join('')}</div>
        ${typeof dailyStreak === 'function' ? `<small class="db-note">Entraînement du jour : ${dailyDays().size} jour${dailyDays().size > 1 ? 's' : ''} réussi${dailyDays().size > 1 ? 's' : ''}${dailyStreak() > 1 ? ` · série actuelle : ${dailyStreak()} jours` : ''}${dailyDoneToday() ? ' · fait aujourd\'hui' : ''}</small>` : ''}
        <small class="db-note">Depuis le début : ${fmtMin(totalSec)} · ${etoiles(totalStars())} gagnée${totalStars() > 1 ? 's' : ''} · ${Object.keys(buysAll()).length}/${CARDS.length} cartes</small>
      </section>

      <section class="db-card">
        <h3>Réussite du premier coup</h3>
        ${byDomain.map(x => `
          <details class="db-dom" ${x.rate !== null && x.rate < 70 ? 'open' : ''}>
            <summary style="--c:${x.d.color}"><span class="dt-ic">${domainIcon(x.k)}</span><b>${x.d.title}</b>
              ${x.rate === null ? '<small>pas encore joué</small>' : `${bar(x.rate)}<em>${x.rate} %</em>`}</summary>
            ${x.rows.map(r => `<div class="db-row"><span>${esc(N[r.id][0])}</span>${bar(r.rate)}<em>${r.rate} %</em><small>${r.ok + r.ko} q.</small></div>`).join('') || '<small class="db-note">Aucune réponse enregistrée.</small>'}
          </details>`).join('')}
      </section>

      <section class="db-card">
        <h3>À retravailler</h3>
        ${weak.length ? `<ul class="db-list">${weak.slice(0, 12).map(w => `<li><span class="db-tag" style="--c:${N[w.id] ? N[w.id][2] : '#999'}">${esc(N[w.id] ? N[w.id][0] : w.id)}</span><b>${esc(questionLabel(w.id, w.q))}</b><small>${w.e} erreur${w.e > 1 ? 's' : ''}${w.s ? ` · ${w.s} réussite${w.s > 1 ? 's' : ''}` : ''}</small></li>`).join('')}</ul>
          <small class="db-note">Ces questions reviennent plus souvent dans les parties, jusqu'à ce qu'elles soient réussies.</small>`
          : '<small class="db-note">Rien à signaler pour l\'instant.</small>'}
      </section>

      <section class="db-card">
        <h3>Acquis</h3>
        <p class="db-big">${solid.length} <small>question${solid.length > 1 ? 's' : ''} réussie${solid.length > 1 ? 's' : ''} au moins 2 fois, sans erreur</small></p>
        ${solid.length ? `<div class="db-chips">${solid.slice(0, 30).map(x => `<span>${esc(questionLabel(x.id, x.q))}</span>`).join('')}</div>` : ''}
      </section>

      ${flu ? `<section class="db-card"><h3>Fluence (fiche actuelle)</h3>${flu}<small class="db-note">Les 3 derniers temps, du plus ancien au plus récent.</small></section>` : ''}
      ${state.logBlocked ? `<section class="db-card warn">${ico('warn')} Le temps de jeu n'est pas encore partagé entre les appareils : mettez à jour les règles Firebase (fichier <code>design/firebase-rules.json</code>).</section>` : ''}
    </main>`);
  $('#back').onclick = settings;
}
