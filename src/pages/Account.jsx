import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { downloadInvoice } from '../utils/invoice';
import { Package, Heart, Settings, MapPin, Bell, LogOut, ChevronRight, Award, Copy, Check, DollarSign, Users, MousePointer2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Account = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const orders = useOrderStore(state => state.orders);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const [activeTab, setActiveTab] = useState('orders');
  const [copied, setCopied] = useState(false);

  const affiliateLink = `https://youbethechamp.com/?ref=${user?.affiliateId || 'CHAMP10'}`;

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
      
      <main className="max-w-7xl mx-auto px-8 pt-40 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-2">
            <div className="p-8 bg-card border border-gold/20 mb-8 text-center">
               <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/30">
                  <span className="text-2xl font-black font-cinzel text-gold">{user?.name?.charAt(0) || 'C'}</span>
               </div>
               <h2 className="font-cinzel text-sm font-bold text-white uppercase">{user?.name || 'Champion Fan'}</h2>
               <p className="text-[10px] text-gold/60 uppercase tracking-widest mt-1">Hall of Fame Member</p>
            </div>

            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-4 font-cinzel text-xs tracking-widest uppercase transition-all ${activeTab === item.id ? 'bg-gold text-black' : 'text-ivory/60 hover:bg-gold/5'}`}
              >
                <div className="flex items-center gap-3">
                   <item.icon size={16} />
                   <span>{item.name}</span>
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
          <div className="flex-1 bg-card border border-gold/10 p-8 sm:p-12 min-h-[600px] relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-2xl font-black font-cinzel text-gold tracking-widest uppercase mb-12 border-b border-gold/10 pb-6">
                  {menuItems.find(m => m.id === activeTab).name}
               </h3>

               {activeTab === 'orders' && (
                 <div className="space-y-6">
                   {orders.length === 0 ? (
                     <div className="py-20 text-center border border-dashed border-gold/20">
                       <Package size={40} className="text-gold/20 mx-auto mb-4" />
                       <p className="font-cinzel text-xs text-ivory/40 uppercase tracking-widest">No orders found yet.</p>
                       <Link to="/shop" className="mt-4 inline-block text-gold text-[10px] font-cinzel uppercase underline">Start Shopping</Link>
                     </div>
                   ) : (
                     orders.map((order) => (
                       <div key={order.orderId} className="p-6 bg-surface border border-gold/10 flex flex-col md:flex-row justify-between items-center gap-6">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-black border border-gold/10 flex items-center justify-center">
                               <Package size={24} className="text-gold/40" />
                            </div>
                            <div>
                               <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">Order #{order.orderId}</p>
                               <p className="text-sm text-ivory font-bold uppercase">{order.status}</p>
                               <p className="text-[9px] text-gold/60 uppercase mt-1">Placed on {order.date}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="text-sm font-mono text-gold mr-4">${order.finalTotal.toFixed(2)}</span>
                            <button 
                              onClick={() => downloadInvoice(order)}
                              className="flex items-center gap-2 py-2 px-6 border border-gold/20 text-gold text-[10px] font-cinzel uppercase hover:bg-gold/10 transition-all"
                            >
                              <Download size={14} /> Invoice
                            </button>
                            <Button variant="outline" className="py-2 px-6 text-[10px]">Track</Button>
                         </div>
                       </div>
                     ))
                   )}
                 </div>
               )}

               {activeTab === 'affiliate' && (
                 <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <StatCard icon={DollarSign} label="Total Earned" value="$0.00" />
                       <StatCard icon={Users} label="Referrals" value="0" />
                       <StatCard icon={MousePointer2} label="Total Clicks" value="0" />
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
                 </div>
               )}

               {activeTab === 'profile' && (
                 <form className="max-w-xl space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-2 gap-6">
                       <Input label="First Name" value={user?.name?.split(' ')[0] || 'Champion'} />
                       <Input label="Last Name" value={user?.name?.split(' ')[1] || 'Fan'} />
                       <Input label="Email Address" value={user?.email || 'fan@example.com'} full />
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
