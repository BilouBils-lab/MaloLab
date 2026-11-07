// Vérifie que les phrases dites hors exercices (boutique, pause, fin de partie…) ont toutes un clip. Serveur local :8765.
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.goto('http://localhost:8765/'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400);
  console.log(await p.evaluate(async () => { await voiceLoad(); const miss = new Map();
    const chk = t => vSegments(t).forEach(s => { if (!Voice.keys.has(vKey(s))) miss.set(vKey(s), t.slice(0, 90)); });
    const g = CARDS[3];
    chk("Fais glisser la lettre jusqu'à la case qui clignote."); chk('Mon entraînement du jour');
    Object.values(ACTS).forEach(d => { chk(d.title); d.list.forEach(a => chk(a.title)); });
    Object.values(THEMES).forEach(t => chk(`${t.name} !`));
    chk('Bientôt ! Il faut encore apprendre quelques sons en classe pour cet exercice.'); RETRY.forEach(chk);
    for (const nm of ['Malo', '']) for (const got of [0, 1, 3, 5]) for (const bal of [0, 7, 30]) for (const msg of ['Bravo', 'Bien joué', 'Continue comme ça']) {
      const tip = bal >= g.price ? `Tu peux acheter ton objectif : ${g.name} !` : `Encore ${etoiles(g.price - bal)}, pour ${g.name}.`;
      chk(`${msg}${nm ? ' ' + nm : ''} ! Tu as gagné ${etoiles(got)}. Dans ta tirelire, tu as ${etoiles(bal)}. ${tip}`);
      chk(`Bravo ! Entraînement du jour réussi. Tu gagnes ${etoiles(got)}, et ${DAILY_BONUS} étoiles bonus. Ça fait 3 jours d'affilée ! Dans ta tirelire, tu as ${etoiles(bal)}.`);
      chk(`Bravo ! Tu as gagné ${etoiles(got)}. Dans ta tirelire, tu as ${etoiles(bal)}.`);
      chk(`C'est l'heure de la pause ! Bravo${nm ? ' ' + nm : ''}, tu as bien travaillé. On se repose ${PAUSE_LOCK_MIN} minutes.`);
      chk(`C'est l'heure de la pause ! Bravo${nm ? ' ' + nm : ''}, tu as bien travaillé. Va bouger un peu !`);
      chk(`Bonjour ${nm} ! Je vais lire les consignes avec cette voix.`);
    }
    chk('Bonjour ! Compte, et touche le bon nombre. Écoute bien : sss, comme dans os. Bien joué !');
    for (const m of [1, 5, 10]) chk(`On fait une pause ! Les exercices reviennent dans ${m} minute${m > 1 ? 's' : ''}.`);
    chk(`Bravo ! Tu connais 15 sons, et tu maîtrises 37 questions.`);
    for (const n of [3, 7]) { chk(`Ajoute seulement ${n} billes.`); chk(`Barre seulement ${n} ronds.`); chk(`Barre seulement ${n} billes.`); }
    chk('Combien de billes en tout ?'); chk('Combien en reste-t-il ?');
    for (const s of [3, 12]) chk(`Bravo ! ${s} secondes. Tu lis 40 mots par minute.`), chk(`Record battu ! ${s} secondes. Tu lis 40 mots par minute.`), chk(`Bien lu ! ${s} secondes`);
    for (const c of CARDS) for (const bal of [0, 5, 40]) { const m = Math.max(1, c.price - bal);
      chk(`${c.name}. Elle est à toi !`);
      chk(`${c.name}. Elle coûte ${etoiles(c.price)}. Tu as ${etoiles(bal)}. Combien t'en restera-t-il si tu l'achètes ? Attention, tu économises pour ${g.name}. Si tu achètes celle-ci, il te faudra attendre plus longtemps.`);
      chk(`${c.name}. Elle coûte ${etoiles(c.price)}. Il te manque ${etoiles(m)}, environ ${partiesFor(m)} partie${partiesFor(m) > 1 ? 's' : ''}. Il faut être patient !`);
      chk(`C'est ton objectif : ${c.name}. Il te manque ${etoiles(m)}.`); chk(`C'est ton objectif : ${c.name}.`);
      chk(`Tu avais ${etoiles(bal + c.price)}. Moins ${c.price}, il te reste ${etoiles(bal)}. ${c.name} est à toi !`); }
    try { state.known = GRAPHEMES.map(x => x[0]); const F = fluenceContent(); F.parts.forEach(P => chk(`${P.title}. Lis à voix haute, le plus vite possible sans te tromper. Appuie sur C'est parti pour lancer le chrono.`)); } catch (e) {}
    return [...miss]; })); await b.close(); })();
