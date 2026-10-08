'use strict';
// Homepage experiment: "Rebuild with" another design system, or with none.
// Sets html[data-system]; nothing is stored, so a reload is always the real site.
(() => {
 const root = document.documentElement;
 const options = [...document.querySelectorAll('[data-system-option]')];
 const overlay = document.querySelector('.system-generating');
 const status = document.getElementById('system-status');
 if (!options.length || !overlay) return;
 const reduced = matchMedia('(prefers-reduced-motion:reduce)');
 const loadedFonts = new Set();
 let busy = false;

 const current = () => root.dataset.system || 'mine';
 const option = key => options.find(o => o.dataset.systemOption === key);

 function loadFont(key) {
  const url = option(key)?.dataset.font;
  if (!url || loadedFonts.has(url)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet'; link.href = url;
  document.head.append(link); loadedFonts.add(url);
 }

 function swap(key) {
  if (key === 'mine') delete root.dataset.system; else root.dataset.system = key;
  // Every card opens in its first state: the mapping folded.
  document.querySelectorAll('.system-card details[open]').forEach(d => { d.open = false; });
  options.forEach(o => o.setAttribute('aria-pressed', String(o.dataset.systemOption === key)));
  status.textContent = key === 'mine' ? 'Back to my design system.' : key === 'broken' ? 'Rebuilt with no design system.' : `Rebuilt with ${option(key).dataset.label} tokens.`;
 }

 function apply(key) {
  if (busy || key === current()) return;
  loadFont(key);
  if (reduced.matches) { swap(key); return; }
  busy = true;
  overlay.querySelector('span').textContent = key === 'mine' ? 'Restoring my system…' : key === 'broken' ? 'Rebuilding with no system…' : `Rebuilding with ${option(key).dataset.label}…`;
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('active'));
  setTimeout(() => swap(key), 450);
  setTimeout(() => { overlay.classList.remove('active'); setTimeout(() => { overlay.hidden = true; busy = false; }, 250); }, 950);
 }

 options.forEach(o => o.addEventListener('click', () => apply(o.dataset.systemOption)));
 document.addEventListener('click', e => { if (e.target.closest('[data-system-reset]')) { apply('mine'); option('mine').focus({preventScroll:true}); } });
 document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || current() === 'mine' || document.querySelector('dialog[open]')) return;
  apply('mine');
 });
})();
