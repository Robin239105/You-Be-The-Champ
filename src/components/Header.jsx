import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { navigationData } from '../data/navigationData';
import MegaMenu from './MegaMenu';

// Recursive Mobile Node Component (Moved outside to stabilize references)
const MobileNavItem = ({ node, depth = 0, mobileExpanded, onToggle, onClose }) => {
  if (!node || depth > 5) return null;
  
  const nodeKey = node.path || node.label || `node-${depth}`;
  const isExpanded = !!mobileExpanded[nodeKey];
  const hasChildren = node.children && Array.isArray(node.children) && node.children.length > 0;

  return (
    <div className="w-full">
      <div className={`flex items-center justify-between py-3 border-b border-gold/5 ${depth > 0 ? 'pl-4' : ''}`}>
        {node.path ? (
          <Link 
            to={`/category/${encodeURIComponent(node.path)}`}
            className={`font-cinzel text-sm tracking-widest uppercase transition-colors ${depth === 0 ? 'text-gold' : 'text-ivory/80 hover:text-gold'}`}
            onClick={onClose}
          >
            {node.label}
          </Link>
        ) : (
          <span className={`font-cinzel text-sm tracking-widest uppercase ${depth === 0 ? 'text-gold' : 'text-ivory/80'}`}>
            {node.label}
          </span>
        )}
        
        {hasChildren && (
          <button 
            onClick={() => onToggle(nodeKey)}
            className="p-2 text-gold/60 hover:text-gold"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white/5"
          >
            {node.children.map(child => (
              <MobileNavItem 
                key={child.path || child.label} 
                node={child} 
                depth={depth + 1} 
                mobileExpanded={mobileExpanded}
                onToggle={onToggle}
                onClose={onClose}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const [hoverTimeout, setHoverTimeout] = useState(null);
  
  const itemCount = useCartStore(state => state.getItemCount() || 0);
  const wishlistCount = useWishlistStore(state => (state.items && state.items.length) || 0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  const toggleMobileExpanded = (path) => {
    if (!path) return;
    setMobileExpanded(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleMouseEnter = (label) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveMenu(null);
    }, 200); // 200ms delay to prevent flickering
    setHoverTimeout(timeout);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-gold text-black text-[10px] sm:text-xs font-cinzel font-bold py-1 px-4 text-center tracking-[2px]">
        FREE SHIPPING ON ORDERS $150+
      </div>

      {/* Main Nav */}
      <nav className={`w-full px-4 sm:px-8 py-4 flex items-center justify-between transition-colors duration-300 ${isScrolled ? 'bg-black/95 border-b border-gold/20' : 'bg-transparent'}`}>
        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-gold hover:scale-110 transition-transform"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gold/40 shadow-[0_0_20px_rgba(201,168,76,0.2)] group-hover:border-gold group-hover:scale-105 transition-all duration-500">
            <img 
              src="/logo.jpg" 
              alt="You Be The Champ Logo" 
              className="w-full h-full object-cover"
            />
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 ring-1 ring-inset ring-gold/20 rounded-full" />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/shop" className="font-cinzel text-xs tracking-[2px] text-ivory/80 hover:text-gold transition-colors uppercase">Shop All</Link>
          {navigationData.map((nav) => (
            <div 
              key={nav.label}
              onMouseEnter={() => handleMouseEnter(nav.label)}
              onMouseLeave={handleMouseLeave}
              className="relative py-2 px-1"
            >
              <span className="font-cinzel text-xs tracking-[2px] text-ivory/80 hover:text-gold transition-colors uppercase cursor-default flex items-center gap-2 group">
                {nav.label}
                <ChevronDown size={12} className={`transition-transform duration-300 ${activeMenu === nav.label ? 'rotate-180 text-gold' : 'text-gold/30'}`} />
              </span>
            </div>
          ))}
        </div>

        {/* Mega Menu Container (Outside Loop for proper centering) */}
        <AnimatePresence>
          {activeMenu && (
            <div className="absolute top-full left-0 w-full pointer-events-none">
              <div className="relative max-w-[1440px] mx-auto pointer-events-auto">
                <MegaMenu 
                  data={navigationData.find(n => n.label === activeMenu)} 
                  layout={navigationData.find(n => n.label === activeMenu)?.layout} 
                  onMouseEnter={() => handleMouseEnter(activeMenu)}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Icons */}
        <div className="flex items-center gap-4 sm:gap-6 text-gold">
          <Link to="/search" className="hover:scale-110 transition-transform hidden sm:block"><Search size={20} /></Link>
          <Link to="/account" className="hover:scale-110 transition-transform"><User size={20} /></Link>
          <Link to="/wishlist" className="relative hover:scale-110 transition-transform">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-crimson text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full leading-none">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative hover:scale-110 transition-transform group">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none group-hover:scale-110 transition-transform">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-md bg-black border-r border-gold/20 z-[70] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gold/20">
                <span className="font-cinzel text-xl font-black text-gold tracking-widest uppercase">Navigation</span>
                <button 
                  className="p-2 text-gold hover:rotate-90 transition-transform"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-hide">
                <Link 
                  to="/shop" 
                  className="block font-cinzel text-lg text-white tracking-widest uppercase mb-6 border-b border-gold/20 pb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop All Products
                </Link>
                <div className="flex flex-col">
                  {navigationData.map(node => (
                    <MobileNavItem 
                      key={node.label} 
                      node={node} 
                      mobileExpanded={mobileExpanded}
                      onToggle={toggleMobileExpanded}
                      onClose={() => setIsMobileMenuOpen(false)}
                    />
                  ))}
                </div>
              </div>

              <div className="p-8 border-t border-gold/10 bg-surface/50">
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/account" className="flex items-center gap-3 text-ivory/60 hover:text-gold transition-colors font-cinzel text-xs tracking-widest uppercase">
                    <User size={18} /> My Account
                  </Link>
                  <Link to="/contact" className="flex items-center gap-3 text-ivory/60 hover:text-gold transition-colors font-cinzel text-xs tracking-widest uppercase">
                    <ShoppingBag size={18} /> Support
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
