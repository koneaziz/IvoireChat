# IvoireChat — prototype

Prototype de démonstration basé sur le cahier des charges du dossier. Il comprend une page d’accueil, un chat, trois parcours simulés et des widgets interactifs. Les liens pointent vers des sources officielles ; les réponses restent des exemples à vérifier avant un usage public.

## Lancer en local

Pré-requis : Node.js 20 ou plus récent et npm.

```bash
npm install
npm run dev
```

Ouvrir ensuite `http://localhost:3000`.

Pour arrêter le serveur, appuyer sur `Ctrl+C` dans le terminal où il tourne.

## Changer les polices

Dans `app/globals.css`, les variables `--font-body` et `--font-display` en haut du fichier contrôlent respectivement le texte courant et les grands titres. Les noms indiqués doivent être installés sur votre machine ou chargés comme fichiers web.

Pour utiliser une police locale, placer par exemple `ma-police.woff2` dans `public/fonts/`, puis déclarer dans `app/globals.css` :

```css
@font-face {
  font-family: "Ma police";
  src: url("/fonts/ma-police.woff2") format("woff2");
  font-display: swap;
}
```

Remplacer ensuite `--font-body` ou `--font-display` par `"Ma police", sans-serif` selon l’usage voulu.

## Vérifier

```bash
npm run lint
npm run build
```

## État actuel

- Réponses simulées par `app/api/chat/route.ts` et `lib/demo.ts`.
- Historique et état des widgets enregistrés dans le navigateur.
- Les questions sont envoyées à l’API locale du prototype. Ne saisissez pas de données sensibles pendant cette phase.
- Aucune clé d’IA, base de données ou connexion à une administration nécessaire pour cette version.
- Aucun tarif ou document obligatoire n’est présenté comme vérifié par le prototype.

## Prochaines étapes avant une mise en ligne publique

1. Valider les contenus de chaque démarche avec les sources officielles et leur date de mise à jour.
2. Ajouter PostgreSQL pour les conversations si leur conservation serveur est nécessaire.
3. Ajouter le moteur RAG, le fournisseur de modèle et une validation stricte des réponses.
4. Définir la politique de confidentialité, les limites de conservation et le suivi des erreurs.
5. Tester l’expérience sur de vrais téléphones et réseaux lents.
