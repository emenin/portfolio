// AI + Design Systems (.ai-essay), two options while they are compared.
//
// data-ai-mode="adapt": "Rewrite it for AI" swaps the story for the direct
// version (the .spec-direct lines in the markup), the way AI needs it.
//
// data-ai-mode="both": adds a lens. A copy of the essay's columns, marked up the
// way a model reads them (vague phrases underlined as ambiguous, concrete
// sources highlighted as explicit), sits exactly on top of the text and shows
// through a lens around the pointer. The toggle opens the lens over the whole
// text (the ambiguity gets marked), then swaps in the direct version. The
// marked copy is decorative (aria-hidden).
//
// Runs before crossout.js so the copy's pen strokes animate with the original.
(function () {
  'use strict';

  var WARN = [
    /Beautiful\s+storytelling/,
    /visual\s+examples/,
    /decisions\s+left\s+between\s+the\s+lines/
  ];
  var OK = [
    /Straightforward\s+rules/,
    /component\s+guidance\s+in\s+code/,
    /design\s+contracts/
  ];

  var hover = window.matchMedia('(hover: hover)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Wraps the first match of each pattern, wherever it sits in a text node.
  function mark(root, patterns, className) {
    patterns.forEach(function (pattern) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      var node;
      while ((node = walker.nextNode())) {
        var match = pattern.exec(node.nodeValue);
        if (!match) continue;
        var hit = node.splitText(match.index);
        hit.splitText(match[0].length);
        var span = document.createElement('span');
        span.className = className;
        hit.parentNode.replaceChild(span, hit);
        span.appendChild(hit);
        return;
      }
    });
  }

  function setLabel(toggle, on) {
    toggle.setAttribute('aria-pressed', String(on));
    toggle.querySelector('.spec-toggle-label').textContent = on
      ? 'Back to the story'
      : 'Rewrite it for AI';
  }

  function initLens(section, read, toggle) {
    var body = read.querySelector('.spec-body');
    var machine = body.cloneNode(true);
    machine.classList.add('spec-body--machine');
    machine.setAttribute('aria-hidden', 'true');

    mark(machine, WARN, 'ai-warn');
    mark(machine, OK, 'ai-ok');
    machine.querySelectorAll('.spec-term').forEach(function (el) {
      el.classList.add('ai-ok');
    });
    machine.querySelectorAll('.spec-em').forEach(function (el, i) {
      // "guesses make messes" is the outcome of ambiguity; "the format matters
      // less than the intent" is the rule.
      el.classList.add(i === 0 ? 'ai-warn' : 'ai-ok');
    });
    read.appendChild(machine);

    var rewrite = null;

    function place(x, y) {
      read.style.setProperty('--lx', x + 'px');
      read.style.setProperty('--ly', y + 'px');
    }

    read.addEventListener('pointermove', function (event) {
      if (!hover.matches || read.classList.contains('is-machine')) return;
      var rect = read.getBoundingClientRect();
      place(event.clientX - rect.left, event.clientY - rect.top);
      read.classList.add('is-lens');
    });

    read.addEventListener('pointerleave', function () {
      read.classList.remove('is-lens');
    });

    toggle.addEventListener('click', function () {
      var on = !read.classList.contains('is-machine');
      if (on) {
        // The lens opens from the toggle.
        var rect = read.getBoundingClientRect();
        var from = toggle.getBoundingClientRect();
        place(from.left + 8 - rect.left, from.top + from.height / 2 - rect.top);
        read.classList.remove('is-lens');
      }
      read.classList.toggle('is-machine', on);
      clearTimeout(rewrite);
      if (on) {
        // Let the ambiguity get marked first, then rewrite.
        rewrite = setTimeout(function () {
          read.classList.add('is-direct');
        }, reducedMotion.matches ? 0 : 900);
      } else {
        read.classList.remove('is-direct');
      }
      setLabel(toggle, on);
    });
  }

  function initAdapt(section, read, toggle) {
    toggle.addEventListener('click', function () {
      var on = !read.classList.contains('is-direct');
      read.classList.toggle('is-direct', on);
      setLabel(toggle, on);
    });
  }

  document.querySelectorAll('.ai-essay').forEach(function (section) {
    var read = section.querySelector('.spec-read');
    var toggle = section.querySelector('.spec-toggle');
    if (!read || !toggle) return;
    if (section.dataset.aiMode === 'both') initLens(section, read, toggle);
    else initAdapt(section, read, toggle);
  });
})();
