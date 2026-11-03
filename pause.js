'use strict';
/* =========================================================
   Rappel de pause
   - Seuil sur le temps de jeu du jour (tous appareils, via le journal du temps)
   - Jamais pendant une question : à la fin d'une partie
   - Mode « doux » (message) ou « strict » (exercices bloqués 10 min, déblocage parent)
   Réglage propre à chaque appareil (state.pauseMin, state.pauseMode).
   (Chargé avant app.js : n'utilise ses fonctions qu'au moment de l'appel.)
   ========================================================= */
const PAUSE_LOCK_MIN = 10;     // durée de la pause en mode strict
const PAUSE_REPEAT_MIN = 10;   // en mode doux : nouveau rappel après 10 min de jeu supplémentaires
const pauseMin = () => (state.pauseMin === undefined ? 20 : +state.pauseMin);
const todaySeconds = () => (logAll()[dayKey()] || [0, 0])[1];
const pauseLocked = () => (state.pauseUntil || 0) > Date.now();

// Faut-il proposer une pause maintenant ?
function pauseDue() {
  const lim = pauseMin(); if (!lim) return false;
  const sec = todaySeconds(); if (sec < lim * 60) return false;
  const mark = state.pauseMark || {};
  return mark.day !== dayKey() || sec - mark.sec >= PAUSE_REPEAT_MIN * 60;
}

// Appelé à la fin d'une partie, une fois l'écran de fin affiché
function pauseCheck() {
  if (!pauseDue()) return;
  state.pauseMark = { day: dayKey(), sec: todaySeconds() };
  const strict = state.pauseMode === 'strict';
  if (strict) state.pauseUntil = Date.now() + PAUSE_LOCK_MIN * 60000;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  setTimeout(() => pauseModal(strict), 3200);   // laisse la voix finir les félicitations
}

function pauseModal(strict) {
  document.querySelectorAll('.modal').forEach(m => m.remove());
  const t = T(), min = Math.round(todaySeconds() / 60);
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal pause"><div class="m-box">
      <div class="end-buddy small" style="--bb:${t.bg}"><img src="${t.img}" alt="" draggable="false"></div>
      <h2>C'est l'heure de la pause !</h2>
      <p class="m-txt">Bravo${state.name ? ' ' + esc(state.name) : ''}, tu as bien travaillé : <b>${min} minutes</b> aujourd'hui.<br>
      ${strict ? `On se repose ${PAUSE_LOCK_MIN} minutes : va boire un verre d'eau, bouger ou jouer dehors !` : 'Et si tu faisais une petite pause ? Va bouger un peu !'}</p>
      <div class="row"><button class="btn" id="p-ok">${ico('check')} D'accord</button></div>
    </div></div>`);
  say(`C'est l'heure de la pause ! Bravo${state.name ? ' ' + state.name : ''}, tu as bien travaillé. ${strict ? `On se repose ${PAUSE_LOCK_MIN} minutes.` : 'Va bouger un peu !'}`);
  document.querySelector('#p-ok').onclick = () => { document.querySelector('.modal.pause').remove(); home(); };
}

// Écran affiché à la place des exercices pendant une pause stricte
let pauseTimer = 0;
function pauseScreen() {
  const t = T();
  const left = () => Math.max(0, Math.ceil(((state.pauseUntil || 0) - Date.now()) / 1000));
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  render(`
    <header class="top"><button class="icon" id="back" aria-label="Retour">${ico('back')}</button><div class="title">Pause</div></header>
    <main class="end pause-screen">
      <div class="end-buddy" style="--bb:${t.bg}"><img src="${t.img}" alt="" draggable="false"></div>
      <h2>On fait une pause !</h2>
      <p class="empty">Les exercices reviennent dans</p>
      <div class="pause-clock" id="p-left">${fmt(left())}</div>
      <p class="empty">En attendant, tu peux regarder ta boutique.</p>
      <div class="row"><button class="btn sec to-shop">${ico('bag')} Ma boutique</button><button class="btn sec" id="p-parent">Parent : débloquer</button></div>
    </main>`);
  say(`On fait une pause ! Les exercices reviennent dans ${Math.max(1, Math.ceil(left() / 60))} minutes.`);
  $('#back').onclick = home;
  $('#p-parent').onclick = () => parentGate(() => { state.pauseUntil = 0; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} home(); });
  clearInterval(pauseTimer);
  pauseTimer = setInterval(() => {
    const el = document.getElementById('p-left');
    if (!el) return clearInterval(pauseTimer);
    const s = left(); el.textContent = fmt(s);
    if (!s) { clearInterval(pauseTimer); state.pauseUntil = 0; sfxOK(); home(); }
  }, 1000);
}
