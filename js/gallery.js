'use strict';
// Retain the published carousel and image lightboxes without the Webflow runtime.
document.querySelectorAll('.w-slider').forEach(slider => {
  const slides = [...slider.querySelectorAll('.w-slide')], nav = slider.querySelector('.w-slider-nav');
  let index = 0;
  const buttons = slides.map((_,i) => { const b = document.createElement('button'); b.className = 'w-slider-dot'; b.setAttribute('aria-label', `Show slide ${i+1} of ${slides.length}`); b.addEventListener('click', () => show(i)); nav?.append(b); return b; });
  function show(i) { index = (i + slides.length) % slides.length; slides.forEach((s,n) => { s.classList.toggle('active', n === index); s.setAttribute('aria-hidden', String(n !== index)); }); buttons.forEach((b,n) => { b.classList.toggle('w-active', n === index); b.setAttribute('aria-pressed', String(n === index)); }); }
  [['.w-slider-arrow-left',-1,'Previous slide'],['.w-slider-arrow-right',1,'Next slide']].forEach(([selector,delta,label]) => { const control = slider.querySelector(selector); if (!control) return; control.setAttribute('role','button'); control.tabIndex = 0; control.setAttribute('aria-label',label); control.textContent = delta < 0 ? '←' : '→'; control.addEventListener('click', () => show(index+delta)); control.addEventListener('keydown',e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(index+delta); } }); });
  show(0);
});
const lightbox = document.createElement('dialog'); lightbox.className = 'gallery-dialog'; lightbox.setAttribute('aria-label','Project image');
const close = document.createElement('button'); close.textContent = 'Close image'; const image = document.createElement('img'); lightbox.append(close,image); document.body.append(lightbox);
close.addEventListener('click', () => lightbox.close());
let trigger;
lightbox.addEventListener('close', () => trigger?.focus());
document.querySelectorAll('.w-lightbox').forEach(link => {
  link.setAttribute('aria-label','Open project image');
  link.addEventListener('click',e => { e.preventDefault(); const data = link.querySelector('.w-json'); let item; try { item = JSON.parse(data.textContent).items[0]; } catch { return; } trigger = link; image.src = item.url; image.alt = link.querySelector('img')?.alt || 'Project image'; lightbox.showModal(); close.focus(); });
});
