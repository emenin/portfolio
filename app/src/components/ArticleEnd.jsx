import { Link } from 'react-router-dom';
import { footerTagline } from '../content/home';

export function ArticleEnd({ prevHref, prevTitle, nextHref, nextTitle }) {
  const year = new Date().getFullYear();

  return (
    <div className="article-end">
      {(prevHref || nextHref) && (
        <div className="containerfull background_dark" style={{ display: 'flex' }}>
          {prevHref ? (
            <Link to={prevHref} className="linkblock aligncenter">
              <div className="text_allcaps">Previous</div>
              <h3>{prevTitle}</h3>
              <div className="hovercover backgroundinvert" />
            </Link>
          ) : <div style={{ flex: 1 }} />}
          {nextHref ? (
            <Link to={nextHref} className="linkblock aligncenter">
              <div className="text_allcaps">Next</div>
              <h3>{nextTitle}</h3>
              <div className="hovercover backgroundinvert" />
            </Link>
          ) : <div style={{ flex: 1 }} />}
        </div>
      )}
      <div className="footer dark article-end-footer">
        <div className="container _100 vertical_mobile">
          <div>©{year} Érica Menin. All Rights Reserved.<br /></div>
          <div>{footerTagline}</div>
        </div>
      </div>
    </div>
  );
}
