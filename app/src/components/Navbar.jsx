import {
  navLinks,
  ctaHref,
  ctaLabel,
  brandHref,
  brandLabel,
  brandTooltip,
} from '../content/home';

export function Navbar() {
  return (
    <div className="navbar">
      <div className="container _100">
        <a
          href={brandHref}
          aria-current="page"
          className="brand w-nav-brand w--current"
        >
          <div className="logo">{brandLabel}</div>
          <div className="logointeraction">
            <div>{brandTooltip}</div>
          </div>
        </a>
        <div
          data-animation="default"
          data-collapse="none"
          data-duration="400"
          data-easing="ease"
          data-easing2="ease"
          role="banner"
          className="navmenu w-nav"
        >
          <div className="menubutton w-nav-button">
            <div className="menuicon w-icon-nav-menu" />
          </div>
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} className="navlink">
              {label}
            </a>
          ))}
          <a href={ctaHref} className="navbutton">
            {ctaLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
