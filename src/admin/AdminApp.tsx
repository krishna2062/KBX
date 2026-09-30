import React from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AdminLayout } from './components/AdminLayout';

import { AdminDashboard } from './pages/AdminDashboard';
import { AdminWebsiteContent } from './pages/AdminWebsiteContent';
import { AdminAppearance } from './pages/AdminAppearance';
import { AdminMediaLibrary } from './pages/AdminMediaLibrary';
import { AdminAbout } from './pages/AdminAbout';
import { AdminServices } from './pages/AdminServices';
import { AdminProjects } from './pages/AdminProjects';
import { AdminTechnologies } from './pages/AdminTechnologies';
import { AdminProcess } from './pages/AdminProcess';
import { AdminTestimonials } from './pages/AdminTestimonials';
import { AdminBlog } from './pages/AdminBlog';
import { AdminInquiries } from './pages/AdminInquiries';
import { AdminContactMessages } from './pages/AdminContactMessages';
import { AdminSeo } from './pages/AdminSeo';
import { AdminUsers } from './pages/AdminUsers';
import { AdminSettings } from './pages/AdminSettings';

import { AdminUser, AdminTab } from './types/admin';

interface AdminAppProps {
  currentUser: AdminUser;
  initialTab?: AdminTab;
  onLogout: () => void;
  onSwitchToPublic: (tab?: string) => void;
}

const AdminContentRouter: React.FC = () => {
  const { activeTab } = useAdmin();

  switch (activeTab) {
    case 'dashboard':
      return <AdminDashboard />;
    case 'website-content':
      return <AdminWebsiteContent />;
    case 'appearance':
      return <AdminAppearance />;
    case 'media':
      return <AdminMediaLibrary />;
    case 'about':
      return <AdminAbout />;
    case 'services':
      return <AdminServices />;
    case 'projects':
      return <AdminProjects />;
    case 'technologies':
      return <AdminTechnologies />;
    case 'process':
      return <AdminProcess />;
    case 'testimonials':
      return <AdminTestimonials />;
    case 'blog':
      return <AdminBlog />;
    case 'inquiries':
      return <AdminInquiries />;
    case 'messages':
      return <AdminContactMessages />;
    case 'seo':
      return <AdminSeo />;
    case 'users':
      return <AdminUsers />;
    case 'settings':
      return <AdminSettings />;
    default:
      return <AdminDashboard />;
  }
};

export const AdminApp: React.FC<AdminAppProps> = ({
  currentUser,
  initialTab = 'dashboard',
  onLogout,
  onSwitchToPublic
}) => {
  return (
    <AdminProvider
      currentUser={currentUser}
      initialTab={initialTab}
      onLogout={onLogout}
      onSwitchToPublic={onSwitchToPublic}
    >
      <AdminLayout>
        <AdminContentRouter />
      </AdminLayout>
    </AdminProvider>
  );
};
