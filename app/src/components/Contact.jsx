import { contactLinks } from '../content/home';

export function Contact() {
  return (
    <section id="contact" className="section containerfull bottompadding_none">
      <div className="container vertical alignleft">
        <div className="textcontainer text_light">
          <div className="label">Érica Menin /</div>
          <div className="textdisplay">Digital design, design systems & workshops</div>
        </div>
        <div className="container highlight">
          <div className="arrowcontainer">
            <img src="/images/arrow-color.svg" loading="lazy" alt="" className="arrow_hidden" />
            <img src="/images/arrow.svg" loading="lazy" alt="" className="arrow" />
          </div>
          <div className="text_highlight">
            Let's have a chat! I'm available for freelance work & contracts, so feel free to reach
            out and start a conversation.
            <br />
          </div>
        </div>
      </div>
      <div className="container full borderbottom margintop">
        {contactLinks.map(({ href, label, sublabel }) => (
          <a key={label} href={href} className="linkblock" target="_blank" rel="noopener noreferrer">
            <div className="textdisplay">{label}</div>
            <div>{sublabel}</div>
            <div className="hovercover" />
          </a>
        ))}
      </div>
    </section>
  );
}
