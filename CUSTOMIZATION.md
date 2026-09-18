# Personnaliser un nouveau restaurant

Ouvrez `web/customize.html` dans le navigateur pour utiliser le configurateur visuel, ou modifiez directement `web/config.js`.

Le configurateur permet de prévisualiser l’identité, les contacts et les couleurs, puis de télécharger un nouveau `config.js`. Il ne publie rien automatiquement.

## Checklist client

1. Remplacer le nom, les initiales, le slogan et la description.
2. Remplacer le téléphone, l’e-mail, l’adresse et le lien Google Maps.
3. Choisir les quatre couleurs dans `theme`.
4. Remplir `dailySpecial`, `menu`, `openingHours` et `reviews`.
5. Masquer les éléments inutiles dans `features` avec `false`.
6. Ajouter Facebook, Instagram, TikTok ou d’autres boutons dans `socialLinks`. Une URL vide masque automatiquement le bouton.
7. Créer un projet Supabase distinct pour le client avant d’activer les réservations réelles.

## Format d’un plat

```js
{ category: "Plats", name: "Nom du plat", description: "Description", price: 19.50, vegetarian: false }
```

## Format d’un horaire

```js
{ day: "Lundi", slots: [["12:00", "14:00"], ["19:00", "22:00"]] }
```

Utilisez `slots: []` pour un jour fermé.

## Sécurité Supabase

- un projet séparé par client;
- uniquement une clé publishable dans `config.js`;
- jamais de clé secrète ou `service_role` dans le site;
- RLS activé sur toutes les tables exposées.
