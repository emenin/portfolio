/**
 * Project case studies – slug, meta, TOC, sections, prev/next.
 * Section content is string or React-friendly (use dangerouslySetInnerHTML for simple HTML if needed).
 */

export const projectSlugs = [
  'mcs-website',
  'soniq-design-system',
  'voyager-design-system',
  'soniq-app-design',
];

const projectsData = {
  'mcs-website': {
    title: 'Menin Creative Studio Website',
    image: '/images/01_mcs-cover.png',
    imageAlt: "Cover image showcasing the website's hero section.",
    tags: ['Website', 'UI Kit', 'Brand Identity'],
    subtitle: "A journey in designing and developing our former studio's website 💻✨",
    toc: [
      { id: 'company-background', label: 'Company Background' },
      { id: 'getting-ready', label: 'Getting ready' },
      { id: 'structure-and-content', label: 'Structure & Content' },
      { id: 'design', label: 'Design' },
      { id: 'development', label: 'Development' },
    ],
    sections: [
      {
        id: 'company-background',
        title: 'Company Background',
        content: "As a dynamic duo, my sister and I have always shared a passion for creativity and exceptional design. Together, we co-founded Menin Creative Studio (MCS), our former design studio that specialised in branding and website development. While we're currently on pause, undergoing an exciting rebranding process to reinvent the studio's identity, I'm excited to share the story of our journey in creating our own website. Join me as we explore how we brought our vision to life and crafted a website that we're truly proud of!",
      },
      {
        id: 'getting-ready',
        title: 'Getting ready',
        content: "To kick start the project, we dived into our mood board with inspiring visuals, colours, and typography that perfectly aligned with our vision. That helped us create the style tile, which served as a basis for all things visual in the project.",
      },
      {
        id: 'structure-and-content',
        title: 'Structure & Content',
        content: "We defined the information architecture and content structure for the site, ensuring a clear user journey and alignment with our studio's messaging.",
      },
      {
        id: 'design',
        title: 'Design',
        content: "We translated the style tile into high-fidelity designs, keeping consistency and a cohesive look across all pages.",
      },
      {
        id: 'development',
        title: 'Development',
        content: "Our website is up and running! Curious to see it in action? Come on over and check it out for yourself at menincreativestudio.netlify.app 😉",
      },
    ],
    prev: null,
    next: { href: '/project/soniq-design-system', title: 'soniq Design System' },
  },
  'soniq-design-system': {
    title: 'soniq Design System',
    image: '/images/01_ds-cover.png',
    imageAlt: 'Cover image displaying illustrative elements of the Design System.',
    tags: ['Design System'],
    subtitle: 'Building bridges through Design: my journey as a Design System Lead at soniq 🎨✨',
    toc: [
      { id: 'my-role', label: 'My role' },
      { id: 'team', label: 'Team Structure' },
      { id: 'background', label: 'Background' },
      { id: 'how-i-helped', label: 'How I helped' },
      { id: 'deliverables', label: 'Deliverables' },
      { id: 'design-work', label: 'Design System Work' },
      { id: 'results', label: 'Results' },
    ],
    sections: [
      { id: 'my-role', title: 'My role', content: 'Design System Lead.' },
      { id: 'team', title: 'Team Structure', content: 'By the end of the project, I collaborated with the Product Design Lead, 4 UX Designers and 3 different teams of Developers.' },
      {
        id: 'background',
        title: 'Background',
        content: 'soniq, founded in 2015, is an industry expert in building future-proof digital solutions for the cleaning industry. During my time there (2020-2023), they went through a significant rebranding process that involved changing their target audience and refining their main goals. That meant we had to reimagine everything, from the structure of the products to a fresh new visual language.',
      },
      {
        id: 'how-i-helped',
        title: 'How I helped',
        content: "As the main UI Designer for both the web and mobile apps, I was responsible for developing our brand-new Design System. This involved setting priorities, aligning with developers, establishing patterns, creating components and documentation in Figma, and handing them over to the development team. The main challenge was bridging the design-development gap. Spoiler alert: it all worked really well, and we found an effective process that kept us on the same page.",
      },
      {
        id: 'deliverables',
        title: 'Deliverables',
        content: "Our superstar deliverable was a user-friendly and well-structured Figma file that became the rock-solid foundation for the design work. It covered Visual Language, Base Components, Components, Design Patterns, and a Change log to track every update on the system.",
      },
      {
        id: 'design-work',
        title: 'Design System Work',
        content: "I took the lead in creating a system that would make our day-to-day tasks easier and ensure consistency, efficiency, and seamless collaboration across teams. If there's one thing I take from the amazing work we did together is that collaboration and communication were the keys to our success.",
      },
      { id: 'results', title: 'Results', content: 'The Design System became the single source of truth for design and development, improving consistency and speeding up delivery across products.' },
    ],
    prev: { href: '/project/mcs-website', title: 'MCS Website' },
    next: { href: '/project/voyager-design-system', title: 'Voyager Design System' },
  },
  'voyager-design-system': {
    title: 'Introducing Voyager: an out-of-this-world Design System',
    image: '/images/1_cover_post.png',
    imageAlt: 'Cover image featuring sections of the Design System documentation.',
    tags: ['Design System', 'Personal'],
    subtitle: 'In the Scaling Design System Dribbble course, I was tasked to design not one, not two, but three websites for a space travel company. On top of that I also had to create a design system to ensure that all three websites had a cohesive look and feel. Challenge accepted! 😎',
    toc: [
      { id: 'project-goals', label: 'Project Goals' },
      { id: 'my-role', label: 'My role' },
      { id: 'begin', label: 'The adventure begins' },
      { id: 'rebranding', label: 'Adapting to rebranding' },
      { id: 'next', label: 'Next mission' },
    ],
    sections: [
      {
        id: 'project-goals',
        title: 'Project Goals',
        content: 'Create 3 websites: a company informational website, a booking website for space travel and a real-time update website. Develop a design system to simplify the design process and ensure that all products have a cohesive design and look & feel.',
      },
      { id: 'my-role', title: 'My role', content: 'As a member of the design system course, my primary role was ensuring consistent designs across all products and creating a scalable design system for future team members.' },
      { id: 'begin', title: 'The adventure begins', content: "Let's set the scene. The project had just started: two weeks time to finish it. Three websites to build. One Design System to set. And only one logo as a reference. I was up for the challenge and excited to get started." },
      { id: 'rebranding', title: 'Adapting to rebranding', content: 'Adapting the design system to align with the rebranding and keeping consistency across all three products.' },
      { id: 'next', title: 'Next mission', content: 'Voyager became a solid foundation for future space travel projects and a great case study in scaling design systems.' },
    ],
    prev: { href: '/project/soniq-design-system', title: 'soniq Design System' },
    next: { href: '/project/soniq-app-design', title: 'Reinventing a web & mobile app' },
  },
  'soniq-app-design': {
    title: 'Reinventing a web & mobile app',
    image: '/images/cover-apps-3.png',
    imageAlt: 'Cover image showcasing the web app and mobile study case.',
    tags: ['UX/UI Design'],
    subtitle: 'My role as a UX/UI Designer at a SaaS company, redesigning their web app and mobile experience.',
    toc: [
      { id: 'overview', label: 'Overview' },
      { id: 'approach', label: 'Approach' },
      { id: 'outcomes', label: 'Outcomes' },
    ],
    sections: [
      { id: 'overview', title: 'Overview', content: 'At soniq I led UX/UI work for both the web and mobile apps, from research and flows to high-fidelity UI and design handover.' },
      { id: 'approach', title: 'Approach', content: 'Collaboration with product and development, design system alignment, and iterative validation with users and stakeholders.' },
      { id: 'outcomes', title: 'Outcomes', content: 'A more consistent, usable product experience and a clear design process that kept design and development in sync.' },
    ],
    prev: { href: '/project/voyager-design-system', title: 'Voyager Design System' },
    next: null,
  },
};

export function getProject(slug) {
  return projectsData[slug] || null;
}

export function getProjectPrevNext(slug) {
  const p = projectsData[slug];
  if (!p) return { prev: null, next: null };
  return { prev: p.prev, next: p.next };
}
