import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  ArrowUpRight,
  Trash2,
  Archive,
  Mail,
  Phone,
  Building,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  Sparkles,
  Paperclip,
  ExternalLink,
  X
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { ProjectInquirySubmission } from '../types/admin';

export const AdminInquiries: React.FC = () => {
  const { showToast, selectedInquiry, setSelectedInquiry, refreshStats } = useAdmin();

  const [inquiries, setInquiries] = useState<ProjectInquirySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<ProjectInquirySubmission | null>(null);

  // Detail Modal / Drawer state
  const [activeInquiry, setActiveInquiry] = useState<ProjectInquirySubmission | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchInquiries = async () => {
    try {
      const res = await adminApi.getInquiries();
      if (res && res.success) {
        setInquiries(res.inquiries);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Handle passed selectedInquiry from Dashboard
  useEffect(() => {
    if (selectedInquiry) {
      setActiveInquiry(selectedInquiry);
      setInternalNote(selectedInquiry.internalNotes || '');
    }
  }, [selectedInquiry]);

  const handleOpenDetail = (inq: ProjectInquirySubmission) => {
    setActiveInquiry(inq);
    setInternalNote(inq.internalNotes || '');
  };

  const handleStatusChange = async (inquiryId: string, newStatus: ProjectInquirySubmission['status']) => {
    setUpdating(true);
    try {
      await adminApi.updateInquiry(inquiryId, { status: newStatus });
      showToast(`Status updated to ${newStatus}`, 'success');
      if (activeInquiry && activeInquiry.id === inquiryId) {
        setActiveInquiry({ ...activeInquiry, status: newStatus });
      }
      fetchInquiries();
      refreshStats();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeInquiry) return;
    setUpdating(true);
    try {
      await adminApi.updateInquiry(activeInquiry.id, { internalNotes: internalNote });
      showToast('Internal note saved', 'success');
      setActiveInquiry({ ...activeInquiry, internalNotes: internalNote });
      fetchInquiries();
    } catch (err: any) {
      showToast(err.message || 'Failed to save note', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteInquiry(deleteTarget.id);
      showToast(`Inquiry from ${deleteTarget.fullName} deleted`, 'info');
      if (activeInquiry?.id === deleteTarget.id) setActiveInquiry(null);
      setDeleteTarget(null);
      fetchInquiries();
      refreshStats();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete inquiry', 'error');
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchSearch =
      inq.fullName.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      inq.company.toLowerCase().includes(search.toLowerCase()) ||
      inq.projectType.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || inq.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Project Request"
        message={`Are you sure you want to delete the inquiry from ${deleteTarget?.fullName}? This action cannot be undone.`}
        confirmText="Delete Record"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Client Inquiries Pipeline
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Start Project Requests
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Real incoming scopes submitted by clients through the public "Start a Project" brief.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/25 px-3.5 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time Sync Active</span>
        </div>
      </div>

      {/* Toolbar: Search + Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by client name, email, company, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#08130f] border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#081510] border border-white/10 w-fit overflow-x-auto">
          {['all', 'new', 'reviewing', 'in_progress', 'completed', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === st ? 'bg-emerald-500 text-[#050807] font-medium' : 'text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      {filteredInquiries.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No project requests found"
          description="When clients submit the 'Start a Project' form on the public website, their detailed scopes will appear here in real time."
        />
      ) : (
        <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-gray-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-3">Client &amp; Contact</th>
                  <th className="py-3 px-3">Project Scope</th>
                  <th className="py-3 px-3">Budget Range</th>
                  <th className="py-3 px-3">Timeline</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => handleOpenDetail(inq)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <span>{inq.fullName}</span>
                        {inq.status === 'new' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-gray-400">{inq.email}</div>
                      {inq.company && (
                        <div className="text-[10px] font-mono text-gray-500">{inq.company}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-emerald-300">{inq.projectType}</div>
                      <div className="text-[11px] text-gray-400 truncate max-w-xs font-normal">
                        {inq.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-emerald-400 font-medium">
                      {inq.budgetRange}
                    </td>
                    <td className="py-3.5 px-3 text-gray-300 font-mono">
                      {inq.timeline}
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={inq.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 font-mono">
                      {new Date(inq.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(inq)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-[#050807] text-[11px] font-mono transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setDeleteTarget(inq)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Detail Drawer / Modal */}
      {activeInquiry && (
        <div
          className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => {
            setActiveInquiry(null);
            setSelectedInquiry(null);
          }}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#08130f] border border-emerald-500/25 p-6 sm:p-8 flex flex-col shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Inbox size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-medium text-xl text-white">
                      {activeInquiry.fullName}
                    </h2>
                    <StatusBadge status={activeInquiry.status} size="sm" />
                  </div>
                  <span className="text-xs font-mono text-gray-400">
                    Request ID: {activeInquiry.id} · Submitted {new Date(activeInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveInquiry(null);
                  setSelectedInquiry(null);
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Status Control Bar */}
            <div className="p-3.5 rounded-xl bg-[#050b08] border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="text-xs font-mono text-gray-400 uppercase">
                Update Status:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {(['new', 'reviewing', 'contacted', 'in_progress', 'completed', 'rejected', 'archived'] as const).map(
                  (st) => (
                    <button
                      key={st}
                      disabled={updating}
                      onClick={() => handleStatusChange(activeInquiry.id, st)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        activeInquiry.status === st
                          ? 'bg-emerald-500 text-[#050807] font-medium'
                          : 'bg-white/[0.04] text-gray-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Client Info Card */}
              <div className="p-4 rounded-xl bg-[#050b08]/80 border border-white/[0.06] flex flex-col gap-3">
                <span className="text-xs font-mono uppercase text-emerald-400 font-medium">
                  Client Contact Details
                </span>
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    <a href={`mailto:${activeInquiry.email}`} className="text-emerald-300 hover:underline">
                      {activeInquiry.email}
                    </a>
                  </div>
                  {activeInquiry.phone && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone size={14} className="text-gray-400 shrink-0" />
                      <span>{activeInquiry.phone}</span>
                    </div>
                  )}
                  {activeInquiry.company && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Building size={14} className="text-gray-400 shrink-0" />
                      <span>{activeInquiry.company}</span>
                    </div>
                  )}
                  {activeInquiry.referenceUrl && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <ExternalLink size={14} className="text-gray-400 shrink-0" />
                      <a href={activeInquiry.referenceUrl} target="_blank" rel="noreferrer" className="text-emerald-300 hover:underline truncate">
                        {activeInquiry.referenceUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Scope Card */}
              <div className="p-4 rounded-xl bg-[#050b08]/80 border border-white/[0.06] flex flex-col gap-3">
                <span className="text-xs font-mono uppercase text-emerald-400 font-medium">
                  Scope &amp; Budget
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Type</span>
                    <span className="font-medium text-white">{activeInquiry.projectType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Budget</span>
                    <span className="font-mono text-emerald-400 font-medium">{activeInquiry.budgetRange}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Timeline</span>
                    <span className="font-mono text-gray-300">{activeInquiry.timeline}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Tech Stack</span>
                    <span className="font-mono text-gray-300">{activeInquiry.preferredTech || 'None specified'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Text */}
            <div className="p-4 rounded-xl bg-[#050b08]/80 border border-white/[0.06] flex flex-col gap-2 mb-6">
              <span className="text-xs font-mono uppercase text-emerald-400 font-medium">
                Project Requirements &amp; Problem Statement
              </span>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal whitespace-pre-wrap">
                {activeInquiry.description}
              </p>
              {activeInquiry.targetUsers && (
                <div className="pt-3 mt-2 border-t border-white/[0.04] text-xs">
                  <span className="text-gray-500 font-mono uppercase mr-2">Target Audience:</span>
                  <span className="text-gray-300">{activeInquiry.targetUsers}</span>
                </div>
              )}
              {activeInquiry.additionalMessage && (
                <div className="pt-2 text-xs">
                  <span className="text-gray-500 font-mono uppercase mr-2">Additional Note:</span>
                  <span className="text-gray-300">{activeInquiry.additionalMessage}</span>
                </div>
              )}
            </div>

            {/* Internal Notes Editor (Private to Krishna) */}
            <div className="p-4 rounded-xl bg-[#091711] border border-emerald-500/25 flex flex-col gap-3 mb-6">
              <span className="text-xs font-mono uppercase text-emerald-300 font-medium">
                Private Admin Notes (Visible only to you)
              </span>
              <textarea
                rows={3}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Log internal architecture thoughts, estimated sprint hours, or meeting notes..."
                className="w-full px-3 py-2 rounded-lg bg-[#050b08] border border-white/10 text-white text-xs outline-none focus:border-emerald-400"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotes}
                  disabled={updating}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs font-mono transition-colors cursor-pointer"
                >
                  Save Internal Note
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <a
                href={`mailto:${activeInquiry.email}?subject=RE: KBX Project Inquiry (${activeInquiry.projectType})`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                <Mail size={14} />
                <span>Reply to Client via Email</span>
              </a>

              <button
                onClick={() => setDeleteTarget(activeInquiry)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
