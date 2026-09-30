import React from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { NavigationTab } from '../../types';

interface FooterProps {
  onSelectTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const handleNav = (tab: NavigationTab) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#040705] border-t border-emerald-950/60 pt-20 pb-12 overflow-hidden">
      {/* Background Soft Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse 600px 80px at 50% 0%, rgba(16, 185, 129, 0.08), transparent)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/[0.06]">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center font-display font-semibold text-xs text-[#050807]">
                K
              </div>
              <span className="font-display font-semibold text-[17px] tracking-wider text-white">
                KBX
              </span>
            </div>
            <p className="text-gray-400 text-[14px] leading-relaxed max-w-sm font-normal">
              Independent software development &amp; digital product studio. Engineered by Krishna Bhandari for high-growth startups, ambitious founders, and operational enterprises.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400/80 font-mono pt-2">
              <MapPin size={13} className="text-emerald-400" />
              <span>Available for worldwide remote engagements</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/70 mb-2">
              Index
            </span>
            <div className="flex flex-col gap-2.5 text-sm">
              <button
                onClick={() => handleNav('home')}
                className="text-left text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => handleNav('about')}
                className="text-left text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                About Krishna
              </button>
              <button
                onClick={() => handleNav('services')}
                className="text-left text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Services &amp; Architecture
              </button>
              <button
                onClick={() => handleNav('projects')}
                className="text-left text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Selected Case Studies
              </button>
              <button
                onClick={() => handleNav('process')}
                className="text-left text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Engineering Process
              </button>
              <button
                onClick={() => handleNav('contact')}
                className="text-left text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Direct Contact
              </button>
            </div>
          </div>

          {/* Connect & Direct Actions */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/70 mb-1">
              Direct Contact
            </span>
            <p className="text-xs text-gray-400">
              Have a scoped requirement or looking to explore product feasibility?
            </p>
            <button
              onClick={() => handleNav('start')}
              className="group inline-flex items-center justify-between px-5 py-3 rounded-xl bg-[#091510] border border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer"
            >
              <span>Initiate Project Brief</span>
              <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 transition-colors"
                aria-label="GitHub profile"
              >
                <Github size={15} />
                <span>GitHub</span>
              </a>
              <span className="text-white/20">·</span>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 transition-colors"
                aria-label="LinkedIn profile"
              >
                <Linkedin size={15} />
                <span>LinkedIn</span>
              </a>
              <span className="text-white/20">·</span>
              <a
                href="mailto:contact@kbx.dev"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 transition-colors"
                aria-label="Email Krishna"
              >
                <Mail size={15} />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-mono">
          <div>
            © 2026 KBX · Krishna Bhandari. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
