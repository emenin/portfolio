// Fades/slides in elements marked .reveal-on-scroll the first time they
// scroll into view. Independent of the site's own Webflow scroll-reveal
// system, which doesn't reliably fire (see the About section's stuck
// opacity:0 elements) — this one just uses a plain IntersectionObserver.
(function () {
  'use strict';

  var targets = document.querySelectorAll('.reveal-on-scroll');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
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
    { threshold: 0.2 }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
