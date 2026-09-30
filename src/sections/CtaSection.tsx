import React from 'react';
import { ArrowUpRight, MessageSquareCode } from 'lucide-react';
import { CtaScene3D } from '../components/3d/CtaScene3D';
import { NavigationTab } from '../types';
import { ScrollReveal } from '../components/common/ScrollReveal';

interface CtaSectionProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative py-32 border-t border-emerald-950/50 overflow-hidden bg-[#040806]">
      {/* Background Soft Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.16), rgba(5, 150, 105, 0.03) 60%, transparent 75%)',
          filter: 'blur(45px)'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal yOffset={24} duration={0.65}>
          <div className="relative rounded-3xl bg-gradient-to-b from-[#091611]/90 to-[#050e0a]/90 border border-emerald-500/25 p-8 sm:p-14 lg:p-20 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 flex flex-col items-start z-10">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-3 block font-medium">
                  Collaboration &amp; Partnership
                </span>

                <h2 className="font-display font-medium text-[32px] sm:text-[42px] lg:text-[50px] text-white tracking-tight leading-[1.06] mb-4">
                  HAVE AN IDEA? <br />
                  <span className="font-semibold text-emerald-400 drop-shadow-[0_0_24px_rgba(52,211,153,0.25)]">
                    LET'S BUILD IT.
                  </span>
                </h2>

                <p className="text-[15px] sm:text-[17px] text-gray-300 max-w-lg leading-[1.68] mb-9 font-normal">
                  Tell me what you're trying to build. I'll help turn the idea into a practical, scalable, and high-performance digital product.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => onNavigate('start')}
                    className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all duration-200 shadow-[0_0_24px_rgba(16,185,129,0.3)] hover:shadow-[0_0_36px_rgba(52,211,153,0.5)] cursor-pointer active:scale-95"
                  >
                    <span>Start a Project</span>
                    <ArrowUpRight
                      size={15}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </button>

                  <button
                    onClick={() => onNavigate('contact')}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0d1f17] hover:bg-[#122b20] border border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300 font-medium text-xs tracking-wide transition-all cursor-pointer"
                  >
                    <MessageSquareCode size={15} />
                    <span>Contact Me</span>
                  </button>
                </div>

                <div className="mt-8 flex items-center gap-4 text-xs font-mono text-gray-400 font-normal">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Currently taking Q3/Q4 projects
                  </span>
                  <span>·</span>
                  <span>Response within 24 hours</span>
                </div>
              </div>

              {/* Right 3D Visual Centerpiece */}
              <div className="lg:col-span-5 flex items-center justify-center relative">
                <CtaScene3D />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
