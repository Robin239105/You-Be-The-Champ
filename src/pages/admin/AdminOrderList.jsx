import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Truck, CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = statusFilter === 'ALL' ? '/orders' : `/orders?status=${statusFilter}`;
      const response = await api.get(url);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (response.data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-500';
      case 'SHIPPED': return 'bg-blue-500/10 text-blue-500';
      case 'DELIVERED': return 'bg-green-500/10 text-green-500';
      case 'CANCELLED': return 'bg-crimson/10 text-crimson';
      default: return 'bg-ivory/10 text-ivory/40';
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-cinzel text-3xl font-bold text-white tracking-widest uppercase">Orders</h2>
        <p className="text-ivory/60 mt-2">Track and manage customer purchases.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gold/10 overflow-x-auto scrollbar-hide">
        {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
          <button 
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`pb-4 px-2 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-all ${
              statusFilter === status ? 'text-gold border-b-2 border-gold' : 'text-ivory/40 hover:text-ivory/80'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-surface border border-gold/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 size={40} className="text-gold animate-spin" />
            <p className="font-cinzel text-[10px] text-gold tracking-widest uppercase">Fetching Orders...</p>
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-crimson">
            <AlertCircle size={40} />
            <p className="font-cinzel text-xs uppercase tracking-widest">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-gold/10 mx-8 my-8">
            <p className="font-cinzel text-xs text-ivory/40 uppercase tracking-widest">No orders found for this status.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-ivory/40">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-gold text-xs truncate max-w-[120px]">{order.id}</td>
                    <td className="px-6 py-4 text-white font-bold">{order.user?.firstName} {order.user?.lastName}</td>
                    <td className="px-6 py-4 font-bold">${order.totalAmount?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-ivory/40">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === 'PENDING' && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                            className="p-2 text-ivory/40 hover:text-blue-500 hover:bg-blue-500/10 rounded transition-all"
                            title="Mark Shipped"
                          >
                            <Truck size={16} />
                          </button>
                        )}
                        {order.status === 'SHIPPED' && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                            className="p-2 text-ivory/40 hover:text-green-500 hover:bg-green-500/10 rounded transition-all"
                            title="Mark Delivered"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderList;
