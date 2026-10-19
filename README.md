# Lift Log

Phone-first PWA for logging gym workouts set by set. All data stays on the
device in IndexedDB; works fully offline once loaded.

## Run locally

```sh
npm install
npm run dev          # http://localhost:5173
```

To try it on your phone on the same wifi: `npm run dev -- --host`, then open
the Network URL it prints.

The exercise photos in `public/exercises/` are committed. To re-fetch them
from free-exercise-db: `npx tsx scripts/fetch-images.ts`.

## Deploy (so you can open it on your phone)

Either host works on the free tier — build settings are auto-detected
(build `npm run build`, output `dist`).

**Vercel:**

```sh
npx vercel --prod
```

**Netlify:**

```sh
npx netlify-cli deploy --prod --build
```

Open the deployed URL on your phone, then **Add to Home Screen**
(Share → Add to Home Screen on iOS; Install app in Chrome on Android).
After the first load everything — including all exercise photos — is cached
offline, so bad gym signal doesn't matter.

## Backup

Settings (gear icon) → **Export backup** downloads a JSON file;
**Import backup** merges one back in by session id.
