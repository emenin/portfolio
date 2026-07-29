/**
 * FAQ terminal: interactive command palette over the static FAQ.
 *
 * The FAQ questions/answers live as semantic HTML in #faq (.ft-item nodes).
 * This script reads them so the interactive terminal and the crawlable content
 * never drift. Progressive enhancement: with JS off, the FAQ is still fully
 * readable; this only adds the floating "> _" palette on top.
 */
(function () {
  'use strict';

  var overlay = document.getElementById('ftOverlay');
  var fab = document.getElementById('ftFab');
  if (!overlay || !fab) return;

  var modal = overlay.querySelector('.ft-modal');
  var input = document.getElementById('ftInput');
  var sug = document.getElementById('ftSug');
  var outEl = document.getElementById('ftOut');
  var sel = -1;
  var lastFocus = null;

  // Build the command list from the static FAQ in the DOM.
  var faq = [].slice.call(document.querySelectorAll('#faq .ft-item')).map(function (item) {
    var qEl = item.querySelector('.ft-q');
    var aEl = item.querySelector('.ft-answer');
    return {
      k: item.getAttribute('data-cmd'),
      d: (qEl ? qEl.textContent : '').replace(/^#\s*/, '').trim(),
      answer: aEl ? aEl.innerHTML.trim() : ''
    };
  }).filter(function (c) { return c.k; });

  var META = [
    { k: 'work', d: 'Jump to my work' }
  ];
  var CMDS = faq.concat(META);

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderSug() {
    var q = input.value.trim().toLowerCase();
    var list = q ? CMDS.filter(function (c) { return c.k.indexOf(q) === 0; }) : CMDS;
    if (sel >= list.length) sel = list.length - 1;
    sug.innerHTML = list.map(function (c, i) {
      var on = i === sel;
      return '<button class="ft-row' + (on ? ' ft-sel' : '') + '" type="button" role="option" ' +
        'aria-selected="' + (on ? 'true' : 'false') + '" data-cmd="' + c.k + '">' +
        '<span class="ft-k">' + esc(c.k) + '</span><span class="ft-d">' + esc(c.d) + '</span></button>';
    }).join('');
  }

  function out(html) {
    outEl.innerHTML = html;
    outEl.classList.add('ft-on');
  }

  function runCmd(raw) {
    var cmd = (raw || '').trim().toLowerCase();
    if (!cmd) return;

    var hit = faq.filter(function (c) { return c.k === cmd; })[0];
    if (hit) {
      out('<span class="ft-ok"># ' + esc(hit.d) + '</span><br>' + hit.answer);
    } else if (cmd === 'work') {
      close();
      var w = document.getElementById('work');
      if (w) w.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    } else {
      out('command not found: <span class="ft-ok">' + esc(cmd) + '</span>. Clear the box to see every command.');
    }
    input.value = '';
    sel = -1;
    renderSug();
    input.focus();
  }

  function open(initialCmd) {
    lastFocus = document.activeElement;
    overlay.classList.add('ft-open-modal');
    fab.setAttribute('aria-expanded', 'true');
    input.value = '';
    outEl.innerHTML = '';
    outEl.classList.remove('ft-on');
    sel = -1;
    renderSug();
    input.focus();
    if (initialCmd) runCmd(initialCmd);
  }

  function close() {
    if (!overlay.classList.contains('ft-open-modal')) return;
    overlay.classList.remove('ft-open-modal');
    fab.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // --- wiring ---
  fab.addEventListener('click', function () { open(); });

  // Static command links in the transcript open the terminal and run themselves.
  [].slice.call(document.querySelectorAll('#faq .ft-cmd')).forEach(function (btn) {
    btn.addEventListener('click', function () { open(btn.getAttribute('data-cmd')); });
  });
  var openBtn = document.getElementById('ftOpen');
  if (openBtn) openBtn.addEventListener('click', function () { open(); });

  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

  sug.addEventListener('click', function (e) {
    var row = e.target.closest('.ft-row');
    if (row) runCmd(row.getAttribute('data-cmd'));
  });

  input.addEventListener('input', function () { sel = -1; renderSug(); });

  input.addEventListener('keydown', function (e) {
    var rows = sug.querySelectorAll('.ft-row');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      sel = rows.length ? (sel + 1) % rows.length : -1;
      renderSug();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      sel = rows.length ? (sel - 1 + rows.length) % rows.length : -1;
      renderSug();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (sel >= 0 && rows[sel]) runCmd(rows[sel].getAttribute('data-cmd'));
      else runCmd(input.value);
    }
  });

  // Focus trap + global shortcuts.
  overlay.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = modal.querySelectorAll('button, input, a[href]');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  document.addEventListener('keydown', function (e) {
    var t = e.target;
    var inField = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    if (e.key === 'Escape') { close(); return; }
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      overlay.classList.contains('ft-open-modal') ? close() : open();
      return;
    }
    if (e.key === '/' && !inField && !overlay.classList.contains('ft-open-modal')) {
      e.preventDefault();
      open();
    }
  });
})();
