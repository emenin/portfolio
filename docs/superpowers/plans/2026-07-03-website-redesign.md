# ericamenin.com Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild ericamenin.com as an Astro static site implementing the "Filter Switch" concept: a dark, atmospheric, award-bar UNFILTERED mode and a Notion-style grayscale FILTERED mode, per `docs/superpowers/specs/2026-07-03-website-redesign-design.md`.

**Architecture:** Astro 5 static site at repo root, deployed to Netlify (`dist/`). Content as Astro content collections (case studies in Markdown), Substack RSS fetched at build with a committed fallback. Small vanilla-JS islands for filter toggle, cursor aura, and motion. Phase A ships a live hero prototype (font candidates + mess dial + copy variants) so the user locks open decisions on real rendering before Phase B builds the full site.

**Tech Stack:** Astro ^5, vitest ^3, lenis ^1 (smooth scroll), @fontsource (Playfair Display, JetBrains Mono, Inter), Fontshare CSS API (Zodiak, Recia candidates), Netlify.

## Global Constraints

- Node 22 (already pinned in `netlify.toml`)
- Canvas color UNFILTERED: `#0D0916`; display text `#F5E8FF`; text gradient `#FFA07A → #FF6562 → #C04B83`; hairlines `rgba(245,232,255,0.14)`
- Copy must never contain the word "elegant"; no kawaii; no corporate-safe voice in unfiltered mode
- No handwriting fonts, stickers, or taped-card props; element rotation subtle (≤1° structural, ≤7° marginalia)
- All motion: long ease-out curves, nothing linear, nothing snapping; respect `prefers-reduced-motion`
- Quality bar: §2b of the spec ("could this frame be a poster?")
- Old case-study URLs must keep working via redirects
- Every commit ends with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

## File Structure

```
astro.config.mjs                  Astro config (static output)
package.json                      extended with astro/vitest/lenis/fontsource deps
src/
  layouts/Base.astro              <head>, fonts, grain overlay, meta, global css
  styles/tokens.css               palette/type/spacing custom properties
  styles/global.css               resets, base type, utilities (gradient text, hairline)
  pages/prototype.astro           Phase A hero prototype (font switcher, mess dial, copy variants)
  pages/index.astro               real home (Phase B)
  pages/404.astro                 fun 404
  pages/writing.astro             publication archive
  pages/work/[slug].astro         case study template
  components/SiteNav.astro        logo + nav + FilterToggle
  components/FilterToggle.astro   the UNFILTERED/FILTERED switch
  components/Hero.astro           monumental hero
  components/Ticker.astro         "currently" marquee
  components/WorkIndex.astro      case-study index rows
  components/Publication.astro    latest Substack issues
  components/About.astro          about section
  components/SiteFooter.astro     contact + rotating taglines
  components/FilteredDoc.astro    Notion-style filtered rendering of home content
  scripts/filter-state.js         pure logic: resolve/persist filter mode (unit-tested)
  scripts/filter-toggle-client.js DOM wiring for the toggle + choreographed transition
  scripts/aura.js                 cursor aura w/ inertia; drift on touch
  scripts/reveal.js               headline mask-reveals, row hovers, parallax numerals
  lib/substack.ts                 RSS fetch+parse at build w/ fallback (unit-tested)
  data/substack-fallback.json     committed last-known issues
  data/site.ts                    all copy strings, nav, taglines, currently-items
  content.config.ts               content collections schema
  content/work/iq-design-system.md
  content/work/soniq.md
tests/
  filter-state.test.js
  substack.test.ts
public/
  fonts-fallback/                 (only if Fontshare candidate wins; self-host files)
  images/                         migrated assets
netlify.toml                      build = astro build, publish = dist
_redirects                        old URLs → new
```

---

## Phase A — Live hero prototype

### Task 1: Astro scaffold, tokens, base layout

**Files:**
- Modify: `package.json`
- Create: `astro.config.mjs`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/layouts/Base.astro`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `Base.astro` layout with slots + props `{ title: string, description?: string }`; CSS custom properties consumed by every later task: `--bg`, `--ink`, `--hairline`, `--peach`, `--coral`, `--magenta`, `--lilac`, `--font-display`, `--font-mono`, `--grad-text`, `--ease-out-long`; utility classes `.grad-text`, `.hairline-top`, `.mono-label`.

- [ ] **Step 1: Add dependencies**

```bash
cd /Users/ericamenin/Documents/Engineering/Personal/portfolio
npm install astro@^5 @fontsource-variable/playfair-display @fontsource-variable/jetbrains-mono @fontsource-variable/inter
npm install -D vitest@^3
```

- [ ] **Step 2: Extend package.json scripts** (keep existing prettier config/dep)

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test": "vitest run"
}
```

- [ ] **Step 3: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ericamenin.com',
  output: 'static',
});
```

- [ ] **Step 4: Create `src/styles/tokens.css`**

```css
:root {
  --bg: #0d0916;
  --ink: #f5e8ff;
  --ink-60: rgba(245, 232, 255, 0.6);
  --ink-40: rgba(245, 232, 255, 0.4);
  --hairline: rgba(245, 232, 255, 0.14);
  --peach: #ffa07a;
  --coral: #ff6562;
  --magenta: #c04b83;
  --lilac: #f5e8ff;
  --grad-text: linear-gradient(105deg, var(--peach) 0%, var(--coral) 42%, var(--magenta) 100%);

  --font-display: 'Playfair Display Variable', serif;
  --font-mono: 'JetBrains Mono Variable', monospace;
  --font-doc: 'Inter Variable', system-ui, sans-serif;

  --step-hero: clamp(3rem, 11vw, 9.5rem);
  --step-index: clamp(1.75rem, 4.5vw, 3.5rem);
  --step-meta: 0.66rem;

  --ease-out-long: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-slow: 1.2s;
  --dur-base: 0.6s;

  --mess: 1; /* 0..2 multiplier, locked after prototyping */
}
```

- [ ] **Step 5: Create `src/styles/global.css`**

```css
* { box-sizing: border-box; margin: 0; }
html { background: var(--bg); color: var(--ink); }
body { font-family: var(--font-mono); font-weight: 300; }

.grad-text {
  background: var(--grad-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hairline-top { border-top: 1px solid var(--hairline); }
.mono-label {
  font-family: var(--font-mono);
  font-size: var(--step-meta);
  font-weight: 300;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-40);
}
.display { font-family: var(--font-display); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 6: Create `src/layouts/Base.astro`** — imports fonts + styles, grain overlay via inline SVG feTurbulence data-URI

```astro
---
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/playfair-display/wght-italic.css';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/inter';
import '../styles/tokens.css';
import '../styles/global.css';
const { title, description = 'Érica Menin — design systems, unfiltered.' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <slot />
    <div class="grain" aria-hidden="true"></div>
    <style>
      .grain {
        position: fixed; inset: 0; pointer-events: none; z-index: 999;
        opacity: 0.05; mix-blend-mode: overlay;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      }
    </style>
  </body>
</html>
```

- [ ] **Step 7: Add `dist/` and `.astro/` to `.gitignore`**

- [ ] **Step 8: Verify build**

Run: `npm run build`
Expected: `astro build` completes, `dist/` created (no pages yet is fine — add a placeholder `src/pages/prototype.astro` in Task 2; if build fails on zero pages, create an empty prototype page first).

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json astro.config.mjs src/ .gitignore
git commit -m "feat: scaffold Astro with design tokens and base layout"
```

### Task 2: Hero prototype page (font candidates, mess dial, copy variants)

**Files:**
- Create: `src/pages/prototype.astro`

**Interfaces:**
- Consumes: `Base.astro`, tokens/utilities from Task 1
- Produces: a `/prototype` route used for the live design session. Nothing later depends on it (it is deleted before launch), but the CSS it locks (font choice, `--mess` value, hero copy) is written back into `tokens.css` and `src/data/site.ts`.

- [ ] **Step 1: Build the prototype page.** One full-viewport hero implementing the refined comp: nav (wordmark + UNFILTERED/FILTERED toggle, non-functional placeholder), monumental headline with gradient italic lines, ghost issue numeral overlapping the headline, mono metadata anchored to corners, aura, scroll cue. Plus a fixed dev panel (bottom-left) with:
  - Font radio group: Playfair Display (local), Zodiak, Recia (both loaded via `<link href="https://api.fontshare.com/v2/css?f[]=zodiak@400,700,900,701,901&f[]=recia@400,700&display=swap">`), each setting `--font-display` on `document.documentElement`
  - Mess dial: `<input type="range" min="0" max="2" step="0.05">` writing `--mess`; mess-driven declarations use it, e.g. numeral offset `transform: translate(calc(var(--mess) * 1.5rem), calc(var(--mess) * -1rem)) rotate(calc(var(--mess) * 2deg))`, row tilt `rotate(calc(var(--mess) * -0.4deg))`, drift amplitude
  - Copy variant cycler: button cycling headline candidates stored in a JS array: `["Systems that scale. Stories that don't hide the ugly.", "Systems that scale. Stories that don't lie.", "I make systems behave. Stories, never.", "Design systems that scale. Stories that show the mess."]` (split across lines at the period; gradient italic on the story-line)
  - Aura: cursor-following radial gradient div with inertia (lerp at 0.06/frame), autonomous slow drift when no pointer (touch)
  - Headline mask-reveal on load (clip-path inset animation, `--dur-slow` + `--ease-out-long`)

The page is self-contained (inline `<script>` and `<style>`); code quality matters less than fidelity here — it will be deleted.

- [ ] **Step 2: Verify in browser**

Run dev server and open `/prototype`. Check: headline renders at `--step-hero` size, gradient italic on story lines, grain visible, aura follows cursor with lag, dial moves numeral/tilt/drift live, font radios switch rendering, copy cycler works, reduced-motion disables reveal/drift.

- [ ] **Step 3: Commit**

```bash
git add src/pages/prototype.astro
git commit -m "feat: live hero prototype with font candidates, mess dial, copy variants"
```

### Task 3: USER CHECKPOINT — lock font, mess level, hero copy

Not a coding task. Run the dev server for the user (preview tooling), walk through candidates, record decisions, then:

- [ ] Write the chosen font into `--font-display` in `tokens.css` (if Zodiak/Recia wins: download WOFF2s from Fontshare, self-host in `public/fonts/`, add `@font-face` in `tokens.css`, remove the API `<link>`)
- [ ] Write the locked `--mess` value into `tokens.css`
- [ ] Create `src/data/site.ts` with the locked hero copy (see Task 4 for shape)
- [ ] Commit: `git commit -m "chore: lock typeface, mess level, and hero copy from prototype session"`

---

## Phase B — Full site

### Task 4: Site content module

**Files:**
- Create: `src/data/site.ts`

**Interfaces:**
- Produces (consumed by all components):

```ts
export const site = {
  hero: { lines: string[]; gradFrom: number },   // gradFrom = index of first gradient line
  meta: { role: string; publication: string; email: string; linkedin: string; substack: string },
  currently: string[],                            // ticker items
  taglines: string[],                             // rotating footer taglines
  nav: { label: string; href: string }[],
};
```

- [ ] **Step 1: Create the module** with real copy (hero lines from Task 3; currently/taglines drafted from current-site voice, e.g. currently: `['teaching AI to read my design system', 'writing issue №14', 'collecting receipts']`). No lorem ipsum anywhere.

- [ ] **Step 2: Commit**

```bash
git add src/data/site.ts
git commit -m "feat: central site content module"
```

### Task 5: Filter state logic (TDD)

**Files:**
- Create: `src/scripts/filter-state.js`
- Test: `tests/filter-state.test.js`

**Interfaces:**
- Produces: `resolveMode({ urlSearch, stored }) -> 'unfiltered' | 'filtered'` and `persistMode(mode, storage)`; pure functions, no DOM.

- [ ] **Step 1: Write failing tests**

```js
import { describe, it, expect } from 'vitest';
import { resolveMode, persistMode } from '../src/scripts/filter-state.js';

describe('resolveMode', () => {
  it('defaults to unfiltered', () => {
    expect(resolveMode({ urlSearch: '', stored: null })).toBe('unfiltered');
  });
  it('url param wins over storage', () => {
    expect(resolveMode({ urlSearch: '?filter=on', stored: 'unfiltered' })).toBe('filtered');
    expect(resolveMode({ urlSearch: '?filter=off', stored: 'filtered' })).toBe('unfiltered');
  });
  it('falls back to stored value', () => {
    expect(resolveMode({ urlSearch: '', stored: 'filtered' })).toBe('filtered');
  });
  it('ignores garbage stored values', () => {
    expect(resolveMode({ urlSearch: '', stored: 'banana' })).toBe('unfiltered');
  });
});

describe('persistMode', () => {
  it('writes to storage', () => {
    const store = new Map();
    persistMode('filtered', { setItem: (k, v) => store.set(k, v) });
    expect(store.get('filter-mode')).toBe('filtered');
  });
});
```

- [ ] **Step 2: Run tests, verify fail** — `npm test` → FAIL (module not found)

- [ ] **Step 3: Implement**

```js
export function resolveMode({ urlSearch, stored }) {
  const param = new URLSearchParams(urlSearch).get('filter');
  if (param === 'on') return 'filtered';
  if (param === 'off') return 'unfiltered';
  return stored === 'filtered' ? 'filtered' : 'unfiltered';
}

export function persistMode(mode, storage) {
  storage.setItem('filter-mode', mode);
}
```

- [ ] **Step 4: Run tests, verify pass** — `npm test` → 5 passing

- [ ] **Step 5: Commit** — `git commit -m "feat: filter mode resolution logic with tests"`

### Task 6: Substack RSS at build (TDD)

**Files:**
- Create: `src/lib/substack.ts`
- Create: `src/data/substack-fallback.json`
- Test: `tests/substack.test.ts`

**Interfaces:**
- Produces: `parseFeed(xml: string) -> Issue[]` and `getIssues(fetchImpl?) -> Promise<Issue[]>` where `Issue = { title: string; url: string; date: string; blurb: string; n: number }` (`n` = issue ordinal, newest first, computed from position + total). `getIssues` returns fallback JSON when fetch fails.

- [ ] **Step 1: Write failing tests for `parseFeed`** with a fixture string containing two `<item>`s (title, link, pubDate, description with HTML to strip, CDATA). Assert titles, stripped blurbs truncated to 140 chars, ISO dates, ordinals.

```ts
import { describe, it, expect } from 'vitest';
import { parseFeed, getIssues } from '../src/lib/substack.ts';

const xml = `<?xml version="1.0"?><rss><channel>
<item><title><![CDATA[The team is gone. The system isn't.]]></title>
<link>https://designsystemsunfiltered.substack.com/p/the-team-is-gone</link>
<pubDate>Tue, 23 Jun 2026 08:00:00 GMT</pubDate>
<description><![CDATA[<p>How small steps are helping us navigate.</p>]]></description></item>
<item><title><![CDATA[My last year as a Design System Designer]]></title>
<link>https://designsystemsunfiltered.substack.com/p/my-last-year</link>
<pubDate>Thu, 22 Jan 2026 08:00:00 GMT</pubDate>
<description><![CDATA[<p>Looking back before moving forward.</p>]]></description></item>
</channel></rss>`;

describe('parseFeed', () => {
  it('parses items with stripped blurbs and ordinals', () => {
    const issues = parseFeed(xml);
    expect(issues).toHaveLength(2);
    expect(issues[0].title).toBe("The team is gone. The system isn't.");
    expect(issues[0].blurb).toBe('How small steps are helping us navigate.');
    expect(issues[0].n).toBe(2);
    expect(issues[1].n).toBe(1);
    expect(issues[0].date).toMatch(/^2026-06-23/);
  });
});

describe('getIssues', () => {
  it('falls back to committed JSON when fetch rejects', async () => {
    const issues = await getIssues(() => Promise.reject(new Error('offline')));
    expect(issues.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run, verify fail** — `npm test` → FAIL

- [ ] **Step 3: Implement `parseFeed`** with regex-based item extraction (no XML dep): match `<item>…</item>` blocks, extract CDATA/plain fields, strip tags from description, truncate 140 chars, ordinal `n = total - index`. Implement `getIssues(fetchImpl = fetch)` hitting `https://designsystemsunfiltered.substack.com/feed`, `parseFeed` the body, catch → `import fallback from '../data/substack-fallback.json'`.

- [ ] **Step 4: Seed `substack-fallback.json`** with the 4 currently-known issues (titles/URLs from the live Substack; fill during implementation with a real fetch).

- [ ] **Step 5: Run tests, verify pass; commit** — `git commit -m "feat: substack RSS fetch with committed fallback"`

### Task 7: Home page — unfiltered mode

**Files:**
- Create: `src/components/SiteNav.astro`, `FilterToggle.astro`, `Hero.astro`, `Ticker.astro`, `WorkIndex.astro`, `Publication.astro`, `About.astro`, `SiteFooter.astro`
- Create: `src/pages/index.astro`
- Create: `src/scripts/aura.js`

**Interfaces:**
- Consumes: `site` from Task 4, `getIssues` from Task 6, content collection from Task 9 (WorkIndex may hardcode the two case-study entries until Task 9 lands, then switch to `getCollection('work')`)
- Produces: `data-mode="unfiltered"` attribute on `<html>`; every section wrapped in `<section data-section="...">` for the filtered swap (Task 8); aura element `#aura` controlled by `aura.js` (port the prototype's lerp implementation into this module)

- [ ] **Step 1: Build components** translating the locked prototype hero 1:1 (same classes/tokens), then Ticker (CSS marquee, `animation-duration: 40s`, duplicated content for loop), WorkIndex (hairline rows: tabular `(01)` numeral, display title, mono tag; hover: aura-bloom pseudo-element + `.grad-text` on title, eased in/out), Publication (top 3 from `getIssues()` at build, ghost `№n` outlined numeral per row, subscribe link), About (short bio from `site.ts`, mono facts), SiteFooter (email, LinkedIn, Substack links + tagline rotated per page-load from `site.taglines`).
- [ ] **Step 2: Assemble `index.astro`** with all sections in spec order; `Base` layout.
- [ ] **Step 3: Verify** — `npm run build` passes; dev-server visual check against spec §3/§5 and the poster test.
- [ ] **Step 4: Commit** — `git commit -m "feat: unfiltered home page"`

### Task 8: Filtered mode

**Files:**
- Create: `src/components/FilteredDoc.astro`
- Create: `src/scripts/filter-toggle-client.js`
- Modify: `src/pages/index.astro`, `src/layouts/Base.astro`

**Interfaces:**
- Consumes: `resolveMode`/`persistMode` (Task 5), `site` (Task 4)
- Produces: `<html data-mode>` switching; `FilteredDoc` is rendered into the page (hidden in unfiltered mode) so the swap is CSS-driven, no client rendering

- [ ] **Step 1: Build `FilteredDoc.astro`**: grayscale Notion-flavored document (breadcrumb `erica-menin / portfolio`, page icon, Inter type, gray tag pills, toggle-list selected work linking to case studies, Download CV / LinkedIn / email buttons, closing line "This is the filtered version. The real one is one toggle away."). Colors: `#ffffff` bg, `#37352f` text, `#787774` secondary, `#ebebea` rules — grayscale only.
- [ ] **Step 2: Wire the toggle**: inline pre-paint script in `Base.astro` head sets `data-mode` from `resolveMode({ urlSearch: location.search, stored: localStorage.getItem('filter-mode') })` (no flash); `filter-toggle-client.js` handles clicks → choreographed transition: unfiltered sections fade/translate out staggered (`--dur-base`, `--ease-out-long`), document fades in ("the dark drains out"), then `persistMode`. Reduced motion: instant swap.
- [ ] **Step 3: Verify**: toggle both ways, reload persistence, `?filter=on` override, no flash-of-wrong-mode on hard reload.
- [ ] **Step 4: Commit** — `git commit -m "feat: filtered mode with choreographed toggle"`

### Task 9: Case studies

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/work/iq-design-system.md`, `src/content/work/soniq.md`
- Create: `src/pages/work/[slug].astro`
- Modify: `src/components/WorkIndex.astro` (switch to `getCollection('work')`)

**Interfaces:**
- Produces: collection `work` with schema `{ title, tag, year, order, summary, external?: string }`; case-study page template (dark mode styling; readable measure ~68ch; display-serif headings; images full-bleed)

- [ ] **Step 1: Define schema in `content.config.ts`** (zod via `astro:content`).
- [ ] **Step 2: Migrate content** from `soniq-design-system.html`, `soniq-app-design.html`, `voyager-design-system.html` — extract the real text, rewrite structure into Markdown (context → role → process → outcome), reuse images from `images/` (copy used ones to `public/images/`).
- [ ] **Step 3: Build `[slug].astro`** template with `getStaticPaths` from the collection.
- [ ] **Step 4: Verify build + visual check; commit** — `git commit -m "feat: case study collection and template"`

### Task 10: Writing archive + 404 + easter eggs

**Files:**
- Create: `src/pages/writing.astro`, `src/pages/404.astro`
- Create: `src/scripts/reveal.js` (also wires konami + console message)
- Modify: `src/layouts/Base.astro` (load reveal.js)

- [ ] **Step 1: `writing.astro`** — full issue list from `getIssues()`, ghost numerals, all linking out to Substack.
- [ ] **Step 2: `404.astro`** — dark mode, monumental "№404 — this page got lost in the dark", aura, link home.
- [ ] **Step 3: `reveal.js`** — IntersectionObserver mask-reveals for headlines/rows, scroll parallax on `.ghost-numeral` (translate `calc(var(--mess) * scroll-factor)`), konami listener (payload: fills the screen with the aura and a one-line joke — snake deferred, YAGNI), `console.log('%cunfiltered, even here. → https://designsystemsunfiltered.substack.com', ...)`.
- [ ] **Step 4: Verify, commit** — `git commit -m "feat: writing archive, 404, motion reveals, easter eggs"`

### Task 11: Smooth scroll + motion polish

**Files:**
- Modify: `package.json` (add `lenis@^1`), `src/layouts/Base.astro`, `src/scripts/reveal.js`

- [ ] **Step 1: Add lenis**, init in Base (skip entirely under `prefers-reduced-motion` or in filtered mode).
- [ ] **Step 2: Polish pass** against spec §6 checklist: load reveal, hover ease-out, aura inertia, ticker speed, numeral drift. Tune on real devices/mobile.
- [ ] **Step 3: Verify 60fps** (DevTools performance profile on scroll), commit — `git commit -m "feat: weighted smooth scroll and motion polish"`

### Task 12: SEO, redirects, deploy cutover

**Files:**
- Modify: `src/layouts/Base.astro` (OG/twitter meta, google-site-verification `gb3KteFv6qGg6TPBfH3Xqvgp3hUo57jOywvOPJO5UJ8`, favicon)
- Modify: `netlify.toml`, `_redirects`
- Delete: old Webflow export files (`index.html`, `mcs-website.html`, `soniq-*.html`, `voyager-design-system.html`, `component-library.html`, `article-template.html`, `css/`, `js/` — after confirming nothing else references them)

- [ ] **Step 1: Meta**: OG title/description/image (new OG image can reuse `images/emenin-opengraph.jpg` initially), canonical URLs.
- [ ] **Step 2: `netlify.toml`**: `command = "npm run build"`, `publish = "dist"`.
- [ ] **Step 3: `_redirects`**: keep existing design-system-calendar redirect; add `/soniq-app-design.html /work/soniq 301`, `/soniq-design-system.html /work/soniq 301`, plus any old URLs found in Search Console.
- [ ] **Step 4: Full `npm run build` + `npm run preview` walkthrough** of every page in both modes, mobile viewport included.
- [ ] **Step 5: Delete old export files, commit** — `git commit -m "feat: cutover to Astro site with redirects and SEO meta"`
- [ ] **Step 6: Push and verify Netlify deploy** (user confirms live site).

### Task 13: USER CHECKPOINT — launch review

- [ ] Walk the user through the deployed preview (Netlify deploy preview URL), both modes, mobile.
- [ ] Lighthouse mobile run: performance ≥ 90 (spec §10). If grain/motion cost too much, reduce grain resolution / rAF throttle aura.
- [ ] Remove `/prototype` page, final commit — `git commit -m "chore: remove prototype page"`

---

## Self-review notes

- Spec coverage: concept/modes (T5, T8), visual language + typography (T1–T3), structure §5 (T7, T9, T10), motion §6 (T2, T10, T11), tech §7 (T1, T6, T12), migration §8 (T9, T12), open items §9 (T3 checkpoint), success criteria §10 (T13).
- The word "elegant" appears nowhere in shipped copy (constraint carried in Global Constraints).
- Type consistency: `Issue`, `resolveMode`, `site` shapes defined once and referenced by name elsewhere.
