import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const GOLD = '#C9A84C';

// Official League Logos (SVG)
const NFLLogo = () => (
  <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 12h32l3 18-19 19-19-19 3-18z" fill="#013369" stroke={GOLD} strokeWidth="1.5"/>
    <ellipse cx="32" cy="26" rx="10" ry="7" fill="none" stroke="white" strokeWidth="1"/>
    <path d="M26 26h12M32 20v12" stroke="white" strokeWidth="0.8"/>
    <circle cx="22" cy="18" r="1.5" fill={GOLD}/>
    <circle cx="42" cy="18" r="1.5" fill={GOLD}/>
  </svg>
);

const NBALogo = () => (
  <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="10" width="40" height="44" rx="3" fill="#C9002B" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M20 18c0 0 6-5 12 0s6 14 0 20-12 0-12-5 0-15 0-15z" fill="white" opacity="0.9"/>
    <text x="32" y="44" textAnchor="middle" fill="white" fontSize="8" fontFamily="Arial" fontWeight="bold">NBA</text>
  </svg>
);

const MLBLogo = () => (
  <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 8l22 22-22 22-22-22z" fill="#002D72" stroke={GOLD} strokeWidth="1.5"/>
    <circle cx="32" cy="18" r="4" fill="white"/>
    <path d="M28 24l-2 12M36 24l2 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const NHLLogo = () => (
  <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 10h32l3 20-19 19-19-19 3-20z" fill="#111111" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M20 14l24 36M44 14L20 50" stroke={GOLD} strokeWidth="0.6" opacity="0.3"/>
    <path d="M32 18v28M20 32h24" stroke={GOLD} strokeWidth="0.8"/>
    <text x="32" y="28" textAnchor="middle" fill="white" fontSize="6" fontFamily="Arial" fontWeight="bold">NHL</text>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 10l6 14h14l-11 8 4 14-13-8-13 8 4-14-11-8h14l6-14z" fill="#0a0a0a" stroke={GOLD} strokeWidth="1.5"/>
  </svg>
);

const TEAM_SETS = [
  { label: "By City", items: [
    { label: "New York Teams", path: "Your City > New York City Pro Teams" },
    { label: "Los Angeles Teams", path: "Your City > Los Angeles Pro Teams" },
    { label: "Chicago Teams", path: "Your City > Chicago Pro Teams" },
    { label: "Boston Teams", path: "Your City > Boston Pro Teams" },
    { label: "Dallas Teams", path: "Your City > Dallas Pro Teams" },
    { label: "Miami Teams", path: "Your City > Miami Pro Teams" },
  ]},
  { label: "NFL Teams", items: [
    { label: "Green Bay Packers", path: "Teams > Green Bay Packers (NFL)" },
    { label: "New England Patriots", path: "Teams > New England Patriots (NFL)" },
    { label: "Dallas Cowboys", path: "Teams > Dallas Cowboys (NFL)" },
    { label: "Kansas City Chiefs", path: "Teams > Kansas City Chiefs (NFL)" },
    { label: "Pittsburgh Steelers", path: "Teams > Pittsburgh Steelers (NFL)" },
    { label: "San Francisco 49ers", path: "Teams > San Francisco 49ers (NFL)" },
  ]},
  { label: "NBA Teams", items: [
    { label: "Chicago Bulls", path: "Teams > Chicago Bulls (NBA)" },
    { label: "LA Lakers", path: "Teams > Los Angeles Lakers (NBA)" },
    { label: "Boston Celtics", path: "Teams > Boston Celtics (NBA)" },
    { label: "Golden State Warriors", path: "Teams > Golden State Warriors (NBA)" },
    { label: "San Antonio Spurs", path: "Teams > San Antonio Spurs (NBA)" },
  ]},
  { label: "MLB & NHL", items: [
    { label: "New York Yankees", path: "Teams > New York Yankees (MLB)" },
    { label: "Chicago Cubs", path: "Teams > Chicago Cubs (MLB)" },
    { label: "LA Dodgers", path: "Teams > Los Angeles Dodgers (MLB)" },
    { label: "Montreal Canadiens", path: "Teams > Montreal Canadiens (NHL)" },
    { label: "Pittsburgh Penguins", path: "Teams > Pittsburgh Penguins (NHL)" },
    { label: "Chicago Blackhawks", path: "Teams > Chicago Blackhawks (NHL)" },
  ]},
];

const BULK = [
  { icon: NFLLogo, label: "All NFL Rings", path: "Championships/Finals > Super Bowl Championship Rings" },
  { icon: NBALogo, label: "All NBA Rings", path: "Championships/Finals > NBA Finals Championship Rings" },
  { icon: MLBLogo, label: "All MLB Rings", path: "Championships/Finals > World Series Championship Rings" },
  { icon: NHLLogo, label: "All NHL Rings", path: "Championships/Finals > Stanley Cup Championship Rings" },
  { icon: StarIcon, label: "Special Players", path: "Special Release Champion Players Rings" },
];

const catLink = (path) => `/category/${encodeURIComponent(path)}`;

const CollectionsPage = () => (
  <div className="bg-black min-h-screen text-ivory">
    <Header />
    <main className="max-w-7xl mx-auto px-8 pt-40 pb-24">
      <div className="mb-14">
        <span className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase block mb-3">Browse</span>
        <h1 className="text-5xl font-black font-cinzel text-white uppercase tracking-widest mb-2">Full collection of championship rings</h1>
        <div className="w-20 h-[2px] bg-gold mt-5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
        {/* Left — Team Sets */}
        <div>
          <h2 className="font-cinzel text-gold text-sm uppercase tracking-[3px] font-bold mb-8">Complete Team Sets</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TEAM_SETS.map((group) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-gold/80 font-cinzel text-[9px] uppercase tracking-[2px] mb-4 pb-2 border-b border-gold/20 font-bold">{group.label}</h3>
                <div className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <Link key={item.path} to={catLink(item.path)}
                      className="group flex items-center gap-2 px-3 py-2.5 border border-gold/5 hover:border-gold/40 hover:bg-gold/5 transition-all">
                      <span className="w-1 h-1 bg-gold/40 rounded-full group-hover:bg-gold transition-colors flex-shrink-0" />
                      <span className="font-raleway text-white/80 group-hover:text-gold text-[11px] transition-colors">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — I Want Them All */}
        <div className="border-l border-gold/10 pl-10">
          <h2 className="font-cinzel text-gold text-sm uppercase tracking-[3px] font-bold mb-8">I Want Them All</h2>
          <div className="flex flex-col gap-3">
            {BULK.map((item) => (
              <Link key={item.path} to={catLink(item.path)}
                className="group flex items-center gap-4 p-4 border border-gold/10 hover:border-gold/40 hover:bg-gold/5 transition-all duration-300">
                <span className="flex-shrink-0">{React.createElement(item.icon)}</span>
                <span className="font-cinzel text-white group-hover:text-gold text-sm uppercase tracking-wider transition-colors font-bold">{item.label}</span>
                <span className="ml-auto text-gold/0 group-hover:text-gold/60 transition-colors">→</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-gold/10">
            <Link to="/i-want-them-all"
              className="flex items-center justify-between text-gold font-cinzel text-[10px] uppercase tracking-[2px] hover:text-white transition-colors group">
              <span>View All Collections</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default CollectionsPage;
