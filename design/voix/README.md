# Voix Piper (essai, décision en attente)

Voix : **Piper « fr_FR-upmc-medium », locuteur `jessica`** (id 0), vitesse `length_scale = 1.08`.

- Modèle : https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR/upmc/medium
- Jeu de données : UPMC (https://github.com/marytts/upmc-pierre-data) — licence **CC BY-SA 4.0**
  (utilisation libre avec mention de la source ; les fichiers audio générés sont partagés sous la même licence).

`voix-jessica-exemples.m4a` : 10 exemples de MaloLab (36 s).

## Regénérer
```bash
python3 -m venv venv && ./venv/bin/pip install piper-tts
curl -L -o fr_FR-upmc-medium.onnx https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/upmc/medium/fr_FR-upmc-medium.onnx
curl -L -o fr_FR-upmc-medium.onnx.json https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/upmc/medium/fr_FR-upmc-medium.onnx.json
mkdir -p samples && ./venv/bin/python gen_samples.py
```
Domaines réseau nécessaires : `huggingface.co`, `us.aws.cdn.hf.co` (ou `cdn.hf.co`).
