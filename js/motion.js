'use strict';
(() => {
 const reduced = matchMedia('(prefers-reduced-motion:reduce)');
 const pointer = matchMedia('(hover:hover) and (pointer:fine)');
 const cursor = document.querySelector('.read-cursor');
 const label = cursor.querySelector('span');
 // The native pointer is hidden only while the custom one is on screen, so one is always visible.
 function hideCursor() { cursor.classList.remove('visible','active','clickable'); document.body.classList.remove('cursor-ready'); }
 function move(e) {
  if(reduced.matches || !pointer.matches) return;
  if(e.target.closest('dialog') || getComputedStyle(cursor).display === 'none') { hideCursor(); return; }
  document.body.classList.add('cursor-ready');
  cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`;
  const action = e.target.closest('[data-cursor],a[href]');
  const light = e.target.closest('.light-section,.section.project,.case-back');
  cursor.classList.toggle('on-light',!!light);
  cursor.classList.add('visible'); cursor.classList.toggle('active',!!action);
  cursor.classList.toggle('clickable',!action && !!e.target.closest('a,button,[role=button]'));
  const verb = action?.dataset.cursor || 'View';
  label.textContent = action ? `${verb.toUpperCase()}${verb === 'Copy' ? '' : ' ↗'}` : '';
 }
 document.addEventListener('pointermove',move,{passive:true});
 document.addEventListener('mouseout',e => { if(!e.relatedTarget) hideCursor(); });
 document.addEventListener('keydown',hideCursor);
 // Keep the contextual label during a hover even while the page settles.
 document.addEventListener('pointerover',move,{passive:true});
 reduced.addEventListener('change',hideCursor);
 document.querySelectorAll('.project-preview').forEach(card => {
  const target = card.querySelector('a');
  card.addEventListener('pointermove',e => {
   if(reduced.matches || !pointer.matches) return;
   const r = card.getBoundingClientRect();
   target.style.setProperty('--tilt-x',`${((e.clientY-r.top)/r.height-.5)*-14}deg`);
   target.style.setProperty('--tilt-y',`${((e.clientX-r.left)/r.width-.5)*14}deg`);
  });
  card.addEventListener('pointerleave',() => { target.style.removeProperty('--tilt-x'); target.style.removeProperty('--tilt-y'); });
 });
 document.querySelectorAll('.w-lightbox').forEach(a => a.dataset.cursor='View');
 // Delegate so terminal responses inserted later behave like the footer.
 document.addEventListener('click', async e => {
  const button = e.target.closest('[data-copy]');
  if(!button) return;
  const status = button.closest('.copy-control').querySelector('.copy-status');
  const hint = button.querySelector('.copy-hint');
  clearTimeout(button.copyReset);
  try { await navigator.clipboard.writeText(button.dataset.copy); hint.textContent='Copied'; status.textContent='My email address is copied'; }
  catch { status.textContent='Select and copy: '+button.dataset.copy; }
  button.copyReset=setTimeout(() => { hint.textContent='Copy'; status.textContent=''; },2800);
 });
 const reveal = document.querySelector('.about-reveal');
 if(reveal) {
  const photo = document.getElementById('about-photo');
  let pinned = false;
  function show(open) { reveal.setAttribute('aria-expanded',String(open)); photo.setAttribute('aria-hidden',String(!open)); photo.classList.toggle('visible',open); }
  reveal.addEventListener('pointerenter',e => { if(e.pointerType !== 'touch') show(true); });
  reveal.addEventListener('pointerleave',() => { if(!pinned && document.activeElement !== reveal) show(false); });
  reveal.addEventListener('focus',() => show(true));
  reveal.addEventListener('blur',() => { pinned=false; show(false); });
  reveal.addEventListener('click',() => { pinned=!pinned; show(pinned); });
  reveal.addEventListener('keydown',e => { if(e.key==='Escape') { pinned=false; show(false); } });
 }
 // Content is always present; the original gentle arrival motion never gates reading.
 if(!reduced.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
   if(entry.isIntersecting) { entry.target.classList.add('editorial-arrive'); observer.unobserve(entry.target); }
  }),{threshold:.08});
  document.querySelectorAll('.section-label,.section-intro,.project-preview,.writing-intro,.writing-row,.about-copy p,.case-study .projectheader').forEach(el => observer.observe(el));
 }
})();
// Preserve the case-study contents index, including an equivalent focus reveal.
(() => {
 const items = [...document.querySelectorAll('.case-study .item_summary')];
 if(!items.length || !('IntersectionObserver' in window)) return;
 const sections = new Map();
 items.forEach(item => { const link=item.querySelector('a'); const section=document.querySelector(link.getAttribute('href')); if(section) sections.set(section,item); });
 const inBand = new Set();
 const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.isIntersecting ? inBand.add(entry.target) : inBand.delete(entry.target));
  const current = [...sections].find(([section]) => inBand.has(section))?.[1];
  if(current) items.forEach(item => { item.classList.toggle('is-current',item===current); const link=item.querySelector('a'); if(item===current) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
 },{rootMargin:'-30% 0px -55% 0px'});
 sections.forEach((_,section) => observer.observe(section));
 const end = document.querySelector('.case-back');
 if(end) new IntersectionObserver(entries => items[0].parentElement.classList.toggle('is-away',entries[0].isIntersecting)).observe(end);
})();
