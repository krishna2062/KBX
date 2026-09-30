import { ServiceItem } from '../types';

export const servicesData: ServiceItem[] = [
  {
    id: 'web-development',
    number: '01',
    title: 'WEB DEVELOPMENT',
    tagline: 'High-performance digital flagships engineered for conversion and speed.',
    description: 'Fast, responsive, and scalable websites designed around real business goals. Clean semantic code, sub-second load times, structured schema data, and modern fluid typography.',
    deliverables: [
      'Custom Responsive Architecture',
      'Next.js / Vite Static & Dynamic Rendering',
      'Technical SEO & Core Web Vitals Optimization',
      'Interactive Micro-Animations & 3D Visuals'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Three.js'],
    highlight: 'Sub-400ms First Contentful Paint benchmarks'
  },
  {
    id: 'web-applications',
    number: '02',
    title: 'WEB APPLICATIONS',
    tagline: 'Interactive, real-time web applications with complex workflows.',
    description: 'Full-stack enterprise applications that replace fragmented spreadsheets and legacy portals with unified, reactive web systems built for daily operations.',
    deliverables: [
      'Reactive State & Real-Time Sync',
      'Role-Based Access Control (RBAC)',
      'Complex Data Visualizations & Dashboards',
      'Offline-First Progressive Architecture'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'WebSockets', 'Redis'],
    highlight: 'Designed to handle 100k+ daily operational events'
  },
  {
    id: 'mobile-applications',
    number: '03',
    title: 'MOBILE APPLICATIONS',
    tagline: 'Cross-platform native experiences with 60 FPS fluidity.',
    description: 'iOS and Android applications engineered for fluid gestural interaction, push notification reliability, local-first offline storage, and tight device hardware integration.',
    deliverables: [
      'Cross-Platform iOS & Android Deployments',
      'Biometric Auth & Secure Hardware Storage',
      'Real-Time Background Sync & Push Services',
      'Store Submission & Compliance Management'
    ],
    technologies: ['Flutter', 'React Native', 'TypeScript', 'Firebase', 'SQLite'],
    highlight: '60 FPS animations with zero frame drops'
  },
  {
    id: 'custom-software',
    number: '04',
    title: 'CUSTOM SOFTWARE',
    tagline: 'Tailor-made software engines engineered for specialized enterprise needs.',
    description: 'When off-the-shelf software fails to match your operational model, I architect and build purpose-built software engines designed specifically for your proprietary workflows.',
    deliverables: [
      'Custom Internal Tooling & ERP Modules',
      'Domain-Specific Algorithm Implementation',
      'Legacy Codebase Modernization & Migration',
      'Auditable Data Warehousing Pipelines'
    ],
    technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'ASP.NET', 'Docker'],
    highlight: '100% custom-fit to your operational processes'
  },
  {
    id: 'saas-products',
    number: '05',
    title: 'SAAS PRODUCTS',
    tagline: 'Multi-tenant subscription software built from zero to launch.',
    description: 'Complete SaaS software engineering from multi-tenant database isolation to billing infrastructure, automated provisioning, onboarding funnels, and enterprise security compliance.',
    deliverables: [
      'Multi-Tenant Tenant Isolation & Auth',
      'Stripe & LemonSqueezy Subscription Flows',
      'Automated Workspace Provisioning',
      'Customer Telemetry & Usage-Based Metering'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe API'],
    highlight: 'Production-ready billing & subscription engine'
  },
  {
    id: 'ui-ux-development',
    number: '06',
    title: 'UI / UX DEVELOPMENT',
    tagline: 'Interface craft where design fidelity meets clean frontend architecture.',
    description: 'Translating complex user journeys into intuitive, accessible, and cinematic digital interfaces with meticulous attention to typography, spatial rhythm, and interaction latency.',
    deliverables: [
      'High-Fidelity Component Design Systems',
      'Interactive Motion & Spatial Prototypes',
      'WCAG AA Compliant Accessibility Auditing',
      'Micro-Interactions & Gestural Physics'
    ],
    technologies: ['Framer Motion', 'Tailwind CSS', 'Figma', 'Radix UI', 'CSS Houdini'],
    highlight: 'Sub-150ms interaction response budget'
  },
  {
    id: 'api-backend',
    number: '07',
    title: 'API & BACKEND',
    tagline: 'Resilient server architecture, high-throughput APIs, and data modeling.',
    description: 'Rock-solid backend engineering featuring structured REST & GraphQL endpoints, low-latency database queries, connection pooling, and strict schema validation.',
    deliverables: [
      'High-Throughput RESTful & GraphQL APIs',
      'Relational Database Modeling & Migrations',
      'OAuth2, JWT & Multi-Factor Auth Providers',
      'Webhooks, Rate-Limiting & Security Auditing'
    ],
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'Supabase', 'Redis'],
    highlight: '99.98% uptime SLA architectural target'
  },
  {
    id: 'automation',
    number: '08',
    title: 'BUSINESS AUTOMATION',
    tagline: 'Eliminate repetitive manual bottlenecks with autonomous pipelines.',
    description: 'Custom integration scripts, webhook listeners, automated PDF/invoice generators, CRM sync, and background worker queues that execute business logic 24/7 without human intervention.',
    deliverables: [
      'Multi-Platform Webhook & Event Choreography',
      'Automated Document & Invoice Generation',
      'Scheduled Extraction & ETL Data Pipelines',
      'Error Recovery & Resilient Dead-Letter Queues'
    ],
    technologies: ['Node.js', 'BullMQ', 'Redis', 'Python', 'REST APIs'],
    highlight: 'Recovers 20+ hours per week of manual operations'
  }
];
