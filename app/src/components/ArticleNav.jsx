import { Link } from 'react-router-dom';
import { brandLabel, ctaLabel } from '../content/home';

export function ArticleNav() {
  return (
    <div className="navbar secondary">
      <div className="container _100">
        <Link to="/" className="brand">
          <div className="logo dark">{brandLabel}</div>
        </Link>
        <nav className="navmenu">
          <Link to="/#contact" className="navbutton light">
            {ctaLabel}
          </Link>
        </nav>
      </div>
    </div>
  );
}
