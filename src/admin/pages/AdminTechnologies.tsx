import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Cpu, Check, X, Search } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { CmsTechnology } from '../types/admin';

export const AdminTechnologies: React.FC = () => {
  const { showToast } = useAdmin();

  const [technologies, setTechnologies] = useState<CmsTechnology[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Partial<CmsTechnology> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CmsTechnology | null>(null);

  const fetchTech = async () => {
    try {
      const res = await adminApi.getTechnologies();
      if (res && res.success) {
        setTechnologies(res.technologies);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch technologies', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTech();
  }, []);

  const handleOpenAdd = () => {
    setEditingTech({
      name: '',
      category: 'Frontend',
      description: '',
      websiteUrl: '',
      active: true,
      order: technologies.length + 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (tech: CmsTechnology) => {
    setEditingTech({ ...tech });
    setModalOpen(true);
  };

  const handleToggleActive = async (tech: CmsTechnology) => {
    try {
      await adminApi.updateTechnology(tech.id, { active: !tech.active });
      showToast(`Technology ${tech.name} ${!tech.active ? 'enabled' : 'hidden'}`, 'success');
      fetchTech();
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTech || !editingTech.name) return;

    try {
      if (editingTech.id) {
        await adminApi.updateTechnology(editingTech.id, editingTech);
        showToast(`Updated ${editingTech.name}`, 'success');
      } else {
        await adminApi.createTechnology(editingTech);
        showToast(`Added ${editingTech.name}`, 'success');
      }
      setModalOpen(false);
      fetchTech();
    } catch (err: any) {
      showToast(err.message || 'Failed to save technology', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteTechnology(deleteTarget.id);
      showToast(`Deleted ${deleteTarget.name}`, 'info');
      setDeleteTarget(null);
      fetchTech();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete technology', 'error');
    }
  };

  const filteredTech = technologies.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'all' || t.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex flex-col gap-6">
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Technology"
        message={`Delete ${deleteTarget?.name}? It will be removed from the public website marquee.`}
        confirmText="Delete"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Tools I Build With
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Technology Stack CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Controls the interactive marquee and technical capabilities displayed on the public website.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Add Technology</span>
        </button>
      </div>

      {/* Search + Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search technologies by name or purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#08130f] border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#081510] border border-white/10 w-fit overflow-x-auto">
          {['all', 'Frontend', 'Backend', 'Database', 'Mobile', 'DevOps & Tooling'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === cat ? 'bg-emerald-500 text-[#050807] font-medium' : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tech Cards Grid */}
      {filteredTech.length === 0 ? (
        <EmptyState
          icon={Cpu}
          title="No technologies found"
          description="Add technologies like React, Node.js, or PostgreSQL to display in your technical stack."
          actionText="Add Technology"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTech.map((tech) => (
            <div
              key={tech.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                tech.active
                  ? 'bg-[#08130f] border-emerald-500/20 hover:border-emerald-500/40'
                  : 'bg-[#050b08] border-white/5 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase text-emerald-400/80 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {tech.category}
                  </span>
                  <button
                    onClick={() => handleToggleActive(tech)}
                    className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                      tech.active ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}
                    title="Toggle Public Marquee Visibility"
                  >
                    <span
                      className={`absolute top-0.5 w-3 h-3 rounded-full bg-[#050807] transition-transform ${
                        tech.active ? 'left-3.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                <h3 className="font-display font-medium text-sm text-white mb-1">
                  {tech.name}
                </h3>
                <p className="text-xs text-gray-400 leading-snug font-normal line-clamp-2">
                  {tech.description}
                </p>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => handleOpenEdit(tech)}
                  className="p-1 rounded-lg text-emerald-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => setDeleteTarget(tech)}
                  className="p-1 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && editingTech && (
        <div
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-[#08130f] border border-emerald-500/25 p-6 shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-medium text-lg text-white mb-4">
              {editingTech.id ? 'Edit Technology' : 'Add Technology'}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Technology Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingTech.name || ''}
                  onChange={(e) => setEditingTech({ ...editingTech, name: e.target.value })}
                  placeholder="e.g. Next.js / GraphQL"
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Category
                </label>
                <select
                  value={editingTech.category || 'Frontend'}
                  onChange={(e) => setEditingTech({ ...editingTech, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none font-mono"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Database">Database</option>
                  <option value="DevOps & Tooling">DevOps &amp; Tooling</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Brief Technical Description
                </label>
                <textarea
                  rows={2}
                  value={editingTech.description || ''}
                  onChange={(e) => setEditingTech({ ...editingTech, description: e.target.value })}
                  placeholder="e.g. Strict type safety and predictable interfaces..."
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                />
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
                  Save Technology
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
