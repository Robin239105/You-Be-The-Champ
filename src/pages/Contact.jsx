import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <div className="bg-black min-h-screen text-ivory">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-40 pb-24">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase block mb-4"
          >
            Concierge Services
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-cinzel text-white tracking-widest uppercase"
          >
            Contact The Vault
          </motion.h1>
          <div className="w-24 h-1 bg-gold mx-auto mt-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-2xl font-cinzel text-gold font-bold uppercase tracking-widest mb-6">Direct Support</h2>
              <p className="text-ivory/60 font-raleway leading-relaxed mb-10 max-w-md">
                Have questions about a specific ring, bulk orders, or your delivery? Our curation experts are available 24/7 to assist with your championship needs.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gold font-cinzel tracking-widest uppercase mb-1">Email Us</p>
                    <p className="text-lg font-cinzel text-white">support@youbethechamp.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gold font-cinzel tracking-widest uppercase mb-1">Call The Vault</p>
                    <p className="text-lg font-cinzel text-white">+1 (888) CHAMP-VIP</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-2 gap-6 pt-10 border-t border-gold/10">
               <div className="flex items-center gap-3">
                  <ShieldCheck className="text-gold" size={20} />
                  <span className="text-[10px] text-ivory/40 uppercase tracking-widest font-cinzel">Lifetime Warranty</span>
               </div>
               <div className="flex items-center gap-3">
                  <Clock className="text-gold" size={20} />
                  <span className="text-[10px] text-ivory/40 uppercase tracking-widest font-cinzel">24/7 Response</span>
               </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-gold/10 p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <MessageSquare size={120} className="text-gold" />
            </div>
            
            <form className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] text-gold font-cinzel tracking-widest uppercase mb-2">Your Name</label>
                  <input type="text" className="w-full bg-black border border-gold/20 p-4 text-white font-raleway focus:border-gold outline-none transition-colors" placeholder="Full Name" />
                </div>
                <div>
                  <label className="block text-[10px] text-gold font-cinzel tracking-widest uppercase mb-2">Email Address</label>
                  <input type="email" className="w-full bg-black border border-gold/20 p-4 text-white font-raleway focus:border-gold outline-none transition-colors" placeholder="email@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gold font-cinzel tracking-widest uppercase mb-2">Subject</label>
                <select className="w-full bg-black border border-gold/20 p-4 text-white font-raleway focus:border-gold outline-none transition-colors appearance-none cursor-pointer text-white">
                  <option className="bg-black">Order Inquiry</option>
                  <option className="bg-black">Product Sizing</option>
                  <option className="bg-black">Affiliate Program</option>
                  <option className="bg-black">Wholesale/Bulk</option>
                  <option className="bg-black">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gold font-cinzel tracking-widest uppercase mb-2">Message</label>
                <textarea rows="6" className="w-full bg-black border border-gold/20 p-4 text-white font-raleway focus:border-gold outline-none transition-colors resize-none" placeholder="How can we help you achieve your glory?"></textarea>
              </div>

              <button className="w-full bg-gold text-black py-5 font-cinzel font-black text-xs tracking-[4px] uppercase hover:bg-white transition-all active:scale-95 shadow-[0_0_20px_rgba(201,168,76,0.2)]">
                Send Message To Vault
              </button>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
