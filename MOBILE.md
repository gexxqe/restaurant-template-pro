# Applications Android et iOS

Le projet est préparé pour Capacitor. Le dossier `web/` reste la source commune pour le site, Android et iOS.

## Première installation

```bash
npm install
npm run android:add
npm run ios:add
npm run cap:sync
```

Les dossiers natifs `android/` et `ios/` seront alors générés par Capacitor.

## Ouvrir les projets natifs

Android :

```bash
npm run android:open
```

iOS :

```bash
npm run ios:open
```

## Après une modification du site

```bash
npm run cap:sync
```

Cela recopie le contenu de `web/` dans les projets Android et iOS.

## Personnalisation pour un restaurant

Avant une publication dans Google Play ou l’App Store, modifier :

- `appId` dans `capacitor.config.json` avec un identifiant unique, par exemple `fr.nomrestaurant.app`;
- `appName` avec le nom du restaurant;
- l’icône et l’écran de lancement;
- les informations légales et la politique de confidentialité.

La configuration Supabase existante dans `web/config.js` est utilisée par les trois versions : web, Android et iOS.
