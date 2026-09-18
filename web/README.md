# Restaurant Template Pro

Template responsive et réutilisable : vitrine, carte, horaires, avis, contact, réservation et espace administrateur.

## Personnalisation rapide

Modifiez `config.js` pour changer le nom, le slogan, les contacts, les couleurs, le plat du jour, la carte, les horaires, les avis et les fonctions visibles. Aucun autre fichier n’est nécessaire pour une personnalisation standard.

Le site démarre en **mode démonstration**. Les réservations restent dans le navigateur et aucune donnée n’est envoyée au restaurant d’origine.

## Activer Supabase

1. Créez un projet Supabase propre au client.
2. Ajoutez les tables et les politiques RLS nécessaires.
3. Renseignez l’URL et la clé **publishable** dans `config.js`.
4. Passez `supabase.enabled` à `true`.

N’ajoutez jamais de clé `service_role` ou de clé secrète dans ce projet public.

## Lancer localement

```bash
cd web
python -m http.server 8080
```

Ouvrez `http://localhost:8080`.
