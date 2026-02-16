import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { WhatIDo } from '../components/WhatIDo';
import { Work } from '../components/Work';
import { HowICanHelp } from '../components/HowICanHelp';
import { WhyMe } from '../components/WhyMe';
import { About } from '../components/About';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export function HomePage() {
  return (
    <>
      <Hero />
      <WhatIDo />
      <Work />
      <HowICanHelp />
      <WhyMe />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
