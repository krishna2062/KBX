import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ScrollProgressBar } from './components/common/ScrollProgressBar';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ContactPage } from './pages/ContactPage';
import { StartProjectPage } from './pages/StartProjectPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProcessSection } from './sections/ProcessSection';
import { NavigationTab } from './types';
import { PublicContentProvider } from './context/PublicContentContext';
import { AdminRoot } from './admin/AdminRoot';

export default function App() {
  const checkIsAdmin = () => {
    if (typeof window === 'undefined') return false;
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    return pathname.startsWith('/admin') || hash.startsWith('#admin') || hash.startsWith('#/admin');
  };

  const [isAdmin, setIsAdmin] = useState<boolean>(checkIsAdmin());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [projectSlug, setProjectSlug] = useState<string | null>(null);

  // Handle browser back/forward or URL / hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const adminMatch = checkIsAdmin();
      setIsAdmin(adminMatch);

      if (!adminMatch) {
        // Check for project detail deep link: /projects/:slug or #projects/:slug
        const rawHash = window.location.hash.replace(/^#\/?/, '');
        const rawPath = window.location.pathname.replace(/^\//, '');

        if (rawHash.startsWith('projects/') || rawPath.startsWith('projects/')) {
          const slug = (rawHash.startsWith('projects/') ? rawHash : rawPath).replace('projects/', '');
          if (slug) {
            setProjectSlug(slug);
            setCurrentTab('projects');
            return;
          }
        }

        setProjectSlug(null);

        const hash = rawHash as NavigationTab;
        if (['home', 'about', 'services', 'projects', 'process', 'contact', 'start'].includes(hash)) {
          setCurrentTab(hash);
        } else {
          const path = rawPath as NavigationTab;
          if (['about', 'services', 'projects', 'process', 'contact', 'start'].includes(path)) {
            setCurrentTab(path);
          }
        }
      }
    };

    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleTabChange = (tab: NavigationTab) => {
    setCurrentTab(tab);
    setProjectSlug(null);
    setIsAdmin(false);
    window.history.pushState(null, '', `#${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If URL is an /admin route, isolate and render AdminRoot (Strict Authentication & Login Gate)
  if (isAdmin) {
    return (
      <PublicContentProvider>
        <AdminRoot
          onSwitchToPublic={(targetTab) => {
            setIsAdmin(false);
            const tabName = (targetTab as NavigationTab) || 'home';
            handleTabChange(tabName);
          }}
        />
      </PublicContentProvider>
    );
  }

  // Public customer-facing website (Completely devoid of admin buttons, badges or links)
  return (
    <PublicContentProvider>
      <div className="min-h-screen bg-[#050807] text-[#e8f0eb] flex flex-col font-sans selection:bg-[#10b981]/30 selection:text-[#34d399] relative">
        {/* Top Emerald Scroll Progress Bar */}
        <ScrollProgressBar />

        {/* Subtle fine noise overlay texture */}
        <div className="fixed inset-0 pointer-events-none noise-overlay opacity-60 z-30" />

        {/* Customer-Facing Global Navigation */}
        <Navbar currentTab={currentTab} onSelectTab={handleTabChange} />

        {/* Main Content Router */}
        <main className="flex-1">
          {projectSlug ? (
            <ProjectDetailPage slug={projectSlug} onNavigate={handleTabChange} />
          ) : (
            <>
              {currentTab === 'home' && <HomePage onNavigate={handleTabChange} />}
              {currentTab === 'about' && <AboutPage onNavigate={handleTabChange} />}
              {currentTab === 'services' && <ServicesPage onNavigate={handleTabChange} />}
              {currentTab === 'projects' && <ProjectsPage onNavigate={handleTabChange} />}
              {currentTab === 'process' && (
                <div className="pt-24">
                  <ProcessSection />
                </div>
              )}
              {currentTab === 'contact' && <ContactPage onNavigate={handleTabChange} />}
              {currentTab === 'start' && <StartProjectPage onNavigate={handleTabChange} />}
            </>
          )}
        </main>

        {/* Customer-Facing Minimalist Footer */}
        <Footer onSelectTab={handleTabChange} />
      </div>
    </PublicContentProvider>
  );
}
