import React from 'react';
import { principlesData } from '../data/principles';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const WhyWorkWithMeSection: React.FC = () => {
  return (
    <section className="relative py-32 border-t border-emerald-950/40 bg-[#060c09]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal yOffset={20} duration={0.6}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-2.5 block font-medium">
                Value Proposition
              </span>
              <h2 className="font-display font-medium text-[32px] sm:text-[42px] lg:text-[48px] text-white tracking-tight leading-[1.08]">
                BUILT FOR REAL <br />
                <span className="font-semibold text-emerald-400">BUSINESS NEEDS.</span>
              </h2>
            </div>
            <p className="text-[15px] sm:text-[17px] text-gray-300 max-w-md font-normal leading-[1.68]">
              I don't just write scripts or build superficial brochure sites. I build sustainable software assets that perform, convert, and scale.
            </p>
          </div>
        </ScrollReveal>

        {/* 5 Editorial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principlesData.map((principle, index) => (
            <ScrollReveal
              key={principle.number}
              delay={index * 0.06}
              yOffset={18}
              duration={0.5}
            >
              <div
                className="h-full p-7 rounded-2xl bg-[#091510]/60 border border-emerald-500/15 hover:border-emerald-400/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <span className="text-xs font-mono text-emerald-400/70 font-medium block mb-3">
                    {principle.number}
                  </span>
                  <h3 className="font-display font-medium text-[18px] text-white mb-1.5 group-hover:text-emerald-300 transition-colors">
                    {principle.title}
                  </h3>
                  <h4 className="text-xs font-mono text-emerald-400/90 mb-3 font-medium">
                    {principle.headline}
                  </h4>
                  <p className="text-[14px] text-gray-300 leading-[1.65] font-normal">
                    {principle.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}

          {/* 6th Complementary Box: Studio Guarantee */}
          <ScrollReveal delay={0.3} yOffset={18} duration={0.5}>
            <div className="h-full p-7 rounded-2xl bg-gradient-to-br from-[#0c2419] to-[#07130e] border border-emerald-400/35 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-emerald-300 font-medium block mb-3">
                  COMMITMENT
                </span>
                <h3 className="font-display font-medium text-[18px] text-white mb-1.5">
                  100% CODE OWNERSHIP
                </h3>
                <h4 className="text-xs font-mono text-emerald-300/90 mb-3 font-medium">
                  No vendor lock-in or proprietary traps.
                </h4>
                <p className="text-[14px] text-gray-200 leading-[1.65] font-normal">
                  You retain complete, unrestricted intellectual property rights to all source code, databases, design tokens, and deploy pipelines upon completion.
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-emerald-500/20 text-xs font-mono text-emerald-400 font-normal">
                Clean Git Repositories · Documented Architecture
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
