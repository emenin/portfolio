// Animates each pen-stroke crossout (.crossout-wrap): the path draws itself in
// once its line scrolls into view.
(function () {
  'use strict';

  var wraps = document.querySelectorAll('.crossout-wrap');
  if (!wraps.length) return;

  wraps.forEach(function (wrap) {
    var path = wrap.querySelector('.crossout-path');
    if (!path) return;

    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;

    if (!('IntersectionObserver' in window)) {
      path.style.strokeDashoffset = '0';
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          requestAnimationFrame(function () {
            path.style.transition =
              'stroke-dashoffset 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s';
            path.style.strokeDashoffset = '0';
          });
          observer.disconnect();
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(wrap);
  });
})();
