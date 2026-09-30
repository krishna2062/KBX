import { ProjectItem } from '../types';

export const projectsData: ProjectItem[] = [
  {
    id: 'nexatalk',
    number: '01',
    name: 'NEXATALK',
    tagline: 'Ultra-low latency real-time communication platform engineered for mission-critical teams.',
    category: 'Real-Time Communication Platform',
    year: '2026',
    scope: 'Product Design + Frontend + Backend Architecture',
    client: 'Enterprise Collab Systems',
    description: 'A full-stack real-time communication platform featuring audio channels, end-to-end encrypted messaging, low-latency screen streaming, and persistent channel states.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'WebSocket', 'Redis'],
    image: '/src/assets/images/project_nexatalk_1790694610812.jpg',
    metrics: [
      { label: 'P99 Latency', value: '< 42ms' },
      { label: 'Concurrent WebSockets', value: '18,500+' },
      { label: 'Message Reliability', value: '99.99%' },
      { label: 'Audio Jitter', value: '< 2.1ms' }
    ],
    caseStudy: {
      challenge: 'The client needed a self-hosted, ultra-secure communication hub capable of real-time audio rooms and live code-sharing without relying on external cloud meeting vendors with prohibitive per-seat licensing.',
      architecture: 'Engineered an event-driven cluster using Node.js and Redis Pub/Sub backplane, coupled with a reactive React SPA state tree with optimistic UI updates and WebRTC mesh channels.',
      result: 'Delivered an enterprise-grade platform achieving sub-42ms latency across distributed nodes and successfully handling 18,500+ concurrent connections without packet drop.'
    },
    demoUrl: 'https://nexatalk-preview.kbx.dev',
    githubUrl: 'https://github.com/krishnabhandari/nexatalk-core'
  },
  {
    id: 'aurora-engine',
    number: '02',
    name: 'AURORA ENGINE',
    tagline: 'Distributed background workflow automation & data orchestration SaaS platform.',
    category: 'SaaS Platform & Distributed Systems',
    year: '2025',
    scope: 'Full-Stack Engineering + Distributed Job Queue + UI Architecture',
    client: 'Logix Stream Labs',
    description: 'An enterprise orchestration SaaS that visualizes, executes, and audits multi-step data pipelines, webhook listeners, automated PDF reports, and cross-platform integrations.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'BullMQ', 'Docker'],
    image: '/src/assets/images/project_aurora_engine_1790694623601.jpg',
    metrics: [
      { label: 'Monthly Processed Jobs', value: '14.2M' },
      { label: 'Workflow Throughput', value: '3,800/sec' },
      { label: 'Execution Reliability', value: '99.98%' },
      { label: 'Manual Time Saved', value: '82%' }
    ],
    caseStudy: {
      challenge: 'Operations teams were losing 35+ hours weekly manually synchronizing warehouse inventories, customer ERP data, and invoices across 6 disconnected SaaS APIs.',
      architecture: 'Designed a resilient node-graph builder on the frontend connected to a fault-tolerant worker pool utilizing BullMQ and PostgreSQL ACID ledger storage with dead-letter queue replay.',
      result: 'Automated 14.2M monthly asynchronous tasks with zero data corruption and provided operations directors with live visual telemetry.'
    },
    demoUrl: 'https://aurora-engine.kbx.dev',
    githubUrl: 'https://github.com/krishnabhandari/aurora-orchestrator'
  },
  {
    id: 'krypton-mobile',
    number: '03',
    name: 'KRYPTON MOBILE',
    tagline: 'High-frequency market intelligence & portfolio execution app for mobile devices.',
    category: 'Mobile Application & FinTech',
    year: '2025',
    scope: 'Mobile UI/UX + Flutter Architecture + WebSocket Client + Local Engine',
    client: 'Krypton Capital',
    description: 'A cross-platform mobile application delivering microsecond ticker feeds, interactive candlestick charts, biometric auth, and local-first offline transaction caching.',
    technologies: ['Flutter', 'Dart', 'TypeScript', 'SQLite', 'WebSockets', 'REST APIs'],
    image: '/src/assets/images/project_krypton_mobile_1790694635624.jpg',
    metrics: [
      { label: 'Frame Rate Fluidity', value: '60 FPS' },
      { label: 'Order Execution Speed', value: '< 65ms' },
      { label: 'Active Mobile Traders', value: '45,000+' },
      { label: 'App Store Rating', value: '4.9 / 5.0' }
    ],
    caseStudy: {
      challenge: 'The legacy client app was suffering from stutters during high market volatility, draining battery and dropping real-time price updates on mobile devices.',
      architecture: 'Re-architected the mobile client with Flutter using custom Canvas painters for charting, a dedicated background isolate for WebSocket streaming, and SQLite for instantaneous cached views.',
      result: 'Rock-solid 60 FPS performance under heavy tick volume and an increase of active daily mobile sessions by 210%.'
    },
    demoUrl: 'https://krypton-mobile.kbx.dev',
    githubUrl: 'https://github.com/krishnabhandari/krypton-mobile-app'
  }
];
