import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, User, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { MediaPickerModal } from '../components/MediaPickerModal';
import { AboutContent, ExperienceItem } from '../types/admin';

export const AdminAbout: React.FC = () => {
  const { showToast, onOpenPublicPreview } = useAdmin();

  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Experience edit modal state
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Partial<ExperienceItem> | null>(null);

  useEffect(() => {
    adminApi.getAllData().then((res) => {
      if (res && res.success && res.data) {
        setAbout(res.data.about);
      }
      setLoading(false);
    });
  }, []);

  const handleSaveAbout = async () => {
    if (!about) return;
    setSaving(true);
    try {
      await adminApi.updateAbout(about);
      showToast('About section published successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save about details', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddExperience = () => {
    setEditingExp({
      id: `exp_${Date.now()}`,
      title: '',
      organization: '',
      period: '2024 — Present',
      description: '',
      current: true,
      order: (about?.experiences?.length || 0) + 1
    });
    setExpModalOpen(true);
  };

  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.title || !about) return;

    const currentExps = [...(about.experiences || [])];
    const existingIndex = currentExps.findIndex((ex) => ex.id === editingExp.id);

    if (existingIndex >= 0) {
      currentExps[existingIndex] = editingExp as ExperienceItem;
    } else {
      currentExps.push(editingExp as ExperienceItem);
    }

    setAbout({ ...about, experiences: currentExps });
    setExpModalOpen(false);
    showToast('Experience entry saved', 'info');
  };

  const handleDeleteExperience = (id: string) => {
    if (!about) return;
    setAbout({
      ...about,
      experiences: about.experiences.filter((ex) => ex.id !== id)
    });
    showToast('Experience entry removed', 'info');
  };

  if (loading || !about) {
    return (
      <div className="py-24 text-center text-xs font-mono text-gray-400">
        Loading about content...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setAbout({ ...about, portraitImage: url })}
        title="Select About Portrait"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Founder Identity &amp; Bio
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            About Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Controls "THE PERSON BEHIND THE PRODUCT" and the dedicated public About page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenPublicPreview('about')}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 transition-colors cursor-pointer"
          >
            Preview About Page
          </button>
          <button
            onClick={handleSaveAbout}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Biographies & Philosophy */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col gap-5">
            <h2 className="font-display font-medium text-base text-white">
              Biography &amp; Positioning Narrative
            </h2>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                Primary Bio Introduction
              </label>
              <textarea
                rows={4}
                value={about.biographyIntro}
                onChange={(e) => setAbout({ ...about, biographyIntro: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs leading-relaxed outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                Detailed Biography &amp; Technical Stance
              </label>
              <textarea
                rows={4}
                value={about.biographyDetail}
                onChange={(e) => setAbout({ ...about, biographyDetail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs leading-relaxed outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                Development Philosophy Statement
              </label>
              <textarea
                rows={3}
                value={about.philosophy}
                onChange={(e) => setAbout({ ...about, philosophy: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs leading-relaxed outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Experience Timeline Entries */}
          <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h2 className="font-display font-medium text-base text-white">
                  Career Experience Entries
                </h2>
                <p className="text-xs text-gray-400 font-normal">
                  Displayed on the dedicated public About page
                </p>
              </div>
              <button
                onClick={handleAddExperience}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-[#050807] text-xs font-mono transition-colors cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Experience</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {(about.experiences || []).map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl bg-[#050b08] border border-white/[0.06] flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-white truncate">
                      {exp.title} · <span className="text-emerald-400">{exp.organization}</span>
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      {exp.period}
                    </span>
                    <p className="text-xs text-gray-400 truncate max-w-md mt-1 font-normal">
                      {exp.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setEditingExp(exp);
                        setExpModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-emerald-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Portrait & Live Preview Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col gap-4">
            <h2 className="font-display font-medium text-base text-white">
              Studio Portrait Image
            </h2>

            <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-[#050b08] border border-emerald-500/25">
              <img
                src={about.portraitImage}
                alt="Portrait"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={about.portraitImage}
                onChange={(e) => setAbout({ ...about, portraitImage: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs font-mono outline-none"
              />
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#091a12] border border-emerald-500/30 text-emerald-300 text-xs font-mono hover:bg-[#0c2419] transition-colors cursor-pointer shrink-0"
              >
                Change Image
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Edit Modal */}
      {expModalOpen && editingExp && (
        <div
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setExpModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-[#08130f] border border-emerald-500/25 p-6 shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-medium text-lg text-white mb-4">
              Career Experience Entry
            </h3>

            <form onSubmit={handleSaveExperience} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Title / Role *
                </label>
                <input
                  type="text"
                  required
                  value={editingExp.title || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, title: e.target.value })}
                  placeholder="e.g. Principal Software Architect"
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={editingExp.organization || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, organization: e.target.value })}
                  placeholder="e.g. KBX Digital Studio"
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Period / Timeline
                </label>
                <input
                  type="text"
                  value={editingExp.period || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                  placeholder="2023 — Present"
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Summary Description
                </label>
                <textarea
                  rows={3}
                  value={editingExp.description || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  placeholder="Explain your key accomplishments and technical scope..."
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setExpModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs font-mono transition-colors cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
