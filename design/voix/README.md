# Voix de MaloLab

Voix : **Piper « fr_FR-siwis-medium »**, vitesse `length_scale = 1.08`.

- Modèle : https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR/siwis/medium
- Jeu de données : SIWIS French Speech Synthesis Database (Université d'Édimbourg) — licence **CC BY 4.0**
  (voir `voix-siwis/LICENCE.txt`).
- Choix : la voix « Jessica » (fr_FR-upmc-medium) a été essayée d'abord, mais elle prononçait mal les mots dits seuls
  (trop rapides, consonnes finales avalées : environ 3 mots sur 30 reconnus par Whisper, contre 17 sur 30 pour Siwis).
  `comparaison-jessica-siwis.m4a` : les deux voix sur les mêmes phrases.

## Fonctionnement
- L'application découpe chaque phrase en segments (après `. ! ? : ; ,`) ; chaque segment est un fichier
  `voix-siwis/<empreinte FNV-1a>.mp3`. La liste des segments disponibles est `voix-siwis/index.json`.
- Si un segment manque, toute la phrase est lue par la voix du système (`voice.js`).
- Les sons et syllabes isolés (« sss », « ra », « of », « é »…) sont prononcés par des règles (`phon.py`),
  car eSpeak les lit mal (lettres épelées, lecture à l'anglaise). Les vrais mots restent lus par eSpeak.

## Regénérer (après ajout de phrases dans l'application)
Serveur local lancé à la racine du dépôt : `python3 -m http.server 8765`.
```bash
node design/voix/lexique.js > design/voix/lexique.json     # syllabes et mots de l'app
node design/voix/harvest.js > design/voix/phrases.txt      # phrases dites pendant les exercices
node design/voix/extras.js > design/voix/extras.txt        # phrases avec nombres, noms de cartes
python3 design/voix/nombres.py > design/voix/nombres.txt   # toutes les additions, comparaisons… jusqu’à 20 ou 30
# syllabes.txt : « Tu as choisi / Tu as touché » + chaque syllabe de lexique.json
cat design/voix/phrases.txt design/voix/extras.txt design/voix/nombres.txt design/voix/syllabes.txt > /tmp/tout.txt
# dans un venv avec piper-tts et le modèle (voir ci-dessous) :
python design/voix/gen_voice.py /tmp/tout.txt voix-siwis    # seuls les nouveaux segments sont générés
```
Installer Piper :
```bash
python3 -m venv venv && ./venv/bin/pip install piper-tts
curl -L -o fr_FR-siwis-medium.onnx https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx
curl -L -o fr_FR-siwis-medium.onnx.json https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx.json
```
Domaines réseau nécessaires : `huggingface.co`, `us.aws.cdn.hf.co` (ou `cdn.hf.co`). ffmpeg est aussi nécessaire.
