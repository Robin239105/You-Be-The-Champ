import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const faqs = [
    {
      q: "Are these rings officially licensed?",
      a: "No. Our rings are meticulously handcrafted fan-art replicas. We are not affiliated with the NFL, NBA, MLB, NHL, or any professional sports team. Our mission is to provide fans with high-quality collectibles at an accessible price point."
    },
    {
      q: "What materials are used in construction?",
      a: "Our rings are constructed from a heavy zinc alloy base, providing the substantial 'championship weight' fans expect. They are then finished with a proprietary quadruple 18K gold plating process and set with premium AAA+ cubic zirconia stones."
    },
    {
      q: "How long does shipping take?",
      a: "For in-stock items, shipping typically takes 5-10 business days for standard delivery. Express shipping is available for faster delivery within 2-3 business days. Custom engraved orders may require an additional 2-4 days for precision craftsmanship."
    },
    {
      q: "Do the rings turn your finger green?",
      a: "No. Because we use a high-quality 4x gold plating process over a stable alloy, and none of our rings contain nickel or lead, they will not cause skin discoloration under normal wearing conditions."
    },
    {
      q: "Can I customize the name and number on the ring?",
      a: "Yes! We offer secondary customization options for most championship rings, allowing you to add a custom name and number to the side panels or an inside engraving. Look for the 'Add Customization' button on individual product pages."
    }
  ];

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-8 pt-40 pb-24">
        <Breadcrumb items={[{ name: 'Support', path: '/faq' }]} />
        
        <h1 className="text-4xl md:text-5xl font-black font-cinzel text-gold tracking-widest uppercase mb-12">Knowledge Vault</h1>
        
        <div className="space-y-4">
           {faqs.map((faq, i) => (
             <FAQItem key={i} question={faq.q} answer={faq.a} />
           ))}
        </div>

        <div className="mt-20 p-10 bg-card border border-gold/10 text-center">
           <p className="text-ivory/60 font-raleway uppercase tracking-widest text-xs mb-6">Still have questions?</p>
           <a href="/contact" className="text-gold font-cinzel text-sm font-bold border-b border-gold pb-1 hover:text-white hover:border-white transition-all uppercase tracking-widest">Connect with a Curator</a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gold/10 overflow-hidden">
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="w-full flex items-center justify-between p-6 bg-surface hover:bg-gold/5 transition-colors text-left"
       >
          <span className="font-cinzel text-sm font-bold text-white uppercase tracking-widest">{question}</span>
          {isOpen ? <ChevronUp className="text-gold" size={18} /> : <ChevronDown className="text-gold/40" size={18} />}
       </button>
       <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-card px-6 py-8"
            >
               <p className="text-ivory/60 font-raleway leading-loose text-sm uppercase tracking-wide border-l-2 border-gold/20 pl-6">
                  {answer}
               </p>
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};

export default FAQ;
