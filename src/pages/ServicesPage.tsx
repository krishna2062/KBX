import React from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { servicesData as fallbackServices } from '../data/services';
import { NavigationTab } from '../types';
import { usePublicContent } from '../context/PublicContentContext';

interface ServicesPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { services: liveServices } = usePublicContent();
  const allServices = liveServices && liveServices.length > 0 ? liveServices : fallbackServices;

  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-2.5 block font-medium">
          Full Scope &amp; Architecture
        </span>
        <h1 className="font-display font-medium text-[32px] sm:text-[42px] lg:text-[48px] text-white tracking-tight mb-3">
          ENGINEERING <span className="font-semibold text-emerald-400">SERVICES</span>
        </h1>
        <p className="text-[15px] sm:text-[17px] text-gray-300 max-w-xl leading-[1.68] font-normal">
          Full-stack capabilities tailored for businesses requiring dependable, custom-crafted digital products rather than off-the-shelf templates.
        </p>
      </div>

      {/* Services Detailed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {allServices.map((service: any) => (
          <div
            key={service.id}
            className="p-8 rounded-2xl bg-[#08130e]/80 border border-emerald-500/15 hover:border-emerald-400/40 transition-all duration-300 flex flex-col justify-between group shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                <span className="font-mono text-xs font-medium text-emerald-400">
                  {service.number}
                </span>
                {service.highlight && (
                  <span className="text-[11px] font-mono text-emerald-400/70 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-normal">
                    {service.highlight}
                  </span>
                )}
              </div>

              <h2 className="font-display font-medium text-[22px] sm:text-[24px] text-white mb-2 group-hover:text-emerald-300 transition-colors tracking-tight">
                {service.title}
              </h2>

              <p className="text-xs font-mono text-emerald-400/90 mb-3 font-normal">
                {service.tagline}
              </p>

              <p className="text-[14px] text-gray-300 leading-[1.68] mb-6 font-normal">
                {service.description}
              </p>

              {service.deliverables && service.deliverables.length > 0 && (
                <div className="mb-6">
                  <span className="text-xs font-mono uppercase text-emerald-400 font-medium block mb-2">
                    Standard Deliverables:
                  </span>
                  <ul className="flex flex-col gap-2">
                    {service.deliverables.map((del: string, dIdx: number) => (
                      <li key={dIdx} className="flex items-center gap-2 text-xs text-gray-300 font-normal">
                        <Check size={13} className="text-emerald-400 shrink-0" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              {service.technologies && service.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.08] mb-6">
                  {service.technologies.map((tech: string) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono text-gray-400 bg-white/[0.03] px-2 py-0.5 rounded font-normal"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => onNavigate('start')}
                className="w-full py-3 px-4 rounded-xl bg-white/[0.03] hover:bg-emerald-500 text-gray-300 hover:text-[#050807] border border-white/10 hover:border-emerald-500 font-medium text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Initiate Service Request</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
