import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, Users, DollarSign, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const StatCard = ({ label, value, icon: Icon, trend }) => (
  <div className="bg-surface border border-gold/10 p-6 rounded-xl hover:border-gold/30 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gold/10 rounded-lg text-gold">
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`text-[10px] font-bold px-2 py-1 rounded ${trend > 0 ? 'bg-green-500/10 text-green-500' : 'bg-crimson/10 text-crimson'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-ivory/40 text-xs uppercase tracking-widest font-raleway mb-1">{label}</h3>
    <p className="text-2xl font-cinzel font-bold text-white">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/orders/stats/summary');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20">
        <Loader2 size={48} className="text-gold animate-spin mb-4" />
        <p className="font-cinzel text-xs text-gold uppercase tracking-[3px]">Initializing Command Center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-cinzel text-3xl font-bold text-white tracking-widest uppercase">Overview</h2>
        <p className="text-ivory/60 mt-2">Welcome back to the command center.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Revenue" value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`} icon={DollarSign} />
        <StatCard label="Total Orders" value={stats?.totalOrders || '0'} icon={ShoppingBag} />
        <StatCard label="Total Customers" value={stats?.totalCustomers || '0'} icon={Users} />
        <StatCard label="Total Inventory" value={stats?.totalProducts || '0'} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface border border-gold/10 rounded-xl p-8">
          <h3 className="font-cinzel text-lg text-gold uppercase tracking-widest mb-6">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gold/10 text-[10px] uppercase tracking-widest text-ivory/40">
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-ivory/80">
                {stats?.recentOrders?.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 font-mono text-xs text-gold truncate max-w-[100px]">{order.id}</td>
                    <td className="py-4">{order.user?.firstName} {order.user?.lastName}</td>
                    <td className="py-4 font-bold text-gold">${order.totalAmount?.toFixed(2)}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-gold/10 text-gold uppercase">{order.status}</span>
                    </td>
                  </tr>
                ))}
                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-ivory/20 font-cinzel text-xs uppercase tracking-widest">No recent activity</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface border border-gold/10 rounded-xl p-8">
          <h3 className="font-cinzel text-lg text-gold uppercase tracking-widest mb-6">Top Products</h3>
          <div className="space-y-6">
            {stats?.topProducts?.map((product) => (
              <div key={product.id} className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-black rounded border border-gold/20 flex-shrink-0 overflow-hidden">
                  {product.images && product.images[0] && (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{product.name}</h4>
                  <p className="text-[9px] text-ivory/40 uppercase tracking-widest">{product._count?.orderItems || 0} Sales</p>
                </div>
                <div className="text-gold font-bold text-xs">${product.price}</div>
              </div>
            ))}
            {(!stats?.topProducts || stats.topProducts.length === 0) && (
              <div className="py-12 text-center text-ivory/20 font-cinzel text-xs uppercase tracking-widest">No sales data yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
