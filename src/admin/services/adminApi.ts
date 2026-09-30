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
  CmsMediaItem,
  ProjectInquirySubmission,
  ContactMessageSubmission,
  SeoSettings,
  AppearanceSettings
} from '../types/admin';

const TOKEN_KEY = 'kbx_admin_token';

let currentToken: string | null =
  typeof window !== 'undefined'
    ? sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
    : null;

export const setAuthToken = (token: string | null, rememberMe = true) => {
  currentToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      if (rememberMe) {
        localStorage.setItem(TOKEN_KEY, token);
        sessionStorage.removeItem(TOKEN_KEY);
      } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        localStorage.removeItem(TOKEN_KEY);
      }
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }
};

export const getAuthToken = () => currentToken;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (currentToken) {
    headers['Authorization'] = `Bearer ${currentToken}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  if (res.status === 401 && endpoint !== '/api/auth/login') {
    setAuthToken(null);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kbx:auth_expired'));
    }
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.message || 'Your session has expired. Please sign in again.');
  }

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.message || errorJson.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const adminApi = {
  // Authentication
  setToken: setAuthToken,
  getToken: getAuthToken,
  login: (login: string, password: string, rememberMe?: boolean) =>
    request<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password, rememberMe })
    }),
  getMe: () => request<any>('/api/auth/me'),
  logout: () =>
    request<any>('/api/auth/logout', {
      method: 'POST'
    }),
  logoutAll: () =>
    request<any>('/api/auth/logout-all', {
      method: 'POST'
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<any>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    }),

  // Dashboard & Content
  getStats: () => request<any>('/api/admin/stats'),
  getAllData: () => request<any>('/api/admin/data'),

  // Website Content
  updateBrand: (brand: BrandSettings) =>
    request<{ success: boolean; brand: BrandSettings }>('/api/admin/brand', {
      method: 'PUT',
      body: JSON.stringify(brand)
    }),

  updateHero: (hero: HomeHeroSettings) =>
    request<{ success: boolean; hero: HomeHeroSettings }>('/api/admin/hero', {
      method: 'PUT',
      body: JSON.stringify(hero)
    }),

  updateSectionToggles: (toggles: SectionToggles) =>
    request<{ success: boolean; sectionToggles: SectionToggles }>('/api/admin/section-toggles', {
      method: 'PUT',
      body: JSON.stringify(toggles)
    }),

  updateAbout: (about: AboutContent) =>
    request<{ success: boolean; about: AboutContent }>('/api/admin/about', {
      method: 'PUT',
      body: JSON.stringify(about)
    }),

  updateSeo: (seo: SeoSettings) =>
    request<{ success: boolean; seo: SeoSettings }>('/api/admin/seo', {
      method: 'PUT',
      body: JSON.stringify(seo)
    }),

  updateAppearance: (appearance: AppearanceSettings) =>
    request<{ success: boolean; appearance: AppearanceSettings }>('/api/admin/appearance', {
      method: 'PUT',
      body: JSON.stringify(appearance)
    }),

  // Services
  getServices: () => request<{ success: boolean; services: CmsService[] }>('/api/admin/services'),
  createService: (service: Partial<CmsService>) =>
    request<{ success: boolean; service: CmsService }>('/api/admin/services', {
      method: 'POST',
      body: JSON.stringify(service)
    }),
  updateService: (id: string, service: Partial<CmsService>) =>
    request<{ success: boolean; services: CmsService[] }>(`/api/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service)
    }),
  deleteService: (id: string) =>
    request<{ success: boolean; services: CmsService[] }>(`/api/admin/services/${id}`, {
      method: 'DELETE'
    }),

  // Projects
  getProjects: () => request<{ success: boolean; projects: CmsProject[] }>('/api/admin/projects'),
  createProject: (project: Partial<CmsProject>) =>
    request<{ success: boolean; project: CmsProject }>('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(project)
    }),
  updateProject: (id: string, project: Partial<CmsProject>) =>
    request<{ success: boolean; projects: CmsProject[] }>(`/api/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project)
    }),
  deleteProject: (id: string) =>
    request<{ success: boolean; projects: CmsProject[] }>(`/api/admin/projects/${id}`, {
      method: 'DELETE'
    }),

  // Technologies
  getTechnologies: () =>
    request<{ success: boolean; technologies: CmsTechnology[] }>('/api/admin/technologies'),
  createTechnology: (technology: Partial<CmsTechnology>) =>
    request<{ success: boolean; technology: CmsTechnology }>('/api/admin/technologies', {
      method: 'POST',
      body: JSON.stringify(technology)
    }),
  updateTechnology: (id: string, technology: Partial<CmsTechnology>) =>
    request<{ success: boolean; technologies: CmsTechnology[] }>(`/api/admin/technologies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(technology)
    }),
  deleteTechnology: (id: string) =>
    request<{ success: boolean; technologies: CmsTechnology[] }>(`/api/admin/technologies/${id}`, {
      method: 'DELETE'
    }),

  // Process
  getProcess: () => request<{ success: boolean; process: CmsProcessStep[] }>('/api/admin/process'),
  updateProcess: (process: CmsProcessStep[]) =>
    request<{ success: boolean; process: CmsProcessStep[] }>('/api/admin/process', {
      method: 'PUT',
      body: JSON.stringify(process)
    }),

  // Testimonials
  getTestimonials: () =>
    request<{ success: boolean; testimonials: CmsTestimonial[] }>('/api/admin/testimonials'),
  createTestimonial: (testimonial: Partial<CmsTestimonial>) =>
    request<{ success: boolean; testimonial: CmsTestimonial }>('/api/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonial)
    }),
  updateTestimonial: (id: string, testimonial: Partial<CmsTestimonial>) =>
    request<{ success: boolean; testimonials: CmsTestimonial[] }>(`/api/admin/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonial)
    }),
  deleteTestimonial: (id: string) =>
    request<{ success: boolean; testimonials: CmsTestimonial[] }>(`/api/admin/testimonials/${id}`, {
      method: 'DELETE'
    }),

  // Blog
  getBlog: () => request<{ success: boolean; blog: CmsBlogPost[] }>('/api/admin/blog'),
  createBlogPost: (post: Partial<CmsBlogPost>) =>
    request<{ success: boolean; post: CmsBlogPost }>('/api/admin/blog', {
      method: 'POST',
      body: JSON.stringify(post)
    }),
  updateBlogPost: (id: string, post: Partial<CmsBlogPost>) =>
    request<{ success: boolean; blog: CmsBlogPost[] }>(`/api/admin/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post)
    }),
  deleteBlogPost: (id: string) =>
    request<{ success: boolean; blog: CmsBlogPost[] }>(`/api/admin/blog/${id}`, {
      method: 'DELETE'
    }),

  // Media
  getMedia: () => request<{ success: boolean; media: CmsMediaItem[] }>('/api/admin/media'),
  uploadMedia: (media: { name?: string; filename?: string; url: string; type?: any; fileType?: any; size?: any; sizeBytes?: any; dimensions?: string }) =>
    request<{ success: boolean; media: CmsMediaItem }>('/api/admin/media', {
      method: 'POST',
      body: JSON.stringify({
        ...media,
        filename: media.filename || media.name || 'Uploaded Asset',
        name: media.filename || media.name || 'Uploaded Asset'
      })
    }),
  deleteMedia: (id: string) =>
    request<{ success: boolean; media: CmsMediaItem[] }>(`/api/admin/media/${id}`, {
      method: 'DELETE'
    }),

  // Inquiries
  getInquiries: () =>
    request<{ success: boolean; inquiries: ProjectInquirySubmission[] }>('/api/admin/inquiries'),
  updateInquiryStatus: (id: string, status: string, internalNotes?: string) =>
    request<{ success: boolean; inquiries: ProjectInquirySubmission[] }>(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, internalNotes })
    }),
  updateInquiry: (id: string, data: any) =>
    request<{ success: boolean; inquiries: ProjectInquirySubmission[] }>(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  deleteInquiry: (id: string) =>
    request<{ success: boolean; inquiries: ProjectInquirySubmission[] }>(`/api/admin/inquiries/${id}`, {
      method: 'DELETE'
    }),

  // Messages
  getMessages: () =>
    request<{ success: boolean; messages: ContactMessageSubmission[] }>('/api/admin/messages'),
  updateMessageStatus: (id: string, status: string) =>
    request<{ success: boolean; messages: ContactMessageSubmission[] }>(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  updateMessage: (id: string, data: any) =>
    request<{ success: boolean; messages: ContactMessageSubmission[] }>(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  deleteMessage: (id: string) =>
    request<{ success: boolean; messages: ContactMessageSubmission[] }>(`/api/admin/messages/${id}`, {
      method: 'DELETE'
    }),
  getMessageReplies: (messageId: string) =>
    request<{ success: boolean; replies: any[] }>(`/api/admin/messages/${messageId}/replies`),
  sendReply: async (messageId: string, reply: { subject?: string; replyText: string; toEmail?: string; toName?: string; adminName?: string }) => {
    try {
      return await request<{ success: boolean; reply: any; deliveryStatus: string; provider: string; message: string }>(
        `/api/admin/messages/${messageId}/reply`,
        {
          method: 'POST',
          body: JSON.stringify(reply)
        }
      );
    } catch (err: any) {
      // If deployed in a purely serverless Vercel environment where /api/send-reply is mounted
      try {
        const fallbackRes = await fetch('/api/send-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messageId,
            toEmail: reply.toEmail,
            toName: reply.toName,
            subject: reply.subject,
            replyText: reply.replyText,
            adminName: reply.adminName
          })
        });
        if (fallbackRes.ok) {
          const json = await fallbackRes.json();
          return {
            success: true,
            reply: {
              id: `rep_${Date.now()}`,
              messageId,
              subject: reply.subject,
              replyText: reply.replyText,
              deliveryStatus: json.status || 'sent',
              createdAt: new Date().toISOString()
            },
            deliveryStatus: json.status || 'sent',
            provider: json.provider || 'resend',
            message: json.message || 'Reply sent successfully.'
          };
        }
      } catch {
        // proceed to rethrow original error
      }
      throw err;
    }
  },

  // System Database Export/Import
  exportDatabase: () => request<any>('/api/admin/export', { method: 'POST' }),
  importDatabase: (payload: any) =>
    request<any>('/api/admin/import', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Users
  getUsers: () => request<any>('/api/admin/users'),
  updateUser: (id: string, data: any) =>
    request<any>(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Audit Logs
  getAuditLogs: () => request<any>('/api/admin/audit-logs'),

  // Notifications
  getNotifications: () => request<any>('/api/admin/notifications'),
  markNotificationRead: (id: string) =>
    request<any>(`/api/admin/notifications/${id}/read`, {
      method: 'PUT'
    }),
  markAllNotificationsRead: () =>
    request<any>('/api/admin/notifications/read-all', {
      method: 'PUT'
    }).catch(() => ({}))
};
