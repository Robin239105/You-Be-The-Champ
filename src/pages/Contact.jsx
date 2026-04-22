import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formState, setFormState] = useState('idle'); // idle, sending, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('sending');
    setTimeout(() => setFormState('success'), 1500);
  };

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-8 pt-40 pb-24">
        <Breadcrumb items={[{ name: 'Support', path: '/contact' }]} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
           {/* Left: Info */}
           <div className="space-y-12">
              <div>
                 <h1 className="text-4xl md:text-6xl font-black font-cinzel text-gold tracking-widest uppercase mb-6">Contact The Vault</h1>
                 <p className="text-ivory/60 font-raleway uppercase tracking-widest text-sm leading-loose max-w-lg">
                    Have a specific question about a custom order or need help locating a rare championship ring? Our curators are standing by.
                 </p>
              </div>

              <div className="space-y-8">
                 <ContactInfo icon={Mail} label="Curator Support" value="support@youbethechamp.com" />
                 <ContactInfo icon={Phone} label="Priority Line" value="+1 (555) CHAMP-01" />
                 <ContactInfo icon={MapPin} label="The Vault HQ" value="Los Angeles, California, USA" />
              </div>

              <div className="p-8 bg-card border border-gold/10 space-y-4">
                 <div className="flex items-center gap-3 text-gold">
                    <MessageSquare size={20} />
                    <span className="font-cinzel text-xs font-bold uppercase tracking-widest">Live Concierge</span>
                 </div>
                 <p className="text-[10px] text-ivory/40 uppercase tracking-[2px] leading-relaxed">
                    Available Mon-Fri, 9AM - 6PM PST for immediate assistance with orders.
                 </p>
              </div>
           </div>

           {/* Right: Form */}
           <div className="bg-card border border-gold/20 p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Send size={150} className="text-gold" />
              </div>

              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 sm:col-span-1">
                       <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest mb-2">Your Name</label>
                       <input type="text" className="w-full bg-surface border border-gold/20 px-4 py-3 text-sm text-ivory outline-none focus:border-gold transition-colors" required />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                       <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest mb-2">Subject</label>
                       <select className="w-full bg-surface border border-gold/20 px-4 py-3 text-sm text-gold outline-none focus:border-gold transition-colors uppercase font-cinzel text-[10px] tracking-widest">
                          <option>Order Inquiry</option>
                          <option>Custom Engraving</option>
                          <option>Affiliate Program</option>
                          <option>Other</option>
                       </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest mb-2">Email Address</label>
                    <input type="email" className="w-full bg-surface border border-gold/20 px-4 py-3 text-sm text-ivory outline-none focus:border-gold transition-colors" required />
                 </div>
                 <div>
                    <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest mb-2">How Can We Help?</label>
                    <textarea rows="6" className="w-full bg-surface border border-gold/20 px-4 py-3 text-sm text-ivory outline-none focus:border-gold transition-colors resize-none" required></textarea>
                 </div>

                 <Button type="submit" disabled={formState !== 'idle'} className="w-full py-5 flex items-center justify-center gap-3">
                    {formState === 'idle' && <>Send Message <Send size={16}/></>}
                    {formState === 'sending' && <span className="animate-pulse">Analyzing Frequency...</span>}
                    {formState === 'success' && <span className="text-white">Message Transmitted!</span>}
                 </Button>
              </form>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const ContactInfo = ({ icon: Icon, label, value }) => (
  <div className="flex gap-6 items-center group">
     <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold transition-all group-hover:text-black text-gold">
        <Icon size={20} />
     </div>
     <div>
        <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-cinzel text-white group-hover:text-gold transition-colors">{value}</p>
     </div>
  </div>
);

export default Contact;
