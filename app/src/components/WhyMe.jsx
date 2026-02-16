import { whyMeItems } from '../content/home';

export function WhyMe() {
  return (
    <section id="why-me" className="section">
      <div className="containermedium vertical spacemedium">
        <div className="textcontainer">
          <h2 className="text_light">Why we should join forces</h2>
        </div>
        <div className="quickstack text_light" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {whyMeItems.map(({ emoji, title, body }) => (
            <div key={title}>
              <p className="text_large">{emoji}</p>
              <div className="textcontainer">
                <div className="textcontainer hideoverflow">
                  <h3 className="label text_light">{title}</h3>
                  <h4 className="h3_hoverhidden" aria-hidden>{title}</h4>
                </div>
                <p className="text_light">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
