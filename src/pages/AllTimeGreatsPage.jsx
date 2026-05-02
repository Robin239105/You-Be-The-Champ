import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import api from '../utils/api';

const PLAYERS = [
  { name: "Aaron Rodgers", catName: "Aaron Rodgers (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8506.jpeg" },
  { name: "Alexander Ovechkin", catName: "Alexander Ovechkin (NHL)", sport: "NHL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8507.jpeg" },
  { name: "Babe Ruth", catName: "Babe Ruth (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8508.jpeg" },
  { name: "Bart Starr", catName: "Bart Starr (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8509.jpeg" },
  { name: "Ben Rothlisberger", catName: "Ben Rothlisberger (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8510.jpeg" },
  { name: "Bill Russell", catName: "Bill Russell (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8511.jpeg" },
  { name: "Bobby Orr", catName: "Bobby Orr (NHL)", sport: "NHL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8512.jpeg" },
  { name: "Brett Favre", catName: "Brett Favre (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8513.jpeg" },
  { name: "Cy Young", catName: "Cy Young (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8514.jpeg" },
  { name: "David Ortiz", catName: "David Ortiz (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8516.jpeg" },
  { name: "David Robinson", catName: "David Robinson (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8517.jpeg" },
  { name: "Derek Jeter", catName: "Derek Jeter (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8518.jpeg" },
  { name: "Dirk Nowitzki", catName: "Dirk Nowitzski (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8519.jpeg" },
  { name: "Drew Brees", catName: "Drew Brees (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8520.jpeg" },
  { name: "Dwayne Wade", catName: "Dwayne Wade (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8521.jpeg" },
  { name: "Garry Maddox", catName: "Garry Maddox (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8522.jpeg" },
  { name: "Gordie Howe", catName: "Gordie Howe (NHL)", sport: "NHL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8523.jpeg" },
  { name: "Hakeem Olajuwon", catName: "Hakeem Olajuwan (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8524.jpeg" },
  { name: "Hank Aaron", catName: "Hank Aaron (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8525.jpeg" },
  { name: "Henri Richard", catName: "Henri Richard (NHL)", sport: "NHL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8526.jpeg" },
  { name: "Honus Wagner", catName: "Honus Wagner (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8527.jpeg" },
  { name: "Isiah Thomas", catName: "Isiah Thomas (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8528.jpeg" },
  { name: "Jean Beliveau", catName: "Jean Beliveau (NHL)", sport: "NHL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8530.jpeg" },
  { name: "Jerry Rice", catName: "Jerry Rice (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8531.jpeg" },
  { name: "Joe DiMaggio", catName: "Joe Dimaggio (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8532.jpeg" },
  { name: "Joe Montana", catName: "Joe Montana (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8533.jpeg" },
  { name: "Joe Namath", catName: "Joe Namath (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8534.jpeg" },
  { name: "John Elway", catName: "John Elway (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8535.jpeg" },
  { name: "Johnny Unitas", catName: "Johnny Unitas (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8536.jpeg" },
  { name: "Jonathan Toews", catName: "Jonathan Toews (NHL)", sport: "NHL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8537.jpeg" },
  { name: "Kareem Abdul-Jabbar", catName: "Kareem Abdul-Jabbar (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8538.jpeg" },
  { name: "Kevin Durant", catName: "Kevin Durant (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8539.jpeg" },
  { name: "Kevin Garnett", catName: "Kevin Garnett (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8541.jpeg" },
  { name: "Kobe Bryant", catName: "Kobe Bryant (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8542.jpeg" },
  { name: "Kurt Warner", catName: "Kurt Warner (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8543.jpeg" },
  { name: "Larry Bird", catName: "Larry Bird (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8544.jpeg" },
  { name: "LeBron James", catName: "Lebron James (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8545.jpeg" },
  { name: "Lou Gehrig", catName: "Lou Gehrig (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8546.jpeg" },
  { name: "Magic Johnson", catName: "Magic Johnson (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8547.jpeg" },
  { name: "Mario Lemieux", catName: "Mario Lemieux (NHL)", sport: "NHL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8548.jpeg" },
  { name: "Mark Messier", catName: "Mark Messier (NHL)", sport: "NHL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8549.jpeg" },
  { name: "Maurice Richard", catName: "Maurice 'The Rocket\" Richard (NHL)", sport: "NHL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8550.jpeg" },
  { name: "Michael Jordan", catName: "Michael Jordan (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8551.jpeg" },
  { name: "Mickey Mantle", catName: "Mickey Mantle (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8552.jpeg" },
  { name: "Mike Bossy", catName: "Mike Bossy (NHL)", sport: "NHL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8553.jpeg" },
  { name: "Mike Schmidt", catName: "Mike Schmidt (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8554.jpeg" },
  { name: "Patrick Mahomes", catName: "Patrick Mahomes (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8555.jpeg" },
  { name: "Pedro Martinez", catName: "Pedro Martinez (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8556.jpeg" },
  { name: "Peyton Manning", catName: "Peyton Manning (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8557.jpeg" },
  { name: "Randy Johnson", catName: "Randy Johnson (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8556.jpeg" },
  { name: "Rickey Henderson", catName: "Rickey Henderson (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8559.jpeg" },
  { name: "Roger Clemens", catName: "Roger Clemens (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8560.jpeg" },
  { name: "Roger Staubach", catName: "Roger Staubach (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8561.jpeg" },
  { name: "Scottie Pippen", catName: "Scottie Pippen (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8562.jpeg" },
  { name: "Shaquille O'Neal", catName: "Shaq O'Neal (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8563.jpeg" },
  { name: "Sidney Crosby", catName: "Sidney Crosby (NHL)", sport: "NHL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8564.jpeg" },
  { name: "Steph Curry", catName: "Steph Curry (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8565.jpeg" },
  { name: "Steve Bartman", catName: "Steve Bartman (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8566.jpeg" },
  { name: "Steve Young", catName: "Steve Young (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8567.jpeg" },
  { name: "Terry Bradshaw", catName: "Terry Bradshaw (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8568.jpeg" },
  { name: "Tim Duncan", catName: "Tim Duncan (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8569.jpeg" },
  { name: "Tom Brady", catName: "Tom Brady (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8570.jpeg" },
  { name: "Troy Aikman", catName: "Troy Aikman (NFL)", sport: "NFL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8572.jpeg" },
  { name: "Wayne Gretzky", catName: "Wayne Gretzsky (NHL)", sport: "NHL", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8505.jpeg" },
  { name: "Willie Mays", catName: "Willie Mays (MLB)", sport: "MLB", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8573.jpeg" },
  { name: "Wilt Chamberlain", catName: "Wilt Chamberlain (NBA)", sport: "NBA", photo: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8574.jpeg" },
];

const SPORT_BADGE = {
  NFL: "bg-gold/10 text-gold border-gold/30",
  NBA: "bg-gold/10 text-gold border-gold/30",
  MLB: "bg-gold/10 text-gold border-gold/30",
  NHL: "bg-gold/10 text-gold border-gold/30",
};

const SPORTS = ["All", "NFL", "NBA", "MLB", "NHL"];

const AllTimeGreatsPage = () => {
  const [filter, setFilter] = useState("All");
  const [imgErrors, setImgErrors] = useState({});
  const [descriptions, setDescriptions] = useState({});

  useEffect(() => {
    const fetchDescriptions = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          const map = {};
          res.data.data.forEach(cat => {
            if (cat.description) map[cat.name.toLowerCase()] = cat.description;
          });
          setDescriptions(map);
        }
      } catch (err) {
        console.error('Failed to fetch category descriptions', err);
      }
    };
    fetchDescriptions();
  }, []);

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
                to={`/category/${encodeURIComponent(`All Time Greats > ${player.catName}`)}`}
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
                    <div className="w-full h-full flex items-center justify-center bg-black">
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
                  {descriptions[player.catName.toLowerCase()] && (
                    <p className="text-white/40 font-raleway text-[10px] leading-snug mt-2 line-clamp-2">
                      {descriptions[player.catName.toLowerCase()]}
                    </p>
                  )}
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
