import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { motion } from 'framer-motion';

const COLLECTIONS = [
  { label: "All NFL Rings", icon: "🏈", description: "Every Super Bowl championship ring ever made", path: "Championships/Finals > Super Bowl Championship Rings", color: "#013369" },
  { label: "All NBA Rings", icon: "🏀", description: "Every NBA Finals championship ring collection", path: "Championships/Finals > NBA Finals Championship Rings", color: "#C9002B" },
  { label: "All MLB Rings", icon: "⚾", description: "Every World Series championship ring ever awarded", path: "Championships/Finals > World Series Championship Rings", color: "#002D72" },
  { label: "All NHL Rings", icon: "🏒", description: "Every Stanley Cup championship ring collection", path: "Championships/Finals > Stanley Cup Championship Rings", color: "#1a1a1a" },
  { label: "Special Players", icon: "⭐", description: "Exclusive champion player edition rings", path: "Special Release Champion Players Rings", color: "#C9A84C" },
];

const IWantThemAll = () => (
  <div className="bg-black min-h-screen">
    <Header />
    <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-24">
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
              <span className="text-6xl relative z-10">{col.icon}</span>
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
