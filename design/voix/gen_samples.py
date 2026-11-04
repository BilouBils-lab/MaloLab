import wave, sys
from piper import PiperVoice
from piper.config import SynthesisConfig
voice = PiperVoice.load('fr_FR-upmc-medium.onnx', config_path='fr_FR-upmc-medium.onnx.json')
cfg = SynthesisConfig(speaker_id=0, length_scale=1.08)  # jessica, un peu plus lent pour un enfant
items = [
  ('01-consigne', "Touche la syllabe : ra."),
  ('02-bravo', "Bravo, Malo !"),
  ('03-entends', "Écoute : souris. Est-ce que tu entends ou, comme dans souris ?"),
  ('04-calcul', "Combien font trois plus cinq ?"),
  ('05-mots', "chat. vélo. fourmi. cheminée."),
  ('06-syllabes', "ra. mi. lou. cha. né."),
  ('07-phrase', "Le chat chasse la souris."),
  ('08-consigne2', "Lis le mot, et touche la bonne image."),
  ('09-pause', "C'est l'heure de la pause ! Bravo Malo, tu as bien travaillé."),
  ('10-fin', "Bien joué Malo ! Tu as gagné quatre étoiles. Dans ta tirelire, tu as douze étoiles."),
]
all_frames = []
for name, text in items:
    with wave.open(f'samples/{name}.wav', 'wb') as w:
        voice.synthesize_wav(text, w, syn_config=cfg)
    print(name, 'ok')
