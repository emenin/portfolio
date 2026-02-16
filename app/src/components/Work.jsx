import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { projects, workCallout } from '../content/home';

const visibleProjects = projects.filter(
  (p) => !p.unpublished || p.title === 'Flowrish UI Kit'
);

export function Work() {
  const introRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const intro = introRef.current;
    const wrapper = document.querySelector('.cursor-wrapper');
    if (!intro || !wrapper) return;
    const onEnter = () => wrapper.classList.add('cursor-hover');
    const onLeave = () => wrapper.classList.remove('cursor-hover');
    intro.addEventListener('mouseenter', onEnter);
    intro.addEventListener('mouseleave', onLeave);
    return () => {
      intro.removeEventListener('mouseenter', onEnter);
      intro.removeEventListener('mouseleave', onLeave);
      wrapper.classList.remove('cursor-hover');
    };
  }, []);

  return (
    <section id="work" className="section light">
      <div className="w-layout-vflex container aligncenter">
        <div className="textcontainer alignleft">
          <h2>some of my work</h2>
        </div>
        <div ref={introRef} className="textcontainer horizontal work-intro">
          <img
            src="/images/Vectors-Wrapper.svg"
            loading="lazy"
            width="43"
            height="90"
            alt=""
            className="icon"
          />
          <span className="horizontal__text">
            For more recent work, check my{' '}
            <a
              href={workCallout.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              {workCallout.articleLabel}
            </a>
            {' or '}
            <a href="#contact" className="link">
              contact me
            </a>
            .
          </span>
        </div>
        <div className="w-layout-hflex containermedium spacelarge">
          <div className="w-layout-vflex column spacelarge">
            {[visibleProjects[0], visibleProjects[2]].map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>
          <div className="w-layout-vflex column spacelarge paddingtop">
            {visibleProjects[1] && (
              <ProjectCard key={visibleProjects[1].title} project={visibleProjects[1]} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  const { title, description, image, imageAlt, href, tags, unpublished } =
    project;
  const wrapperClass = unpublished
    ? 'cardwrapper cardwrapper_unpublished'
    : 'cardwrapper';
  const cardContent = (
    <>
      <div className="imagewrap">
        <img src={image} loading="lazy" alt={imageAlt} className="thumbnail" />
      </div>
      <div className="textcontainer spacesmall alignleft">
        <h3 className="label">{title}</h3>
        <p>{description}</p>
      </div>
    </>
  );

  return (
    <aside className={wrapperClass}>
      {tags.length > 0 && (
        <div className="taggroup">
          {tags.map((t) => (
            <div key={t} className="tag">
              <div>{t}</div>
            </div>
          ))}
        </div>
      )}
      {unpublished ? (
        <div className="card link_empty">{cardContent}</div>
      ) : href.startsWith('http://') || href.startsWith('https://') ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="card"
        >
          {cardContent}
        </a>
      ) : (
        <Link to={href} className="card">
          {cardContent}
        </Link>
      )}
    </aside>
  );
}
