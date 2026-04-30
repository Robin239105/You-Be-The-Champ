import React, { useState, useEffect } from 'react';
import { Plus, Ticket, Trash2, Loader2, Calendar, DollarSign, Percent } from 'lucide-react';
import api from '../../utils/api';

const AdminCouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/coupons');
      if (response.data.success) {
        setCoupons(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const response = await api.delete(`/coupons/${id}`);
        if (response.data.success) {
          setCoupons(prev => prev.filter(c => c.id !== id));
        }
      } catch (error) {
        alert('Failed to delete coupon');
      }
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="font-cinzel text-3xl font-bold text-white tracking-widest uppercase">Coupons</h2>
          <p className="text-ivory/60 mt-2">Manage your promotional discount codes.</p>
        </div>
        <button className="flex items-center gap-2 bg-gold text-black px-6 py-3 rounded-lg font-cinzel text-xs tracking-widest uppercase font-bold hover:scale-105 transition-transform opacity-50 cursor-not-allowed">
          <Plus size={16} /> Create Coupon
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center gap-4">
            <Loader2 size={40} className="text-gold animate-spin" />
            <p className="font-cinzel text-xs text-gold uppercase tracking-widest">Scanning Vault...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-dashed border-gold/10 rounded-xl">
            <Ticket size={40} className="text-gold/20 mx-auto mb-4" />
            <p className="font-cinzel text-xs text-ivory/40 uppercase tracking-widest">No active coupons found.</p>
          </div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon.id} className="bg-surface border border-gold/10 p-6 rounded-xl relative group overflow-hidden">
               {/* Decorative Background Icon */}
               <Ticket className="absolute -right-4 -bottom-4 text-gold/5 rotate-12" size={100} />
               
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                     <div className="px-3 py-1 bg-gold text-black font-mono text-sm font-black tracking-widest">
                        {coupon.code}
                     </div>
                     <button 
                       onClick={() => handleDelete(coupon.id)}
                       className="p-2 text-ivory/20 hover:text-crimson hover:bg-crimson/10 transition-all rounded"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        {coupon.type === 'PERCENTAGE' ? <Percent size={18} className="text-gold" /> : <DollarSign size={18} className="text-gold" />}
                        <div>
                           <p className="text-2xl font-cinzel font-bold text-white">
                              {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `$${coupon.value}`} OFF
                           </p>
                           <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Discount Value</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gold/5">
                        <div className="flex items-center gap-2">
                           <Calendar size={14} className="text-gold/40" />
                           <div className="text-[10px] uppercase tracking-widest">
                              <p className="text-ivory/20">Expires</p>
                              <p className="text-white">{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Ticket size={14} className="text-gold/40" />
                           <div className="text-[10px] uppercase tracking-widest">
                              <p className="text-ivory/20">Usage</p>
                              <p className="text-white">{coupon.usageCount || 0} / {coupon.usageLimit || '∞'}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCouponList;
