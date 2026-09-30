import React, { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, ArrowUpRight, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { NavigationTab } from '../types';
import { usePublicContent } from '../context/PublicContentContext';
import { submitContactMessage } from '../services/api';

interface ContactPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { brand } = usePublicContent();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setError(null);
    try {
      await submitContactMessage(form);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-32 max-w-5xl mx-auto px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-14">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-2.5 block font-medium">
          Inquiries &amp; Consultations
        </span>
        <h1 className="font-display font-medium text-[32px] sm:text-[42px] lg:text-[48px] text-white tracking-tight mb-3">
          LET'S <span className="font-semibold text-emerald-400">TALK.</span>
        </h1>
        <p className="text-[15px] sm:text-[17px] text-gray-300 max-w-xl leading-[1.68] font-normal">
          Whether you have an upcoming project, need an architecture audit, or want to consult on technical strategy, I'm available to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Contact Information Cards (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-[#081510]/80 border border-emerald-500/20 flex flex-col gap-5">
            <h2 className="font-display font-medium text-[17px] text-white">Direct Channels</h2>

            <div className="flex flex-col gap-4 text-sm">
              <a
                href={`mailto:${brand.email || 'krishna@kbx.dev'}`}
                className="group flex items-center gap-3.5 text-gray-300 hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                  <Mail size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase text-gray-500 block">Email</span>
                  <span className="text-sm font-medium text-emerald-300 group-hover:underline truncate block">
                    {brand.email || 'krishna@kbx.dev'}
                  </span>
                </div>
              </a>

              {brand.phone && (
                <div className="flex items-center gap-3.5 text-gray-300">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-500 block">Consultation Line</span>
                    <span className="text-sm font-medium text-white">{brand.phone}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3.5 text-gray-300">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-gray-500 block">Base &amp; Timezone</span>
                  <span className="text-sm font-medium text-white">
                    {brand.location || 'Kathmandu / Global Remote'} ({brand.timezone || 'UTC+5:45'})
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center gap-3 flex-wrap">
              {brand.github && (
                <a
                  href={brand.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#050b08] border border-white/10 text-xs font-mono text-gray-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                >
                  <Github size={14} />
                  <span>GitHub</span>
                </a>
              )}
              {brand.linkedin && (
                <a
                  href={brand.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#050b08] border border-white/10 text-xs font-mono text-gray-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                >
                  <Linkedin size={14} />
                  <span>LinkedIn</span>
                </a>
              )}
              {brand.twitter && (
                <a
                  href={brand.twitter}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#050b08] border border-white/10 text-xs font-mono text-gray-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                >
                  <Twitter size={14} />
                  <span>Twitter / X</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Pitch Card to Start a Project */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c2419] to-[#06120d] border border-emerald-500/30 flex flex-col justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase text-emerald-300 font-semibold block mb-1">
                Have a defined scope?
              </span>
              <h3 className="font-display font-medium text-[17px] text-white mb-2">
                Detailed Project Inquiry
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                If you have requirements, target launch dates, and a budget, submit our comprehensive project brief for immediate scheduling.
              </p>
            </div>
            <button
              onClick={() => onNavigate('start')}
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-colors cursor-pointer"
            >
              <span>Open Project Brief</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Right: Quick Direct Message Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#08130e]/80 border border-emerald-500/15">
            {submitted ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="font-display font-medium text-xl text-white mb-2">Message Sent</h3>
                <p className="text-[14px] text-gray-300 max-w-sm mb-6 leading-relaxed font-normal">
                  Thank you for reaching out. I'll get back to your email directly within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex items-center gap-2 mb-2 text-xs font-mono text-emerald-400/80">
                  <MessageSquare size={14} />
                  <span>Direct Message Form</span>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl bg-[#050a07] border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#050a07] border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Next.js SaaS MVP or Architecture Consultation"
                    className="w-full px-4 py-3 rounded-xl bg-[#050a07] border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me a bit about what you want to achieve..."
                    className="w-full px-4 py-3 rounded-xl bg-[#050a07] border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex items-center justify-center gap-2 w-full sm:w-auto self-start px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#050807] font-medium text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  <span>{loading ? 'Sending...' : 'Send Direct Message'}</span>
                  <ArrowUpRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
