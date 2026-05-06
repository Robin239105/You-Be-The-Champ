import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { downloadInvoice } from '../utils/invoice';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { Package, Heart, Settings, MapPin, Bell, LogOut, ChevronRight, Award, Copy, Check, DollarSign, Users, MousePointer2, Download, Loader2 } from 'lucide-react';

const Account = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [copied, setCopied] = useState(false);
  const [affiliateStats, setAffiliateStats] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/account/login');
      return;
    }
    let mounted = true;
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/orders/my');
        if (mounted && response.data.success) {
          setOrders(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchOrders();

    const fetchAffiliateStats = async () => {
      try {
        const res = await api.get('/affiliate/me');
        if (mounted && res.data.success) setAffiliateStats(res.data.data);
      } catch (err) {
        console.error('Affiliate stats error:', err);
      }
    };
    fetchAffiliateStats();

    return () => { mounted = false; };
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const affiliateLink = affiliateStats?.affiliateCode
    ? `https://youbethechamp.com.au/?ref=${affiliateStats.affiliateCode}`
    : user?.affiliateCode
      ? `https://youbethechamp.com.au/?ref=${user.affiliateCode}`
      : 'Loading...';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const menuItems = [
    { id: 'orders', name: 'My Orders', icon: Package },
    { id: 'wishlist', name: 'Wishlist', icon: Heart },
    { id: 'affiliate', name: 'Affiliate Program', icon: Award },
    { id: 'profile', name: 'Profile Settings', icon: Settings },
    { id: 'address', name: 'Address Book', icon: MapPin },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-24">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-2">
            <div className="p-4 sm:p-6 lg:p-8 bg-card border border-gold/20 mb-4 lg:mb-8 text-center">
               <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 border border-gold/30">
                  <span className="text-xl sm:text-2xl font-black font-cinzel text-gold">{user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'C'}</span>
               </div>
               <h2 className="font-cinzel text-sm font-bold text-white uppercase">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || user?.email || 'Champion Fan'}</h2>
               <p className="text-[10px] text-gold/60 uppercase tracking-widest mt-1">Hall of Fame Member</p>
            </div>

            {/* Mobile Tab Selector */}
            {isMobile && (
              <div className="mb-4">
                <select 
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full bg-card border border-gold/20 p-3 font-cinzel text-xs text-ivory uppercase tracking-widest"
                >
                  {menuItems.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Desktop Sidebar Menu */}
            {!isMobile && menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3 sm:p-4 font-cinzel text-xs tracking-widest uppercase transition-all ${activeTab === item.id ? 'bg-gold text-black' : 'text-ivory/60 hover:bg-gold/5'}`}
              >
                <div className="flex items-center gap-3">
                   <item.icon size={16} />
                   <span className="truncate">{item.name}</span>
                </div>
                <ChevronRight size={14} className={activeTab === item.id ? 'text-black' : 'text-gold/30'} />
              </button>
            ))}

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 font-cinzel text-xs tracking-widest uppercase text-crimson hover:bg-crimson/5 transition-all"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </aside>

          {/* Content Area */}
          <div className="flex-1 bg-card border border-gold/10 p-4 sm:p-6 lg:p-8 xl:p-12 min-h-[400px] lg:min-h-[600px] relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-2xl font-black font-cinzel text-gold tracking-widest uppercase mb-12 border-b border-gold/10 pb-6">
                  {menuItems.find(m => m.id === activeTab).name}
               </h3>

               {activeTab === 'orders' && (
                 <div className="space-y-4 lg:space-y-6">
                   {isLoading ? (
                      <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 size={40} className="text-gold animate-spin" />
                        <p className="font-cinzel text-[10px] text-gold tracking-widest uppercase">Fetching your history...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="py-20 text-center border border-dashed border-gold/20">
                        <Package size={40} className="text-gold/20 mx-auto mb-4" />
                        <p className="font-cinzel text-xs text-ivory/40 uppercase tracking-widest">No orders found yet.</p>
                        <Link to="/shop" className="mt-4 inline-block text-gold text-[10px] font-cinzel uppercase underline">Start Shopping</Link>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="p-4 sm:p-6 bg-surface border border-gold/10">
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 pb-4 border-b border-gold/10">
                            <div>
                              <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">Order #{order.orderNumber || order.id.slice(0,8)}</p>
                              <p className="text-xs sm:text-sm text-ivory font-bold uppercase">{order.status}</p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4">
                              <span className="text-sm font-mono text-gold">${Number(order.totalAmount || 0).toFixed(2)}</span>
                              <span className="text-[9px] text-gold/60 uppercase">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          {/* Order Items with Images */}
                          <div className="space-y-3 mb-4">
                            {order.orderItems?.map((item) => (
                              <Link 
                                key={item.id} 
                                to={`/product/${item.product?.slug || item.productId}`}
                                className="flex items-center gap-3 sm:gap-4 p-2 hover:bg-gold/5 transition-colors rounded"
                              >
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black border border-gold/10 flex-shrink-0 overflow-hidden">
                                  {item.product?.images?.[0] ? (
                                    <img 
                                      src={typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0]?.url} 
                                      alt={item.product?.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Package size={20} className="text-gold/40 m-auto" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] sm:text-xs text-ivory font-bold uppercase truncate">{item.product?.name || 'Championship Ring'}</p>
                                  <p className="text-[9px] sm:text-[10px] text-ivory/40 uppercase">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                                </div>
                                <span className="text-xs sm:text-sm font-mono text-gold">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                              </Link>
                            ))}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 pt-4 border-t border-gold/10">
                            <button 
                              onClick={() => downloadInvoice(order)}
                              className="flex items-center justify-center gap-2 py-2 px-4 sm:px-6 border border-gold/20 text-gold text-[10px] font-cinzel uppercase hover:bg-gold/10 transition-all"
                            >
                              <Download size={14} /> Invoice
                            </button>
                            <Button variant="outline" className="py-2 px-4 sm:px-6 text-[10px]">Track Order</Button>
                          </div>
                        </div>
                      ))
                    )}
                 </div>
               )}

               {activeTab === 'affiliate' && (
                 <div className="space-y-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                       <StatCard icon={DollarSign} label="Total Earned" value={`$${affiliateStats?.totalEarned || '0.00'}`} />
                       <StatCard icon={DollarSign} label="Pending" value={`$${affiliateStats?.pendingAmount || '0.00'}`} />
                       <StatCard icon={Users} label="Referrals" value={affiliateStats?.referralCount ?? 0} />
                       <StatCard icon={MousePointer2} label="Total Clicks" value={affiliateStats?.affiliateClicks ?? 0} />
                    </div>

                    <div className="bg-surface border border-gold/20 p-8">
                       <h4 className="font-cinzel text-xs font-bold text-gold uppercase tracking-widest mb-6">Your Curator Link</h4>
                       <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 bg-black border border-gold/10 px-4 py-3 font-mono text-[10px] text-ivory truncate flex items-center">
                             {affiliateLink}
                          </div>
                          <button 
                            onClick={copyToClipboard}
                            className="bg-gold text-black px-6 py-3 font-cinzel text-[10px] font-bold tracking-widest uppercase hover:bg-gold-light transition-all flex items-center justify-center gap-2"
                          >
                             {copied ? <Check size={14}/> : <Copy size={14}/>}
                             {copied ? 'Copied' : 'Copy Link'}
                          </button>
                       </div>
                    </div>

                    {affiliateStats?.commissions?.length > 0 && (
                      <div className="bg-surface border border-gold/10 overflow-hidden">
                        <div className="px-8 py-5 border-b border-gold/10">
                          <h4 className="font-cinzel text-xs font-bold text-gold uppercase tracking-widest">Commission History</h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="bg-black/40 border-b border-gold/10">
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gold font-cinzel">Date</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gold font-cinzel">Order</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gold font-cinzel">Sale</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gold font-cinzel">Commission</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gold font-cinzel">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gold/5">
                              {affiliateStats.commissions.map(c => (
                                <tr key={c.id} className="hover:bg-gold/[0.02]">
                                  <td className="px-6 py-4 text-[10px] text-ivory/60 font-raleway">{new Date(c.createdAt).toLocaleDateString()}</td>
                                  <td className="px-6 py-4"><code className="text-[10px] text-gold/60">{c.orderId.slice(0,8)}...</code></td>
                                  <td className="px-6 py-4 text-[10px] text-ivory font-mono">${c.orderAmount}</td>
                                  <td className="px-6 py-4 text-[10px] text-gold font-mono font-bold">${c.commission}</td>
                                  <td className="px-6 py-4">
                                    <span className={`text-[9px] px-2 py-1 font-cinzel uppercase tracking-widest border ${
                                      c.status === 'PAID' ? 'border-emerald-500/40 text-emerald-400 bg-emerald-900/20' :
                                      c.status === 'APPROVED' ? 'border-gold/40 text-gold bg-gold/10' :
                                      'border-ivory/20 text-ivory/50 bg-white/[0.03]'
                                    }`}>{c.status}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                 </div>
               )}

               {activeTab === 'profile' && (
                 <form className="max-w-xl space-y-6 sm:space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                       <Input label="First Name" value={user?.firstName || ''} />
                       <Input label="Last Name" value={user?.lastName || ''} />
                       <Input label="Email Address" value={user?.email || ''} full />
                    </div>
                    <Button className="w-full sm:w-auto">Update Profile</Button>
                 </form>
               )}
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-surface border border-gold/10 p-6 text-center group hover:border-gold/30 transition-all">
     <div className="w-10 h-10 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gold border border-gold/10 group-hover:bg-gold group-hover:text-black transition-all">
        <Icon size={18} />
     </div>
     <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">{label}</p>
     <p className="text-xl font-mono font-bold text-white group-hover:text-gold transition-colors">{value}</p>
  </div>
);

const Input = ({ label, value, full = false }) => (
  <div className={full ? 'col-span-2' : ''}>
    <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest mb-2">{label}</label>
    <input 
      type="text" 
      defaultValue={value}
      className="w-full bg-surface border border-gold/20 px-4 py-3 font-raleway text-sm text-ivory outline-none focus:border-gold transition-colors"
    />
  </div>
);

export default Account;
