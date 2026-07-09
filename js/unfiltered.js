// Populates the "Unfiltered" section with the latest posts from the
// Design Systems Unfiltered Substack. The section already contains
// hardcoded fallback cards, so if anything below fails we leave those
// in place — the section is never empty or broken.
(function () {
  'use strict';

  var FEED = 'https://designsystemsunfiltered.substack.com/feed';
  // Substack does not send permissive CORS headers, so the browser can't
  // read the feed directly. Route it through a public read-only proxy.
  var PROXY = 'https://api.allorigins.win/raw?url=';
  var MAX_POSTS = 3;

  var grid = document.querySelector('[data-unfiltered-grid]');
  if (!grid) return;

  function text(node, tag) {
    var el = node.getElementsByTagName(tag)[0];
    return el ? el.textContent.trim() : '';
  }

  // Decode HTML entities (e.g. &#8217; → ’) that come through inside the
  // feed's description/title markup.
  function decodeEntities(s) {
    var t = document.createElement('textarea');
    t.innerHTML = s;
    return t.value;
  }

  function imageFor(item) {
    var enc = item.getElementsByTagName('enclosure')[0];
    if (enc && enc.getAttribute('url')) return enc.getAttribute('url');
    // Fall back to the first <img> in the content/description.
    var body = text(item, 'encoded') || text(item, 'description');
    var m = body.match(/<img[^>]+src="([^"]+)"/i);
    return m ? m[1] : '';
  }

  // Strip HTML and clamp the blurb to a sentence-ish length.
  function blurb(item) {
    var raw = text(item, 'description') || text(item, 'encoded');
    var plain = decodeEntities(raw.replace(/<[^>]+>/g, ' '))
      .replace(/\s+/g, ' ')
      .trim();
    if (plain.length > 160) plain = plain.slice(0, 157).trimEnd() + '…';
    return plain;
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function rowHtml(post) {
    var img = post.image
      ? '<div class="article-row-thumb"><img loading="lazy" src="' +
        esc(post.image) +
        '" alt="' +
        esc(post.title) +
        '" class="thumbnail" /></div>'
      : '';
    return (
      '<a href="' +
      esc(post.link) +
      '" target="_blank" rel="noopener noreferrer" class="article-row w-inline-block">' +
      img +
      '<div class="article-row-body">' +
      '<h3 class="label">' +
      esc(post.title) +
      '</h3>' +
      (post.blurb ? '<p>' + esc(post.blurb) + '</p>' : '') +
      '</div></a>'
    );
  }

  // Render posts into the same stacked magazine-row list as the
  // hardcoded fallback.
  function render(posts) {
    grid.innerHTML = posts.map(rowHtml).join('');
  }

  function parse(xmlString) {
    var doc = new DOMParser().parseFromString(xmlString, 'text/xml');
    if (doc.getElementsByTagName('parsererror').length) return [];
    var items = Array.prototype.slice.call(
      doc.getElementsByTagName('item'),
      0,
      MAX_POSTS
    );
    return items
      .map(function (item) {
        return {
          title: decodeEntities(text(item, 'title')),
          link: text(item, 'link'),
          image: imageFor(item),
          blurb: blurb(item),
        };
      })
      .filter(function (p) {
        return p.title && p.link;
      });
  }

  fetch(PROXY + encodeURIComponent(FEED), { credentials: 'omit' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(function (xml) {
      var posts = parse(xml);
      if (posts.length) render(posts);
    })
    .catch(function () {
      // Keep the hardcoded fallback cards already in the DOM.
    });
})();
