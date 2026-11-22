# Apocalypse — Mémorisation mot pour mot

Application web progressive (PWA) mobile-first pour apprendre par cœur le livre de l’Apocalypse, un verset à la fois. Cinq niveaux progressifs, répétition espacée, série quotidienne et fonctionnement hors-ligne.

> **Édition biblique : Louis Segond 1920, exclusivement.**
> L’application n’utilise, n’affiche et ne prévoit aucune autre traduction, paraphrase ou version biblique.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Édition, fidélité et respect de tous](#édition-fidélité-et-respect-de-tous)
- [Stack technique](#stack-technique)
- [Démarrage](#démarrage)
- [Structure du projet](#structure-du-projet)
- [Ajouter des chapitres](#ajouter-des-chapitres)
- [Progression, série et répétition espacée](#progression-série-et-répétition-espacée)
- [PWA, hors-ligne et notifications](#pwa-hors-ligne-et-notifications)
- [Accessibilité et design](#accessibilité-et-design)
- [Vérifications](#vérifications)
- [Limites connues](#limites-connues)
- [Signaler une erreur](#signaler-une-erreur)

## Fonctionnalités

### Cinq niveaux par verset

Les niveaux se débloquent dans l’ordre. Chaque réussite est enregistrée immédiatement dans le navigateur.

| Niveau | Nom | Mécanique |
| --- | --- | --- |
| 1 | Imprégnation | Texte intégral, lecture audio en français via `speechSynthesis`, validation « J’ai lu et compris ». |
| 2 | Premières lettres | Seule la première lettre de chaque mot est visible (`J____-C_____`). Un toucher révèle un mot oublié. |
| 3 | Texte à trous | Environ 50 % des mots sont masqués, en priorité les mots pleins. Remplissage depuis une banque de mots mélangés. |
| 4 | Puzzle de mots | Le verset est découpé en segments de 2 à 3 mots, mélangés, à remettre dans l’ordre. |
| 5 | Maîtrise | Restitution au clavier ou à la dictée vocale, avec comparaison mot à mot en vert et rouge. |

La vérification du niveau 5 tolère la ponctuation, les majuscules et les ligatures typographiques (`œil` / `oeil`). L’orthographe et les accents restent stricts.

### Répétition espacée

À la première maîtrise d’un verset, une révision est programmée à **J+1**, puis l’intervalle s’allonge à chaque réussite : **J+3, J+7, J+14, J+30**. Un échec ramène le verset à **J+1** sans effacer les cinq niveaux acquis.

L’onglet « Révisions » affiche les versets arrivés à échéance, les prochaines échéances et l’échelle de répétition.

### Assiduité et rappels

- Série de jours consécutifs avec au moins une activité.
- Objectif quotidien configurable de 1 à 10 versets (3 par défaut).
- Barre de progression de l’objectif dans l’en-tête et rappel visuel des révisions dues.
- Notification navigateur optionnelle, affichée à l’ouverture de l’application les jours de révision.

### Parcours

- Vue d’ensemble des **22 chapitres**, avec le pourcentage de maîtrise de chacun.
- Le chapitre 1 est actif avec ses **8 premiers versets complets** en Louis Segond 1920.
- Les chapitres non renseignés apparaissent verrouillés (« Bientôt disponible »).

## Édition, fidélité et respect de tous

### Une seule édition

Le projet est dédié à la **Bible Louis Segond 1920**. Aucune autre version, paraphrase ou adaptation n’est intégrée. Les champs `livre` et `traduction` du fichier de données verrouillent cette référence unique dans toute l’interface.

### Fidélité du texte

- Les versets sont stockés dans `src/data/apocalypse.json`, sans réécriture ni adaptation théologique.
- La ponctuation et la casse d’origine sont conservées ; elles ne sont assouplies que pour la vérification de la récitation.
- Une correction ne doit être apportée qu’après contrôle sur une édition Louis Segond 1920 de référence.
- Les huit versets actuellement intégrés doivent être relus sur cette édition de référence avant toute publication.
- Avant toute diffusion publique, vérifiez les droits applicables à l’édition retenue dans votre juridiction.

### Respect de toutes et de tous

Cette application est un outil de mémorisation, pas une autorité doctrinale.

- Elle s’adresse aux croyants de toutes confessions comme aux personnes non croyantes, sans hiérarchie ni jugement.
- Elle ne fait aucun prosélytisme et ne doit pas servir à stigmatiser, exclure ou attaquer des personnes ou des groupes.
- Elle reproduit le texte avec respect et demande à ses utilisateurs d’en faire autant dans leurs échanges.
- La progression reste sur l’appareil : aucun compte, aucun analytics, aucune publicité, aucune synchronisation. Seules les polices d’interface sont demandées à Google Fonts lors de la première visite, puis mises en cache hors-ligne.
- Les retours, corrections et contributions sont accueillis avec la même exigence de respect du texte et des personnes.

## Stack technique

- **React 18** + **Vite 5**
- **Tailwind CSS 3** (thème sombre ardoise, or et vert émeraude)
- **Lucide React** pour les icônes
- **Web Speech API** : synthèse vocale française et dictée si le navigateur la prend en charge
- **localStorage** pour toute la progression
- **Service worker** et manifeste pour l’installation et le cache hors-ligne
- Typographies : Cormorant Garamond (versets) et Inter (interface)

## Démarrage

Prérequis : **Node.js 18 ou supérieur**.

```bash
npm install
npm run dev
```

L’application est servie par Vite en mode développement.

```bash
npm run build     # build de production dans dist/
npm run preview   # prévisualisation du build
npm run icons     # régénère les icônes PWA dans public/icons/
```

## Structure du projet

```text
.
├── README.md
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── scripts/
│   └── generate-icons.mjs
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       └── apple-touch-icon.png
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/
    │   ├── apocalypse.json      # Texte biblique Louis Segond 1920
    │   ├── verses.js            # Normalisation des données
    │   └── levels.js            # Métadonnées des cinq niveaux
    ├── state/
    │   └── ProgressProvider.jsx # Niveaux, SRS, série, objectif, notifications
    ├── lib/
    │   ├── text.js              # Masquage, puzzle, comparaison LCS
    │   ├── srs.js               # Échelle J+1 → J+30
    │   ├── storage.js           # Persistance localStorage
    │   ├── progress.js          # Calculs de maîtrise
    │   ├── dates.js             # Dates locales et libellés
    │   └── speech.js            # Synthèse et reconnaissance vocales
    └── components/
        ├── AppHeader.jsx
        ├── BottomNav.jsx
        ├── SettingsSheet.jsx
        ├── IconButton.jsx
        ├── chapters/
        │   ├── ParcoursScreen.jsx
        │   └── ChapterScreen.jsx
        ├── training/
        │   ├── TrainingScreen.jsx
        │   ├── LevelStepper.jsx
        │   ├── Level1Read.jsx
        │   ├── Level2Initials.jsx
        │   ├── Level3Cloze.jsx
        │   ├── Level4Puzzle.jsx
        │   ├── Level5Recall.jsx
        │   └── LevelComplete.jsx
        └── reviews/
            ├── ReviewsScreen.jsx
            └── ReviewSession.jsx
```

## Ajouter des chapitres

Tout le contenu vient de `src/data/apocalypse.json`. Aucun composant n’est à modifier : la grille, les statistiques et le parcours s’adaptent automatiquement.

Structure attendue :

```json
{
  "livre": "Apocalypse",
  "traduction": "Louis Segond 1920",
  "totalChapitres": 22,
  "chapitres": [
    {
      "chapitre": 2,
      "versets": [
        {
          "verset": 1,
          "texte": "Texte exact du verset, ponctuation comprise."
        }
      ]
    }
  ]
}
```

Règles :

1. Conserver `livre: "Apocalypse"` et `traduction: "Louis Segond 1920"`.
2. Ajouter un chapitre avec un numéro unique entre 1 et 22.
3. Renseigner chaque verset avec son numéro et son texte intégral.
4. Garder l’ordre des versets ; l’application trie également par numéro.
5. Vérifier le texte sur l’édition Louis Segond 1920 de référence avant publication.

Les identifiants internes sont générés sous la forme `chapitre:verset` (par exemple `1:1`). Les progressions existantes restent compatibles tant que ces identifiants ne changent pas.

## Progression, série et répétition espacée

Tout est stocké dans le `localStorage`, sous la clé `apocalypse-memoire-v1`. Aucune donnée de progression ne quitte l’appareil.

Structure simplifiée :

```js
{
  version: 1,
  verses: {
    "1:1": {
      levels: [true, true, false, false, false],
      step: -1,           // étape SRS ; 0 correspond à la première révision
      due: null,          // date locale AAAA-MM-JJ
      reviews: 0,
      lapses: 0,
      masteredAt: null,
      lastActivityAt: null,
      lastReviewedAt: null
    }
  },
  stats: {
    streak: 0,
    bestStreak: 0,
    lastStudyDate: null,
    days: { "2026-11-22": ["1:1"] }
  },
  settings: {
    dailyGoal: 3,
    reminder: false,
    lastNotified: null
  }
}
```

Règles appliquées :

- Un niveau ne peut être pratiqué que s’il est déjà débloqué ; les précédents restent accessibles pour s’entraîner.
- La première validation du niveau 5 programme la révision à J+1.
- Une révision réussie passe à l’intervalle suivant ; la dernière étape reste à 30 jours.
- Une révision échouée remet l’étape à zéro et reprogramme J+1.
- La série compte une journée dès qu’un niveau ou une révision est validé.
- L’objectif quotidien compte chaque verset maîtrisé ou révisionné une seule fois par jour.
- Les 90 derniers jours d’activité sont conservés.

## PWA, hors-ligne et notifications

- `public/manifest.webmanifest` déclare l’application installable, en mode `standalone`, avec le thème sombre.
- `public/sw.js` met en cache la coquille de l’application, les ressources buildées, les icônes et les polices après une première visite en ligne.
- Le service worker n’est enregistré qu’en production (`import.meta.env.PROD`).
- Les notifications sont optionnelles et demandées depuis les réglages. Elles s’affichent **à l’ouverture de l’application** lorsqu’un verset est dû.
- Aucun serveur push n’est utilisé : une notification ne peut pas être reçue application fermée.

## Accessibilité et design

- Interface mobile-first, lisible et utilisable au clavier.
- Libellés ARIA sur les boutons icônes et les contrôles de niveau.
- Contrastes élevés sur fond ardoise profond ; or pour les récompenses, vert émeraude pour les validations.
- Typographie serif pour les versets, sans-serif pour l’interface.
- Pas de bascule de thème : le mode sombre est volontairement le thème par défaut et unique.
- Aucun suivi analytics, aucune publicité, aucun cookie applicatif.

## Vérifications

Vérifications réalisées lors du développement :

- `npm run build` : build de production réussi.
- Assertions métier sur le masquage (`J____-C_____`), la comparaison souple de ponctuation et de casse, la stricte des accents, la sélection d’environ 50 % de blancs, les segments de 2 à 3 mots et l’échelle SRS J+1 → J+30.
- Arithmétique des dates testée, y compris le passage à l’heure d’été.
- Manifeste, service worker et icônes 192 × 192, 512 × 512 et 180 × 180 présents dans le build.

Ces vérifications ne remplacent pas un test manuel sur vos navigateurs cibles, notamment pour la synthèse vocale et la dictée.

## Limites connues

- Seuls les **8 premiers versets d’Apocalypse 1** sont fournis ; les 21 autres chapitres restent à renseigner.
- La synthèse vocale et la dictée dépendent du navigateur, de la permission micro et des voix françaises installées.
- Les notifications ne fonctionnent qu’à l’ouverture de l’application, sans serveur push.
- Une seule édition est prise en charge : Louis Segond 1920.
- Effacer les données du navigateur efface la progression, faute de compte ou de synchronisation.

## Signaler une erreur

Merci de préciser :

- la référence exacte (`Apocalypse 1:4` par exemple) ;
- le comportement observé et le comportement attendu ;
- le navigateur et l’appareil utilisés ;
- pour une correction biblique, l’édition Louis Segond 1920 de référence consultée.

Les signalements sont traités avec respect, sans modifier le sens du texte ni introduire d’autre version.
