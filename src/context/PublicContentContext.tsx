import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchPublicContent, trackVisit } from '../services/api';
import { servicesData as fallbackServices } from '../data/services';
import { projectsData as fallbackProjects } from '../data/projects';
import { technologiesData as fallbackTechnologies } from '../data/technologies';
import { processData as fallbackProcess } from '../data/process';
import {
  BrandSettings,
  HomeHeroSettings,
  SectionToggles,
  AboutContent,
  CmsService,
  CmsProject,
  CmsTechnology,
  CmsProcessStep,
  CmsTestimonial,
  CmsBlogPost,
  SeoSettings,
  AppearanceSettings
} from '../types/admin';

interface PublicContentContextType {
  brand: BrandSettings;
  hero: HomeHeroSettings;
  sectionToggles: SectionToggles;
  about: AboutContent;
  services: CmsService[];
  projects: CmsProject[];
  technologies: CmsTechnology[];
  process: CmsProcessStep[];
  testimonials: CmsTestimonial[];
  blog: CmsBlogPost[];
  seo: SeoSettings;
  appearance: AppearanceSettings;
  loading: boolean;
  refreshContent: () => Promise<void>;
}

const defaultBrand: BrandSettings = {
  brandName: 'KBX',
  ownerName: 'Krishna Bhandari',
  ownerTitle: 'Independent Software Developer & Digital Product Builder',
  logoText: 'KBX',
  logoBadgeLetter: 'K',
  ownerImage: '/src/assets/images/krishna_studio_portrait_1790694647980.jpg',
  email: 'krishna@kbx.dev',
  phone: '+977 980-0000000',
  location: 'Kathmandu / Global Remote',
  timezone: 'UTC+5:45',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://x.com',
  availabilityStatus: 'Available for Q3/Q4 Projects'
};

const defaultHero: HomeHeroSettings = {
  eyebrow: 'Independent Software Development',
  titlePrefix: 'BUILDING',
  titleHighlight1: 'DIGITAL',
  titleMiddle: 'PRODUCTS THAT MOVE BUSINESSES',
  titleHighlight2: 'FORWARD.',
  description: 'I design and develop modern websites, web applications, mobile apps, SaaS platforms and custom software for businesses, startups, and ambitious ideas.',
  primaryCtaText: 'Start a Project',
  primaryCtaAction: 'start',
  secondaryCtaText: 'View Projects',
  secondaryCtaAction: 'projects',
  visualType: '3d_object',
  bottomBannerText: 'From idea to production —',
  bottomBannerHighlight: 'strategy, design, development, and deployment.'
};

const defaultSectionToggles: SectionToggles = {
  trust: true,
  services: true,
  projects: true,
  about: true,
  technologies: true,
  process: true,
  testimonials: false,
  whyWorkWithMe: true,
  cta: true
};

const defaultAbout: AboutContent = {
  biographyIntro: "I am an independent software developer and digital product builder. Over years of crafting consumer apps and enterprise software, I discovered that companies don't just need more code—they need cohesive digital products that solve real business problems.",
  biographyDetail: "Instead of dividing projects between disconnected freelancers, agencies, and handoffs, I provide end-to-end technical leadership: from UI/UX design and data architecture to production deployment and performance tuning.",
  philosophy: 'Code should be clean, modular, and built to survive real traffic. Performance is not an afterthought; sub-second response times and predictable data pipelines are foundational requirements.',
  portraitImage: '/src/assets/images/krishna_studio_portrait_1790694647980.jpg',
  experiences: [
    {
      id: 'exp_1',
      title: 'Founder & Principal Engineer',
      organization: 'KBX Digital Studio',
      period: '2023 — Present',
      description: 'Architecting scalable web applications, real-time protocols, and enterprise automation pipelines for global startups.',
      current: true,
      order: 1
    }
  ],
  corePillars: [
    {
      title: 'Product Thinking',
      description: 'Translating fuzzy user problems into structured features with clear economic return.',
      icon: 'Compass'
    },
    {
      title: 'Full-Stack Architecture',
      description: 'Bridging high-fidelity frontend craft with resilient, scalable database engines.',
      icon: 'Layers'
    },
    {
      title: 'Cross-Platform Execution',
      description: 'Unified user experiences across responsive web, iOS, Android, and internal tool suites.',
      icon: 'Smartphone'
    },
    {
      title: 'Production Reliability',
      description: 'Code tested against real-world traffic, strict latency budgets, and security audits.',
      icon: 'ShieldCheck'
    }
  ]
};

const defaultSeo: SeoSettings = {
  websiteTitle: 'Krishna Bhandari — Software Developer & Digital Product Builder | KBX',
  metaDescription: 'Krishna Bhandari designs and develops high-performance websites, web applications, mobile apps, SaaS platforms, and custom software for businesses.',
  keywords: 'Krishna Bhandari, KBX, Software Developer, Full-Stack Engineer, React, TypeScript, Node.js, SaaS, Mobile Apps',
  ogTitle: 'KBX — Krishna Bhandari | Digital Product Builder',
  ogDescription: 'I do not just design websites. I build complete digital products from architecture to deployment.',
  ogImage: '/src/assets/images/project_nexatalk_1790694609831.png',
  canonicalUrl: 'https://kbx.dev',
  pageTitles: {}
};

const defaultAppearance: AppearanceSettings = {
  accentColor: '#10b981',
  heroVisual: '3d_knot',
  glowIntensity: 'medium',
  codeOwnershipNotice: true,
  footerTagline: 'Engineered for speed, durability, and commercial impact.'
};

const PublicContentContext = createContext<PublicContentContextType>({
  brand: defaultBrand,
  hero: defaultHero,
  sectionToggles: defaultSectionToggles,
  about: defaultAbout,
  services: fallbackServices.map((s, idx) => ({ ...s, slug: s.id, status: 'published', featured: true, order: idx + 1 })),
  projects: fallbackProjects.map((p, idx) => ({
    ...p,
    slug: p.id,
    coverImage: p.image,
    galleryImages: [p.image],
    status: 'published',
    featured: true,
    order: idx + 1
  })),
  technologies: fallbackTechnologies.map((t, idx) => ({ id: `tech_${idx}`, ...t, active: true, order: idx + 1 })),
  process: fallbackProcess.map((pr, idx) => ({ id: `proc_${idx}`, ...pr, active: true, order: idx + 1 })),
  testimonials: [],
  blog: [],
  seo: defaultSeo,
  appearance: defaultAppearance,
  loading: true,
  refreshContent: async () => {}
});

export const PublicContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brand, setBrand] = useState<BrandSettings>(defaultBrand);
  const [hero, setHero] = useState<HomeHeroSettings>(defaultHero);
  const [sectionToggles, setSectionToggles] = useState<SectionToggles>(defaultSectionToggles);
  const [about, setAbout] = useState<AboutContent>(defaultAbout);
  const [services, setServices] = useState<CmsService[]>(
    fallbackServices.map((s, idx) => ({ ...s, slug: s.id, status: 'published', featured: true, order: idx + 1 }))
  );
  const [projects, setProjects] = useState<CmsProject[]>(
    fallbackProjects.map((p, idx) => ({
      ...p,
      slug: p.id,
      coverImage: p.image,
      galleryImages: [p.image],
      status: 'published',
      featured: true,
      order: idx + 1
    }))
  );
  const [technologies, setTechnologies] = useState<CmsTechnology[]>(
    fallbackTechnologies.map((t, idx) => ({ id: `tech_${idx}`, ...t, active: true, order: idx + 1 }))
  );
  const [processSteps, setProcessSteps] = useState<CmsProcessStep[]>(
    fallbackProcess.map((pr, idx) => ({ id: `proc_${idx}`, ...pr, active: true, order: idx + 1 }))
  );
  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>([]);
  const [blog, setBlog] = useState<CmsBlogPost[]>([]);
  const [seo, setSeo] = useState<SeoSettings>(defaultSeo);
  const [appearance, setAppearance] = useState<AppearanceSettings>(defaultAppearance);
  const [loading, setLoading] = useState(true);

  const loadContent = useCallback(async () => {
    try {
      const data = await fetchPublicContent();
      if (data && data.success) {
        if (data.brand) setBrand(data.brand);
        if (data.hero) setHero(data.hero);
        if (data.sectionToggles) setSectionToggles(data.sectionToggles);
        if (data.about) setAbout(data.about);
        if (data.services && data.services.length > 0) setServices(data.services);
        if (data.projects && data.projects.length > 0) setProjects(data.projects);
        if (data.technologies && data.technologies.length > 0) setTechnologies(data.technologies);
        if (data.process && data.process.length > 0) setProcessSteps(data.process);
        if (data.testimonials) setTestimonials(data.testimonials);
        if (data.blog) setBlog(data.blog);
        if (data.seo) setSeo(data.seo);
        if (data.appearance) setAppearance(data.appearance);
      }
    } catch (err) {
      console.error('Error applying public content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
    trackVisit();

    // Listen for SSE broadcast if browser supports EventSource
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/admin/events');
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'CONTENT_UPDATED') {
            loadContent();
          }
        } catch {
          // ignore ping
        }
      };
    } catch {
      // Non-blocking
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [loadContent]);

  return (
    <PublicContentContext.Provider
      value={{
        brand,
        hero,
        sectionToggles,
        about,
        services,
        projects,
        technologies,
        process: processSteps,
        testimonials,
        blog,
        seo,
        appearance,
        loading,
        refreshContent: loadContent
      }}
    >
      {children}
    </PublicContentContext.Provider>
  );
};

export const usePublicContent = () => useContext(PublicContentContext);
