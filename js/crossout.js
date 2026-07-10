// Animates the pen-stroke crossout over "carefully" in the Unfiltered
// intro: the path draws itself in once the line scrolls into view.
(function () {
  'use strict';

  var wrap = document.querySelector('.crossout-wrap');
  if (!wrap) return;
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
            'stroke-dashoffset 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
          path.style.strokeDashoffset = '0';
        });
        observer.disconnect();
      });
    },
    { threshold: 0.5 }
  );
  observer.observe(wrap);
})();
