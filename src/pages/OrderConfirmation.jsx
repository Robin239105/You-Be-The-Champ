import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Ticket, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useCartStore } from '../store/useCartStore';

const OrderConfirmation = () => {
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    // Clear cart on confirmation
    clearCart();
  }, [clearCart]);

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-8 pt-40 pb-24 flex flex-col items-center justify-center text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.5 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ type: "spring", damping: 15 }}
           className="w-24 h-24 bg-gold rounded-full flex items-center justify-center text-black mb-8 shadow-[0_0_50px_rgba(201,168,76,0.5)]"
        >
          <CheckCircle2 size={48} strokeWidth={3} />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-black font-cinzel text-gold tracking-widest uppercase mb-4"
        >
          You're A Champion!
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-ivory/60 font-raleway uppercase tracking-widest mb-12 max-w-lg"
        >
          Your order #CHAMP-9241-X has been confirmed. We've sent a detailed receipt to your email.
        </motion.p>

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="bg-card border border-gold/20 p-10 max-w-xl w-full text-left space-y-6 relative overflow-hidden"
        >
           {/* Decorative Background Icon */}
           <ShoppingBag className="absolute -bottom-4 -right-4 text-gold/5 w-40 h-40 transform -rotate-12" />

           <div className="grid grid-cols-2 gap-8 relative z-10">
              <div>
                 <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">Estimated Delivery</p>
                 <p className="text-sm text-gold font-bold">April 24 - April 26</p>
              </div>
              <div>
                 <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">Shipping Method</p>
                 <p className="text-sm text-ivory">Express Shipping</p>
              </div>
           </div>

           <div className="pt-6 border-t border-gold/10 relative z-10">
              <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-4">What's Next?</p>
              <ul className="space-y-3">
                 <li className="flex items-center gap-3 text-xs text-ivory/80 capitalize">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full" /> Master jewelers will inspect your ring
                 </li>
                 <li className="flex items-center gap-3 text-xs text-ivory/80 capitalize">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full" /> Quality control check for stone mounting
                 </li>
                 <li className="flex items-center gap-3 text-xs text-ivory/80 capitalize">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full" /> Detailed polish and vacuum sealing
                 </li>
              </ul>
           </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="mt-16 flex flex-col sm:flex-row gap-6"
        >
           <Link to="/account"><Button variant="outline">Track Your Order</Button></Link>
           <Link to="/shop"><Button variant="primary" className="flex items-center gap-3">Continue Shopping <ArrowRight size={16}/></Button></Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
