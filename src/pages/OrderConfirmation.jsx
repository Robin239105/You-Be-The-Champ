import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, ArrowRight, Download, FileText } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useCartStore } from '../store/useCartStore';
import { downloadInvoice } from '../utils/invoice';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const clearCart = useCartStore(state => state.clearCart);
  const { formData, items, shippingMethod, finalTotal, orderId } = location.state || {};
  const downloadTriggered = useRef(false);

  useEffect(() => {
    if (!location.state) {
      navigate('/shop');
      return;
    }
    
    // Clear cart on confirmation
    clearCart();

    // Automatic download trigger
    if (!downloadTriggered.current && location.state) {
      const order = {
        orderId,
        date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
        formData,
        items,
        shippingMethod,
        finalTotal
      };
      downloadInvoice(order);
      downloadTriggered.current = true;
    }
  }, [location.state, navigate, clearCart]);

  const handleManualDownload = () => {
    if (!location.state) return;
    const order = {
      orderId,
      date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
      formData,
      items,
      shippingMethod,
      finalTotal
    };
    downloadInvoice(order);
  };

  if (!location.state) return null;

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
          className="text-4xl md:text-5xl font-black font-cinzel text-gold tracking-widest uppercase mb-4"
        >
          You're A Champion!
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-ivory/60 font-raleway uppercase tracking-widest mb-12 max-w-lg"
        >
          Your order <span className="text-gold font-bold">#{orderId}</span> has been confirmed. We've initiated an automatic download of your invoice.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl w-full">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-gold/20 p-8 text-left space-y-6"
          >
            <h3 className="font-cinzel text-xs font-bold text-gold uppercase tracking-[2px] border-b border-gold/10 pb-4">Order Summary</h3>
            <div className="space-y-4">
               {items.map(item => (
                 <div key={item.id} className="flex justify-between items-center gap-4">
                   <div className="flex-1">
                      <p className="text-[11px] text-ivory font-bold uppercase">{item.name}</p>
                      <p className="text-[9px] text-ivory/40 uppercase">QTY: {item.quantity}</p>
                   </div>
                   <span className="text-xs font-mono text-gold">${(item.price * item.quantity).toFixed(2)}</span>
                 </div>
               ))}
            </div>
            <div className="pt-4 border-t border-gold/10 space-y-2">
               <div className="flex justify-between text-[10px] text-ivory/40 uppercase tracking-widest">
                  <span>Shipping</span>
                  <span>{shippingMethod === 'express' ? '$25.00' : 'FREE'}</span>
               </div>
               <div className="flex justify-between text-sm font-bold text-gold font-cinzel uppercase tracking-widest pt-2">
                  <span>Total Paid</span>
                  <span>${finalTotal.toFixed(2)} AUD</span>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-gold/20 p-8 text-left space-y-6 flex flex-col"
          >
            <h3 className="font-cinzel text-xs font-bold text-gold uppercase tracking-[2px] border-b border-gold/10 pb-4">Delivery Details</h3>
            <div className="space-y-4 flex-1">
               <div>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">Shipping To</p>
                  <p className="text-xs text-ivory font-medium uppercase leading-relaxed">
                    {formData.firstName} {formData.lastName}<br/>
                    {formData.address}<br/>
                    {formData.city}, {formData.state} {formData.zip}
                  </p>
               </div>
               <div>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">Estimated Arrival</p>
                  <p className="text-xs text-gold font-bold uppercase">
                    {shippingMethod === 'express' ? '2-3 Business Days' : '5-10 Business Days'}
                  </p>
               </div>
            </div>
            
            <button 
              onClick={handleManualDownload}
              className="w-full py-4 border border-gold/30 flex items-center justify-center gap-3 text-gold text-[10px] font-cinzel uppercase tracking-[2px] hover:bg-gold/10 transition-all"
            >
              <Download size={14} /> Download Invoice Again
            </button>
          </motion.div>
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="mt-16 flex flex-col sm:flex-row gap-6"
        >
           <Link to="/shop"><Button variant="outline" className="flex items-center gap-3">Return to Shop <ShoppingBag size={16}/></Button></Link>
           <Link to="/contact"><Button variant="primary" className="flex items-center gap-3">Contact Support <FileText size={16}/></Button></Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
