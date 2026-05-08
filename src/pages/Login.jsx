import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, loginWithGoogle, isAuthenticated, user, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        // Redirect to the intended location (e.g., checkout) or default to account
        const redirectTo = location.state?.from?.pathname || '/account';
        console.log('🔄 Redirecting to:', redirectTo);
        navigate(redirectTo, { replace: true });
      }
    }
    return () => clearError();
  }, [isAuthenticated, user, navigate, clearError, location.state?.from]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    // Redirection is handled by the useEffect above
  };

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (!result.success) {
      // Error is handled by authStore
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-8 pt-52 pb-24 relative overflow-hidden">
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
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 border border-gold/20 hover:border-gold transition-all text-xs font-cinzel text-ivory flex items-center justify-center gap-3 uppercase disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google Login
                </>
              )}
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
