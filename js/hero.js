// Hero personality, kept light:
// 1. "a new reader" is scanned: a thin beam passes over it and lights it up,
//    once after load and again when the phrase is hovered.
// 2. A faint pink glow follows the pointer across the hero.
// Both are skipped under prefers-reduced-motion; the glow needs a real pointer.
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  var phrase = document.querySelector('.hero-headline-em');
  if (!hero || !phrase) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ----- Scan -----
  // A beam passes over the phrase and lights it up (styles: .scan in
  // components.css). Restarting means removing the class and forcing a reflow.
  function scan() {
    if (reducedMotion.matches) return;
    phrase.classList.remove('is-scanning');
    void phrase.offsetWidth;
    phrase.classList.add('is-scanning');
  }

  // Let the entrance animation land first.
  setTimeout(scan, 700);
  phrase.addEventListener('pointerenter', scan);

  // ----- Pointer glow -----
  if (!window.matchMedia('(hover: hover)').matches) return;

  var pending = null;
  hero.addEventListener('pointermove', function (event) {
    if (reducedMotion.matches) return;
    var rect = hero.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    if (pending) cancelAnimationFrame(pending);
    pending = requestAnimationFrame(function () {
      hero.style.setProperty('--hero-px', x + 'px');
      hero.style.setProperty('--hero-py', y + 'px');
      hero.classList.add('is-glowing');
    });
  });

  hero.addEventListener('pointerleave', function () {
    hero.classList.remove('is-glowing');
  });
})();
