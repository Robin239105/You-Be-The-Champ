import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { motion } from 'framer-motion';
import { getCategoryThumbnail } from '../data/categoryThumbnails';

const START_YEAR = 1903;
const END_YEAR = 2025;

const years = [];
for (let y = END_YEAR; y >= START_YEAR; y--) years.push(y);

const decades = [];
for (let d = Math.floor(END_YEAR / 10) * 10; d >= Math.floor(START_YEAR / 10) * 10; d -= 10) decades.push(d);

const ChampionsByYear = () => {
  return (
    <div className="bg-black min-h-screen">
      <Header />
       <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-52 pb-24">
        <Breadcrumb items={[{ name: 'Champions by Year', path: '/champions-by-year' }]} />

        <div className="mb-16 text-center py-16 bg-surface border border-gold/10 relative overflow-hidden">
          <div className="absolute inset-0 gold-glow opacity-10" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black font-cinzel text-gold tracking-widest uppercase mb-4">Champions by Year</h1>
            <p className="text-ivory/50 font-raleway uppercase tracking-[3px] text-xs">Browse championship rings from every year since 1903</p>
          </motion.div>
        </div>

        {decades.map(decade => {
          const decadeYears = years.filter(y => Math.floor(y / 10) * 10 === decade);
          if (!decadeYears.length) return null;
          return (
            <div key={decade} className="mb-12">
              <h2 className="font-cinzel text-gold text-lg tracking-widest uppercase border-b border-gold/20 pb-3 mb-6">{decade}s</h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {decadeYears.map(year => {
                  const thumb = getCategoryThumbnail(`Champions By Year > ${year}`);
                  return (
                    <Link
                      key={year}
                      to={`/category/${encodeURIComponent(`Champions By Year > ${year}`)}`}
                      className="group relative flex items-center justify-center py-3 border border-gold/10 hover:border-gold/50 bg-white/[0.02] hover:bg-gold/10 transition-all overflow-hidden"
                    >
                      {thumb && (
                        <img src={thumb} alt={String(year)} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                      )}
                      <span className="relative z-10 font-cinzel text-xs text-ivory/60 group-hover:text-gold transition-colors font-bold">{year}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
      <Footer />
    </div>
  );
};

export default ChampionsByYear;
