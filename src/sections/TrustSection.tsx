import React from 'react';
import { Layers, Zap, Cpu, Lock } from 'lucide-react';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      icon: Layers,
      title: 'Complete Lifecycle',
      desc: 'Architecture, prototyping, full-stack code, cloud infrastructure, and release.'
    },
    {
      icon: Zap,
      title: 'Zero Bloat Performance',
      desc: 'Sub-second interaction speeds, minimal payload weight, and high Google Lighthouse scores.'
    },
    {
      icon: Cpu,
      title: 'Modern Architecture',
      desc: 'Clean TypeScript typing, relational data models, and resilient API contracts.'
    },
    {
      icon: Lock,
      title: 'Security & Reliability',
      desc: 'Role-based access, data encryption in flight/rest, and audit-ready test suites.'
    }
  ];

  return (
    <section className="relative py-24 sm:py-32 border-t border-emerald-950/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Editorial Statement */}
        <ScrollReveal yOffset={20} duration={0.6}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-2.5 block font-medium">
                Core Discipline
              </span>
              <h2 className="font-display font-medium text-[32px] sm:text-[42px] lg:text-[48px] text-white tracking-tight leading-[1.08]">
                FROM IDEA TO <br />
                <span className="font-semibold text-emerald-400">PRODUCTION.</span>
              </h2>
            </div>
            <p className="max-w-md text-[15px] sm:text-[17px] text-gray-300 leading-[1.7] font-normal">
              I work with businesses, fast-moving startups, and solo founders to transform early ideas into reliable, scalable digital products that deliver real economic value.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Architectural Foundations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal
                key={index}
                delay={index * 0.08}
                yOffset={18}
                duration={0.55}
              >
                <div
                  className="group relative h-full p-6 rounded-2xl bg-[#08120e]/60 border border-emerald-500/10 hover:border-emerald-500/35 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 group-hover:border-emerald-400/50 transition-all">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-display font-medium text-[17px] text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-gray-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
