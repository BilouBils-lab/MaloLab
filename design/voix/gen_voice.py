"""Génère les clips de la voix de MaloLab (Piper, fr_FR-siwis-medium, jeu de données SIWIS, CC BY 4.0).
Usage : python gen_voice.py phrases.txt ../../voix-siwis   (lancer depuis un venv avec piper-tts, modèle dans le dossier courant)
Chaque phrase est découpée en segments (après . ! ? : ; ,) ; un clip mp3 par segment, nommé par empreinte FNV-1a.
Le découpage et l'empreinte sont identiques à ceux de voice.js."""
import sys, os, re, json, wave, subprocess, tempfile
import numpy as np
from piper import PiperVoice
from piper.config import SynthesisConfig
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from phon import sound, REAL

def norm(t): return re.sub(r'\s+', ' ', t.replace('’', "'").replace(' ', ' ').replace(' ', ' ')).strip()
def merge(s): return re.match(r"^[A-Za-zÀ-ÿ'-]{4,},$", s) and not re.search(r'(.)\1\1', s, re.I)
def segments(t):
    out = []
    for p in re.split(r'(?<=[.!?:;,])\s+', norm(t)):
        if out and merge(out[-1]) and len(p.split(' ')) >= 2: out[-1] += ' ' + p
        else: out.append(p)
    return [s for s in out if re.search(r'[0-9a-zà-ÿœæ]', s, re.I)]
def key(s): return re.sub(r'\s+([!?:;,.])', r'\1', s.lower()).strip()
def fnv(s):
    h = 0x811c9dc5
    for b in s.encode('utf-8'): h = ((h ^ b) * 0x01000193) & 0xffffffff
    return format(h, '08x')

TOK = re.compile(r"[0-9A-Za-zÀ-ÿœæŒÆ'-]+|[^\sA-Za-zÀ-ÿ0-9]")
def phonemes(v, seg):
    toks = TOK.findall(seg); words = [t for t in toks if re.match(r'[0-9A-Za-zÀ-ÿ]', t)]
    alone = len(words) == 1
    out, run = [], []
    def flush():
        if not run: return
        txt = ' '.join(run).replace(" '", "'")
        txt = re.sub(r'\s+([,.:;!?])', r'\1', txt)
        if re.search(r'[0-9A-Za-zÀ-ÿ]', txt):
            ph = v.phonemize(txt)
            for i, s in enumerate(ph):
                if out and out[-1] != ' ': out.append(' ')
                out.extend(s)
        else:
            out.extend([c for c in txt if c in ',.:;!?'])
        run.clear()
    last = words[-1].lower() if words else ''
    for t in toks:
        low = t.lower()
        force = low in SOUNDS or (low in SYL and low not in REAL and (alone or (low == last and low not in COMMON)))
        ov = sound(low) if force else None
        if ov:
            flush()
            if out and out[-1] != ' ': out.append(' ')
            out.extend(['ˈ'] + ov)
        else:
            run.append(t)
    flush()
    while out and out[-1] == ' ': out.pop()
    vowels = sum(1 for x in out if x in 'aeiouyɛɔøœəɑ̃')
    if not out or out[-1] not in ',.:;!?': out.append('.')
    elif out[-1] in ',:;' and vowels < 3: out[-1] = '.'       # segment très court : intonation de fin, plus nette
    if alone and len(out) <= 4 and out[-2] in 'aeiouyɛɔøə': out.insert(-1, 'ː')   # voyelle seule : un peu plus longue
    return out

def loud(a):
    """Normalise le volume : RMS des parties parlées vers -18 dBFS, crête max 0.95."""
    v = a[np.abs(a) > 0.01]
    if not len(v): return a
    g = min(10 ** (-18 / 20) / max(np.sqrt(np.mean(v ** 2)), 1e-6), 0.95 / max(np.abs(a).max(), 1e-6))
    return a * g

SYL = set()
SOUNDS = {'sss', 'mmm', 'lll', 'fff', 'rrr', 'nnn', 'chhh', 'vvv', 'jjj', 'zzz', 'é', 'è'}
COMMON = set('tu as le la les son on il ou a sa ma ta mon ton de du se si ni me te ne je moi toi lu vu va or an au en un est et fin vin pin lin non loi mou fou sou pou cou sol mot rit'.split())
if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    LX = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lexique.json'))); SYL.update(LX['syllables'], LX['graphemes'])
    os.makedirs(dst, exist_ok=True)
    MODEL = os.environ.get('VOIX_MODELE', 'fr_FR-siwis-medium')
    v = PiperVoice.load(MODEL + '.onnx', config_path=MODEL + '.onnx.json')
    cfg = SynthesisConfig(speaker_id=0 if v.config.num_speakers > 1 else None, length_scale=1.08)
    sr = v.config.sample_rate
    segs = {}
    for line in open(src, encoding='utf-8'):
        for s in segments(line):
            segs.setdefault(key(s), s)
    ids = {}
    for k in segs:
        h = fnv(k)
        if h in ids and ids[h] != k: sys.exit(f'collision {k} / {ids[h]}')
        ids[h] = k
    done = 0
    for k, s in segs.items():
        f = os.path.join(dst, fnv(k) + '.mp3')
        if os.path.exists(f): continue
        audio = loud(v.phoneme_ids_to_audio(v.phonemes_to_ids(phonemes(v, s)), cfg))
        pcm = (np.clip(audio, -1, 1) * 32767).astype('<i2').tobytes()
        with tempfile.NamedTemporaryFile(suffix='.wav') as tmp:
            with wave.open(tmp.name, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm)
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp.name, '-af',
                            'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.04',
                            '-ac', '1', '-ar', '22050', '-b:a', '32k', f], check=True)
        done += 1
        if done % 200 == 0: print(done, '/', len(segs), flush=True)
    json.dump(sorted(segs), open(os.path.join(dst, 'index.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('segments', len(segs), 'nouveaux', done)
