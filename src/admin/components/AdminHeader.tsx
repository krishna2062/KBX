import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ExternalLink,
  Menu,
  Check,
  LogOut,
  ChevronDown,
  Inbox,
  FolderKanban,
  Wrench,
  MessageSquare
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { adminApi } from '../services/adminApi';

export const AdminHeader: React.FC = () => {
  const {
    currentUser,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsRead,
    markNotificationRead,
    setActiveTab,
    setMobileDrawerOpen,
    onOpenPublicPreview,
    logout
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    type: 'project' | 'service' | 'tech' | 'inquiry' | 'message';
    id: string;
    title: string;
    subtitle: string;
  }[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle live global search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    adminApi.getAllData().then((res) => {
      if (!res || !res.success || !res.data) return;
      const data = res.data;
      const results: typeof searchResults = [];

      // Search Projects
      data.projects?.forEach((p: any) => {
        if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
          results.push({ type: 'project', id: p.id, title: p.name, subtitle: `Project · ${p.category}` });
        }
      });

      // Search Services
      data.services?.forEach((s: any) => {
        if (s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) {
          results.push({ type: 'service', id: s.id, title: s.title, subtitle: `Service · ${s.tagline}` });
        }
      });

      // Search Technologies
      data.technologies?.forEach((t: any) => {
        if (t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) {
          results.push({ type: 'tech', id: t.id, title: t.name, subtitle: `Stack · ${t.category}` });
        }
      });

      // Search Inquiries
      data.inquiries?.forEach((inq: any) => {
        if (inq.fullName.toLowerCase().includes(q) || inq.description.toLowerCase().includes(q)) {
          results.push({ type: 'inquiry', id: inq.id, title: inq.fullName, subtitle: `Inquiry · ${inq.projectType} (${inq.budgetRange})` });
        }
      });

      // Search Messages
      data.messages?.forEach((msg: any) => {
        if (msg.name.toLowerCase().includes(q) || msg.message.toLowerCase().includes(q) || msg.subject.toLowerCase().includes(q)) {
          results.push({ type: 'message', id: msg.id, title: msg.name, subtitle: `Message · "${msg.subject}"` });
        }
      });

      setSearchResults(results.slice(0, 8));
      setSearchOpen(true);
    });
  }, [searchQuery]);

  const handleSelectResult = (item: typeof searchResults[0]) => {
    setSearchOpen(false);
    setSearchQuery('');
    if (item.type === 'project') setActiveTab('projects');
    if (item.type === 'service') setActiveTab('services');
    if (item.type === 'tech') setActiveTab('technologies');
    if (item.type === 'inquiry') setActiveTab('inquiries');
    if (item.type === 'message') setActiveTab('messages');
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-[#050b08]/85 backdrop-blur-xl border-b border-emerald-500/15 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white bg-white/[0.04] border border-white/10 cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        {/* Search Bar */}
        <div ref={searchRef} className="relative flex-1">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#081510] border border-emerald-500/20 focus-within:border-emerald-400 focus-within:shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, services, inquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setSearchOpen(true);
              }}
              className="w-full bg-transparent text-xs text-white placeholder-gray-500 outline-none font-normal"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-[#08130f] border border-emerald-500/25 p-2 shadow-2xl z-50 animate-scale-up">
              <span className="text-[10px] font-mono uppercase text-gray-500 px-3 py-1 block">
                Quick Navigation Results
              </span>
              <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
                {searchResults.map((r, idx) => (
                  <button
                    key={`${r.id}-${idx}`}
                    onClick={() => handleSelectResult(r)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] text-left transition-colors cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      {r.type === 'project' && <FolderKanban size={13} />}
                      {r.type === 'service' && <Wrench size={13} />}
                      {r.type === 'inquiry' && <Inbox size={13} />}
                      {r.type === 'message' && <MessageSquare size={13} />}
                      {r.type === 'tech' && <Check size={13} />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-white group-hover:text-emerald-300 transition-colors truncate">
                        {r.title}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 truncate">
                        {r.subtitle}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Preview Website Button */}
        <button
          onClick={() => onOpenPublicPreview()}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#081510] hover:bg-[#0c2219] border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-medium tracking-wide transition-all cursor-pointer"
          title="Open Public Customer Website"
        >
          <span>Preview Website</span>
          <ExternalLink size={12} />
        </button>

        {/* Real-Time Notifications Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-full text-gray-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#050b08] animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#08130f] border border-emerald-500/25 p-4 shadow-2xl z-50 animate-scale-up">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-display font-medium text-white">Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-mono text-emerald-400 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 text-center font-mono">
                    No notifications yet.
                  </p>
                ) : (
                  notifications.slice(0, 8).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.linkTab) setActiveTab(notif.linkTab as any);
                        setNotifDropdownOpen(false);
                      }}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex flex-col gap-1 ${
                        notif.read
                          ? 'bg-[#050b08]/50 border-white/[0.04] text-gray-400'
                          : 'bg-[#081811] border-emerald-500/25 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white truncate">
                          {notif.title}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300 leading-snug">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-emerald-400/40"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-medium text-white leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 uppercase leading-none">
                Super Admin
              </span>
            </div>
            <ChevronDown size={13} className="text-gray-400 hidden sm:block" />
          </button>

          {/* Profile Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-[#08130f] border border-emerald-500/25 p-2 shadow-2xl z-50 animate-scale-up">
              <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                <span className="text-xs font-medium text-white block">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-mono text-gray-400 truncate block">
                  {currentUser.email}
                </span>
              </div>
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setProfileDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                Account Settings
              </button>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onOpenPublicPreview();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                Go to Public Website
              </button>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer mt-1"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
