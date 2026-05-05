import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const GOLD = '#C9A84C';

// Premium Sport Icons (SVG)
const FootballIcon = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="32" rx="26" ry="18" fill="#0a0a0a" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M14 32h36M22 22l20 20M42 22L22 42" stroke={GOLD} strokeWidth="1" opacity="0.6"/>
    <ellipse cx="32" cy="32" rx="7" ry="4" stroke={GOLD} strokeWidth="1" fill="none" opacity="0.4"/>
  </svg>
);

const BasketballIcon = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="26" fill="#0a0a0a" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M32 6v52M6 32h52" stroke={GOLD} strokeWidth="1" opacity="0.6"/>
    <path d="M12 16c10 6 10 18 0 24M52 16c-10 6-10 18 0 24" stroke={GOLD} strokeWidth="1" opacity="0.4"/>
  </svg>
);

const BaseballIcon = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="26" fill="#0a0a0a" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M16 14c7 18 7 30 0 42M48 14c-7 18-7 30 0 42" stroke={GOLD} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.7"/>
  </svg>
);

const HockeyIcon = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="32" rx="26" ry="18" fill="#0a0a0a" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M18 32h28M26 26l12 12M38 26L26 38" stroke={GOLD} strokeWidth="1.5" opacity="0.6"/>
    <circle cx="32" cy="32" r="3" stroke={GOLD} strokeWidth="1" fill="none"/>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 4l8 20h20l-16 12 6 20-18-12-18 12 6-20-16-12h20l8-20z" fill="#0a0a0a" stroke={GOLD} strokeWidth="1.5"/>
    <circle cx="32" cy="32" r="10" stroke={GOLD} strokeWidth="1" fill="none" opacity="0.3"/>
  </svg>
);

const VintageIcon = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="16" width="48" height="32" rx="4" fill="#0a0a0a" stroke={GOLD} strokeWidth="1.5"/>
    <circle cx="32" cy="32" r="8" stroke={GOLD} strokeWidth="1" fill="none"/>
    <path d="M20 24h24M20 40h24" stroke={GOLD} strokeWidth="1" opacity="0.4"/>
    <circle cx="20" cy="32" r="2" fill={GOLD} opacity="0.5"/>
    <circle cx="44" cy="32" r="2" fill={GOLD} opacity="0.5"/>
  </svg>
);

const SportCategoryGrid = () => {
  const sports = [
    { name: 'NFL', path: 'League > NFL - National Football League', icon: FootballIcon },
    { name: 'NBA', path: 'League > NBA - National Basketball Association', icon: BasketballIcon },
    { name: 'NHL', path: 'League > NHL - National Hockey League', icon: HockeyIcon },
    { name: 'MLB', path: 'League > MLB - Major League Baseball', icon: BaseballIcon },
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
