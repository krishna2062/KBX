import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { adminApi } from '../services/adminApi';
import {
  AdminTab,
  DashboardStats,
  AdminNotification,
  AdminUser,
  ProjectInquirySubmission,
  ContactMessageSubmission
} from '../types/admin';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const TAB_TITLES: Record<AdminTab, string> = {
  dashboard: 'Dashboard — KBX Admin',
  'website-content': 'Website Content — KBX Admin',
  appearance: 'Appearance — KBX Admin',
  media: 'Media Library — KBX Admin',
  about: 'About — KBX Admin',
  services: 'Services — KBX Admin',
  projects: 'Projects — KBX Admin',
  technologies: 'Technologies — KBX Admin',
  process: 'Process — KBX Admin',
  testimonials: 'Testimonials — KBX Admin',
  blog: 'Blog — KBX Admin',
  inquiries: 'Project Requests — KBX Admin',
  messages: 'Messages — KBX Admin',
  seo: 'SEO & Meta — KBX Admin',
  users: 'Users & Admin — KBX Admin',
  settings: 'Settings — KBX Admin'
};

const TAB_ROUTES: Record<AdminTab, string> = {
  dashboard: '/admin/dashboard',
  'website-content': '/admin/website',
  appearance: '/admin/appearance',
  media: '/admin/media',
  about: '/admin/about',
  services: '/admin/services',
  projects: '/admin/projects',
  technologies: '/admin/technologies',
  process: '/admin/process',
  testimonials: '/admin/testimonials',
  blog: '/admin/blog',
  inquiries: '/admin/project-requests',
  messages: '/admin/messages',
  seo: '/admin/seo',
  users: '/admin/users',
  settings: '/admin/settings'
};

interface AdminContextType {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  currentUser: AdminUser;
  stats: DashboardStats | null;
  notifications: AdminNotification[];
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  newInquiriesCount: number;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshStats: () => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  selectedInquiry: ProjectInquirySubmission | null;
  setSelectedInquiry: (inquiry: ProjectInquirySubmission | null) => void;
  onOpenPublicPreview: (tab?: string) => void;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({} as AdminContextType);

export const AdminProvider: React.FC<{
  children: React.ReactNode;
  currentUser: AdminUser;
  initialTab?: AdminTab;
  onLogout: () => void;
  onSwitchToPublic: (tab?: string) => void;
}> = ({ children, currentUser, initialTab = 'dashboard', onLogout, onSwitchToPublic }) => {
  const [activeTab, setActiveTabState] = useState<AdminTab>(initialTab);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<ProjectInquirySubmission | null>(null);

  // Tab change handler that updates URL and document title
  const setActiveTab = useCallback((tab: AdminTab) => {
    setActiveTabState(tab);
    if (typeof document !== 'undefined') {
      document.title = TAB_TITLES[tab] || 'KBX Admin';
    }
    const route = TAB_ROUTES[tab] || `/admin/${tab}`;
    if (window.location.hash) {
      window.history.pushState(null, '', `#${route.replace(/^\//, '')}`);
    } else {
      window.history.pushState(null, '', route);
    }
  }, []);

  // Update initial title
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = TAB_TITLES[activeTab] || 'KBX Admin';
    }
  }, [activeTab]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminApi.logout();
    } catch {
      // ignore
    } finally {
      adminApi.setToken(null);
      onLogout();
    }
  }, [onLogout]);

  const refreshStats = useCallback(async () => {
    try {
      const res = await adminApi.getStats();
      if (res && res.success) {
        setStats(res.stats);
      }
      const dataRes = await adminApi.getAllData();
      if (dataRes && dataRes.success && dataRes.data) {
        setNotifications(dataRes.data.notifications || []);
      }
    } catch (err: any) {
      console.error('Error fetching admin stats:', err);
    }
  }, []);

  const markAllNotificationsRead = async () => {
    try {
      await adminApi.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // Non-blocking
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await adminApi.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {
      // Non-blocking
    }
  };

  useEffect(() => {
    refreshStats();

    // Listen for auth expired event
    const handleAuthExpired = () => {
      onLogout();
    };
    window.addEventListener('kbx:auth_expired', handleAuthExpired);

    // Setup Server-Sent Events listener for real-time live synchronization with Bearer token!
    let eventSource: EventSource | null = null;
    const token = adminApi.getToken();
    if (token) {
      try {
        eventSource = new EventSource(`/api/admin/events?token=${encodeURIComponent(token)}`);
        eventSource.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            if (payload.type === 'NEW_INQUIRY') {
              showToast(`New Project Request received from ${payload.inquiry.fullName}!`, 'info');
              refreshStats();
            } else if (payload.type === 'NEW_MESSAGE') {
              showToast(`New Contact Message from ${payload.message.name}: "${payload.message.subject}"`, 'info');
              refreshStats();
            } else if (payload.type === 'NOTIFICATION_RECEIVED') {
              setNotifications((prev) => [payload.notification, ...prev]);
              refreshStats();
            } else if (payload.type === 'CONTENT_UPDATED') {
              refreshStats();
            }
          } catch {
            // ignore heartbeat
          }
        };
      } catch (err) {
        console.warn('SSE connection failed:', err);
      }
    }

    return () => {
      window.removeEventListener('kbx:auth_expired', handleAuthExpired);
      if (eventSource) eventSource.close();
    };
  }, [refreshStats, showToast, onLogout]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const unreadMessagesCount = stats?.contactMessagesUnread ?? 0;
  const newInquiriesCount = stats?.projectRequestsNew ?? 0;

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        stats,
        notifications,
        unreadNotificationsCount,
        unreadMessagesCount,
        newInquiriesCount,
        toasts,
        showToast,
        removeToast,
        refreshStats,
        markAllNotificationsRead,
        markNotificationRead,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileDrawerOpen,
        setMobileDrawerOpen,
        selectedInquiry,
        setSelectedInquiry,
        onOpenPublicPreview: onSwitchToPublic,
        logout
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
