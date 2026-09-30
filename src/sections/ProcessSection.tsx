import React, { useState } from 'react';
import { Check, Clock, Sparkles } from 'lucide-react';
import { processData as fallbackProcess } from '../data/process';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { usePublicContent } from '../context/PublicContentContext';

export const ProcessSection: React.FC = () => {
  const { process: dynamicProcess } = usePublicContent();
  const processList = dynamicProcess && dynamicProcess.length > 0 ? dynamicProcess : fallbackProcess;
  const [activeStep, setActiveStep] = useState<number>(0);

  const currentStep = processList[activeStep] || processList[0];

  return (
    <section className="relative py-32 border-t border-emerald-950/40 bg-[#050807]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal yOffset={20} duration={0.6}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-2.5 block font-medium">
                Methodology &amp; Execution
              </span>
              <h2 className="font-display font-medium text-[32px] sm:text-[42px] lg:text-[48px] text-white tracking-tight leading-[1.08]">
                HOW A PROJECT <br />
                <span className="font-semibold text-emerald-400">BECOMES REAL.</span>
              </h2>
            </div>
            <p className="text-[15px] sm:text-[17px] text-gray-300 max-w-md font-normal leading-[1.68]">
              A transparent 7-stage engineering pipeline designed to eliminate scope creep, protect delivery timelines, and ensure rock-solid production quality.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Vertical Process Grid */}
        <ScrollReveal yOffset={24} duration={0.65} delay={0.06}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Step Selector List (Left 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              {processList.map((item, index) => {
                const isActive = activeStep === index;
                return (
                  <button
                    key={(item as any).id || item.number}
                    onClick={() => setActiveStep(index)}
                    className={`group relative text-left p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-[#091510] border border-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,0.15)]'
                        : 'border border-transparent hover:border-white/[0.08] hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <span
                        className={`font-mono text-xs sm:text-sm font-medium transition-colors ${
                          isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'
                        }`}
                      >
                        {item.number}
                      </span>
                      <div>
                        <h3
                          className={`font-display font-medium text-[17px] sm:text-[19px] tracking-normal transition-colors ${
                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                          }`}
                        >
                          {item.title}
                        </h3>
                        <span className="text-[11px] font-mono text-gray-500 block font-normal">
                          {item.phase} · {item.timeline}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-2 h-2 rounded-full transition-all ${
                        isActive ? 'bg-emerald-400 scale-125' : 'bg-white/10'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Active Step Detailed Showcase (Right 7 Cols) */}
            {currentStep && (
              <div className="lg:col-span-7 flex flex-col">
                <div className="relative h-full p-8 sm:p-10 rounded-2xl bg-[#08130f] border border-emerald-500/25 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                  {/* Top Meta */}
                  <div>
                    <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.08]">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase font-medium">
                          {currentStep.phase}
                        </span>
                        <span className="text-xs font-mono text-gray-400 flex items-center gap-1.5 font-normal">
                          <Clock size={12} className="text-emerald-400" />
                          {currentStep.timeline}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-gray-500 uppercase">
                        PHASE {currentStep.number}
                      </span>
                    </div>

                    <h3 className="font-display font-medium text-2xl sm:text-3xl text-white mb-4">
                      {currentStep.title}
                    </h3>

                    <p className="text-[15px] sm:text-[16px] text-gray-300 leading-[1.68] mb-8 font-normal">
                      {currentStep.summary}
                    </p>

                    {/* Deliverables Checklist */}
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400/80 mb-4 flex items-center gap-2 font-medium">
                        <Sparkles size={14} />
                        Stage Deliverables &amp; Outcomes
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentStep.deliverables.map((del, dIdx) => (
                          <div
                            key={dIdx}
                            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                          >
                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={11} className="text-emerald-400" />
                            </div>
                            <span className="text-xs text-gray-300 leading-snug font-normal">
                              {del}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footnote statement */}
                  <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>Direct engineering ownership</span>
                    <span className="text-emerald-400">0% Agency Fluff</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
