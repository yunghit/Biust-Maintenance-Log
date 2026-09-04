# BIUST Maintenance & Facilities Log — React version

This is the React + Vite rewrite of the app, functionally identical to the previous single-file version, deployed via GitHub Actions instead of manually uploading a built file.

## What's different from the old version

- Real component architecture (`src/components/`), not one giant file.
- A build step: GitHub Actions builds the app automatically every time you push to `main` — you never run a build command yourself.
- Same Firebase project, same Firestore collections (`tickets`, `users`, `publicBoard`), same security rules — nothing to change on the Firebase side.

## One-time setup

1. **Push this whole folder to your GitHub repo** (`yunghit/Biust-Maintenance-Log`), replacing what's there now. Keep the folder structure exactly as given — `.github/workflows/deploy.yml` must stay at that exact path for GitHub Actions to find it.

2. **Edit `src/firebaseConfig.js`** — paste in your real Firebase config, same as before. This is still the only file with your keys in it.

3. **Change your GitHub Pages source.** This is the one required settings change:
   Settings → Pages → under "Build and deployment" → change **Source** from "Deploy from a branch" to **"GitHub Actions"**.
   (If you leave it on "Deploy from a branch," your site will keep serving the old raw files instead of the built app.)

4. **Push to `main`.** GitHub Actions will automatically install dependencies, build, and deploy — check the **Actions** tab in your repo to watch it run (takes about a minute). Once it's green, your site is live at the same URL as before.

5. **Firestore rules and Authentication settings are unchanged** — you don't need to touch Firebase console for anything you've already set up.

## If you ever want to build it yourself locally

You don't have to — GitHub Actions handles it. But if you want to preview changes on your own machine before pushing:

```
npm install
npm run dev       # local dev server with hot reload
npm run build     # produces a dist/ folder, same as what Actions builds
```

Requires Node.js installed locally (v18 or newer).

## Project structure

```
src/
  main.jsx                  entry point, service worker registration
  App.jsx                   top-level layout and state
  firebase.js                Firebase app/db/auth initialization
  firebaseConfig.js          <- your Firebase keys go here
  contexts/AuthContext.jsx   auth state, role, specialty, RA blocks
  hooks/useTickets.js        the role-aware Firestore subscription
  utils/constants.js         blocks, categories, statuses, roles
  utils/helpers.js           small formatting/logic helpers
  utils/export.js            Excel export
  components/                one file per UI piece
public/
  manifest.json, sw.js, icon-192.png, icon-512.png   PWA assets, copied as-is into the build
.github/workflows/deploy.yml  the auto-build-and-deploy pipeline
vite.config.js                build config — note the `base` path matches your repo name
```
