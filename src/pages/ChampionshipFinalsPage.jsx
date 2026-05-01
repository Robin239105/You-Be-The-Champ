import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const FINALS = [
  {
    name: "Super Bowl",
    league: "NFL",
    icon: "🏈",
    color: "#013369",
    description: "Every Super Bowl championship ring from 1967 to present",
    path: "Championships/Finals > Super Bowl Championship Rings",
  },
  {
    name: "NBA Finals",
    league: "NBA",
    icon: "🏀",
    color: "#C9002B",
    description: "Every NBA Finals championship ring from 1947 to present",
    path: "Championships/Finals > NBA Finals Championship Rings",
  },
  {
    name: "World Series",
    league: "MLB",
    icon: "⚾",
    color: "#002D72",
    description: "Every World Series championship ring from 1903 to present",
    path: "Championships/Finals > World Series Championship Rings",
  },
  {
    name: "Stanley Cup",
    league: "NHL",
    icon: "🏒",
    color: "#2d2d2d",
    description: "Every Stanley Cup championship ring from 1893 to present",
    path: "Championships/Finals > Stanley Cup Championship Rings",
  },
];

const ChampionshipFinalsPage = () => (
  <div className="bg-black min-h-screen text-ivory">
    <Header />
    <main className="max-w-7xl mx-auto px-8 pt-40 pb-24">
      <Breadcrumb items={[{ name: "Championship / Finals", path: "/championship-finals" }]} />

      {/* Hero header */}
      <div className="text-center py-16 border border-gold/10 bg-white/[0.02] relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.07)_0%,transparent_70%)]" />
        <div className="relative z-10">
          <span className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase block mb-3">Shop by Championship</span>
          <h1 className="text-5xl md:text-7xl font-black font-cinzel text-white uppercase tracking-widest mb-3">
            Championship / Finals
          </h1>
          <p className="text-white/40 font-raleway text-sm uppercase tracking-[3px]">
            Select a championship to browse all rings
          </p>
        </div>
      </div>

      {/* 4 League Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {FINALS.map((f, i) => (
          <motion.div
            key={f.league}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/category/${encodeURIComponent(f.path)}`}
              className="group flex flex-col items-center justify-center gap-5 p-12 border border-gold/10 hover:border-gold/50 bg-white/[0.02] hover:bg-gold/5 transition-all duration-300 text-center relative overflow-hidden hover:shadow-[0_0_40px_rgba(201,168,76,0.15)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at center, ${f.color}22 0%, transparent 70%)` }} />
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300 relative z-10">{f.icon}</span>
              <div className="relative z-10">
                <p className="font-cinzel text-gold font-black text-xs uppercase tracking-[3px] mb-1">{f.league}</p>
                <p className="font-cinzel text-white font-black text-2xl uppercase tracking-tight group-hover:text-gold transition-colors">{f.name}</p>
                <p className="text-white/30 font-raleway text-[11px] mt-3 leading-relaxed">{f.description}</p>
              </div>
              <div className="w-0 group-hover:w-16 h-px bg-gold transition-all duration-500 relative z-10" />
              <span className="font-cinzel text-[9px] text-gold/0 group-hover:text-gold/80 uppercase tracking-[2px] transition-colors relative z-10">
                Shop All Rings →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* I Want Them All CTA */}
      <div className="border border-gold/10 bg-white/[0.015] p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-cinzel text-white font-black text-xl uppercase tracking-widest mb-2">I Want Them All</h3>
          <p className="text-white/40 font-raleway text-sm">Get every championship ring from every league in one collection.</p>
        </div>
        <Link to="/i-want-them-all"
          className="flex-shrink-0 bg-gold hover:bg-gold/90 text-black font-cinzel text-xs font-black uppercase tracking-[3px] px-10 py-4 transition-colors">
          Shop Every Ring
        </Link>
      </div>

      {/* Champions by Year link */}
      <div className="mt-6 text-center">
        <Link to="/champions-by-year"
          className="inline-flex items-center gap-3 text-gold/60 hover:text-gold font-cinzel text-[10px] uppercase tracking-[3px] transition-colors">
          <span className="w-6 h-px bg-gold/30" />
          Browse by Year Instead
          <span className="w-6 h-px bg-gold/30" />
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default ChampionshipFinalsPage;
