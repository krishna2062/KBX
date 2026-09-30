import React, { useState } from 'react';
import { ArrowUpRight, X, ExternalLink, Github, Check } from 'lucide-react';
import { NavigationTab } from '../types';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { usePublicContent } from '../context/PublicContentContext';

interface ProjectsSectionProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onNavigate }) => {
  const { projects } = usePublicContent();
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<any | null>(null);

  return (
    <section className="relative py-32 border-t border-emerald-950/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal yOffset={20} duration={0.6}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-2.5 block font-medium">
                Portfolio &amp; Production Proof
              </span>
              <h2 className="font-display font-medium text-[32px] sm:text-[42px] lg:text-[50px] text-white tracking-tight">
                SELECTED <span className="font-semibold text-emerald-400">WORK</span>
              </h2>
            </div>
            <p className="text-[15px] sm:text-[17px] text-gray-300 max-w-md font-normal leading-[1.68]">
              Large-scale applications built with strict latency budgets, reliable data backbones, and refined design systems.
            </p>
          </div>
        </ScrollReveal>

        {/* Large Editorial Project Showcases (Occupying Significant Screen Space) */}
        <div className="flex flex-col gap-24 sm:gap-32">
          {projects.map((project, index) => {
            const projectImg = (project as any).coverImage || (project as any).image;
            return (
            <ScrollReveal
              key={project.id}
              yOffset={28}
              duration={0.65}
              amount={0.12}
            >
              <div
                className="group relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
              >
              {/* Visual Mockup Container (7 cols on desktop) */}
              <div
                className={`lg:col-span-7 relative rounded-2xl overflow-hidden bg-[#07130e] border border-emerald-500/20 group-hover:border-emerald-400/50 transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.6)] ${
                  index % 2 === 1 ? 'lg:order-2' : ''
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={projectImg}
                    alt={`${project.name} interface mockup`}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050807]/90 via-[#050807]/20 to-transparent pointer-events-none" />

                  {/* Floating Metric Preview Strip */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#091510]/85 backdrop-blur-md border border-white/10 flex items-center justify-between gap-2 overflow-x-auto">
                    {project.metrics.slice(0, 3).map((metric, mIdx) => (
                      <div key={mIdx} className="flex flex-col shrink-0">
                        <span className="text-[10px] font-mono uppercase text-gray-400">
                          {metric.label}
                        </span>
                        <span className="text-xs sm:text-sm font-mono font-medium text-emerald-300">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                    <button
                      onClick={() => setSelectedCaseStudy(project)}
                      className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-[#050807] border border-emerald-400/30 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Editorial Info (5 cols on desktop) */}
              <div
                className={`lg:col-span-5 flex flex-col items-start ${
                  index % 2 === 1 ? 'lg:order-1' : ''
                }`}
              >
                <div className="flex items-center gap-3 text-xs font-mono text-emerald-400/80 mb-3">
                  <span className="font-medium">PROJECT {project.number}</span>
                  <span className="text-white/20">/</span>
                  <span className="text-gray-400">{project.year}</span>
                </div>

                <h3 className="font-display font-medium text-[28px] sm:text-[36px] lg:text-[44px] text-white tracking-tight mb-2">
                  {project.name}
                </h3>

                <p className="text-xs sm:text-sm font-mono text-emerald-400/90 mb-4 font-normal">
                  {project.category}
                </p>

                <p className="text-[15px] sm:text-[17px] text-gray-300 leading-[1.68] mb-6 font-normal max-w-lg">
                  {project.description}
                </p>

                {/* Scope & Client */}
                <div className="w-full pb-5 mb-5 border-b border-white/[0.08] flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-mono uppercase">Scope:</span>
                    <span className="text-gray-300 font-normal">{project.scope}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-mono uppercase">Stack:</span>
                    <span className="text-gray-300 font-mono font-normal">
                      {project.technologies.slice(0, 4).join(' · ')}
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedCaseStudy(project)}
                    className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    <span>View Case Study</span>
                    <ArrowUpRight
                      size={14}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </button>
                  <button
                    onClick={() => setSelectedCaseStudy(project)}
                    className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer py-2 px-3 font-normal"
                  >
                    Architecture Notes →
                  </button>
                </div>
              </div>
            </div>
            </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Case Study Modal Detail */}
      {selectedCaseStudy && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedCaseStudy(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#08120e] border border-emerald-500/30 p-6 sm:p-8 text-left shadow-[0_25px_80px_rgba(0,0,0,0.8)] animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCaseStudy(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.06] hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Case Study"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 text-xs font-mono text-emerald-400 mb-2">
              <span>PROJECT {selectedCaseStudy.number}</span>
              <span>·</span>
              <span>{selectedCaseStudy.year}</span>
              <span>·</span>
              <span>{selectedCaseStudy.category}</span>
            </div>

            <h3 className="font-display font-medium text-2xl sm:text-3xl text-white mb-2 tracking-tight">
              {selectedCaseStudy.name}
            </h3>

            <p className="text-[15px] text-gray-300 mb-6 leading-relaxed font-normal">
              {selectedCaseStudy.tagline}
            </p>

            {/* Project Image Preview */}
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-8 border border-white/10">
              <img
                src={selectedCaseStudy.coverImage || selectedCaseStudy.image}
                alt={selectedCaseStudy.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#050b08] border border-emerald-500/20 mb-8">
              {(selectedCaseStudy.metrics || []).map((metric: any, idx: number) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-[10px] font-mono uppercase text-gray-400">
                    {metric.label}
                  </span>
                  <span className="text-base sm:text-lg font-mono font-medium text-emerald-400">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Deep Dive Breakdown */}
            <div className="flex flex-col gap-6 text-sm text-gray-300">
              <div>
                <h4 className="font-display font-medium text-base text-white mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  The Business Challenge
                </h4>
                <p className="leading-[1.68] text-gray-300 bg-white/[0.02] p-4 rounded-lg border border-white/[0.04] font-normal">
                  {selectedCaseStudy.caseStudy.challenge}
                </p>
              </div>

              <div>
                <h4 className="font-display font-medium text-base text-white mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Architectural Solution
                </h4>
                <p className="leading-[1.68] text-gray-300 bg-white/[0.02] p-4 rounded-lg border border-white/[0.04] font-normal">
                  {selectedCaseStudy.caseStudy.architecture}
                </p>
              </div>

              <div>
                <h4 className="font-display font-medium text-base text-white mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Outcome &amp; Production Impact
                </h4>
                <p className="leading-[1.68] text-gray-300 bg-white/[0.02] p-4 rounded-lg border border-white/[0.04] font-normal">
                  {selectedCaseStudy.caseStudy.result}
                </p>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 uppercase">Technologies:</span>
                {(selectedCaseStudy.technologies || []).map((t: string) => (
                  <span
                    key={t}
                    className="text-xs font-mono text-gray-300 bg-white/[0.04] px-2.5 py-1 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {onNavigate && (
                <button
                  onClick={() => {
                    setSelectedCaseStudy(null);
                    onNavigate('start');
                  }}
                  className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Build Similar Product →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
