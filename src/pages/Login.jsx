import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, user, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    }
    return () => clearError();
  }, [isAuthenticated, user, navigate, clearError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    // Redirection is handled by the useEffect above
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
            <svg className="w-12 h-12 text-gold mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.4h7.6l-6.1 4.5 2.3 7.1-6.2-4.4-6.2 4.4 2.3-7.1-6.1-4.5h7.6z" />
            </svg>
            <h1 className="text-2xl font-black font-cinzel text-gold tracking-widest uppercase">Sign In</h1>
            <p className="text-[10px] text-ivory/40 uppercase tracking-[2px] mt-2">Access the Champions Club</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-crimson/10 border border-crimson/20 p-4 flex items-center gap-3 text-crimson text-xs uppercase tracking-widest animate-shake">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
            <div>
              <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="EMAIL@EXAMPLE.COM" 
                className="w-full bg-surface border border-gold/20 px-4 py-3 font-raleway text-sm text-ivory outline-none focus:border-gold transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
               <div className="flex justify-between items-center mb-2">
                 <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest">Password</label>
                 <button type="button" className="text-[10px] text-gold/40 hover:text-gold transition-colors uppercase tracking-widest underline">Forgot?</button>
               </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-surface border border-gold/20 px-4 py-3 font-raleway text-sm text-ivory outline-none focus:border-gold transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full py-4 mt-4 flex items-center justify-center gap-2" disabled={isLoading}>
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Enter The Vault'}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gold/10 text-center">
            <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-6">Or continue with</p>
            <button className="w-full py-3 border border-gold/20 hover:border-gold transition-all text-xs font-cinzel text-ivory flex items-center justify-center gap-3 uppercase">
               <span className="text-lg">G</span> Google Login
            </button>
            <p className="mt-8 text-[10px] text-ivory/40 uppercase tracking-widest">
              No account? <Link to="/account/register" className="text-gold underline">Join The Club</Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
