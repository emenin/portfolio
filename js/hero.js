// The introductions keep independent source entrances and token Inspect overlays.
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.hero-inner').forEach(function (inner) {
  var built = inner.querySelector('.hero-built');
  var hero = inner.closest('.hero');
  var codeIntro = inner.querySelector('.hero-code-intro');
  if (codeIntro && !reducedMotion.matches && 'IntersectionObserver' in window) {
    var codeEntrance = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      inner.classList.add('is-code-entering');
      setTimeout(function () { inner.classList.remove('is-code-entering'); rebuild(); }, 1800);
      codeEntrance.disconnect();
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    codeEntrance.observe(hero);
  }

  // ---- Tokens on hover -----------------------------------------------------------
  var spec = inner.querySelector('.hero-spec');
  var toggle = inner.querySelector('.hero-inspect-switch');
  if (!spec || !built || !toggle) return;

  var SPECS = [
    ['.hero-masthead', ['label/caps', '--font-display']],
    ['.hero-headline', ['heading/display', 'font-display 700']],
    ['.hero-headline-em', ['--pink-400']],
    ['.hero-standfirst', ['body/lg', '--font-body']],
    ['.hero-cta', ['label/caps', '--font-display', 'status']],
    ['.hero-meta-item', ['label/caps', '--font-display']]
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
      if (el.matches('.hero-headline, .hero-headline-em, .hero-standfirst')) {
        var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        var node, rects = [];
        while ((node = walker.nextNode())) {
          if (!node.textContent.trim() || node.parentElement.closest('[aria-hidden="true"]')) continue;
          var range = document.createRange();
          range.selectNodeContents(node);
          rects.push(range.getBoundingClientRect());
        }
        if (rects.length) {
          var textLeft = Math.min.apply(null, rects.map(function (rect) { return rect.left; }));
          var textRight = Math.max.apply(null, rects.map(function (rect) { return rect.right; }));
          var textTop = Math.min.apply(null, rects.map(function (rect) { return rect.top; }));
          var textBottom = Math.max.apply(null, rects.map(function (rect) { return rect.bottom; }));
          r = { left: textLeft, right: textRight, top: textTop, height: textBottom - textTop };
        }
      }
      var right = r.right;
      // Flex rows are as wide as the column: measure what is in them.
      if (el.matches('.hero-masthead')) {
        var children = [].filter.call(el.children, function (kid) { return kid !== toggle; });
        var left = Math.min.apply(null, children.map(function (kid) { return kid.getBoundingClientRect().left; }));
        right = Math.max.apply(null, [].map.call(el.children, function (kid) {
          return kid === toggle ? r.left : kid.getBoundingClientRect().right;
        }));
        r = { left: left, top: r.top, height: r.height };
      }
      var item = document.createElement('div');
      item.className = 'hero-spec-item';
      item.style.left = r.left - base.left + 'px';
      item.style.top = r.top - base.top + 'px';
      item.style.width = right - r.left + 'px';
      item.style.height = r.height + 'px';
      item.innerHTML =
        '<div class="hero-spec-box"></div><div class="hero-spec-tags">' +
        (el.matches('.hero-headline') ? ['heading/display', '--font-display', 'weight/' + getComputedStyle(el).fontWeight] : row[1]).map(function (tag) {
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
    if (!enabled() || event.target.closest('.hero-inspect-switch, .hero-reader-discovery')) {
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
  built.addEventListener('pointerenter', build);
  built.addEventListener('focusin', function (event) {
    if (event.target.closest('.hero-reader-discovery')) show(null);
  });

  toggle.addEventListener('click', function () {
    var on = toggle.getAttribute('aria-checked') !== 'true';
    toggle.setAttribute('aria-checked', String(on));
    inner.classList.toggle('inspect-off', !on);
    if (!on) show(null);
  });

  // Measure once the hero has settled, and again whenever the layout moves.
  function rebuild() {
    build();
  }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(rebuild);
  if ('ResizeObserver' in window) new ResizeObserver(rebuild).observe(built);
  built.addEventListener('transitionend', function (event) {
    if (event.target.parentNode === built && event.propertyName === 'translate') rebuild();
  });
  window.addEventListener('resize', rebuild);
  built.addEventListener('animationend', rebuild);
  });
})();
