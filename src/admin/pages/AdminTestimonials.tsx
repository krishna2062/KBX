import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Quote, Star, Eye } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { CmsTestimonial } from '../types/admin';

export const AdminTestimonials: React.FC = () => {
  const { showToast } = useAdmin();

  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<CmsTestimonial> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CmsTestimonial | null>(null);

  const fetchTestimonials = async () => {
    try {
      const res = await adminApi.getTestimonials();
      if (res && res.success) {
        setTestimonials(res.testimonials);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load testimonials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      clientName: '',
      company: '',
      role: 'Executive / Founder',
      content: '',
      rating: 5,
      projectRelationship: 'Full-Stack Web App',
      status: 'published',
      order: testimonials.length + 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: CmsTestimonial) => {
    setEditingItem({ ...item });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.clientName) return;

    try {
      if (editingItem.id) {
        await adminApi.updateTestimonial(editingItem.id, editingItem);
        showToast('Testimonial updated', 'success');
      } else {
        await adminApi.createTestimonial(editingItem);
        showToast('Testimonial created', 'success');
      }
      setModalOpen(false);
      fetchTestimonials();
    } catch (err: any) {
      showToast(err.message || 'Failed to save testimonial', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteTestimonial(deleteTarget.id);
      showToast('Testimonial deleted', 'info');
      setDeleteTarget(null);
      fetchTestimonials();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Testimonial"
        message={`Delete quote from ${deleteTarget?.clientName}?`}
        confirmText="Delete"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Client Verification &amp; Reviews
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Testimonials CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Real customer statements. If no published reviews exist, the public section remains gracefully hidden.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Testimonials List */}
      {testimonials.length === 0 ? (
        <EmptyState
          icon={Quote}
          title="No testimonials yet"
          description="Client testimonials will show here. The public section is currently automatically hidden to prevent fake claims."
          actionText="Add First Testimonial"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="p-5 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-emerald-400">
                    {Array.from({ length: test.rating || 5 }).map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <StatusBadge status={test.status} size="sm" />
                </div>

                <p className="text-xs text-gray-200 leading-relaxed italic mb-4 font-normal">
                  "{test.content}"
                </p>

                <div className="flex flex-col text-xs">
                  <span className="font-medium text-white">{test.clientName}</span>
                  <span className="text-[11px] font-mono text-gray-400">
                    {test.role} · {test.company}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-4 border-t border-white/[0.06]">
                <span className="text-[10px] font-mono text-emerald-400">
                  {test.projectRelationship}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(test)}
                    className="p-1 rounded-lg text-emerald-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(test)}
                    className="p-1 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && editingItem && (
        <div
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-[#08130f] border border-emerald-500/25 p-6 shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-medium text-lg text-white mb-4">
              {editingItem.id ? 'Edit Testimonial' : 'Add Testimonial'}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.clientName || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={editingItem.company || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    placeholder="e.g. Aurora Analytics"
                    className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={editingItem.role || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                  placeholder="e.g. VP of Product Engineering"
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Testimonial Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.content || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Client feedback on delivery speed, architectural reliability, or business impact..."
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={editingItem.status || 'published'}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none font-mono"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Rating (Stars)
                  </label>
                  <select
                    value={editingItem.rating || 5}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none font-mono"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs font-mono transition-colors cursor-pointer"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
