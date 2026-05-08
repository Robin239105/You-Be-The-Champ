import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { getCategoryThumbnail } from '../data/categoryThumbnails';

const ALL_TEAMS = [
  { name: "Arizona Cardinals", sport: "NFL", path: "Teams > Arizona Cardinals (NFL)" },
  { name: "Atlanta Braves", sport: "MLB", path: "Teams > Atlanta Braves (MLB)" },
  { name: "Atlanta Falcons", sport: "NFL", path: "Teams > Atlanta Falcons (NFL)" },
  { name: "Atlanta Hawks", sport: "NBA", path: "Teams > Atlanta Hawks (NBA)" },
  { name: "Baltimore Ravens", sport: "NFL", path: "Teams > Baltimore Ravens (NFL)" },
  { name: "Boston Bruins", sport: "NHL", path: "Teams > Boston Bruins (NHL)" },
  { name: "Boston Celtics", sport: "NBA", path: "Teams > Boston Celtics (NBA)" },
  { name: "Boston Red Sox", sport: "MLB", path: "Teams > Boston Red Sox (MLB)" },
  { name: "Buffalo Bills", sport: "NFL", path: "Teams > Buffalo Bills (NFL)" },
  { name: "Carolina Panthers", sport: "NFL", path: "Teams > Carolina Panthers (NFL)" },
  { name: "Chicago Bears", sport: "NFL", path: "Teams > Chicago Bears (NFL)" },
  { name: "Chicago Blackhawks", sport: "NHL", path: "Teams > Chicago Blackhawks (NHL)" },
  { name: "Chicago Bulls", sport: "NBA", path: "Teams > Chicago Bulls (NBA)" },
  { name: "Chicago Cubs", sport: "MLB", path: "Teams > Chicago Cubs (MLB)" },
  { name: "Chicago White Sox", sport: "MLB", path: "Teams > Chicago White Sox (MLB)" },
  { name: "Cincinnati Bengals", sport: "NFL", path: "Teams > Cincinnati Bengals (NFL)" },
  { name: "Cleveland Browns", sport: "NFL", path: "Teams > Cleveland Browns (NFL)" },
  { name: "Cleveland Cavaliers", sport: "NBA", path: "Teams > Cleveland Cavaliers (NBA)" },
  { name: "Dallas Cowboys", sport: "NFL", path: "Teams > Dallas Cowboys (NFL)" },
  { name: "Dallas Mavericks", sport: "NBA", path: "Teams > Dallas Mavericks (NBA)" },
  { name: "Denver Broncos", sport: "NFL", path: "Teams > Denver Broncos (NFL)" },
  { name: "Denver Nuggets", sport: "NBA", path: "Teams > Denver Nuggets (NBA)" },
  { name: "Detroit Lions", sport: "NFL", path: "Teams > Detroit Lions (NFL)" },
  { name: "Detroit Pistons", sport: "NBA", path: "Teams > Detroit Pistons (NBA)" },
  { name: "Detroit Red Wings", sport: "NHL", path: "Teams > Detroit Red Wings (NHL)" },
  { name: "Detroit Tigers", sport: "MLB", path: "Teams > Detroit Tigers (MLB)" },
  { name: "Edmonton Oilers", sport: "NHL", path: "Teams > Edmonton Oilers (NHL)" },
  { name: "Golden State Warriors", sport: "NBA", path: "Teams > Golden State Warriors (NBA)" },
  { name: "Green Bay Packers", sport: "NFL", path: "Teams > Green Bay Packers (NFL)" },
  { name: "Houston Astros", sport: "MLB", path: "Teams > Houston Astros (MLB)" },
  { name: "Houston Rockets", sport: "NBA", path: "Teams > Houston Rockets (NBA)" },
  { name: "Houston Texans", sport: "NFL", path: "Teams > Houston Texans (NFL)" },
  { name: "Indianapolis Colts", sport: "NFL", path: "Teams > Indianapolis Colts (NFL)" },
  { name: "Kansas City Chiefs", sport: "NFL", path: "Teams > Kansas City Chiefs (NFL)" },
  { name: "Kansas City Royals", sport: "MLB", path: "Teams > Kansas City Royals (MLB)" },
  { name: "Los Angeles Clippers", sport: "NBA", path: "Teams > Los Angeles Clippers (NBA)" },
  { name: "Los Angeles Dodgers", sport: "MLB", path: "Teams > Los Angeles Dodgers (MLB)" },
  { name: "Los Angeles Kings", sport: "NHL", path: "Teams > Los Angeles Kings (NHL)" },
  { name: "Los Angeles Lakers", sport: "NBA", path: "Teams > Los Angeles Lakers (NBA)" },
  { name: "Los Angeles Rams", sport: "NFL", path: "Teams > Los Angeles Rams (NFL)" },
  { name: "Miami Dolphins", sport: "NFL", path: "Teams > Miami Dolphins (NFL)" },
  { name: "Miami Heat", sport: "NBA", path: "Teams > Miami Heat (NBA)" },
  { name: "Miami Marlins", sport: "MLB", path: "Teams > Miami Marlins (MLB)" },
  { name: "Milwaukee Bucks", sport: "NBA", path: "Teams > Milwaukee Bucks (NBA)" },
  { name: "Minnesota Twins", sport: "MLB", path: "Teams > Minnesota Twins (MLB)" },
  { name: "Minnesota Vikings", sport: "NFL", path: "Teams > Minnesota Vikings (NFL)" },
  { name: "Montreal Canadiens", sport: "NHL", path: "Teams > Montreal Canadiens (NHL)" },
  { name: "New England Patriots", sport: "NFL", path: "Teams > New England Patriots (NFL)" },
  { name: "New Orleans Saints", sport: "NFL", path: "Teams > New Orleans Saints (NFL)" },
  { name: "New York Giants", sport: "NFL", path: "Teams > New York Giants (NFL)" },
  { name: "New York Jets", sport: "NFL", path: "Teams > New York Jets (NFL)" },
  { name: "New York Knicks", sport: "NBA", path: "Teams > New York Knicks (NBA)" },
  { name: "New York Mets", sport: "MLB", path: "Teams > New York Mets (MLB)" },
  { name: "New York Rangers", sport: "NHL", path: "Teams > New York Rangers (NHL)" },
  { name: "New York Yankees", sport: "MLB", path: "Teams > New York Yankees (MLB)" },
  { name: "Oakland Athletics", sport: "MLB", path: "Teams > Oakland Athletics (MLB)" },
  { name: "Oklahoma City Thunder", sport: "NBA", path: "Teams > Oklahoma City Thunder (NBA)" },
  { name: "Philadelphia Eagles", sport: "NFL", path: "Teams > Philadelphia Eagles (NFL)" },
  { name: "Philadelphia Flyers", sport: "NHL", path: "Teams > Philadelphia Flyers (NHL)" },
  { name: "Philadelphia Phillies", sport: "MLB", path: "Teams > Philadelphia Phillies (MLB)" },
  { name: "Philadelphia 76ers", sport: "NBA", path: "Teams > Philadelphia 76ers (NBA)" },
  { name: "Phoenix Suns", sport: "NBA", path: "Teams > Phoenix Suns (NBA)" },
  { name: "Pittsburgh Penguins", sport: "NHL", path: "Teams > Pittsburgh Penguins (NHL)" },
  { name: "Pittsburgh Pirates", sport: "MLB", path: "Teams > Pittsburgh Pirates (MLB)" },
  { name: "Pittsburgh Steelers", sport: "NFL", path: "Teams > Pittsburgh Steelers (NFL)" },
  { name: "San Antonio Spurs", sport: "NBA", path: "Teams > San Antonio Spurs (NBA)" },
  { name: "San Francisco 49ers", sport: "NFL", path: "Teams > San Francisco 49ers (NFL)" },
  { name: "San Francisco Giants", sport: "MLB", path: "Teams > San Francisco Giants (MLB)" },
  { name: "Seattle Seahawks", sport: "NFL", path: "Teams > Seattle Seahawks (NFL)" },
  { name: "Seattle SuperSonics", sport: "NBA", path: "Teams > Seattle SuperSonics (NBA)" },
  { name: "Tampa Bay Buccaneers", sport: "NFL", path: "Teams > Tampa Bay Buccaneers (NFL)" },
  { name: "Tampa Bay Lightning", sport: "NHL", path: "Teams > Tampa Bay Lightning (NHL)" },
  { name: "Toronto Maple Leafs", sport: "NHL", path: "Teams > Toronto Maple Leafs (NHL)" },
  { name: "Toronto Raptors", sport: "NBA", path: "Teams > Toronto Raptors (NBA)" },
  { name: "Washington Capitals", sport: "NHL", path: "Teams > Washington Capitals (NHL)" },
  { name: "Washington Commanders", sport: "NFL", path: "Teams > Washington Commanders (NFL)" },
];

const sportColors = { NFL: 'text-blue-400', NBA: 'text-red-400', MLB: 'text-yellow-400', NHL: 'text-gray-300' };
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const TeamsPage = () => {
  const [search, setSearch] = useState('');
  const filtered = search
    ? ALL_TEAMS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    : ALL_TEAMS;

  const grouped = alphabet.reduce((acc, letter) => {
    const teams = filtered.filter(t => t.name.toUpperCase().startsWith(letter));
    if (teams.length) acc[letter] = teams;
    return acc;
  }, {});

  return (
    <div className="bg-black min-h-screen">
      <Header />
       <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-52 pb-24">
        <Breadcrumb items={[{ name: 'Teams', path: '/teams' }]} />

        <div className="mb-12 text-center py-14 bg-surface border border-gold/10 relative overflow-hidden">
          <div className="absolute inset-0 gold-glow opacity-10" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black font-cinzel text-gold tracking-widest uppercase mb-4">Browse by Team</h1>
            <p className="text-ivory/50 font-raleway uppercase tracking-[3px] text-xs mb-8">Find rings for every championship team</p>
            <div className="relative max-w-md mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search teams..."
                className="w-full bg-black border border-gold/20 pl-10 pr-4 py-3 text-white font-raleway text-sm focus:border-gold outline-none"
              />
            </div>
          </div>
        </div>

        {/* A-Z Jump Links */}
        {!search && (
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {Object.keys(grouped).map(letter => (
              <a key={letter} href={`#letter-${letter}`}
                className="w-8 h-8 flex items-center justify-center border border-gold/20 hover:border-gold hover:bg-gold hover:text-black text-ivory/60 font-cinzel text-xs transition-all">
                {letter}
              </a>
            ))}
          </div>
        )}

        {/* Team List */}
        <div className="space-y-10">
          {Object.entries(grouped).map(([letter, teams]) => (
            <div key={letter} id={`letter-${letter}`}>
              <h2 className="font-cinzel text-gold text-2xl font-black border-b border-gold/20 pb-3 mb-5">{letter}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {teams.map(team => {
                  const thumb = getCategoryThumbnail(team.path);
                  return (
                    <Link key={team.path} to={`/category/${encodeURIComponent(team.path)}`}
                      className="group flex items-center justify-between px-4 py-3 border border-gold/10 hover:border-gold/40 bg-white/[0.02] hover:bg-gold/5 transition-all gap-3">
                      {thumb && (
                        <img src={thumb} alt={team.name} className="w-9 h-9 object-cover rounded-sm opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      )}
                      <span className="font-raleway text-sm text-ivory/70 group-hover:text-white transition-colors flex-1">{team.name}</span>
                      <span className={`font-cinzel text-[9px] font-bold flex-shrink-0 ${sportColors[team.sport]}`}>{team.sport}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          {Object.keys(grouped).length === 0 && (
            <p className="text-center text-ivory/30 font-cinzel uppercase tracking-widest py-20">No teams found for "{search}"</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeamsPage;
