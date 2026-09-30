export type ContentStatus = 'draft' | 'published' | 'archived';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username: string;
  passwordHash: string;
  salt: string;
  role: 'super_admin' | 'admin' | 'editor';
  avatar: string;
  title: string;
  lastLogin: string;
  createdAt: string;
}

export interface AdminSession {
  token: string;
  userId: string;
  role: 'super_admin' | 'admin' | 'editor';
  createdAt: string;
  expiresAt: string;
  rememberMe: boolean;
}

export interface BrandSettings {
  brandName: string;
  ownerName: string;
  ownerTitle: string;
  logoText: string;
  logoBadgeLetter: string;
  ownerImage: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  github: string;
  linkedin: string;
  twitter: string;
  availabilityStatus: string;
}

export interface HomeHeroSettings {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight1: string;
  titleMiddle: string;
  titleHighlight2: string;
  description: string;
  primaryCtaText: string;
  primaryCtaAction: string;
  secondaryCtaText: string;
  secondaryCtaAction: string;
  visualType: '3d_object' | 'image' | 'video';
  customImageUrl?: string;
  bottomBannerText: string;
  bottomBannerHighlight: string;
}

export interface SectionToggles {
  trust: boolean;
  services: boolean;
  projects: boolean;
  about: boolean;
  technologies: boolean;
  process: boolean;
  testimonials: boolean;
  whyWorkWithMe: boolean;
  cta: boolean;
}

export interface ExperienceItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  current: boolean;
  order: number;
}

export interface AboutContent {
  biographyIntro: string;
  biographyDetail: string;
  philosophy: string;
  portraitImage: string;
  experiences: ExperienceItem[];
  corePillars: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface CmsService {
  id: string;
  number: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  highlight: string;
  status: ContentStatus;
  featured: boolean;
  order: number;
}

export interface CmsProject {
  id: string;
  number: string;
  name: string;
  slug: string;
  tagline: string;
  category: string;
  client: string;
  year: string;
  scope: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
  projectUrl?: string;
  githubUrl?: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  caseStudy: {
    challenge: string;
    architecture: string;
    result: string;
  };
  status: ContentStatus;
  featured: boolean;
  order: number;
}

export interface CmsTechnology {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Mobile' | 'DevOps & Tooling' | 'Other';
  description: string;
  websiteUrl?: string;
  active: boolean;
  order: number;
}

export interface CmsProcessStep {
  id: string;
  number: string;
  phase: string;
  title: string;
  summary: string;
  deliverables: string[];
  timeline: string;
  active: boolean;
  order: number;
}

export interface CmsTestimonial {
  id: string;
  clientName: string;
  company: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  projectRelationship: string;
  status: ContentStatus;
  order: number;
}

export interface CmsBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  publishedDate: string;
  status: ContentStatus;
  readingTime: string;
}

export interface CmsMediaItem {
  id: string;
  filename: string;
  url: string;
  fileType: 'image' | 'video' | 'document';
  sizeBytes: number;
  dimensions?: string;
  uploadedAt: string;
}

export interface ProjectInquirySubmission {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  description: string;
  targetUsers: string;
  preferredTech: string;
  referenceUrl: string;
  additionalMessage: string;
  attachmentName?: string;
  status: 'new' | 'reviewing' | 'contacted' | 'in_progress' | 'completed' | 'rejected' | 'archived';
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessageSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  internalNotes?: string;
  createdAt: string;
}

export interface MessageReply {
  id: string;
  messageId: string;
  adminId: string;
  adminName: string;
  subject: string;
  replyText: string;
  deliveryStatus: 'sent' | 'failed' | 'pending';
  deliveryError?: string;
  createdAt: string;
}

export interface SeoSettings {
  websiteTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  pageTitles: Record<string, string>;
}

export interface AppearanceSettings {
  accentColor: string;
  heroVisual: '3d_knot' | 'ambient_glow' | 'custom_media';
  glowIntensity: 'low' | 'medium' | 'high';
  codeOwnershipNotice: boolean;
  footerTagline: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'inquiry' | 'message' | 'content' | 'system';
  read: boolean;
  timestamp: string;
  linkTab?: string;
}
