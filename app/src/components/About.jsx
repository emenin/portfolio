import { aboutBio, aboutTiles, blogUrl } from '../content/home';

function linkPhrase(text, phrase, href) {
  const i = text.indexOf(phrase);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <a href={href} target="_blank" rel="noopener noreferrer" className="link">
        {phrase}
      </a>
      {text.slice(i + phrase.length)}
    </>
  );
}

export function About() {
  return (
    <section id="about" className="section light">
      <div className="container vertical">
        <div className="containermedium vertical">
          <div className="textcontainer hideoverflow">
            <img
              src="/images/me.png"
              loading="lazy"
              alt="Black and white headshot of the designer."
              className="float image"
            />
            <h2>
              A lil'Bit about <span className="texthover">me</span>
            </h2>
          </div>
          <div className="container _75 vertical spacemedium paddingleft about-bio">
            {aboutBio.map((para, i) => (
              <p key={i}>
                {linkPhrase(para, 'write about my learnings', blogUrl)}
              </p>
            ))}
          </div>
        </div>
        <div className="containermedium vertical spacemedium">
          <div className="textcontainer">
            <h3>Long story short</h3>
          </div>
          <div className="container aligntop spacemedium about-tiles-grid">
            {aboutTiles.map(({ title, items, bulletNone }) => (
              <div key={title} className="tile">
                <div className="tiletitle">{title}</div>
                <ul role="list">
                  {items.map((item, i) => (
                    <li key={i} className={bulletNone ? 'item_dark bulletnone' : 'item_dark'}>
                      {linkPhrase(item, 'sharing my insights', blogUrl)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
