# P'tit Écolier 🌟

Petite application (PWA) d'exercices pour le CP : maths, lecture, écriture.
Fonctionne sur iPhone et iPad, même hors ligne, une fois ajoutée à l'écran d'accueil.

## Contenu

| Domaine | Activités |
|---|---|
| 🔢 Maths | Compter · Additions · Le plus grand · La suite · Tracer les chiffres |
| 📖 Lecture | Les syllabes (à l'oreille) · Première lettre · Quel mot ? · Lis le mot |
| ✏️ Écriture | Écris le mot (lettres à glisser) · Dictée de syllabes · Tracer les lettres |

- Une partie compte 5 questions. Une réponse juste du premier coup rapporte une ⭐.
- Une voix lit les consignes (🔊 pour réécouter). Toucher l'image ou l'oreille fait entendre le mot.
- Après 2 erreurs dans « Écris le mot », la bonne lettre clignote.
- **Espace parents** : **maintenir** ⚙️ appuyé 1,5 s. Vous y réglez le prénom, le niveau (1 à 3), les minuscules ou MAJUSCULES, la voix, et voyez les étoiles par activité.

## Mettre en ligne (une PWA doit être servie en HTTPS)

**Option la plus simple : Netlify Drop**
1. Allez sur https://app.netlify.com/drop (compte gratuit).
2. Glissez-déposez le dossier `ptit-ecolier` entier.
3. Vous obtenez une adresse `https://xxxx.netlify.app`.

**Option GitHub Pages** : créez un dépôt, envoyez les fichiers, puis Settings → Pages → branche `main`.

## Installer sur l'iPhone / l'iPad
1. Ouvrez l'adresse dans **Safari**.
2. Touchez **Partager** (carré avec une flèche) → **Sur l'écran d'accueil** → **Ajouter**.
3. Lancez l'app depuis l'icône : elle s'ouvre en plein écran et fonctionne hors ligne.

Conseils :
- Désactivez le mode silencieux pour entendre la voix.
- Activez **Accès guidé** (Réglages → Accessibilité) pour que l'enfant reste dans l'app.
- Pour une voix plus naturelle : Réglages → Accessibilité → Contenu énoncé → Voix → Français → téléchargez une voix « améliorée ».

## Modifier l'application
- **Ajouter des mots** : liste `WORDS` en haut de `app.js` (`['mot', '🙂']`).
- **Nombre de questions par partie** : `QUESTIONS_PAR_PARTIE` dans `app.js`.
- **Après chaque modification** : augmentez la version dans `sw.js` (`ptit-ecolier-v2`, etc.).

## Tester sur l'ordinateur
```bash
python3 -m http.server 8000
```
Puis ouvrez http://localhost:8000
