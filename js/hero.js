// Hero: a loading state on the hero's own source, and the design tokens behind
// each piece on hover. The pointer glow lives in components.js ([data-glow]).
(function () {
  'use strict';

  var inner = document.querySelector('.hero-inner');
  if (!inner) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var built = inner.querySelector('.hero-built');

  // ---- Loading -------------------------------------------------------------------
  // The counter runs on a timer, not animation frames, so it still finishes in a
  // background tab. Without motion the hero shows straight away.
  var count = inner.querySelector('.hero-src-count');
  var TOTAL = 48;
  var LOAD_MS = 1300;

  var afterResolve = [];

  function resolve() {
    inner.classList.remove('is-loading');
    if (status) status.textContent = '';
    // Once the pieces have risen into place.
    setTimeout(function () {
      afterResolve.forEach(function (fn) { fn(); });
    }, 1100);
  }

  var status = inner.querySelector('.hero-src-status');
  if (status && !reducedMotion.matches) status.textContent = 'Loading the page…';

  if (reducedMotion.matches || !count) {
    resolve();
  } else {
    var start = Date.now();
    var timer = setInterval(function () {
      var n = Math.min(TOTAL, Math.round(((Date.now() - start) / LOAD_MS) * TOTAL));
      count.textContent = n + '/' + TOTAL;
      if (n < TOTAL) return;
      clearInterval(timer);
      setTimeout(resolve, 220);
    }, 30);
  }

  // ---- Tokens on hover -----------------------------------------------------------
  var spec = inner.querySelector('.hero-spec');
  var toggle = inner.querySelector('.hero-tokens-switch');
  if (!spec || !built || !toggle) return;

  var SPECS = [
    ['.hero-masthead', ['label/caps', '--white-85']],
    ['.hero-headline', ['heading/display', 'font-display 700']],
    ['.hero-headline-em', ['--pink-400']],
    ['.hero-standfirst', ['body/lg', '--white-72', '!"hidden system knowledge": undefined']],
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
          var warn = tag.charAt(0) === '!';
          return '<span class="hero-spec-tag' + (warn ? ' is-warn' : '') + '">' +
            (warn ? '⚠ ' + tag.slice(1) : tag) + '</span>';
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
    return toggle.getAttribute('aria-checked') === 'true' && !inner.classList.contains('is-loading');
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

  // Measure once the hero has settled, and again whenever the layout moves.
  function rebuild() {
    if (!inner.classList.contains('is-loading')) build();
  }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(rebuild);
  afterResolve.push(rebuild);
  built.addEventListener('transitionend', function (event) {
    if (event.target.parentNode === built && event.propertyName === 'translate') rebuild();
  });
  window.addEventListener('resize', rebuild);
})();
