// AI + Design Systems (.ai-essay): entrance dressing only.
// - [data-reveal] elements already rise into place via the site-wide
//   js/section-reveal.js (adds .is-visible on first intersect). This just
//   staggers them with a per-element transition-delay, in document order.
// - The dot-grid background (.ai-essay-bg) drifts slower than the text while
//   the section is on screen, for a sense of depth.
// Neither touches .spec-read after it settles, so js/ai-read.js's lens (which
// measures the element on pointermove) is unaffected once revealed.
(function () {
  'use strict';

  var section = document.querySelector('.ai-essay');
  if (!section) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ---- Stagger the reveal ----------------------------------------------------------
  if (!reducedMotion.matches) {
    [].slice.call(section.querySelectorAll('[data-reveal]')).forEach(function (el, i) {
      el.style.transitionDelay = (i * 90) + 'ms';
    });
  }

  // ---- Depth parallax on the dot-grid background ------------------------------------
  var bg = section.querySelector('.ai-essay-bg');
  if (!bg || reducedMotion.matches) return;

  var ticking = false;

  function update() {
    ticking = false;
    var rect = section.getBoundingClientRect();
    // Progress through the section, 0 as it enters the bottom of the viewport,
    // 1 as it leaves the top: the background drifts a fraction of that range.
    var total = rect.height + window.innerHeight;
    var progress = (window.innerHeight - rect.top) / total;
    progress = Math.min(1, Math.max(0, progress));
    var shift = (progress - 0.5) * 60; // px of drift, slower than the scroll itself
    bg.style.transform = 'translateY(' + shift.toFixed(1) + 'px)';
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
