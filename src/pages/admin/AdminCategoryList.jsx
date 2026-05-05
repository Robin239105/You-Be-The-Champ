import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, Tag, Upload, ImagePlus, X } from 'lucide-react';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setCategoryDescription(category ? (category.description || '') : '');
    setCategoryImage(category ? (category.image || '') : '');
    setShowModal(true);
  };

  const handleImportDescriptions = async () => {
    if (!window.confirm('This will update all category descriptions from categories.csv on the server. Continue?')) return;
    setIsImporting(true);
    setImportResult('');
    try {
      const res = await api.post('/categories/import-descriptions');
      if (res.data.success) {
        setImportResult(res.data.message);
        fetchCategories();
      } else {
        setImportResult('Failed: ' + res.data.message);
      }
    } catch (err) {
      setImportResult('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsImporting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = { name: categoryName, description: categoryDescription, image: categoryImage || null };
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, payload);
      } else {
        await api.post('/categories', payload);
      }
      fetchCategories();
      setShowModal(false);
      setCategoryImage('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success) {
        setCategoryImage(res.data.url);
      } else {
        alert(res.data.message || 'Upload failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Image upload failed. You can paste a URL instead.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will not delete products, but they will be uncategorized.')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-3xl text-white uppercase tracking-[4px]">Categories</h1>
          <p className="text-gold/60 text-xs mt-2 uppercase tracking-widest">Manage store collections & taxonomy</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleImportDescriptions}
            disabled={isImporting}
            className="border border-gold/30 text-gold px-5 py-3 font-cinzel font-bold text-xs uppercase tracking-widest hover:bg-gold/10 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isImporting ? 'Importing...' : 'Import Descriptions from CSV'}
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-gold text-black px-6 py-3 font-cinzel font-bold text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(201,168,76,0.2)]"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>
        {importResult && (
          <p className="text-[10px] font-raleway mt-2 text-gold/70">{importResult}</p>
        )}
      </div>

      <div className="bg-surface border border-gold/10 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-gold/10 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={18} />
            <input 
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-gold/10 py-3 pl-12 pr-4 text-white focus:border-gold outline-none transition-all font-raleway text-sm"
            />
          </div>
          <div className="text-[10px] text-gold/40 uppercase tracking-widest">
            {filteredCategories.length} Categories Found
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 border-b border-gold/10">
                <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel">Image</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel">Category Name</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel">Slug</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel text-center">Products</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin text-gold mx-auto mb-4" size={32} />
                    <p className="text-gold/40 text-[10px] uppercase tracking-widest">Retrieving collections...</p>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <p className="text-gold/40 text-[10px] uppercase tracking-widest">No categories found</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gold/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-lg object-cover border border-gold/10" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gold/5 border border-gold/10 flex items-center justify-center text-gold/40">
                          <Tag size={18} />
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-white font-cinzel tracking-wider">{cat.name}</span>
                    </td>
                    <td className="px-8 py-6">
                      <code className="text-[10px] bg-black/40 text-gold/60 px-2 py-1 rounded border border-gold/5 uppercase tracking-widest">{cat.slug}</code>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-ivory font-raleway font-bold">{cat._count?.products || 0}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(cat)}
                          className="p-2 text-gold/60 hover:text-gold hover:bg-gold/10 rounded transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-crimson/60 hover:text-crimson hover:bg-crimson/10 rounded transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface border border-gold/20 p-8 shadow-2xl"
            >
              <h2 className="font-cinzel text-xl text-white uppercase tracking-widest mb-6 border-b border-gold/10 pb-4">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[2px] text-gold mb-2 font-cinzel">Category Name</label>
                  <input 
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    autoFocus
                    required
                    className="w-full bg-black/40 border border-gold/10 py-4 px-4 text-white focus:border-gold outline-none transition-all font-raleway text-sm"
                    placeholder="e.g. World Series Rings"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[2px] text-gold mb-2 font-cinzel">Description</label>
                  <textarea
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-black/40 border border-gold/10 py-3 px-4 text-white focus:border-gold outline-none transition-all font-raleway text-sm resize-none"
                    placeholder="Short description shown on the category page"
                  />
                </div>

                {/* Image Section */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[2px] text-gold mb-2 font-cinzel">Category Image</label>
                  
                  {/* Preview */}
                  {categoryImage && (
                    <div className="relative mb-4 inline-block">
                      <img src={categoryImage} alt="Preview" className="w-32 h-32 object-cover rounded border border-gold/20" />
                      <button
                        type="button"
                        onClick={() => setCategoryImage('')}
                        className="absolute -top-2 -right-2 p-1 bg-crimson text-white rounded-full hover:scale-110 transition-transform"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  {/* URL Input */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={categoryImage}
                      onChange={(e) => setCategoryImage(e.target.value)}
                      placeholder="Paste image URL..."
                      className="flex-1 bg-black/40 border border-gold/10 py-3 px-4 text-white focus:border-gold outline-none transition-all font-raleway text-sm"
                    />
                  </div>

                  {/* File Upload */}
                  <label className="flex items-center justify-center gap-2 w-full border border-dashed border-gold/20 py-4 cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    />
                    {isUploadingImage ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-gold" />
                        <span className="text-[10px] text-gold font-cinzel uppercase tracking-widest">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="text-gold/40 group-hover:text-gold transition-colors" />
                        <span className="text-[10px] text-ivory/40 group-hover:text-gold font-cinzel uppercase tracking-widest transition-colors">Click or drop image to upload to Cloudinary</span>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-4 font-cinzel text-[10px] uppercase tracking-widest text-gold/60 hover:text-gold border border-gold/10 hover:border-gold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-2 bg-gold text-black px-8 py-4 font-cinzel font-bold text-[10px] uppercase tracking-[2px] hover:bg-white transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategoryList;
