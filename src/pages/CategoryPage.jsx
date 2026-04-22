import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import { productsData } from '../data/productsData';
import { motion } from 'framer-motion';

const CategoryPage = () => {
  const { '*': categoryPath } = useParams();
  const decodedPath = decodeURIComponent(categoryPath || '');
  const pathParts = decodedPath.split(' > ');
  const categoryTitle = pathParts[pathParts.length - 1];

  // Filtering logic: Check if product belongs to this category or any of its children
  const filteredProducts = productsData.filter(p => {
    if (!p.categories || p.categories.length === 0) return false;
    // Check if any category string in the array matches the current path or contains the title
    return p.categories.some(cat => 
      cat === decodedPath || 
      cat.includes(decodedPath) || 
      cat.split(' > ').includes(categoryTitle)
    );
  });

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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-24">
        <Breadcrumb items={getBreadcrumbs()} />

        <div className="mb-12 text-center relative py-16 px-4 bg-surface border border-gold/10 overflow-hidden mt-8">
          <div className="absolute inset-0 gold-glow opacity-10" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <h1 className="text-3xl md:text-5xl font-black font-cinzel text-gold tracking-widest uppercase mb-4 leading-tight">
              {categoryTitle}
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-8 bg-gold/30" />
              <p className="text-ivory/60 font-raleway tracking-[3px] uppercase text-[10px]">
                {pathParts[0]} Collection
              </p>
              <div className="h-[1px] w-8 bg-gold/30" />
            </div>
          </motion.div>
        </div>

        {filteredProducts.length > 0 ? (
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
