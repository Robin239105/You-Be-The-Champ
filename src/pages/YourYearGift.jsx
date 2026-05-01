import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { motion } from 'framer-motion';

const START = 1950;
const END = 2025;
const years = [];
for (let y = END; y >= START; y--) years.push(y);

const YourYearGift = () => (
  <div className="bg-black min-h-screen">
    <Header />
    <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-24">
      <Breadcrumb items={[{ name: 'Your Year Gift', path: '/your-year-gift' }]} />

      <div className="mb-16 text-center py-16 bg-surface border border-gold/10 relative overflow-hidden">
        <div className="absolute inset-0 gold-glow opacity-10" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black font-cinzel text-gold tracking-widest uppercase mb-4">Your Year Gift Box</h1>
          <p className="text-ivory/50 font-raleway uppercase tracking-[3px] text-xs">Find the perfect championship ring from your special year</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {years.map((year, i) => (
          <motion.div key={year} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.01 }}>
            <Link to={`/category/${encodeURIComponent(`Champions By Year > ${year}`)}`}
              className="group flex items-center justify-center py-4 border border-gold/10 hover:border-gold/50 bg-white/[0.02] hover:bg-gold/10 transition-all">
              <span className="font-cinzel text-xs text-ivory/60 group-hover:text-gold transition-colors font-bold">{year}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default YourYearGift;
