import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import Badge from './Badge';
import Button from './Button';

import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const addItem = useCartStore(state => state.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  
  const wishlisted = isWishlisted(product.id);

  // Defaults for production data
  const rating = product.rating || 4.5 + (Math.random() * 0.5);
  const reviews = product.reviews || Math.floor(20 + Math.random() * 150);
  const year = product.year || product.sku?.slice(-2) || '24';
  const displayImage = product.images?.[0] || product.image;
  const sport = product.sport || (product.categories?.[0]?.split(' > ')[0]) || 'Leagues';

  return (
    <Link to={`/product/${product.id}`} className="block h-full">
      <motion.div 
        whileHover={{ y: -8 }}
        className="group bg-card border border-gold/10 hover:border-gold/50 transition-all duration-300 shadow-xl overflow-hidden relative flex flex-col h-full"
      >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Badge variant="sport">{sport}</Badge>
        {product.badge && <Badge variant={product.badge === 'VINTAGE' ? 'crimson' : 'gold'}>{product.badge}</Badge>}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product);
        }}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 ${wishlisted ? 'bg-gold text-black scale-110' : 'bg-black/40 text-gold hover:bg-gold/20'}`}
      >
        <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Image Area */}
      <div className="relative aspect-square bg-black overflow-hidden flex items-center justify-center p-8">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full flex items-center justify-center"
        >
          {displayImage ? (
            <img src={displayImage} alt={product.name} className="w-full h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center">
              <svg className="w-24 h-24 text-gold/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.4h7.6l-6.1 4.5 2.3 7.1-6.2-4.4-6.2 4.4 2.3-7.1-6.1-4.5h7.6z" />
              </svg>
              <div className="mt-4 px-3 py-1 border border-gold/10 rounded-full font-cinzel text-[8px] text-gold/40 uppercase tracking-widest bg-gold/5">
                Premium Replica Grade
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Year Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="font-mono text-[10px] text-gold/60 border border-gold/20 px-2 py-0.5 bg-black/60 backdrop-blur-sm uppercase">
            {year} EDITION
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={10} className={i < Math.floor(rating) ? 'fill-gold text-gold' : 'text-ivory/20'} />
          ))}
          <span className="text-[10px] text-ivory/40 ml-1">({reviews})</span>
        </div>

        <h3 className="font-cinzel text-sm font-bold text-ivory group-hover:text-gold transition-colors mb-2 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        
        {product.isPlayerEdition && (
          <p className="text-ivory/50 text-[10px] italic font-raleway mb-4">
            Official {product.playerName} Player Edition
          </p>
        )}

        {/* Pricing */}
        <div className="mt-auto pt-4 flex items-end justify-between">
          <div className="flex flex-col">
            {product.price === 0 ? (
              <span className="text-sm font-cinzel font-bold text-gold tracking-widest uppercase">
                Coming Soon
              </span>
            ) : (
              <>
                {product.onSale && (
                  <span className="text-[10px] text-ivory/30 line-through font-mono">
                    ${product.price.toFixed(2)} AUD
                  </span>
                )}
                <span className="text-lg font-mono font-bold text-gold">
                  ${(product.onSale ? product.salePrice : product.price).toFixed(2)} AUD
                </span>
              </>
            )}
          </div>
          
          {product.price > 0 && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(product);
              }}
              className="p-3 bg-gold text-black rounded-none hover:bg-gold-light transition-all active:scale-95 group/btn overflow-hidden relative"
            >
              <ShoppingCart size={18} className="relative z-10" />
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left" />
            </button>
          )}
        </div>
      </div>

      {/* Hover Glow Effect Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-gold/5 to-transparent shadow-[inset_0_0_20px_rgba(201,168,76,0.1)]" />
    </motion.div>
    </Link>
  );
};

export default ProductCard;
