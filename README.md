# MaloLab

Petite application (PWA) d'exercices pour le CP : maths, lecture, écriture.
Fonctionne sur iPhone et iPad, même hors ligne, une fois ajoutée à l'écran d'accueil.

## Contenu

| Domaine | Activités |
|---|---|
| 🔢 Maths | Compter (objets, boîte de 10, dé) · Nombres en lettres · La suite des nombres (à rebours, avant/après) · Ajouter 1 · Comparer (plus/moins/autant, < = >) · Additions · Soustractions · Les motifs · Les formes · Tracer les chiffres |
| 📖 Lecture | Mes sons · Les lettres · J'entends le son · Combine les lettres · Les syllabes · Méli-mélo · Le premier son · Quel mot ? · Lis le mot · Vrai ou faux ? · Fluence (chronomètre) |
| ✏️ Écriture | Écris le mot (graphèmes à glisser : ch, ou, on…) · Dictée de syllabes · Lettres, syllabes et mots attachés (cursive, Apple Pencil) |

- Une partie compte 5 questions. Une réponse juste du premier coup rapporte une ⭐.
- Une voix lit les consignes (🔊 pour réécouter). Toucher l'image ou l'oreille fait entendre le mot.
- Après 2 erreurs dans « Écris le mot », la bonne lettre clignote.
- **Espace parents** : **maintenir** ⚙️ appuyé 1,5 s. Vous y réglez le prénom, le niveau (1 à 3), les minuscules ou MAJUSCULES, la voix, et voyez les étoiles par activité.

## Univers et récompenses

- **Mon univers** (accueil) : l'enfant choisit entre Foot (Tom le buteur), Super-héros (Super Malo), Briques (Brik), Monstres (Zapi) et Dinosaures (Rex).
  Chaque univers a ses couleurs, son compagnon illustré, ses images à compter, ses félicitations et ses mots de lecture.
- Illustrations des compagnons : dossier `assets/` (WebP 512 px, ≈ 25 Ko). Descriptions Gemini : `design/prompts-gemini.md`.
  Pour remplacer un compagnon : déposer `assets/compagnon-<univers>.webp` et mettre à jour `img` dans `THEMES` (`app.js`).
- **Boutique de vignettes** : les étoiles gagnées vont dans la tirelire 🐷 et servent à acheter des vignettes
  (35, 7 par univers environ) : commune 3 ⭐, rare 8 ⭐, super rare 15 ⭐ (animée, brillante), légendaire 30 ⭐ (illustration).
  Avant l'achat : « 12 − 3 = ? ». Une vignette peut être épinglée comme objectif. Pas de tirage au hasard.
  Achats synchronisés entre appareils (`shop.js`).
- Univers inspirés des goûts de l'enfant, sans reprendre de personnages officiels.
- Pour modifier un univers : objet `THEMES` dans `app.js` et section « UNIVERS » de `style.css`.

## Écriture cursive (Apple Pencil)

- Modèle en écriture attachée sur lignes Seyès, point de départ vert, flèches de sens, démonstration animée (« Revoir »).
- Vérification : départ au bon endroit, sens du geste, couverture du modèle, précision, points / barres / accents.
- Dès que l'Apple Pencil est utilisé, la main posée sur l'écran est ignorée.
- Lettres dessinées dans `cursive.js` (tracés vectoriels) ; les mots proposés n'utilisent que les sons étudiés.

## Alignement sur la classe

- **Lecture** : progression du fichier de la classe (L1 a, i, r, o, l, é, u, s, f, e, m, ch, ou, L14 n), mêmes mots repères,
  mots outils de la classe (un, à, il y a, et, est, dans, c'est…), arcs sous les syllabes comme dans le fichier.
  Exercices sur le modèle du fichier : lire les lettres sous toutes leurs formes, entendre un son, combiner les lettres
  (ra / ar), méli-mélo, fluence chronométrée (temps 1, 2, 3).
- **Maths** : taille des nombres réglée automatiquement selon le mois (10 en septembre, 30 jusqu'en décembre, 60 jusqu'en mars, 90 ensuite),
  boîte de 10, « maison » du nombre, signes < et >, soustraction en barrant, motifs, solides et formes planes,
  tracé des chiffres avec point de départ et sens.
- Les mots et phrases sont écrits pour l'application (les textes des manuels ne sont pas recopiés).

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
