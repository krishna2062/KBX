import React from 'react';
import { ArrowUpRight, Terminal, Zap, Shield, Briefcase, Calendar } from 'lucide-react';
import { NavigationTab } from '../types';
import { usePublicContent } from '../context/PublicContentContext';

interface AboutPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { about, brand } = usePublicContent();

  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
        <div className="lg:col-span-7">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-2.5 block font-medium">
            About the Builder
          </span>
          <h1 className="font-display font-medium text-[32px] sm:text-[42px] lg:text-[48px] text-white tracking-tight leading-[1.08] mb-5">
            INDEPENDENT SOFTWARE ARCHITECT &amp; <span className="font-semibold text-emerald-400">PRODUCT BUILDER.</span>
          </h1>
          <p className="text-[15px] sm:text-[17px] text-gray-300 leading-[1.68] max-w-xl font-normal mb-5">
            {about.biographyIntro || `Hello, I am ${brand.ownerName}. I build end-to-end digital products for companies that value performance, design refinement, and architectural integrity.`}
          </p>
          {about.biographyDetail && (
            <p className="text-[14px] sm:text-[15px] text-gray-400 leading-[1.68] max-w-xl font-normal mb-7">
              {about.biographyDetail}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('start')}
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-colors cursor-pointer"
            >
              Start a Project With {brand.ownerName.split(' ')[0]}
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-full bg-[#081510] hover:bg-[#0d221a] border border-emerald-500/30 text-emerald-300 text-xs font-mono transition-colors cursor-pointer font-normal"
            >
              Direct Consultation
            </button>
          </div>
        </div>

        {/* Studio Portrait */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden bg-[#07130e] border border-emerald-500/25 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <img
                src={about.portraitImage || brand.ownerImage}
                alt={brand.ownerName}
                className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Experience History & Background */}
      {about.experiences && about.experiences.length > 0 && (
        <div className="mb-24">
          <div className="flex items-center gap-2 mb-8">
            <Briefcase size={16} className="text-emerald-400" />
            <h2 className="font-display font-medium text-xl text-white">Experience &amp; Track Record</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {about.experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-6 rounded-2xl bg-[#08130e]/80 border border-emerald-500/15 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-emerald-400 font-medium">
                      {exp.organization}
                    </span>
                    <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
                      <Calendar size={11} />
                      {exp.period}
                    </span>
                  </div>
                  <h3 className="font-display font-medium text-base text-white mb-2">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-normal">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Philosophy Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="p-8 rounded-2xl bg-[#08130e]/80 border border-emerald-500/15 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <Terminal size={18} />
            </div>
            <h2 className="font-display font-medium text-[18px] text-white mb-2">
              End-to-End Ownership
            </h2>
            <p className="text-[14px] text-gray-400 leading-[1.68] font-normal">
              Eliminating the disconnect between UX designers and backend engineers. By architecting both simultaneously, features ship without lost context or compromises.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-[#08130e]/80 border border-emerald-500/15 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <Zap size={18} />
            </div>
            <h2 className="font-display font-medium text-[18px] text-white mb-2">
              Performance as a Feature
            </h2>
            <p className="text-[14px] text-gray-400 leading-[1.68] font-normal">
              Every millisecond of latency costs conversions. I engineer applications for sub-second interactions, zero layout shifts, and lightweight JavaScript bundles.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-[#08130e]/80 border border-emerald-500/15 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <Shield size={18} />
            </div>
            <h2 className="font-display font-medium text-[18px] text-white mb-2">
              Direct Senior Builder
            </h2>
            <p className="text-[14px] text-gray-400 leading-[1.68] font-normal">
              No account managers or junior delegates. You work directly with me from initial scope definition through code commit, staging reviews, and production release.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
