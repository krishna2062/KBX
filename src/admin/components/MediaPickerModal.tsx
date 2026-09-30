import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Image as ImageIcon, Search } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { CmsMediaItem } from '../types/admin';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mediaUrl: string, filename?: string) => void;
  title?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media from Library'
}) => {
  const [mediaList, setMediaList] = useState<CmsMediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      adminApi.getMedia().then((res) => {
        if (res && res.success) {
          setMediaList(res.media);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);

      // Create a persistent local object URL / data URL for preview
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        try {
          const res = await adminApi.uploadMedia({
            filename: file.name,
            url: dataUrl,
            fileType: file.type.startsWith('video') ? 'video' : 'image',
            sizeBytes: file.size,
            dimensions: '1920x1080'
          });
          if (res && res.success) {
            setMediaList((prev) => [res.media, ...prev]);
            setSelectedUrl(res.media.url);
          }
        } catch (err) {
          console.error('Failed to upload media:', err);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl bg-[#08130f] border border-emerald-500/25 p-6 flex flex-col shadow-2xl animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ImageIcon size={16} />
            </div>
            <h3 className="font-display font-medium text-base sm:text-lg text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Toolbar: Search + Upload */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search media by filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#050b08] border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0d2218] hover:bg-[#122e20] border border-emerald-500/30 text-emerald-300 text-xs font-mono transition-colors cursor-pointer shrink-0">
            <Upload size={14} />
            <span>{isUploading ? 'Uploading...' : 'Upload New'}</span>
            <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto min-h-[260px] max-h-[420px] pr-1">
          {filteredMedia.length === 0 ? (
            <div className="py-16 text-center text-xs text-gray-400 font-mono">
              No media found in library. Upload a file above.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredMedia.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedUrl(item.url)}
                    className={`group relative rounded-xl overflow-hidden aspect-video border transition-all cursor-pointer bg-[#050b08] ${
                      isSelected
                        ? 'border-emerald-400 ring-2 ring-emerald-500/40'
                        : 'border-white/10 hover:border-emerald-500/40'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                      <span className="text-[10px] font-mono text-white truncate">
                        {item.filename}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-[#050807] flex items-center justify-center shadow">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.08]">
          <span className="text-xs font-mono text-gray-400">
            {selectedUrl ? 'Asset selected' : 'Click an image to select'}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={!selectedUrl}
              onClick={() => {
                if (selectedUrl) {
                  const item = mediaList.find((m) => m.url === selectedUrl);
                  onSelect(selectedUrl, item?.filename);
                  onClose();
                }
              }}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-[#050807] font-medium text-xs tracking-wide transition-all cursor-pointer"
            >
              Apply Media
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
