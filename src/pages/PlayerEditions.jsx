import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import SectionDivider from '../components/SectionDivider';
import { productsData } from '../data/productsData';
import { motion } from 'framer-motion';

const PlayerEditions = () => {
  const playerProducts = productsData.slice(0, 12); // Fallback for now, can be improved with specific category logic

  const legends = [
    { name: 'Michael Jordan', team: 'Chicago Bulls', sport: 'NBA' },
    { name: 'Tom Brady', team: 'NE Patriots', sport: 'NFL' },
    { name: 'Wayne Gretzky', team: 'Edmonton Oilers', sport: 'NHL' },
    { name: 'Derek Jeter', team: 'NY Yankees', sport: 'MLB' },
  ];

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-8 pt-32 pb-24">
        <Breadcrumb items={[{ name: 'Player Editions', path: '/player-editions' }]} />

        <div className="mb-20 text-center relative py-32 px-4 bg-surface border border-gold/10 overflow-hidden">
          <div className="absolute inset-0 gold-glow opacity-30" />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <h1 className="text-4xl md:text-6xl font-black font-cinzel text-gold tracking-[6px] md:tracking-[12px] uppercase mb-6">
              Ring Like A Legend
            </h1>
            <p className="text-ivory/60 font-raleway tracking-widest uppercase text-xs sm:text-sm max-w-2xl mx-auto leading-loose">
              Our Player Edition collection features the exact specifications, engravings, and weight preferred by the champions themselves. Own the ring, wear the icon.
            </p>
          </motion.div>
        </div>

        {/* Legend Highlights Horizontal Scroll */}
        <section className="mb-32">
           <h2 className="text-xl font-cinzel text-gold font-bold uppercase tracking-widest mb-12 border-b border-gold/10 pb-4">Hall of Fame Specials</h2>
           <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-none snap-x h-[400px]">
              {legends.map((legend, i) => (
                <div key={i} className="min-w-[300px] sm:min-w-[400px] h-full bg-card border border-gold/10 p-10 flex flex-col justify-end snap-center group hover:border-gold transition-colors relative overflow-hidden">
                   <div className="absolute top-10 right-10 text-8xl text-gold/5 font-black font-cinzel select-none group-hover:text-gold/10 transition-colors">
                      {i + 1}
                   </div>
                   <div>
                      <h3 className="text-2xl font-black font-cinzel text-white group-hover:text-gold transition-colors">{legend.name}</h3>
                      <p className="text-gold/60 text-xs font-raleway uppercase tracking-widest mt-1">{legend.team} • {legend.sport}</p>
                      <button className="mt-8 text-xs font-bold font-cinzel text-ivory border-b border-gold pb-1 hover:text-gold transition-colors uppercase">View Legends Ring →</button>
                   </div>
                </div>
              ))}
           </div>
        </section>

        <SectionDivider />

        <h2 className="text-xl font-cinzel text-gold font-bold uppercase tracking-widest mb-12">All Player Editions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {playerProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlayerEditions;
