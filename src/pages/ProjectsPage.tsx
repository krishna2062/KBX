import React, { useState } from 'react';
import { ArrowUpRight, X, ExternalLink, Github } from 'lucide-react';
import { NavigationTab } from '../types';
import { usePublicContent } from '../context/PublicContentContext';
import { projectsData as fallbackProjects } from '../data/projects';

interface ProjectsPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const { projects: liveProjects } = usePublicContent();
  const allProjects = liveProjects && liveProjects.length > 0 ? liveProjects : fallbackProjects;

  const [filter, setFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Extract unique categories dynamically or use standard filters
  const categories = [
    { label: 'All Projects', value: 'all' },
    { label: 'Real-Time & WebRTC', value: 'real-time' },
    { label: 'SaaS & Automation', value: 'saas' },
    { label: 'Mobile & Native', value: 'mobile' }
  ];

  const filteredProjects = allProjects.filter((p: any) => {
    if (filter === 'all') return true;
    if (filter === 'real-time') return p.technologies?.some((t: string) => t.toLowerCase().includes('webrtc') || t.toLowerCase().includes('socket'));
    if (filter === 'saas') return p.technologies?.some((t: string) => t.toLowerCase().includes('bullmq') || t.toLowerCase().includes('stripe') || t.toLowerCase().includes('saas')) || p.category?.toLowerCase().includes('saas');
    if (filter === 'mobile') return p.technologies?.some((t: string) => t.toLowerCase().includes('flutter') || t.toLowerCase().includes('react native') || t.toLowerCase().includes('mobile')) || p.category?.toLowerCase().includes('mobile');
    return true;
  });

  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-2.5 block font-medium">
            Archive &amp; Production Deployments
          </span>
          <h1 className="font-display font-medium text-[32px] sm:text-[42px] lg:text-[48px] text-white tracking-tight">
            SELECTED <span className="font-semibold text-emerald-400">PROJECTS</span>
          </h1>
        </div>
        <p className="text-[15px] sm:text-[17px] text-gray-300 max-w-md font-normal leading-[1.68]">
          Production digital products engineered for real businesses. Every project is built from ground zero without generic templates.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#081510] border border-white/10 rounded-2xl w-fit mb-12 overflow-x-auto max-w-full">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-4 py-2 text-xs font-normal rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filter === cat.value
                ? 'bg-emerald-500 text-[#050807] font-medium shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project: any) => {
          const cover = project.coverImage || project.image;
          return (
            <div
              key={project.id}
              onClick={() => {
                if (project.slug) {
                  window.location.hash = `projects/${project.slug}`;
                } else {
                  setSelectedProject(project);
                }
              }}
              className="group rounded-2xl bg-[#08130e]/80 border border-emerald-500/15 hover:border-emerald-400/50 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
            >
              <div>
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 bg-[#050b08] border border-white/10">
                  <img
                    src={cover}
                    alt={project.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050807]/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-3 left-3 text-[10px] font-mono uppercase bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-emerald-400 border border-emerald-500/30 font-medium">
                    {project.year}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1 font-normal">
                  <span>{project.category}</span>
                </div>

                <h2 className="font-display font-medium text-[22px] sm:text-[24px] text-white mb-2 group-hover:text-emerald-300 transition-colors tracking-tight">
                  {project.name}
                </h2>

                <p className="text-[13px] text-gray-300 line-clamp-3 mb-4 leading-relaxed font-normal">
                  {project.tagline || project.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.08] mb-4">
                  {(project.technologies || []).slice(0, 4).map((tech: string) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono text-gray-400 bg-white/[0.03] px-2 py-0.5 rounded font-normal"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs font-mono font-medium text-emerald-400 group-hover:text-emerald-300">
                  <span>Explore Full Case Study</span>
                  <ArrowUpRight
                    size={14}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Case Study Modal Detail */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#08120e] border border-emerald-500/30 p-6 sm:p-8 text-left shadow-[0_25px_80px_rgba(0,0,0,0.8)] animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.06] hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Case Study"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 text-xs font-mono text-emerald-400 mb-2 font-normal">
              <span>PROJECT {selectedProject.number || '01'}</span>
              <span>·</span>
              <span>{selectedProject.year}</span>
              <span>·</span>
              <span>{selectedProject.category}</span>
            </div>

            <h3 className="font-display font-medium text-2xl sm:text-3xl text-white mb-2 tracking-tight">
              {selectedProject.name}
            </h3>

            <p className="text-[14px] text-gray-300 mb-6 leading-relaxed font-normal">
              {selectedProject.tagline || selectedProject.description}
            </p>

            <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-8 border border-white/10">
              <img
                src={selectedProject.coverImage || selectedProject.image}
                alt={selectedProject.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {selectedProject.metrics && selectedProject.metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#050b08] border border-emerald-500/20 mb-8">
                {selectedProject.metrics.map((metric: any, idx: number) => (
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
            )}

            {selectedProject.caseStudy && (
              <div className="flex flex-col gap-6 text-sm text-gray-300 mb-8">
                {selectedProject.caseStudy.challenge && (
                  <div>
                    <h4 className="font-display font-medium text-base text-white mb-2">The Business Challenge</h4>
                    <p className="leading-relaxed bg-white/[0.02] p-4 rounded-lg border border-white/[0.04]">
                      {selectedProject.caseStudy.challenge}
                    </p>
                  </div>
                )}

                {selectedProject.caseStudy.architecture && (
                  <div>
                    <h4 className="font-display font-medium text-base text-white mb-2">Architectural Solution</h4>
                    <p className="leading-relaxed bg-white/[0.02] p-4 rounded-lg border border-white/[0.04]">
                      {selectedProject.caseStudy.architecture}
                    </p>
                  </div>
                )}

                {selectedProject.caseStudy.result && (
                  <div>
                    <h4 className="font-display font-medium text-base text-white mb-2">Outcome &amp; Production Impact</h4>
                    <p className="leading-relaxed bg-white/[0.02] p-4 rounded-lg border border-white/[0.04]">
                      {selectedProject.caseStudy.result}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
              <div className="flex items-center gap-3">
                {selectedProject.client && (
                  <span className="text-xs font-mono text-gray-400">
                    Client: {selectedProject.client}
                  </span>
                )}
                {selectedProject.projectUrl && (
                  <a
                    href={selectedProject.projectUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:underline"
                  >
                    <span>Live URL</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white"
                  >
                    <Github size={13} />
                    <span>Source</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedProject(null);
                  onNavigate('start');
                }}
                className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Inquire For Similar Product →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
