import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  X
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { ContactMessageSubmission } from '../types/admin';

export const AdminContactMessages: React.FC = () => {
  const { showToast, refreshStats } = useAdmin();

  const [messages, setMessages] = useState<ContactMessageSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageSubmission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessageSubmission | null>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [replySubject, setReplySubject] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await adminApi.getMessages();
      if (res && res.success) {
        setMessages(res.messages);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load contact messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleOpenMessage = async (msg: ContactMessageSubmission) => {
    setSelectedMessage(msg);
    setReplySubject(`Re: ${msg.subject}`);
    setReplyText('');
    try {
      const repRes = await adminApi.getMessageReplies(msg.id);
      if (repRes && repRes.success) {
        setReplies(repRes.replies || []);
      }
    } catch {
      setReplies([]);
    }

    if (msg.status === 'unread') {
      try {
        await adminApi.updateMessage(msg.id, { status: 'read' });
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m)));
        refreshStats();
      } catch {
        // Non-blocking
      }
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const res = await adminApi.sendReply(selectedMessage.id, {
        subject: replySubject.trim() || `Re: ${selectedMessage.subject}`,
        replyText: replyText.trim(),
        toEmail: selectedMessage.email,
        toName: selectedMessage.name
      });

      if (res && res.success) {
        showToast(res.message || 'Reply dispatched and recorded in database', 'success');
        setReplies((prev) => [res.reply, ...prev]);
        setReplyText('');
        setMessages((prev) =>
          prev.map((m) => (m.id === selectedMessage.id ? { ...m, status: 'replied' } : m))
        );
        setSelectedMessage({ ...selectedMessage, status: 'replied' });
        refreshStats();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to send reply', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const handleStatusChange = async (msgId: string, status: ContactMessageSubmission['status']) => {
    try {
      await adminApi.updateMessage(msgId, { status });
      showToast(`Message marked as ${status}`, 'success');
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, status } : m)));
      if (selectedMessage?.id === msgId) {
        setSelectedMessage({ ...selectedMessage, status });
      }
      refreshStats();
    } catch (err: any) {
      showToast(err.message || 'Failed to update message status', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteMessage(deleteTarget.id);
      showToast('Contact message deleted', 'info');
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      if (selectedMessage?.id === deleteTarget.id) setSelectedMessage(null);
      setDeleteTarget(null);
      refreshStats();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete message', 'error');
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Contact Note"
        message={`Delete message from ${deleteTarget?.name}? This action cannot be reverted.`}
        confirmText="Delete Message"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Direct Communications
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Contact Messages
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Direct messages received through the public Contact page consultation form.
          </p>
        </div>
      </div>

      {/* Toolbar: Search + Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages by sender name, subject, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#08130f] border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#081510] border border-white/10 w-fit overflow-x-auto">
          {['all', 'unread', 'read', 'replied', 'archived'].map((st) => (
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

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No contact messages found"
          description="Messages submitted through the public Contact form will arrive here in real time."
        />
      ) : (
        <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-gray-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-3">Sender</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Message Excerpt</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <span>{msg.name}</span>
                        {msg.status === 'unread' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-gray-400">{msg.email}</div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-emerald-300">
                      {msg.subject}
                    </td>
                    <td className="py-3.5 px-3 text-gray-300 truncate max-w-sm font-normal">
                      {msg.message}
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={msg.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 font-mono">
                      {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenMessage(msg)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-[#050807] text-[11px] font-mono transition-colors cursor-pointer"
                        >
                          Read
                        </button>
                        <button
                          onClick={() => setDeleteTarget(msg)}
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

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#08130f] border border-emerald-500/25 p-6 sm:p-8 flex flex-col shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-medium">
                  Direct Inquiry
                </span>
                <h2 className="font-display font-medium text-lg text-white">
                  {selectedMessage.subject}
                </h2>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#050b08] border border-white/[0.06] flex items-center justify-between mb-6">
              <div>
                <div className="text-xs text-white font-medium">{selectedMessage.name}</div>
                <a href={`mailto:${selectedMessage.email}`} className="text-xs font-mono text-emerald-400 hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              <div className="text-right text-[11px] font-mono text-gray-400">
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#050b08]/80 border border-white/[0.06] mb-6">
              <span className="text-[10px] font-mono uppercase text-gray-400 mb-2 block">
                Message Body:
              </span>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>

            {/* Past Replies History */}
            {replies.length > 0 && (
              <div className="mb-6 flex flex-col gap-3">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-medium">
                  Reply History ({replies.length})
                </span>
                <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {replies.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-3.5 rounded-xl bg-[#06140d] border border-emerald-500/20 text-xs flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-emerald-300">
                          {rep.adminName || 'Krishna Bhandari'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              rep.deliveryStatus === 'sent'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : rep.deliveryStatus === 'failed'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {rep.deliveryStatus || 'sent'}
                          </span>
                          <span className="text-[10px] font-mono text-gray-500">
                            {new Date(rep.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed mt-1">
                        {rep.replyText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* In-App Reply Form */}
            <form onSubmit={handleSendReply} className="mb-6 p-4 rounded-xl bg-[#06110c] border border-emerald-500/25 flex flex-col gap-3">
              <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">
                Compose Client Reply
              </span>
              <div>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full px-3 py-2 rounded-lg bg-[#040906] border border-white/10 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <textarea
                  required
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write your response to ${selectedMessage.name}...`}
                  className="w-full px-3 py-2 rounded-lg bg-[#040906] border border-white/10 text-white text-xs focus:border-emerald-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-gray-400">
                  Sends via configured transactional email service &amp; logs to database
                </span>
                <button
                  type="submit"
                  disabled={sendingReply || !replyText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
                >
                  <Mail size={13} />
                  <span>{sendingReply ? 'Sending...' : 'Send Reply'}</span>
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono text-gray-300 hover:text-white bg-white/[0.04] transition-colors cursor-pointer"
                >
                  Mark as Replied
                </button>
                <button
                  onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Archive
                </button>
              </div>

              <a
                href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject}`}
                className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>External Mail Client</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
