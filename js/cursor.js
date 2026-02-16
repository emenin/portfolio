/**
 * Custom cursor for article/project pages.
 * Default: one small circle (dot).
 * Regular hover (links, buttons): circle grows, no text.
 * Prev/Next tiles hover: circle grows way more, "View" text centered in the circle.
 */
(function () {
  'use strict';

  function init() {
    var wrapper = document.getElementById('article-cursor');
    if (!wrapper) return;

    var dot = wrapper.querySelector('.innerdot');
    var circle = wrapper.querySelector('.outercircle');
    if (!dot || !circle) return;

    var tileLinks = document.querySelectorAll('.article-end-nav a[href]');
    var otherClickables = document.querySelectorAll(
      'a[href], button, [role="button"]'
    );

    function move(e) {
      wrapper.style.left = e.clientX + 'px';
      wrapper.style.top = e.clientY + 'px';
    }

    function enterTile() {
      wrapper.classList.remove('cursor-hover');
      wrapper.classList.add('cursor-hover-tile');
    }

    function leaveTile() {
      wrapper.classList.remove('cursor-hover-tile');
    }

    function enterClickable(e) {
      if (e.target.closest('.article-end-nav')) return;
      wrapper.classList.remove('cursor-hover-tile');
      wrapper.classList.add('cursor-hover');
    }

    function leaveClickable(e) {
      if (e.target.closest('.article-end-nav')) return;
      wrapper.classList.remove('cursor-hover');
    }

    document.addEventListener('mousemove', move, { passive: true });

    tileLinks.forEach(function (el) {
      el.addEventListener('mouseenter', enterTile);
      el.addEventListener('mouseleave', leaveTile);
    });

    otherClickables.forEach(function (el) {
      el.addEventListener('mouseenter', enterClickable);
      el.addEventListener('mouseleave', leaveClickable);
    });

    if (window.matchMedia('(hover: hover)').matches) {
      document.body.classList.add('custom-cursor-active');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
