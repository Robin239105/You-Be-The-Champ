import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const sportColors = { NFL: '#013369', NBA: '#C9002B', MLB: '#002D72', NHL: '#000000' };
const sportBadgeColors = {
  NFL: 'bg-blue-900/40 text-blue-300 border-blue-700/30',
  NBA: 'bg-red-900/40 text-red-300 border-red-700/30',
  MLB: 'bg-blue-800/40 text-blue-200 border-blue-600/30',
  NHL: 'bg-white/10 text-white/70 border-white/20',
};

const MegaMenu = ({ data, onMouseEnter, onMouseLeave }) => {
  if (!data) return null;

  const catLink = (path) => `/category/${encodeURIComponent(path)}`;

  // TYPE C — Player Grid (All Time Greats)
  const renderPlayers = () => (
    <div>
      <div className="grid grid-cols-5 gap-3">
        {data.players.map((p) => (
          <Link
            key={p.path}
            to={catLink(p.path)}
            className="group flex flex-col items-center gap-2 p-3 bg-white/[0.03] border border-gold/5 hover:border-gold/30 hover:bg-gold/5 transition-all text-center"
          >
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-cinzel font-black text-lg group-hover:bg-gold group-hover:text-black transition-all">
              {p.name.charAt(0)}
            </div>
            <span className="text-white group-hover:text-gold text-[10px] font-cinzel tracking-[1px] uppercase transition-colors leading-tight font-bold">{p.name}</span>
            <span className={`text-[8px] px-1.5 py-0.5 border rounded font-cinzel uppercase tracking-widest ${sportBadgeColors[p.sport] || 'bg-white/10 text-white/50 border-white/20'}`}>{p.sport}</span>
          </Link>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gold/10 text-center">
        <Link to="/category/All%20Time%20Greats" className="font-cinzel text-[10px] text-gold uppercase tracking-widest hover:text-white transition-colors">View All Legends →</Link>
      </div>
    </div>
  );

  // TYPE A — Championship Cards (4 large sport cards)
  const renderChampionshipCards = () => (
    <div className="grid grid-cols-4 gap-4">
      {data.cards.map((card) => (
        <Link
          key={card.path}
          to={catLink(card.path)}
          className="group relative flex flex-col items-center justify-center gap-4 p-8 border border-gold/10 hover:border-gold/40 bg-white/[0.02] hover:bg-gold/5 transition-all text-center overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle at center, ${sportColors[card.sport]}22 0%, transparent 70%)` }} />
          <span className="text-5xl">{card.icon}</span>
          <div>
            <p className="font-cinzel text-white font-black text-lg uppercase tracking-[3px] group-hover:text-gold transition-colors">{card.label}</p>
            <p className="text-ivory/40 font-raleway text-[10px] uppercase tracking-widest mt-1">{card.description}</p>
          </div>
          <div className="w-0 group-hover:w-12 h-[1px] bg-gold transition-all duration-300" />
        </Link>
      ))}
    </div>
  );

  // TYPE A — League Grid (4 leagues with divisions)
  const renderLeagueGrid = () => (
    <div className="grid grid-cols-4 gap-6">
      {data.leagues.map((league) => (
        <div key={league.label} className="border border-gold/10 hover:border-gold/20 transition-colors p-5">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gold/10">
            <span className="text-3xl">{league.icon}</span>
            <span className="font-cinzel text-white font-black text-xl uppercase tracking-widest">{league.label}</span>
          </div>
          <ul className="space-y-2">
            {league.divisions.map((div) => (
              <li key={div.path}>
                <Link
                  to={catLink(div.path)}
                  className="flex items-center gap-2 text-white/80 hover:text-gold font-raleway text-xs uppercase tracking-wide transition-colors group py-1"
                >
                  <span className="w-1 h-1 bg-gold/40 rounded-full group-hover:bg-gold transition-colors flex-shrink-0" />
                  {div.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  // TYPE B — Vertical Icon List (Special Release, News, Contact)
  const renderVerticalList = () => (
    <div className="flex flex-col divide-y divide-gold/10 max-w-2xl">
      {data.items.map((item, i) => {
        const to = item.link || (item.path ? catLink(item.path) : '#');
        return (
          <Link key={i} to={to} className="group flex items-center gap-5 py-4 hover:pl-2 transition-all">
            <span className="text-2xl flex-shrink-0 w-10 text-center">{item.icon}</span>
            <div>
              <p className="font-cinzel text-white text-sm uppercase tracking-[2px] group-hover:text-gold transition-colors font-black">{item.label}</p>
              <p className="text-white/50 font-raleway text-xs mt-0.5">{item.description}</p>
            </div>
            <span className="ml-auto text-gold/0 group-hover:text-gold/60 transition-colors text-lg">→</span>
          </Link>
        );
      })}
    </div>
  );

  // Columnar (Complete Team Sets)
  const renderColumnar = () => (
    <div className="grid grid-cols-4 gap-8">
      {data.children.map((col) => (
        <div key={col.label}>
          <h3 className="text-gold text-[10px] font-cinzel font-bold tracking-[3px] mb-4 pb-2 border-b border-gold/10 uppercase">{col.label}</h3>
          <ul className="space-y-2">
            {col.children && col.children.map((item) => (
              <li key={item.path || item.label}>
                <Link
                  to={catLink(item.path)}
                  className="flex items-center gap-2 text-ivory/60 hover:text-gold font-raleway text-xs uppercase tracking-wide transition-colors group py-0.5"
                >
                  <span className="w-1 h-1 bg-gold/20 rounded-full group-hover:bg-gold transition-colors flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  // TWO-PANEL — Champions (left: year grid, right: 4 championship cards)
  const renderTwoPanel = () => {
    const { leftPanel, rightPanel } = data;
    return (
      <div className="grid grid-cols-[1fr_1.4fr] gap-8">
        {/* Left — Champions by Year */}
        <div className="border-r border-gold/10 pr-8">
          <div className="mb-4">
            <p className="font-cinzel text-gold text-xs uppercase tracking-[3px] font-bold">{leftPanel.title}</p>
            <p className="text-white/50 font-raleway text-[10px] mt-1">{leftPanel.description}</p>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {leftPanel.recentYears.map(year => (
              <Link key={year} to={`/category/${encodeURIComponent(`Champions By Year > ${year}`)}`}
                className="group flex items-center justify-center py-2.5 border border-gold/10 hover:border-gold/50 hover:bg-gold/10 transition-all">
                <span className="font-cinzel text-[11px] text-white/80 group-hover:text-gold transition-colors font-bold">{year}</span>
              </Link>
            ))}
          </div>
          <Link to={leftPanel.link}
            className="flex items-center gap-2 text-gold font-cinzel text-[10px] uppercase tracking-widest hover:text-white transition-colors mt-2">
            View All Years →
          </Link>
        </div>
        {/* Right — Championship Series cards */}
        <div>
          <div className="mb-4">
            <p className="font-cinzel text-gold text-xs uppercase tracking-[3px] font-bold">{rightPanel.title}</p>
            <p className="text-white/50 font-raleway text-[10px] mt-1">{rightPanel.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {rightPanel.cards.map(card => (
              <Link key={card.path} to={catLink(card.path)}
                className="group relative flex items-center gap-3 p-4 border border-gold/10 hover:border-gold/40 bg-white/[0.02] hover:bg-gold/5 transition-all overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at left, ${sportColors[card.sport]}20 0%, transparent 70%)` }} />
                <span className="text-3xl flex-shrink-0">{card.icon}</span>
                <div className="relative z-10">
                  <p className="font-cinzel text-white text-sm uppercase tracking-[2px] group-hover:text-gold transition-colors font-black">{card.label}</p>
                  <p className="text-white/50 font-raleway text-[9px] mt-0.5">{card.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // COLLECTIONS PANEL — Complete Team Sets (left 4 cols) + I Want Them All (right sidebar)
  const renderCollectionsPanel = () => {
    const { teamSets, bulkCollections } = data;
    return (
      <div className="grid grid-cols-[1fr_220px] gap-8">
        {/* Left — 4-col team grid */}
        <div>
          <p className="font-cinzel text-gold text-xs uppercase tracking-[3px] font-bold mb-4">{teamSets.title}</p>
          <div className="grid grid-cols-4 gap-6">
            {teamSets.groups.map(group => (
              <div key={group.label}>
                <h4 className="text-gold/80 font-cinzel text-[9px] uppercase tracking-[2px] mb-3 pb-1 border-b border-gold/20 font-bold">{group.label}</h4>
                <ul className="space-y-1.5">
                  {group.items.map(item => (
                    <li key={item.path}>
                      <Link to={catLink(item.path)}
                        className="flex items-center gap-1.5 text-white/80 hover:text-gold font-raleway text-[11px] transition-colors group">
                        <span className="w-1 h-1 bg-gold/40 rounded-full group-hover:bg-gold transition-colors flex-shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Right sidebar — I Want Them All */}
        <div className="border-l border-gold/10 pl-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-cinzel text-gold text-xs uppercase tracking-[3px] font-bold">{bulkCollections.title}</p>
            <Link to={bulkCollections.link} className="text-[9px] text-ivory/30 hover:text-gold font-cinzel uppercase tracking-widest transition-colors">All →</Link>
          </div>
          <ul className="space-y-2">
            {bulkCollections.items.map(item => (
              <li key={item.path}>
                <Link to={catLink(item.path)}
                  className="flex items-center gap-3 p-2.5 border border-gold/5 hover:border-gold/30 hover:bg-gold/5 transition-all group">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <span className="font-cinzel text-white group-hover:text-gold text-[10px] uppercase tracking-wider transition-colors font-bold">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // BROWSE TILES — 3 large clickable tiles (Teams, Cities, Your Year Gift)
  const renderBrowseTiles = () => (
    <div className="grid grid-cols-3 gap-5">
      {data.tiles.map((tile, i) => (
        <Link key={i} to={tile.link}
          className="group flex flex-col items-center justify-center gap-4 p-10 border border-gold/10 hover:border-gold/40 bg-white/[0.02] hover:bg-gold/5 transition-all text-center">
          <span className="text-5xl">{tile.icon}</span>
          <div>
            <p className="font-cinzel text-white font-black text-lg uppercase tracking-[3px] group-hover:text-gold transition-colors">{tile.label}</p>
            <p className="text-white/60 font-raleway text-xs mt-2">{tile.description}</p>
          </div>
          <div className="w-0 group-hover:w-12 h-[1px] bg-gold transition-all duration-300" />
        </Link>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (data.layout) {
      case 'players': return renderPlayers();
      case 'two-panel': return renderTwoPanel();
      case 'league-grid': return renderLeagueGrid();
      case 'collections-panel': return renderCollectionsPanel();
      case 'browse-tiles': return renderBrowseTiles();
      case 'championship-cards': return renderChampionshipCards();
      case 'vertical-list': return renderVerticalList();
      case 'columnar': return renderColumnar();
      default: return null;
    }
  };

  const content = renderContent();
  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="w-full bg-[#0e0e0e] border-b border-gold/30 shadow-[0_40px_100px_rgba(0,0,0,0.95)] pointer-events-auto overflow-hidden"
    >
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="max-w-7xl mx-auto px-8 py-10 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gold/20">
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-gold/10">
          <div>
            <h2 className="text-xl font-black font-cinzel text-white tracking-[5px] uppercase">{data.label}</h2>
            <p className="text-gold/70 font-raleway text-[9px] tracking-[3px] uppercase mt-1">Championship Collection</p>
          </div>
          <Link to="/shop" className="bg-gold/10 hover:bg-gold text-gold hover:text-black px-5 py-2 text-[9px] font-cinzel font-bold tracking-[2px] uppercase transition-all border border-gold/20 whitespace-nowrap">
            Shop All
          </Link>
        </div>
        {content}
      </div>
    </motion.div>
  );
};

export default React.memo(MegaMenu);
