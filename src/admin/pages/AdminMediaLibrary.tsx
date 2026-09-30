import React, { useState, useEffect } from 'react';
import {
  Upload,
  Search,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  Film,
  FileText,
  ExternalLink
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { CmsMediaItem } from '../types/admin';

export const AdminMediaLibrary: React.FC = () => {
  const { showToast } = useAdmin();

  const [mediaList, setMediaList] = useState<CmsMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<CmsMediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchMedia = async () => {
    try {
      const res = await adminApi.getMedia();
      if (res && res.success) {
        setMediaList(res.media);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch media assets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        try {
          const res = await adminApi.uploadMedia({
            filename: file.name,
            url: dataUrl,
            fileType: file.type.startsWith('video') ? 'video' : file.type.includes('pdf') ? 'document' : 'image',
            sizeBytes: file.size,
            dimensions: '1920x1080'
          });
          if (res && res.success) {
            showToast(`Uploaded ${file.name}`, 'success');
            fetchMedia();
          }
        } catch (err: any) {
          showToast(err.message || 'Upload failed', 'error');
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyUrl = (item: CmsMediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    showToast('Asset URL copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteMedia(deleteTarget.id);
      showToast(`Deleted ${deleteTarget.filename}`, 'info');
      setDeleteTarget(null);
      fetchMedia();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    const matchSearch = m.filename.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || m.fileType === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="flex flex-col gap-6">
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Media Asset"
        message={`Delete "${deleteTarget?.filename}"? Any project or service referencing this asset may show a missing preview.`}
        confirmText="Delete File"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Digital Asset Store
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Media Library
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Central repository of mockups, portraits, and diagrams used across the KBX brand.
          </p>
        </div>

        <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer self-start sm:self-auto">
          <Upload size={14} />
          <span>{isUploading ? 'Uploading File...' : 'Upload Media Asset'}</span>
          <input
            type="file"
            accept="image/*,video/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search media by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#08130f] border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#081510] border border-white/10 w-fit">
          {['all', 'image', 'video', 'document'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                filterType === type ? 'bg-emerald-500 text-[#050807] font-medium' : 'text-gray-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No media assets found"
          description="Upload project mockups or brand assets to use them across your CMS editors."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-[#08130f] border border-emerald-500/15 hover:border-emerald-500/35 overflow-hidden flex flex-col justify-between transition-all shadow-md"
            >
              <div className="relative aspect-video bg-[#050b08] overflow-hidden">
                {item.fileType === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    {item.fileType === 'video' ? <Film size={32} /> : <FileText size={32} />}
                  </div>
                )}
                <span className="absolute top-2 left-2 text-[9px] font-mono uppercase bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-emerald-400 border border-white/10">
                  {item.fileType}
                </span>
              </div>

              <div className="p-3.5 flex flex-col gap-1">
                <span className="text-xs font-medium text-white truncate" title={item.filename}>
                  {item.filename}
                </span>
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                  <span>{(item.sizeBytes / 1024).toFixed(0)} KB</span>
                  <span>{item.dimensions || '1920x1080'}</span>
                </div>
              </div>

              <div className="px-3.5 pb-3 pt-1 border-t border-white/[0.04] flex items-center justify-between">
                <button
                  onClick={() => handleCopyUrl(item)}
                  className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  {copiedId === item.id ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                </button>

                <button
                  onClick={() => setDeleteTarget(item)}
                  className="p-1 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                  title="Delete file"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
