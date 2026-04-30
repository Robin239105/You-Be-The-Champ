import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { navigationData } from '../data/navigationData';
import MegaMenu from './MegaMenu';

import { useAuthStore } from '../store/useAuthStore';

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
  const { user, isAuthenticated } = useAuthStore();
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
      <nav className={`w-full px-6 sm:px-12 py-3 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'bg-black/95 backdrop-blur-md border-b border-gold/20 shadow-2xl' : 'bg-transparent'}`}>
        {/* Mobile Menu Toggle */}
        <div className="flex-1 lg:hidden">
          <button 
            className="text-gold hover:scale-110 transition-transform p-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Logo - Left Aligned on Desktop */}
        <div className="flex-shrink-0 lg:mr-8">
          <Link to="/" className="flex items-center group">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-gold/30 shadow-[0_0_15px_rgba(201,168,76,0.15)] group-hover:border-gold transition-all duration-500">
              <img 
                src="/logo.jpg" 
                alt="You Be The Champ Logo" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent pointer-events-none" />
            </div>
          </Link>
        </div>

        {/* Desktop Nav - Centered with balanced spacing */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-x-5 xl:gap-x-7">
          <Link to="/shop" className="font-cinzel text-[10px] tracking-[2px] text-ivory/60 hover:text-gold transition-all uppercase font-bold whitespace-nowrap">Shop All</Link>
          {navigationData.map((nav) => (
            <div 
              key={nav.label}
              onMouseEnter={() => nav.children ? handleMouseEnter(nav.label) : null}
              onMouseLeave={handleMouseLeave}
              className="relative py-4"
            >
              {nav.path ? (
                <Link 
                  to={nav.path} 
                  className="font-cinzel text-[10px] tracking-[2px] text-ivory/60 hover:text-gold transition-all uppercase font-bold whitespace-nowrap"
                >
                  {nav.label}
                </Link>
              ) : (
                <div className="flex items-center gap-1 cursor-default group">
                  <span className="font-cinzel text-[10px] tracking-[2px] text-ivory/60 group-hover:text-gold transition-all uppercase font-bold whitespace-nowrap">
                    {nav.label}
                  </span>
                  {nav.children && (
                    <ChevronDown size={10} className={`transition-transform duration-300 ${activeMenu === nav.label ? 'rotate-180 text-gold' : 'text-gold/40'}`} />
                  )}
                </div>
              )}
              
              {/* Animated Underline */}
              <AnimatePresence>
                {activeMenu === nav.label && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute bottom-3 left-0 right-0 h-[1px] bg-gold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Icons - Right Aligned */}
        <div className="flex-1 flex items-center justify-end gap-3 sm:gap-5 text-gold/80">
          <Link to="/search" className="hover:text-gold hover:scale-110 transition-all hidden sm:block p-1"><Search size={18} /></Link>
          <Link to="/account" className="hover:text-gold hover:scale-110 transition-all p-1"><User size={18} /></Link>
          <Link to="/wishlist" className="relative hover:text-gold hover:scale-110 transition-all p-1">
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-crimson text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative hover:text-gold hover:scale-110 transition-all p-1">
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-gold text-black text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

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

                  <Link to="/account" className="flex items-center gap-3 text-ivory/60 hover:text-gold transition-colors font-cinzel text-xs tracking-widest uppercase" onClick={() => setIsMobileMenuOpen(false)}>
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
