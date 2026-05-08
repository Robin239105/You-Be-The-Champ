import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { motion } from 'framer-motion';
import { getCategoryThumbnail } from '../data/categoryThumbnails';

const CITIES = [
  { name: "New York City", path: "Your City > New York City Pro Teams", teams: "Yankees · Giants · Knicks · Rangers" },
  { name: "Los Angeles", path: "Your City > Los Angeles Pro Teams", teams: "Dodgers · Lakers · Rams · Kings" },
  { name: "Chicago", path: "Your City > Chicago Pro Teams", teams: "Bulls · Cubs · Blackhawks · Bears" },
  { name: "Boston", path: "Your City > Boston Pro Teams", teams: "Red Sox · Celtics · Bruins · Patriots" },
  { name: "Dallas", path: "Your City > Dallas Pro Teams", teams: "Cowboys · Mavericks · Rangers · Stars" },
  { name: "Toronto", path: "Your City > Toronto Pro Teams", teams: "Raptors · Maple Leafs · Blue Jays" },
  { name: "Pittsburgh", path: "Your City > Pittsburgh Pro Teams", teams: "Steelers · Penguins · Pirates" },
  { name: "Miami", path: "Your City > Miami Pro Teams", teams: "Heat · Dolphins · Marlins" },
  { name: "Philadelphia", path: "Your City > Philadelphia Pro Teams", teams: "Eagles · 76ers · Flyers · Phillies" },
  { name: "Houston", path: "Your City > Houston Pro Teams", teams: "Astros · Rockets · Texans" },
  { name: "Denver", path: "Your City > Denver Pro Teams", teams: "Broncos · Nuggets · Avalanche" },
  { name: "Atlanta", path: "Your City > Atlanta Pro Teams", teams: "Falcons · Hawks · Braves" },
  { name: "Seattle", path: "Your City > Seattle Pro Teams", teams: "Seahawks · SuperSonics · Mariners" },
  { name: "Detroit", path: "Your City > Detroit Pro Teams", teams: "Lions · Pistons · Red Wings · Tigers" },
  { name: "San Francisco", path: "Your City > San Francisco Pro Teams", teams: "49ers · Giants · Warriors" },
  { name: "Minneapolis", path: "Your City > Minneapolis Pro Teams", teams: "Vikings · Timberwolves · Twins" },
  { name: "Phoenix", path: "Your City > Phoenix Pro Teams", teams: "Suns · Cardinals · Coyotes" },
  { name: "Montreal", path: "Your City > Montreal Pro Teams", teams: "Canadiens · Expos" },
];

const CitiesPage = () => (
  <div className="bg-black min-h-screen">
    <Header />
     <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-52 pb-24">
      <Breadcrumb items={[{ name: 'Cities', path: '/cities' }]} />

      <div className="mb-16 text-center py-16 bg-surface border border-gold/10 relative overflow-hidden">
        <div className="absolute inset-0 gold-glow opacity-10" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black font-cinzel text-gold tracking-widest uppercase mb-4">Browse by City</h1>
          <p className="text-ivory/50 font-raleway uppercase tracking-[3px] text-xs">Shop championship rings for your hometown teams</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {CITIES.map((city, i) => (
          <motion.div key={city.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Link to={`/category/${encodeURIComponent(city.path)}`}
              className="group relative flex flex-col justify-end border border-gold/10 hover:border-gold/40 overflow-hidden transition-all h-full min-h-[160px]">
              {getCategoryThumbnail(city.path) && (
                <>
                  <img src={getCategoryThumbnail(city.path)} alt={city.name} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </>
              )}
              <div className="relative z-10 p-5">
                <p className="font-cinzel text-white font-black text-lg uppercase tracking-wider group-hover:text-gold transition-colors mb-1">{city.name}</p>
                <p className="text-ivory/40 font-raleway text-[11px] leading-relaxed">{city.teams}</p>
                <div className="w-0 group-hover:w-8 h-[1px] bg-gold mt-3 transition-all duration-300" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default CitiesPage;
