import React from 'react';
import { Star, Quote } from 'lucide-react';
import { usePublicContent } from '../context/PublicContentContext';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, sectionToggles } = usePublicContent();

  // If section is disabled in CMS toggles or there are no published testimonials, keep hidden
  if (!sectionToggles.testimonials || !testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative py-28 border-t border-emerald-950/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal yOffset={20} duration={0.6}>
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-2.5 block font-medium">
              Client Feedback &amp; Verification
            </span>
            <h2 className="font-display font-medium text-[32px] sm:text-[40px] text-white tracking-tight">
              PROVEN <span className="text-emerald-400">PARTNERSHIPS</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-lg mt-3 font-normal">
              Words from founders, engineering leads, and business stakeholders who built their products with KBX.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <ScrollReveal key={t.id} yOffset={24} duration={0.6} delay={idx * 0.1}>
              <div className="h-full p-6 sm:p-7 rounded-2xl bg-[#07130e]/80 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-1 text-emerald-400">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} size={13} className="fill-emerald-400 text-emerald-400" />
                      ))}
                    </div>
                    <Quote size={20} className="text-emerald-500/30" />
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed font-normal mb-6">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center gap-3">
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.clientName}
                      className="w-10 h-10 rounded-full object-cover border border-emerald-500/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center font-display font-medium text-emerald-300 text-sm">
                      {t.clientName.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-white truncate">
                      {t.clientName}
                    </span>
                    <span className="text-[11px] text-gray-400 truncate">
                      {t.role} · <span className="text-emerald-400">{t.company}</span>
                    </span>
                    {t.projectRelationship && (
                      <span className="text-[10px] font-mono text-gray-500 truncate mt-0.5">
                        Project: {t.projectRelationship}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
