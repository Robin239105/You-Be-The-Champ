import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Loader2, Plus, Search, Edit, Trash2, Download, Upload } from 'lucide-react';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/products?limit=1000');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/products/export');
      if (response.data.success) {
        const dataStr = JSON.stringify(response.data.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'products_export.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      }
    } catch (err) {
      alert('Failed to export products');
    }
  };

  const handleImportClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,.csv';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          setIsImporting(true);
          let productsToImport = [];
          
          if (file.name.endsWith('.json')) {
            productsToImport = JSON.parse(event.target.result);
          } else if (file.name.endsWith('.csv')) {
            // Basic CSV to JSON converter
            const text = event.target.result;
            const rows = text.split('\n').filter(row => row.trim());
            const headers = rows[0].split(',').map(h => h.trim());
            
            productsToImport = rows.slice(1).map(row => {
              // Match fields, handling quoted strings with commas
              const regex = /(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\",]+))(?:,|$)/g;
              const values = [];
              let m;
              while ((m = regex.exec(row)) !== null) {
                values.push(m[1] !== undefined ? m[1].replace(/\"\"/g, '\"') : m[2]);
              }

              const obj = {};
              headers.forEach((header, i) => {
                obj[header] = values[i];
              });
              return obj;
            });
          }

          const response = await api.post('/products/import', { products: productsToImport });
          if (response.data.success) {
            alert(`Import Successful!\nCreated: ${response.data.summary.created}\nUpdated: ${response.data.summary.updated}\nErrors: ${response.data.summary.errors.length}`);
            fetchProducts();
          }
        } catch (err) {
          const errorMsg = err.response?.data?.message || err.message;
          alert('Failed to import products: ' + errorMsg);
        } finally {
          setIsImporting(false);
        }

      };

      if (file.name.endsWith('.json')) {
        reader.readAsText(file);
      } else {
        reader.readAsText(file);
      }
    };
    fileInput.click();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await api.delete(`/products/${id}`);
        if (response.data.success) {
          setProducts(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-cinzel text-3xl font-bold text-white tracking-widest uppercase">Products</h2>
          <p className="text-ivory/60 mt-2">Manage your inventory of <span className="text-gold">{products.length}</span> items.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-white/5 text-gold border border-gold/20 px-4 py-3 rounded-lg font-cinzel text-[10px] tracking-widest uppercase font-bold hover:bg-gold/10 transition-all"
          >
            <Download size={14} /> Export
          </button>
          <button 
            onClick={handleImportClick}
            disabled={isImporting}
            className="flex items-center gap-2 bg-white/5 text-gold border border-gold/20 px-4 py-3 rounded-lg font-cinzel text-[10px] tracking-widest uppercase font-bold hover:bg-gold/10 transition-all disabled:opacity-50"
          >
            {isImporting ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} 
            Import
          </button>
          <Link 
            to="/admin/products/new"
            className="flex items-center gap-2 bg-gold text-black px-6 py-3 rounded-lg font-cinzel text-[10px] tracking-widest uppercase font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(201,168,76,0.3)]"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-surface p-4 rounded-xl border border-gold/10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, SKU..."
            className="w-full bg-black border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-gold outline-none transition-colors font-raleway"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-gold/10 rounded-xl overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 size={40} className="text-gold animate-spin" />
            <p className="font-cinzel text-xs text-gold uppercase tracking-widest">Loading Catalog...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-ivory/40">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black rounded border border-gold/10 overflow-hidden flex-shrink-0">
                          {product.images?.[0] && <img src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="text-white font-bold line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-ivory/40 uppercase tracking-widest">
                            {product.categories?.[0]?.name || 'No Category'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-ivory/60 text-xs">{product.sku || 'N/A'}</td>
                    <td className="px-6 py-4 text-gold font-bold">${Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={product.stockQuantity < 10 ? 'text-crimson' : 'text-ivory/80'}>{product.stockQuantity} in stock</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        product.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 'bg-ivory/10 text-ivory/40'
                      }`}>
                        {product.status || 'DRAFT'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/products/edit/${product.id}`} className="p-2 text-ivory/40 hover:text-gold hover:bg-gold/10 rounded transition-all">
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-ivory/40 hover:text-crimson hover:bg-crimson/10 rounded transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-20 text-center font-cinzel text-xs text-ivory/20 uppercase tracking-widest">
                      No products found
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

export default AdminProductList;
