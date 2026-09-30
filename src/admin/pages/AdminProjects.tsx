import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Eye,
  FolderKanban,
  Search,
  Image as ImageIcon,
  Check,
  X
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { MediaPickerModal } from '../components/MediaPickerModal';
import { CmsProject } from '../types/admin';

export const AdminProjects: React.FC = () => {
  const { showToast, onOpenPublicPreview } = useAdmin();

  const [projects, setProjects] = useState<CmsProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Modal / Editor State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<CmsProject> | null>(null);
  const [techInput, setTechInput] = useState('');
  const [metric1Label, setMetric1Label] = useState('Sub-second latency');
  const [metric1Value, setMetric1Value] = useState('< 50ms');
  const [metric2Label, setMetric2Label] = useState('Uptime verification');
  const [metric2Value, setMetric2Value] = useState('99.9%');
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<CmsProject | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await adminApi.getProjects();
      if (res && res.success) {
        setProjects(res.projects);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject({
      name: '',
      slug: '',
      tagline: '',
      category: 'Web Application',
      client: '',
      year: new Date().getFullYear().toString(),
      scope: 'Architecture, Design, Full-Stack Build',
      description: '',
      coverImage: '/src/assets/images/project_nexatalk_1790694609831.png',
      galleryImages: ['/src/assets/images/project_nexatalk_1790694609831.png'],
      projectUrl: '',
      githubUrl: '',
      status: 'published',
      featured: true,
      caseStudy: {
        challenge: '',
        architecture: '',
        result: ''
      }
    });
    setTechInput('React, TypeScript, Node.js, PostgreSQL');
    setMetric1Label('Latency budget');
    setMetric1Value('< 45ms');
    setMetric2Label('Reliability');
    setMetric2Value('99.98%');
    setEditorOpen(true);
  };

  const handleOpenEdit = (project: CmsProject) => {
    setEditingProject({ ...project });
    setTechInput(project.technologies.join(', '));
    if (project.metrics && project.metrics.length > 0) {
      setMetric1Label(project.metrics[0]?.label || '');
      setMetric1Value(project.metrics[0]?.value || '');
      setMetric2Label(project.metrics[1]?.label || '');
      setMetric2Value(project.metrics[1]?.value || '');
    }
    setEditorOpen(true);
  };

  const handleDuplicate = async (project: CmsProject) => {
    try {
      const duplicate: Partial<CmsProject> = {
        ...project,
        id: `proj_${Date.now()}`,
        name: `${project.name} (Copy)`,
        slug: `${project.slug}-copy`,
        status: 'draft'
      };
      await adminApi.createProject(duplicate);
      showToast(`Duplicated project "${project.name}"`, 'info');
      fetchProjects();
    } catch (err: any) {
      showToast(err.message || 'Duplicate failed', 'error');
    }
  };

  const handleTogglePublish = async (project: CmsProject) => {
    const nextStatus = project.status === 'published' ? 'draft' : 'published';
    try {
      await adminApi.updateProject(project.id, { status: nextStatus });
      showToast(`Project "${project.name}" is now ${nextStatus}`, 'success');
      fetchProjects();
    } catch (err: any) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.name) return;
    setSaving(true);

    const parsedTech = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const metrics = [
      { label: metric1Label, value: metric1Value },
      { label: metric2Label, value: metric2Value }
    ].filter((m) => m.label && m.value);

    const payload: Partial<CmsProject> = {
      ...editingProject,
      technologies: parsedTech,
      metrics,
      slug: editingProject.slug || editingProject.name.toLowerCase().replace(/\s+/g, '-')
    };

    try {
      if (editingProject.id) {
        await adminApi.updateProject(editingProject.id, payload);
        showToast(`Updated project "${editingProject.name}"`, 'success');
      } else {
        await adminApi.createProject(payload);
        showToast(`Created project "${editingProject.name}"`, 'success');
      }
      setEditorOpen(false);
      fetchProjects();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteProject(deleteTarget.id);
      showToast(`Deleted project "${deleteTarget.name}"`, 'info');
      setDeleteTarget(null);
      fetchProjects();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'all' || p.category.toLowerCase().includes(filterCategory.toLowerCase());
    return matchSearch && matchCat;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Project Case Study"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? It will no longer be visible in Selected Work.`}
        confirmText="Delete Project"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          if (editingProject) {
            setEditingProject({ ...editingProject, coverImage: url });
          }
        }}
        title="Select Project Cover Mockup"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Portfolio &amp; Production Proof
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Projects &amp; Case Studies
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Architectural case studies shown in "SELECTED WORK" and the public Projects gallery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenPublicPreview('projects')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 transition-colors cursor-pointer"
          >
            <Eye size={13} />
            <span>Public Projects View</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search + Categories */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by name, client, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#08130f] border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#081510] border border-white/10 w-fit overflow-x-auto">
          {['all', 'real-time', 'saas', 'mobile'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === cat ? 'bg-emerald-500 text-[#050807] font-medium' : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Create a project case study to showcase your software development capabilities."
          actionText="Add Project"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-5 rounded-2xl bg-[#08130f] border border-emerald-500/15 hover:border-emerald-500/35 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 bg-[#050b08] border border-white/10">
                  <img
                    src={project.coverImage}
                    alt={project.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-emerald-400 border border-emerald-500/30">
                      {project.year}
                    </span>
                    <StatusBadge status={project.status} size="sm" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400/90 mb-1">
                  <span>{project.category}</span>
                </div>

                <h2 className="font-display font-medium text-lg text-white group-hover:text-emerald-300 transition-colors tracking-tight mb-1">
                  {project.name}
                </h2>

                <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed font-normal">
                  {project.tagline || project.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] font-mono text-gray-400 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.04]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <button
                  onClick={() => handleTogglePublish(project)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    project.status === 'published'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {project.status === 'published' ? 'Published' : 'Draft'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDuplicate(project)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                    title="Duplicate"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(project)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Case Study Editor Drawer / Modal */}
      {editorOpen && editingProject && (
        <div
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setEditorOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#08130f] border border-emerald-500/25 p-6 sm:p-8 flex flex-col shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-medium">
                  {editingProject.id ? 'Edit Case Study' : 'New Project'}
                </span>
                <h2 className="font-display font-medium text-lg text-white">
                  {editingProject.name || 'Untitled Case Study'}
                </h2>
              </div>
              <button
                onClick={() => setEditorOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.name || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    placeholder="e.g. NEXATALK"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-sm outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.category || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    placeholder="e.g. Real-Time Communication Platform"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={editingProject.tagline || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                  placeholder="Ultra-low latency real-time communication platform..."
                  className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                />
              </div>

              {/* Cover Image Selector */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Cover Mockup Image
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={editingProject.coverImage || '/src/assets/images/project_nexatalk_1790694609831.png'}
                    alt="Cover preview"
                    className="w-20 h-12 rounded-lg object-cover border border-white/15 shrink-0"
                  />
                  <input
                    type="text"
                    value={editingProject.coverImage || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#091a12] border border-emerald-500/30 text-emerald-300 text-xs font-mono hover:bg-[#0d251a] transition-colors cursor-pointer shrink-0"
                  >
                    Select Media
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={editingProject.client || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    placeholder="e.g. Nexa Enterprise"
                    className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    value={editingProject.year || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                    Scope
                  </label>
                  <input
                    type="text"
                    value={editingProject.scope || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, scope: e.target.value })}
                    placeholder="Architecture, UI/UX, Build"
                    className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Project Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Overview of the product and its target users..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs leading-relaxed outline-none"
                />
              </div>

              {/* Case Study Breakdown */}
              <div className="p-4 rounded-xl bg-[#050b08] border border-white/[0.06] flex flex-col gap-3">
                <span className="text-xs font-mono uppercase text-emerald-400 font-medium">
                  Detailed Case Study Breakdown
                </span>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">
                    The Business Challenge
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.caseStudy?.challenge || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        caseStudy: {
                          ...(editingProject.caseStudy || { challenge: '', architecture: '', result: '' }),
                          challenge: e.target.value
                        }
                      })
                    }
                    placeholder="What bottleneck did the client face?"
                    className="w-full px-3 py-2 rounded-lg bg-[#08130f] border border-white/10 text-white text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">
                    Architectural Solution
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.caseStudy?.architecture || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        caseStudy: {
                          ...(editingProject.caseStudy || { challenge: '', architecture: '', result: '' }),
                          architecture: e.target.value
                        }
                      })
                    }
                    placeholder="Technical choices, protocols, databases..."
                    className="w-full px-3 py-2 rounded-lg bg-[#08130f] border border-white/10 text-white text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">
                    Outcome &amp; Production Impact
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.caseStudy?.result || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        caseStudy: {
                          ...(editingProject.caseStudy || { challenge: '', architecture: '', result: '' }),
                          result: e.target.value
                        }
                      })
                    }
                    placeholder="Cost reduction, latency improvement, conversion uplift..."
                    className="w-full px-3 py-2 rounded-lg bg-[#08130f] border border-white/10 text-white text-xs outline-none"
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={metric1Label}
                    onChange={(e) => setMetric1Label(e.target.value)}
                    placeholder="Metric 1 Label"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                  />
                  <input
                    type="text"
                    value={metric1Value}
                    onChange={(e) => setMetric1Value(e.target.value)}
                    placeholder="Value"
                    className="w-24 px-3 py-2 rounded-xl bg-[#050b08] border border-emerald-500/30 text-emerald-400 font-mono text-xs outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={metric2Label}
                    onChange={(e) => setMetric2Label(e.target.value)}
                    placeholder="Metric 2 Label"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                  />
                  <input
                    type="text"
                    value={metric2Value}
                    onChange={(e) => setMetric2Value(e.target.value)}
                    placeholder="Value"
                    className="w-24 px-3 py-2 rounded-xl bg-[#050b08] border border-emerald-500/30 text-emerald-400 font-mono text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="React, TypeScript, WebRTC, Redis"
                  className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                    Status
                  </label>
                  <select
                    value={editingProject.status || 'published'}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none font-mono"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="featured-project"
                    checked={editingProject.featured ?? true}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="featured-project" className="text-xs text-gray-300 cursor-pointer font-normal">
                    Featured on Home Page
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08] mt-2">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Case Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
