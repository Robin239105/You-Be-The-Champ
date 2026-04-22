import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import { placeholderProducts } from '../data/placeholderProducts';
import { motion } from 'framer-motion';

const Vintage90s = () => {
  const vintageProducts = placeholderProducts.filter(p => p.category === 'vintage-90s' || p.badge === 'VINTAGE');

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-8 pt-32 pb-24">
        <Breadcrumb items={[{ name: 'Vintage 90s', path: '/vintage-90s' }]} />

        {/* Cinematic Vintage Hero */}
        <div className="mb-20 text-center relative py-32 px-4 bg-surface border border-gold/10 overflow-hidden group">
          {/* Film Grain Effect Overlay (Simulated) */}
          <div className="absolute inset-0 bg-black/40 mix-blend-overlay z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-0" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-20"
          >
            <h1 className="text-5xl md:text-7xl font-black font-cinzel text-gold tracking-[8px] md:tracking-[15px] uppercase mb-4 drop-shadow-[0_0_20px_rgba(201,168,76,0.3)]">
              The Golden Era
            </h1>
            <p className="text-ivory/60 font-raleway tracking-widest uppercase text-sm mb-12">
              90s Championship Rings • The Decade of Dynasties
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
               {['1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999'].map(year => (
                 <button key={year} className="px-4 py-2 bg-black border border-gold/20 text-[10px] text-ivory/40 font-cinzel hover:border-gold hover:text-gold transition-all">
                    {year}
                 </button>
               ))}
            </div>
          </motion.div>
        </div>

        {/* Editorial Block */}
        <section className="max-w-3xl mx-auto text-center mb-24 space-y-8">
           <h2 className="text-2xl font-cinzel text-gold font-bold uppercase tracking-widest">Why We Love The 90s</h2>
           <p className="text-lg italic font-raleway text-ivory/80 leading-relaxed">
             "The 1990s represented a pinnacle of team dominance. From the Bulls' two separate 3-peats to the emergence of future legends, the rings from this era carry a weight of nostalgia and prestige that remains unmatched."
           </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {vintageProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Vintage90s;
