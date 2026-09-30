import React, { useState, useEffect } from 'react';
import { Save, SearchCheck, Globe, Share2 } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { SeoSettings } from '../types/admin';

export const AdminSeo: React.FC = () => {
  const { showToast } = useAdmin();

  const [seo, setSeo] = useState<SeoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getAllData().then((res) => {
      if (res && res.success && res.data) {
        setSeo(res.data.seo);
      }
      setLoading(false);
    });
  }, []);

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seo) return;
    setSaving(true);
    try {
      await adminApi.updateSeo(seo);
      showToast('SEO & Meta settings saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save SEO settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !seo) {
    return <div className="py-24 text-center text-xs font-mono text-gray-400">Loading SEO settings...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Search Optimization &amp; Social Previews
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            SEO &amp; Meta Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Configure OpenGraph share cards, Google search titles, and indexed metadata.
          </p>
        </div>

        <button
          onClick={handleSaveSeo}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <Save size={14} />
          <span>{saving ? 'Saving...' : 'Save Meta Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSaveSeo} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Global SEO */}
          <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col gap-5">
            <h2 className="font-display font-medium text-base text-white flex items-center gap-2">
              <Globe size={16} className="text-emerald-400" />
              <span>Global Indexing &amp; Defaults</span>
            </h2>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                Default Website Title
              </label>
              <input
                type="text"
                value={seo.websiteTitle}
                onChange={(e) => setSeo({ ...seo, websiteTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                Meta Description (Recommended 150–160 chars)
              </label>
              <textarea
                rows={3}
                value={seo.metaDescription}
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs leading-relaxed outline-none focus:border-emerald-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={seo.keywords}
                  onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                  Canonical Base URL
                </label>
                <input
                  type="url"
                  value={seo.canonicalUrl}
                  onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs font-mono outline-none"
                />
              </div>
            </div>
          </div>

          {/* Social OpenGraph */}
          <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col gap-5">
            <h2 className="font-display font-medium text-base text-white flex items-center gap-2">
              <Share2 size={16} className="text-emerald-400" />
              <span>OpenGraph Social Share Preview</span>
            </h2>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                OG Social Card Title
              </label>
              <input
                type="text"
                value={seo.ogTitle}
                onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                OG Social Card Description
              </label>
              <textarea
                rows={2}
                value={seo.ogDescription}
                onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                OG Social Share Banner Image URL
              </label>
              <input
                type="text"
                value={seo.ogImage}
                onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs font-mono outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Google Search Result Simulation */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <span className="text-xs font-mono uppercase text-gray-400 font-medium">
            Google Search Preview Snippet
          </span>

          <div className="p-5 rounded-2xl bg-[#08120e] border border-white/10 flex flex-col gap-2">
            <span className="text-[11px] font-mono text-emerald-400 truncate">
              {seo.canonicalUrl}
            </span>
            <h3 className="text-sm font-medium text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
              {seo.websiteTitle}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed font-normal">
              {seo.metaDescription}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
