import React from 'react';
import { LucideIcon, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#08130f]/60 border border-emerald-500/15 max-w-lg mx-auto my-8">
      <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4">
        <Icon size={24} />
      </div>
      <h3 className="font-display font-medium text-lg text-white mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-normal mb-6 max-w-sm">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.25)] cursor-pointer"
        >
          <Plus size={14} />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
