// Adds .is-visible to .reveal-on-scroll and [data-reveal] elements the first
// time they scroll into view (.reveal-on-scroll also fades/slides in). Independent of the site's own Webflow scroll-reveal
// system, which doesn't reliably fire (see the About section's stuck
// opacity:0 elements) — this one just uses a plain IntersectionObserver.
(function () {
  'use strict';

  // Reveal the individual reading beats, rather than fading a whole long
  // section at once. The approved AI essay retains its own existing sequence.
  var wholeSections = document.querySelectorAll('.is-home #unfiltered > .container, .is-home #what-i-do .tabcontent');
  wholeSections.forEach(function (el) { el.classList.remove('reveal-on-scroll'); });
  [
    '#work .work-intro, #work .card',
    '#unfiltered .heading-stretch, #unfiltered .work-intro, #unfiltered .article-row',
    '#what-i-do .tabsmenu, #what-i-do .item_dark',
    '#beliefs .w-layout-cell',
    '#about .about-bio p, #about .about-tiles-grid .tile'
  ].forEach(function (selector) {
    document.querySelectorAll('.is-home ' + selector.split(', ').join(', .is-home ')).forEach(function (el, index) {
      el.setAttribute('data-editorial-reveal', '');
      el.style.setProperty('--reveal-delay', Math.min(index % 3, 2) * 0.08 + 's');
    });
  });

  document.querySelectorAll('body.has-article-end .projectheader, body.has-article-end .studycase .flexblock > h3, body.has-article-end .studycase .flexblock > p, body.has-article-end .studycase figure, body.has-article-end .article-body > h3, body.has-article-end .article-body > p').forEach(function (el) {
    el.setAttribute('data-editorial-reveal', '');
  });
  var targets = document.querySelectorAll('.reveal-on-scroll, [data-reveal], [data-editorial-reveal]');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0, rootMargin: '0px 0px -24px 0px' }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
