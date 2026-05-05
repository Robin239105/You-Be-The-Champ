import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const GOLD = '#C9A84C';

// Official League Logos (SVG)
const NFLLogo = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8h40l4 24-24 24-24-24 4-24z" fill="#013369" stroke={GOLD} strokeWidth="1.5"/>
    <ellipse cx="32" cy="30" rx="14" ry="10" fill="none" stroke="white" strokeWidth="1.5"/>
    <path d="M26 30h12M32 24v12" stroke="white" strokeWidth="1"/>
    <circle cx="20" cy="20" r="2" fill={GOLD}/>
    <circle cx="44" cy="20" r="2" fill={GOLD}/>
    <circle cx="32" cy="48" r="2" fill={GOLD}/>
  </svg>
);

const NBALogo = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="6" width="48" height="52" rx="4" fill="#C9002B" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M20 20c0 0 8-8 16 0s8 20 0 28-16 0-16-8 0-20 0-20z" fill="white" opacity="0.9"/>
    <text x="32" y="48" textAnchor="middle" fill="white" fontSize="10" fontFamily="Arial" fontWeight="bold">NBA</text>
    <path d="M8 30h48" stroke={GOLD} strokeWidth="0.5" opacity="0.5"/>
  </svg>
);

const MLBLogo = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 4l28 28-28 28-28-28z" fill="#002D72" stroke={GOLD} strokeWidth="1.5"/>
    <circle cx="32" cy="22" r="6" fill="white"/>
    <path d="M26 28l-4 20M38 28l4 20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <path d="M32 28v12" stroke="white" strokeWidth="2"/>
  </svg>
);

const NHLLogo = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6h40l4 26-24 26-24-26 4-26z" fill="#111111" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M16 10l32 44M48 10L16 54" stroke={GOLD} strokeWidth="0.8" opacity="0.3"/>
    <path d="M32 14v36M18 32h28" stroke={GOLD} strokeWidth="1"/>
    <text x="32" y="30" textAnchor="middle" fill="white" fontSize="8" fontFamily="Arial" fontWeight="bold">NHL</text>
  </svg>
);

const LEAGUES = [
  {
    name: "NFL",
    icon: NFLLogo,
    label: "National Football League",
    color: "#013369",
    slug: "nfl",
    description: "AFC & NFC divisions — Super Bowl champions",
  },
  {
    name: "NBA",
    icon: NBALogo,
    label: "National Basketball Association",
    color: "#C9002B",
    slug: "nba",
    description: "Eastern & Western Conference — Finals champions",
  },
  {
    name: "MLB",
    icon: MLBLogo,
    label: "Major League Baseball",
    color: "#002D72",
    slug: "mlb",
    description: "American & National League — World Series champions",
  },
  {
    name: "NHL",
    icon: NHLLogo,
    label: "National Hockey League",
    color: "#111111",
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
              <div className="group-hover:scale-110 transition-transform duration-300 relative z-10">{React.createElement(league.icon)}</div>
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
