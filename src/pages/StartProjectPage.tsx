import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Upload, AlertCircle, Sparkles, Shield, Clock } from 'lucide-react';
import { ProjectInquiryData, NavigationTab } from '../types';
import { submitProjectInquiry } from '../services/api';

interface StartProjectPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

const PROJECT_TYPES = [
  'Website',
  'Web Application',
  'Mobile App',
  'SaaS',
  'Custom Software',
  'E-commerce',
  'UI/UX',
  'API / Backend',
  'Automation',
  'Other'
];

const BUDGET_RANGES = [
  'Under $5,000',
  '$5,000 – $10,000',
  '$10,000 – $25,000',
  '$25,000 – $50,000',
  '$50,000+'
];

const TIMELINE_OPTIONS = [
  'Urgent (Under 3 weeks)',
  'Standard (1–2 months)',
  'Comprehensive (2–4 months)',
  'Flexible / Ongoing'
];

export const StartProjectPage: React.FC<StartProjectPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<ProjectInquiryData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'Web Application',
    timeline: 'Standard (1–2 months)',
    budgetRange: '$10,000 – $25,000',
    description: '',
    targetUsers: '',
    preferredTech: '',
    referenceUrl: '',
    additionalMessage: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      errs.description = 'Please describe your project (at least 20 characters).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitProjectInquiry({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        projectType: formData.projectType,
        timeline: formData.timeline,
        budgetRange: formData.budgetRange,
        description: formData.description,
        targetUsers: formData.targetUsers,
        preferredTech: formData.preferredTech,
        referenceUrl: formData.referenceUrl,
        additionalMessage: formData.additionalMessage,
        attachmentName: selectedFile ? selectedFile.name : undefined
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to submit inquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-36 pb-32 max-w-3xl mx-auto px-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-[0_0_32px_rgba(16,185,129,0.3)]">
          <CheckCircle2 size={32} />
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2 block">
          Submission Confirmed
        </span>

        <h1 className="font-display font-medium text-2xl sm:text-3xl text-white mb-3 tracking-tight">
          PROJECT REQUEST RECEIVED
        </h1>

        <p className="text-[15px] sm:text-[17px] text-gray-300 leading-[1.7] max-w-lg mx-auto mb-8 font-normal">
          Thanks for sharing your requirements. I'll personally review the project details and contact you within 24 hours with architectural considerations and next steps.
        </p>

        <div className="p-6 rounded-2xl bg-[#081510] border border-emerald-500/20 text-left max-w-md mx-auto mb-8 text-xs font-mono space-y-2 text-gray-300 font-normal">
          <div className="flex justify-between">
            <span className="text-gray-500">Contact:</span>
            <span className="text-white">{formData.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email:</span>
            <span className="text-emerald-400">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Type:</span>
            <span className="text-white">{formData.projectType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Budget Range:</span>
            <span className="text-white">{formData.budgetRange}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setIsSuccess(false);
            onNavigate('home');
          }}
          className="px-7 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          Return to Studio Home
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 max-w-5xl mx-auto px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-14">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-2.5 block font-medium">
          Project Inquiry &amp; Scope Brief
        </span>
        <h1 className="font-display font-medium text-[32px] sm:text-[42px] lg:text-[48px] text-white tracking-tight mb-3">
          START A <span className="font-semibold text-emerald-400">PROJECT</span>
        </h1>
        <p className="text-[15px] sm:text-[17px] text-gray-300 max-w-xl leading-[1.68] font-normal">
          Tell me about your project, and I'll review the requirements before getting back to you with architectural recommendations and a clear roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Form (8 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 flex flex-col gap-8">
          {/* 1. Contact Information */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#08130e]/80 border border-emerald-500/15 flex flex-col gap-5">
            <h2 className="font-display font-medium text-[17px] text-white flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-400 font-medium">01</span>
              <span>Your Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className={`w-full px-4 py-3 rounded-xl bg-[#050b08] border ${
                    errors.fullName ? 'border-red-500' : 'border-white/10 focus:border-emerald-400'
                  } text-white placeholder-gray-600 text-sm outline-none transition-colors`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle size={12} /> {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@company.com"
                  className={`w-full px-4 py-3 rounded-xl bg-[#050b08] border ${
                    errors.email ? 'border-red-500' : 'border-white/10 focus:border-emerald-400'
                  } text-white placeholder-gray-600 text-sm outline-none transition-colors`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl bg-[#050b08] border border-white/10 focus:border-emerald-400 text-white placeholder-gray-600 text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Apex Health"
                  className="w-full px-4 py-3 rounded-xl bg-[#050b08] border border-white/10 focus:border-emerald-400 text-white placeholder-gray-600 text-sm outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 2. Project Classification */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#08130e]/80 border border-emerald-500/15 flex flex-col gap-5">
            <h2 className="font-display font-medium text-lg text-white flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-400">02</span>
              <span>Project Type</span>
            </h2>

            <div className="flex flex-wrap gap-2.5">
              {PROJECT_TYPES.map((type) => {
                const isSelected = formData.projectType === type;
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setFormData({ ...formData, projectType: type })}
                    className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-[#050807] font-semibold shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                        : 'bg-[#050b08] text-gray-300 border border-white/10 hover:border-emerald-500/40'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Scope & Requirements */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#08130e]/80 border border-emerald-500/15 flex flex-col gap-5">
            <h2 className="font-display font-medium text-lg text-white flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-400">03</span>
              <span>Scope &amp; Details</span>
            </h2>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                Project Description *
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What are you building? What primary problem does it solve for your business or customers?"
                className={`w-full px-4 py-3 rounded-xl bg-[#050b08] border ${
                  errors.description ? 'border-red-500' : 'border-white/10 focus:border-emerald-400'
                } text-white placeholder-gray-600 text-sm outline-none transition-colors`}
              />
              {errors.description && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-mono">
                  <AlertCircle size={12} /> {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Target Users
                </label>
                <input
                  type="text"
                  value={formData.targetUsers}
                  onChange={(e) => setFormData({ ...formData, targetUsers: e.target.value })}
                  placeholder="e.g. B2B supply chain managers"
                  className="w-full px-4 py-3 rounded-xl bg-[#050b08] border border-white/10 focus:border-emerald-400 text-white placeholder-gray-600 text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Preferred Technology (Optional)
                </label>
                <input
                  type="text"
                  value={formData.preferredTech}
                  onChange={(e) => setFormData({ ...formData, preferredTech: e.target.value })}
                  placeholder="e.g. React, Node.js, Postgres"
                  className="w-full px-4 py-3 rounded-xl bg-[#050b08] border border-white/10 focus:border-emerald-400 text-white placeholder-gray-600 text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                Reference URL / Figma / Existing Website
              </label>
              <input
                type="url"
                value={formData.referenceUrl}
                onChange={(e) => setFormData({ ...formData, referenceUrl: e.target.value })}
                placeholder="https://example.com or Figma link"
                className="w-full px-4 py-3 rounded-xl bg-[#050b08] border border-white/10 focus:border-emerald-400 text-white placeholder-gray-600 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* 4. Budget & Timeline */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#08130e]/80 border border-emerald-500/15 flex flex-col gap-6">
            <h2 className="font-display font-medium text-lg text-white flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-400">04</span>
              <span>Budget &amp; Schedule</span>
            </h2>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                Expected Budget Range
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BUDGET_RANGES.map((b) => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setFormData({ ...formData, budgetRange: b })}
                    className={`p-3 rounded-xl text-xs font-mono text-center transition-all cursor-pointer ${
                      formData.budgetRange === b
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-semibold'
                        : 'bg-[#050b08] text-gray-400 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                Estimated Timeline
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TIMELINE_OPTIONS.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setFormData({ ...formData, timeline: t })}
                    className={`p-3 rounded-xl text-xs font-mono text-left transition-all cursor-pointer ${
                      formData.timeline === t
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-semibold'
                        : 'bg-[#050b08] text-gray-400 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional File Attachment */}
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                Attachment / Specs (PDF, DOCX, ZIP)
              </label>
              <label className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-white/15 hover:border-emerald-400/40 bg-[#050b08] cursor-pointer transition-colors">
                <Upload size={20} className="text-emerald-400 mb-2" />
                <span className="text-xs text-gray-300 font-medium">
                  {selectedFile ? selectedFile.name : 'Upload specification document or wireframe'}
                </span>
                <span className="text-[10px] text-gray-500 font-mono mt-1">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Max 25MB'}
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.docx,.zip,.png,.jpg,.jpeg"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                Additional Notes
              </label>
              <textarea
                rows={2}
                value={formData.additionalMessage}
                onChange={(e) => setFormData({ ...formData, additionalMessage: e.target.value })}
                placeholder="Any special compliance, deadlines, or integrations we should be aware of?"
                className="w-full px-4 py-3 rounded-xl bg-[#050b08] border border-white/10 focus:border-emerald-400 text-white placeholder-gray-600 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex items-center justify-center gap-3 w-full py-4 px-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all duration-200 shadow-[0_0_24px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Transmitting Requirements...</span>
            ) : (
              <>
                <span>Send Project Request</span>
                <ArrowUpRight
                  size={16}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        {/* Sidebar Info (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-[#091510] border border-emerald-500/20 flex flex-col gap-4">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              The KBX Guarantee
            </span>
            <div className="flex flex-col gap-3 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <Shield size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Direct NDA protected communication. Your ideas remain strictly confidential.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Response with technical feasibility notes within 24 hours.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Fixed milestones with transparent deliverables. No hidden hourly creep.</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#060e0a] border border-white/[0.08] flex flex-col gap-3 text-xs">
            <span className="font-mono uppercase text-gray-400">Prefer direct communication?</span>
            <p className="text-gray-300">
              If you already have an RFP or would like to schedule an exploratory call:
            </p>
            <a
              href="mailto:krishna@kbx.dev"
              className="text-emerald-400 font-mono hover:underline"
            >
              krishna@kbx.dev
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
