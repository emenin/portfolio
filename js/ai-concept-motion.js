// Shared editorial depth. Never move the essay's interactive reading surface:
// ai-read.js owns its pointer coordinates and matched text layers.
(function () {
  'use strict';

  var section = document.querySelector('.ai-essay-concept');
  if (!section) return;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var pending = null;
  var sections = document.querySelectorAll('.is-home > .section:not(.ai-essay), .is-home > .hero');

  function update() {
    pending = null;
    if (reducedMotion.matches) {
      section.style.removeProperty('--concept-progress');
      sections.forEach(function (el) { el.style.removeProperty('--section-progress'); });
      return;
    }
    var viewport = window.innerHeight;
    sections.forEach(function (el) {
      var bounds = el.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > viewport) return;
      var depth = 1 - 2 * (viewport - bounds.top) / (viewport + bounds.height);
      el.style.setProperty('--section-progress', depth.toFixed(4));
    });
    var rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > viewport) return;
    var progress = 1 - 2 * (viewport - rect.top) / (viewport + rect.height);
    section.style.setProperty('--concept-progress', progress.toFixed(4));
  }

  function schedule() {
    if (pending === null) pending = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  reducedMotion.addEventListener('change', schedule);
  // The rewrite changes the essay's height; update depth after layout settles.
  section.addEventListener('click', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(section);
  schedule();

  // Cursor feedback describes the action. The Inspect target gets a compact
  // measuring reticle; articles read, case studies open with the View cursor.
  var cursor = document.querySelector('.cursor-wrapper');
  if (cursor && window.matchMedia('(hover: hover)').matches) {
    var label = cursor.querySelector('.tooltiplabel');
    function cursorState(target) {
      if (!(target instanceof Element)) return;
      var inner = target.closest('.hero-inner');
      var toggle = inner && inner.querySelector('.hero-inspect-switch');
      var inspectable = target.closest('.hero-headline, .hero-standfirst, .hero-masthead');
      cursor.classList.toggle('cursor-inspecting', !!(!target.closest('.hero-reader-discovery') && inspectable && toggle && toggle.getAttribute('aria-checked') === 'true'));
      var link = target.closest('.article-row, #work .card, .is-home a.link, .is-home .site-footer-note a, .is-home .site-footer-copy');
      cursor.classList.toggle('cursor-hover-tile', !!link);
      cursor.classList.toggle('cursor-copy', !!(link && link.matches('.site-footer-copy')));
      if (label && link) label.textContent = link.matches('.site-footer-copy') ? 'Copy' : link.matches('.article-row') ? 'Read' : 'View';
    }
    document.addEventListener('pointerover', function (event) { cursorState(event.target); });
    document.addEventListener('pointerout', function (event) {
      if (event.relatedTarget) cursorState(event.relatedTarget);
      else cursor.classList.remove('cursor-inspecting');
    });
  }
})();
