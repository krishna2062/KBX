import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  showArrow = false,
  children,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs font-medium',
    md: 'px-5 py-2.5 text-[13px] tracking-wide font-medium',
    lg: 'px-6 py-3.5 text-[14px] tracking-wide font-medium sm:font-semibold'
  };

  const variantClasses = {
    primary:
      'bg-[#10b981] hover:bg-[#34d399] text-[#050807] shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:shadow-[0_0_36px_rgba(52,211,153,0.45)] border border-emerald-300/40',
    secondary:
      'bg-[#0d1c15] hover:bg-[#12281e] text-[#e8f0eb] border border-[#10b981]/30 hover:border-[#34d399]/60 hover:text-white',
    outline:
      'bg-transparent hover:bg-white/[0.04] text-[#d1fae5] border border-white/15 hover:border-emerald-400/50',
    ghost:
      'bg-transparent hover:bg-white/[0.05] text-[#9ca3af] hover:text-[#e8f0eb] border-transparent'
  };

  return (
    <button
      className={`group inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 cursor-pointer select-none active:scale-[0.98] whitespace-nowrap ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <span className="truncate">{children}</span>
      {showArrow && (
        <ArrowUpRight
          size={size === 'lg' ? 17 : 14}
          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
        />
      )}
    </button>
  );
};
