import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import Button from './Button';

const NewsletterSection = () => {
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <section className="py-32 px-8 flex flex-col items-center justify-center text-center bg-black relative overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-2xl"
      >
        <Mail className="text-gold mx-auto mb-6" size={48} />
        <h2 className="text-3xl sm:text-4xl font-black font-cinzel mb-4 tracking-[4px] uppercase text-white">
          {subscribed ? 'Welcome To The Club' : 'Join The Champions Club'}
        </h2>
        <p className="text-white opacity-60 font-raleway mb-10 tracking-[1px] uppercase text-sm">
          {subscribed 
            ? 'Your 10% discount code has been dispatched to your archive.' 
            : 'Get 10% off your first order and exclusive access to new championship releases.'}
        </p>
        
        {!subscribed ? (
          <form className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="ENTER YOUR EMAIL" 
              className="flex-1 bg-surface border border-gold/30 px-6 py-4 font-cinzel text-xs tracking-widest text-gold outline-none focus:border-gold transition-colors placeholder:text-gold/30"
              required
            />
            <Button type="submit" className="whitespace-nowrap flex items-center justify-center gap-2">
              Subscribe <ArrowRight size={16} />
            </Button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold font-cinzel text-xs tracking-[4px] uppercase"
          >
            Access Granted
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default NewsletterSection;
