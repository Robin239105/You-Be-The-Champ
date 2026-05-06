import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { downloadInvoice } from '../utils/invoice';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { Package, Heart, Settings, MapPin, Bell, LogOut, ChevronRight, Award, Copy, Check, DollarSign, Users, MousePointer2, Download, Loader2, AlertCircle, Trash2, Plus } from 'lucide-react';

const Account = () => {
  const { user, logout, isAuthenticated, updateUser } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [copied, setCopied] = useState(false);
  const [affiliateStats, setAffiliateStats] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({ street: '', city: '', state: '', zip: '', country: 'Australia', isDefault: false });
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Order Shipped', message: 'Your order has been shipped!', date: new Date().toISOString(), read: false },
    { id: 2, title: 'Welcome', message: 'Welcome to You Be The Champ!', date: new Date().toISOString(), read: true }
  ]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const response = await api.put('/auth/me', {
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      if (response.data.success) {
        updateUser(response.data.data);
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/addresses', addressFormData);
      if (response.data.success) {
        setAddresses([...addresses, response.data.data]);
        setShowAddressForm(false);
        setAddressFormData({ street: '', city: '', state: '', zip: '', country: 'Australia', isDefault: false });
      }
    } catch (error) {
      console.error('Address add error:', error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await api.delete(`/auth/addresses/${addressId}`);
      if (response.data.success) {
        setAddresses(addresses.filter(a => a.id !== addressId));
      }
    } catch (error) {
      console.error('Address delete error:', error);
    }
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
                   {menuItems.find(m => m.id === activeTab)?.name || 'My Orders'}
                </h3>

                {/* ORDERS TAB */}
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
                           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 pb-4 border-b border-gold/10">
                             <div>
                               <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">Order #{order.orderNumber || order.id.slice(0,8)}</p>
                               <p className="text-xs sm:text-sm text-ivory font-bold uppercase">{order.status}</p>
                             </div>
                             <div className="flex items-center gap-2 sm:gap-4">
                               <span className="text-sm font-mono text-gold">${parseFloat(order.totalAmount || 0).toFixed(2)}</span>
                               <span className="text-[9px] text-gold/60 uppercase">{new Date(order.createdAt).toLocaleDateString()}</span>
                             </div>
                           </div>
                           
                           <div className="space-y-3 mb-4">
                             {order.orderItems?.map((item) => {
                               const itemPrice = parseFloat(item.price || 0);
                               const itemTotal = itemPrice * (item.quantity || 1);
                               return (
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
                                     <p className="text-[9px] sm:text-[10px] text-ivory/40 uppercase">Qty: {item.quantity} × ${itemPrice.toFixed(2)}</p>
                                   </div>
                                   <span className="text-xs sm:text-sm font-mono text-gold">${itemTotal.toFixed(2)}</span>
                                 </Link>
                               );
                             })}
                           </div>
                           
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

                {/* WISHLIST TAB */}
                {activeTab === 'wishlist' && (
                  <div className="space-y-4">
                    {wishlistItems.length === 0 ? (
                      <div className="py-20 text-center border border-dashed border-gold/20">
                        <Heart size={40} className="text-gold/20 mx-auto mb-4" />
                        <p className="font-cinzel text-xs text-ivory/40 uppercase tracking-widest">No items in your wishlist yet.</p>
                        <Link to="/shop" className="mt-4 inline-block text-gold text-[10px] font-cinzel uppercase underline">Browse Products</Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wishlistItems.map((item) => (
                          <div key={item.id} className="p-4 bg-surface border border-gold/10 hover:border-gold/30 transition-all">
                            <img src={item.image || item.images?.[0]?.url} alt={item.name} className="w-full h-40 object-cover mb-4 rounded" />
                            <p className="text-[10px] font-cinzel text-gold uppercase mb-2 truncate">{item.name}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-mono text-ivory">${Number(item.price || 0).toFixed(2)}</span>
                              <Link to={`/product/${item.slug || item.id}`} className="text-[10px] text-gold hover:underline">View</Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                  <form className="max-w-xl space-y-6 sm:space-y-8" onSubmit={handleUpdateProfile}>
                    {profileSuccess && (
                      <div className="bg-emerald-900/20 border border-emerald-500/40 p-4 flex items-center gap-3 text-emerald-400 text-xs uppercase tracking-widest">
                        <Check size={14} /> Profile updated successfully!
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                       <Input label="First Name" value={formData.firstName} onChange={(v) => setFormData({...formData, firstName: v})} />
                       <Input label="Last Name" value={formData.lastName} onChange={(v) => setFormData({...formData, lastName: v})} />
                       <Input label="Email Address" value={formData.email} disabled full />
                    </div>
                    <Button type="submit" disabled={profileLoading} className="w-full sm:w-auto">
                      {profileLoading ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </form>
                )}

                {/* ADDRESS BOOK TAB */}
                {activeTab === 'address' && (
                  <div className="space-y-6">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="p-4 bg-surface border border-gold/10">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs font-bold text-ivory uppercase">{addr.street}</p>
                            <p className="text-[10px] text-ivory/60">{addr.city}, {addr.state} {addr.zip}</p>
                            {addr.isDefault && <span className="text-[9px] text-gold mt-1 font-cinzel">DEFAULT</span>}
                          </div>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="text-crimson hover:bg-crimson/10 p-2">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {!showAddressForm ? (
                      <button 
                        onClick={() => setShowAddressForm(true)}
                        className="w-full py-3 border border-dashed border-gold/30 text-gold text-[10px] font-cinzel uppercase hover:bg-gold/5 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={14} /> Add New Address
                      </button>
                    ) : (
                      <form onSubmit={handleAddAddress} className="p-4 bg-surface border border-gold/10 space-y-4">
                        <Input label="Street Address" value={addressFormData.street} onChange={(v) => setAddressFormData({...addressFormData, street: v})} full />
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="City" value={addressFormData.city} onChange={(v) => setAddressFormData({...addressFormData, city: v})} />
                          <Input label="State" value={addressFormData.state} onChange={(v) => setAddressFormData({...addressFormData, state: v})} />
                        </div>
                        <Input label="ZIP Code" value={addressFormData.zip} onChange={(v) => setAddressFormData({...addressFormData, zip: v})} />
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={addressFormData.isDefault} onChange={(e) => setAddressFormData({...addressFormData, isDefault: e.target.checked})} className="w-4 h-4 accent-gold" />
                          <label className="text-[10px] text-ivory/60 uppercase">Set as default</label>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="flex-1">Add Address</Button>
                          <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 border border-gold/30 py-2 text-ivory uppercase text-[10px]">Cancel</button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                  <div className="space-y-4">
                    {notifications.length === 0 ? (
                      <div className="py-20 text-center border border-dashed border-gold/20">
                        <Bell size={40} className="text-gold/20 mx-auto mb-4" />
                        <p className="font-cinzel text-xs text-ivory/40 uppercase tracking-widest">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 border ${notif.read ? 'border-gold/10 bg-surface' : 'border-gold/30 bg-gold/5'}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-cinzel text-xs text-gold uppercase">{notif.title}</p>
                              <p className="text-[10px] text-ivory/60 mt-1">{notif.message}</p>
                              <p className="text-[9px] text-ivory/40 mt-2">{new Date(notif.date).toLocaleDateString()}</p>
                            </div>
                            {!notif.read && <div className="w-2 h-2 rounded-full bg-gold ml-4 flex-shrink-0 mt-1" />}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* AFFILIATE TAB */}
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

const Input = ({ label, value, onChange, disabled = false, full = false }) => (
  <div className={full ? 'col-span-2' : ''}>
    <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest mb-2">{label}</label>
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      className={`w-full bg-surface border border-gold/20 px-4 py-3 font-raleway text-sm text-ivory outline-none focus:border-gold transition-colors ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    />
  </div>
);

export default Account;
