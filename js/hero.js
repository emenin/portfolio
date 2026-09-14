// Hero personality, kept light:
// 1. "a new reader" decodes like a machine reading it: each letter flickers
//    through glyphs and settles, left to right. Once after load, and again
//    when the phrase is hovered.
// 2. A faint pink glow follows the pointer across the hero.
// Both are skipped under prefers-reduced-motion; the glow needs a real pointer.
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  var phrase = document.querySelector('.hero-headline-em');
  if (!hero || !phrase) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ----- Decode -----
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
