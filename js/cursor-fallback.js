/**
 * Custom cursor: positions the dot to follow the mouse.
 * Runs after a short delay so it works even if site interactions don't load.
 */
(function () {
  'use strict';

  function initCursor() {
    var wrapper = document.querySelector('.cursor-wrapper');
    if (!wrapper) return;

    var dot = wrapper.querySelector('.innerdot');
    var circle = wrapper.querySelector('.outercircle');
    if (!dot) return;

    /* Only run on devices that support hover (hide on touch) */
    if (!window.matchMedia('(hover: hover)').matches) return;

    wrapper.style.width = '0';
    wrapper.style.height = '0';
    wrapper.style.overflow = 'visible';
    wrapper.style.pointerEvents = 'none';

    dot.style.position = 'absolute';
    dot.style.left = '0';
    dot.style.top = '0';
    dot.style.transform = 'translate(-50%, -50%)';
    if (circle) {
      circle.style.position = 'absolute';
      circle.style.left = '0';
      circle.style.top = '0';
      circle.style.transform = 'translate(-50%, -50%)';
    }

    function move(e) {
      wrapper.style.left = e.clientX + 'px';
      wrapper.style.top = e.clientY + 'px';
      wrapper.style.right = 'auto';
      wrapper.style.bottom = 'auto';
    }

    document.addEventListener('mousemove', move, { passive: true });
    document.body.classList.add('custom-cursor-active');
  }

  function run() {
    initCursor();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(run, 300);
    });
  } else {
    setTimeout(run, 300);
  }
})();
