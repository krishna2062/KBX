import React, { useState, useEffect } from 'react';
import { Save, Palette, Eye, Sparkles } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { AppearanceSettings } from '../types/admin';

export const AdminAppearance: React.FC = () => {
  const { showToast, onOpenPublicPreview } = useAdmin();

  const [appearance, setAppearance] = useState<AppearanceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getAllData().then((res) => {
      if (res && res.success && res.data) {
        setAppearance(res.data.appearance);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appearance) return;
    setSaving(true);
    try {
      await adminApi.updateAppearance(appearance);
      showToast('Appearance styling saved!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save appearance', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !appearance) {
    return <div className="py-24 text-center text-xs font-mono text-gray-400">Loading appearance controls...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Visual Theme Controls
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Appearance Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Fine-tune the brand accents, glow intensity, and visual identity of the public website.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <Save size={14} />
          <span>{saving ? 'Saving...' : 'Save Appearance'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col gap-5">
          <h2 className="font-display font-medium text-base text-white flex items-center gap-2">
            <Palette size={16} className="text-emerald-400" />
            <span>Theme &amp; Accent</span>
          </h2>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
              Primary Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={appearance.accentColor}
                onChange={(e) => setAppearance({ ...appearance, accentColor: e.target.value })}
                className="w-10 h-10 rounded-xl border border-white/20 bg-transparent cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={appearance.accentColor}
                onChange={(e) => setAppearance({ ...appearance, accentColor: e.target.value })}
                className="w-36 px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs font-mono outline-none"
              />
              <span className="text-xs font-mono text-emerald-400">Emerald Electric</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
              Atmospheric Glow Intensity
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setAppearance({ ...appearance, glowIntensity: lvl })}
                  className={`py-2 px-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    appearance.glowIntensity === lvl
                      ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-medium'
                      : 'bg-[#050b08] border border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
              Footer Studio Tagline
            </label>
            <input
              type="text"
              value={appearance.footerTagline}
              onChange={(e) => setAppearance({ ...appearance, footerTagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
            />
          </div>
        </div>

        {/* Live Preview Sample */}
        <div className="p-6 rounded-2xl bg-[#050907] border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-gray-400 font-medium mb-4 block">
              Live Brand Theme Preview
            </span>
            <div className="p-5 rounded-xl bg-[#081510] border border-emerald-500/30 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: appearance.accentColor }}
                />
                <span className="text-xs font-display font-medium text-white">
                  KBX Design System
                </span>
              </div>
              <p className="text-xs text-gray-300 font-normal leading-relaxed">
                Atmosphere rendering with glowing radial depth and Obsidian emerald surfaces.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-medium text-[#050807]"
                  style={{ backgroundColor: appearance.accentColor }}
                >
                  Primary Action
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] text-xs font-mono text-gray-400">
            {appearance.footerTagline}
          </div>
        </div>
      </form>
    </div>
  );
};
