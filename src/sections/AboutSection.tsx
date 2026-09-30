import React from 'react';
import { Code2, Compass, Cpu, Smartphone, Layers, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { NavigationTab } from '../types';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { usePublicContent } from '../context/PublicContentContext';

interface AboutSectionProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  const { about, brand } = usePublicContent();

  const highlights = [
    {
      icon: Compass,
      title: 'Product Thinking',
      desc: 'Translating fuzzy user problems into structured features with clear economic return.'
    },
    {
      icon: Layers,
      title: 'Full-Stack Architecture',
      desc: 'Bridging high-fidelity frontend craft with resilient, scalable database engines.'
    },
    {
      icon: Smartphone,
      title: 'Cross-Platform Execution',
      desc: 'Unified user experiences across responsive web, iOS, Android, and internal tool suites.'
    },
    {
      icon: ShieldCheck,
      title: 'Production Reliability',
      desc: 'Code tested against real-world traffic, strict latency budgets, and security audits.'
    }
  ];

  return (
    <section className="relative py-32 border-t border-emerald-950/40 bg-[#050907]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait & Studio Presentation */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal yOffset={24} duration={0.65}>
              <div className="relative rounded-2xl overflow-hidden bg-[#07130e] border border-emerald-500/25 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.7)] group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                  <img
                    src={about.portraitImage || brand.ownerImage}
                    alt={`${brand.ownerName}, Independent Software Developer`}
                    className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050807]/90 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#091510]/90 backdrop-blur-md border border-emerald-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-display font-semibold text-white text-base">
                          {brand.ownerName}
                        </h4>
                        <p className="text-xs font-mono text-emerald-400">
                          {brand.ownerTitle} · {brand.brandName}
                        </p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Subtle glow underneath */}
            <div
              className="absolute -bottom-8 -left-8 w-64 h-64 pointer-events-none -z-10"
              style={{
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12), transparent 70%)',
                filter: 'blur(40px)'
              }}
            />
          </div>

          {/* Right Column: Editorial Biography & Product Ethos */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <ScrollReveal yOffset={24} duration={0.65} delay={0.08}>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-2.5 block font-medium">
                Identity &amp; Philosophy
              </span>

              <h2 className="font-display font-medium text-[32px] sm:text-[42px] lg:text-[48px] text-white tracking-tight leading-[1.08] mb-6">
                THE PERSON <br />
                <span className="font-semibold text-emerald-400">BEHIND THE PRODUCT.</span>
              </h2>

              <div className="flex flex-col gap-4 text-[15px] sm:text-[17px] text-gray-300 leading-[1.7] font-normal mb-8 max-w-xl">
                <p>
                  {about.biographyIntro}
                </p>
                <p className="text-[14px] sm:text-[15px] text-gray-400 leading-[1.7]">
                  {about.biographyDetail}
                </p>
              </div>

              {/* Core Capabilities Bento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-10">
                {highlights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#091510]/50 border border-emerald-500/15 flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Icon size={16} />
                        <span className="font-display font-medium text-sm text-white">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Direct Action */}
              {onNavigate && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onNavigate('contact')}
                    className="group flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    <span>Work With Krishna</span>
                    <ArrowUpRight
                      size={14}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </button>
                  <button
                    onClick={() => onNavigate('process')}
                    className="text-xs font-mono text-gray-400 hover:text-emerald-400 transition-colors py-2 px-4 cursor-pointer font-normal"
                  >
                    Explore Development Process →
                  </button>
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
