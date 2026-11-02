# MaloLab 🐘

Petite application (PWA) d'exercices pour le CP : maths, lecture, écriture.
Fonctionne sur iPhone et iPad, même hors ligne, une fois ajoutée à l'écran d'accueil.

## Contenu

| Domaine | Activités |
|---|---|
| 🔢 Maths | Compter · Additions · Le plus grand · La suite · Tracer les chiffres |
| 📖 Lecture | Mes sons (mots repères) · Les syllabes · Le premier son · Quel mot ? · Lis le mot · Vrai ou faux ? (phrases) |
| ✏️ Écriture | Écris le mot (graphèmes à glisser : ch, ou, on…) · Dictée de syllabes · Tracer les lettres |

- Une partie compte 5 questions. Une réponse juste du premier coup rapporte une ⭐.
- Une voix lit les consignes (🔊 pour réécouter). Toucher l'image ou l'oreille fait entendre le mot.
- Après 2 erreurs dans « Écris le mot », la bonne lettre clignote.
- **Espace parents** : **maintenir** ⚙️ appuyé 1,5 s. Vous y réglez le prénom, le niveau (1 à 3), les minuscules ou MAJUSCULES, la voix, et voyez les étoiles par activité.

## Lecture : principes de la méthode Alfi

- **Progression par sons (graphèmes)** : dans l'espace parents, cochez les sons déjà étudiés en classe.
- **100 % décodable** : les exercices n'utilisent que des mots et des phrases écrits avec les sons cochés et les mots outils connus.
- **Aides** : syllabes en couleurs alternées (bleu/rouge), lettres muettes en gris, mots outils soulignés (désactivable).
- L'ordre par défaut des sons est une proposition : **alignez-le sur le cahier de l'enfant**.
- Ajouter un mot : liste `LEX` dans `app.js`, par ex. `['m.ou/t.on', '🐑']`
  (`.` sépare les sons, `/` les syllabes, `(t)` = lettre muette, `s=z` = « s » qui se lit [z]).

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
- **Ajouter des phrases** : liste `PHRASES` dans `app.js` (`['Le chat dort.', true]`).
- **Nombre de questions par partie** : `QUESTIONS_PAR_PARTIE` dans `app.js`.
- **Après chaque modification** : augmentez la version dans `sw.js` (`malolab-v3`, etc.).

## Tester sur l'ordinateur
```bash
python3 -m http.server 8000
```
Puis ouvrez http://localhost:8000
