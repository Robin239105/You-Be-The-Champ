import React from 'react';

const Marquee = () => {
  const text = "FREE SHIPPING ON ORDERS $150+ · 30-DAY RETURNS · PLAYER EDITIONS IN STOCK · NEW: 90s CLASSICS COLLECTION · CUSTOM ENGRAVING AVAILABLE · ";
  
  return (
    <div className="bg-gold py-4 overflow-hidden border-y border-black/10">
      <div className="whitespace-nowrap animate-marquee flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="text-black font-cinzel text-sm font-black tracking-[4px] mx-4 uppercase">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
