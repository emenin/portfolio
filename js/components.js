/**
 * Portfolio component library – reusable Web Components
 * Use these custom elements to keep the site consistent and easy to update.
 */

(function () {
  'use strict';

  const NAV_LINKS = [
    { href: '#ai-design-systems', label: 'AI + Design Systems' },
    { href: '#work', label: 'Work' },
    { href: '#unfiltered', label: 'Unfiltered' },
    { href: '#what-i-do', label: 'What I do' },
    { href: '#beliefs', label: 'Beliefs' },
    { href: '#about', label: 'About' },
  ];

  const CTA_HREF = '#contact';
  const CTA_LABEL = "Let's talk!";
  const BRAND_HREF = 'index.html';
  const BRAND_LABEL = 'emenin';
  const BRAND_TOOLTIP =
    'It stands for Érica Menin, not the Eminem you thought ;)';

  // ----- Site Nav -----
  class SiteNav extends HTMLElement {
    connectedCallback() {
      const linksHtml = NAV_LINKS.map(
        (link) =>
          `<a href="${escapeHtml(link.href)}" class="navlink">${escapeHtml(link.label)}</a>`
      ).join('\n            ');

      this.innerHTML = `
        <div class="navbar">
          <div class="container _100">
            <a href="${escapeHtml(BRAND_HREF)}" aria-current="page" class="brand w-nav-brand w--current">
              <div data-w-id="f48a2ca4-7775-e79e-1709-0f9c0e85b6f7" class="logo">${escapeHtml(BRAND_LABEL)}</div>
              <div class="logointeraction">
                <div>${escapeHtml(BRAND_TOOLTIP)}</div>
              </div>
            </a>
            <div data-animation="default" data-collapse="none" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" class="navmenu w-nav">
              <div class="menubutton w-nav-button">
                <div class="menuicon w-icon-nav-menu"></div>
              </div>
              ${linksHtml}
              <a href="${escapeHtml(CTA_HREF)}" data-w-id="f48a2ca4-7775-e79e-1709-0f9c0e85b706" class="navbutton">${escapeHtml(CTA_LABEL)}</a>
            </div>
          </div>
        </div>
      `;
    }
  }

  // ----- Letter roll -----
  // Splits a [data-roll] heading into letters so each can roll up to a twin
  // on hover (styles in components.css). Each letter stays a single real
  // character, so the heading's text is unchanged for search and copy; the
  // twin is a pseudo-element. Words are wrapped so lines only break between
  // them, and the heading keeps its full text as its accessible name.
  function splitRoll(heading) {
    if (heading.dataset.rollReady === 'true') return;
    const text = heading.textContent.replace(/\s+/g, ' ').trim();
    heading.setAttribute('aria-label', text);
    heading.textContent = '';

    let index = 0;
    text.split(' ').forEach(function (word, wordIndex) {
      if (wordIndex > 0) heading.appendChild(document.createTextNode(' '));
      const wordEl = document.createElement('span');
      wordEl.className = 'roll-word';
      wordEl.setAttribute('aria-hidden', 'true');
      Array.from(word).forEach(function (char) {
        const charEl = document.createElement('span');
        charEl.className = 'roll-char';
        charEl.dataset.char = char;
        charEl.style.setProperty('--i', index++);
        const face = document.createElement('span');
        face.className = 'roll-face';
        face.textContent = char;
        charEl.appendChild(face);
        wordEl.appendChild(charEl);
      });
      heading.appendChild(wordEl);
    });

    heading.dataset.rollReady = 'true';
  }

  // ----- Site Footer -----
  const FOOTER_COPYRIGHT = '©2023 Érica Menin. All Rights Reserved.';
  const FOOTER_TAGLINE = 'Designed and built by me <3';
  const FOOTER_TOOLTIP = '2023: Webflow | 2026: Cursor 😎';

  // Copyright + tagline/tooltip pair: the bottom bar of the site footer.
  function footerBodyHtml() {
    const year = new Date().getFullYear();
    const copyright = FOOTER_COPYRIGHT.replace('2023', String(year));

    return `
      <div>${escapeHtml(copyright)}<br></div>
      <div class="footer-tagline-wrap">
        <span>${escapeHtml(FOOTER_TAGLINE)}</span>
        <span class="footer-tooltip">${escapeHtml(FOOTER_TOOLTIP)}</span>
      </div>
    `;
  }

  const CONTACT_EMAIL = 'erica@menin.me';
  const CONTACT_LINKEDIN_URL = 'https://www.linkedin.com/in/ericamenin/';

  // The one footer for every page: a contact note with LinkedIn and a
  // copy-to-clipboard email set inline, above the copyright bar. Rendered by <site-footer> on the homepage
  // and by <article-end> under the prev/next tiles on articles.
  function siteFooterHtml() {
    // Only the first footer on a page owns the #contact anchor (the component
    // library renders more than one).
    const id = document.getElementById('contact') ? '' : ' id="contact"';

    return `
      <footer${id} class="site-footer" data-glow>
        <div class="site-footer-inner">
          <p class="site-footer-note">
            <span class="site-footer-note-lead">Let&#x27;s have a chat!</span>
            I&#x27;m available for consulting, contract work, and design
            systems leadership opportunities. Find me on
            <a class="site-footer-link" href="${escapeHtml(CONTACT_LINKEDIN_URL)}" target="_blank" rel="noopener noreferrer">LinkedIn<span class="site-footer-link-icon" aria-hidden="true">↗</span></a>
            or email me at
            <button type="button" class="site-footer-copy" data-copy="${escapeHtml(CONTACT_EMAIL)}"><span class="site-footer-copy-value">${escapeHtml(CONTACT_EMAIL)}</span><span class="site-footer-copy-hint">Copy</span></button><span class="site-footer-copy-status" role="status"></span>
          </p>
          <div class="site-footer-bar">
            ${footerBodyHtml()}
          </div>
        </div>
      </footer>
    `;
  }

  const COPY_RESET_MS = 2200;

  document.addEventListener('click', async function (event) {
    const button = event.target.closest('.site-footer-copy');
    if (!button) return;

    const value = button.getAttribute('data-copy');
    const hint = button.querySelector('.site-footer-copy-hint');
    const status = button.parentElement.querySelector('.site-footer-copy-status');

    let copied = false;
    try {
      await navigator.clipboard.writeText(value);
      copied = true;
    } catch (err) {
      // Clipboard API unavailable or denied (embedded frames, older Safari):
      // select the address and try the legacy command. If that fails too, the
      // selection is left in place so a keyboard copy still works.
      const range = document.createRange();
      range.selectNodeContents(button.querySelector('.site-footer-copy-value'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copied = document.execCommand('copy');
      if (copied) selection.removeAllRanges();
    }

    const copyKey = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘C' : 'Ctrl+C';
    button.classList.toggle('is-copied', copied);
    hint.textContent = copied ? 'Copied' : `Press ${copyKey}`;
    status.textContent = copied
      ? 'Email address copied to clipboard'
      : 'Email address selected';

    clearTimeout(button._copyReset);
    button._copyReset = setTimeout(function () {
      button.classList.remove('is-copied');
      hint.textContent = 'Copy';
      status.textContent = '';
    }, COPY_RESET_MS);
  });

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = siteFooterHtml();
      this.querySelectorAll('[data-roll]').forEach(splitRoll);
    }
  }

  // ----- Project Card -----
  // Attributes: title, description, image, image-alt, href (optional), tags (comma-separated), unpublished (optional)
  class ProjectCard extends HTMLElement {
    static get observedAttributes() {
      return [
        'title',
        'description',
        'image',
        'image-alt',
        'href',
        'tags',
        'unpublished',
      ];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      if (this.isConnected) this.render();
    }

    render() {
      const title = this.getAttribute('title') || '';
      const description = this.getAttribute('description') || '';
      const image = this.getAttribute('image') || '';
      const imageAlt = this.getAttribute('image-alt') || title;
      const href = this.getAttribute('href') || '';
      const tagsStr = this.getAttribute('tags') || '';
      const unpublished = this.hasAttribute('unpublished');

      const tags = tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const tagsHtml = tags.length
        ? `<div class="taggroup">${tags.map((t) => `<div class="tag"><div>${escapeHtml(t)}</div></div>`).join('')}</div>`
        : '';

      const wrapperClass = unpublished
        ? 'cardwrapper cardwrapper_unpublished'
        : 'cardwrapper';
      const cardClass = unpublished ? 'card link_empty' : 'card w-inline-block';

      const imageHtml = image
        ? `<div class="imagewrap">
             <img src="${escapeHtml(image)}" loading="lazy" alt="${escapeHtml(imageAlt)}" class="thumbnail" />
           </div>`
        : '';

      const cardContent = `
        ${imageHtml}
        <div class="textcontainer spacesmall alignleft">
          <h3 class="label">${escapeHtml(title)}</h3>
          <p>${escapeHtml(description)}</p>
        </div>
      `;

      const cardInner = unpublished
        ? `<div class="${cardClass}">${cardContent}</div>`
        : `<a href="${escapeHtml(href)}" class="${cardClass}">${cardContent}</a>`;

      this.innerHTML = `
        <aside class="${wrapperClass}">
          ${tagsHtml}
          ${cardInner}
        </aside>
      `;
    }
  }

  // ----- Section Heading -----
  // Attribute: text (or use slot for complex content)
  class SectionHeading extends HTMLElement {
    connectedCallback() {
      const text = this.getAttribute('text') || '';
      const align = this.getAttribute('align') || 'center'; // center | left
      const alignClass = align === 'left' ? 'alignleft' : 'aligncenter';

      this.innerHTML = `
        <div class="textcontainer ${alignClass}">
          <h2 class="text_light">${escapeHtml(text)}</h2>
        </div>
      `;
    }
  }

  // ----- Highlight Block (arrow + text) -----
  class HighlightBlock extends HTMLElement {
    connectedCallback() {
      const text = this.getAttribute('text') || this.textContent.trim() || '';
      this.innerHTML = `
        <div class="w-layout-hflex container highlight">
          <div class="arrowcontainer">
            <img src="images/arrow-color.svg" loading="lazy" alt="" class="arrow_hidden" />
            <img src="images/arrow.svg" loading="lazy" alt="" class="arrow" />
          </div>
          <div class="text_highlight">${escapeHtml(text)}<br></div>
        </div>
      `;
    }
  }

  // ----- Contact Link Block -----
  // Attributes: href, label, sublabel
  class ContactLink extends HTMLElement {
    connectedCallback() {
      const href = this.getAttribute('href') || '#';
      const label = this.getAttribute('label') || 'Link';
      const sublabel = this.getAttribute('sublabel') || '';

      this.innerHTML = `
        <a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="linkblock w-inline-block">
          <div class="textdisplay">${escapeHtml(label)}</div>
          <div>${escapeHtml(sublabel)}</div>
          <div class="hovercover"></div>
        </a>
      `;
    }
  }

  // ----- Article Nav (for project/blog inner pages) -----
  // Simplified nav: logo + CTA. Add attribute "secondary" for dark/secondary style.
  class ArticleNav extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <div class="navbar secondary">
          <div class="container _100">
            <a href="${escapeHtml(BRAND_HREF)}" class="brand w-nav-brand">
              <div class="logo dark">${escapeHtml(BRAND_LABEL)}</div>
            </a>
            <div data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" class="navmenu light w-nav">
              <a href="index.html${escapeHtml(CTA_HREF)}" class="navbutton light">${escapeHtml(CTA_LABEL)}</a>
            </div>
          </div>
        </div>
      `;
    }
  }

  // ----- Article Header (project or blog post) -----
  // Attributes: title, image, image-alt, tags (comma-separated), date (optional, for blog)
  // Inner HTML = subtitle/description (can include links)
  class ArticleHeader extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === 'true') return;

      const title = this.getAttribute('title') || '';
      const image = this.getAttribute('image') || '';
      const imageAlt = this.getAttribute('image-alt') || title;
      const tagsStr = this.getAttribute('tags') || '';
      const date = this.getAttribute('date') || '';

      const tags = tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const tagsHtml = tags.length
        ? `<div class="taggroup">${tags.map((t) => `<div class="tag primary"><div>${escapeHtml(t)}</div></div>`).join('')}</div>`
        : '';

      const subtitleHtml = this.innerHTML.trim();
      const dateHtml = date
        ? `<div class="article-date">${escapeHtml(date)}</div>`
        : '';

      // Titles are escaped, but allow a literal <br> (a line break set per
      // page) and <em> (the accented phrase) through. Everything else stays
      // inert text.
      const titleHtml = escapeHtml(title)
        .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
        .replace(/&lt;(\/?)em&gt;/gi, '<$1em>');

      this.innerHTML = `
        <div class="projectheader">
          ${tagsHtml}
          <h2 class="projecttitle">${titleHtml}</h2>
          ${dateHtml}
          ${subtitleHtml ? `<div class="textcontainer">${subtitleHtml}</div>` : ''}
        </div>
        ${
          image
            ? `
        <div class="w-layout-vflex">
          <div class="imagewrap">
            <img loading="lazy" src="${escapeHtml(image)}" alt="${escapeHtml(imageAlt)}" class="projectcover" />
          </div>
        </div>
        `
            : ''
        }
      `;

      this.dataset.rendered = 'true';
    }
  }

  // ----- Article End (prev/next tiles + the shared site footer, no gap) -----
  // Attributes: prev-href, prev-title, next-href, next-title (optional)
  class ArticleEnd extends HTMLElement {
    connectedCallback() {
      const prevHref = this.getAttribute('prev-href') || '';
      const prevTitle = this.getAttribute('prev-title') || 'Previous';
      const nextHref = this.getAttribute('next-href') || '';
      const nextTitle = this.getAttribute('next-title') || 'Next';

      // A lone link back to the homepage is a way out, not a "previous"
      // article, so it goes unlabelled.
      const isBackLink = !nextHref && /^index\.html/.test(prevHref);
      const prevBlock = prevHref
        ? `<a href="${escapeHtml(prevHref)}" class="linkblock linkblock--prev aligncenter w-inline-block${isBackLink ? ' linkblock--back' : ''}">
             ${isBackLink ? '' : '<div class="text_allcaps">Previous</div>'}
             <h3>${escapeHtml(prevTitle)}</h3>
             <div class="hovercover backgroundinvert"></div>
           </a>`
        : '';
      const nextBlock = nextHref
        ? `<a href="${escapeHtml(nextHref)}" class="linkblock linkblock--next aligncenter w-inline-block">
             <div class="text_allcaps">Next</div>
             <h3>${escapeHtml(nextTitle)}</h3>
             <div class="hovercover backgroundinvert"></div>
           </a>`
        : '';

      const navBlock =
        prevBlock || nextBlock
          ? `<div class="article-end-nav w-layout-hflex containerfull background_dark">
               ${prevBlock}
               ${nextBlock}
             </div>`
          : '';

      this.innerHTML = `
        <div class="article-end">
          ${navBlock}
          ${siteFooterHtml()}
        </div>
      `;
      this.querySelectorAll('[data-roll]').forEach(splitRoll);
    }
  }

  // ----- Article Layout (single live wrapper for article pages) -----
  // Wrap page-specific content and centralize shared chrome (nav, end, cursor).
  // Attributes: prev-href, prev-title, next-href, next-title, cursor-label,
  // no-end (optional), no-cursor (optional)
  class ArticleLayout extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === 'true') return;

      const prevHref = this.getAttribute('prev-href') || '';
      const prevTitle = this.getAttribute('prev-title') || 'Previous';
      const nextHref = this.getAttribute('next-href') || '';
      const nextTitle = this.getAttribute('next-title') || 'Next';
      const cursorLabel = this.getAttribute('cursor-label') || 'View';
      const noEnd = this.hasAttribute('no-end');
      const noCursor = this.hasAttribute('no-cursor');
      const contentHtml = this.innerHTML;

      // Keep layout neutral in the DOM flow; inner structure defines spacing.
      this.style.display = 'contents';

      this.innerHTML = `
        <article-nav></article-nav>
        <section class="section project">
          ${contentHtml}
        </section>
        ${
          noEnd
            ? ''
            : `<article-end
                 prev-href="${escapeHtml(prevHref)}"
                 prev-title="${escapeHtml(prevTitle)}"
                 next-href="${escapeHtml(nextHref)}"
                 next-title="${escapeHtml(nextTitle)}"
               ></article-end>`
        }
        ${
          noCursor
            ? ''
            : `<div class="cursor-wrapper" id="article-cursor">
                 <div class="w-embed">
                   <style>
                     #article-cursor {
                       pointer-events: none;
                     }
                   </style>
                 </div>
                 <div class="innerdot"></div>
                 <div class="outercircle">
                   <div class="tooltiplabel">${escapeHtml(cursorLabel)}</div>
                 </div>
               </div>`
        }
      `;

      this.dataset.rendered = 'true';
    }
  }

  function splitPageRolls() {
    document.querySelectorAll('[data-roll]').forEach(splitRoll);
  }

  // Case-study contents index: mark the section currently being read, i.e. the
  // first one crossing a band a little above the middle of the viewport.
  function trackContents() {
    const items = Array.from(document.querySelectorAll('body.case-study .item_summary'));
    if (!items.length || !('IntersectionObserver' in window)) return;

    const sections = new Map();
    items.forEach(function (item) {
      const link = item.querySelector('a[href^="#"]');
      const section = link && document.getElementById(link.getAttribute('href').slice(1));
      if (section) sections.set(section, item);
    });

    const inBand = new Set();
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) inBand.add(entry.target);
          else inBand.delete(entry.target);
        });
        let current = null;
        sections.forEach(function (item, section) {
          if (!current && inBand.has(section)) current = item;
        });
        if (!current) return;
        items.forEach(function (item) {
          item.classList.toggle('is-current', item === current);
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    sections.forEach(function (item, section) {
      observer.observe(section);
    });

    // Step aside once the article ends, so the index never sits over the
    // prev/next band and footer.
    const index = items[0].parentElement;
    const end = document.querySelector('.article-end');
    if (end) {
      new IntersectionObserver(function (entries) {
        index.classList.toggle('is-away', entries[0].isIntersecting);
      }).observe(end);
    }
  }

  // Pointer glow: a faint pink light follows the pointer across any [data-glow]
  // element (the hero and the footer). Needs a real pointer; off under
  // prefers-reduced-motion.
  function initGlow() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelectorAll('[data-glow]').forEach(function (el) {
      let pending = null;
      el.addEventListener('pointermove', function (event) {
        if (reducedMotion.matches) return;
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (pending) cancelAnimationFrame(pending);
        pending = requestAnimationFrame(function () {
          el.style.setProperty('--glow-x', x + 'px');
          el.style.setProperty('--glow-y', y + 'px');
          el.classList.add('is-glowing');
        });
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('is-glowing');
      });
    });
  }

  function onReady() {
    splitPageRolls();
    trackContents();
    initGlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Register custom elements (use unique names to avoid conflicts)
  if (!customElements.get('site-nav'))
    customElements.define('site-nav', SiteNav);
  if (!customElements.get('site-footer'))
    customElements.define('site-footer', SiteFooter);
  if (!customElements.get('project-card'))
    customElements.define('project-card', ProjectCard);
  if (!customElements.get('section-heading'))
    customElements.define('section-heading', SectionHeading);
  if (!customElements.get('highlight-block'))
    customElements.define('highlight-block', HighlightBlock);
  if (!customElements.get('contact-link'))
    customElements.define('contact-link', ContactLink);
  if (!customElements.get('article-nav'))
    customElements.define('article-nav', ArticleNav);
  if (!customElements.get('article-header'))
    customElements.define('article-header', ArticleHeader);
  if (!customElements.get('article-end'))
    customElements.define('article-end', ArticleEnd);
  if (!customElements.get('article-layout'))
    customElements.define('article-layout', ArticleLayout);
})();
