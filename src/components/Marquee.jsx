import React from 'react';

const Marquee = () => {
  const text = "THE LATEST CHAMPIONSHIP RINGS AVAILABLE · LIMITED TIME ONLY; FREE SHIPPING ON ALL ORDERS · ENORMOUS CATALOGUE OF RINGS · ALL SUPERBOWL, NBA FINALS, STANLEY CUP & WORLD SERIES RINGS · VOTED NUMBER 1 HIGHEST QUALITY OF RINGS · ";
  
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
