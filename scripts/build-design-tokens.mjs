#!/usr/bin/env node
/**
 * build-design-tokens.mjs — generate design-tokens.json from css/tokens.css.
 *
 * css/tokens.css is the SINGLE SOURCE OF TRUTH. This script parses its custom
 * properties and emits a W3C Design Tokens (DTCG) file so the tokens are also
 * machine-readable. Run it whenever tokens.css changes:
 *
 *   npm run tokens        (or: node scripts/build-design-tokens.mjs)
 *
 * Design choices (kept deliberately explicit):
 *   - Palette/semantic aliases are preserved as DTCG references, so
 *     `var(--purple-800)` becomes `{palette.purple.800}` — the relationship
 *     survives the export instead of being flattened to a hex value.
 *   - Every token records its exact source custom property under
 *     `$extensions["com.ericamenin.tokens"].cssVar`, so the mapping back to
 *     tokens.css is explicit and never inferred from the group path.
 *   - Zero dependencies. Plain Node, no build tooling required.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const SRC = resolve(REPO_ROOT, 'css/tokens.css');
const OUT = resolve(REPO_ROOT, 'design-tokens.json');
const EXT_NS = 'com.ericamenin.tokens';

/** Color families that live under palette.<family>.<shade>. */
const COLOR_FAMILIES = new Set([
  'purple', 'pink', 'rose', 'gray', 'slate', 'blue', 'red', 'yellow',
]);

/**
 * Map a CSS custom-property name to a DTCG group path + token type.
 * Returns { path: string[], type: string }.
 */
function classify(name) {
  // Whites: --white / --white-pure → palette.white.{default,pure}
  if (name === 'white') return { path: ['palette', 'white', 'default'], type: 'color' };
  if (name === 'white-pure') return { path: ['palette', 'white', 'pure'], type: 'color' };

  const [head, ...rest] = name.split('-');

  if (COLOR_FAMILIES.has(head)) {
    return { path: ['palette', head, rest.join('-')], type: 'color' };
  }
  if (head === 'color') return { path: ['color', rest.join('-')], type: 'color' };
  if (head === 'space') return { path: ['space', rest.join('-')], type: 'dimension' };
  if (head === 'text') return { path: ['text', rest.join('-')], type: 'dimension' };
  if (head === 'radius') return { path: ['radius', rest.join('-')], type: 'dimension' };
  if (head === 'shadow') return { path: ['shadow', rest.join('-')], type: 'shadow' };
  if (head === 'font') return { path: ['font', rest.join('-')], type: 'fontFamily' };

  throw new Error(`Unrecognised token "--${name}". Add a rule to classify().`);
}

/** Parse the :root block into ordered [{ name, value, comment }]. */
function parseCss(css) {
  const declRe = /--([\w-]+)\s*:\s*([^;]+);(?:\s*\/\*\s*(.*?)\s*\*\/)?/g;
  const out = [];
  let m;
  while ((m = declRe.exec(css)) !== null) {
    out.push({ name: m[1], value: m[2].trim(), comment: (m[3] || '').trim() });
  }
  return out;
}

/** Resolve a raw literal value for a var name (follows var() chains). */
function literalOf(name, byName) {
  const decl = byName.get(name);
  if (!decl) throw new Error(`Unknown var reference: --${name}`);
  const ref = decl.value.match(/^var\(--([\w-]+)\)$/);
  return ref ? literalOf(ref[1], byName) : decl.value;
}

/** Split a font-family list into a DTCG fontFamily array, stripping quotes. */
function toFontFamily(value) {
  return value
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

/** Parse a single box-shadow string into a DTCG shadow object. */
function toShadow(value, byName) {
  // Resolve any embedded var() to its literal (e.g. the focus ring colour).
  const resolved = value.replace(/var\(--([\w-]+)\)/g, (_, n) => literalOf(n, byName));
  const colorMatch = resolved.match(/(rgba?\([^)]*\)|#[0-9a-fA-F]{3,8})/);
  const color = colorMatch ? colorMatch[0] : undefined;
  const lengths = (color ? resolved.replace(color, '') : resolved).trim().split(/\s+/).filter(Boolean);
  const [offsetX = '0', offsetY = '0', blur = '0', spread = '0'] = lengths;
  return { color, offsetX, offsetY, blur, spread };
}

function main() {
  const css = readFileSync(SRC, 'utf8');
  const decls = parseCss(css);
  const byName = new Map(decls.map((d) => [d.name, d]));

  // Pass 1: cssVar → dotted DTCG path, for reference resolution.
  const pathByVar = new Map();
  for (const d of decls) pathByVar.set(d.name, classify(d.name).path.join('.'));

  // Pass 2: build the nested token tree in source order.
  const root = {
    $description:
      'Design tokens for Érica Menin’s portfolio (ericamenin.com). '
      + 'Generated from css/tokens.css — the single source of truth — in W3C DTCG format. '
      + 'Do not edit by hand; run `npm run tokens` to regenerate.',
  };

  for (const d of decls) {
    const { path, type } = classify(d.name);
    let node = root;
    for (const seg of path.slice(0, -1)) node = (node[seg] ??= {});
    const key = path[path.length - 1];

    let $value;
    const varRef = d.value.match(/^var\(--([\w-]+)\)$/);
    if (type === 'fontFamily') {
      $value = toFontFamily(d.value);
    } else if (type === 'shadow') {
      $value = toShadow(d.value, byName);
    } else if (varRef) {
      $value = `{${pathByVar.get(varRef[1])}}`; // DTCG alias
    } else {
      $value = d.value;
    }

    node[key] = {
      $type: type,
      $value,
      ...(d.comment ? { $description: d.comment } : {}),
      $extensions: { [EXT_NS]: { cssVar: `--${d.name}` } },
    };
  }

  writeFileSync(OUT, JSON.stringify(root, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${OUT} (${decls.length} tokens from ${decls.length} custom properties).`);
}

main();
