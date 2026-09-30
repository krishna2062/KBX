import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant?: 'positive' | 'warning' | 'neutral';
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  badge,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl bg-[#08140f]/90 border border-emerald-500/15 hover:border-emerald-500/35 transition-all duration-200 flex flex-col justify-between group shadow-[0_4px_24px_rgba(0,0,0,0.3)] ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium">
          {label}
        </span>
        <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:border-emerald-400/40 transition-all">
          <Icon size={17} />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-1">
        <div className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight">
          {value}
        </div>
        {badge && (
          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
              badge.variant === 'warning'
                ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                : badge.variant === 'neutral'
                ? 'bg-gray-800 text-gray-300 border-gray-700'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-gray-400 mt-2 font-normal">
          {subtext}
        </p>
      )}
    </div>
  );
};
