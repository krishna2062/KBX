import React from 'react';
import {
  LayoutDashboard,
  Globe,
  Palette,
  Image as ImageIcon,
  User,
  Wrench,
  FolderKanban,
  Cpu,
  GitBranch,
  Quote,
  FileText,
  Inbox,
  MessageSquare,
  SearchCheck,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  X
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { AdminTab } from '../types/admin';

export const AdminSidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    newInquiriesCount,
    unreadMessagesCount,
    currentUser,
    onOpenPublicPreview,
    logout
  } = useAdmin();

  interface NavItem {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    badge?: number;
  }

  interface NavGroup {
    title: string;
    items: NavItem[];
  }

  const navGroups: NavGroup[] = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'WEBSITE',
      items: [
        { id: 'website-content', label: 'Website Content', icon: Globe },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'media', label: 'Media Library', icon: ImageIcon }
      ]
    },
    {
      title: 'CONTENT',
      items: [
        { id: 'about', label: 'About', icon: User },
        { id: 'services', label: 'Services', icon: Wrench },
        { id: 'projects', label: 'Projects', icon: FolderKanban },
        { id: 'technologies', label: 'Technologies', icon: Cpu },
        { id: 'process', label: 'Process', icon: GitBranch },
        { id: 'testimonials', label: 'Testimonials', icon: Quote },
        { id: 'blog', label: 'Blog', icon: FileText }
      ]
    },
    {
      title: 'INQUIRIES',
      items: [
        { id: 'inquiries', label: 'Start Project Requests', icon: Inbox, badge: newInquiriesCount },
        { id: 'messages', label: 'Contact Messages', icon: MessageSquare, badge: unreadMessagesCount }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'seo', label: 'SEO & Meta', icon: SearchCheck },
        { id: 'users', label: 'Users & Admin', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const handleNavSelect = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileDrawerOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between bg-[#050b08] border-r border-emerald-500/15 overflow-hidden">
      {/* Top Header: Brand & Collapse Toggle */}
      <div>
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-[#050807] font-display font-semibold text-sm shadow-[0_0_12px_rgba(16,185,129,0.35)] shrink-0">
              K
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-display font-semibold text-sm text-white tracking-wider leading-none">
                  KBX CMS
                </span>
                <span className="text-[10px] font-mono text-emerald-400 leading-tight">
                  Control Center
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
            aria-label="Toggle sidebar collapse"
          >
            {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>

          {/* Mobile close toggle */}
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Groups List */}
        <div className="p-3 overflow-y-auto max-h-[calc(100vh-140px)] flex flex-col gap-5 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-1">
              {!sidebarCollapsed && (
                <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-emerald-400/60 font-medium">
                  {group.title}
                </span>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavSelect(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/15 text-white font-medium border border-emerald-500/35 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        size={16}
                        className={`shrink-0 transition-colors ${
                          isActive ? 'text-emerald-400' : 'text-gray-400 group-hover:text-emerald-400'
                        }`}
                      />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono shrink-0 font-medium ${
                          isActive
                            ? 'bg-emerald-400 text-[#050807]'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile & Exit Portal */}
      <div className="p-3 border-t border-white/[0.06] bg-[#040806]/60">
        <button
          onClick={() => onOpenPublicPreview()}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/20 transition-all cursor-pointer mb-2"
          title="Return to Public Customer View"
        >
          <ExternalLink size={14} className="shrink-0 text-emerald-400" />
          {!sidebarCollapsed && <span className="font-mono text-[11px] truncate">Public Website</span>}
        </button>

        <div className="flex items-center justify-between p-1.5 rounded-xl bg-white/[0.02]">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-lg object-cover border border-emerald-500/30 shrink-0"
            />
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-mono text-gray-500 truncate">
                  Owner · Active
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => logout()}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Sign Out of Admin"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 bottom-0 z-50 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
