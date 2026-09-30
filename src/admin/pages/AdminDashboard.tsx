import React, { useState, useEffect } from 'react';
import {
  Inbox,
  MessageSquare,
  FolderKanban,
  Wrench,
  Users,
  Eye,
  Plus,
  ArrowUpRight,
  Clock,
  Sparkles,
  TrendingUp,
  Activity,
  Calendar
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { useAdmin } from '../context/AdminContext';
import { adminApi } from '../services/adminApi';
import { ProjectInquirySubmission, ContactMessageSubmission, AuditLogItem } from '../types/admin';

export const AdminDashboard: React.FC = () => {
  const { stats, setActiveTab, setSelectedInquiry } = useAdmin();
  const [dateFilter, setDateFilter] = useState<'today' | '7d' | '30d' | '3m' | '12m'>('30d');
  const [recentInquiries, setRecentInquiries] = useState<ProjectInquirySubmission[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessageSubmission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats().then((res) => {
      if (res && res.success) {
        setRecentInquiries(res.recentInquiries || []);
        setRecentMessages(res.recentMessages || []);
        setAuditLogs(res.recentAuditLogs || []);
      }
      setLoading(false);
    });
  }, []);

  const handleInquiryClick = (inq: ProjectInquirySubmission) => {
    setSelectedInquiry(inq);
    setActiveTab('inquiries');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            System Overview
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Welcome back, Krishna. Your live customer inquiries and website state are synchronized.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#081510] border border-white/10 self-start sm:self-auto overflow-x-auto">
          {(['today', '7d', '30d', '3m', '12m'] as const).map((filter) => {
            const labels = { today: 'Today', '7d': '7 Days', '30d': '30 Days', '3m': '3 Months', '12m': '12 Months' };
            const isActive = dateFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-[#050807] font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 5 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Project Requests"
          value={stats?.projectRequestsTotal ?? 0}
          subtext={`${stats?.projectRequestsNew ?? 0} awaiting review`}
          icon={Inbox}
          badge={{
            text: stats?.projectRequestsNew ? `${stats.projectRequestsNew} New` : 'Up to date',
            variant: stats?.projectRequestsNew ? 'warning' : 'neutral'
          }}
          onClick={() => setActiveTab('inquiries')}
        />
        <StatCard
          label="Contact Messages"
          value={stats?.contactMessagesTotal ?? 0}
          subtext={`${stats?.contactMessagesUnread ?? 0} unread`}
          icon={MessageSquare}
          badge={{
            text: stats?.contactMessagesUnread ? `${stats.contactMessagesUnread} Unread` : 'Clear',
            variant: stats?.contactMessagesUnread ? 'warning' : 'neutral'
          }}
          onClick={() => setActiveTab('messages')}
        />
        <StatCard
          label="Published Projects"
          value={stats?.publishedProjects ?? 0}
          subtext={`of ${stats?.totalProjects ?? 0} total case studies`}
          icon={FolderKanban}
          badge={{ text: 'Live', variant: 'positive' }}
          onClick={() => setActiveTab('projects')}
        />
        <StatCard
          label="Active Services"
          value={stats?.publishedServices ?? 0}
          subtext="Full-stack product tiers"
          icon={Wrench}
          badge={{ text: 'Public', variant: 'positive' }}
          onClick={() => setActiveTab('services')}
        />
        <StatCard
          label="Website Visitors"
          value={(stats?.websiteVisitors ?? 1240).toLocaleString()}
          subtext="Live telemetry counter"
          icon={Eye}
          badge={{ text: '+18%', variant: 'positive' }}
        />
      </div>

      {/* Quick Actions Strip */}
      <div className="p-4 rounded-2xl bg-[#08130f] border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-medium">
          <Sparkles size={15} />
          <span>Quick Actions</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('website-content')}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-200 transition-colors cursor-pointer"
          >
            Edit Home Page
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] text-xs font-medium transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Project</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-200 transition-colors cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Service</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-200 transition-colors cursor-pointer"
          >
            Upload Media
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-200 transition-colors cursor-pointer"
          >
            View Project Requests
          </button>
        </div>
      </div>

      {/* Analytics Chart + Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Website Activity Telemetry */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="font-display font-medium text-lg text-white">
                Website Activity &amp; Inquiries
              </h2>
              <p className="text-xs text-gray-400 font-normal">
                Traffic &amp; client conversion requests over {dateFilter}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Requests
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <span className="w-2 h-2 rounded-full bg-white/30" />
                Visitors
              </span>
            </div>
          </div>

          {/* SVG Visual Chart */}
          <div className="h-56 w-full flex items-end justify-between gap-2 pt-6 px-2">
            {[
              { day: 'Mon', reqs: 2, visitors: 140 },
              { day: 'Tue', reqs: 3, visitors: 190 },
              { day: 'Wed', reqs: 1, visitors: 160 },
              { day: 'Thu', reqs: 5, visitors: 240 },
              { day: 'Fri', reqs: 4, visitors: 210 },
              { day: 'Sat', reqs: 2, visitors: 120 },
              { day: 'Sun', reqs: 6, visitors: 280 }
            ].map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1 h-44">
                  {/* Visitor bar */}
                  <div
                    className="w-2 sm:w-3 rounded-t bg-white/10 group-hover:bg-white/20 transition-all"
                    style={{ height: `${(d.visitors / 300) * 100}%` }}
                    title={`${d.visitors} visitors`}
                  />
                  {/* Requests bar */}
                  <div
                    className="w-2 sm:w-3 rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:brightness-125 transition-all shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                    style={{ height: `${(d.reqs / 7) * 100}%` }}
                    title={`${d.reqs} project requests`}
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-400 group-hover:text-white transition-colors">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Audit Logs */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" />
              <h2 className="font-display font-medium text-base text-white">
                Live Audit Stream
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400/80">Real-time</span>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto max-h-56 pr-1">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center font-mono">
                No activity logs recorded yet.
              </p>
            ) : (
              auditLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-[#050b08]/60 border border-white/[0.04] text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1">
                    <span className="text-emerald-400">{log.actor}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-gray-300 font-normal leading-snug">
                    {log.details}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Project Requests Table */}
      <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="font-display font-medium text-lg text-white">
              Recent Project Requests
            </h2>
            <p className="text-xs text-gray-400 font-normal">
              Direct inquiries submitted from the public Start a Project brief
            </p>
          </div>
          <button
            onClick={() => setActiveTab('inquiries')}
            className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <span>View All ({stats?.projectRequestsTotal ?? 0})</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500 font-mono">
            No project requests submitted yet. Use the public "Start a Project" page to submit one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-gray-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Project Type</th>
                  <th className="py-3 px-3">Budget</th>
                  <th className="py-3 px-3">Timeline</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => handleInquiryClick(inq)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-white">{inq.fullName}</div>
                      <div className="text-[11px] font-mono text-gray-400">{inq.email}</div>
                    </td>
                    <td className="py-3.5 px-3 font-normal text-gray-200">
                      {inq.projectType}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-emerald-400">
                      {inq.budgetRange}
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 font-mono">
                      {inq.timeline}
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={inq.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 font-mono">
                      {new Date(inq.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px]">
                        Inspect →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Contact Messages */}
      <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="font-display font-medium text-lg text-white">
              Recent Contact Inquiries
            </h2>
            <p className="text-xs text-gray-400 font-normal">
              Direct notes from the public Contact form
            </p>
          </div>
          <button
            onClick={() => setActiveTab('messages')}
            className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <span>View All ({stats?.contactMessagesTotal ?? 0})</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        {recentMessages.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500 font-mono">
            No contact messages yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-gray-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-3">Sender</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Message Excerpt</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => setActiveTab('messages')}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-white">{msg.name}</div>
                      <div className="text-[11px] font-mono text-gray-400">{msg.email}</div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-emerald-300">
                      {msg.subject}
                    </td>
                    <td className="py-3.5 px-3 text-gray-300 truncate max-w-xs font-normal">
                      {msg.message}
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={msg.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 font-mono">
                      {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
