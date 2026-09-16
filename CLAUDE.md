# Working in this repo

## Never push or deploy without asking

`netlify.toml` publishes `.` from the default branch, so **a push to `master`
is a publish to ericamenin.com**. There is no approval step between the commit
and the live site.

So: commit freely, push never — not to `master`, not to a feature branch —
until Érica says to. Same for anything else that leaves this machine: opening a
pull request, posting a comment, deploying. Ask first, every time. Permission
for one push is not permission for the next one.

When work is ready, say so and stop. Érica pushes the branch and opens the PR.

## The site

A static site, no framework and no bundler. The HTML at the root is the site;
`index.html` is the homepage and each case study or article is its own file.

- `python3 serve.py` runs it locally on :4321, with the clean-URL fallback that
  Netlify does in production. Use it rather than opening the files directly.
- `npm run build` only regenerates the Unfiltered section from the Substack
  feed (`scripts/build-unfiltered.mjs` → `data/unfiltered.json`). Nothing else
  is built; it exits 0 even when the feed is down.
- Pages that should not be indexed carry `<meta name="robots" content="noindex,
  nofollow">`. `sitemap.xml` lists only the indexable ones — keep the two in
  step when a page's status changes.

## CSS

Loaded in this order, and later files are expected to win:

`tokens.css` → `normalize.css` → `base.css` → `emenin-main.css` →
`components.css` → `terminal.css`

- Spacing, colour and type come from the tokens in `tokens.css`. Reach for a
  token before a literal value.
- `emenin-main.css` still carries the Webflow export's shape, class names and
  breakpoints (991 / 767 / 479px). `components.css` is the hand-written layer
  on top. New work goes in `components.css` unless it is genuinely editing the
  old layout.
- The repo is not uniformly Prettier-formatted, so `npm run format` would
  rewrite files you did not touch. Match the surrounding style by hand instead.

## Checking a change

Anything visual gets looked at before it is called done — on a phone viewport
as well as a desktop one. The two are far enough apart that a fix for one has
broken the other more than once.
