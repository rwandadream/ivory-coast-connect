# SARAH AUTO — ERP pour auto-école

Plateforme SaaS de gestion d'auto-école pour les administrateurs et le personnel.

## Objectif

Transformer l'application existante en un produit professionnel, moderne et commercialisable, avec une interface SaaS cohérente, des processus simplifiés et une expérience fluide.

## Installation

1. Copier les variables d'environnement dans un fichier `.env`.
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer l'application en mode développement :
   ```bash
   npm run dev
   ```
4. Construire pour la production :
   ```bash
   npm run build
   ```

## Variables d'environnement attendues

Aucune variable externe n'est requise pour cette version locale. L'application utilise un stockage local pour l'authentification et les données.

## Structure du projet

- `src/routes/` — pages de l'application.
- `src/components/` — composants UI partagés.
- `src/components/layout/` — structure de l'application et shell.

## Scripts utiles

- `npm run dev` — démarrer le serveur de développement.
- `npm run build` — construire l'application.
- `npm run preview` — prévisualiser la build.
- `npm run lint` — vérifier le code avec ESLint.
- `npm run format` — formater le code avec Prettier.
- `npm run typecheck` — vérifier les types TypeScript.

## Prochaines étapes

- Refonte du tableau de bord en centre de pilotage.
- Amélioration de la navigation et du layout SaaS.
- Ajout de modules moniteurs, véhicules et rendez-vous.
- Optimisation du store local et du flux de données.
