export function ArticleHeader({ title, image, imageAlt, tags = [], subtitle, date }) {
  return (
    <>
      <div className="projectheader">
        {tags.length > 0 && (
          <div className="taggroup">
            {tags.map((t) => (
              <div key={t} className="tag primary">
                <div>{t}</div>
              </div>
            ))}
          </div>
        )}
        <h2 className="projecttitle">{title}</h2>
        {date && <div className="caption" style={{ marginTop: 4 }}>{date}</div>}
        {subtitle && (
          <div className="textcontainer">
            <div>{subtitle}</div>
          </div>
        )}
      </div>
      {image && (
        <div className="imagewrap">
          <img src={image} loading="lazy" alt={imageAlt || title} className="projectcover" />
        </div>
      )}
    </>
  );
}
