import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
  { icon: "🏈", label: "All NFL Rings", path: "Championships/Finals > Super Bowl Championship Rings" },
  { icon: "🏀", label: "All NBA Rings", path: "Championships/Finals > NBA Finals Championship Rings" },
  { icon: "⚾", label: "All MLB Rings", path: "Championships/Finals > World Series Championship Rings" },
  { icon: "🏒", label: "All NHL Rings", path: "Championships/Finals > Stanley Cup Championship Rings" },
  { icon: "⭐", label: "Special Players", path: "Special Release Champion Players Rings" },
];

const catLink = (path) => `/category/${encodeURIComponent(path)}`;

const CollectionsPage = () => (
  <div className="bg-black min-h-screen text-ivory">
    <Header />
    <main className="max-w-7xl mx-auto px-8 pt-40 pb-24">
      <div className="mb-14">
        <span className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase block mb-3">Browse</span>
        <h1 className="text-5xl font-black font-cinzel text-white uppercase tracking-widest mb-2">Collections</h1>
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
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
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
