// Hero: the design tokens behind each piece, on hover. The pointer glow lives in
// components.js ([data-glow]).
(function () {
  'use strict';

  var inner = document.querySelector('.hero-inner');
  if (!inner) return;

  var built = inner.querySelector('.hero-built');

  var spec = inner.querySelector('.hero-spec');
  var toggle = inner.querySelector('.hero-tokens-switch');
  if (!spec || !built || !toggle) return;

  var SPECS = [
    ['.hero-masthead', ['label/caps', '--white-85']],
    ['.hero-headline', ['heading/display', 'font-display 700']],
    ['.hero-headline-em', ['--pink-400']],
    ['.hero-standfirst', ['body/lg', '--white-72']],
    ['.hero-meta', ['label/caps', 'status']]
  ];
  var items = [];

  function build() {
    spec.innerHTML = '';
    items = [];
    var base = spec.getBoundingClientRect();
    SPECS.forEach(function (row) {
      var el = built.querySelector(row[0]);
      if (!el) return;
      var r = el.getBoundingClientRect();
      var right = r.right;
      // Flex rows are as wide as the column: measure what is in them.
      if (el.matches('.hero-masthead, .hero-meta')) {
        right = Math.max.apply(null, [].map.call(el.children, function (kid) {
          return kid === toggle ? r.left : kid.getBoundingClientRect().right;
        }));
      }
      var item = document.createElement('div');
      item.className = 'hero-spec-item';
      item.style.left = r.left - base.left + 'px';
      item.style.top = r.top - base.top + 'px';
      item.style.width = right - r.left + 'px';
      item.style.height = r.height + 'px';
      item.innerHTML =
        '<div class="hero-spec-box"></div><div class="hero-spec-tags">' +
        row[1].map(function (tag) {
          return '<span class="hero-spec-tag">' + tag + '</span>';
        }).join('') +
        '</div>';
      spec.appendChild(item);
      items.push({ el: el, item: item });
    });
  }

  function show(hit) {
    items.forEach(function (it) {
      it.item.classList.toggle('is-on', it === hit);
    });
  }

  function enabled() {
    return toggle.getAttribute('aria-checked') === 'true';
  }

  built.addEventListener('pointermove', function (event) {
    if (!enabled() || event.target.closest('.hero-tokens-switch')) {
      show(null);
      return;
    }
    // The innermost piece under the pointer wins (the pink phrase over the headline).
    var hit = null;
    items.forEach(function (it) {
      if (it.el.contains(event.target) && (!hit || hit.el.contains(it.el))) hit = it;
    });
    show(hit);
  });
  built.addEventListener('pointerleave', function () {
    show(null);
  });

  toggle.addEventListener('click', function () {
    var on = toggle.getAttribute('aria-checked') !== 'true';
    toggle.setAttribute('aria-checked', String(on));
    if (!on) show(null);
  });

  // Measure once fonts and images have settled, and again whenever the layout moves.
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(build);
  window.addEventListener('load', build);
  window.addEventListener('resize', build);
  built.addEventListener('animationend', function (event) {
    if (event.target.parentNode === built) build();
  });
})();
