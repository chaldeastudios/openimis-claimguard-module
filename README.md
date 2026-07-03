# openimis-claimguard-module

An openIMIS frontend module that links the claims workflow to [ClaimGuard](https://github.com/chaldeastudios/claimguard-vision-dash), an AI-powered fraud-risk-scoring companion app. Built for the openIMIS Hackathon (Track 1: Innovation Track).

## Problem statement

ClaimGuard's fraud module (`openimis-be-fraud_py`) scores every submitted claim for fraud risk on the backend, and its reviewer dashboard shows the score, risk level, and plain-language reasons a claim was flagged. But that dashboard is a separate companion app, not part of openIMIS's own UI — a claims reviewer working inside openIMIS had no way to jump from a claim they're looking at straight into its ClaimGuard risk review, or trigger a fresh AI analysis, without manually navigating to a different site and searching for the claim by hand.

## What this module does

- **Claim detail integration**: adds a "ClaimGuard fraud review" panel to every claim's detail/edit page inside the openIMIS Claims module, with two buttons:
  - **Open in ClaimGuard** — opens that exact claim's ClaimGuard detail page in a new tab, keyed by the claim's openIMIS `uuid`.
  - **Run AI Analysis in ClaimGuard** — same, but appends `?autoAnalyze=1` so ClaimGuard immediately kicks off AI fraud analysis on load instead of requiring a second click.
- **Navigation menu page**: registers a "ClaimGuard" entry in openIMIS's main menu with its own page, linking out to the ClaimGuard reviewer dashboard.

## Architecture overview

openIMIS's frontend (`openimis-fe_js`) is a module-federation-style assembly: each feature is an independent npm package (its own git repo) that exports a config object contributed into a shared modules manager. This module follows that convention exactly, mirroring the reference `openimis-fe-claim_js` module:

- `src/index.jsx` — the module's entry point, exporting `ClaimGuardModule(cfg)`, which contributes to:
  - `"claim.MasterPanel"` — an extension array the Claim module itself renders on every claim's detail page, passing the loaded claim (including `uuid`) as a prop. This is a genuine openIMIS extension point, not a patch to the Claim module's own code.
  - `"core.MainMenu"` / `"core.Router"` — a normal top-level nav menu entry and page.
- `src/components/ClaimGuardPanel.jsx` — the claim-detail panel with the two action buttons.
- `src/pages/ClaimGuardAboutPage.jsx` — the standalone nav-menu page.

No core openIMIS code is modified. The module only reads the claim's `uuid` (already loaded by the Claim module) and builds a URL to ClaimGuard's own claim detail route (`/dashboard/claims/:claimId`, with an optional `?autoAnalyze=1`) — see `dashboard.claims.$claimId.tsx` in the ClaimGuard repo for the corresponding auto-analyze support.

## Configuration

The ClaimGuard base URL defaults to a placeholder (`https://claimguard.demo`) and is read via `modulesManager.getConf("fe-claimguard", "claimguardBaseUrl", ...)`. Override it once ClaimGuard has a real deployed URL by setting that value in the assembly's module configuration.

## Installation

1. Add this module to the assembly's `openimis.json` `modules` list:
   ```json
   {
     "name": "ClaimGuardModule",
     "npm": "fe-claimguard@https://github.com/chaldeastudios/openimis-claimguard-module#main"
   }
   ```
2. Rebuild the assembly (`node modules-config.js` / the assembly's usual module-install step, then `npm install` and `npm run build`/`npm start`).

## Local development

```bash
npm install
npm run start   # vite dev server, for iterating on the components in isolation
npm run build    # produces dist/ for the assembly to consume
```

## Known limitations

- The claims *list* view (search results table) does not show a ClaimGuard column or row action — `ClaimSearcher.jsx`'s row formatters are hardcoded in the Claim module itself with no contribution point for arbitrary modules to add a column, and patching it directly would count as modifying core module code. The claim *detail* page panel and the nav menu page were used instead, both genuine extension points.
- The `claimguardBaseUrl` config value's runtime override plumbing (via `openimis.json` / the assembly's per-module cfg) has not been verified end-to-end against a live deployment; the hardcoded default handles the case where it isn't wired up.
- Not yet verified against a running openIMIS instance — built and reviewed against the actual `openimis-fe-claim_js` reference module's source, but not manually tested in a browser.
