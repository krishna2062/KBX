import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { NavigationTab } from '../types';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { usePublicContent } from '../context/PublicContentContext';

interface ServicesSectionProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigate }) => {
  const { services } = usePublicContent();
  const [activeServiceId, setActiveServiceId] = useState<string | null>(services[0]?.id || null);

  // Sync activeServiceId if services update
  React.useEffect(() => {
    if (!activeServiceId && services.length > 0) {
      setActiveServiceId(services[0].id);
    }
  }, [services, activeServiceId]);

  return (
    <section className="relative py-28 border-t border-emerald-950/40 bg-[#060b08]/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal yOffset={20} duration={0.6}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-2.5 block font-medium">
                Capabilities &amp; Scope
              </span>
              <h2 className="font-display font-medium text-[32px] sm:text-[42px] lg:text-[50px] text-white tracking-tight">
                WHAT I <span className="font-semibold text-emerald-400">BUILD</span>
              </h2>
            </div>
            <p className="text-[15px] sm:text-[17px] text-gray-300 max-w-md font-normal leading-[1.68]">
              From modern web flagships to distributed backend clusters. Focused on high architectural standards, sub-second latency, and long-term maintainability.
            </p>
          </div>
        </ScrollReveal>

        {/* Editorial Horizontal Rows */}
        <div className="flex flex-col border-t border-white/[0.08]">
          {services.map((service, index) => {
            const isExpanded = activeServiceId === service.id;

            return (
              <ScrollReveal
                key={service.id}
                delay={index * 0.03}
                yOffset={16}
                duration={0.5}
              >
                <div
                  onMouseEnter={() => setActiveServiceId(service.id)}
                  onClick={() => setActiveServiceId(isExpanded ? null : service.id)}
                  className={`group relative border-b border-white/[0.08] transition-all duration-300 cursor-pointer overflow-hidden ${
                    isExpanded
                      ? 'bg-[#091510]/80 py-7 px-6 sm:px-8 -mx-4 sm:-mx-6 rounded-2xl border-emerald-500/30'
                      : 'py-5 px-2 hover:bg-white/[0.015]'
                  }`}
                >
                {/* Left Green Accent Line when expanded */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600 transition-opacity duration-300 ${
                    isExpanded ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Primary Row Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-6 sm:gap-10">
                    <span
                      className={`font-mono text-xs sm:text-sm transition-colors duration-200 ${
                        isExpanded ? 'text-emerald-400 font-medium' : 'text-gray-500 group-hover:text-emerald-400/80'
                      }`}
                    >
                      {service.number}
                    </span>
                    <h3
                      className={`font-display font-medium text-[20px] sm:text-[26px] lg:text-[32px] tracking-normal transition-colors duration-200 ${
                        isExpanded ? 'text-white font-medium' : 'text-gray-300 group-hover:text-white'
                      }`}
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* Summary / Tagline on Desktop when not expanded */}
                  {!isExpanded && (
                    <p className="hidden lg:block text-[13px] text-gray-400 max-w-sm truncate font-normal">
                      {service.tagline}
                    </p>
                  )}

                  {/* Arrow Indicator */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${
                        isExpanded
                          ? 'bg-emerald-500 text-[#050807] border-emerald-400 rotate-45'
                          : 'border-white/10 text-gray-400 group-hover:border-emerald-500/40 group-hover:text-emerald-400'
                      }`}
                    >
                      <ArrowUpRight size={15} />
                    </div>
                  </div>
                </div>

                {/* Expanded Content Drawer */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-emerald-500/15 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
                    <div className="lg:col-span-7 flex flex-col gap-4">
                      <p className="text-[15px] sm:text-[17px] text-gray-300 leading-[1.7] font-normal">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="text-xs font-mono uppercase text-emerald-400/70 mr-1 font-medium">
                          Stack:
                        </span>
                        {service.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs text-gray-300 font-mono font-normal"
                          >
                            {tech} <span className="text-emerald-500/40 ml-1">/</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-3.5 bg-[#050d09]/80 p-5 rounded-xl border border-emerald-500/20">
                      <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-medium">
                        Key Deliverables
                      </span>
                      <ul className="flex flex-col gap-2">
                        {service.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-300 font-normal">
                            <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {onNavigate && (
                        <div className="pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('start');
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400 hover:text-emerald-300 uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            <span>Request {service.title}</span>
                            <ArrowUpRight size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          );
        })}
        </div>
      </div>
    </section>
  );
};
