import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { optimizeImage } from '../utils/imageOptimizer';
import api from '../utils/api';

const CITIES_BY_COUNTRY = [
  { city: 'Sydney, NSW', country: 'au', name: 'Australia' },
  { city: 'Melbourne, VIC', country: 'au', name: 'Australia' },
  { city: 'Brisbane, QLD', country: 'au', name: 'Australia' },
  { city: 'Perth, WA', country: 'au', name: 'Australia' },
  { city: 'Adelaide, SA', country: 'au', name: 'Australia' },
  { city: 'Gold Coast, QLD', country: 'au', name: 'Australia' },
  { city: 'Canberra, ACT', country: 'au', name: 'Australia' },
  { city: 'Newcastle, NSW', country: 'au', name: 'Australia' },
  { city: 'Wollongong, NSW', country: 'au', name: 'Australia' },
  { city: 'Geelong, VIC', country: 'au', name: 'Australia' },
  { city: 'Hobart, TAS', country: 'au', name: 'Australia' },
  { city: 'Townsville, QLD', country: 'au', name: 'Australia' },
  { city: 'Cairns, QLD', country: 'au', name: 'Australia' },
  { city: 'Darwin, NT', country: 'au', name: 'Australia' },
  { city: 'Toowoomba, QLD', country: 'au', name: 'Australia' },
  { city: 'Ballarat, VIC', country: 'au', name: 'Australia' },
  { city: 'Wagga Wagga, NSW', country: 'au', name: 'Australia' },
  { city: 'Port Macquarie, NSW', country: 'au', name: 'Australia' },
  { city: 'Sunshine Coast, QLD', country: 'au', name: 'Australia' },
  { city: 'Launceston, TAS', country: 'au', name: 'Australia' },
  { city: 'Bendigo, VIC', country: 'au', name: 'Australia' },
  { city: 'Albury, NSW', country: 'au', name: 'Australia' },
  { city: 'Mackay, QLD', country: 'au', name: 'Australia' },
  { city: 'Rockhampton, QLD', country: 'au', name: 'Australia' },
  { city: 'Bundaberg, QLD', country: 'au', name: 'Australia' },
  { city: 'Hervey Bay, QLD', country: 'au', name: 'Australia' },
  { city: 'Tamworth, NSW', country: 'au', name: 'Australia' },
  { city: 'Orange, NSW', country: 'au', name: 'Australia' },
  { city: 'Dubbo, NSW', country: 'au', name: 'Australia' },
  { city: 'New York, NY', country: 'us', name: 'USA' },
  { city: 'Los Angeles, CA', country: 'us', name: 'USA' },
  { city: 'Chicago, IL', country: 'us', name: 'USA' },
  { city: 'Houston, TX', country: 'us', name: 'USA' },
  { city: 'Phoenix, AZ', country: 'us', name: 'USA' },
  { city: 'Philadelphia, PA', country: 'us', name: 'USA' },
  { city: 'San Antonio, TX', country: 'us', name: 'USA' },
  { city: 'San Diego, CA', country: 'us', name: 'USA' },
  { city: 'Dallas, TX', country: 'us', name: 'USA' },
  { city: 'San Jose, CA', country: 'us', name: 'USA' },
  { city: 'Austin, TX', country: 'us', name: 'USA' },
  { city: 'Jacksonville, FL', country: 'us', name: 'USA' },
  { city: 'Fort Worth, TX', country: 'us', name: 'USA' },
  { city: 'Columbus, OH', country: 'us', name: 'USA' },
  { city: 'Charlotte, NC', country: 'us', name: 'USA' },
  { city: 'Indianapolis, IN', country: 'us', name: 'USA' },
  { city: 'Seattle, WA', country: 'us', name: 'USA' },
  { city: 'Denver, CO', country: 'us', name: 'USA' },
  { city: 'Boston, MA', country: 'us', name: 'USA' },
  { city: 'Toronto, ON', country: 'ca', name: 'Canada' },
  { city: 'Montreal, QC', country: 'ca', name: 'Canada' },
  { city: 'Vancouver, BC', country: 'ca', name: 'Canada' },
  { city: 'Calgary, AB', country: 'ca', name: 'Canada' },
  { city: 'Edmonton, AB', country: 'ca', name: 'Canada' },
  { city: 'Ottawa, ON', country: 'ca', name: 'Canada' },
  { city: 'Winnipeg, MB', country: 'ca', name: 'Canada' },
  { city: 'Quebec City, QC', country: 'ca', name: 'Canada' },
  { city: 'Hamilton, ON', country: 'ca', name: 'Canada' },
  { city: 'London', country: 'gb', name: 'England' },
  { city: 'Manchester', country: 'gb', name: 'England' },
  { city: 'Birmingham', country: 'gb', name: 'England' },
  { city: 'Leeds', country: 'gb', name: 'England' },
  { city: 'Liverpool', country: 'gb', name: 'England' },
  { city: 'Newcastle', country: 'gb', name: 'England' },
  { city: 'Sheffield', country: 'gb', name: 'England' },
  { city: 'Bristol', country: 'gb', name: 'England' },
  { city: 'Leicester', country: 'gb', name: 'England' },
  { city: 'Auckland', country: 'nz', name: 'New Zealand' },
  { city: 'Wellington', country: 'nz', name: 'New Zealand' },
  { city: 'Christchurch', country: 'nz', name: 'New Zealand' },
  { city: 'Hamilton', country: 'nz', name: 'New Zealand' },
  { city: 'Tauranga', country: 'nz', name: 'New Zealand' },
  { city: 'Napier-Hastings', country: 'nz', name: 'New Zealand' },
  { city: 'Dunedin', country: 'nz', name: 'New Zealand' },
  { city: 'Palmerston North', country: 'nz', name: 'New Zealand' },
  { city: 'Madrid', country: 'es', name: 'Spain' },
  { city: 'Barcelona', country: 'es', name: 'Spain' },
  { city: 'Valencia', country: 'es', name: 'Spain' },
  { city: 'Seville', country: 'es', name: 'Spain' },
  { city: 'Zaragoza', country: 'es', name: 'Spain' },
  { city: 'Malaga', country: 'es', name: 'Spain' },
  { city: 'Murcia', country: 'es', name: 'Spain' },
  { city: 'Palma', country: 'es', name: 'Spain' },
  { city: 'Las Palmas', country: 'es', name: 'Spain' },
  { city: 'Rome', country: 'it', name: 'Italy' },
  { city: 'Milan', country: 'it', name: 'Italy' },
  { city: 'Naples', country: 'it', name: 'Italy' },
  { city: 'Turin', country: 'it', name: 'Italy' },
  { city: 'Palermo', country: 'it', name: 'Italy' },
  { city: 'Genoa', country: 'it', name: 'Italy' },
  { city: 'Bologna', country: 'it', name: 'Italy' },
  { city: 'Florence', country: 'it', name: 'Italy' },
  { city: 'Berlin', country: 'de', name: 'Germany' },
  { city: 'Hamburg', country: 'de', name: 'Germany' },
  { city: 'Munich', country: 'de', name: 'Germany' },
  { city: 'Cologne', country: 'de', name: 'Germany' },
  { city: 'Frankfurt', country: 'de', name: 'Germany' },
  { city: 'Stuttgart', country: 'de', name: 'Germany' },
  { city: 'Dusseldorf', country: 'de', name: 'Germany' },
  { city: 'Leipzig', country: 'de', name: 'Germany' },
  { city: 'Dortmund', country: 'de', name: 'Germany' },
  { city: 'Paris', country: 'fr', name: 'France' },
  { city: 'Marseille', country: 'fr', name: 'France' },
  { city: 'Lyon', country: 'fr', name: 'France' },
  { city: 'Toulouse', country: 'fr', name: 'France' },
  { city: 'Nice', country: 'fr', name: 'France' },
  { city: 'Nantes', country: 'fr', name: 'France' },
  { city: 'Strasbourg', country: 'fr', name: 'France' },
  { city: 'Montpellier', country: 'fr', name: 'France' },
];

const FIRST_NAMES = [
  'James', 'Emma', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Jennifer',
  'Chris', 'Amanda', 'Daniel', 'Jessica', 'Mark', 'Ashley', 'John', 'Nicole',
  'Matthew', 'Olivia', 'Daniel', 'Sophia', 'Andrew', 'Emily', 'Joshua', 'Mia',
  'Ryan', 'Charlotte', 'Brandon', 'Amelia', 'Tyler', 'Harper', 'Nathan', 'Evelyn',
  'Justin', 'Abigail', 'Aaron', 'Ella', 'Adam', 'Alyssa', 'Kevin', 'Lillian',
  'Jason', 'Natalie', 'Benjamin', 'Grace', 'Zachary', 'Chloe', 'Mason', 'Victoria',
  'Ethan', 'Camila', 'Alexander', 'Aria', 'Jacob', 'Scarlett', 'Logan', 'Madison',
  'Jackson', 'Layla', 'Sebastian', 'Penelope', 'Aiden', 'Riley', 'Owen', 'Zoey',
  'William', 'Grace', 'Liam', 'Ava', 'Noah', 'Isabella', 'Mia', 'Oliver',
  'Lucas', 'Sophia', 'Henry', 'Isabella', 'Alex', 'Mia', 'Ben', 'Emma',
  'Tom', 'Lily', 'Sam', 'Ruby', 'Jake', 'Jade', 'Max', 'Stella',
  'Lucas', 'Emma', 'Liam', 'Mia', 'Noah', 'Charlotte', 'Oliver', 'Ava',
  'Hugo', 'Lea', 'Arthur', 'Chloe', 'Raphael', 'Manon', 'Alphonse', 'Rose'
];

const TIMES = [
  'Just now', '1 minute ago', '3 minutes ago', '5 minutes ago',
  '12 minutes ago', '18 minutes ago', '23 minutes ago', '35 minutes ago',
  '42 minutes ago', '1 hour ago', '2 hours ago', '3 hours ago'
];

const SalesPopup = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentCity, setCurrentCity] = useState('');
  const [currentCountry, setCurrentCountry] = useState('');
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
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products?limit=50&status=PUBLISHED');
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch products for popup:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (availableProducts.length === 0) return;

    let timeoutId;

    const scheduleNext = () => {
      const baseDelay = 30000 + Math.random() * 90000;
      timeoutId = setTimeout(() => {
        if (isActiveHours() && availableProducts.length > 0) {
          showRandomPopup();
        }
        scheduleNext();
      }, baseDelay);
    };

    const initialDelay = 10000 + Math.random() * 20000;
    timeoutId = setTimeout(() => {
      if (isActiveHours() && availableProducts.length > 0) {
        showRandomPopup();
      }
      scheduleNext();
    }, initialDelay);

    return () => clearTimeout(timeoutId);
  }, [availableProducts]);

  const showRandomPopup = () => {
    if (availableProducts.length === 0) return;

    const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
    const randomLocation = CITIES_BY_COUNTRY[Math.floor(Math.random() * CITIES_BY_COUNTRY.length)];
    const randomTime = TIMES[Math.floor(Math.random() * TIMES.length)];
    const randomName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];

    setCurrentProduct(randomProduct);
    setCurrentCity(randomLocation.city);
    setCurrentCountry(randomLocation.country);
    setCurrentTime(randomTime);
    setCurrentName(randomName);
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
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
          <div className="relative w-20 h-20 flex-shrink-0 bg-surface rounded-xl overflow-hidden border border-gold/20 shadow-inner group">
            <img
              src={optimizeImage(currentProduct.images?.[0]?.url || currentProduct.images?.[0] || currentProduct.image, { w: 160, h: 160 })}
              alt={currentProduct.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

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
                {currentCity} <img src={`https://flagcdn.com/w20/${currentCountry}.png`} alt="" className="w-3 h-2 rounded-[1px]" />
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

          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 3, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold/20 via-gold to-gold/20 origin-left shadow-[0_-2px_10px_rgba(201,168,76,0.3)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalesPopup;