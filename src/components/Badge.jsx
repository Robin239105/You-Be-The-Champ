import React from 'react';

const Badge = ({ children, variant = 'gold', className = '' }) => {
  const variants = {
    gold: "bg-gold/10 text-gold border-gold/30",
    crimson: "bg-crimson/10 text-crimson border-crimson/30",
    sport: "bg-surface text-ivory border-gold/20",
    new: "bg-gold text-black border-transparent font-bold",
  };

  const baseStyles = "inline-block px-3 py-1 text-[10px] uppercase font-cinzel tracking-widest border rounded-full";

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.gold} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
