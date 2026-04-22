import React from 'react';
import { motion } from 'framer-motion';

const StatsBanner = () => {
  const stats = [
    { value: '50,000+', label: 'Happy Customers' },
    { value: '200+', label: 'Ring Styles' },
    { value: '6', label: 'Major Sports' },
    { value: '30+', label: 'Years Covered' },
  ];

  return (
    <section className="bg-surface py-24 border-y border-gold/10">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-4xl lg:text-5xl font-black font-cinzel text-gold mb-2">{stat.value}</h3>
            <p className="text-[10px] text-ivory/60 uppercase tracking-[2px]">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsBanner;
