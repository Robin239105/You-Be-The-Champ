import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isLoading, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // If already logged in as admin, go to dashboard
  if (isAuthenticated && user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await login(email, password);
      if (success) {
        // Double check role after login
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.role === 'ADMIN') {
          navigate('/admin');
        } else {
          setError('Access Denied: Administrative privileges required.');
        }
      } else {
        setError('Invalid administrative credentials.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-surface border border-gold/20 p-8 sm:p-10 shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-gold/40 mb-6 relative">
              <ShieldCheck size={32} className="text-gold" />
              <div className="absolute inset-0 animate-ping border border-gold/20 rounded-full" />
            </div>
            <h1 className="font-cinzel text-2xl font-bold text-white tracking-[4px] uppercase">Admin Access</h1>
            <p className="text-gold/60 text-[10px] font-raleway tracking-[3px] uppercase mt-2">Authenticated Personnel Only</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-crimson/10 border border-crimson/50 text-crimson text-xs py-3 px-4 mb-6 text-center tracking-wider"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-gold uppercase tracking-[2px] font-cinzel">Admin ID / Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={18} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-gold/10 py-4 pl-12 pr-4 text-white focus:border-gold outline-none transition-all font-raleway text-sm"
                  placeholder="admin@youbethechamp.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gold uppercase tracking-[2px] font-cinzel">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-gold/10 py-4 pl-12 pr-12 text-white focus:border-gold outline-none transition-all font-raleway text-sm"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold text-black py-4 font-cinzel font-bold tracking-[3px] uppercase text-xs hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8 shadow-[0_0_20px_rgba(201,168,76,0.3)]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verifying...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gold/5 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-[9px] text-gold/40 hover:text-gold uppercase tracking-[2px] font-cinzel transition-colors"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
