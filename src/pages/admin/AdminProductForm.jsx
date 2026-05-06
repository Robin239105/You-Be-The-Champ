import React, { useState, useEffect } from 'react';
import { Save, X, Upload, Plus, Trash2, ChevronLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';

const AdminProductForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    salePrice: '',
    stockQuantity: '',
    status: 'DRAFT',
    description: '',
    shortDescription: '',
    isFeatured: false,
    categories: [],
    tags: [],
    metaTitle: '',
    metaDescription: ''
  });

  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/tree');
      if (response.data.success) {
        // Flatten tree for checkbox display
        const flattenTree = (nodes, level = 0) => {
          let result = [];
          nodes.forEach(node => {
            result.push({ ...node, level });
            if (node.children && node.children.length > 0) {
              result = result.concat(flattenTree(node.children, level + 1));
            }
          });
          return result;
        };
        setAvailableCategories(flattenTree(response.data.data));
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data.success) {
        const p = response.data.data;
        setFormData({
          name: p.name || '',
          sku: p.sku || '',
          price: p.price || '',
          salePrice: p.salePrice || '',
          stockQuantity: p.stockQuantity || 0,
          status: p.status || 'DRAFT',
          description: p.description || '',
          shortDescription: p.shortDescription || '',
          isFeatured: p.isFeatured || false,
          categories: p.categories?.map(c => c.id) || [],
          tags: p.tags || [],
          metaTitle: p.metaTitle || '',
          metaDescription: p.metaDescription || ''
        });
        setImages(p.images || []);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (isEdit && id) {
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl) {
      setImages(prev => [...prev, { url: newImageUrl, isPrimary: prev.length === 0 }]);
      setNewImageUrl('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload/local', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setImages(prev => [...prev, { url: response.data.url, isPrimary: prev.length === 0 }]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stockQuantity: parseInt(formData.stockQuantity),
        images: images
      };

      let response;
      if (isEdit) {
        response = await api.put(`/products/${id}`, payload);
      } else {
        response = await api.post('/products', payload);
      }

      if (response.data.success) {
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      alert(error.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-40">
        <Loader2 size={48} className="text-gold animate-spin mb-4" />
        <p className="font-cinzel text-xs text-gold uppercase tracking-[3px]">Loading Product Details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => navigate('/admin/products')}
            className="p-2 text-ivory/40 hover:text-gold hover:bg-gold/10 rounded-full transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="font-cinzel text-3xl font-bold text-white tracking-widest uppercase">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-ivory/60 mt-2">Fill in the details below to {isEdit ? 'update' : 'create'} the product.</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gold text-black px-8 py-3 rounded-lg font-cinzel text-xs tracking-widest uppercase font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(201,168,76,0.3)] disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isEdit ? 'Update Product' : 'Publish Product'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <section className="bg-surface border border-gold/10 p-8 rounded-xl space-y-6">
            <h3 className="font-cinzel text-lg text-gold uppercase tracking-widest border-b border-gold/10 pb-4">General Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Product Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-white focus:border-gold outline-none transition-colors"
                  placeholder="e.g. Super Bowl 58 Replica Ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">SKU</label>
                  <input 
                    type="text" 
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-white focus:border-gold outline-none transition-colors uppercase font-mono"
                    placeholder="SB58-PACK"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Stock Quantity</label>
                  <input 
                    type="number" 
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-white focus:border-gold outline-none transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="bg-surface border border-gold/10 p-8 rounded-xl space-y-6">
            <h3 className="font-cinzel text-lg text-gold uppercase tracking-widest border-b border-gold/10 pb-4">Product Description</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Short Description</label>
                <textarea 
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-white focus:border-gold outline-none transition-colors resize-none"
                  placeholder="A brief highlight for the product listing page..."
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Full Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="10"
                  className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-white focus:border-gold outline-none transition-colors resize-none"
                  placeholder="Write detailed product information..."
                />
              </div>
            </div>
          </section>

          {/* SEO */}
          <section className="bg-surface border border-gold/10 p-8 rounded-xl space-y-6">
            <h3 className="font-cinzel text-lg text-gold uppercase tracking-widest border-b border-gold/10 pb-4">SEO Metadata</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Meta Title</label>
                <input 
                  type="text" 
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-white focus:border-gold outline-none transition-colors"
                  placeholder="Product name for Google search..."
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Meta Description</label>
                <textarea 
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-white focus:border-gold outline-none transition-colors resize-none"
                  placeholder="The snippet that appears under the search result link..."
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info Area */}
        <div className="space-y-8">
          {/* Pricing & Status */}
          <section className="bg-surface border border-gold/10 p-8 rounded-xl space-y-6">
             <div>
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-white focus:border-gold outline-none transition-colors uppercase text-xs tracking-widest"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
             </div>
             <div className="pt-4 border-t border-gold/10">
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Regular Price ($)</label>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-white focus:border-gold outline-none transition-colors"
                  placeholder="35.00"
                />
             </div>
             <div>
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Sale Price ($)</label>
                <input 
                  type="number" 
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-white focus:border-gold outline-none transition-colors"
                  placeholder="Optional"
                />
             </div>
             <div className="flex items-center gap-3 pt-4">
                <input 
                  type="checkbox" 
                  id="isFeatured" 
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-gold" 
                />
                <label htmlFor="isFeatured" className="text-xs uppercase tracking-widest text-ivory/80 cursor-pointer">Mark as Featured</label>
             </div>
          </section>

          {/* Media */}
          <section className="bg-surface border border-gold/10 p-8 rounded-xl space-y-6">
            <h3 className="font-cinzel text-sm text-gold uppercase tracking-widest">Product Images</h3>
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square bg-black rounded border border-white/10 group overflow-hidden">
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-crimson text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <Trash2 size={12} />
                  </button>
                  <img src={typeof img === 'string' ? img : img.url} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input 
                type="text" 
                placeholder="Image URL..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 bg-black border border-white/10 rounded py-2 px-3 text-xs text-white outline-none focus:border-gold"
              />
              <button 
                type="button"
                onClick={handleAddImage}
                className="bg-gold text-black p-2 rounded hover:scale-105 transition-transform"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {/* File Upload */}
            <div className="mt-4">
              <label className="flex items-center justify-center gap-2 w-full border border-dashed border-white/20 py-4 cursor-pointer hover:border-gold hover:bg-gold/5 transition-all rounded">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-gold" />
                    <span className="text-[10px] text-gold font-cinzel uppercase tracking-widest">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} className="text-white/40" />
                    <span className="text-[10px] text-white/40 font-cinzel uppercase tracking-widest">Click to upload image</span>
                  </>
                )}
              </label>
            </div>
          </section>

          {/* Taxonomy */}
          <section className="bg-surface border border-gold/10 p-8 rounded-xl space-y-6">
            <div>
               <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Categories</label>
               <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar bg-black/20 p-4 border border-white/5 rounded-lg">
                  {availableCategories.map(cat => (
                    <div key={cat.id} className="flex items-center gap-3" style={{ paddingLeft: `${(cat.level || 0) * 16}px` }}>
                      <input 
                        type="checkbox" 
                        id={`cat-${cat.id}`} 
                        className="accent-gold w-4 h-4"
                        checked={formData.categories.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, categories: [...formData.categories, cat.id]});
                          } else {
                            setFormData({...formData, categories: formData.categories.filter(id => id !== cat.id)});
                          }
                        }}
                      />
                      <label htmlFor={`cat-${cat.id}`} className="text-xs text-ivory/60 hover:text-gold cursor-pointer transition-colors flex items-center gap-2">
                        {cat.image && <img src={cat.image} alt="" className="w-5 h-5 rounded object-cover" />}
                        <span>{cat.name}</span>
                        {cat.level > 0 && <span className="text-[9px] text-gold/30">({cat.children?.length || 0} children)</span>}
                      </label>
                    </div>
                  ))}
               </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
};

export default AdminProductForm;
