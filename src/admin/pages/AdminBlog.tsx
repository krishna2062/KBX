import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FileText, Search, ExternalLink, Calendar, User } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { CmsBlogPost } from '../types/admin';

export const AdminBlog: React.FC = () => {
  const { showToast } = useAdmin();

  const [posts, setPosts] = useState<CmsBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<CmsBlogPost> | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<CmsBlogPost | null>(null);

  const fetchBlog = async () => {
    try {
      const res = await adminApi.getBlog();
      if (res && res.success) {
        setPosts(res.blog);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load blog posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  const handleOpenAdd = () => {
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: 'Krishna Bhandari',
      category: 'Engineering Architecture',
      coverImage: '/src/assets/images/project_nexatalk_1790694609831.png',
      status: 'draft',
      readingTime: '4 min read',
      publishedDate: new Date().toISOString().split('T')[0]
    });
    setTagsInput('Architecture, Full-Stack');
    setModalOpen(true);
  };

  const handleOpenEdit = (post: CmsBlogPost) => {
    setEditingPost({ ...post });
    setTagsInput((post.tags || []).join(', '));
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Partial<CmsBlogPost> = {
      ...editingPost,
      tags,
      slug: editingPost.slug || editingPost.title.toLowerCase().replace(/\s+/g, '-')
    };

    try {
      if (editingPost.id) {
        await adminApi.updateBlogPost(editingPost.id, payload);
        showToast('Article updated', 'success');
      } else {
        await adminApi.createBlogPost(payload);
        showToast('Article created', 'success');
      }
      setModalOpen(false);
      fetchBlog();
    } catch (err: any) {
      showToast(err.message || 'Failed to save post', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteBlogPost(deleteTarget.id);
      showToast('Article deleted', 'info');
      setDeleteTarget(null);
      fetchBlog();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Blog Post"
        message={`Delete article "${deleteTarget?.title}"?`}
        confirmText="Delete"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Technical Insights
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Blog &amp; Architecture Articles
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Share technical essays and architecture deep-dives with clients and developers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>New Article</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search articles by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#08130f] border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-400 transition-colors"
        />
      </div>

      {/* Articles List */}
      {filteredPosts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No articles found"
          description="Write and publish engineering articles to establish thought leadership."
          actionText="Write First Post"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-5 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase bg-emerald-950/60 px-2 py-0.5 rounded">
                    {post.category}
                  </span>
                  <StatusBadge status={post.status} size="sm" />
                </div>

                <h3 className="font-display font-medium text-base text-white mb-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed font-normal line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span>{post.readingTime}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="p-1 rounded-lg text-emerald-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(post)}
                    className="p-1 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && editingPost && (
        <div
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#08130f] border border-emerald-500/25 p-6 shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-medium text-lg text-white mb-4">
              {editingPost.id ? 'Edit Article' : 'Write New Article'}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  placeholder="e.g. Why Custom Architecture Beats Page Builders"
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingPost.category || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    placeholder="Engineering Architecture"
                    className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={editingPost.readingTime || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, readingTime: e.target.value })}
                    placeholder="4 min read"
                    className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Excerpt
                </label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="Brief 1-2 sentence preview..."
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Content (Markdown / Text)
                </label>
                <textarea
                  rows={6}
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="Write full article body..."
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs leading-relaxed outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={editingPost.status || 'draft'}
                    onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none font-mono"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Architecture, Performance, SaaS"
                    className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs font-mono transition-colors cursor-pointer"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
