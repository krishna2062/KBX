import React, { useState, useEffect } from 'react';
import { Save, Plus, Edit2, Trash2, GitBranch, Clock, Check, X } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { CmsProcessStep } from '../types/admin';

export const AdminProcess: React.FC = () => {
  const { showToast } = useAdmin();

  const [steps, setSteps] = useState<CmsProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit Step Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Partial<CmsProcessStep> | null>(null);
  const [delivInput, setDelivInput] = useState('');

  const fetchProcess = async () => {
    try {
      const res = await adminApi.getProcess();
      if (res && res.success) {
        setSteps(res.process);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch process steps', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcess();
  }, []);

  const handleOpenAdd = () => {
    setEditingStep({
      id: `step_${Date.now()}`,
      number: String(steps.length + 1).padStart(2, '0'),
      phase: `PHASE ${String(steps.length + 1).padStart(2, '0')}`,
      title: '',
      summary: '',
      deliverables: [],
      timeline: '1 Week',
      active: true,
      order: steps.length + 1
    });
    setDelivInput('');
    setModalOpen(true);
  };

  const handleOpenEdit = (step: CmsProcessStep) => {
    setEditingStep({ ...step });
    setDelivInput((step.deliverables || []).join('\n'));
    setModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStep || !editingStep.title) return;

    const deliverables = delivInput
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const updated = [...steps];
    const idx = updated.findIndex((s) => s.id === editingStep.id);

    const stepPayload: CmsProcessStep = {
      ...(editingStep as CmsProcessStep),
      deliverables
    };

    if (idx >= 0) {
      updated[idx] = stepPayload;
    } else {
      updated.push(stepPayload);
    }

    setSteps(updated);
    setModalOpen(false);
    showToast(`Step "${stepPayload.title}" updated`, 'info');
  };

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
    showToast('Phase removed from pipeline', 'info');
  };

  const handlePublishAll = async () => {
    setSaving(true);
    try {
      await adminApi.updateProcess(steps);
      showToast('Engineering methodology updated on public website!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to publish process', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Methodology &amp; Execution
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Process Pipeline CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Controls "HOW A PROJECT BECOMES REAL" on the public homepage and process section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 transition-colors cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Phase</span>
          </button>
          <button
            onClick={handlePublishAll}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Process Steps Cards */}
      <div className="grid grid-cols-1 gap-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="p-5 rounded-2xl bg-[#08130f] border border-emerald-500/15 hover:border-emerald-500/35 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 min-w-0">
              <span className="font-mono text-sm font-medium text-emerald-400 py-1.5 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 shrink-0">
                {step.number}
              </span>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">
                    {step.phase}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                    <Clock size={11} className="text-emerald-400" />
                    {step.timeline}
                  </span>
                </div>

                <h3 className="font-display font-medium text-base text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-400 max-w-2xl font-normal leading-relaxed">
                  {step.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(step.deliverables || []).map((d, dIdx) => (
                    <span
                      key={dIdx}
                      className="text-[10px] font-mono text-gray-300 bg-[#050b08] px-2 py-0.5 rounded border border-white/[0.04]"
                    >
                      ✓ {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <button
                onClick={() => handleOpenEdit(step)}
                className="p-2 rounded-xl text-emerald-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
                title="Edit Step"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleDeleteStep(step.id)}
                className="p-2 rounded-xl text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                title="Delete Step"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Step Modal */}
      {modalOpen && editingStep && (
        <div
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-[#08130f] border border-emerald-500/25 p-6 shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-medium text-lg text-white mb-4">
              Edit Process Stage
            </h3>

            <form onSubmit={handleSaveModal} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Number
                  </label>
                  <input
                    type="text"
                    value={editingStep.number || ''}
                    onChange={(e) => setEditingStep({ ...editingStep, number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Timeline
                  </label>
                  <input
                    type="text"
                    value={editingStep.timeline || ''}
                    onChange={(e) => setEditingStep({ ...editingStep, timeline: e.target.value })}
                    placeholder="e.g. Days 1–5"
                    className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Stage Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingStep.title || ''}
                  onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                  placeholder="e.g. DISCOVER & PLAN"
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Summary Description
                </label>
                <textarea
                  rows={3}
                  value={editingStep.summary || ''}
                  onChange={(e) => setEditingStep({ ...editingStep, summary: e.target.value })}
                  placeholder="Explain the objectives of this engineering phase..."
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Deliverables Checklist (One per line)
                </label>
                <textarea
                  rows={3}
                  value={delivInput}
                  onChange={(e) => setDelivInput(e.target.value)}
                  placeholder="Product Requirement Document&#10;Architecture Blueprint"
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs font-mono outline-none"
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
                  Save Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
