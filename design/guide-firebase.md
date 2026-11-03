# Activer la synchronisation iPhone ↔ iPad (Firebase, gratuit)

Durée : environ 10 minutes, sur un ordinateur de préférence.

## 1. Créer le projet
1. Allez sur https://console.firebase.google.com et connectez-vous avec un compte Google.
2. **Créer un projet** → nom : `malolab` → vous pouvez **désactiver Google Analytics** → **Créer**.

## 2. Créer la base de données
1. Dans le menu de gauche : **Créer → Realtime Database** (« Base de données en temps réel »).
2. **Créer une base de données**.
3. Emplacement : **Belgique (europe-west1)**.
4. Mode : **Démarrer en mode verrouillé** → **Activer**.

## 3. Coller les règles de sécurité
Onglet **Règles** : remplacez tout le contenu par celui du fichier `design/firebase-rules.json`, puis **Publier**.

Ces règles :
- interdisent de lire ou lister la base dans son ensemble ;
- n'autorisent qu'une famille dont on connaît le code exact (`MALO-XXXX-XXXX-XXXX-XXXX`) ;
- n'acceptent que les données de MaloLab, avec la bonne forme et une taille limitée (impossible d'y stocker autre chose) ;
- interdisent d'effacer une famille.

## 4. M'envoyer l'adresse de la base
En haut de l'onglet **Données**, copiez l'adresse qui ressemble à :

`https://malolab-xxxxx-default-rtdb.europe-west1.firebasedatabase.app`

Envoyez-la-moi : je l'ajoute dans l'application.

## 5. Relier les appareils (une seule fois)
1. **iPad** : Espace parents → Synchronisation → **Créer un code famille**. Notez le code affiché.
2. **iPhone** : Espace parents → Synchronisation → tapez le code → **Rejoindre**.

Ensuite, tout se fait tout seul : à chaque ouverture de l'application et après chaque partie.

## Ce qui est enregistré en ligne
Le prénom, les réglages (sons étudiés, univers, voix…), les étoiles, les temps de fluence et les questions réussies ou ratées.
Il n'y a ni photo, ni information sur l'école, ni adresse e-mail.
