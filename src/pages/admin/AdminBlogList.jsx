import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { Loader2, Plus, Edit, Trash2, CheckSquare, Square, Eye, EyeOff, Bold, Italic, Underline, List, Link, Image as ImageIcon, Type, AlignLeft, Code, X, Save, ChevronDown, ChevronUp } from 'lucide-react';

const EMPTY_FORM = { title: '', excerpt: '', content: '', coverImage: '', category: '', author: 'Admin', isPublished: false };

const AdminBlogList = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const contentRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/blog?limit=100');
      if (res.data.success) setPosts(res.data.data);
    } catch { } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedIds(selectedIds.length === posts.length ? [] : posts.map(p => p.id));

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} posts?`)) return;
    setBulkLoading(true);
    try {
      await api.post('/blog/bulk-delete', { ids: selectedIds });
      setPosts(prev => prev.filter(p => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    } catch { alert('Bulk delete failed'); } finally { setBulkLoading(false); }
  };

  const handleBulkPublish = async (isPublished) => {
    setBulkLoading(true);
    try {
      await api.post('/blog/bulk-publish', { ids: selectedIds, isPublished });
      setPosts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, isPublished } : p));
      setSelectedIds([]);
    } catch { alert('Failed'); } finally { setBulkLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/blog/${id}`);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch { alert('Delete failed'); }
  };

  const openNew = () => { setForm(EMPTY_FORM); setEditingId(null); setPreviewMode(false); setShowForm(true); };
  const openEdit = (post) => {
    setForm({ title: post.title, excerpt: post.excerpt || '', content: post.content, coverImage: post.coverImage || '', category: post.category || '', author: post.author || 'Admin', isPublished: post.isPublished });
    setEditingId(post.id);
    setPreviewMode(false);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return alert('Title and content are required.');
    setSaving(true);
    try {
      if (editingId) {
        const res = await api.put(`/blog/${editingId}`, form);
        if (res.data.success) setPosts(prev => prev.map(p => p.id === editingId ? { ...p, ...res.data.data } : p));
      } else {
        const res = await api.post('/blog', form);
        if (res.data.success) setPosts(prev => [res.data.data, ...prev]);
      }
      setShowForm(false);
    } catch (err) { alert(err.response?.data?.message || 'Save failed'); } finally { setSaving(false); }
  };

  // Image file → base64 (stored as data URL in coverImage field)
  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => { setForm(f => ({ ...f, coverImage: ev.target.result })); setImageUploading(false); };
    reader.readAsDataURL(file);
  };

  // HTML toolbar: wrap selection or insert tag at cursor
  const insertHTML = (before, after = '') => {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end);
    const newVal = el.value.substring(0, start) + before + selected + after + el.value.substring(end);
    setForm(f => ({ ...f, content: newVal }));
    setTimeout(() => { el.focus(); el.selectionStart = start + before.length; el.selectionEnd = start + before.length + selected.length; }, 0);
  };

  const toolbarActions = [
    { icon: <Bold size={14} />, title: 'Bold', action: () => insertHTML('<strong>', '</strong>') },
    { icon: <Italic size={14} />, title: 'Italic', action: () => insertHTML('<em>', '</em>') },
    { icon: <Underline size={14} />, title: 'Underline', action: () => insertHTML('<u>', '</u>') },
    { icon: <Type size={14} />, title: 'Heading 2', action: () => insertHTML('<h2>', '</h2>') },
    { icon: <span className="text-[10px] font-bold">H3</span>, title: 'Heading 3', action: () => insertHTML('<h3>', '</h3>') },
    { icon: <List size={14} />, title: 'List Item', action: () => insertHTML('<ul>\n  <li>', '</li>\n</ul>') },
    { icon: <AlignLeft size={14} />, title: 'Paragraph', action: () => insertHTML('<p>', '</p>') },
    { icon: <Link size={14} />, title: 'Link', action: () => insertHTML('<a href="URL">', '</a>') },
    { icon: <ImageIcon size={14} />, title: 'Image', action: () => insertHTML('<img src="URL" alt="', '" />') },
    { icon: <Code size={14} />, title: 'Code', action: () => insertHTML('<code>', '</code>') },
    { icon: <span className="text-[10px] font-bold">HR</span>, title: 'Divider', action: () => insertHTML('\n<hr />\n') },
    { icon: <span className="text-[10px] font-bold">BQ</span>, title: 'Blockquote', action: () => insertHTML('<blockquote>', '</blockquote>') },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-cinzel text-3xl font-bold text-white tracking-widest uppercase">Blog Posts</h2>
          <p className="text-ivory/60 mt-2">Manage <span className="text-gold">{posts.length}</span> articles</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-gold text-black px-6 py-3 rounded-lg font-cinzel text-[10px] tracking-widest uppercase font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(201,168,76,0.3)]">
          <Plus size={16} /> New Post
        </button>
      </header>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 bg-gold/10 border border-gold/20 rounded-xl px-6 py-3">
          <span className="font-cinzel text-xs text-gold uppercase tracking-widest">{selectedIds.length} selected</span>
          <div className="flex gap-2 ml-auto">
            <button onClick={() => handleBulkPublish(true)} disabled={bulkLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg font-cinzel text-[10px] uppercase tracking-widest hover:bg-green-500/20 disabled:opacity-50">
              {bulkLoading ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />} Publish
            </button>
            <button onClick={() => handleBulkPublish(false)} disabled={bulkLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg font-cinzel text-[10px] uppercase tracking-widest hover:bg-amber-500/20 disabled:opacity-50">
              {bulkLoading ? <Loader2 size={12} className="animate-spin" /> : <EyeOff size={12} />} Unpublish
            </button>
            <button onClick={handleBulkDelete} disabled={bulkLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg font-cinzel text-[10px] uppercase tracking-widest hover:bg-red-500/20 disabled:opacity-50">
              {bulkLoading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Delete
            </button>
          </div>
        </div>
      )}

      {/* Post Editor Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="w-full max-w-5xl bg-[#0a0a0a] border border-gold/20 rounded-xl shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gold/10">
              <h3 className="font-cinzel text-lg font-bold text-gold uppercase tracking-widest">
                {editingId ? 'Edit Post' : 'New Post'}
              </h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setPreviewMode(p => !p)}
                  className="flex items-center gap-2 px-4 py-2 text-ivory/60 hover:text-gold border border-white/10 hover:border-gold/30 rounded-lg font-cinzel text-[10px] uppercase tracking-widest transition-all">
                  <Eye size={12} /> {previewMode ? 'Editor' : 'Preview'}
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 bg-gold text-black px-5 py-2 rounded-lg font-cinzel text-[10px] uppercase tracking-widest font-bold hover:bg-gold/90 disabled:opacity-50">
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
                </button>
                <button onClick={() => setShowForm(false)} className="p-2 text-ivory/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Meta Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] text-gold font-cinzel tracking-widest uppercase mb-2">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold outline-none font-cinzel text-lg"
                    placeholder="Post title..." />
                </div>
                <div>
                  <label className="block text-[10px] text-gold font-cinzel tracking-widest uppercase mb-2">Category</label>
                  <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold outline-none"
                    placeholder="e.g. NFL, NBA, History..." />
                </div>
                <div>
                  <label className="block text-[10px] text-gold font-cinzel tracking-widest uppercase mb-2">Author</label>
                  <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold outline-none"
                    placeholder="Author name" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] text-gold font-cinzel tracking-widest uppercase mb-2">Excerpt / Summary</label>
                  <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                    rows={2} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold outline-none resize-none"
                    placeholder="Short summary shown in blog listing..." />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-[10px] text-gold font-cinzel tracking-widest uppercase mb-2">Cover Image</label>
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <input value={form.coverImage} onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold outline-none text-sm"
                      placeholder="Paste image URL here..." />
                    <div className="flex items-center gap-2">
                      <span className="text-ivory/30 text-xs font-raleway">— or —</span>
                      <button onClick={() => fileInputRef.current?.click()}
                        disabled={imageUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-gold/30 rounded-lg text-ivory/60 hover:text-gold font-cinzel text-[10px] uppercase tracking-widest transition-all disabled:opacity-50">
                        {imageUploading ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />}
                        Upload File
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
                    </div>
                  </div>
                  {form.coverImage && (
                    <div className="w-24 h-24 border border-gold/20 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={form.coverImage} alt="cover" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                    </div>
                  )}
                </div>
              </div>

              {/* HTML Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] text-gold font-cinzel tracking-widest uppercase">Content (HTML) *</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[10px] text-ivory/40 font-cinzel uppercase tracking-widest">Published</span>
                    <div onClick={() => setForm(f => ({ ...f, isPublished: !f.isPublished }))}
                      className={`w-10 h-5 rounded-full transition-colors relative ${form.isPublished ? 'bg-gold' : 'bg-white/10'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.isPublished ? 'left-5' : 'left-0.5'}`} />
                    </div>
                  </label>
                </div>

                {/* Toolbar */}
                {!previewMode && (
                  <div className="flex flex-wrap gap-1 mb-2 p-2 bg-black border border-white/10 rounded-t-lg border-b-0">
                    {toolbarActions.map((btn, i) => (
                      <button key={i} onClick={btn.action} title={btn.title}
                        className="w-8 h-8 flex items-center justify-center text-ivory/50 hover:text-gold hover:bg-gold/10 rounded transition-all border border-transparent hover:border-gold/20">
                        {btn.icon}
                      </button>
                    ))}
                    <div className="w-px bg-white/10 mx-1" />
                    <button onClick={() => setForm(f => ({ ...f, content: '' }))} title="Clear all"
                      className="w-8 h-8 flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-all">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {previewMode ? (
                  <div
                    className="min-h-[400px] bg-black border border-white/10 rounded-lg p-6 prose prose-invert max-w-none text-ivory/80
                      [&_h1]:text-gold [&_h1]:font-cinzel [&_h1]:text-3xl [&_h1]:mb-4
                      [&_h2]:text-gold [&_h2]:font-cinzel [&_h2]:text-2xl [&_h2]:mb-3
                      [&_h3]:text-gold/80 [&_h3]:font-cinzel [&_h3]:text-xl [&_h3]:mb-2
                      [&_p]:mb-4 [&_p]:leading-relaxed
                      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
                      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                      [&_li]:mb-1
                      [&_a]:text-gold [&_a]:underline
                      [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-ivory/60
                      [&_code]:bg-white/10 [&_code]:px-1 [&_code]:rounded
                      [&_hr]:border-gold/20 [&_hr]:my-8
                      [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4
                      [&_strong]:text-white"
                    dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-ivory/20">Nothing to preview yet.</p>' }}
                  />
                ) : (
                  <textarea
                    ref={contentRef}
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    rows={20}
                    className="w-full bg-black border border-white/10 rounded-b-lg px-4 py-4 text-white focus:border-gold outline-none font-mono text-sm resize-y leading-relaxed"
                    placeholder={'<h2>Your heading here</h2>\n<p>Write your content in HTML...</p>\n\n<p>Use the toolbar above to insert tags quickly.</p>'}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-surface border border-gold/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 size={40} className="text-gold animate-spin" />
            <p className="font-cinzel text-xs text-gold uppercase tracking-widest">Loading Posts...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-ivory/40">
                  <th className="px-4 py-4 w-10">
                    <button onClick={toggleSelectAll} className="text-ivory/40 hover:text-gold transition-colors">
                      {selectedIds.length === posts.length && posts.length > 0 ? <CheckSquare size={16} className="text-gold" /> : <Square size={16} />}
                    </button>
                  </th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {posts.map(post => (
                  <tr key={post.id} className={`hover:bg-white/5 transition-colors ${selectedIds.includes(post.id) ? 'bg-gold/5' : ''}`}>
                    <td className="px-4 py-4">
                      <button onClick={() => toggleSelect(post.id)} className="text-ivory/40 hover:text-gold transition-colors">
                        {selectedIds.includes(post.id) ? <CheckSquare size={16} className="text-gold" /> : <Square size={16} />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.coverImage ? (
                          <img src={post.coverImage} alt="" className="w-10 h-10 object-cover rounded border border-gold/10 flex-shrink-0" onError={e => e.target.style.display='none'} />
                        ) : (
                          <div className="w-10 h-10 bg-black/50 border border-gold/10 rounded flex items-center justify-center flex-shrink-0">
                            <Type size={14} className="text-gold/30" />
                          </div>
                        )}
                        <p className="text-white font-bold line-clamp-1 max-w-xs">{post.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ivory/50 text-xs">{post.category || '—'}</td>
                    <td className="px-6 py-4 text-ivory/50 text-xs">{post.author}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${post.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-white/10 text-ivory/40'}`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ivory/40 text-xs font-mono">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(post)} className="p-2 text-ivory/40 hover:text-gold hover:bg-gold/10 rounded transition-all">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-ivory/40 hover:text-red-500 hover:bg-red-500/10 rounded transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-20 text-center font-cinzel text-xs text-ivory/20 uppercase tracking-widest">
                      No posts yet. Create your first article.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogList;
