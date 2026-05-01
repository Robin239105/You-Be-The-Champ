import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const PLAYERS = [
  { name: "Tom Brady", sport: "NFL", color: "#013369", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/c/cb/Tom_Brady_2021.png&w=400&h=400&fit=cover&a=top" },
  { name: "Michael Jordan", sport: "NBA", color: "#C9002B", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/a/ae/Michael_Jordan_in_2014.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Kobe Bryant", sport: "NBA", color: "#C9002B", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/2/22/KBryant8.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "LeBron James", sport: "NBA", color: "#C9002B", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Babe Ruth", sport: "MLB", color: "#002D72", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/d/d7/Babe_Ruth%2C_1933.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Wayne Gretzky", sport: "NHL", color: "#888", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/4/41/Wgretz_%28cropped3%29.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Joe Montana", sport: "NFL", color: "#013369", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/8/8c/Joe_Montana_ESPN_cropped2.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Magic Johnson", sport: "NBA", color: "#C9002B", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/2/29/Magic_Johnson_at_SXSW_2022_%2851958828669%29_%28cropped%29.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Derek Jeter", sport: "MLB", color: "#002D72", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/a/a2/Derek_Jeter_during_MLB_on_Fox_pre-game_show%2C_October_16%2C_2024_-_001_%28cropped%29.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Sidney Crosby", sport: "NHL", color: "#888", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/a/ae/Sidney_Crosby_2019-01-06_1.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Jerry Rice", sport: "NFL", color: "#013369", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/0/01/Super_Bowl_44_Miami_Florida_NFL_Network_South_Beach_Set_Deon_Sanders_interviews_Jerry_Rice_%284331549867%29_%28cropped%29_-_Jerry_Rice.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Larry Bird", sport: "NBA", color: "#C9002B", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/b/bb/Larrybird.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Mickey Mantle", sport: "MLB", color: "#002D72", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/b/bd/1954_Bowman_Mickey_Mantle.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Mario Lemieux", sport: "NHL", color: "#888", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/6/6a/Mario_Lemieux_2001.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Peyton Manning", sport: "NFL", color: "#013369", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/2/2e/Peyton_Manning_%2851665689271%29.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Steph Curry", sport: "NBA", color: "#C9002B", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/7/7f/Stephen_Curry_Shooting_%28cropped%29_%28cropped%29.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Hank Aaron", sport: "MLB", color: "#002D72", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/4/40/Hank_Aaron_1974.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Gordie Howe", sport: "NHL", color: "#888", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/6/6c/Gordie_Howe_%28cropped%29.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Patrick Mahomes", sport: "NFL", color: "#013369", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/6/62/Patrick_Mahomes_in_the_Oval_Office_of_the_White_House_on_June_5%2C_2023_-_P20230605AS-0902_%28cropped%29.jpg&w=400&h=400&fit=cover&a=top" },
  { name: "Kareem Abdul-Jabbar", sport: "NBA", color: "#C9002B", photo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/a/a0/Kareem_Abdul-Jabbar_May_2014.jpg&w=400&h=400&fit=cover&a=top" },
];

const SPORT_BADGE = {
  NFL: "bg-blue-900/40 text-blue-200 border-blue-700/40",
  NBA: "bg-red-900/40 text-red-200 border-red-700/40",
  MLB: "bg-blue-800/40 text-blue-100 border-blue-600/40",
  NHL: "bg-white/10 text-white/70 border-white/20",
};

const SPORTS = ["All", "NFL", "NBA", "MLB", "NHL"];

const AllTimeGreatsPage = () => {
  const [filter, setFilter] = useState("All");
  const [imgErrors, setImgErrors] = useState({});

  const filtered = filter === "All" ? PLAYERS : PLAYERS.filter(p => p.sport === filter);

  return (
    <div className="bg-black min-h-screen text-ivory">
      <Header />
      <main className="max-w-7xl mx-auto px-8 pt-40 pb-24">
        <Breadcrumb items={[{ name: "All Time Greats", path: "/all-time-greats" }]} />

        {/* Hero Header */}
        <div className="text-center py-16 border border-gold/10 bg-white/[0.02] relative overflow-hidden mb-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.08)_0%,transparent_70%)]" />
          <div className="relative z-10">
            <span className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase block mb-3">Championship Collection</span>
            <h1 className="text-5xl md:text-7xl font-black font-cinzel text-white uppercase tracking-widest mb-3">All Time Greats</h1>
            <p className="text-white/40 font-raleway text-sm uppercase tracking-[3px]">Own the ring of a legend</p>
          </div>
        </div>

        {/* Sport Filter */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {SPORTS.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`font-cinzel text-[10px] uppercase tracking-[2px] px-5 py-2 border transition-all ${
                filter === s
                  ? 'bg-gold text-black border-gold font-black'
                  : 'border-gold/20 text-white/60 hover:border-gold/50 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Player Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filtered.map((player, i) => (
            <motion.div
              key={player.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/category/${encodeURIComponent(`All Time Greats > ${player.name} (${player.sport})`)}`}
                className="group flex flex-col border border-gold/10 hover:border-gold/50 overflow-hidden transition-all duration-300 hover:shadow-[0_0_24px_rgba(201,168,76,0.2)] bg-white/[0.02]"
              >
                {/* Photo */}
                <div className="aspect-square overflow-hidden relative bg-black">
                  {!imgErrors[player.name] ? (
                    <img
                      src={player.photo}
                      alt={player.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={() => setImgErrors(e => ({ ...e, [player.name]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `radial-gradient(circle at center, ${player.color}33, #000)` }}>
                      <span className="font-cinzel font-black text-gold text-6xl">{player.name.charAt(0)}</span>
                    </div>
                  )}
                  {/* Gold overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-300" />
                  {/* Shop ring badge on hover */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    <span className="bg-gold text-black font-cinzel text-[9px] uppercase tracking-[2px] px-3 py-1 font-black">Shop Ring →</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 bg-black">
                  <p className="font-cinzel text-white font-black text-xs uppercase tracking-[1px] group-hover:text-gold transition-colors mb-1.5 leading-tight">{player.name}</p>
                  <span className={`text-[8px] px-1.5 py-0.5 border font-cinzel uppercase tracking-widest ${SPORT_BADGE[player.sport]}`}>{player.sport}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllTimeGreatsPage;
