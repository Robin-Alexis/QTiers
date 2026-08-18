# QTiers — Question pour un Tiers 🌱

Un quiz façon **Question pour un Champion**, aux couleurs d'Agrial. QCM
chronométré, score selon la rapidité, et un espace d'administration pour gérer
les questions (stockées dans une petite base SQLite).

Projet **Vue 3 + Node/Express + SQLite**, sans aucune dépendance interne
Agrial — autonome et hébergeable n'importe où (un serveur Node suffit).

## Structure

```
qtiers/
├── client/   # Front Vue 3 + Vite (le jeu + l'admin)
└── server/   # API Express + base SQLite (questions)
```

## Démarrage en développement

```bash
npm install          # installe client + server (npm workspaces)
npm run dev          # lance l'API (:3000) ET le front (:5173) en parallèle
```
Puis ouvre http://localhost:5173. Le front proxifie `/api` vers le serveur.

## Production (hébergement)

```bash
npm install
npm run build        # build le front dans client/dist
npm start            # Express sert le front + l'API sur le même port (:3000)
```
L'appli complète est alors disponible sur http://localhost:3000
(`PORT` configurable via variable d'environnement).

La base est un fichier SQLite (`server/qtiers.db`, créé et amorcé
automatiquement au premier lancement). Chemin configurable via `QTIERS_DB`.

## API

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/questions` | Toutes les questions |
| GET | `/api/questions/aleatoires?n=10` | Tirage aléatoire (partie) |
| GET | `/api/questions/:id` | Une question |
| POST | `/api/questions` | Créer |
| PUT | `/api/questions/:id` | Modifier |
| DELETE | `/api/questions/:id` | Supprimer |
| GET | `/api/categories` | Catégories distinctes |
| GET | `/api/health` | État + nombre de questions |

Format d'une question :
```json
{
  "categorie": "Agriculture",
  "question": "…",
  "reponses": ["A", "B", "C", "D"],
  "bonne": 2,
  "difficulte": "moyen"
}
```
`bonne` = index (0..3) de la bonne réponse. À l'affichage, le jeu mélange
l'ordre des réponses.

## Personnaliser

- **Questions** : via l'espace **Gérer les questions** (ouvert à tous), ou en
  éditant `server/seed-data.js` (amorçage initial).
- **Durée / nombre de questions par partie** : constantes `DUREE` et
  `NB_QUESTIONS` dans `client/src/views/GameView.vue`.
- **Couleurs / DA** : variables CSS en tête de `client/src/style.css`.
