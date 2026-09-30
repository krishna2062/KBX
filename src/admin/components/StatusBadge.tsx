import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let colorClasses = 'bg-gray-800/80 text-gray-300 border-gray-700/60';
  let label = status;

  switch (normalized) {
    case 'published':
      colorClasses = 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30';
      label = 'Published';
      break;
    case 'draft':
      colorClasses = 'bg-amber-950/60 text-amber-300 border-amber-500/30';
      label = 'Draft';
      break;
    case 'archived':
      colorClasses = 'bg-gray-900/80 text-gray-400 border-gray-700/50';
      label = 'Archived';
      break;
    case 'new':
      colorClasses = 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.25)]';
      label = 'New';
      break;
    case 'reviewing':
      colorClasses = 'bg-blue-950/60 text-blue-300 border-blue-500/30';
      label = 'Reviewing';
      break;
    case 'contacted':
      colorClasses = 'bg-purple-950/60 text-purple-300 border-purple-500/30';
      label = 'Contacted';
      break;
    case 'in_progress':
      colorClasses = 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30';
      label = 'In Progress';
      break;
    case 'completed':
      colorClasses = 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30';
      label = 'Completed';
      break;
    case 'rejected':
      colorClasses = 'bg-rose-950/60 text-rose-300 border-rose-500/30';
      label = 'Rejected';
      break;
    case 'unread':
      colorClasses = 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40 font-medium';
      label = 'Unread';
      break;
    case 'read':
      colorClasses = 'bg-gray-900/80 text-gray-400 border-gray-700/40';
      label = 'Read';
      break;
    case 'replied':
      colorClasses = 'bg-blue-950/60 text-blue-300 border-blue-500/30';
      label = 'Replied';
      break;
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wider uppercase font-medium ${sizeClass} ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{label}</span>
    </span>
  );
};
