# ericamenin.com redesign — design spec

Date: 2026-07-03
Status: approved direction; open items resolved in live prototype phase (see §9)

## 1. Goal and audience

Redesign ericamenin.com to align with the Substack publication **Design Systems Unfiltered**.
The site is a personality-first hub that serves three audiences at once:

- **Recruiters / hiring managers** — proof of seniority via case studies and writing
- **Readers** — a home for the publication and its voice
- **Érica herself** — a site that feels like her: bold, honest, funny, not corporate-safe

Explicit anti-goals: no kawaii (that stays in article covers only), no corporate-safe,
no "vibe-coded portfolio" genericness, never self-describe as "elegant" in the copy.

## 2. Core concept — The Filter Switch

The site is an extension of the publication. One toggle in the header, branded with the
publication mark, switches between two modes:

### UNFILTERED (default)
Dark, atmospheric, refined. The real site.

### FILTERED
A deadpan, grayscale, Notion-flavored document. Deliberately plain but properly
designed: breadcrumb, page icon, Inter-style type, toggle-list work items, gray tags.
Genuinely useful for recruiters in a hurry: scannable summary, selected work links,
Download CV, LinkedIn, email. The copy is in on the joke
("This is the filtered version. The real one is one toggle away.") but the facts are real.

Mechanics:
- State persists in `localStorage`
- URL param `?filter=on` forces filtered mode (shareable with conservative recruiters)
- The toggle animates the transformation; it is the site's signature moment

## 2b. Quality bar — awarded portfolios as reference

The refinement target is the current Awwwards / Godly register of dark, typographic,
atmospheric portfolios — not "nice personal site" but "site of the day" craft:

- **Obys Agency** (des.obys.agency) — experimental motion + refined typography;
  the benchmark for type-led elegance and pacing
- **Phantom** (phantom.land) — kinetic, shape-shifting interfaces that stay legible
- Dark atmospheric portfolios curated on **godly.website** and
  **awwwards.com/websites/portfolio** — gradient glows, grain, cinematic scroll

What we borrow from them is the *smoothness*: nothing snaps, everything eases;
scroll feels weighted (lenis-style smooth scroll); transitions are choreographed,
not instant; typography is treated as the primary material. Every screen should
survive the test: "could this frame be a poster?"

## 3. Visual language (unfiltered mode)

- **Canvas**: near-black indigo `#0D0916`, film grain overlay
- **Palette as light, not fill**: radial auras of coral/magenta bleeding from off-canvas;
  the text gradient `#FFA07A → #FF6562 → #C04B83` (Substack palette, no gold) reserved
  for the most important words only
- **Foreground**: `#F5E8FF` for display text; hairline rules at ~14% white opacity; no boxes
- **Refinement rules**: few elements per screen, monumental type does the work,
  corners anchored by quiet mono metadata, aligned baselines, tabular index numerals
- **"Organized mess" dialed to ~10%**: looseness comes from scale, asymmetry, overlap
  (ghost issue numerals behind headlines), and motion — NOT from props.
  No handwriting fonts, no stickers, no taped cards. Rotation of any element stays subtle.
- Accessibility: respect `prefers-reduced-motion`; contrast-checked text opacities

## 4. Typography

- **Display serif**: high stroke contrast, round/oval bowls, fat-face character.
  Baseline: Playfair Display Black (+ italic). Candidates to audition in the live
  prototype: Zodiak, Recia, Editorial New (Fontshare). Requirement: must not feel
  "system-ready"; needs quirk. Final call made on the live page.
- **Mono**: JetBrains Mono light (or similar) for metadata, labels, tickers —
  letterspaced 0.14–0.26em, small sizes, low-opacity
- **Filtered mode**: Inter/system sans, grayscale Notion look
- Display sizes are monumental: hero headline fills the viewport width;
  work index titles ~44–56px desktop

## 5. Structure and IA

Home = one narrative scroll. Max two levels deep.

1. **Hero** — monumental statement (copy TBD, see §9), gradient italic on the key line,
   quiet mono credentials, aura, scroll cue
2. **Currently** — one-line marquee/ticker of current experiments (easy to edit)
3. **The work** — case-study index rows (huge type, hover illuminates: aura blooms,
   gradient pulls into the title). Selected work gets deep case-study pages
   (hybrid model): IQ Design System, Soniq, others migrated/rewritten as needed.
   Article-style pieces stay on Substack and appear in §4 instead.
4. **The publication** — latest issues pulled from Substack RSS at build time,
   ghost issue numerals, link out to Substack, subscribe CTA.
   A full writing archive page lists all issues.
5. **About** — short, honest, human; credentials in the storytelling; no services pitch
6. **Contact / footer** — one line, email, LinkedIn, Substack; rotating footer taglines

Filtered mode renders the same content as the Notion-style document (single page).

## 6. Motion and play

Smoothness is a first-class requirement (see §2b): the elegance lives in the easing.

- Weighted smooth scroll (lenis or equivalent), 60fps budget
- Cursor-following aura (desktop) with soft lag/inertia; gentle autonomous drift
  on mobile/touch
- Headline mask-reveal on load; type settles slowly; custom easing curves
  (long ease-out, nothing linear, nothing snapping)
- Work rows: glow + gradient on hover, slight type swell, eased both in and out
- Ghost numerals drift on scroll (parallax)
- Filter toggle transition is choreographed (the dark drains out / the document
  assembles), not an instant swap
- Grain is constant and subtle
- Easter eggs: konami code (payload TBD), fun 404, console message for devs
- Everything slow and subtle: atmosphere, not carnival

## 7. Tech

- **Astro** static site, deployed on **Netlify** (same repo, replaces Webflow export)
- Case studies as Markdown content collections
- Substack RSS fetched at build time for the publication section
  (fallback: last-known cached list committed to repo so builds never break)
- No client framework; small vanilla JS islands for toggle/cursor/motion
- Filter state: `localStorage` + `?filter=on` override
- Redirects from old case-study URLs (`soniq-app-design.html`, etc.) via `_redirects`
- Keep existing `/design-system-calendar` redirect behavior

## 8. Migration notes

- Current site is a Webflow export (static HTML/CSS/JS) — fully replaced
- Existing content to carry over: case study content (IQ/Soniq — rewritten into new
  case-study template), advent calendar links, contact links, OG/SEO metadata
  (rewritten copy), Google site verification tag
- Old `app/` Vite folder: untouched for now (separate experiment)

## 9. Open items (resolved in live prototype phase)

1. **Final display typeface** — audition Playfair Display Black vs. Zodiak, Recia,
   Editorial New live; user picks on real rendering
2. **Hero copy** — current placeholder "Systems that scale. Stories that don't hide
   the ugly." has the right idea but doesn't read right yet; rewrite together
3. **Mess level** — prototype includes a temporary "mess dial" to tune asymmetry/
   overlap/drift live; locked value becomes the shipped default
4. **Konami easter egg payload** — decide during build (candidate: snake)
5. **CV file** for the filtered mode download

## 10. Success criteria

- Feels recent, modern, creative; unmistakably Érica; zero corporate-safe
- A recruiter can reach scannable facts in under 10 seconds (via the toggle)
- Publication is discoverable from every page; RSS keeps it fresh without manual work
- Lighthouse: 90+ performance on mobile despite grain/motion
- Works beautifully on mobile (drift physics instead of cursor)
