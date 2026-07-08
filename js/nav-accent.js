// The nav is position:fixed and transparent, so it floats over both the dark
// purple sections and the pale pink ones. This flips its accent to stay legible:
// pink text over dark sections, deep purple text over pink sections. It sets a
// class the CSS reads (see .navbar.nav-on-light in emenin-main.css).
(function () {
  'use strict';

  var nav = document.querySelector('.navbar');
  if (!nav) return;

  var sections = Array.prototype.slice.call(
    document.querySelectorAll('.hero, .section')
  );
  if (!sections.length) return;

  // Is the section currently behind the middle of the nav a pale-pink one?
  function onLightSection() {
    var r = nav.getBoundingClientRect();
    var y = r.top + r.height / 2;
    for (var i = 0; i < sections.length; i++) {
      var s = sections[i].getBoundingClientRect();
      if (s.top <= y && s.bottom > y) {
        return sections[i].classList.contains('light');
      }
    }
    return false;
  }

  var raf = null;
  function update() {
    raf = null;
    nav.classList.toggle('nav-on-light', onLightSection());
  }
  function schedule() {
    if (raf === null) raf = requestAnimationFrame(update);
  }

  update();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
})();
