import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';
import Button from './Button';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQty, getTotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface border-l border-gold/20 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-gold" />
                <h2 className="font-cinzel text-lg font-bold tracking-widest uppercase">Your Cart</h2>
                <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded-full border border-gold/20">
                  {items.length} Items
                </span>
              </div>
              <button onClick={onClose} className="text-ivory/60 hover:text-gold transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-card-alt border border-gold/10 rounded-full flex items-center justify-center">
                    <ShoppingBag className="text-gold/20" size={32} />
                  </div>
                  <p className="font-cinzel text-sm text-ivory/40 uppercase tracking-widest">Your cart is empty</p>
                  <Link to="/shop" onClick={onClose}>
                    <Button variant="outline">Browse Rings</Button>
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-card border border-gold/10 hover:border-gold/30 transition-colors">
                    <div className="w-20 h-20 bg-black border border-gold/10 flex items-center justify-center flex-shrink-0">
                      {/* Placeholder Image */}
                      <svg className="w-8 h-8 text-gold/30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l2.4 7.4h7.6l-6.1 4.5 2.3 7.1-6.2-4.4-6.2 4.4 2.3-7.1-6.1-4.5h7.6z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-cinzel text-xs font-bold text-ivory truncate mb-1">{item.name}</h4>
                      <p className="text-[10px] text-ivory/50 font-raleway uppercase mb-2">{item.sport} • {item.year}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gold/20">
                          <button 
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="p-1 hover:text-gold transition-colors"
                          ><Minus size={12} /></button>
                          <span className="px-3 py-1 text-xs font-mono text-gold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="p-1 hover:text-gold transition-colors"
                          ><Plus size={12} /></button>
                        </div>
                        <span className="text-gold font-mono text-xs font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-ivory/30 hover:text-crimson transition-colors h-fit"
                    ><X size={16} /></button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-card-alt border-t border-gold/20 space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="font-cinzel text-sm text-ivory/60 uppercase tracking-widest">Subtotal</span>
                  <span className="font-mono text-xl text-gold font-bold">${getTotal().toFixed(2)}</span>
                </div>
                <Link to="/checkout" className="block w-full">
                  <Button className="w-full">Secure Checkout</Button>
                </Link>
                <p className="text-[10px] text-center text-ivory/40 uppercase tracking-[1px]">
                  Shipping and taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
