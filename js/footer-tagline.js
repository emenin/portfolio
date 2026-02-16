/**
 * Footer tagline easter egg: pointer cursor, no text selection,
 * and mouse-follow movement for both the text and the tooltip
 * (like the header .logointeraction).
 */
(function () {
  if (!window.matchMedia('(hover: hover)').matches) return;

  var maxOffsetText = 3;
  var maxOffsetTooltip = 15;

  function init() {
    var wraps = document.querySelectorAll('.footer-tagline-wrap');
    wraps.forEach(function (wrap) {
      var textSpan = wrap.firstElementChild;
      var tooltip = wrap.querySelector('.footer-tooltip');
      if (!textSpan) return;

      function onMove(e) {
        var r = wrap.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        var txText = (x - 0.5) * 2 * maxOffsetText;
        var tyText = (y - 0.5) * 2 * maxOffsetText;
        textSpan.style.transform = 'translate(' + txText + 'px, ' + tyText + 'px)';
        if (tooltip) {
          var txTip = (x - 0.5) * 2 * maxOffsetTooltip;
          var tyTip = (y - 0.5) * 2 * (maxOffsetTooltip * 0.6);
          tooltip.style.transform = 'translate3d(' + txTip + 'px, ' + tyTip + 'px, 0)';
        }
      }

      function onLeave() {
        textSpan.style.transform = '';
        if (tooltip) tooltip.style.transform = 'translate3d(0, 0, 0)';
      }

      wrap.addEventListener('mousemove', onMove, { passive: true });
      wrap.addEventListener('mouseleave', onLeave);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
