import { ctaHref } from '../content/home';
import { Navbar } from './Navbar';

export function Hero() {
  return (
    <section id="hero" className="hero">
      <Navbar />
      <div className="w-layout-hflex container">
        <div className="column">
          <h1 className="text_light">Design Systems & Enablement</h1>
          <div className="text_highlight">
            Expert guidance and innovative solutions for teams to scale smarter,
            simpler, and without losing their minds. Smarter, simpler, and a
            little more fun.
          </div>
          <div className="text_highlight">
            Making design systems smarter, processes lighter, and teams happier.
          </div>
          <div className="w-layout-hflex container highlight">
            <div className="arrowcontainer">
              <img
                src="/images/arrow-color.svg"
                loading="lazy"
                alt=""
                className="arrow_hidden"
              />
              <img
                src="/images/arrow.svg"
                loading="lazy"
                alt=""
                className="arrow"
              />
            </div>
            <div className="text_highlight">
              Expert guidance and innovative solutions for teams and products to
              build smarter, simpler, and a little more fun.
              <br />
            </div>
          </div>
          <div
            data-w-id="45f32957-713f-e1ce-ebca-82a9356c23b5"
            className="textcontainer horizontal"
          >
            <img
              src="/images/Vectors-Wrapper.svg"
              loading="lazy"
              width="43"
              height="90"
              alt=""
              className="icon"
            />
            <a href={ctaHref} className="link_large text__light">
              Available for new projects
            </a>
          </div>
        </div>
        <div
          data-w-id="2771a231-3700-97b4-fe34-5be01684c87a"
          className="column autowidth"
        >
          <div className="cursortag _2">
            <img
              src="/images/cursor.svg"
              loading="lazy"
              width="32"
              alt=""
              className="cursor_bottomright"
            />
            <div className="cursorcontainer">
              <div className="textblock">Freelance Designer</div>
            </div>
          </div>
          <div className="cursortag">
            <img
              src="/images/cursor.svg"
              loading="lazy"
              width="32"
              alt=""
              className="cursor_topleft"
            />
            <div className="cursorcontainer">
              <div className="textblock">100% remote</div>
            </div>
          </div>
          <img
            src="/images/hero-image.png"
            srcSet="/images/hero-image-p-500.png 500w, /images/hero-image.png 876w"
            sizes="(max-width: 479px) 81vw, (max-width: 767px) 70vw, (max-width: 991px) 43vw, 38vw"
            loading="lazy"
            data-w-id="2771a231-3700-97b4-fe34-5be01684c885"
            alt="Black and white headshot of the designer."
            className="heroimage"
          />
          <div className="stamp">
            <div className="stamp-ring">
              <img
                src="/images/stamp-02.svg"
                loading="lazy"
                data-w-id="00ae4384-53c2-3628-9568-94ba383649cd"
                alt=""
              />
            </div>
            <img
              src="/images/stamp-illustration.svg"
              loading="lazy"
              width="246"
              alt=""
              className="stampicon"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
