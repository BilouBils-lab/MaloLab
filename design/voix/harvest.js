// Collecte toutes les phrases que MaloLab peut dire (serveur local sur :8765 requis).
// Usage : node design/voix/harvest.js > design/voix/phrases.txt
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 820, height: 1180 }, serviceWorkers: 'block' })).newPage();
  p.on('pageerror', () => {}); p.on('dialog', d => d.dismiss());
  await p.goto('http://localhost:8765/'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(500);
  const all = new Set();
  const cfgs = []; for (const k of [2, 8, 14, 15, 17, 19, 21, 24]) for (const lvl of [10, 90]) for (const st of [1, 2, 3]) cfgs.push([k, lvl, st]);
  for (const [i, cfg] of [...cfgs, null].entries()) {
  await p.reload(); await p.waitForTimeout(300);
  let texts = [];
  try { texts = await p.evaluate(async ([cfg, last]) => {
    const out = new Set(); const add = t => { if (t != null && String(t).trim()) out.add(String(t)); };
    window.say = add;
    const z = document.createElement('div'); z.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#fff;overflow:auto'; document.body.appendChild(z);
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const names = ['Malo', ''];
    if (cfg) { const [k, lvl, st] = cfg;
      state.known = GRAPHEMES.slice(0, k).map(g => g[0]); state.outils = k >= 15 ? MOTS_OUTILS.slice() : DEFAULT_OUTILS.slice(); state.level = lvl; state.calcMode = st;
      state.name = names[(k + st) % 2];
      for (const [dk, d] of Object.entries(ACTS)) for (const a of d.list) {
        if (!a.make) continue;
        for (let i = 0; i < (lvl === 10 && st === 1 ? 120 : 40); i++) {
          let q; try { q = a.make(); } catch { continue; } if (!q) break;
          add(q.say || q.text); add(q.after);
          if (q.build) {
            try { z.innerHTML = ''; q.build(z, (ok, msg) => add(msg)); } catch {}
            z.querySelectorAll('[data-say]').forEach(e => add(e.dataset.say));
            const cs = [...z.querySelectorAll('.choice')];
            for (const c of cs.slice(0, 8)) { try { c.click(); } catch {} z.querySelectorAll('[data-say]').forEach(e => add(e.dataset.say)); }
          }
        }
        add(a.title); add(d.title);
      }
    }
    await wait(cfg ? 2500 : 13000); // messages différés (setTimeout)
    if (cfg) return [...out];
    // Félicitations et consignes générales
    const praise = [...Object.values(PROCESS_PRAISE).flat(), ...FIX_PRAISE, ...Object.values(THEMES).flatMap(t => t.praise)];
    praise.forEach(x => { add(`${x} Malo !`); add(`${x} !`); });
    RETRY.forEach(add);
    Object.values(THEMES).forEach(t => { add(`${t.name} !`); try { state.theme = Object.keys(THEMES).find(k => THEMES[k] === t); add(T().hello || ''); } catch {} });
    // Boutique
    CARDS.forEach(c => { add(`${c.name}. Elle est à toi !`); add(`C'est ton objectif : ${c.name}.`); add(`${c.name} est à toi !`); add(`Tu peux acheter ton objectif : ${c.name} !`); add(`Attention, tu économises pour ${c.name}. Si tu achètes celle-ci, il te faudra attendre plus longtemps.`); add(`Encore 5 étoiles pour ${c.name}.`); add(`Elle coûte ${etoiles(c.price)}.`); add(`Moins ${c.price}, il te reste 3 étoiles.`); });
    return [...out];
  }, [cfg]); } catch (e) { process.stderr.write('retry ' + e.message.slice(0, 60) + '\n'); }
  texts.forEach(t => all.add(t)); process.stderr.write(`${i + 1}/${cfgs.length + 1} ${all.size}\n`);
  }
  console.log([...all].join('\n'));
  await b.close();
})();
