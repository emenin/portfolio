// Hero: "a new reader" is scanned (a thin beam passes over it and lights it
// up), once after load and again when the phrase is hovered. Skipped under
// prefers-reduced-motion. The pointer glow lives in components.js ([data-glow]).
(function () {
  'use strict';

  var phrase = document.querySelector('.hero-headline-em');
  if (!phrase) return;

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

})();
