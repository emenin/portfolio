'use strict';
// Homepage experiments: "Break the system" (A) and "Rebuild with" another design system (B).
// Both set html[data-system]; nothing is stored, so a reload is always the real site.
(() => {
 const root = document.documentElement;
 const breakButton = document.querySelector('.system-break');
 const options = [...document.querySelectorAll('[data-system-option]')];
 const overlay = document.querySelector('.system-generating');
 const status = document.getElementById('system-status');
 const legend = document.querySelector('.system-legend-details');
 const phone = matchMedia('(max-width:767px)');
 if (!breakButton || !overlay) return;
 const reduced = matchMedia('(prefers-reduced-motion:reduce)');
 const loadedFonts = new Set();
 let busy = false;

 const current = () => root.dataset.system || 'mine';
 const labelFor = key => key === 'broken' ? 'no design system' : (options.find(o => o.dataset.systemOption === key)?.dataset.label || 'my design system');

 function loadFont(key) {
  const url = options.find(o => o.dataset.systemOption === key)?.dataset.font;
  if (!url || loadedFonts.has(url)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet'; link.href = url;
  document.head.append(link); loadedFonts.add(url);
 }

 function swap(key) {
  if (key === 'mine') delete root.dataset.system; else root.dataset.system = key;
  // On phones the list starts folded so it doesn't cover the hero.
  if (key === 'broken' && legend) legend.open = !phone.matches;
  breakButton.setAttribute('aria-pressed', String(key === 'broken'));
  breakButton.textContent = key === 'broken' ? 'Fix it' : 'Break the system';
  // "Mine" counts as pressed only when the real system is showing.
  options.forEach(o => o.setAttribute('aria-pressed', String(o.dataset.systemOption === key)));
  status.textContent = key === 'mine' ? 'Back to my design system.' : key === 'broken' ? 'Rebuilt without a design system. Four mistakes are listed.' : `Rebuilt with ${labelFor(key)} tokens.`;
 }

 function apply(key) {
  if (busy || key === current()) return;
  loadFont(key);
  if (reduced.matches) { swap(key); return; }
  busy = true;
  overlay.querySelector('span').textContent = key === 'mine' ? 'Restoring my system…' : key === 'broken' ? 'Letting AI build it without the system…' : `Rebuilding with ${labelFor(key)}…`;
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('active'));
  setTimeout(() => swap(key), 450);
  setTimeout(() => { overlay.classList.remove('active'); setTimeout(() => { overlay.hidden = true; busy = false; }, 250); }, 950);
 }

 breakButton.addEventListener('click', () => apply(current() === 'broken' ? 'mine' : 'broken'));
 options.forEach(o => o.addEventListener('click', () => apply(o.dataset.systemOption)));
 document.addEventListener('click', e => { if (e.target.closest('[data-system-reset]')) { apply('mine'); breakButton.focus({preventScroll:true}); } });
 document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || current() === 'mine' || document.querySelector('dialog[open]')) return;
  apply('mine');
 });
})();
