import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  AdminUser,
  AdminSession,
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
  CmsMediaItem,
  ProjectInquirySubmission,
  ContactMessageSubmission,
  MessageReply,
  SeoSettings,
  AppearanceSettings,
  AuditLogItem,
  AdminNotification
} from './types';

export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  try {
    const calculated = crypto.scryptSync(password, salt, 64);
    const target = Buffer.from(hash, 'hex');
    if (calculated.length !== target.length) return false;
    return crypto.timingSafeEqual(calculated, target);
  } catch {
    return false;
  }
}

const DEFAULT_SALT = 'e57cf89a2b1f4c78';
const DEFAULT_HASH = hashPassword('Krishna@KBX2026!', DEFAULT_SALT);

export interface AppStoreData {
  users: AdminUser[];
  sessions: AdminSession[];
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
  media: CmsMediaItem[];
  inquiries: ProjectInquirySubmission[];
  messages: ContactMessageSubmission[];
  replies: MessageReply[];
  seo: SeoSettings;
  appearance: AppearanceSettings;
  auditLogs: AuditLogItem[];
  notifications: AdminNotification[];
  visitorCount: number;
}

const DATA_DIR = path.resolve(process.cwd(), 'server_data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const INITIAL_DATA: AppStoreData = {
  users: [
    {
      id: 'usr_kbx_1',
      name: 'Krishna Bhandari',
      email: 'krishna@kbx.dev',
      username: 'admin',
      passwordHash: DEFAULT_HASH,
      salt: DEFAULT_SALT,
      role: 'super_admin',
      avatar: '/src/assets/images/krishna_studio_portrait_1790694647980.jpg',
      title: 'Principal Software Architect & Founder',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  ],
  sessions: [],
  brand: {
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
  },
  hero: {
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
  },
  sectionToggles: {
    trust: true,
    services: true,
    projects: true,
    about: true,
    technologies: true,
    process: true,
    testimonials: false, // Default hidden when none published
    whyWorkWithMe: true,
    cta: true
  },
  about: {
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
      },
      {
        id: 'exp_2',
        title: 'Senior Full-Stack Developer',
        organization: 'CoreTech Labs',
        period: '2020 — 2023',
        description: 'Led engineering on distributed TypeScript backends, micro-frontends, and automated cloud deployments.',
        current: false,
        order: 2
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
  },
  services: [
    {
      id: 'web-development',
      number: '01',
      title: 'WEB DEVELOPMENT',
      slug: 'web-development',
      tagline: 'High-performance digital flagships engineered for conversion and speed.',
      description: 'Custom-crafted websites built on modern component frameworks. Zero bloated WordPress builders or generic themes. Clean semantic markup, structured SEO data, and sub-second load times designed to give your company commanding authority.',
      deliverables: [
        'Custom Design & Tailored Layouts',
        'Headless Architecture & CMS Integration',
        'Engineered Core Web Vitals (98+ score)',
        'Technical SEO & OpenGraph Social Cards'
      ],
      technologies: ['TypeScript', 'React', 'Tailwind CSS', 'Vite', 'Node.js'],
      highlight: 'Core Discipline',
      status: 'published',
      featured: true,
      order: 1
    },
    {
      id: 'web-applications',
      number: '02',
      title: 'WEB APPLICATIONS',
      slug: 'web-applications',
      tagline: 'Complex browser-based systems with desktop-class responsiveness.',
      description: 'Interactive web applications engineered for heavy workflows. From multi-tenant SaaS dashboards to collaborative data tools, I construct resilient client-side state, optimistic UI updates, and dependable REST/WebSocket integrations.',
      deliverables: [
        'Single Page Applications (SPA)',
        'Role-Based Access & Authentication',
        'Real-time WebSocket Data Feeds',
        'Complex Form Validation & Offline Sync'
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Express'],
      highlight: 'High Demand',
      status: 'published',
      featured: true,
      order: 2
    },
    {
      id: 'mobile-applications',
      number: '03',
      title: 'MOBILE APPLICATIONS',
      slug: 'mobile-applications',
      tagline: 'Cross-platform native experiences for iOS and Android.',
      description: 'Unified cross-platform mobile apps that feel genuinely native. Built with strict 60fps interaction benchmarks, background push notification synchronizations, biometrics, and secure offline SQLite/local storage.',
      deliverables: [
        'iOS & Android Cross-Platform Codebase',
        'App Store & Play Store Submissions',
        'Push Notifications & Deep Linking',
        'Device Hardware Integrations'
      ],
      technologies: ['Flutter', 'Dart', 'React Native', 'Firebase', 'REST APIs'],
      highlight: 'Cross-Platform',
      status: 'published',
      featured: true,
      order: 3
    },
    {
      id: 'custom-software',
      number: '04',
      title: 'CUSTOM SOFTWARE',
      slug: 'custom-software',
      tagline: 'Bespoke internal tools and business workflow engines.',
      description: 'Software tailored exactly to how your business operates. Eliminate subscription fatigue from fragmented off-the-shelf SaaS tools with a consolidated bespoke system built specifically for your operators and stakeholders.',
      deliverables: [
        'Internal Operational Portals',
        'ERP & Inventory Tracking Systems',
        'Third-Party API Orchestration',
        'Data Export, PDF Engine & Audit Trails'
      ],
      technologies: ['Node.js', 'PostgreSQL', 'Docker', 'TypeScript', 'Prisma'],
      highlight: 'Enterprise Ready',
      status: 'published',
      featured: true,
      order: 4
    },
    {
      id: 'saas-development',
      number: '05',
      title: 'SAAS DEVELOPMENT',
      slug: 'saas-development',
      tagline: 'Scalable subscription software ready to monetize from day one.',
      description: 'End-to-end multi-tenant SaaS platforms equipped with subscription billing, recurring charge management, team organization management, tiered feature gates, and analytics telemetry built directly in.',
      deliverables: [
        'Stripe Checkout & Billing Portals',
        'Multi-Tenant Tenant Isolation',
        'Automated User Onboarding Flows',
        'Usage-Based Metering & Limits'
      ],
      technologies: ['TypeScript', 'Stripe', 'Node.js', 'PostgreSQL', 'Redis'],
      highlight: 'Full Lifecycle',
      status: 'published',
      featured: true,
      order: 5
    },
    {
      id: 'api-backend',
      number: '06',
      title: 'API & BACKEND DEVELOPMENT',
      slug: 'api-backend',
      tagline: 'Robust data backbones, relational schemas, and microservices.',
      description: 'The engine underneath your product. I design normalized relational database schemas, write idempotent REST and GraphQL endpoints, implement caching layers, and automate CI/CD release pipelines.',
      deliverables: [
        'Strictly Typed API Interfaces',
        'Normalized Database Architecture',
        'Automated Backup & Disaster Recovery',
        'Swagger / OpenAPI Documentation'
      ],
      technologies: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
      highlight: 'Infrastructure',
      status: 'published',
      featured: true,
      order: 6
    }
  ],
  projects: [
    {
      id: 'nexatalk',
      number: '01',
      name: 'NEXATALK',
      slug: 'nexatalk',
      tagline: 'Ultra-low latency real-time communication platform engineered for mission-critical teams.',
      category: 'Real-Time Communication Platform',
      client: 'Nexa Enterprise Systems',
      year: '2025',
      scope: 'Architecture, Frontend, WebRTC Backend, Redis Pub/Sub',
      description: 'NexaTalk is an encrypted collaboration tool delivering instantaneous voice, text channels, and low-bandwidth presence tracking. Engineered to operate under network-constrained conditions without packet dropping.',
      coverImage: '/src/assets/images/project_nexatalk_1790694609831.png',
      galleryImages: ['/src/assets/images/project_nexatalk_1790694609831.png'],
      projectUrl: 'https://nexatalk.example.com',
      githubUrl: 'https://github.com/krishnabhandari/nexatalk',
      technologies: ['React', 'TypeScript', 'WebRTC', 'WebSocket', 'Node.js', 'Redis', 'Tailwind CSS'],
      metrics: [
        { label: 'Sub-second latency', value: '< 42ms' },
        { label: 'Concurrent channels', value: '10,000+' },
        { label: 'Uptime verification', value: '99.98%' },
        { label: 'Bundle payload', value: '64 KB gzip' }
      ],
      caseStudy: {
        challenge: 'The client required a private, secure voice and presence network that could operate behind corporate proxy environments with zero reliance on third-party telemetry or cloud vendor lock-in.',
        architecture: 'Designed a dual-layer transport mechanism pairing selective WebSocket signaling with direct WebRTC mesh connections, managed by a lightweight Redis pub/sub queue cluster for immediate failover.',
        result: 'Reduced infrastructure overhead by 68% compared to their legacy provider while lowering voice latency from 180ms to an average of 38ms.'
      },
      status: 'published',
      featured: true,
      order: 1
    },
    {
      id: 'aurora-engine',
      number: '02',
      name: 'AURORA ENGINE',
      slug: 'aurora-engine',
      tagline: 'Automated workflow orchestration engine processing millions of transactions weekly.',
      category: 'Enterprise SaaS & Automation Engine',
      client: 'Aurora Data Corp',
      year: '2024',
      scope: 'System Design, UI/UX, Distributed Queue, PostgreSQL Cluster',
      description: 'Aurora Engine enables mid-market enterprises to visually construct, debug, and monitor complex transactional pipelines across disparate legacy ERPs and third-party accounting APIs.',
      coverImage: '/src/assets/images/project_aurora_engine_1790694625298.png',
      galleryImages: ['/src/assets/images/project_aurora_engine_1790694625298.png'],
      projectUrl: 'https://auroraengine.example.com',
      githubUrl: 'https://github.com/krishnabhandari/aurora-engine',
      technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'BullMQ', 'Docker'],
      metrics: [
        { label: 'Weekly jobs processed', value: '3.4M' },
        { label: 'Pipeline success rate', value: '99.99%' },
        { label: 'Average queue wait', value: '12ms' },
        { label: 'Cost savings', value: '45%' }
      ],
      caseStudy: {
        challenge: 'Financial services team was manually reconciling batch payouts across three separate clearing houses, resulting in 4-hour daily delays and frequent transaction discrepancies.',
        architecture: 'Engineered an asynchronous queue orchestration layer utilizing BullMQ and Redis with deterministic retry mechanisms, transaction idempotency, and automated anomaly alerts.',
        result: 'Automated 96% of the reconciliation process, slashing processing windows from 4 hours to under 30 seconds with 0 recorded reconciliation errors.'
      },
      status: 'published',
      featured: true,
      order: 2
    },
    {
      id: 'krypton-mobile',
      number: '03',
      name: 'KRYPTON MOBILE',
      slug: 'krypton-mobile',
      tagline: 'Institutional-grade digital asset tracking and portfolio telemetry on iOS & Android.',
      category: 'Cross-Platform Mobile Application',
      client: 'Krypton Capital Global',
      year: '2024',
      scope: 'Mobile UI/UX, Flutter App, Encrypted Biometrics, Offline Sync',
      description: 'A native mobile interface built for fund managers requiring real-time portfolio rebalancing alerts, encrypted biometric authentication, and offline access to balance ledgers.',
      coverImage: '/src/assets/images/project_krypton_mobile_1790694637731.png',
      galleryImages: ['/src/assets/images/project_krypton_mobile_1790694637731.png'],
      projectUrl: 'https://kryptonmobile.example.com',
      githubUrl: 'https://github.com/krishnabhandari/krypton-mobile',
      technologies: ['Flutter', 'Dart', 'FastAPI', 'PostgreSQL', 'Secure Storage', 'SQLite'],
      metrics: [
        { label: 'Active institutional users', value: '12,500+' },
        { label: 'App store rating', value: '4.9 / 5.0' },
        { label: 'Frame render time', value: '60 fps flat' },
        { label: 'Cold start speed', value: '0.4s' }
      ],
      caseStudy: {
        challenge: 'Fund managers needed to monitor volatile asset positions and trigger urgent limit orders while traveling, with strict requirements for hardware-level biometrics and zero plaintext credential storage.',
        architecture: 'Implemented a Flutter cross-platform architecture with native secure enclave bindings for biometric key derivation, paired with an offline-first SQLite cache that reconciles with backend servers in milliseconds.',
        result: 'Achieved 4.9-star rating on both stores, with over $40M in transaction volume managed securely across 20 countries.'
      },
      status: 'published',
      featured: true,
      order: 3
    }
  ],
  technologies: [
    { id: 'tech_ts', name: 'TypeScript', category: 'Frontend', description: 'Strict type safety across the entire application stack', active: true, order: 1 },
    { id: 'tech_react', name: 'React', category: 'Frontend', description: 'Component-driven frontend architecture and state management', active: true, order: 2 },
    { id: 'tech_node', name: 'Node.js', category: 'Backend', description: 'Event-driven asynchronous server runtimes and microservices', active: true, order: 3 },
    { id: 'tech_postgres', name: 'PostgreSQL', category: 'Database', description: 'Relational integrity, complex querying, and transactional consistency', active: true, order: 4 },
    { id: 'tech_tailwind', name: 'Tailwind CSS', category: 'Frontend', description: 'Design-system compliant styling with optimal CSS bundle size', active: true, order: 5 },
    { id: 'tech_flutter', name: 'Flutter', category: 'Mobile', description: 'Cross-platform native performance for iOS and Android', active: true, order: 6 },
    { id: 'tech_redis', name: 'Redis', category: 'Database', description: 'In-memory caching, message queuing, and pub/sub signaling', active: true, order: 7 },
    { id: 'tech_docker', name: 'Docker', category: 'DevOps & Tooling', description: 'Reproducible containerization for reliable deployment anywhere', active: true, order: 8 },
    { id: 'tech_supabase', name: 'Supabase', category: 'Database', description: 'Real-time database triggers, Row Level Security, and edge storage', active: true, order: 9 },
    { id: 'tech_rest', name: 'REST APIs', category: 'Backend', description: 'Deterministic HTTP interfaces with strict payload validation', active: true, order: 10 },
    { id: 'tech_git', name: 'Git & CI/CD', category: 'DevOps & Tooling', description: 'Version control, automated build pipelines, and zero-downtime releases', active: true, order: 11 }
  ],
  process: [
    {
      id: 'step_1',
      number: '01',
      phase: 'PHASE 01',
      title: 'DISCOVER',
      summary: 'Understand the business, users, and core technical requirements before writing a single line of code.',
      deliverables: ['Product Requirement Document (PRD)', 'Technical Feasibility Analysis', 'Data Flow Diagram', 'Risk Assessment Matrix'],
      timeline: 'Days 1–5',
      active: true,
      order: 1
    },
    {
      id: 'step_2',
      number: '02',
      phase: 'PHASE 02',
      title: 'PLAN & ARCHITECT',
      summary: 'Define the architectural foundations, choose the stack, design database schemas, and map milestones.',
      deliverables: ['Database ERD Schema', 'API Contract Specification', 'Milestone Schedule & Budget Lock', 'Infrastructure Blueprint'],
      timeline: 'Days 6–10',
      active: true,
      order: 2
    },
    {
      id: 'step_3',
      number: '03',
      phase: 'PHASE 03',
      title: 'DESIGN & PROTOTYPE',
      summary: 'Create high-fidelity interactive prototypes focused on UX ergonomics, accessibility, and brand identity.',
      deliverables: ['Design System Tokens', 'Interactive Figma Component Library', 'Responsive Mobile/Desktop Layouts', 'UX User Flow Validation'],
      timeline: 'Week 2–3',
      active: true,
      order: 3
    },
    {
      id: 'step_4',
      number: '04',
      phase: 'PHASE 04',
      title: 'BUILD & INTEGRATE',
      summary: 'Write pristine TypeScript code, implement business logic, assemble components, and wire APIs.',
      deliverables: ['Component-Driven UI Code', 'Secure Backend Services', 'Third-Party Webhook Integrations', 'Staging Environment Live Previews'],
      timeline: 'Week 3–8',
      active: true,
      order: 4
    },
    {
      id: 'step_5',
      number: '05',
      phase: 'PHASE 05',
      title: 'TEST & HARDEN',
      summary: 'Stress-test the application for edge cases, performance bottlenecks, security vulnerabilities, and latency.',
      deliverables: ['Automated End-to-End Test Suite', 'Security & RBAC Audit', 'Lighthouse 95+ Performance Audit', 'Cross-Browser/Device Matrix'],
      timeline: 'Week 8–9',
      active: true,
      order: 5
    },
    {
      id: 'step_6',
      number: '06',
      phase: 'PHASE 06',
      title: 'DEPLOY & RELEASE',
      summary: 'Orchestrate zero-downtime production deployment, configure DNS, SSL, CDN caches, and monitoring alerts.',
      deliverables: ['Production Cloud Deployment', 'Automated CI/CD Pipeline', 'Error Telemetry & Uptime Alarms', 'Domain & SSL Verification'],
      timeline: 'Week 9–10',
      active: true,
      order: 6
    },
    {
      id: 'step_7',
      number: '07',
      phase: 'PHASE 07',
      title: 'SUPPORT & EVOLVE',
      summary: 'Post-launch technical warranty, performance telemetry analysis, user feedback loops, and feature roadmap.',
      deliverables: ['30-Day Critical Bug Guarantee', 'Architecture & Code Ownership Handoff', 'Analytics Telemetry Review', 'Iterative Feature Sprints'],
      timeline: 'Ongoing',
      active: true,
      order: 7
    }
  ],
  testimonials: [],
  blog: [
    {
      id: 'post_1',
      title: 'Why We Stopped Using Generic Page Builders for Commercial Web Applications',
      slug: 'why-custom-architecture-beats-page-builders',
      excerpt: 'How excessive plugin bloat and heavy DOM trees destroy user conversion and how custom component architectures solve it.',
      content: 'When businesses launch applications on drag-and-drop page builders, they frequently inherit technical debt on day one. A modern custom stack gives full control over database indexing, sub-second latency budgets, and security isolation.',
      coverImage: '/src/assets/images/project_nexatalk_1790694609831.png',
      author: 'Krishna Bhandari',
      category: 'Engineering Architecture',
      tags: ['Architecture', 'Performance', 'Full-Stack'],
      publishedDate: '2025-01-15',
      status: 'published',
      readingTime: '5 min read'
    }
  ],
  media: [
    {
      id: 'med_nexatalk',
      filename: 'project_nexatalk.png',
      url: '/src/assets/images/project_nexatalk_1790694609831.png',
      fileType: 'image',
      sizeBytes: 845200,
      dimensions: '1920x1080',
      uploadedAt: '2025-02-01T10:00:00Z'
    },
    {
      id: 'med_aurora',
      filename: 'project_aurora_engine.png',
      url: '/src/assets/images/project_aurora_engine_1790694625298.png',
      fileType: 'image',
      sizeBytes: 912000,
      dimensions: '1920x1080',
      uploadedAt: '2025-02-01T10:05:00Z'
    },
    {
      id: 'med_krypton',
      filename: 'project_krypton_mobile.png',
      url: '/src/assets/images/project_krypton_mobile_1790694637731.png',
      fileType: 'image',
      sizeBytes: 780400,
      dimensions: '1920x1080',
      uploadedAt: '2025-02-01T10:10:00Z'
    },
    {
      id: 'med_portrait',
      filename: 'krishna_studio_portrait.jpg',
      url: '/src/assets/images/krishna_studio_portrait_1790694647980.jpg',
      fileType: 'image',
      sizeBytes: 420100,
      dimensions: '960x1280',
      uploadedAt: '2025-02-01T10:15:00Z'
    }
  ],
  inquiries: [],
  messages: [],
  replies: [],
  seo: {
    websiteTitle: 'Krishna Bhandari — Software Developer & Digital Product Builder | KBX',
    metaDescription: 'Krishna Bhandari designs and develops high-performance websites, web applications, mobile apps, SaaS platforms, and custom software for businesses.',
    keywords: 'Krishna Bhandari, KBX, Software Developer, Full-Stack Engineer, React, TypeScript, Node.js, SaaS, Mobile Apps',
    ogTitle: 'KBX — Krishna Bhandari | Digital Product Builder',
    ogDescription: 'I do not just design websites. I build complete digital products from architecture to deployment.',
    ogImage: '/src/assets/images/project_nexatalk_1790694609831.png',
    canonicalUrl: 'https://kbx.dev',
    pageTitles: {
      home: 'Home — Krishna Bhandari | KBX',
      about: 'About — Krishna Bhandari',
      services: 'Services & Scope — KBX',
      projects: 'Selected Work & Case Studies — KBX',
      process: 'Engineering Methodology — KBX',
      contact: 'Contact & Inquiries — KBX',
      start: 'Start a Project Brief — KBX'
    }
  },
  appearance: {
    accentColor: '#10b981',
    heroVisual: '3d_knot',
    glowIntensity: 'medium',
    codeOwnershipNotice: true,
    footerTagline: 'Engineered for speed, durability, and commercial impact.'
  },
  auditLogs: [
    {
      id: 'log_init',
      timestamp: new Date().toISOString(),
      actor: 'System',
      action: 'INITIALIZE_CMS',
      entityType: 'System',
      entityId: 'kbx_core',
      details: 'Production CMS initialized with seed data.'
    }
  ],
  notifications: [
    {
      id: 'notif_welcome',
      title: 'KBX CMS Online',
      message: 'Your administration dashboard is connected to the live database.',
      type: 'system',
      read: false,
      timestamp: new Date().toISOString()
    }
  ],
  visitorCount: 1240
};

class StoreManager {
  private data: AppStoreData;
  private sseClients: Set<(data: string) => void> = new Set();

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): AppStoreData {
    let loaded: AppStoreData = INITIAL_DATA;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        loaded = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Failed to load store from disk, using initial data:', err);
    }

    if (!loaded.sessions) {
      loaded.sessions = [];
    }

    if (!loaded.replies) {
      loaded.replies = [];
    }

    // Ensure users have passwordHash, salt, username
    if (!loaded.users || loaded.users.length === 0) {
      loaded.users = INITIAL_DATA.users;
    } else {
      loaded.users = loaded.users.map((u) => {
        if (!u.passwordHash || !u.salt) {
          return {
            ...u,
            username: u.username || 'admin',
            salt: DEFAULT_SALT,
            passwordHash: DEFAULT_HASH,
            createdAt: u.createdAt || new Date().toISOString()
          };
        }
        return u;
      });
    }

    // Clean expired sessions
    const now = Date.now();
    loaded.sessions = loaded.sessions.filter((s) => new Date(s.expiresAt).getTime() > now);

    this.saveData(loaded);
    return loaded;
  }

  private saveData(dataToSave: AppStoreData) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save store to disk:', err);
    }
  }

  public getData(): AppStoreData {
    return this.data;
  }

  public createSession(userId: string, rememberMe = false): AdminSession {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    const duration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const session: AdminSession = {
      token: generateToken(),
      userId: user.id,
      role: user.role,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + duration).toISOString(),
      rememberMe
    };

    if (!this.data.sessions) this.data.sessions = [];
    this.data.sessions.push(session);
    this.saveData(this.data);
    return session;
  }

  public getSession(token: string): AdminSession | null {
    if (!this.data.sessions) this.data.sessions = [];
    const session = this.data.sessions.find((s) => s.token === token);
    if (!session) return null;

    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      this.deleteSession(token);
      return null;
    }
    return session;
  }

  public deleteSession(token: string) {
    if (!this.data.sessions) return;
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.saveData(this.data);
  }

  public deleteAllSessionsForUser(userId: string) {
    if (!this.data.sessions) return;
    this.data.sessions = this.data.sessions.filter((s) => s.userId !== userId);
    this.saveData(this.data);
  }

  public getUserByLogin(login: string): AdminUser | null {
    const q = login.trim().toLowerCase();
    return this.data.users.find((u) => u.email.toLowerCase() === q || u.username?.toLowerCase() === q) || null;
  }

  public getUserById(id: string): AdminUser | null {
    return this.data.users.find((u) => u.id === id) || null;
  }

  public updateUserPassword(userId: string, newPassword: string) {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');
    const newSalt = generateSalt();
    user.salt = newSalt;
    user.passwordHash = hashPassword(newPassword, newSalt);
    this.deleteAllSessionsForUser(userId);
    this.saveData(this.data);
  }

  public updateData<K extends keyof AppStoreData>(key: K, value: AppStoreData[K], actor = 'Krishna Bhandari', logDetails?: string) {
    this.data[key] = value;
    this.saveData(this.data);

    if (logDetails) {
      this.addAuditLog(actor, 'UPDATE', String(key), String(key), logDetails);
    }

    this.broadcastEvent({
      type: 'CONTENT_UPDATED',
      domain: String(key),
      timestamp: new Date().toISOString()
    });
  }

  public addAuditLog(actor: string, action: string, entityType: string, entityId: string, details: string) {
    const log: AuditLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      entityType,
      entityId,
      details
    };
    this.data.auditLogs.unshift(log);
    // Keep last 100 logs
    if (this.data.auditLogs.length > 100) {
      this.data.auditLogs.pop();
    }
    this.saveData(this.data);
  }

  public addNotification(title: string, message: string, type: 'inquiry' | 'message' | 'content' | 'system', linkTab?: string) {
    const notif: AdminNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
      linkTab
    };
    this.data.notifications.unshift(notif);
    if (this.data.notifications.length > 50) {
      this.data.notifications.pop();
    }
    this.saveData(this.data);

    this.broadcastEvent({
      type: 'NOTIFICATION_RECEIVED',
      notification: notif
    });
  }

  public incrementVisitor() {
    this.data.visitorCount += 1;
    this.saveData(this.data);
  }

  public registerSseClient(callback: (data: string) => void): () => void {
    this.sseClients.add(callback);
    return () => {
      this.sseClients.delete(callback);
    };
  }

  public broadcastEvent(eventData: any) {
    const payload = `data: ${JSON.stringify(eventData)}\n\n`;
    for (const client of this.sseClients) {
      try {
        client(payload);
      } catch {
        this.sseClients.delete(client);
      }
    }
  }
}

export const store = new StoreManager();
