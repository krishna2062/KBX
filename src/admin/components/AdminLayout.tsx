import React from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { ToastContainer } from './ToastContainer';
import { useAdmin } from '../context/AdminContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { sidebarCollapsed } = useAdmin();

  return (
    <div className="min-h-screen bg-[#050907] text-[#e8f0eb] flex font-sans selection:bg-[#10b981]/30 selection:text-[#34d399] relative">
      {/* Toast Alerts System */}
      <ToastContainer />

      {/* Admin Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Administrative Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};
