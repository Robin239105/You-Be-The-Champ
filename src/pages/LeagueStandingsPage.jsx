import React from 'react';
import { getCategoryThumbnail } from '../data/categoryThumbnails';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const LEAGUE_DATA = {
  nfl: {
    name: "NFL",
    icon: "/NFL Logo.png",
    label: "National Football League",
    color: "#013369",
    categoryBase: "League > NFL - National Football League",
    conferences: [
      {
        name: "AFC",
        divisions: [
          {
            name: "AFC East",
            path: "League > NFL - National Football League > AFC East",
            teams: ["Buffalo Bills", "Miami Dolphins", "New England Patriots", "New York Jets"],
          },
          {
            name: "AFC North",
            path: "League > NFL - National Football League > AFC North",
            teams: ["Baltimore Ravens", "Cincinnati Bengals", "Cleveland Browns", "Pittsburgh Steelers"],
          },
          {
            name: "AFC South",
            path: "League > NFL - National Football League > AFC South",
            teams: ["Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Tennessee Titans"],
          },
          {
            name: "AFC West",
            path: "League > NFL - National Football League > AFC West",
            teams: ["Denver Broncos", "Kansas City Chiefs", "Las Vegas Raiders", "Los Angeles Chargers"],
          },
        ],
      },
      {
        name: "NFC",
        divisions: [
          {
            name: "NFC East",
            path: "League > NFL - National Football League > NFC East",
            teams: ["Dallas Cowboys", "New York Giants", "Philadelphia Eagles", "Washington Commanders"],
          },
          {
            name: "NFC North",
            path: "League > NFL - National Football League > NFC North",
            teams: ["Chicago Bears", "Detroit Lions", "Green Bay Packers", "Minnesota Vikings"],
          },
          {
            name: "NFC South",
            path: "League > NFL - National Football League > NFC South",
            teams: ["Atlanta Falcons", "Carolina Panthers", "New Orleans Saints", "Tampa Bay Buccaneers"],
          },
          {
            name: "NFC West",
            path: "League > NFL - National Football League > NFC West",
            teams: ["Arizona Cardinals", "Los Angeles Rams", "San Francisco 49ers", "Seattle Seahawks"],
          },
        ],
      },
    ],
  },

  nba: {
    name: "NBA",
    icon: "/NBA Logo.png",
    label: "National Basketball Association",
    color: "#C9002B",
    categoryBase: "League > NBA - National Basketball Association",
    conferences: [
      {
        name: "Eastern Conference",
        divisions: [
          {
            name: "EC Atlantic",
            path: "League > NBA - National Basketball Association > EC Atlantic",
            teams: ["Boston Celtics", "Brooklyn Nets", "New York Knicks", "Philadelphia 76ers", "Toronto Raptors"],
          },
          {
            name: "EC Central",
            path: "League > NBA - National Basketball Association > EC Central",
            teams: ["Chicago Bulls", "Cleveland Cavaliers", "Detroit Pistons", "Indiana Pacers", "Milwaukee Bucks"],
          },
          {
            name: "EC Southeast",
            path: "League > NBA - National Basketball Association > EC Southeast",
            teams: ["Atlanta Hawks", "Charlotte Hornets", "Miami Heat", "Orlando Magic", "Washington Wizards"],
          },
        ],
      },
      {
        name: "Western Conference",
        divisions: [
          {
            name: "WC Northwest",
            path: "League > NBA - National Basketball Association > WC Northwest",
            teams: ["Denver Nuggets", "Minnesota Timberwolves", "Oklahoma City Thunder", "Portland Trail Blazers", "Utah Jazz"],
          },
          {
            name: "WC Pacific",
            path: "League > NBA - National Basketball Association > WC Pacific",
            teams: ["Golden State Warriors", "LA Clippers", "Los Angeles Lakers", "Phoenix Suns", "Sacramento Kings"],
          },
          {
            name: "WC Southwest",
            path: "League > NBA - National Basketball Association > WC Southwest",
            teams: ["Dallas Mavericks", "Houston Rockets", "Memphis Grizzlies", "New Orleans Pelicans", "San Antonio Spurs"],
          },
        ],
      },
    ],
  },

  mlb: {
    name: "MLB",
    icon: "/MLB Logo.png",
    label: "Major League Baseball",
    color: "#002D72",
    categoryBase: "League > MLB - Major League Baseball",
    conferences: [
      {
        name: "American League",
        divisions: [
          {
            name: "AL East",
            path: "League > MLB - Major League Baseball > AL East",
            teams: ["Baltimore Orioles", "Boston Red Sox", "New York Yankees", "Tampa Bay Rays", "Toronto Blue Jays"],
          },
          {
            name: "AL Central",
            path: "League > MLB - Major League Baseball > AL Central",
            teams: ["Chicago White Sox", "Cleveland Guardians", "Detroit Tigers", "Kansas City Royals", "Minnesota Twins"],
          },
          {
            name: "AL West",
            path: "League > MLB - Major League Baseball > AL West",
            teams: ["Houston Astros", "Los Angeles Angels", "Oakland Athletics", "Seattle Mariners", "Texas Rangers"],
          },
        ],
      },
      {
        name: "National League",
        divisions: [
          {
            name: "NL East",
            path: "League > MLB - Major League Baseball > NL East",
            teams: ["Atlanta Braves", "Miami Marlins", "New York Mets", "Philadelphia Phillies", "Washington Nationals"],
          },
          {
            name: "NL Central",
            path: "League > MLB - Major League Baseball > NL Central",
            teams: ["Chicago Cubs", "Cincinnati Reds", "Milwaukee Brewers", "Pittsburgh Pirates", "St. Louis Cardinals"],
          },
          {
            name: "NL West",
            path: "League > MLB - Major League Baseball > NL West",
            teams: ["Arizona Diamondbacks", "Colorado Rockies", "Los Angeles Dodgers", "San Diego Padres", "San Francisco Giants"],
          },
        ],
      },
    ],
  },

  nhl: {
    name: "NHL",
    icon: "/NHL Logo.png",
    label: "National Hockey League",
    color: "#111111",
    categoryBase: "League > NHL - National Hockey League",
    conferences: [
      {
        name: "Eastern Conference",
        divisions: [
          {
            name: "EC Atlantic",
            path: "League > NHL - National Hockey League > EC Atlantic",
            teams: ["Boston Bruins", "Buffalo Sabres", "Detroit Red Wings", "Florida Panthers", "Montreal Canadiens", "Ottawa Senators", "Tampa Bay Lightning", "Toronto Maple Leafs"],
          },
          {
            name: "EC Metropolitan",
            path: "League > NHL - National Hockey League > EC Metropolitan",
            teams: ["Carolina Hurricanes", "Columbus Blue Jackets", "New Jersey Devils", "New York Islanders", "New York Rangers", "Philadelphia Flyers", "Pittsburgh Penguins", "Washington Capitals"],
          },
        ],
      },
      {
        name: "Western Conference",
        divisions: [
          {
            name: "WC Central",
            path: "League > NHL - National Hockey League > WC Central",
            teams: ["Arizona Coyotes", "Chicago Blackhawks", "Colorado Avalanche", "Dallas Stars", "Minnesota Wild", "Nashville Predators", "St. Louis Blues", "Winnipeg Jets"],
          },
          {
            name: "WC Pacific",
            path: "League > NHL - National Hockey League > WC Pacific",
            teams: ["Anaheim Ducks", "Calgary Flames", "Edmonton Oilers", "Los Angeles Kings", "San Jose Sharks", "Seattle Kraken", "Vancouver Canucks", "Vegas Golden Knights"],
          },
        ],
      },
    ],
  },
};

const LeagueStandingsPage = () => {
  const { league } = useParams();
  const data = LEAGUE_DATA[league?.toLowerCase()];

  if (!data) return <Navigate to="/league" replace />;

  const catLink = (path) => `/category/${encodeURIComponent(path)}`;

  return (
    <div className="bg-black min-h-screen text-ivory">
      <Header />
      <main className="max-w-7xl mx-auto px-8 pt-40 pb-24">
        <Breadcrumb items={[
          { name: "League", path: "/league" },
          { name: data.name, path: `/league/${league}` },
        ]} />

        {/* Header */}
        <div className="text-center py-16 border border-gold/10 bg-white/[0.02] relative overflow-hidden mb-16">
          <div className="absolute inset-0 opacity-100 transition-opacity"
            style={{ background: `radial-gradient(circle at center, ${data.color}22 0%, transparent 65%)` }} />
          <div className="relative z-10">
            <img src={data.icon} alt={data.name} className="w-20 h-20 object-contain mx-auto mb-4" />
            <h1 className="text-5xl md:text-7xl font-black font-cinzel text-white uppercase tracking-widest mb-2">{data.name}</h1>
            <p className="text-white/40 font-raleway text-sm uppercase tracking-[3px]">{data.label}</p>
          </div>
        </div>

        {/* Shop All League */}
        <div className="mb-12 text-center">
          <Link to={catLink(data.categoryBase)}
            className="inline-flex items-center gap-3 border border-gold/30 hover:border-gold hover:bg-gold hover:text-black text-gold font-cinzel text-xs uppercase tracking-[3px] px-8 py-3 transition-all duration-300">
            Shop All {data.name} Rings →
          </Link>
        </div>

        {/* Standings Table */}
        {data.conferences.map((conf, ci) => (
          <motion.div
            key={conf.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.1 }}
            className="mb-14"
          >
            {/* Conference Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] flex-1 bg-gold/20" />
              <h2 className="font-cinzel text-gold font-black text-sm uppercase tracking-[4px]">{conf.name}</h2>
              <div className="h-[1px] flex-1 bg-gold/20" />
            </div>

            {/* Division Grid */}
            <div className={`grid gap-6 ${conf.divisions.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {conf.divisions.map((div, di) => (
                <motion.div
                  key={div.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.1 + di * 0.06 }}
                  className="border border-gold/10 bg-white/[0.02] overflow-hidden"
                >
                  {/* Division header */}
                  <Link to={catLink(div.path)}
                    className="group flex items-center justify-between px-4 py-3 border-b border-gold/10 hover:bg-gold/10 transition-colors">
                    <span className="font-cinzel text-gold text-xs uppercase tracking-[2px] font-black">{div.name}</span>
                    <span className="text-gold/30 group-hover:text-gold text-xs transition-colors">→</span>
                  </Link>

                  {/* Teams */}
                  <div className="divide-y divide-white/[0.04]">
                    {div.teams.map((team) => {
                      const teamThumb = getCategoryThumbnail(`Teams > ${team} (${data.name})`);
                      return (
                        <Link
                          key={team}
                          to={catLink(`Teams > ${team} (${data.name})`)}
                          className="group flex items-center gap-3 px-4 py-2 hover:bg-gold/5 transition-colors"
                        >
                          {teamThumb ? (
                            <img src={teamThumb} alt={team} className="w-7 h-7 object-cover rounded-sm opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-gold/20 group-hover:bg-gold flex-shrink-0 transition-colors" />
                          )}
                          <span className="font-raleway text-white/70 group-hover:text-gold text-xs transition-colors">{team}</span>
                          <span className="ml-auto text-[9px] font-cinzel text-gold/0 group-hover:text-gold/50 uppercase tracking-widest transition-colors">Shop</span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default LeagueStandingsPage;
