import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { productsData } from '../data/productsData';

const YourYearGiftBox = () => {
  const [visibleCount, setVisibleCount] = useState(24);

  const giftBoxProducts = useMemo(() => {
    return productsData.filter(p => p.categories && p.categories.includes('Your Year Gift Box'));
  }, []);

  const visibleProducts = giftBoxProducts.slice(0, visibleCount);

  return (
    <div className="bg-black min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-52 pb-24">
        <Breadcrumb items={[{ name: 'Your Year Gift Box', path: '/your-year-gift-box' }]} />

        <div className="mb-12 text-center py-12 bg-surface border border-gold/10 relative overflow-hidden">
          <div className="absolute inset-0 gold-glow opacity-10" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black font-cinzel text-gold tracking-widest uppercase mb-4">Your Year Gift Box</h1>
            <p className="text-ivory/50 font-raleway uppercase tracking-[3px] text-xs">Complete 4-League Championship Sets from your special year</p>
          </motion.div>
        </div>

        <p className="text-ivory/40 text-sm mb-8">{giftBoxProducts.length} products</p>

        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {visibleProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visibleCount < giftBoxProducts.length && (
          <div className="flex justify-center mt-12">
            <button onClick={() => setVisibleCount(prev => prev + 24)}
              className="px-8 py-3 border border-gold/30 hover:border-gold text-gold hover:bg-gold/10 transition-all font-cinzel text-sm tracking-wider">
              LOAD MORE
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default YourYearGiftBox;