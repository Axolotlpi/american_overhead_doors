# American Overhead Doors

Single-page React website for American Overhead Doors, with a separately deployed Sanity Studio. Vite builds the frontend; Tailwind and component styles provide the presentation.

## Local development

Use npm with Node.js 22.22.2+, 24.15.0+, or 26+ (the supported Node release lines for the locked test dependencies).

```sh
npm ci
npm run dev
```

Use the localhost address printed by Vite. The frontend reads public content from Sanity project `7vgbicbo`, dataset `production`; no frontend access token is needed. The browser origin must be listed in that project's CORS settings. A new hostname requires its own exact origin, including `https://`.

## Checks and frontend preview

```sh
npm test
npm run lint
npm run build
npm run preview
```

Tests cover gallery/review pagination, missing animation events, dataset replacement, empty sections, and the contact anchor. Root lint excludes generated build directories, including `studio/dist`.

The project's protected development preview is `https://prototype.axolotlpi.com`. On the preview server, `project-preview.service` serves the root `dist/` directory on loopback port 8780. Rebuild to refresh this preview. Port 8765 belongs to the separate ChatGPT bridge and must not be reused. Building locally does not deploy the public production website.

## Content and Studio

`src/App.jsx` fetches the hero, about section, services, work gallery and reviews. `src/sanityClient.js` configures the client and image URL builder. `src/gallery.jsx` groups images into visual pages supplied by App; `src/reviews.jsx` displays three reviews per desktop page or one on mobile.

`studio/sanity.config.ts` defines the Studio sidebar; `studio/schemaTypes/` defines editable fields. The fixed section document IDs are `hero`, `aboutUs`, `siteServices`, and `siteGallery`. Reviews are separate documents ordered by `orderRank`.

```sh
cd studio
npm ci
npm run dev
npm run build
# Only when a Studio deployment is intended and authorized:
npm run deploy
```

The hosted editor is `https://american-ovh-doors.sanity.studio/`. Studio deployment updates editor code, not the frontend. Local and hosted Studio both use the production dataset: publishing content changes affects every frontend reading that dataset. GitHub access and Sanity project membership are separate permissions.

## Before launch

Replace placeholder company copy, service descriptions, review examples and footer contact details with owner-approved content. The Contact link now targets the footer; no contact form or booking backend is implemented. Incomplete gallery image entries without asset references are omitted by the frontend and should be repaired or removed in Studio rather than guessed from filenames. Keep Cloudflare Access enabled on the prototype until public access is intended.
