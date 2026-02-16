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
    { href: '#why-me', label: 'Why me' },
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
  const FOOTER_TOOLTIP = '2023: No-code / 2026: Cursor';

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      const year = new Date().getFullYear();
      const copyright = FOOTER_COPYRIGHT.replace('2023', String(year));

      this.innerHTML = `
        <section class="section footer">
          <div class="container _100 vertical_mobile">
            <div>${escapeHtml(copyright)}<br></div>
            <div class="footer-tagline-wrap">
              <span>${escapeHtml(FOOTER_TAGLINE)}</span>
              <span class="footer-tooltip">${escapeHtml(FOOTER_TOOLTIP)}</span>
            </div>
          </div>
        </section>
      `;
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

      this.innerHTML = `
        <div class="projectheader">
          ${tagsHtml}
          <h2 class="projecttitle">${escapeHtml(title)}</h2>
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
    }
  }

  // ----- Article End (prev/next tiles + footer as one block, no gap, no bottom margin) -----
  // Attributes: prev-href, prev-title, next-href, next-title (optional)
  // Renders: Previous + Next tiles (if any) then footer with rights + credits. One component, no spacing between.
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

      const year = new Date().getFullYear();
      const copyright = FOOTER_COPYRIGHT.replace('2023', String(year));

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
          <div class="footer dark article-end-footer">
            <div class="container _100 vertical_mobile">
              <div>${escapeHtml(copyright)}<br></div>
              <div>${escapeHtml(FOOTER_TAGLINE)}</div>
            </div>
          </div>
        </div>
      `;
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
})();
