import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, ExternalLink, Image as ImageIcon, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { MediaPickerModal } from '../components/MediaPickerModal';
import { BrandSettings, HomeHeroSettings, SectionToggles } from '../types/admin';

export const AdminWebsiteContent: React.FC = () => {
  const { showToast, onOpenPublicPreview } = useAdmin();

  const [activeTab, setActiveTab] = useState<'hero' | 'brand' | 'sections'>('hero');
  const [hero, setHero] = useState<HomeHeroSettings | null>(null);
  const [brand, setBrand] = useState<BrandSettings | null>(null);
  const [sectionToggles, setSectionToggles] = useState<SectionToggles | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'owner' | 'hero'>('owner');

  useEffect(() => {
    adminApi.getAllData().then((res) => {
      if (res && res.success && res.data) {
        setHero(res.data.hero);
        setBrand(res.data.brand);
        setSectionToggles(res.data.sectionToggles);
      }
      setLoading(false);
    });
  }, []);

  const handleSaveAll = async () => {
    if (!hero || !brand || !sectionToggles) return;
    setSaving(true);
    try {
      await Promise.all([
        adminApi.updateHero(hero),
        adminApi.updateBrand(brand),
        adminApi.updateSectionToggles(sectionToggles)
      ]);
      showToast('Website content successfully saved and published!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save website content', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !hero || !brand || !sectionToggles) {
    return (
      <div className="py-24 text-center text-xs font-mono text-gray-400">
        Loading website content editor...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          if (mediaTarget === 'owner') {
            setBrand({ ...brand, ownerImage: url });
          } else {
            setHero({ ...hero, customImageUrl: url });
          }
        }}
        title={mediaTarget === 'owner' ? 'Select Profile Portrait' : 'Select Hero Visual Media'}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Content Management
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Website Content &amp; Hero CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Modify the copy, visual triggers, and section display rules for the public KBX website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenPublicPreview('home')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 transition-colors cursor-pointer"
          >
            <span>Preview Page</span>
            <ExternalLink size={13} />
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Segmented Sub-Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-[#081510] border border-white/10 w-fit">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
            activeTab === 'hero' ? 'bg-emerald-500 text-[#050807] font-medium' : 'text-gray-400 hover:text-white'
          }`}
        >
          Home Hero Section
        </button>
        <button
          onClick={() => setActiveTab('brand')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
            activeTab === 'brand' ? 'bg-emerald-500 text-[#050807] font-medium' : 'text-gray-400 hover:text-white'
          }`}
        >
          Brand &amp; Identity
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
            activeTab === 'sections' ? 'bg-emerald-500 text-[#050807] font-medium' : 'text-gray-400 hover:text-white'
          }`}
        >
          Section Visibility &amp; Ordering
        </button>
      </div>

      {/* TAB 1: HERO SECTION CMS */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col gap-5">
              <h2 className="font-display font-medium text-base text-white flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-400" />
                <span>Hero Typography &amp; Headlines</span>
              </h2>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Eyebrow Badge Text
                </label>
                <input
                  type="text"
                  value={hero.eyebrow}
                  onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 focus:border-emerald-400 text-white text-xs font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                    Title Segment 1 (Standard)
                  </label>
                  <input
                    type="text"
                    value={hero.titlePrefix}
                    onChange={(e) => setHero({ ...hero, titlePrefix: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 focus:border-emerald-400 text-white text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-emerald-400 uppercase mb-2">
                    Title Highlight 1 (Emerald Glow)
                  </label>
                  <input
                    type="text"
                    value={hero.titleHighlight1}
                    onChange={(e) => setHero({ ...hero, titleHighlight1: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-emerald-500/30 focus:border-emerald-400 text-emerald-300 font-semibold text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                    Title Segment 2 (Standard)
                  </label>
                  <input
                    type="text"
                    value={hero.titleMiddle}
                    onChange={(e) => setHero({ ...hero, titleMiddle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 focus:border-emerald-400 text-white text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-emerald-400 uppercase mb-2">
                    Title Highlight 2 (Emerald)
                  </label>
                  <input
                    type="text"
                    value={hero.titleHighlight2}
                    onChange={(e) => setHero({ ...hero, titleHighlight2: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-emerald-500/30 focus:border-emerald-400 text-emerald-300 font-semibold text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Hero Paragraph Description
                </label>
                <textarea
                  rows={3}
                  value={hero.description}
                  onChange={(e) => setHero({ ...hero, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 focus:border-emerald-400 text-white text-xs leading-relaxed outline-none"
                />
              </div>
            </div>

            {/* CTAs and Visual Mode */}
            <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col gap-5">
              <h2 className="font-display font-medium text-base text-white">
                Buttons &amp; 3D Visual Configuration
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                    Primary CTA Text
                  </label>
                  <input
                    type="text"
                    value={hero.primaryCtaText}
                    onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                    Secondary CTA Text
                  </label>
                  <input
                    type="text"
                    value={hero.secondaryCtaText}
                    onChange={(e) => setHero({ ...hero, secondaryCtaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Hero Visual Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['3d_object', 'image', 'video'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setHero({ ...hero, visualType: type })}
                      className={`p-3 rounded-xl border text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        hero.visualType === type
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-medium'
                          : 'bg-[#050b08] border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {type === '3d_object' ? '3D Torus Object' : type === 'image' ? 'Image Visual' : 'Video Loop'}
                    </button>
                  ))}
                </div>
              </div>

              {hero.visualType !== '3d_object' && (
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                    Custom Media Asset URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={hero.customImageUrl || ''}
                      onChange={(e) => setHero({ ...hero, customImageUrl: e.target.value })}
                      placeholder="e.g. /src/assets/images/project_nexatalk.png"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget('hero');
                        setMediaPickerOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#091811] border border-emerald-500/30 text-emerald-300 text-xs font-mono hover:bg-[#0e241b] transition-colors cursor-pointer"
                    >
                      Select Media
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Floating Bar */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
                <span className="text-xs font-mono uppercase text-gray-400">
                  Bottom Feature Ribbon Copy
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={hero.bottomBannerText}
                    onChange={(e) => setHero({ ...hero, bottomBannerText: e.target.value })}
                    placeholder="Leading banner text"
                    className="px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                  />
                  <input
                    type="text"
                    value={hero.bottomBannerHighlight}
                    onChange={(e) => setHero({ ...hero, bottomBannerHighlight: e.target.value })}
                    placeholder="Highlighted green banner text"
                    className="px-4 py-2 rounded-xl bg-[#050b08] border border-emerald-500/25 text-emerald-300 text-xs outline-none font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Hero Preview Card */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <span className="text-xs font-mono uppercase text-gray-400 font-medium">
              Live Desktop Layout Preview
            </span>
            <div className="p-6 rounded-2xl bg-[#050a08] border border-emerald-500/20 flex flex-col gap-4 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono tracking-widest uppercase w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{hero.eyebrow}</span>
              </div>

              <h3 className="font-display font-medium text-xl sm:text-2xl text-white tracking-tight leading-tight">
                {hero.titlePrefix} <span className="font-semibold text-emerald-400">{hero.titleHighlight1}</span> {hero.titleMiddle} <span className="font-semibold text-emerald-300">{hero.titleHighlight2}</span>
              </h3>

              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                {hero.description}
              </p>

              <div className="flex items-center gap-2 pt-2">
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-[#050807] font-medium text-[11px]">
                  {hero.primaryCtaText}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/[0.06] text-gray-300 text-[11px]">
                  {hero.secondaryCtaText}
                </span>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-[#081610] border border-emerald-500/20 text-[11px] text-gray-300">
                {hero.bottomBannerText} <span className="text-emerald-400">{hero.bottomBannerHighlight}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BRAND & OWNER SETTINGS */}
      {activeTab === 'brand' && (
        <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
              Brand / Studio Name
            </label>
            <input
              type="text"
              value={brand.brandName}
              onChange={(e) => setBrand({ ...brand, brandName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
              Owner Full Name
            </label>
            <input
              type="text"
              value={brand.ownerName}
              onChange={(e) => setBrand({ ...brand, ownerName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-sm outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
              Owner Professional Title / Positioning
            </label>
            <input
              type="text"
              value={brand.ownerTitle}
              onChange={(e) => setBrand({ ...brand, ownerTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-sm outline-none"
            />
          </div>

          {/* Profile Image with Media Picker */}
          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
              Owner Profile Portrait
            </label>
            <div className="flex items-center gap-4">
              <img
                src={brand.ownerImage}
                alt={brand.ownerName}
                className="w-16 h-16 rounded-xl object-cover border border-emerald-500/30 shrink-0"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={brand.ownerImage}
                  onChange={(e) => setBrand({ ...brand, ownerImage: e.target.value })}
                  className="flex-1 px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    setMediaTarget('owner');
                    setMediaPickerOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#081810] border border-emerald-500/30 text-emerald-300 text-xs font-mono hover:bg-[#0c2217] transition-colors cursor-pointer shrink-0"
                >
                  Choose Media
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
              Primary Contact Email
            </label>
            <input
              type="email"
              value={brand.email}
              onChange={(e) => setBrand({ ...brand, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-sm outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
              Consultation Phone / WhatsApp
            </label>
            <input
              type="text"
              value={brand.phone}
              onChange={(e) => setBrand({ ...brand, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
              Studio Base &amp; Location
            </label>
            <input
              type="text"
              value={brand.location}
              onChange={(e) => setBrand({ ...brand, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
              Availability Status Badge
            </label>
            <input
              type="text"
              value={brand.availabilityStatus}
              onChange={(e) => setBrand({ ...brand, availabilityStatus: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
              GitHub Profile Link
            </label>
            <input
              type="url"
              value={brand.github}
              onChange={(e) => setBrand({ ...brand, github: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-sm outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
              LinkedIn Profile Link
            </label>
            <input
              type="url"
              value={brand.linkedin}
              onChange={(e) => setBrand({ ...brand, linkedin: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-sm outline-none font-mono"
            />
          </div>
        </div>
      )}

      {/* TAB 3: SECTION VISIBILITY & ORDER */}
      {activeTab === 'sections' && (
        <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col gap-6">
          <div>
            <h2 className="font-display font-medium text-base text-white mb-1">
              Public Homepage Section Toggles
            </h2>
            <p className="text-xs text-gray-400 font-normal">
              Disable or enable sections from appearing on the public customer website.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'trust', label: 'Trust & Engineering Pillars', desc: '4 Core Lifecycle Foundations' },
              { key: 'services', label: 'What I Build (Services)', desc: 'Full-stack service capabilities rows' },
              { key: 'projects', label: 'Selected Work (Projects)', desc: 'Large editorial project showcases' },
              { key: 'about', label: 'About Krishna (Person Behind)', desc: 'Portrait & engineering philosophy' },
              { key: 'technologies', label: 'Core Technical Stack', desc: 'Infinite horizontal tech marquee' },
              { key: 'process', label: 'Development Process', desc: '7-phase interactive engineering pipeline' },
              { key: 'whyWorkWithMe', label: 'Why Work With Me', desc: 'Custom code ownership commitment' },
              { key: 'testimonials', label: 'Client Testimonials', desc: 'Shown only when published quotes exist' },
              { key: 'cta', label: 'Have An Idea? CTA Box', desc: 'Bottom start-project interactive banner' }
            ].map((sec) => {
              const isEnabled = (sectionToggles as any)[sec.key];
              return (
                <div
                  key={sec.key}
                  className={`p-4 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                    isEnabled ? 'bg-[#091911] border-emerald-500/30' : 'bg-[#050b08] border-white/10 opacity-60'
                  }`}
                >
                  <div>
                    <h3 className="text-xs font-medium text-white mb-0.5">{sec.label}</h3>
                    <p className="text-[11px] text-gray-400 font-normal leading-tight">{sec.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSectionToggles({
                        ...sectionToggles,
                        [sec.key]: !isEnabled
                      })
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      isEnabled ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-[#050807] transition-transform ${
                        isEnabled ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
