import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { optimizeImage } from '../utils/imageOptimizer';

const CITIES = [
  'Sydney, NSW', 'Melbourne, VIC', 'Brisbane, QLD', 'Perth, WA', 
  'Adelaide, SA', 'Gold Coast, QLD', 'Canberra, ACT', 'Newcastle, NSW',
  'Wollongong, NSW', 'Geelong, VIC', 'Hobart, TAS', 'Townsville, QLD',
  'Cairns, QLD', 'Darwin, NT', 'Toowoomba, QLD', 'Ballarat, VIC',
  'Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Houston, TX',
  'Miami, FL', 'Seattle, WA', 'Denver, CO', 'Boston, MA'
];

const FIRST_NAMES = [
  'James', 'Emma', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Jennifer',
  'Chris', 'Amanda', 'Daniel', 'Jessica', 'Mark', 'Ashley', 'John', 'Nicole'
];

const TIMES = [
  'Just now', '1 minute ago', '3 minutes ago', '5 minutes ago', 
  '12 minutes ago', '18 minutes ago', '23 minutes ago', '35 minutes ago',
  '42 minutes ago', '1 hour ago', '2 hours ago'
];

const SalesPopup = ({ products = [] }) => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentCity, setCurrentCity] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  
  const availableProducts = useMemo(() => {
    return products.filter(p => p && (p.images?.[0]?.url || p.images?.[0] || p.image) && p.name);
  }, [products]);

  const isActiveHours = () => {
    const hour = new Date().getHours();
    return hour >= 9 && hour <= 22;
  };

  useEffect(() => {
    if (availableProducts.length === 0) return;

    let timeoutId;
    let intervalId;
    let hasShownInitial = false;

    const scheduleNext = () => {
      const baseDelay = 25000 + Math.random() * 25000;
      timeoutId = setTimeout(() => {
        if (isActiveHours()) {
          showRandomPopup();
          hasShownInitial = true;
        }
        scheduleNext();
      }, baseDelay);
    };

    if (!hasShownInitial) {
      const initialDelay = 12000 + Math.random() * 8000;
      timeoutId = setTimeout(() => {
        if (isActiveHours() && availableProducts.length > 0) {
          showRandomPopup();
          hasShownInitial = true;
        }
        scheduleNext();
      }, initialDelay);
    } else {
      scheduleNext();
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [availableProducts]);

  const showRandomPopup = () => {
    if (availableProducts.length === 0) return;

    const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    const randomTime = TIMES[Math.floor(Math.random() * TIMES.length)];
    const randomName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];

    setCurrentProduct(randomProduct);
    setCurrentCity(randomCity);
    setCurrentTime(randomTime);
    setCurrentName(randomName);
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
    }, 7000);
  };

  if (availableProducts.length === 0) return null;
  if (!currentProduct) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -100, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed bottom-6 left-6 z-[100] w-full max-w-[340px] bg-black/95 backdrop-blur-2xl border border-gold/40 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(201,168,76,0.15)] p-4 flex items-center gap-4"
        >
          {/* Product Image */}
          <div className="relative w-20 h-20 flex-shrink-0 bg-surface rounded-xl overflow-hidden border border-gold/20 shadow-inner group">
            <img 
              src={optimizeImage(currentProduct.images?.[0]?.url || currentProduct.images?.[0] || currentProduct.image, { w: 160, h: 160 })} 
              alt={currentProduct.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-[10px] font-cinzel text-gold uppercase tracking-[2px] font-black">
                <ShoppingBag size={11} className="animate-pulse" /> Verified Sale
              </span>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-ivory/30 hover:text-white transition-colors p-1"
              >
                <X size={14} />
              </button>
            </div>
            
            <p className="text-[12px] text-ivory/90 leading-snug mb-1">
              <span className="text-white font-bold">{currentName}</span> from <span className="text-white font-bold inline-flex items-center gap-1">
                {currentCity} <img src={currentCity.includes(', CA') || currentCity.includes(', NY') || currentCity.includes(', IL') || currentCity.includes(', TX') || currentCity.includes(', FL') || currentCity.includes(', WA') || currentCity.includes(', CO') || currentCity.includes(', MA') ? "https://flagcdn.com/w20/us.png" : "https://flagcdn.com/w20/au.png"} alt="Flag" className="w-3 h-2 rounded-[1px]" />
              </span> just purchased
            </p>
            
            <Link 
              to={`/product/${currentProduct.slug}`}
              className="block text-[13px] text-gold font-black truncate hover:text-white transition-colors mb-1"
              onClick={() => setIsVisible(false)}
            >
              {currentProduct.name}
            </Link>
            
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-ivory/40 font-medium">
                {currentTime}
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] text-green-500/80 font-bold uppercase tracking-wider">Live</span>
              </div>
            </div>
          </div>

          {/* Progress Bar (Timer) */}
          <motion.div 
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 7, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold/20 via-gold to-gold/20 origin-left shadow-[0_-2px_10px_rgba(201,168,76,0.3)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalesPopup;
