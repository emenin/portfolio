// The Webflow interaction ("reveal photo" + text color) is bound to the
// h2 itself, so its hoverable hit-area is only the heading's glyphs — a
// tiny target. This widens the effective trigger to the whole photo+
// heading wrapper by forwarding mouseover/mouseout onto the h2, letting
// Webflow's own bound interaction fire as if the h2 were hovered directly.
(function () {
  'use strict';

  var h2 = document.querySelector('[data-w-id="da418097-8d09-1b20-cc07-115e82d41e29"]');
  if (!h2) return;
  var wrapper = h2.closest('.textcontainer.hideoverflow');
  if (!wrapper) return;

  wrapper.addEventListener('mouseenter', function () {
    h2.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, view: window }));
  });
  wrapper.addEventListener('mouseleave', function () {
    h2.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, view: window }));
  });
})();
