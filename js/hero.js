// Hero: "a new reader" decodes like a machine reading it. Each letter flickers
// through glyphs and settles, left to right, once after load and again when
// the phrase is hovered. Skipped under prefers-reduced-motion. The pointer glow
// lives in components.js ([data-glow]).
(function () {
  'use strict';

  var phrase = document.querySelector('.hero-headline-em');
  if (!phrase) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var GLYPHS = 'abcdefghijklmnopqrstuvwxyz{}[]<>/_#*+=';
  var FLICKER_MS = 45;
  var START_MS = 80;
  var STEP_MS = 55;

  var headline = phrase.closest('h1');
  headline.setAttribute('aria-label', headline.textContent.replace(/\s+/g, ' ').trim());

  var letters = [];
  var text = phrase.textContent;
  phrase.textContent = '';
  Array.from(text).forEach(function (char) {
    if (char === ' ') {
      phrase.appendChild(document.createTextNode(' '));
      return;
    }
    var span = document.createElement('span');
    span.className = 'hero-char';
    span.setAttribute('aria-hidden', 'true');
    span.dataset.char = char;
    var glyph = document.createElement('span');
    glyph.className = 'hero-glyph';
    glyph.textContent = char;
    span.appendChild(glyph);
    phrase.appendChild(span);
    letters.push({ el: span, glyph: glyph, char: char });
  });

  var running = false;

  function decode() {
    if (running || reducedMotion.matches) return;
    running = true;
    var start = performance.now();
    var lastFlicker = 0;

    function frame(now) {
      var elapsed = now - start;
      var flicker = now - lastFlicker > FLICKER_MS;
      if (flicker) lastFlicker = now;
      var done = true;

      letters.forEach(function (l, i) {
        if (elapsed >= START_MS + i * STEP_MS) {
          if (l.glyph.textContent !== l.char) l.glyph.textContent = l.char;
          l.el.classList.remove('is-decoding');
          return;
        }
        done = false;
        l.el.classList.add('is-decoding');
        if (flicker) {
          l.glyph.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      });

      if (done) {
        running = false;
        return;
      }
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  // Let the entrance animation land first.
  setTimeout(decode, 700);
  phrase.addEventListener('pointerenter', decode);
})();
