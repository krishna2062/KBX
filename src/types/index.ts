export type NavigationTab = 'home' | 'about' | 'services' | 'projects' | 'process' | 'contact' | 'start' | 'admin';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  highlight: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectItem {
  id: string;
  number: string;
  name: string;
  tagline: string;
  category: string;
  year: string;
  scope: string;
  description: string;
  client: string;
  metrics: ProjectMetric[];
  technologies: string[];
  image: string;
  caseStudy: {
    challenge: string;
    architecture: string;
    result: string;
  };
  demoUrl?: string;
  githubUrl?: string;
}

export interface ProcessItem {
  number: string;
  phase: string;
  title: string;
  summary: string;
  deliverables: string[];
  timeline: string;
}

export interface TechnologyItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Mobile' | 'DevOps & Tooling';
  description: string;
}

export interface PrincipleItem {
  number: string;
  title: string;
  headline: string;
  description: string;
}

export interface ProjectInquiryData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  timeline: string;
  budgetRange: string;
  description: string;
  targetUsers: string;
  preferredTech: string;
  referenceUrl: string;
  additionalMessage: string;
}
