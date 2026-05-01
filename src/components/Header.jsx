import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { navigationData } from '../data/navigationData';
import CartDrawer from './CartDrawer';

import { useAuthStore } from '../store/useAuthStore';

const MobileNavItem = ({ node, onClose }) => {
  if (!node) return null;
  const to = node.path || (node.slug ? `/${node.slug}` : null);
  if (!to) return null;
  return (
    <Link
      to={to}
      onClick={onClose}
      className="flex items-center justify-between py-4 border-b border-gold/8 font-cinzel text-[13px] tracking-[2px] uppercase text-ivory/70 hover:text-gold transition-colors group"
    >
      {node.label}
      <ChevronRight size={14} className="text-gold/30 group-hover:text-gold transition-colors" />
    </Link>
  );
};

const Header = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const itemCount = useCartStore(state => state.getItemCount() || 0);
  const wishlistCount = useWishlistStore(state => (state.items && state.items.length) || 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-gold text-black text-[10px] sm:text-xs font-cinzel font-bold py-1 px-4 text-center tracking-[2px]">
        FREE SHIPPING ON ORDERS $150+
      </div>

      {/* Main Nav */}
      <nav className={`relative w-full px-6 sm:px-12 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-4 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/98 backdrop-blur-xl border-b border-gold/30 shadow-[0_4px_40px_rgba(0,0,0,0.8)]'
          : 'bg-black/70 backdrop-blur-md border-b border-gold/15'
      }`}>
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button 
            className="text-gold hover:scale-110 transition-transform p-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Logo */}
        <div className="flex-shrink-0 lg:mr-0">
          <Link to="/" className="flex items-center group">
            <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-gold/30 shadow-[0_0_20px_rgba(201,168,76,0.2)] group-hover:border-gold transition-all duration-500">
              <img 
                src="/logo.jpg" 
                alt="You Be The Champ Logo" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent pointer-events-none" />
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center justify-center gap-x-3 xl:gap-x-5">
          {navigationData.map((nav) => {
            const to = nav.path || (nav.slug ? `/${nav.slug}` : '#');
            return (
              <Link
                key={nav.label}
                to={to}
                className="relative py-4 font-cinzel text-[9px] xl:text-[10px] tracking-[1.5px] text-ivory/70 hover:text-gold transition-all uppercase font-black whitespace-nowrap group"
              >
                {nav.label}
                <span className="absolute bottom-3 left-0 right-0 h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            );
          })}
        </div>

        {/* Icons - Right */}
        <div className="flex items-center justify-end gap-4 sm:gap-6 text-gold">
          <Link to="/search" className="hover:scale-110 transition-transform hidden sm:block p-1"><Search size={20} /></Link>
          <Link to="/account" className="hover:scale-110 transition-transform p-1"><User size={20} /></Link>
          <Link to="/wishlist" className="relative hover:scale-110 transition-transform p-1">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-crimson text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative hover:scale-110 transition-transform p-1"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>

      </nav>

        {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

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
