import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Loader2 } from 'lucide-react';
import { getCategoryThumbnail } from '../data/categoryThumbnails';
import { optimizeImage } from '../utils/imageOptimizer';

const CategoryPage = () => {
  const { '*': categoryPath } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [categoryData, setCategoryData] = useState(null);
  
  const decodedPath = decodeURIComponent(categoryPath || '');
  const pathParts = decodedPath.split(' > ');
  const categoryTitle = pathParts[pathParts.length - 1];
  const thumbnail = getCategoryThumbnail(categoryTitle);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setCategoryDescription('');
      setCategoryImage('');
      setCategoryData(null);
      
      // Generate the slug for initial fallback
      const categorySlug = decodedPath.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      try {
        // Fetch all categories to find the correct one by name or slug
        const [categoriesRes, productsInitialRes] = await Promise.allSettled([
          api.get('/categories'),
          api.get(`/products?limit=1000&status=PUBLISHED&category=${encodeURIComponent(categorySlug)}`)
        ]);

        let finalProducts = [];
        if (productsInitialRes.status === 'fulfilled' && productsInitialRes.value.data.success) {
          finalProducts = productsInitialRes.value.data.data;
        }

        if (categoriesRes.status === 'fulfilled' && categoriesRes.value.data.success) {
          const allCats = categoriesRes.value.data.data;
          
          // Match by name (exact) or by generated slug
          const currentCat = allCats.find(c => 
            c.name.toLowerCase() === decodedPath.toLowerCase() || 
            c.slug === categorySlug
          );
          
          if (currentCat) {
            setCategoryData(currentCat);
            setCategoryDescription(currentCat.description || '');
            setCategoryImage(currentCat.image || '');
            
            // If the matched category has a different slug than our generated one, re-fetch products
            if (currentCat.slug !== categorySlug) {
              const prodRes = await api.get(`/products?limit=1000&status=PUBLISHED&category=${currentCat.slug}`);
              if (prodRes.data.success) {
                finalProducts = prodRes.data.data;
              }
            }
          }
        }
        
        setProducts(finalProducts);
      } catch (error) {
        console.error('Failed to fetch category data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [decodedPath]);

  // Filtering: match product categories against the decoded path
  // A product matches if any of its category names:
  // 1. Exactly equals the path, OR
  // 2. Starts with the path (child of this category), OR
  // 3. The path starts with the category name (this category is a parent)
  const filteredProducts = useMemo(() => {
    // If we already filtered via API, just return all products
    // Otherwise apply fallback filtering
    if (products.length > 0) return products;
    return [];
  }, [products]);

  const getBreadcrumbs = () => {
    return pathParts.map((part, index) => {
      const path = pathParts.slice(0, index + 1).join(' > ');
      return {
        name: part.toUpperCase(),
        path: `/category/${encodeURIComponent(path)}`
      };
    });
  };

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
       <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-52 pb-24">
        <Breadcrumb items={getBreadcrumbs()} />

        <div className="mb-12 relative overflow-hidden mt-8 border border-gold/10" style={{ minHeight: 200 }}>
          {(categoryImage || thumbnail) && (
            <div className="absolute inset-0">
              <img 
                src={optimizeImage(categoryImage || thumbnail, { w: 1920, h: 400 })} 
                alt={categoryTitle} 
                className="w-full h-full object-cover object-center opacity-25" 
                fetchpriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60" />
            </div>
          )}
          {!categoryImage && !thumbnail && <div className="absolute inset-0 gold-glow opacity-10" />}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center py-16 px-4"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-8 bg-gold/30" />
              <p className="text-ivory/60 font-raleway tracking-[3px] uppercase text-[10px]">
                {pathParts[0]} Collection
              </p>
              <div className="h-[1px] w-8 bg-gold/30" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-cinzel text-gold tracking-widest uppercase mb-4 leading-tight">
              {categoryTitle}
            </h1>
            {categoryDescription && (
              <p className="text-ivory/60 font-raleway text-sm leading-relaxed max-w-xl mx-auto mt-4">
                {categoryDescription}
              </p>
            )}
          </motion.div>
        </div>

        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-32 gap-4 text-center">
            <Loader2 size={40} className="text-gold animate-spin" />
            <p className="font-cinzel text-[10px] text-gold tracking-widest uppercase">Consulting the archive...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border border-dashed border-gold/10 bg-surface/30">
             <div className="w-16 h-16 border-2 border-gold/20 flex items-center justify-center mx-auto mb-6 text-gold text-2xl opacity-50">
               ?
             </div>
             <p className="font-cinzel text-xl tracking-widest uppercase mb-4 text-ivory/80">Premium Inventory Pending</p>
             <p className="font-raleway text-sm uppercase text-ivory/40 max-w-md mx-auto">
               Our artisans are working on the production of {categoryTitle} rings. Check back soon for the definitive collection.
             </p>
             <button onClick={() => window.history.back()} className="mt-8 font-cinzel text-xs text-gold border border-gold/30 px-6 py-2 hover:bg-gold hover:text-black transition-all uppercase tracking-widest">
               Go Back
             </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
