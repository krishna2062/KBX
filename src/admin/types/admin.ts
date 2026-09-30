export type {
  ContentStatus,
  AdminUser,
  BrandSettings,
  HomeHeroSettings,
  SectionToggles,
  ExperienceItem,
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
  SeoSettings,
  AppearanceSettings,
  AuditLogItem,
  AdminNotification
} from '../../../server/types';

export type AdminTab =
  | 'dashboard'
  | 'website-content'
  | 'appearance'
  | 'media'
  | 'about'
  | 'services'
  | 'projects'
  | 'technologies'
  | 'process'
  | 'testimonials'
  | 'blog'
  | 'inquiries'
  | 'messages'
  | 'seo'
  | 'users'
  | 'settings';

export interface DashboardStats {
  projectRequestsTotal: number;
  projectRequestsNew: number;
  projectRequestsInProgress: number;
  contactMessagesTotal: number;
  contactMessagesUnread: number;
  totalProjects: number;
  publishedProjects: number;
  totalServices: number;
  publishedServices: number;
  totalTechnologies: number;
  websiteVisitors: number;
}
