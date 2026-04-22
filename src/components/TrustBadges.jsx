import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Lock, PenTool } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    { icon: ShieldCheck, title: "Authentic Grade", desc: "Replica Grade" },
    { icon: Truck, title: "Free Shipping", desc: "$150+ Orders" },
    { icon: RefreshCw, title: "30-Day Returns", desc: "Satisfaction" },
    { icon: Lock, title: "Secure Pay", desc: "100% Encrypted" },
    { icon: PenTool, title: "Engraving", desc: "Custom Work" },
  ];

  return (
    <div className="py-24 border-y border-gold/10">
      <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-between gap-12 lg:gap-8">
        {badges.map((badge, i) => (
          <div key={i} className="flex flex-col items-center text-center flex-1 min-w-[150px]">
            <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center mb-6 gold-glow transition-transform hover:scale-110">
              <badge.icon className="text-gold" size={28} />
            </div>
            <h4 className="font-cinzel text-xs font-bold text-gold tracking-widest mb-1 uppercase">{badge.title}</h4>
            <p className="text-[10px] text-ivory/40 uppercase tracking-[1px]">{badge.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBadges;
