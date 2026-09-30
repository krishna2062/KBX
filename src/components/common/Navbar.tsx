import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { NavigationTab } from '../../types';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; tab: NavigationTab }[] = [
    { label: 'Home', tab: 'home' },
    { label: 'About', tab: 'about' },
    { label: 'Services', tab: 'services' },
    { label: 'Projects', tab: 'projects' },
    { label: 'Process', tab: 'process' }
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 transition-all duration-300 ${
          isScrolled ? 'pt-3 pb-3' : 'pt-5 pb-4'
        }`}
      >
        <div
          className={`w-full max-w-6xl flex items-center justify-between px-5 py-2.5 rounded-full transition-all duration-300 ${
            isScrolled
              ? 'bg-[#07110d]/85 backdrop-blur-xl border border-emerald-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
              : 'bg-[#08130f]/60 backdrop-blur-md border border-white/10'
          }`}
        >
          {/* Left: KBX Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group cursor-pointer text-left"
            aria-label="KBX Home"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center font-display font-semibold text-xs text-[#050807] shadow-[0_0_12px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform duration-200">
              K
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-[15px] tracking-wider text-white group-hover:text-emerald-300 transition-colors">
                KBX
              </span>
            </div>
          </button>

          {/* Center: Desktop Navigation Links (14-16px, 400-500 weight) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1 rounded-full bg-black/25 border border-white/[0.04]">
            {navItems.map((item) => {
              const isActive = currentTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`relative px-3.5 py-1.5 text-[14px] font-normal transition-all duration-200 rounded-full cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-white font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-emerald-500/15 border border-emerald-500/30 -z-10 animate-fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Contact & Primary Action */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-1.5 text-[14px] font-normal transition-colors cursor-pointer ${
                currentTab === 'contact' ? 'text-emerald-400 font-medium' : 'text-gray-300 hover:text-white'
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => handleNavClick('start')}
              className="group flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium tracking-wide bg-emerald-500 hover:bg-emerald-400 text-[#050807] rounded-full transition-all duration-200 shadow-[0_0_16px_rgba(16,185,129,0.3)] hover:shadow-[0_0_24px_rgba(52,211,153,0.5)] cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <span>Start a Project</span>
              <ArrowUpRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('start')}
              className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider bg-emerald-500 text-[#050807] rounded-full cursor-pointer"
            >
              Start
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white rounded-full bg-white/[0.05] border border-white/10 cursor-pointer"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#050807]/95 backdrop-blur-2xl flex flex-col justify-between p-8 pt-28 md:hidden animate-fade-in">
          <div className="flex flex-col gap-6">
            <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-400/70 border-b border-emerald-950 pb-2">
              Navigation
            </span>
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`text-2xl font-display font-medium text-left tracking-wide transition-colors ${
                    currentTab === item.tab
                      ? 'text-emerald-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('contact')}
                className={`text-2xl font-display font-medium text-left tracking-wide transition-colors ${
                  currentTab === 'contact' ? 'text-emerald-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                Contact
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
            <button
              onClick={() => handleNavClick('start')}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-emerald-500 text-[#050807] font-semibold text-sm uppercase tracking-wider shadow-[0_0_24px_rgba(16,185,129,0.35)] cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowUpRight size={18} />
            </button>
            <p className="text-xs text-gray-500 text-center">
              Krishna Bhandari · Independent Software Developer
            </p>
          </div>
        </div>
      )}
    </>
  );
};
