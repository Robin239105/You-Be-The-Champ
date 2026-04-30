import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MegaMenu = ({ data, layout, onMouseEnter, onMouseLeave }) => {
  if (!data || !data.children) return null;

  const renderLayout = () => {
    switch (layout) {
      case 'columnar':
        return (
          <div className="grid grid-cols-4 gap-10">
            {data.children.map((conf) => (
              <div key={conf.label}>
                <h3 className="text-gold text-xs font-cinzel font-bold tracking-[2px] mb-6 border-b border-gold/10 pb-2 uppercase underline underline-offset-8 decoration-gold/30">
                  {conf.label}
                </h3>
                <div className="space-y-6">
                  {conf.children && conf.children.map((div) => (
                    <div key={div.label}>
                      {div.path ? (
                        <Link 
                          to={`/category/${encodeURIComponent(div.path)}`}
                          className="text-ivory font-cinzel text-[9px] tracking-[2px] mb-3 uppercase opacity-50 hover:opacity-100 hover:text-gold transition-all block"
                        >
                          {div.label}
                        </Link>
                      ) : (
                        <p className="text-ivory font-cinzel text-[9px] tracking-[2px] mb-3 uppercase opacity-50">{div.label}</p>
                      )}
                      
                      {div.children && (
                        <ul className="flex flex-col gap-2">
                          {div.children.map((team) => (
                            <li key={team.path}>
                              <Link 
                                to={`/category/${encodeURIComponent(team.path)}`}
                                className="text-ivory/70 hover:text-gold text-xs font-raleway transition-colors uppercase group flex items-center gap-2"
                              >
                                <span className="w-1 h-1 bg-gold/30 rounded-full group-hover:bg-gold transition-colors" />
                                {team.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );


      case 'grid':
        return (
          <div className="grid grid-cols-5 gap-x-8 gap-y-10">
            {data.children.map((item) => (
              <Link 
                key={item.path}
                to={`/category/${encodeURIComponent(item.path)}`}
                className="group flex flex-col items-center justify-center p-4 bg-card-alt/30 border border-gold/5 hover:border-gold/30 hover:bg-gold/5 transition-all text-center h-full"
              >
                <span className="text-ivory/80 group-hover:text-gold text-[10px] font-cinzel tracking-[2px] uppercase transition-colors">
                  {item.label}
                </span>
                <div className="w-0 group-hover:w-8 h-[1px] bg-gold mt-2 transition-all duration-300" />
              </Link>
            ))}
          </div>
        );

      default: // 'list' or others
        return (
          <div className="grid grid-cols-4 gap-8">
            {data.children.map((item) => (
              <Link 
                key={item.path}
                to={`/category/${encodeURIComponent(item.path)}`}
                className="text-ivory/60 hover:text-gold text-xs font-raleway transition-colors uppercase py-1 block border-l border-gold/0 hover:border-gold hover:pl-3 duration-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[95vw] max-w-7xl bg-black/95 backdrop-blur-2xl border-x border-b border-gold/20 shadow-[0_40px_100px_rgba(0,0,0,0.9)] p-12 z-50 text-left overflow-y-auto max-h-[85vh] scrollbar-thin scrollbar-thumb-gold/20 pointer-events-auto"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] gold-gradient" />
      
      <div className="flex items-center justify-between mb-10 border-b border-gold/10 pb-6">
        <div>
          <h2 className="text-2xl font-black font-cinzel text-white tracking-[6px] uppercase">{data.label}</h2>
          <p className="text-gold font-raleway text-[10px] tracking-[3px] uppercase mt-2 opacity-60">Curated Championship Collection</p>
        </div>
        <Link to="/shop" className="bg-gold/10 hover:bg-gold text-gold hover:text-black px-6 py-2 text-[10px] font-cinzel font-bold tracking-[2px] uppercase transition-all border border-gold/20">
          Explore All
        </Link>
      </div>

      {renderLayout()}
    </motion.div>
  );
};

export default React.memo(MegaMenu);
