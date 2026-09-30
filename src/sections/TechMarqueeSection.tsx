import React from 'react';
import { usePublicContent } from '../context/PublicContentContext';

export const TechMarqueeSection: React.FC = () => {
  const { technologies } = usePublicContent();
  // Duplicate for seamless infinite loop
  const marqueeItems = [...technologies, ...technologies];

  return (
    <section className="relative py-24 border-t border-emerald-950/40 overflow-hidden bg-[#040806]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-2.5 block font-medium">
              Core Technical Stack
            </span>
            <h2 className="font-display font-medium text-[28px] sm:text-[36px] text-white tracking-tight">
              TOOLS I <span className="font-semibold text-emerald-400">BUILD WITH</span>
            </h2>
          </div>
          <p className="text-xs sm:text-[13px] text-gray-400 font-mono font-normal">
            Tested in production · Zero vanity dependencies
          </p>
        </div>
      </div>

      {/* Infinite Horizontal Running Marquee */}
      <div className="relative w-full overflow-hidden flex items-center select-none py-4">
        {/* Left & Right Edge Fade Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-[#040806] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-[#040806] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 sm:gap-6 animate-marquee whitespace-nowrap will-change-transform">
          {marqueeItems.map((tech, idx) => (
            <div
              key={`${tech.name}-${idx}`}
              className="group inline-flex items-center gap-3 px-5 py-3 rounded-full bg-[#081510]/80 border border-emerald-500/15 hover:border-emerald-400/50 hover:bg-[#0c1e17] transition-all duration-200 cursor-default shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400/70 group-hover:bg-emerald-300 transition-colors" />
              <span className="font-display font-medium text-[14px] sm:text-[15px] text-gray-200 group-hover:text-white transition-colors">
                {tech.name}
              </span>
              <span className="text-[11px] font-mono text-emerald-400/60 uppercase">
                {tech.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tailwind marquee animation style injected */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};
