"""Prononciation des sons et syllabes de MaloLab pour Piper (phonèmes eSpeak)."""
G2P = {'ill': 'ij', 'ch': 'ʃ', 'ou': 'u', 'on': 'ɔ̃', 'an': 'ɑ̃', 'oi': 'wa', 'in': 'ɛ̃', 'eu': 'ø', 'au': 'o', 'gn': 'ɲ', 'ph': 'f',
       'a': 'a', 'i': 'i', 'y': 'i', 'ê': 'ɛ', 'ë': 'ɛ', 'û': 'y', 'qu': 'k', 'k': 'k', 'r': 'ʁ', 'o': 'o', 'l': 'l', 'é': 'e', 'è': 'ɛ', 'u': 'y', 's': 's', 'f': 'f', 'e': 'ə', 'm': 'm',
       'n': 'n', 'p': 'p', 't': 't', 'v': 'v', 'd': 'd', 'b': 'b', 'j': 'ʒ', 'c': 'k', 'g': 'ɡ', 'z': 'z', 'x': 'ks'}
CONT = set('ʁlsfmnvzʃʒ')  # consonnes qu'on peut prolonger
SOUND_WORDS = {'rrr': 'r', 'lll': 'l', 'sss': 's', 'fff': 'f', 'mmm': 'm', 'nnn': 'n', 'chhh': 'ch', 'vvv': 'v', 'jjj': 'j', 'zzz': 'z'}

def g2p(tok):
    out, i = [], 0
    while i < len(tok):
        for n in (3, 2, 1):
            g = tok[i:i + n]
            if g in G2P:
                out.append(G2P[g]); i += n; break
        else:
            return None
    return out

def sound(tok):
    """Phonèmes d'un son isolé ou d'une syllabe ; None si ce n'est pas le cas."""
    t = tok.lower()
    if t in SOUND_WORDS: t = SOUND_WORDS[t]
    ph = g2p(t)
    if ph is None: return None
    if len(ph) == 1 and ph[0] in CONT:            # sss : son prolongé
        return list(ph[0] + 'ː' + ph[0] + 'ː')
    if len(ph) == 1 and ph[0] in set('ptkbdɡ') or ph == ['ks'] or ph == ['ɲ']:  # occlusive isolée : « pe »
        return list(ph[0]) + ['ə']
    # o fermé en syllabe ouverte, ouvert devant une consonne finale (or, ol, of)
    if len(ph) >= 2 and ph[-2] == 'o' and ph[-1] not in 'aeiouyəɛø' and len(ph[-1]) == 1:
        ph[-2] = 'ɔ'
    return list(''.join(ph))

# Vrais mots de la liste des syllabes : eSpeak les lit mieux (lettres muettes, e final)
REAL = {'dort', 'file', 'lire', 'mord', 'mot', 'rire', 'rit', 'rouge', 'roule', 'roux', 'sale', 'sol', 'sort', 'vole', 'lira', 'rira'}
