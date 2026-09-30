import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Copy, Check, X, Wrench, Search, Eye, AlertCircle } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { CmsService } from '../types/admin';

export const AdminServices: React.FC = () => {
  const { showToast, onOpenPublicPreview } = useAdmin();

  const [services, setServices] = useState<CmsService[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal / Editor State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<CmsService> | null>(null);
  const [deliverablesInput, setDeliverablesInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<CmsService | null>(null);

  const fetchServices = async () => {
    try {
      const res = await adminApi.getServices();
      if (res && res.success) {
        setServices(res.services);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService({
      title: '',
      slug: '',
      tagline: '',
      description: '',
      highlight: 'Standard Scope',
      status: 'published',
      featured: true,
      deliverables: ['Custom Architecture', 'Responsive UI Implementation'],
      technologies: ['React', 'TypeScript', 'Tailwind CSS']
    });
    setDeliverablesInput('Custom Architecture\nResponsive UI Implementation');
    setTechInput('React, TypeScript, Tailwind CSS');
    setEditorOpen(true);
  };

  const handleOpenEdit = (service: CmsService) => {
    setEditingService({ ...service });
    setDeliverablesInput(service.deliverables.join('\n'));
    setTechInput(service.technologies.join(', '));
    setEditorOpen(true);
  };

  const handleDuplicate = async (service: CmsService) => {
    try {
      const duplicate: Partial<CmsService> = {
        ...service,
        id: `srv_${Date.now()}`,
        title: `${service.title} (Copy)`,
        slug: `${service.slug}-copy`,
        status: 'draft'
      };
      await adminApi.createService(duplicate);
      showToast(`Duplicated ${service.title}`, 'info');
      fetchServices();
    } catch (err: any) {
      showToast(err.message || 'Duplicate failed', 'error');
    }
  };

  const handleTogglePublish = async (service: CmsService) => {
    const nextStatus = service.status === 'published' ? 'draft' : 'published';
    try {
      await adminApi.updateService(service.id, { status: nextStatus });
      showToast(`Service "${service.title}" is now ${nextStatus}`, 'success');
      fetchServices();
    } catch (err: any) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;
    setSaving(true);

    const parsedDeliverables = deliverablesInput
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const parsedTech = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Partial<CmsService> = {
      ...editingService,
      deliverables: parsedDeliverables,
      technologies: parsedTech,
      slug: editingService.slug || editingService.title.toLowerCase().replace(/\s+/g, '-')
    };

    try {
      if (editingService.id) {
        await adminApi.updateService(editingService.id, payload);
        showToast(`Updated service "${editingService.title}"`, 'success');
      } else {
        await adminApi.createService(payload);
        showToast(`Created service "${editingService.title}"`, 'success');
      }
      setEditorOpen(false);
      fetchServices();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteService(deleteTarget.id);
      showToast(`Deleted service "${deleteTarget.title}"`, 'info');
      setDeleteTarget(null);
      fetchServices();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const filteredServices = services.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Confirm Delete Dialog */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Service"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This will remove it from the public website.`}
        confirmText="Delete Service"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Core Service Offerings
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Services Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Full-stack engineering capabilities displayed under "WHAT I BUILD" on the public site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenPublicPreview('services')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 transition-colors cursor-pointer"
          >
            <Eye size={13} />
            <span>Public Services Page</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search + Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search services by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#08130f] border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#081510] border border-white/10 w-fit">
          {['all', 'published', 'draft'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                filterStatus === st ? 'bg-emerald-500 text-[#050807] font-medium' : 'text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Services List / Table */}
      {filteredServices.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No services found"
          description="Create a new service tier or clear your active search filters to view existing offerings."
          actionText="Add Service"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="p-5 rounded-2xl bg-[#08130f] border border-emerald-500/15 hover:border-emerald-500/35 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4 min-w-0">
                <span className="font-mono text-xs font-medium text-emerald-400 py-1 px-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/25 shrink-0">
                  {service.number}
                </span>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="font-display font-medium text-base text-white group-hover:text-emerald-300 transition-colors truncate">
                      {service.title}
                    </h2>
                    <StatusBadge status={service.status} size="sm" />
                    {service.highlight && (
                      <span className="text-[10px] font-mono text-emerald-400/80 bg-white/[0.03] px-2 py-0.5 rounded">
                        {service.highlight}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate max-w-xl font-normal">
                    {service.tagline || service.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {service.technologies.slice(0, 4).map((t) => (
                      <span key={t} className="text-[10px] font-mono text-gray-400 bg-[#050b08] px-2 py-0.5 rounded border border-white/[0.04]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <button
                  onClick={() => handleTogglePublish(service)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                    service.status === 'published'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-500/30 hover:bg-amber-900/60'
                  }`}
                  title="Toggle Live Publish"
                >
                  {service.status === 'published' ? 'Published' : 'Draft'}
                </button>
                <button
                  onClick={() => handleDuplicate(service)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] transition-colors cursor-pointer"
                  title="Duplicate Service"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="p-2 rounded-xl text-emerald-400 hover:text-emerald-300 bg-white/[0.03] hover:bg-white/[0.08] transition-colors cursor-pointer"
                  title="Edit Service"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(service)}
                  className="p-2 rounded-xl text-red-400 hover:text-red-300 bg-white/[0.03] hover:bg-red-950/40 transition-colors cursor-pointer"
                  title="Delete Service"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Editor Drawer / Modal */}
      {editorOpen && editingService && (
        <div
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setEditorOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#08130f] border border-emerald-500/25 p-6 sm:p-8 flex flex-col shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-medium">
                  {editingService.id ? 'Edit Offering' : 'New Service'}
                </span>
                <h2 className="font-display font-medium text-lg text-white">
                  {editingService.title || 'Untitled Service'}
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
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g. WEB APPLICATION DEVELOPMENT"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={editingService.slug || ''}
                    onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                    placeholder="web-applications"
                    className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                    Badge / Highlight Text
                  </label>
                  <input
                    type="text"
                    value={editingService.highlight || ''}
                    onChange={(e) => setEditingService({ ...editingService, highlight: e.target.value })}
                    placeholder="e.g. Core Discipline"
                    className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Tagline / Short Summary
                </label>
                <input
                  type="text"
                  value={editingService.tagline || ''}
                  onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                  placeholder="e.g. Complex browser-based systems with desktop-class responsiveness."
                  className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Full Detailed Description
                </label>
                <textarea
                  rows={4}
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  placeholder="Explain your approach, architecture, and value for the client..."
                  className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs leading-relaxed outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Deliverables Checklist (One per line)
                </label>
                <textarea
                  rows={3}
                  value={deliverablesInput}
                  onChange={(e) => setDeliverablesInput(e.target.value)}
                  placeholder="Single Page Applications (SPA)&#10;Role-Based Access & Authentication&#10;Real-time WebSocket Feeds"
                  className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                  className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                    Publish Status
                  </label>
                  <select
                    value={editingService.status || 'published'}
                    onChange={(e) => setEditingService({ ...editingService, status: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none font-mono"
                  >
                    <option value="published">Published (Visible Publicly)</option>
                    <option value="draft">Draft (Admin Only)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="featured-service"
                    checked={editingService.featured ?? true}
                    onChange={(e) => setEditingService({ ...editingService, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="featured-service" className="text-xs text-gray-300 cursor-pointer font-normal">
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
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
