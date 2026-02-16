const items = [
  {
    title: 'Design Systems',
    body: 'Unlock the full potential of design systems. I help teams go beyond colours and components, creating frameworks, governance, and workflows that scale. Bridging design and engineering, I enable teams to work smarter, maintain consistency, and deliver impact.',
  },
  {
    title: 'Product Design',
    body: 'From discovery to delivery, I help teams turn ideas into polished products. Framing the right problems, testing with users, and iterating on solutions, I ensure designs are strategic, scalable, and deliver impact across products and business.',
  },
  {
    title: 'AI & Smart Workflows',
    body: 'Exploring AI tools and smart flows to optimize design and prototyping, bridge design and code, and streamline processes. From creating connected documentation to building internal tools, I focus on practical ways to work smarter, reduce friction, and make systems and products more efficient.',
  },
  {
    title: 'Enablement & Design Ops',
    body: 'Helping teams adopt and scale design systems while improving collaboration and workflows. From coaching designers to bridging design and engineering, I enable organisations to make strategic decisions, stay aligned, and get the most out of their design systems.',
  },
];

export function WhatIDo() {
  return (
    <section id="what-i-do" className="section">
      <div className="w-layout-vflex containermedium vertical aligncenter_mobile">
        <div className="textcontainer aligncenter">
          <h2 className="text_light">What I do</h2>
        </div>
        <div className="w-layout-vflex container _75 vertical spacemedium">
          {items.map(({ title, body }) => (
            <div key={title} className="textcontainer">
              <div className="textcontainer hideoverflow">
                <h3 className="h3_hover">{title}</h3>
                <h3 className="h3_hoverhidden" aria-hidden>
                  {title}
                </h3>
              </div>
              <p className="text_light">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
