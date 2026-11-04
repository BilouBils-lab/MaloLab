"""Complète les phrases à nombres vues dans phrases.txt (comparer, additions, soustractions…).
Usage : python3 design/voix/nombres.py > design/voix/nombres.txt"""
import re, collections
def norm(t): return re.sub(r'\s+', ' ', t.replace('’', "'").replace(' ', ' ')).strip()
def segments(t): return [s for s in re.split(r'(?<=[.!?:;,])\s+', norm(t)) if re.search(r'[0-9a-zà-ÿœæ]', s, re.I)]
obs = collections.defaultdict(list)
for l in open('design/voix/phrases.txt', encoding='utf-8'):
    for s in segments(l):
        t = re.sub(r'\d+', '#', s)
        if '#' in t: obs[t].append(tuple(map(int, re.findall(r'\d+', s))))
def fill(t, vals):
    for v in vals: t = t.replace('#', str(v), 1)
    return t
out = set()
for t, vs in obs.items():
    k = t.count('#'); slots = [set(v[i] for v in vs) for i in range(k)]
    rng = lambda i, hi: sorted(slots[i]) if len(slots[i]) <= 3 else range(0, min(hi, max(slots[i])) + 1)
    low = t.lower()
    if k == 1:
        out.update(fill(t, [a]) for a in rng(0, 100))
    elif k == 2:
        if 'grand' in low: cond, hi = (lambda a, b: a > b), 30
        elif 'petit' in low: cond, hi = (lambda a, b: a < b), 30
        elif 'égal' in low: cond, hi = (lambda a, b: a == b), 30
        elif 'moins' in low: cond, hi = (lambda a, b: b <= a), 20
        elif 'plus' in low: cond, hi = (lambda a, b: a + b <= 20), 20
        else: cond, hi = (lambda a, b: True), 30
        out.update(fill(t, [a, b]) for a in rng(0, hi) for b in rng(1, hi) if cond(a, b))
    elif k == 3:
        if 'moins' in low: tri = [(a, b, a - b) for a in range(21) for b in range(a + 1)]
        elif 'plus' in low: tri = [(a, b, a + b) for a in range(21) for b in range(21 - a)]
        else: tri = vs
        out.update(fill(t, x) for x in tri)
    else:
        out.update(fill(t, x) for x in vs)
print('\n'.join(sorted(out)))
