import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SportCategoryGrid = () => {
  const sports = [
    { name: 'NFL', path: 'League > NFL - National Football League', icon: '🏈' },
    { name: 'NBA', path: 'League > NBA - National Basketball Association', icon: '🏀' },
    { name: 'NHL', path: 'League > NHL - National Hockey League', icon: '🏒' },
    { name: 'MLB', path: 'League > MLB - National Football League', icon: '⚾' },
    { name: 'Player Editions', slug: 'player-editions', icon: '🌟' },
    { name: 'Vintage 90s', slug: 'vintage-90s', icon: '📼' },
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
              <div className="text-5xl mb-6 transition-transform group-hover:scale-125 duration-500">{sport.icon}</div>
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
