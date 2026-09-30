import React from 'react';
import { ArrowLeft, ExternalLink, Github, CheckCircle2, Layers, Cpu, Award } from 'lucide-react';
import { usePublicContent } from '../context/PublicContentContext';
import { NavigationTab } from '../types';

interface ProjectDetailPageProps {
  slug: string;
  onNavigate: (tab: NavigationTab) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug, onNavigate }) => {
  const { projects, loading } = usePublicContent();

  const project = projects.find((p) => p.slug === slug || p.id === slug);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 animate-pulse flex items-center justify-center font-display font-bold text-sm text-[#050807]">
            K
          </div>
          <span className="text-xs font-mono text-emerald-400/80">Loading project case study...</span>
        </div>
      </div>
    );
  }

  // Proper 404 state when project doesn't exist
  if (!project) {
    return (
      <div className="min-h-[70vh] pt-36 pb-24 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-widest text-emerald-400/80 mb-3 block">
          404 · Project Not Found
        </span>
        <h1 className="font-display font-medium text-3xl sm:text-4xl text-white mb-4">
          This project does not exist or is unpublished.
        </h1>
        <p className="text-gray-400 text-sm max-w-md mb-8">
          The requested case study could not be located in our production database records.
        </p>
        <button
          onClick={() => onNavigate('projects')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wider uppercase transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Projects Archive</span>
        </button>
      </div>
    );
  }

  const metrics = project.metrics || [];
  const gallery = project.galleryImages || [project.coverImage];

  return (
    <div className="pt-32 pb-32 max-w-6xl mx-auto px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('projects')}
        className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-emerald-400 transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        <span>Return to All Projects</span>
      </button>

      {/* Case Study Header */}
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            {project.category || 'Production System'}
          </span>
          <span className="text-xs text-gray-500">·</span>
          <span className="font-mono text-xs text-gray-400">{project.year || '2026'}</span>
          <span className="text-xs text-gray-500">·</span>
          <span className="text-xs text-gray-400">{project.client || 'Client Confidential'}</span>
        </div>

        <h1 className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight">
          {project.name}
        </h1>

        {project.tagline && (
          <p className="text-base sm:text-lg text-emerald-400/90 font-normal">
            {project.tagline}
          </p>
        )}
      </div>

      {/* Cover Image & Key Links */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#091510] mb-12 shadow-2xl">
        <img
          src={project.coverImage}
          alt={project.name}
          className="w-full aspect-[16/9] object-cover"
        />
        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#050807] via-[#050807]/80 to-transparent flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {project.technologies?.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono px-3 py-1 rounded-lg bg-black/60 border border-white/15 text-gray-200 backdrop-blur-md"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] text-xs font-medium transition-colors"
              >
                <span>Live Experience</span>
                <ExternalLink size={13} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-colors"
              >
                <span>Repository</span>
                <Github size={13} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* High-Impact Metrics */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#07130e] border border-emerald-500/20 flex flex-col justify-center"
            >
              <span className="font-display font-medium text-2xl sm:text-3xl text-emerald-400 mb-1">
                {m.value}
              </span>
              <span className="text-xs text-gray-400 font-normal">{m.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Case Study Deep Dive: Challenge, Architecture & Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 flex flex-col gap-10">
          {/* Executive Overview */}
          <section className="p-8 rounded-2xl bg-[#07130e]/80 border border-white/[0.08]">
            <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
              <Layers size={14} />
              <span>Project Scope &amp; Architecture</span>
            </h2>
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line">
              {project.description || (project as any).shortDescription}
            </p>
          </section>

          {/* Detailed Challenge */}
          {project.caseStudy?.challenge && (
            <section className="p-8 rounded-2xl bg-[#07130e]/80 border border-white/[0.08]">
              <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                <Cpu size={14} />
                <span>The Architectural Challenge</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
                {project.caseStudy.challenge}
              </p>
            </section>
          )}

          {/* Architecture & Solution */}
          {project.caseStudy?.architecture && (
            <section className="p-8 rounded-2xl bg-[#07130e]/80 border border-white/[0.08]">
              <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>System Engineering &amp; Solution</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
                {project.caseStudy.architecture}
              </p>
            </section>
          )}

          {/* Measured Outcome */}
          {project.caseStudy?.result && (
            <section className="p-8 rounded-2xl bg-[#07130e]/80 border border-emerald-500/20">
              <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                <Award size={14} />
                <span>Production Benchmark &amp; Outcome</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
                {project.caseStudy.result}
              </p>
            </section>
          )}
        </div>

        {/* Sidebar Specifications */}
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-[#081510] border border-white/[0.08] flex flex-col gap-4">
            <h3 className="font-display font-medium text-sm text-white">Project Meta</h3>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between py-2 border-b border-white/[0.06]">
                <span className="text-gray-500 font-mono">Category</span>
                <span className="text-gray-200 font-medium">{project.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.06]">
                <span className="text-gray-500 font-mono">Client</span>
                <span className="text-gray-200 font-medium">{project.client}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.06]">
                <span className="text-gray-500 font-mono">Release Year</span>
                <span className="text-gray-200 font-medium">{project.year}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.06]">
                <span className="text-gray-500 font-mono">Scope</span>
                <span className="text-gray-200 font-medium text-right">{project.scope}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#092015] to-[#06140d] border border-emerald-500/30 flex flex-col gap-4">
            <h3 className="font-display font-medium text-sm text-white">Need a Similar System?</h3>
            <p className="text-xs text-gray-300 leading-relaxed font-normal">
              Direct engineering partnership for custom platforms and high-scale software applications.
            </p>
            <button
              onClick={() => onNavigate('start')}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide uppercase transition-colors cursor-pointer"
            >
              Start a Project
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Screenshots */}
      {gallery.length > 1 && (
        <div>
          <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-6 block">
            Interface Gallery &amp; Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gallery.map((imgUrl, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-white/10 bg-[#07130e]"
              >
                <img
                  src={imgUrl}
                  alt={`${project.name} gallery ${i + 1}`}
                  className="w-full aspect-[16/10] object-cover hover:scale-102 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
