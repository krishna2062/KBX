import React from 'react';
import { HeroSection } from '../sections/HeroSection';
import { TrustSection } from '../sections/TrustSection';
import { ServicesSection } from '../sections/ServicesSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { AboutSection } from '../sections/AboutSection';
import { TechMarqueeSection } from '../sections/TechMarqueeSection';
import { ProcessSection } from '../sections/ProcessSection';
import { WhyWorkWithMeSection } from '../sections/WhyWorkWithMeSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { CtaSection } from '../sections/CtaSection';
import { NavigationTab } from '../types';
import { usePublicContent } from '../context/PublicContentContext';

interface HomePageProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { sectionToggles } = usePublicContent();

  return (
    <div className="flex flex-col">
      <HeroSection onNavigate={onNavigate} />
      {sectionToggles.trust && <TrustSection />}
      {sectionToggles.services && <ServicesSection onNavigate={onNavigate} />}
      {sectionToggles.projects && <ProjectsSection onNavigate={onNavigate} />}
      {sectionToggles.about && <AboutSection onNavigate={onNavigate} />}
      {sectionToggles.technologies && <TechMarqueeSection />}
      {sectionToggles.process && <ProcessSection />}
      {sectionToggles.testimonials && <TestimonialsSection />}
      {sectionToggles.whyWorkWithMe && <WhyWorkWithMeSection />}
      {sectionToggles.cta && <CtaSection onNavigate={onNavigate} />}
    </div>
  );
};
