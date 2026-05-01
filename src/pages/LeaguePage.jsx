import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const LEAGUES = [
  {
    name: "NFL",
    icon: "🏈",
    label: "National Football League",
    color: "#013369",
    slug: "nfl",
    description: "AFC & NFC divisions — Super Bowl champions",
  },
  {
    name: "NBA",
    icon: "🏀",
    label: "National Basketball Association",
    color: "#C9002B",
    slug: "nba",
    description: "Eastern & Western Conference — Finals champions",
  },
  {
    name: "MLB",
    icon: "⚾",
    label: "Major League Baseball",
    color: "#002D72",
    slug: "mlb",
    description: "American & National League — World Series champions",
  },
  {
    name: "NHL",
    icon: "🏒",
    label: "National Hockey League",
    color: "#333",
    slug: "nhl",
    description: "Eastern & Western Conference — Stanley Cup champions",
  },
];

const LeaguePage = () => (
  <div className="bg-black min-h-screen text-ivory">
    <Header />
    <main className="max-w-7xl mx-auto px-8 pt-40 pb-24">
      <Breadcrumb items={[{ name: "League", path: "/league" }]} />

      <div className="text-center py-16 border border-gold/10 bg-white/[0.02] relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.07)_0%,transparent_70%)]" />
        <div className="relative z-10">
          <span className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase block mb-3">Browse by Sport</span>
          <h1 className="text-5xl md:text-7xl font-black font-cinzel text-white uppercase tracking-widest mb-3">League</h1>
          <p className="text-white/40 font-raleway text-sm uppercase tracking-[3px]">Select a league to browse by division</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {LEAGUES.map((league, i) => (
          <motion.div
            key={league.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/league/${league.slug}`}
              className="group flex flex-col items-center justify-center gap-6 p-12 border border-gold/10 hover:border-gold/50 bg-white/[0.02] hover:bg-gold/5 transition-all duration-300 text-center overflow-hidden relative hover:shadow-[0_0_40px_rgba(201,168,76,0.15)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at center, ${league.color}22 0%, transparent 70%)` }} />
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300 relative z-10">{league.icon}</span>
              <div className="relative z-10">
                <p className="font-cinzel text-white font-black text-3xl uppercase tracking-[3px] group-hover:text-gold transition-colors">{league.name}</p>
                <p className="text-white/40 font-raleway text-[10px] uppercase tracking-widest mt-2">{league.label}</p>
                <p className="text-white/30 font-raleway text-[10px] mt-3 leading-relaxed">{league.description}</p>
              </div>
              <div className="w-0 group-hover:w-16 h-[1px] bg-gold transition-all duration-500 relative z-10" />
              <span className="font-cinzel text-[9px] text-gold/0 group-hover:text-gold/80 uppercase tracking-[2px] transition-colors relative z-10">View Divisions →</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default LeaguePage;
