import React from 'react';

const Marquee = () => {
  const text = "THE LATEST CHAMPIONSHIP RINGS AVAILABLE · LIMITED TIME ONLY; FREE SHIPPING ON ALL ORDERS · ENORMOUS CATALOGUE OF RINGS · ALL SUPERBOWL, NBA FINALS, STANLEY CUP & WORLD SERIES RINGS · VOTED NUMBER 1 HIGHEST QUALITY OF RINGS · ";
  
  const items = Array.from({ length: 20 }).map((_, i) => (
    <span key={i} className="text-black font-cinzel text-sm font-black tracking-[4px] mx-4 uppercase whitespace-nowrap">
      {text}
    </span>
  ));

  return (
    <div className="relative bg-gold py-4 overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gold to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gold to-transparent z-10 pointer-events-none" />
      <div className="whitespace-nowrap animate-marquee flex">
        {items}
      </div>
    </div>
  );
};

export default Marquee;