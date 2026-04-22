import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';

const Register = () => {
  const login = useAuthStore(state => state.login);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/account');
    }
  }, [isAuthenticated, navigate]);
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleRegister = (e) => {
    e.preventDefault();
    // Demo registration logic
    login({ 
      name: `${formData.firstName} ${formData.lastName}`, 
      email: formData.email,
      initials: formData.firstName[0] + formData.lastName[0],
      memberSince: new Date().getFullYear(),
      affiliateId: `CHAMP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    }, 'mock-jwt-token');
    navigate('/account');
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-8 pt-40 pb-24 relative overflow-hidden">
        {/* Glow BG */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/5 blur-[80px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-gold/20 p-10 max-w-md w-full relative z-10"
        >
          <div className="text-center mb-10">
            <h1 className="text-2xl font-black font-cinzel text-gold tracking-widest uppercase">Join The Club</h1>
            <p className="text-[10px] text-ivory/40 uppercase tracking-[2px] mt-2">Begin Your Championship Collection</p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest mb-2">First Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface border border-gold/20 px-4 py-3 text-sm text-ivory font-raleway outline-none focus:border-gold transition-colors" 
                    required 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest mb-2">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface border border-gold/20 px-4 py-3 text-sm text-ivory font-raleway outline-none focus:border-gold transition-colors" 
                    required 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
               </div>
            </div>
            <div>
              <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="EMAIL@EXAMPLE.COM" 
                className="w-full bg-surface border border-gold/20 px-4 py-3 text-sm text-ivory font-raleway outline-none focus:border-gold transition-colors" 
                required 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest mb-2">Create Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-surface border border-gold/20 px-4 py-3 text-sm text-ivory font-raleway outline-none focus:border-gold transition-colors" 
                required 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="pt-2 text-[10px] text-ivory/40 uppercase tracking-widest leading-relaxed">
               By clicking "Create Account", you agree to join the Champions Club newsletter for exclusive ring drops.
            </div>

            <Button type="submit" className="w-full py-4 mt-4">Create Account</Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gold/10 text-center">
            <p className="text-[10px] text-ivory/40 uppercase tracking-widest">
              Already a member? <Link to="/account/login" className="text-gold underline">Sign In Here</Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
