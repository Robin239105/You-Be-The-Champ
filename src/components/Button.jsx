import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', onClick, className = '', ...props }) => {
  const baseStyles = "px-8 py-3 font-cinzel text-sm uppercase tracking-[2px] transition-all duration-300 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-gold text-black hover:bg-gold-light",
    secondary: "border border-gold text-gold hover:bg-gold hover:text-black",
    outline: "border border-gold text-gold hover:bg-gold/10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 linear" />
      )}
    </motion.button>
  );
};

export default Button;
