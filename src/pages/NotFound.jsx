import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Animated Background */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.5 }}
           animate={{ opacity: 1, scale: 1 }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[100px] rounded-full -z-10"
        />

        <motion.div
           initial={{ rotate: 0 }}
           animate={{ rotate: 360 }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="mb-12 opacity-20"
        >
           <svg className="w-48 h-48 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.4h7.6l-6.1 4.5 2.3 7.1-6.2-4.4-6.2 4.4 2.3-7.1-6.1-4.5h7.6z" />
           </svg>
        </motion.div>

        <h1 className="text-[120px] md:text-[200px] font-black font-cinzel text-gold/10 leading-none select-none tracking-tighter">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-black font-cinzel text-gold tracking-widest uppercase mt-[-40px] md:mt-[-80px] mb-8 relative z-10">
          This Ring Doesn't Exist... Yet.
        </h2>
        
        <p className="max-w-md text-ivory/40 font-raleway uppercase tracking-[2px] text-xs mb-12 leading-loose">
          The trophy you are looking for has either been moved to the vault or hasn't been won in our timeline. Return to the shop to find your legacy.
        </p>

        <Link to="/">
          <Button variant="primary">Return To Home</Button>
        </Link>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
