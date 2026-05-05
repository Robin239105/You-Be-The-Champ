import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CITIES = [
  'Chicago, IL', 'New York, NY', 'Dallas, TX', 'Los Angeles, CA', 
  'Miami, FL', 'Boston, MA', 'Philadelphia, PA', 'Phoenix, AZ',
  'San Francisco, CA', 'Seattle, WA', 'Denver, CO', 'Atlanta, GA',
  'Toronto, ON', 'Vancouver, BC', 'London, UK', 'Sydney, AU'
];

const TIMES = [
  '2 minutes ago', '5 minutes ago', '12 minutes ago', '24 minutes ago', 
  '45 minutes ago', 'an hour ago', '3 hours ago'
];

const SalesPopup = ({ products = [] }) => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentCity, setCurrentCity] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initial delay before first popup
    const initialDelay = setTimeout(() => {
      showRandomPopup();
    }, 10000); // 10 seconds after load

    const interval = setInterval(() => {
      showRandomPopup();
    }, 35000); // Every 35 seconds (30s gap + 5s display)

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [products]);

  const showRandomPopup = () => {
    if (!products || products.length === 0) return;

    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    const randomTime = TIMES[Math.floor(Math.random() * TIMES.length)];

    setCurrentProduct(randomProduct);
    setCurrentCity(randomCity);
    setCurrentTime(randomTime);
    setIsVisible(true);

    // Auto-hide after 6 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 6000);
  };

  if (!currentProduct) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -100, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed bottom-6 left-6 z-[100] w-full max-w-[320px] bg-black/90 backdrop-blur-xl border border-gold/30 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(201,168,76,0.1)] p-3"
        >
          <div className="flex items-center gap-4">
            {/* Product Image */}
            <div className="relative w-16 h-16 flex-shrink-0 bg-surface rounded-lg overflow-hidden border border-gold/10">
              <img 
                src={currentProduct.images?.[0]?.url || currentProduct.images?.[0] || 'https://placehold.co/100'} 
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-[9px] font-cinzel text-gold uppercase tracking-widest font-bold">
                  <ShoppingBag size={10} /> Verified Purchase
                </span>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="text-ivory/40 hover:text-white transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
              
              <p className="text-[11px] text-ivory/80 leading-snug mb-1">
                Someone in <span className="text-white font-bold">{currentCity}</span> just bought
              </p>
              
              <Link 
                to={`/product/${currentProduct.slug}`}
                className="block text-[12px] text-gold font-bold truncate hover:underline underline-offset-2 mb-1"
                onClick={() => setIsVisible(false)}
              >
                {currentProduct.name}
              </Link>
              
              <span className="text-[9px] text-ivory/40 italic">
                {currentTime}
              </span>
            </div>
          </div>

          {/* Progress Bar (Timer) */}
          <motion.div 
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 6, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalesPopup;
