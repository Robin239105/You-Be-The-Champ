import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { motion } from 'framer-motion';

const GOLD = '#C9A84C';

// Official League Logos (SVG)
const NFLLogo = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8h40l4 24-24 24-24-24 4-24z" fill="#013369" stroke={GOLD} strokeWidth="1.5"/>
    <ellipse cx="32" cy="30" rx="14" ry="10" fill="none" stroke="white" strokeWidth="1.5"/>
    <path d="M26 30h12M32 24v12" stroke="white" strokeWidth="1"/>
    <circle cx="20" cy="20" r="2" fill={GOLD}/>
    <circle cx="44" cy="20" r="2" fill={GOLD}/>
    <circle cx="32" cy="48" r="2" fill={GOLD}/>
  </svg>
);

const NBALogo = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="6" width="48" height="52" rx="4" fill="#C9002B" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M20 20c0 0 8-8 16 0s8 20 0 28-16 0-16-8 0-20 0-20z" fill="white" opacity="0.9"/>
    <text x="32" y="48" textAnchor="middle" fill="white" fontSize="10" fontFamily="Arial" fontWeight="bold">NBA</text>
    <path d="M8 30h48" stroke={GOLD} strokeWidth="0.5" opacity="0.5"/>
  </svg>
);

const MLBLogo = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 4l28 28-28 28-28-28z" fill="#002D72" stroke={GOLD} strokeWidth="1.5"/>
    <circle cx="32" cy="22" r="6" fill="white"/>
    <path d="M26 28l-4 20M38 28l4 20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <path d="M32 28v12" stroke="white" strokeWidth="2"/>
  </svg>
);

const NHLLogo = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6h40l4 26-24 26-24-26 4-26z" fill="#111111" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M16 10l32 44M48 10L16 54" stroke={GOLD} strokeWidth="0.8" opacity="0.3"/>
    <path d="M32 14v36M18 32h28" stroke={GOLD} strokeWidth="1"/>
    <text x="32" y="30" textAnchor="middle" fill="white" fontSize="8" fontFamily="Arial" fontWeight="bold">NHL</text>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 6l8 20h20l-16 12 6 20-18-12-18 12 6-20-16-12h20l8-20z" fill="#0a0a0a" stroke={GOLD} strokeWidth="1.5"/>
    <circle cx="32" cy="36" r="10" stroke={GOLD} strokeWidth="1" fill="none" opacity="0.3"/>
  </svg>
);

const COLLECTIONS = [
  { label: "All NFL Rings", icon: NFLLogo, description: "Every Super Bowl championship ring ever made", path: "Championships/Finals > Super Bowl Championship Rings", color: "#013369" },
  { label: "All NBA Rings", icon: NBALogo, description: "Every NBA Finals championship ring collection", path: "Championships/Finals > NBA Finals Championship Rings", color: "#C9002B" },
  { label: "All MLB Rings", icon: MLBLogo, description: "Every World Series championship ring ever awarded", path: "Championships/Finals > World Series Championship Rings", color: "#002D72" },
  { label: "All NHL Rings", icon: NHLLogo, description: "Every Stanley Cup championship ring collection", path: "Championships/Finals > Stanley Cup Championship Rings", color: "#1a1a1a" },
  { label: "Special Players", icon: StarIcon, description: "Exclusive champion player edition rings", path: "Special Release Champion Players Rings", color: "#C9A84C" },
];

const IWantThemAll = () => (
  <div className="bg-black min-h-screen">
    <Header />
    <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-40 pb-24">
      <Breadcrumb items={[{ name: 'I Want Them All', path: '/i-want-them-all' }]} />

      <div className="mb-16 text-center py-16 bg-surface border border-gold/10 relative overflow-hidden">
        <div className="absolute inset-0 gold-glow opacity-10" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black font-cinzel text-gold tracking-widest uppercase mb-4">I Want Them All</h1>
          <p className="text-ivory/50 font-raleway uppercase tracking-[3px] text-xs">Complete championship ring collections by sport</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {COLLECTIONS.map((col, i) => (
          <motion.div key={col.path} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={`/category/${encodeURIComponent(col.path)}`}
              className="group relative flex flex-col items-center justify-center gap-5 p-12 border border-gold/10 hover:border-gold/40 bg-white/[0.02] hover:bg-gold/5 transition-all text-center overflow-hidden min-h-[220px]">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at center, ${col.color}25 0%, transparent 70%)` }} />
              <div className="relative z-10">{React.createElement(col.icon)}</div>
              <div className="relative z-10">
                <p className="font-cinzel text-white font-black text-xl uppercase tracking-[3px] group-hover:text-gold transition-colors mb-2">{col.label}</p>
                <p className="text-ivory/40 font-raleway text-xs">{col.description}</p>
              </div>
              <div className="w-0 group-hover:w-16 h-[1px] bg-gold transition-all duration-300 relative z-10" />
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default IWantThemAll;
