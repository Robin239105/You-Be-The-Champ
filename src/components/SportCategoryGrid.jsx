import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const GOLD = '#C9A84C';

// Official League Logos (PNG Images)
const NFLLogo = () => (
  <img src="/NFL Logo.png" alt="NFL" className="w-12 h-12 object-contain" />
);

const NBALogo = () => (
  <img src="/NBA Logo.png" alt="NBA" className="w-12 h-12 object-contain" />
);

const MLBLogo = () => (
  <img src="/MLB Logo.png" alt="MLB" className="w-12 h-12 object-contain" />
);

const NHLLogo = () => (
  <img src="/NHL Logo.png" alt="NHL" className="w-12 h-12 object-contain" />
);

const StarIcon = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 6l8 18h18l-14 10 5 18-17-11-17 11 5-18-14-10h18l8-18z" fill="#0a0a0a" stroke={GOLD} strokeWidth="1.5"/>
    <circle cx="32" cy="32" r="8" stroke={GOLD} strokeWidth="1" fill="none" opacity="0.3"/>
  </svg>
);

const VintageIcon = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="18" width="44" height="28" rx="3" fill="#0a0a0a" stroke={GOLD} strokeWidth="1.5"/>
    <circle cx="32" cy="32" r="7" stroke={GOLD} strokeWidth="1" fill="none"/>
    <path d="M20 26h24M20 38h24" stroke={GOLD} strokeWidth="1" opacity="0.4"/>
    <circle cx="20" cy="32" r="1.5" fill={GOLD} opacity="0.5"/>
    <circle cx="44" cy="32" r="1.5" fill={GOLD} opacity="0.5"/>
  </svg>
);

const SportCategoryGrid = () => {
  const sports = [
    { name: 'NFL', path: 'League > NFL - National Football League', icon: NFLLogo },
    { name: 'NBA', path: 'League > NBA - National Basketball Association', icon: NBALogo },
    { name: 'NHL', path: 'League > NHL - National Hockey League', icon: NHLLogo },
    { name: 'MLB', path: 'League > MLB - Major League Baseball', icon: MLBLogo },
    { name: 'Player Editions', slug: 'player-editions', icon: StarIcon },
    { name: 'Vintage 90s', slug: 'vintage-90s', icon: VintageIcon },
  ];

  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-16 gold-gradient-text tracking-[4px]">Shop By Sport</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sports.map((sport, i) => (
          <motion.div
            key={sport.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Link 
              to={sport.path ? `/category/${encodeURIComponent(sport.path)}` : `/${sport.slug}`}
              className="group relative block bg-card border border-gold/10 overflow-hidden aspect-[4/3] p-10 flex flex-col items-center justify-center text-center gold-border-hover"
            >
              <div className="mb-6 transition-transform group-hover:scale-125 duration-500">{React.createElement(sport.icon)}</div>
              <h3 className="font-cinzel text-xl text-ivory group-hover:text-gold transition-colors mb-2">{sport.name}</h3>
              <span className="text-gold text-[10px] uppercase font-cinzel tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Shop Collection →
              </span>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SportCategoryGrid;
