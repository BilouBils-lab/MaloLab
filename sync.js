'use strict';
/* =========================================================
   1. Mémoire des questions (révisions espacées)
   2. Synchronisation entre appareils (Firebase Realtime Database, API REST)
   (Chargé avant app.js : n'utilise ses fonctions qu'au moment de l'appel.)
   ========================================================= */

// Adresse de la base Firebase de la famille (Realtime Database). Vide = synchronisation désactivée.
const SYNC_DB = window.MALOLAB_SYNC_DB || 'https://malolab-default-rtdb.europe-west1.firebasedatabase.app';
const SYNC_ROOT = 'familles';

// Firebase refuse . $ # [ ] / dans les noms : on les encode (« # » devient « %23 »…)
const safeKey = k => String(k).replace(/[.$#\[\]\/]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).slice(0, 60);
// Répare les noms encodés plusieurs fois par la version précédente (« %252F » → « %2F »)
const fixKey = k => { let x = String(k); while (/%25[0-9A-F]{2}/.test(x)) x = x.replace(/%25([0-9A-F]{2})/g, '%$1'); return safeKey(x); };
// Identifiant court et sûr pour une fiche de fluence
const fluKey = raw => { let h = 5381; for (let i = 0; i < raw.length; i++) h = (Math.imul(h, 33) ^ raw.charCodeAt(i)) >>> 0; return 'f' + h.toString(36) + raw.length.toString(36); };
// Conversion des données déjà enregistrées avec d'anciens noms
function migrateKeys() {
  let changed = false;
  Object.values(state.mem || {}).forEach(m => Object.keys(m).forEach(k => {
    const n = fixKey(k); if (n === k) return;
    const e = m[k], o = m[n]; delete m[k]; changed = true;
    if (!o) m[n] = e; else { o[1] += e[1]; o[2] += e[2]; if (e[0] > o[0]) { o[0] = e[0]; o[3] = e[3]; } }
  }));
  Object.keys(state.fluence || {}).forEach(k => { if (!/^f[a-z0-9]+$/.test(k)) { state.fluence[fluKey(k)] = state.fluence[k]; delete state.fluence[k]; changed = true; } });
  if (changed) try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}
const devId = () => state.devId || (state.devId = 'd' + Math.random().toString(36).slice(2, 10));
const deviceName = () => {
  const ua = navigator.userAgent;
  if (/iPad/.test(ua) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform))) return 'iPad';
  if (/iPhone/.test(ua)) return 'iPhone';
  return 'Autre appareil';
};

/* ---------- Données des autres appareils ---------- */
// Chaque appareil garde ses propres compteurs ; les totaux additionnent tous les appareils.
function others() {
  return Object.entries(state.remote || {})
    .filter(([id]) => id !== state.devId)
    .map(([, d]) => (d && (d.at || 0) < (state.resetSeen || 0)) ? { ...d, stars: 0, act: {}, buys: {} } : (d || {}));
}
const totalStars = () => (state.stars || 0) + others().reduce((s, d) => s + (d.stars || 0), 0);
const actStars = id => (state.act[id] || 0) + others().reduce((s, d) => s + ((d.act || {})[id] || 0), 0);
const fluenceAll = (key, part) => [...others().flatMap(d => (((d.fluence || {})[key] || {})[part]) || []), ...((((state.fluence || {})[key] || {})[part]) || [])];

/* =========================================================
   1. MÉMOIRE
   state.mem[activité][question] = [vu le (ms), réussites, erreurs, dernier résultat (1 = réussi)]
   ========================================================= */
function memGet(actId) {
  const out = {};
  [...others().map(d => (d.mem || {})[actId] || {}), (state.mem || {})[actId] || {}].forEach(m => {
    Object.entries(m || {}).forEach(([k0, e]) => {
      const k = fixKey(k0), o = out[k];
      e = Array.isArray(e) ? e : e && typeof e === 'object' ? [0, 1, 2, 3].map(i => +e[i] || 0) : [0, 0, 0, 1];
      if (!o) out[k] = [...e];
      else { o[1] += e[1]; o[2] += e[2]; if (e[0] > o[0]) { o[0] = e[0]; o[3] = e[3]; } }
    });
  });
  return out;
}
function memRecord(actId, key, ok) {
  state.mem = state.mem || {};
  const m = state.mem[actId] = state.mem[actId] || {}, k = safeKey(key);
  const e = m[k] || [0, 0, 0, 1];
  e[0] = Date.now(); if (ok) e[1]++; else e[2]++; e[3] = ok ? 1 : 0;
  m[k] = e;
  const keys = Object.keys(m);
  if (keys.length > 120) keys.sort((a, b) => m[a][0] - m[b][0]).slice(0, keys.length - 120).forEach(x => delete m[x]);
}
// Choisit la question la plus utile parmi plusieurs tirées au hasard :
// jamais vue > ratée la dernière fois > vue il y a longtemps > vue récemment
function memChoose(act, seen) {
  const M = memGet(act.id), now = Date.now();
  let best = null, bs = -Infinity, first = null;
  for (let t = 0; t < 14; t++) {
    const q = act.make(); if (!q) break;
    if (!first) first = q;
    if (seen.has(q.key)) continue;
    const e = M[safeKey(q.key)], min = e ? (now - e[0]) / 60000 : 0;
    let sc = Math.random() * 2;
    if (!e) sc += 3;
    else if (e[3] === 0) sc += min > 2 ? 6 : 1;                      // ratée : revient dans une prochaine partie
    else sc -= Math.max(0, 8 - Math.log2(1 + min) * 1.2) + (e[1] >= 3 ? 2 : 0); // réussie : s'éloigne, puis revient avec le temps
    if (sc > bs) { bs = sc; best = q; }
  }
  return best || first;
}

/* =========================================================
   2. SYNCHRONISATION
   Arborescence : familles/<code>/devices/<appareil>, familles/<code>/settings, familles/<code>/resetAt
   ========================================================= */
const SETTINGS_KEYS = ['name', 'level', 'caps', 'voice', 'syl', 'known', 'outils', 'theme', 'goal', 'dailyOn', 'mcap'];
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const newFamilyCode = () => 'MALO-' + Array.from({ length: 4 }, () =>
  Array.from({ length: 4 }, () => CODE_CHARS[crypto.getRandomValues(new Uint32Array(1))[0] % CODE_CHARS.length]).join('')).join('-');
const normCode = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^MALO/, '').replace(/(.{4})(?=.)/g, '$1-').replace(/^/, 'MALO-');
const syncOn = () => !!(SYNC_DB && state.syncCode);
const famURL = (path = '') => `${SYNC_DB.replace(/\/$/, '')}/${SYNC_ROOT}/${encodeURIComponent(state.syncCode)}${path}.json`;
const markSettings = () => { state.settingsAt = Date.now(); };

let syncTimer = 0, syncBusy = false;
async function syncNow() {
  if (!syncOn() || syncBusy || navigator.onLine === false) return false;
  syncBusy = true;
  let changed = false;
  try {
    const r = await fetch(famURL(), { cache: 'no-store' });
    if (!r.ok) throw new Error('lecture ' + r.status);
    const fam = (await r.json()) || {};
    // Réglages : le plus récent gagne
    const rs = fam.settings;
    if (rs && (rs.at || 0) > (state.settingsAt || 0)) {
      SETTINGS_KEYS.forEach(k => { if (rs[k] !== undefined) state[k] = rs[k]; });
      state.settingsAt = rs.at; changed = true;
      if (typeof applyTheme === 'function') applyTheme();
    }
    // Remise à zéro demandée depuis un autre appareil
    if ((fam.resetAt || 0) > (state.resetSeen || 0)) { state.stars = 0; state.act = {}; state.buys = {}; state.resetSeen = fam.resetAt; changed = true; }
    const before = JSON.stringify(state.remote || {});
    state.remote = fam.devices || {};
    delete state.remote[devId()];
    if (JSON.stringify(state.remote) !== before) changed = true;
    // Envoi : uniquement les données de cet appareil (+ réglages s'ils sont plus récents)
    const dev = { stars: state.stars || 0, act: state.act || {}, mem: state.mem || {}, fluence: state.fluence || {}, buys: state.buys || {}, at: Date.now(), device: deviceName() };
    if (!state.logBlocked) dev.log = state.log || {};
    const up = { [`devices/${devId()}`]: dev };
    if ((state.settingsAt || 0) > ((rs && rs.at) || 0)) up.settings = Object.assign({ at: state.settingsAt }, ...SETTINGS_KEYS.map(k => ({ [k]: state[k] })));
    if ((state.resetAt || 0) > (fam.resetAt || 0)) up.resetAt = state.resetAt;
    let w = await fetch(famURL(), { method: 'PATCH', body: JSON.stringify(up) });
    // Anciennes règles Firebase qui ne connaissent pas encore le journal du temps : on réessaie sans lui
    if (!w.ok && (w.status === 401 || w.status === 403) && dev.log) {
      delete dev.log; w = await fetch(famURL(), { method: 'PATCH', body: JSON.stringify(up) });
      if (w.ok) state.logBlocked = true;
    } else if (w.ok && dev.log) state.logBlocked = false;
    if (!w.ok) throw new Error('écriture ' + w.status);
    state.lastSync = Date.now(); state.syncError = '';
  } catch (e) {
    state.syncError = String(e.message || e);
  } finally {
    syncBusy = false;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }
  if (changed && typeof onSyncChange === 'function') onSyncChange();
  return !state.syncError;
}
function scheduleSync() { if (!syncOn()) return; clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, 2500); }

function startSync() {
  if (!SYNC_DB) return;
  setTimeout(syncNow, 800);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') syncNow(); });
  window.addEventListener('online', () => syncNow());
}
