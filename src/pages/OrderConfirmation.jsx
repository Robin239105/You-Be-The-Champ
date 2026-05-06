import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, Download, FileText, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { downloadInvoice } from '../utils/invoice';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, items, shippingMethod, finalTotal, orderId } = location.state || {};
  const downloadTriggered = useRef(false);

  useEffect(() => {
    console.log('📄 OrderConfirmation mounted, location.state:', location.state);
    
    if (!location.state) {
      console.warn('❌ No location.state found, redirecting to shop');
      navigate('/shop');
      return;
    }

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
      console.log('📥 Downloading invoice:', order);
      downloadInvoice(order);
      downloadTriggered.current = true;
    }
  }, [location.state, navigate]);

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
    <div className="bg-black min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-36 pb-16 sm:pb-20 lg:pb-24">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gold rounded-full flex items-center justify-center text-black shadow-[0_0_40px_rgba(201,168,76,0.6)]">
              <CheckCircle2 size={48} strokeWidth={2} />
            </div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-cinzel text-gold tracking-widest uppercase mb-4 sm:mb-6"
          >
            You're A Champion!
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <p className="text-base sm:text-lg text-ivory/70 font-raleway">
              Your order <span className="text-gold font-cinzel font-bold">#{orderId}</span> has been confirmed.
            </p>
            <p className="text-xs sm:text-sm text-ivory/50 uppercase tracking-widest font-cinzel">
              We've initiated an automatic download of your invoice.
            </p>
          </motion.div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {/* Order Summary Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-gold/20 p-6 sm:p-8 rounded-lg space-y-6"
          >
            <h2 className="text-xs sm:text-sm font-cinzel font-bold text-gold uppercase tracking-[2px] pb-4 border-b border-gold/10">
              📦 Order Summary
            </h2>

            {/* Items List */}
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {items && items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 sm:gap-4"
                >
                  {/* Product Image */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black border border-gold/10 flex-shrink-0 overflow-hidden rounded flex items-center justify-center">
                    {item.images?.[0] && (
                      <img 
                        src={typeof item.images[0] === 'string' ? item.images[0] : item.images[0]?.url || item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-cinzel font-bold text-ivory uppercase line-clamp-2 mb-1">
                      {item.name}
                    </p>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-[10px] sm:text-xs text-ivory/50 uppercase">QTY: {item.quantity}</p>
                      <p className="text-xs sm:text-sm font-mono text-gold font-bold">
                        ${(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="pt-6 border-t border-gold/10 space-y-3">
              <div className="flex justify-between items-center text-xs sm:text-sm text-ivory/60 uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="font-mono text-ivory">
                  ${items.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm text-ivory/60 uppercase tracking-widest">
                <span>Shipping</span>
                <span className="text-gold font-cinzel font-bold">
                  {shippingMethod === 'express' ? '$25.00' : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base font-bold text-gold font-cinzel uppercase tracking-widest pt-3 border-t border-gold/10">
                <span>Total Paid</span>
                <span className="font-mono">${Number(finalTotal || 0).toFixed(2)} AUD</span>
              </div>
            </div>
          </motion.div>

          {/* Delivery Details Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-gold/20 p-6 sm:p-8 rounded-lg space-y-6 flex flex-col"
          >
            <h2 className="text-xs sm:text-sm font-cinzel font-bold text-gold uppercase tracking-[2px] pb-4 border-b border-gold/10">
              🚚 Delivery Details
            </h2>

            <div className="space-y-6 flex-1">
              {/* Shipping Address */}
              <div>
                <p className="text-[10px] sm:text-xs text-ivory/40 uppercase tracking-widest font-cinzel mb-2 font-bold">Shipping To</p>
                <div className="bg-surface border border-gold/10 rounded p-4 space-y-2">
                  <p className="text-xs sm:text-sm text-ivory font-medium uppercase">
                    {formData?.firstName} {formData?.lastName}
                  </p>
                  <p className="text-xs sm:text-sm text-ivory/60 line-break">
                    {formData?.address}
                  </p>
                  <p className="text-xs sm:text-sm text-ivory/60">
                    {formData?.city}, {formData?.state} {formData?.zip}
                  </p>
                  {formData?.email && (
                    <p className="text-[10px] sm:text-xs text-ivory/40 mt-3 pt-3 border-t border-gold/10">
                      {formData.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Estimate */}
              <div>
                <p className="text-[10px] sm:text-xs text-ivory/40 uppercase tracking-widest font-cinzel mb-2 font-bold">Estimated Arrival</p>
                <div className="bg-gold/10 border border-gold/20 rounded p-4">
                  <p className="text-xs sm:text-sm text-gold font-bold uppercase tracking-wider">
                    {shippingMethod === 'express' ? '2-3 Business Days' : '5-10 Business Days'}
                  </p>
                  <p className="text-[10px] sm:text-xs text-ivory/50 mt-2 uppercase">
                    {shippingMethod === 'express' ? 'Express Shipping' : 'Standard Shipping'}
                  </p>
                </div>
              </div>
            </div>

            {/* Download Invoice Button */}
            <button 
              onClick={handleManualDownload}
              className="w-full py-3 sm:py-4 border-2 border-gold/40 hover:border-gold hover:bg-gold/10 rounded transition-all flex items-center justify-center gap-2 sm:gap-3 text-gold text-xs sm:text-sm font-cinzel uppercase tracking-widest font-bold"
            >
              <Download size={16} className="flex-shrink-0" />
              Download Invoice
            </button>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-2xl mx-auto"
        >
          <Link to="/shop" className="flex-1 sm:flex-initial">
            <button className="w-full sm:w-auto px-8 py-3 sm:py-4 border-2 border-gold/40 hover:border-gold rounded transition-all text-gold text-xs sm:text-sm font-cinzel uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-gold/5">
              <ShoppingBag size={16} />
              Continue Shopping
            </button>
          </Link>
          <Link to="/account?tab=orders" className="flex-1 sm:flex-initial">
            <button className="w-full sm:w-auto px-8 py-3 sm:py-4 bg-gold hover:bg-gold/90 rounded transition-all text-black text-xs sm:text-sm font-cinzel uppercase tracking-widest font-bold flex items-center justify-center gap-2">
              <FileText size={16} />
              View My Orders
            </button>
          </Link>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 sm:mt-16 lg:mt-20 text-center"
        >
          <div className="bg-gold/5 border border-gold/10 rounded-lg p-4 sm:p-6 max-w-lg mx-auto">
            <p className="text-[10px] sm:text-xs text-ivory/50 uppercase tracking-widest font-cinzel mb-3">
              🔒 Secure Transaction
            </p>
            <p className="text-xs sm:text-sm text-ivory/60 leading-relaxed">
              Your order is secure and encrypted. You will receive a tracking number via email once your item ships.
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
