import React from 'react';
import { ArrowUpRight, Sparkles, Terminal, ShieldCheck } from 'lucide-react';
import { HeroScene3D } from '../components/3d/HeroScene3D';
import { Button } from '../components/common/Button';
import { NavigationTab } from '../types';
import { usePublicContent } from '../context/PublicContentContext';

interface HeroSectionProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { hero } = usePublicContent();

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-12 overflow-hidden">
      {/* Background radial atmosphere */}
      <div
        className="absolute top-1/4 right-0 w-[600px] h-[600px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at 60% 40%, rgba(16, 185, 129, 0.14), rgba(5, 150, 105, 0.03) 60%, transparent 80%)',
          filter: 'blur(50px)'
        }}
      />
      <div
        className="absolute top-10 left-10 w-96 h-96 pointer-events-none -z-10 opacity-30"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(52, 211, 153, 0.08), transparent 70%)',
          filter: 'blur(60px)'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* Left Column: Editorial Typography & Statement */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/25 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-6 shadow-[0_0_16px_rgba(16,185,129,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{hero.eyebrow}</span>
            </div>

            {/* Controlled Medium-Large Editorial Heading */}
            <h1 className="font-display font-medium text-[clamp(2.25rem,10vw,3.5rem)] md:text-[clamp(2.75rem,6vw,4.5rem)] lg:text-[clamp(3rem,5vw,5.5rem)] tracking-tight leading-[1.0] text-white mb-6 max-w-xl text-balance">
              {hero.titlePrefix}{' '}
              <span className="font-semibold text-emerald-400 drop-shadow-[0_0_18px_rgba(52,211,153,0.22)]">
                {hero.titleHighlight1}
              </span>{' '}
              {hero.titleMiddle}{' '}
              <span className="font-semibold text-emerald-300">
                {hero.titleHighlight2}
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-gray-300 text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.68] max-w-lg mb-9 font-normal">
              {hero.description}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                showArrow
                onClick={() => onNavigate((hero.primaryCtaAction as any) || 'start')}
              >
                {hero.primaryCtaText}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onNavigate((hero.secondaryCtaAction as any) || 'projects')}
              >
                {hero.secondaryCtaText}
              </Button>
            </div>

            {/* Trust Markers */}
            <div className="mt-12 pt-6 border-t border-white/[0.07] flex flex-wrap items-center gap-6 text-xs text-gray-400 font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Production Architecture</span>
              </div>
              <span className="text-white/20">/</span>
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-emerald-400" />
                <span>Full-Stack Autonomy</span>
              </div>
              <span className="text-white/20">/</span>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-400" />
                <span>Direct Collaboration</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Abstract Object or Custom Visual */}
          <div className="lg:col-span-5 relative w-full h-[400px] sm:h-[500px] lg:h-[620px] flex items-center justify-center">
            {hero.visualType === 'image' && hero.customImageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 p-2 bg-[#081510] shadow-2xl max-w-md w-full aspect-video">
                <img
                  src={hero.customImageUrl}
                  alt="Hero visual"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            ) : (
              <HeroScene3D />
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Element (Controlled from CMS) */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full mt-10">
        <div className="w-full rounded-2xl bg-gradient-to-r from-[#0a1811]/90 via-[#0a1410]/80 to-[#0a1811]/90 backdrop-blur-xl border border-emerald-500/20 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles size={14} className="animate-spin-slow" />
            </div>
            <p className="text-xs sm:text-sm text-gray-300 font-medium">
              {hero.bottomBannerText}{' '}
              <span className="text-emerald-300">{hero.bottomBannerHighlight}</span>
            </p>
          </div>

          <button
            onClick={() => onNavigate('start')}
            className="group flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer shrink-0 transition-colors"
          >
            <span>{hero.primaryCtaText}</span>
            <ArrowUpRight
              size={14}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </button>
        </div>
      </div>
    </section>
  );
};
