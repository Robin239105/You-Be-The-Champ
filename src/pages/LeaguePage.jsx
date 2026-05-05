import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const GOLD = '#C9A84C';

// Premium League Icons (SVG)
const FootballIcon = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="32" rx="28" ry="20" fill="url(#footballGrad)" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M12 32h40M20 20l24 24M44 20L20 44" stroke={GOLD} strokeWidth="1" opacity="0.6"/>
    <ellipse cx="32" cy="32" rx="8" ry="5" stroke={GOLD} strokeWidth="1" fill="none" opacity="0.4"/>
    <defs>
      <linearGradient id="footballGrad" x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1a1a1a"/>
        <stop offset="1" stopColor="#0a0a0a"/>
      </linearGradient>
    </defs>
  </svg>
);

const BasketballIcon = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="url(#basketballGrad)" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M32 4v56M4 32h56" stroke={GOLD} strokeWidth="1" opacity="0.6"/>
    <path d="M10 18c12 8 12 20 0 28M54 18c-12 8-12 20 0 28" stroke={GOLD} strokeWidth="1" opacity="0.4"/>
    <defs>
      <radialGradient id="basketballGrad" cx="32" cy="32" r="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1a1a1a"/>
        <stop offset="1" stopColor="#0a0a0a"/>
      </radialGradient>
    </defs>
  </svg>
);

const BaseballIcon = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="url(#baseballGrad)" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M18 12c8 20 8 32 0 48M46 12c-8 20-8 32 0 48" stroke={GOLD} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7"/>
    <circle cx="22" cy="24" r="1.5" fill={GOLD} opacity="0.5"/>
    <circle cx="26" cy="28" r="1.5" fill={GOLD} opacity="0.5"/>
    <circle cx="20" cy="30" r="1.5" fill={GOLD} opacity="0.5"/>
    <defs>
      <radialGradient id="baseballGrad" cx="32" cy="32" r="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1a1a1a"/>
        <stop offset="1" stopColor="#0a0a0a"/>
      </radialGradient>
    </defs>
  </svg>
);

const HockeyIcon = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="32" rx="28" ry="20" fill="url(#hockeyGrad)" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M20 32h24M28 24l8 16M36 24l-8 16" stroke={GOLD} strokeWidth="1.5" opacity="0.6"/>
    <circle cx="32" cy="32" r="4" stroke={GOLD} strokeWidth="1" fill="none"/>
    <defs>
      <linearGradient id="hockeyGrad" x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1a1a1a"/>
        <stop offset="1" stopColor="#0a0a0a"/>
      </linearGradient>
    </defs>
  </svg>
);

const LEAGUES = [
  {
    name: "NFL",
    icon: FootballIcon,
    label: "National Football League",
    color: "#013369",
    slug: "nfl",
    description: "AFC & NFC divisions — Super Bowl champions",
  },
  {
    name: "NBA",
    icon: BasketballIcon,
    label: "National Basketball Association",
    color: "#C9002B",
    slug: "nba",
    description: "Eastern & Western Conference — Finals champions",
  },
  {
    name: "MLB",
    icon: BaseballIcon,
    label: "Major League Baseball",
    color: "#002D72",
    slug: "mlb",
    description: "American & National League — World Series champions",
  },
  {
    name: "NHL",
    icon: HockeyIcon,
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
