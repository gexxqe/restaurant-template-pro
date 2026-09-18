# Restaurant Template Pro

Template responsive et réutilisable : vitrine, carte, horaires, avis, contact, réservation et espace administrateur.

## Personnalisation rapide

Modifiez `config.js` pour changer le nom, le slogan, le téléphone, l’e-mail, l’adresse, Google Maps, la note, les couleurs et la devise.

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
