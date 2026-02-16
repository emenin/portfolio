/**
 * Homepage content – nav, projects, tabs, why me, about, contact.
 * Edit here to change copy without touching components.
 */

export const navLinks = [
  { href: '#what-i-do', label: 'What I do' },
  { href: '#work', label: 'My work' },
  { href: '#how-i-can-help', label: 'How I can help' },
  { href: '#why-me', label: 'Why me' },
  { href: '#about', label: 'About' },
];

export const ctaHref = '#contact';
export const ctaLabel = "Let's talk!";
export const brandHref = '/';
export const brandLabel = 'emenin';
export const blogUrl = 'https://designsystemsunfiltered.substack.com/';
export const brandTooltip = "It stands for Érica Menin, not the Eminem you thought ;)";

export const projects = [
  {
    title: '24 days of Design System Experiments',
    description: 'A collection of tiny prompts and experiments for design-system people — advent calendar style.',
    image: '/images/thumbnail-24days-advent.png',
    imageAlt: '24 days of Design System Experiments: advent calendar of prompts and experiments.',
    href: 'https://designsystemsunfiltered.substack.com/p/24-days-of-design-system-experiments',
    tags: ['Design System'],
    unpublished: false,
  },
  {
    title: 'IQ Design System',
    description: 'Building bridges through Design: my journey as a Design System Lead in a SaaS company',
    image: '/images/cover-ds.png',
    imageAlt: 'Cover image displaying illustrative elements of the Design System, including a calendar shot, a button anatomy example, a screenshot of component options on Figma, and a search input field.',
    href: '/project/soniq-design-system',
    tags: ['Design System'],
    unpublished: false,
  },
  {
    title: 'Voyager Design System',
    description: 'Uncovering the mastery of Scaling Design Systems: an exploration',
    image: '/images/cover-capstone.jpg',
    imageAlt: 'Cover image featuring sections of the Design System documentation, including colour, icons, and illustration pages.',
    href: '/project/voyager-design-system',
    tags: ['Design System', 'Personal'],
    unpublished: true,
  },
  {
    title: 'MCS Website',
    description: "A journey in designing and developing our former studio's website 💻✨",
    image: '/images/cover-mcs.png',
    imageAlt: 'Cover image showcasing the Menin Creative Studio website, featuring the Hero section.',
    href: '/project/mcs-website',
    tags: ['Website', 'UI Kit', 'Brand Identity'],
    unpublished: true,
  },
  {
    title: 'Reinventing a web & mobile app',
    description: 'My role as a UX/UI Designer at a SaaS company, redesigning their web app and mobile experience',
    image: '/images/cover-apps-3.png',
    imageAlt: 'Cover image showcasing the web app and mobile study case, featuring a Figma file cover and a snapshot of a web app feature displaying a table, search function, and date selection.',
    href: '/project/soniq-app-design',
    tags: ['UX/UI Design'],
    unpublished: false,
  },
  {
    title: 'Flowrish UI Kit',
    description: 'Experimenting with building a design system with AI — in progress',
    image: '/images/thumbnail-ds.png',
    imageAlt: "Lime green background with the text 'Design System (Coming Soon)' displayed, indicating an upcoming project in progress.",
    href: '',
    tags: ['Design System', 'AI', 'Build'],
    unpublished: true,
  },
];

export const workCallout = {
  line: "For a sense of what I've been up to lately, check my",
  articleUrl: 'https://substack.com/home/post/p-185400022',
  articleLabel: '2025 retrospective',
};

export const howICanHelpTabs = [
  {
    id: 'product-teams',
    label: 'Product teams',
    title: 'Crafting systems and workflows',
    body: 'As part of your team, I focus on improving workflows, collaboration, and building and using practical systems that actually get used.',
    items: [
      'Creating and refining design systems and component libraries that scale efficiently',
      'Conducting strategic audits and providing actionable recommendations',
      'Streamlining collaboration between design and engineering',
      'Ensuring design decisions support both team productivity and business goals',
    ],
  },
  {
    id: 'consultancy',
    label: 'Consultancy',
    title: 'Scale better',
    body: 'Supporting small teams and growing organisations in implementing frameworks, improving workflows, and maximising design impact – from strategy to hands on implementation.',
    items: [
      'Advising on design system strategy and governance',
      'Facilitating collaboration between designers, engineers, and stakeholders',
      'Coaching teams to adopt smart workflows and best practices',
      'Building practical tools and documentation to empower independent growth',
    ],
  },
  {
    id: 'designers',
    label: 'Designer(s)',
    title: 'Level up your skills and system thinking',
    body: 'Helping designers unlock their full potential — from mastering tooling and system thinking to applying advanced design principles in real projects. Focused on practical growth, not theory.',
    items: [
      'Personalized mentoring for designers at any stage',
      'Guidance on adopting strategic workflows and system thinking',
      'Hands-on tips to bridge design and code efficiently',
      'Exploring smart tools and workflows to improve daily practice',
    ],
  },
];

export const whyMeItems = [
  { emoji: '🏆', title: 'Tailored Guidance', body: 'I focus on understanding your team, product, and challenges to provide strategic solutions that get used — from design system strategy and bridging design and engineering to refining assets and foundations.' },
  { emoji: '🤝', title: 'Collaboration', body: 'I help teams, stakeholders, and individuals work efficiently, align priorities, and adopt workflows that scale — keeping the process human and approachable.' },
  { emoji: '🎯', title: 'Results That Matter', body: 'From improving team efficiency to scaling products, my work drives outcomes that benefit both users and the business.' },
  { emoji: '🎉', title: 'Empowerment & Learning', body: 'I coach and mentor teams and designers, showing practical ways to adopt smart workflows, AI tools, and scalable systems while keeping work engaging and effective.' },
];

export const aboutBio = [
  "Hey, I'm Érica, and I've been working in design for over 15 years. I specialise in design systems and smart workflows, helping teams make smarter, more strategic decisions and bridging design and engineering.",
  "I'm passionate about empowering teams and designers: coaching, mentoring, and enabling people to think systematically without killing creativity. Whether guiding a team on design system strategy or helping an individual designer level up, I focus on real-world outcomes over theory.",
  "I'm a strong advocate for remote work and flexible collaboration, and I love experimenting with AI and smart workflows to make design systems smarter, processes lighter, and teams happier.",
  "I also write about my learnings as I go: the good, the awkward, the \"oh that didn't work\", no BS.",
];

export const aboutTiles = [
  {
    title: 'I design',
    items: [
      'Design systems',
      'Patterns and foundations',
      'Workflows and processes',
    ],
  },
  {
    title: 'I enable',
    items: [
      'Strategic system thinking',
      'Tooling and system-level practices',
      'Workflows, design ops, and AI-powered tools',
    ],
  },
  {
    title: 'I experiment',
    items: [
      "From testing AI agents and smart workflows to building tools that track progress and reduce friction, I'm constantly learning, iterating, and sharing my insights.",
    ],
    bulletNone: true,
  },
];

export const contactLinks = [
  { href: 'https://www.linkedin.com/in/ericamenin/', label: 'LinkedIn', sublabel: 'in/ericamenin/' },
  { href: 'mailto:erica@menin.me?subject=Website%20contact%20%3A)', label: 'Email', sublabel: 'erica@menin.me' },
];

export const footerTagline = 'Designed and built by me <3';
export const footerTooltip = '2023: No-code / 2026: Cursor';

// Hero headline (screenshot: "Smart Design Systems. No fluff.")
export const heroHeadline = "Smart Design Systems. No fluff.";
// Badgered circular text (rotates; icon in centre is fixed)
export const badgeredText = "Made in Brazil. Living in Germany. +12 years ";
