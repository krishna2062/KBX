import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from './services/adminApi';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminApp } from './AdminApp';
import { AdminUser, AdminTab } from './types/admin';

interface AdminRootProps {
  onSwitchToPublic: (tab?: string) => void;
}

const ROUTE_TO_TAB: Record<string, AdminTab> = {
  'dashboard': 'dashboard',
  'website': 'website-content',
  'appearance': 'appearance',
  'about': 'about',
  'services': 'services',
  'projects': 'projects',
  'technologies': 'technologies',
  'process': 'process',
  'testimonials': 'testimonials',
  'blog': 'blog',
  'media': 'media',
  'project-requests': 'inquiries',
  'inquiries': 'inquiries',
  'messages': 'messages',
  'seo': 'seo',
  'users': 'users',
  'settings': 'settings'
};

export const AdminRoot: React.FC<AdminRootProps> = ({ onSwitchToPublic }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<string | null>(null);
  const [initialTab, setInitialTab] = useState<AdminTab>('dashboard');

  const getSubRoute = (): string => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      const parts = path.split('/').filter(Boolean);
      return parts[1] || '';
    }
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash.startsWith('admin')) {
      const parts = hash.split('/').filter(Boolean);
      return parts[1] || '';
    }
    return '';
  };

  const syncBrowserUrl = (slug: string) => {
    if (window.location.hash) {
      window.history.replaceState(null, '', `#${slug.replace(/^\//, '')}`);
    } else {
      window.history.replaceState(null, '', slug);
    }
  };

  // Verify authentication on mount
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = adminApi.getToken();
      const subRoute = getSubRoute();

      if (!token) {
        if (isMounted) {
          setCurrentUser(null);
          setAuthChecking(false);
          document.title = 'Admin Login — KBX';
          // TEST 2: If accessing /admin/dashboard while logged out, redirect to /admin
          if (subRoute) {
            syncBrowserUrl('/admin');
          }
        }
        return;
      }

      try {
        const res = await adminApi.getMe();
        if (res.success && res.user && isMounted) {
          setCurrentUser(res.user);
          // TEST 4: If accessing /admin while authenticated, redirect to /admin/dashboard
          if (!subRoute || subRoute === 'admin') {
            syncBrowserUrl('/admin/dashboard');
            setInitialTab('dashboard');
          } else if (ROUTE_TO_TAB[subRoute]) {
            setInitialTab(ROUTE_TO_TAB[subRoute]);
          }
        } else {
          throw new Error('Invalid session');
        }
      } catch (err: any) {
        if (isMounted) {
          adminApi.setToken(null);
          setCurrentUser(null);
          setSessionExpiredMessage('Your session has expired. Please sign in again.');
          document.title = 'Admin Login — KBX';
          syncBrowserUrl('/admin');
        }
      } finally {
        if (isMounted) {
          setAuthChecking(false);
        }
      }
    };

    checkAuth();

    const handleAuthExpired = () => {
      adminApi.setToken(null);
      setCurrentUser(null);
      setSessionExpiredMessage('Your session has expired. Please sign in again.');
      document.title = 'Admin Login — KBX';
      syncBrowserUrl('/admin');
    };

    window.addEventListener('kbx:auth_expired', handleAuthExpired);
    return () => {
      isMounted = false;
      window.removeEventListener('kbx:auth_expired', handleAuthExpired);
    };
  }, []);

  const handleLoginSuccess = useCallback((user: AdminUser, _token: string) => {
    setCurrentUser(user);
    setSessionExpiredMessage(null);
    syncBrowserUrl('/admin/dashboard');
    setInitialTab('dashboard');
    document.title = 'Dashboard — KBX Admin';
  }, []);

  const handleLogout = useCallback(() => {
    adminApi.setToken(null);
    setCurrentUser(null);
    setSessionExpiredMessage(null);
    document.title = 'Admin Login — KBX';
    syncBrowserUrl('/admin');
  }, []);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#040705] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center font-display font-bold text-sm text-[#050807] animate-pulse">
            K
          </div>
          <span className="font-mono text-xs text-emerald-400/80">Verifying session...</span>
        </div>
      </div>
    );
  }

  // Not authenticated: always render Admin Login page!
  if (!currentUser) {
    return (
      <AdminLoginPage
        onLoginSuccess={handleLoginSuccess}
        sessionExpiredMessage={sessionExpiredMessage}
      />
    );
  }

  // Authenticated: render full CMS
  return (
    <AdminApp
      currentUser={currentUser}
      initialTab={initialTab}
      onLogout={handleLogout}
      onSwitchToPublic={onSwitchToPublic}
    />
  );
};
