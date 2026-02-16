import { useParams, Navigate } from 'react-router-dom';
import { ArticleNav } from '../components/ArticleNav';
import { ArticleHeader } from '../components/ArticleHeader';
import { ArticleEnd } from '../components/ArticleEnd';
import { getProject, projectSlugs } from '../content/projects';

export function ProjectPage() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : null;

  if (!project) {
    if (projectSlugs.includes(slug)) return null;
    return <Navigate to="/" replace />;
  }

  const { title, image, imageAlt, tags, subtitle, toc, sections, prev, next } = project;

  return (
    <>
      <ArticleNav />
      <section className="section project">
        <div className="container vertical spacemedium">
          <ArticleHeader
            title={title}
            image={image}
            imageAlt={imageAlt}
            tags={tags}
            subtitle={subtitle}
          />
        </div>
        <div className="container aligntop">
          <div className="column _50 spacesmall sticky">
            {toc.map(({ id, label }) => (
              <div key={id} className="item_summary">
                <a href={`#${id}`} className="tiletitle deconone">
                  {label}
                </a>
              </div>
            ))}
          </div>
          <div className="column studycase">
            {sections.map(({ id, title, content }) => (
              <div key={id} id={id} className="flexblock">
                <h3>{title}</h3>
                <p>{content}</p>
              </div>
            ))}
          </div>
        </div>
        <ArticleEnd
          prevHref={prev?.href}
          prevTitle={prev?.title}
          nextHref={next?.href}
          nextTitle={next?.title}
        />
      </section>
    </>
  );
}
