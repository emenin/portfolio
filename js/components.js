/**
 * Portfolio component library – reusable Web Components
 * Use these custom elements to keep the site consistent and easy to update.
 */

(function () {
  'use strict';

  const NAV_LINKS = [
    { href: '#what-i-do', label: 'What I do' },
    { href: '#work', label: 'My work' },
    { href: '#how-i-can-help', label: 'How I can help' },
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
  const CONTACT_LINKEDIN_LABEL = 'in/ericamenin';

  // The one footer for every page: contact (LinkedIn + copy-to-clipboard
  // email) above the copyright bar. Rendered by <site-footer> on the homepage
  // and by <article-end> under the prev/next tiles on articles.
  function siteFooterHtml() {
    // Only the first footer on a page owns the #contact anchor (the component
    // library renders more than one).
    const id = document.getElementById('contact') ? '' : ' id="contact"';

    return `
      <footer${id} class="site-footer">
        <div class="site-footer-inner">
          <p class="site-footer-eyebrow">
            <span class="site-footer-eyebrow-name">Érica Menin</span>
            <span>Let&#x27;s talk</span>
          </p>
          <h2 class="site-footer-statement">
            Design systems &amp; workflows <em>for humans and AI</em>.
          </h2>
          <p class="site-footer-standfirst">
            Let&#x27;s have a chat! I&#x27;m available for consulting, contract
            work, and design systems leadership opportunities.
          </p>
          <dl class="site-footer-contacts">
            <div class="site-footer-contact">
              <dt>LinkedIn</dt>
              <dd>
                <a class="site-footer-link" href="${escapeHtml(CONTACT_LINKEDIN_URL)}" target="_blank" rel="noopener noreferrer">
                  ${escapeHtml(CONTACT_LINKEDIN_LABEL)}<span class="site-footer-link-icon" aria-hidden="true">↗</span>
                </a>
              </dd>
            </div>
            <div class="site-footer-contact">
              <dt>Email</dt>
              <dd>
                <button type="button" class="site-footer-copy" data-copy="${escapeHtml(CONTACT_EMAIL)}">
                  <span class="site-footer-copy-value">${escapeHtml(CONTACT_EMAIL)}</span>
                  <span class="site-footer-copy-hint">Copy</span>
                </button>
                <span class="site-footer-copy-status" role="status"></span>
              </dd>
            </div>
          </dl>
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

      // Titles are escaped, but allow a literal <br> through so a
      // specific line break can be set per page. Only <br> survives
      // the escape — everything else stays inert text.
      const titleHtml = escapeHtml(title).replace(/&lt;br\s*\/?&gt;/gi, '<br>');

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

      const prevBlock = prevHref
        ? `<a href="${escapeHtml(prevHref)}" class="linkblock aligncenter w-inline-block">
             <div class="text_allcaps">Previous</div>
             <h3>${escapeHtml(prevTitle)}</h3>
             <div class="hovercover backgroundinvert"></div>
           </a>`
        : '';
      const nextBlock = nextHref
        ? `<a href="${escapeHtml(nextHref)}" class="linkblock aligncenter w-inline-block">
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
        </section>
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
