import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import Marquee from '../components/Marquee';
import TrustBadges from '../components/TrustBadges';
import SportCategoryGrid from '../components/SportCategoryGrid';
import StatsBanner from '../components/StatsBanner';
import NewsletterSection from '../components/NewsletterSection';
import SectionDivider from '../components/SectionDivider';
import { productsData } from '../data/productsData';
import heroRing from '../assets/hero-ring.png';

const Home = () => {
  const featuredRings = productsData.slice(0, 8);
  const newArrivals = productsData.slice(8, 12);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-black min-h-screen text-ivory selection:bg-gold selection:text-black">
      <Header />
      
      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Atmosphere & Watermarks */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-black font-cinzel text-gold/[0.03] tracking-[50px] uppercase whitespace-nowrap leading-none">
            CHAMP
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(201,168,76,0.15)_0%,_transparent_60%)]" />
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 sm:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            
            {/* Left Column: Content */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="order-2 lg:order-1"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-3 bg-gold/10 border border-gold/20 px-4 py-1 rounded-full mb-8">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-gold font-cinzel text-[10px] tracking-[3px] uppercase">The 2026 Collection — Just Landed</span>
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-7xl lg:text-8xl font-black font-cinzel tracking-tight md:tracking-[-2px] uppercase leading-[0.9] mb-8"
              >
                Wear <br />
                The <span className="gold-gradient-text block mt-2">Legacy</span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="max-w-xl text-lg md:text-xl text-ivory/70 font-raleway font-light mb-12 leading-relaxed tracking-wider"
              >
                Discover official-grade replicas that capture the glory of your favorite legends. Crafted with precision for the champions of the world.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6">
                <Link to="/shop">
                  <Button variant="primary" className="w-full sm:w-auto px-12 py-6 text-sm font-bold tracking-[3px]">
                    Shop Collection
                  </Button>
                </Link>
                <Link to="/player-editions">
                  <Button variant="secondary" className="w-full sm:w-auto px-12 py-6 text-sm font-bold tracking-[3px] border-ivory/20 hover:border-gold">
                    View Legends
                  </Button>
                </Link>
              </motion.div>

              {/* Feature Tags */}
              <motion.div variants={itemVariants} className="mt-16 flex flex-wrap gap-8 items-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                <div className="flex flex-col gap-1">
                  <span className="text-ivory font-cinzel text-[10px] tracking-[2px] uppercase">NBA Official</span>
                  <div className="h-[1px] w-8 bg-gold/50" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-ivory font-cinzel text-[10px] tracking-[2px] uppercase">NFL Standards</span>
                  <div className="h-[1px] w-8 bg-gold/50" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-ivory font-cinzel text-[10px] tracking-[2px] uppercase">World Series</span>
                  <div className="h-[1px] w-8 bg-gold/50" />
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Visual */}
            <motion.div 
              style={{ perspective: 1000 }}
              className="order-1 lg:order-2 relative"
            >
              <motion.div 
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="relative z-10 flex justify-center items-center"
              >
                {/* Visual Glows */}
                <div className="absolute inset-0 bg-gold/20 blur-[120px] rounded-full scale-125 opacity-50" />
                <div className="absolute inset-0 bg-gold/10 blur-[60px] rounded-full animate-pulse" />
                
                <img 
                  src={heroRing} 
                  alt="Championship Ring" 
                  className="w-[320px] md:w-[480px] lg:w-[580px] relative z-10 drop-shadow-[0_20px_80px_rgba(201,168,76,0.6)] object-contain"
                />

                {/* Floating Social Proof */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="absolute bottom-10 right-0 md:-right-4 bg-black/60 backdrop-blur-3xl border border-gold/30 p-6 shadow-2xl z-20 group hover:border-gold transition-colors"
                >
                  <p className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase mb-2">Authenticated Collection</p>
                  <p className="text-3xl font-black font-cinzel text-white leading-none tracking-tighter">50K+</p>
                  <p className="text-[10px] text-ivory/60 font-raleway uppercase tracking-[3px] mt-2">Elite Rings Delivered</p>
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-gold" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-gold" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MARQUEE */}
      <Marquee />

      {/* SECTION 3: SPORT CATEGORY GRID */}
      <SportCategoryGrid />

      <SectionDivider />

      {/* SECTION 4: FEATURED COLLECTION */}
      <section className="py-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto mb-20 flex items-end justify-between border-b border-gold/10 pb-8">
          <div>
            <span className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase block mb-4">Curated Selection</span>
            <h2 className="text-3xl md:text-4xl font-bold font-cinzel text-white tracking-widest uppercase">The Vault Essentials</h2>
          </div>
          <Link to="/shop" className="text-gold text-xs font-cinzel tracking-widest hover:translate-x-2 transition-transform uppercase group">
            Explore All <span className="inline-block group-hover:translate-x-1 transition-transform ml-2">→</span>
          </Link>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-16 scrollbar-none snap-x px-4 -mx-4">
          {featuredRings.map((product) => (
            <div key={product.id} className="min-w-[300px] md:min-w-[350px] snap-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: TRUST BADGES */}
      <TrustBadges />

      {/* SECTION 6: STATS BANNER */}
      <StatsBanner />

      {/* SECTION 7: NEW ARRIVALS */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase block mb-4">Just Landed</span>
          <h2 className="text-4xl font-black font-cinzel tracking-widest text-white uppercase">New Arrivals</h2>
          <div className="w-24 h-1 bg-gold mx-auto mt-6" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-20 text-center">
          <Link to="/shop"><Button variant="outline" className="px-16">Browse Catalog</Button></Link>
        </div>
      </section>

      {/* SECTION 8: NEWSLETTER */}
      <NewsletterSection />

      <Footer />
    </div>
  );
};

export default Home;
