# Portfolio React App

Clean React rebuild of the Érica Menin portfolio. Start with the homepage; project/article pages use the same app with React Router.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The homepage is at `/`.

## Build

```bash
npm run build
```

Output is in `dist/`. To preview:

```bash
npx serve dist
```

## Deploy to Netlify

**Option A – Deploy this app as the main site**

- Build command: `npm run build` (run from the `app` directory, or set base to `app` and use `cd app && npm run build`)
- Publish directory: `app/dist` (or `dist` if build is run from `app`)
- The repo root `_redirects` is for the legacy site; the app has its own `app/public/_redirects` (copied into `dist`) for SPA fallback.

**Option B – Deploy to a subpath (e.g. `/new`) for comparison**

- Build from `app` as above.
- In Netlify, set the publish directory to a folder that contains both the legacy site and the built app (e.g. build the app into `public/new` and publish `public`), or use a second Netlify site that only publishes `app/dist` and assign it a subdomain or path.

## Structure

- `src/content/home.js` – Homepage copy (nav, projects, tabs, about, contact).
- `src/content/projects.js` – Project case studies (slug, meta, TOC, sections, prev/next).
- `src/components/` – Navbar, Hero, WhatIDo, Work, HowICanHelp, WhyMe, About, Contact, Footer; ArticleNav, ArticleHeader, ArticleEnd for project pages.
- `src/pages/HomePage.jsx`, `ProjectPage.jsx`, `DesignSystemCalendarRedirect.jsx`.
- `src/styles/global.css` – Global styles (custom classes).
- Images are in `public/images/` (copied from repo root `images/`).

## Routes

- `/` – Homepage
- `/project/:slug` – Project case study (mcs-website, soniq-design-system, voyager-design-system, soniq-app-design)
- `/design-system-calendar` – Redirects to the external Figma site

Old `.html` URLs are redirected to the new routes via `public/_redirects` (e.g. `mcs-website.html` → `/project/mcs-website`).
