#!/usr/bin/env node
// Builds the "Things I wrote (Unfiltered)" section of index.html from the
// Design Systems Unfiltered RSS feed.
//
// This runs at deploy time (see netlify.toml) so the posts ship as static
// HTML: no client-side fetch, no third-party CORS proxy, and the titles are
// in the page source where crawlers and answer engines can read them.
//
// Which posts appear is controlled by data/unfiltered.json — see selectPosts.
// Everything else (title, blurb, image, date) always comes fresh from the feed.
//
// Run locally with `node scripts/build-unfiltered.mjs` to refresh the
// committed markup, then `npx prettier --write index.html`.
//
// If the feed is unreachable or unparseable this exits 0 without touching
// index.html, so a bad feed can never fail a deploy — the committed rows
// stay as the last known good version.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'data/unfiltered.json');
const HTML_PATH = join(ROOT, 'index.html');

const FEED = 'https://designsystemsunfiltered.substack.com/feed';
const PUBLICATION = 'https://designsystemsunfiltered.substack.com/';
const AUTHOR_ID = 'https://ericamenin.com/#erica';
const TIMEOUT_MS = 10000;
const PRINT_WIDTH = 80; // matches .prettierrc's default printWidth
const BLURB_MAX = 160;

const ROWS_START = '<!-- unfiltered:start -->';
const ROWS_END = '<!-- unfiltered:end -->';
const JSONLD_START = '<!-- unfiltered-jsonld:start -->';
const JSONLD_END = '<!-- unfiltered-jsonld:end -->';

// --- text helpers -----------------------------------------------------------

const NAMED_ENTITIES = {
  amp: '&',
  apos: "'",
  gt: '>',
  hellip: '…',
  lsquo: '‘',
  lt: '<',
  ldquo: '“',
  mdash: '—',
  nbsp: ' ',
  ndash: '–',
  quot: '"',
  rsquo: '’',
  rdquo: '”',
};

// Substack wraps fields in CDATA but still writes HTML entities inside them
// (e.g. &#8217;), so decoding happens after the CDATA wrapper comes off.
function decodeEntities(value) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, body) => {
    if (body[0] === '#') {
      const hex = body[1] === 'x' || body[1] === 'X';
      const code = parseInt(hex ? body.slice(2) : body.slice(1), hex ? 16 : 10);
      return Number.isFinite(code) && code > 0
        ? String.fromCodePoint(code)
        : match;
    }
    const name = body.toLowerCase();
    return name in NAMED_ENTITIES ? NAMED_ENTITIES[name] : match;
  });
}

// The feed mixes straight and curly quotes; the site uses curly throughout.
function smartQuotes(value) {
  return value
    .replace(/(^|[\s([{<])"/g, '$1“')
    .replace(/"/g, '”')
    .replace(/(\w)'(\w)/g, '$1’$2')
    .replace(/(^|[\s([{<])'/g, '$1‘')
    .replace(/'/g, '’');
}

function clean(value) {
  return smartQuotes(decodeEntities(value).replace(/\s+/g, ' ').trim());
}

function escapeText(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value) {
  return escapeText(value).replace(/"/g, '&quot;');
}

// Greedy fill at PRINT_WIDTH, mirroring how prettier wraps block-level text.
function fillText(value, indent) {
  const pad = ' '.repeat(indent);
  const lines = [];
  let line = '';
  for (const word of value.split(' ')) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && indent + candidate.length > PRINT_WIDTH) {
      lines.push(pad + line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(pad + line);
  return lines;
}

// A block-level element prettier keeps on one line when it fits.
function block(tag, open, content, indent) {
  const pad = ' '.repeat(indent);
  const oneLine = `${pad}<${open}>${content}</${tag}>`;
  if (oneLine.length <= PRINT_WIDTH) return [oneLine];
  return [
    `${pad}<${open}>`,
    ...fillText(content, indent + 2),
    `${pad}</${tag}>`,
  ];
}

// --- feed -------------------------------------------------------------------

function tagValue(item, tag) {
  const match = item.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i')
  );
  if (!match) return '';
  return match[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, '$1');
}

function slugFor(link) {
  try {
    return new URL(link).pathname.split('/').filter(Boolean).pop() || '';
  } catch {
    return '';
  }
}

function imageFor(item, body) {
  const enclosure = item.match(/<enclosure\b[^>]*\burl="([^"]+)"/i);
  if (enclosure) return decodeEntities(enclosure[1]);
  const inline = body.match(/<img[^>]+src="([^"]+)"/i);
  return inline ? decodeEntities(inline[1]) : '';
}

// Substack subtitles are written without closing punctuation; the section has
// always read as full sentences, so finish them off.
function endStop(value) {
  return /[.!?…:;]$/.test(value) ? value : `${value}.`;
}

function blurbFor(item) {
  const raw =
    tagValue(item, 'description') || tagValue(item, 'content:encoded');
  const plain = clean(raw.replace(/<[^>]+>/g, ' '));
  if (plain.length <= BLURB_MAX) return endStop(plain);
  return `${plain.slice(0, BLURB_MAX - 3).trimEnd()}…`;
}

// The publication's own name, tagline and URL, straight from the feed head,
// so the structured data never drifts from what Substack says.
function parseChannel(xml) {
  const head = xml.slice(0, xml.search(/<item\b/i) + 1);
  return {
    name: clean(tagValue(head, 'title')) || 'Design Systems Unfiltered',
    description: clean(tagValue(head, 'description')),
    url: tagValue(head, 'link').trim() || PUBLICATION,
  };
}

function parseFeed(xml) {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  return items
    .map((item) => {
      const link = tagValue(item, 'link').trim();
      const published = new Date(tagValue(item, 'pubDate').trim());
      return {
        title: clean(tagValue(item, 'title')),
        link,
        slug: slugFor(link),
        image: imageFor(item, tagValue(item, 'content:encoded')),
        blurb: blurbFor(item),
        published: Number.isNaN(published.valueOf())
          ? ''
          : published.toISOString(),
      };
    })
    .filter((post) => post.title && post.link && post.slug);
}

// Pinned slugs first, in the order they are listed, then the newest posts that
// are neither pinned nor excluded, until `count` slots are full.
function selectPosts(posts, config) {
  const count = Number(config.count) || 3;
  const exclude = new Set(config.exclude || []);
  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const chosen = [];
  const taken = new Set();

  for (const slug of config.pinned || []) {
    if (chosen.length >= count) break;
    if (exclude.has(slug) || taken.has(slug)) continue;
    const post = bySlug.get(slug);
    if (!post) {
      console.warn(`  ! pinned slug is not in the feed, skipping: ${slug}`);
      continue;
    }
    chosen.push(post);
    taken.add(slug);
  }

  for (const post of posts) {
    if (chosen.length >= count) break;
    if (exclude.has(post.slug) || taken.has(post.slug)) continue;
    chosen.push(post);
    taken.add(post.slug);
  }

  return chosen;
}

// --- rendering --------------------------------------------------------------

// Mirrors the markup the section already used, so the existing .article-row
// styles and the delegated hover cursor keep working unchanged.
function renderRows(posts, indent) {
  const pad = ' '.repeat(indent);
  const lines = [];
  for (const post of posts) {
    lines.push(
      `${pad}<a`,
      `${pad}  href="${escapeAttr(post.link)}"`,
      `${pad}  target="_blank"`,
      `${pad}  rel="noopener noreferrer"`,
      `${pad}  class="article-row w-inline-block"`,
      `${pad}>`
    );
    if (post.image) {
      lines.push(
        `${pad}  <div class="article-row-thumb">`,
        `${pad}    <img`,
        `${pad}      loading="lazy"`,
        `${pad}      src="${escapeAttr(post.image)}"`,
        `${pad}      alt="${escapeAttr(post.title)}"`,
        `${pad}      class="thumbnail"`,
        `${pad}    />`,
        `${pad}  </div>`
      );
    }
    lines.push(`${pad}  <div class="article-row-body">`);
    lines.push(
      ...block('h3', 'h3 class="label"', escapeText(post.title), indent + 4)
    );
    if (post.blurb) {
      lines.push(...block('p', 'p', escapeText(post.blurb), indent + 4));
    }
    lines.push(`${pad}  </div>`, `${pad}</a>`);
  }
  return lines.join('\n');
}

// Blog + BlogPosting so answer engines can read the writing as structured
// data. `author` points at the Person node already declared in index.html.
function renderJsonLd(posts, channel, indent) {
  const pad = ' '.repeat(indent);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${PUBLICATION}#blog`,
    name: channel.name,
    url: channel.url,
    author: { '@id': AUTHOR_ID },
    blogPost: posts.map((post) => {
      const entry = {
        '@type': 'BlogPosting',
        headline: post.title,
        url: post.link,
        author: { '@id': AUTHOR_ID },
      };
      if (post.published) entry.datePublished = post.published;
      if (post.image) entry.image = post.image;
      if (post.blurb) entry.description = post.blurb;
      return entry;
    }),
  };
  if (channel.description) data.description = channel.description;
  const json = JSON.stringify(data, null, 2)
    .split('\n')
    .map((line) => pad + '  ' + line)
    .join('\n');
  return [
    `${pad}<script type="application/ld+json">`,
    json,
    `${pad}</script>`,
  ].join('\n');
}

function splice(html, startMarker, endMarker, replacement) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`markers not found in index.html: ${startMarker}`);
  }
  const head = html.slice(0, start + startMarker.length);
  const tail = html.slice(end);
  return `${head}\n${replacement}\n${' '.repeat(indentOf(html, end))}${tail.trimStart()}`;
}

function indentOf(html, index) {
  const lineStart = html.lastIndexOf('\n', index - 1) + 1;
  return index - lineStart;
}

// --- main -------------------------------------------------------------------

async function main() {
  const config = JSON.parse(await readFile(CONFIG_PATH, 'utf8'));
  const html = await readFile(HTML_PATH, 'utf8');

  const response = await fetch(FEED, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { accept: 'application/rss+xml, application/xml, text/xml' },
  });
  if (!response.ok) throw new Error(`feed responded HTTP ${response.status}`);

  const xml = await response.text();
  const channel = parseChannel(xml);
  const posts = selectPosts(parseFeed(xml), config);
  if (!posts.length) throw new Error('feed contained no usable posts');

  const rowsIndent = indentOf(html, html.indexOf(ROWS_START));
  const jsonLdIndent = indentOf(html, html.indexOf(JSONLD_START));

  let next = splice(html, ROWS_START, ROWS_END, renderRows(posts, rowsIndent));
  next = splice(
    next,
    JSONLD_START,
    JSONLD_END,
    renderJsonLd(posts, channel, jsonLdIndent)
  );

  if (next === html) {
    console.log('unfiltered: already up to date');
  } else {
    await writeFile(HTML_PATH, next);
  }
  console.log(`unfiltered: wrote ${posts.length} post(s) into index.html`);
  for (const post of posts) console.log(`  · ${post.title}`);
}

main().catch((error) => {
  // Never fail the deploy over the feed: keep the committed markup and move on.
  console.warn(
    `unfiltered: skipped, keeping committed markup (${error.message})`
  );
  process.exit(0);
});
