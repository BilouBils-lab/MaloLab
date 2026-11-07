// Phrases avec des nombres (étoiles, minutes, mots par minute…) et noms de cartes, pour couvrir toutes les valeurs.
// Usage : node design/voix/extras.js > design/voix/extras.txt  (serveur local :8765)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.goto('http://localhost:8765/');
  const out = await p.evaluate(() => {
    const o = [], R = (a, z) => Array.from({ length: z - a + 1 }, (_, i) => a + i);
    const pl = (n, w) => `${n} ${w}${n > 1 ? 's' : ''}`;
    R(0, 600).forEach(n => { o.push(`Tu as ${etoiles(n)}.`, `Tu avais ${etoiles(n)}.`, `Il te reste ${etoiles(n)}.`, `Dans ta tirelire, tu as ${etoiles(n)}.`); });
    R(0, 30).forEach(n => o.push(`Tu as gagné ${etoiles(n)}.`));
    R(1, 60).forEach(n => o.push(`Il te manque ${etoiles(n)}.`, `Il te manque ${etoiles(n)}, environ ${pl(n, 'partie')}.`, `Encore ${etoiles(n)}, pour X.`, `Les exercices reviennent dans ${pl(n, 'minute')}.`, `On se repose ${pl(n, 'minute')}.`));
    Object.values(RARITY).forEach(r => o.push(`Elle coûte ${etoiles(r.price || r.p || 0)}.`, `Moins ${r.price || r.p || 0}, il te reste 0 étoile.`));
    [...new Set(CARDS.map(c => c.price))].forEach(n => o.push(`Elle coûte ${etoiles(n)}.`, `Moins ${n}, il te reste 0 étoile.`));
    CARDS.forEach(c => o.push(`${c.name}.`, `${c.name} !`, `Pour ${c.name}.`, `${c.name} est à toi !`, `Tu économises pour ${c.name}.`));
    R(0, 60).forEach(n => o.push(`Tu connais ${n} sons, et tu maîtrises 0 questions.`));
    R(0, 800).forEach(n => o.push(`Et tu maîtrises ${n} questions.`));
    R(1, 300).forEach(n => o.push(`Bravo ! ${pl(n, 'seconde')}.`));
    R(0, 250).forEach(n => o.push(`Tu lis ${n} mots par minute.`));
    // Titres, accueil, fins de partie, entraînement du jour, pause, fluence, réglages
    Object.values(ACTS).forEach(d => { o.push(d.title); d.list.forEach(a => o.push(a.title)); });
    o.push('Mon entraînement du jour', "Bientôt ! Il faut encore apprendre quelques sons en classe pour cet exercice.", "Fais glisser la lettre jusqu'à la case qui clignote.");
    for (const nm of ['Malo', '']) {
      Object.values(THEMES).forEach(t => { o.push(`${t.name} !`); t.hello.forEach(h => o.push(h.replace('{n}', nm))); });
      ['Bravo', 'Bien joué', 'Continue comme ça'].forEach(m => o.push(`${m}${nm ? ' ' + nm : ''} !`));
      o.push(`C'est l'heure de la pause ! Bravo${nm ? ' ' + nm : ''}, tu as bien travaillé. On se repose ${PAUSE_LOCK_MIN} minutes.`, `C'est l'heure de la pause ! Bravo${nm ? ' ' + nm : ''}, tu as bien travaillé. Va bouger un peu !`);
      o.push(`Bonjour ${nm} ! Je vais lire les consignes avec cette voix.`, `Bravo ${nm} ! Tu connais 0 sons.`);
    }
    R(0, 30).forEach(n => o.push(`Bravo ! Tu as gagné ${etoiles(n)}.`, `Bravo ! Entraînement du jour réussi. Tu gagnes ${etoiles(n)}, et ${DAILY_BONUS} étoiles bonus.`));
    R(2, 400).forEach(n => o.push(`Ça fait ${n} jours d'affilée !`));
    o.push('Record battu !', 'Bien lu !', 'Bravo !', 'Combien de billes en tout ?', 'Combien en reste-t-il ?');
    R(1, 20).forEach(n => o.push(`Ajoute seulement ${n} billes.`, ...['ronds', 'billes', 'bonbons', 'ballons', 'étoiles'].map(t => `Barre seulement ${n} ${t}.`)));
    try { state.known = GRAPHEMES.map(g => g[0]); for (let lv = 1; lv <= 3; lv++) { const F = fluenceContent(); F.parts.forEach(P => o.push(`${P.title}. Lis à voix haute, le plus vite possible sans te tromper. Appuie sur C'est parti pour lancer le chrono.`)); } } catch {}
    GRAPHEMES.forEach(g => { const id = g[0], sd = SOUND_SAY[id] || id; o.push(`Ça, c'est ${sd}, comme dans ${repere(id)}. On cherche ${sd}, comme dans ${repere(id)}.`); });
    [...new Set([...'abcdefghijklmnopqrstuvwxyzéèêëàâîïôûüç', ...LEXICON.flatMap(w => w.toks.map(t => t.id))])].forEach(l => { const sd = SOUND_SAY[l] || l; o.push(`${sd}, ce n'est pas le premier son. Écoute bien le début : chat.`, `${sd}, ce n'est pas le son suivant. Dis le mot doucement : chat.`); });
    R(1, 300).forEach(n => o.push(`Bravo ! ${pl(n, 'seconde')}`));
    // Dictée de phrases : la phrase, chaque mot seul, les consignes
    const DP = [...new Set([...DICTEES, ...PHRASES.filter(x => x[1]).map(x => x[0])])];
    DP.forEach(t => { o.push(`Écris la phrase : ${t}`, t); t.replace(/[.!?]$/, '').split(' ').forEach(w => o.push(w)); });
    o.push('Écoute la phrase, et écris-la sur ton cahier', 'Voici le modèle. As-tu mis la majuscule et le point ?', 'Corrige sur ton cahier, mot par mot, en regardant bien le modèle.');
    // Félicitations courtes (sans prénom) et félicitations sur l'effort
    SHORT_PRAISE.forEach(x => o.push(x));
    [...Object.values(PROCESS_PRAISE).flat(), ...FIX_PRAISE, ...Object.values(THEMES).flatMap(t => t.praise)].forEach(x => o.push(x + ' !'));
    o.push('Bravo ! Tu connais 0 sons, et tu maîtrises 0 questions.');
    // Tracés et questions qui citent chaque syllabe ou chaque mot
    state.known = GRAPHEMES.map(g => g[0]);
    fusionPool().forEach(x => o.push(`Repasse sur la syllabe ${x[2]},`, `${x[2]} ?`));
    LEXICON.forEach(w => o.push(`Repasse sur le mot ${w.text},`, `${w.text} ?`));
    // Boutique et pause : phrases complètes, pour chaque carte
    o.push("Combien t'en restera-t-il si tu l'achètes ?", 'Il faut être patient !', 'On fait une pause !', 'Si tu achètes celle-ci, il te faudra attendre plus longtemps.');
    CARDS.forEach(c => o.push(`${c.name}. Elle coûte ${etoiles(c.price)}. Tu as 0 étoile. Combien t'en restera-t-il si tu l'achètes ? Attention, tu économises pour ${c.name}. Si tu achètes celle-ci, il te faudra attendre plus longtemps.`,
      `${c.name}. Elle coûte ${etoiles(c.price)}. Il te manque 1 étoile, environ 1 partie. Il faut être patient !`, `C'est ton objectif : ${c.name}.`));
    return o;
  });
  console.log(out.filter(x => !/\bX\b/.test(x) || true).join('\n').replace(/, pour X\./g, ','));
  await b.close();
})();
