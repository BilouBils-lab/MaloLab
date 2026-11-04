// Exporte les syllabes et sons (à prononcer « à la main ») et les vrais mots de MaloLab.
// Usage : node design/voix/lexique.js > design/voix/lexique.json  (serveur local :8765)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:8765/'); await p.evaluate(() => localStorage.clear()); await p.reload();
  const r = await p.evaluate(() => {
    state.known = GRAPHEMES.map(g => g[0]);
    const syl = new Set([...fusionPool().map(x => x[2]), ...(typeof meliPairs === 'function' ? meliPairs().flat() : []), ...GRAPHEMES.map(g => g[0])]);
    const words = new Set([...LEXICON.map(w => w.text), ...(typeof MOTS_OUTILS !== 'undefined' ? MOTS_OUTILS.map(m => m.text || m[0] || m) : [])].map(x => String(x).toLowerCase()));
    return { graphemes: GRAPHEMES.map(g => g[0]), sounds: SOUND_SAY, syllables: [...syl].filter(s => !words.has(s)).sort(), words: [...words].sort() };
  });
  console.log(JSON.stringify(r, null, 1)); await b.close();
})();
