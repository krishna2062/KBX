import { ProcessItem } from '../types';

export const processData: ProcessItem[] = [
  {
    number: '01',
    phase: 'PHASE 01',
    title: 'DISCOVER',
    summary: 'Understand the business, users, and core technical requirements before writing a single line of code.',
    deliverables: [
      'Problem definition & KPI alignment',
      'Target user persona & journey mapping',
      'Technical constraint & integration audit',
      'Initial feasibility & risk assessment'
    ],
    timeline: 'Week 1'
  },
  {
    number: '02',
    phase: 'PHASE 02',
    title: 'PLAN',
    summary: 'Define explicit scope, systems architecture, technology stack, database schemas, and milestone roadmap.',
    deliverables: [
      'Technical Architecture Blueprint',
      'Database Entity-Relationship Schema',
      'API specification & data contracts',
      'Transparent milestone schedule & budget lock'
    ],
    timeline: 'Week 1–2'
  },
  {
    number: '03',
    phase: 'PHASE 03',
    title: 'DESIGN',
    summary: 'Create the complete product experience, responsive interfaces, interaction physics, and design token system.',
    deliverables: [
      'High-fidelity interactive prototype',
      'Design tokens (Typography, Colors, Spacing)',
      'Responsive mobile & desktop viewports',
      'Micro-interaction & transition choreography'
    ],
    timeline: 'Week 2–3'
  },
  {
    number: '04',
    phase: 'PHASE 04',
    title: 'BUILD',
    summary: 'Develop the actual software product with clean, modular, typed code and continuous staging deployments.',
    deliverables: [
      'Full-stack frontend and backend implementation',
      'Database migrations and indexing',
      'Authentication, permissions, and security controls',
      'Weekly staging builds with interactive previews'
    ],
    timeline: 'Week 3–6'
  },
  {
    number: '05',
    phase: 'PHASE 05',
    title: 'TEST',
    summary: 'Test functionality, edge cases, cross-device responsiveness, Core Web Vitals, and load endurance.',
    deliverables: [
      'Automated unit & integration test coverage',
      'Cross-browser and mobile device verification',
      'Lighthouse 95+ performance optimization',
      'OWASP security audit & data sanitization check'
    ],
    timeline: 'Week 6–7'
  },
  {
    number: '06',
    phase: 'PHASE 06',
    title: 'DEPLOY',
    summary: 'Move the product into high-availability production with continuous integration and real-time observability.',
    deliverables: [
      'Zero-downtime production deployment',
      'Domain, SSL, and CDN edge caching configuration',
      'Error logging & uptime health monitoring',
      'Database backup replication & recovery runbooks'
    ],
    timeline: 'Week 7'
  },
  {
    number: '07',
    phase: 'PHASE 07',
    title: 'SUPPORT',
    summary: 'Maintain, optimize, and scale the product as your active business user base and feature requirements grow.',
    deliverables: [
      'Monthly maintenance & security patches',
      'Performance profiling under real user traffic',
      'Feature iterations & conversion rate tuning',
      'Direct priority Slack / email engineering access'
    ],
    timeline: 'Ongoing Partnership'
  }
];
