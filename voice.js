'use strict';
/* =========================================================
   Voix « Jessica » de MaloLab
   Clips pré-enregistrés avec Piper (voix fr_FR-upmc-medium, locuteur jessica,
   jeu de données UPMC, licence CC BY-SA 4.0). Une phrase est découpée en segments
   (après . ! ? : ; ,) ; chaque segment est un fichier voix/<empreinte>.mp3.
   Si un segment manque, toute la phrase est lue par la voix du système.
   Découpage et empreinte identiques à design/voix/gen_voice.py.
   (Chargé avant app.js : n'utilise ses fonctions qu'au moment de l'appel.)
   ========================================================= */
const VOICE_DIR = 'voix/';
const vNorm = t => String(t).replace(/’/g, "'").replace(/[  ]/g, ' ').replace(/\s+/g, ' ').trim();
const vSegments = t => vNorm(t).replace(/([.!?:;,])\s+/g, '$1\u0000').split('\u0000').filter(s => /[0-9a-zà-ÿœæ]/i.test(s));
const vKey = s => s.toLowerCase().replace(/\s+([!?:;,.])/g, '$1').trim();
function vHash(s) {
  let h = 0x811c9dc5;
  for (const b of new TextEncoder().encode(s)) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
const VOICE_GAP = { ',': 0.1, ':': 0.18, ';': 0.18, '.': 0.28, '!': 0.28, '?': 0.3 };
const Voice = { keys: null, loading: null, bufs: new Map(), token: 0, nodes: [], miss: [] };

function voiceLoad() {
  if (!Voice.loading) Voice.loading = fetch(VOICE_DIR + 'index.json').then(r => r.ok ? r.json() : []).catch(() => [])
    .then(a => { Voice.keys = new Set(a); });
  return Voice.loading;
}
function voiceCtx() {
  // iOS : jouer même si l'iPhone est en mode silencieux, comme la voix du système
  try { if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback'; } catch {}
  ac = ac || new (window.AudioContext || window.webkitAudioContext)();
  if (ac.state === 'suspended') ac.resume();
  return ac;
}
function voiceClip(k) {
  let p = Voice.bufs.get(k);
  if (!p) {
    p = fetch(VOICE_DIR + vHash(k) + '.mp3').then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then(ab => new Promise((res, rej) => voiceCtx().decodeAudioData(ab, res, rej)));
    p.catch(() => Voice.bufs.delete(k));
    Voice.bufs.set(k, p);
    if (Voice.bufs.size > 400) Voice.bufs.delete(Voice.bufs.keys().next().value);
  }
  return p;
}
function voiceStop() {
  Voice.token++;
  Voice.nodes.forEach(n => { try { n.stop(); } catch {} });
  Voice.nodes = [];
}
// true : la phrase est prise en charge (jouée, ou ignorée avant le premier geste) ; false : utiliser la voix du système
function voiceSay(text, onFail) {
  if (!Voice.keys) { voiceLoad(); return false; }
  const segs = vSegments(text).map(s => ({ k: vKey(s), end: s.slice(-1) }));
  if (!segs.length) return true;
  const missing = segs.filter(s => !Voice.keys.has(s.k));
  if (missing.length) { Voice.miss.push(...missing.map(s => s.k)); if (Voice.miss.length > 200) Voice.miss.splice(0, 100); return false; }
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return true;   // l'iPhone n'autorise le son qu'après un toucher
  const tok = ++Voice.token, ctx = voiceCtx();
  Promise.all(segs.map(s => voiceClip(s.k))).then(bufs => {
    if (tok !== Voice.token) return;
    let t = ctx.currentTime + 0.03;
    bufs.forEach((b, i) => {
      const src = ctx.createBufferSource(); src.buffer = b; src.connect(ctx.destination); src.start(t);
      Voice.nodes.push(src); t += b.duration + (VOICE_GAP[segs[i].end] || 0.12);
    });
  }).catch(() => { if (tok === Voice.token && onFail) onFail(); });
  return true;
}
voiceLoad();
