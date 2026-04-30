import React, { useState, useEffect } from 'react';
import { Eye, Truck, CheckCircle, Loader2, AlertCircle, X, Package, MapPin, Hash } from 'lucide-react';
import api from '../../utils/api';

const STATUS_COLORS = {
  PENDING: 'bg-amber-500/10 text-amber-500',
  PROCESSING: 'bg-blue-400/10 text-blue-400',
  SHIPPED: 'bg-blue-500/10 text-blue-500',
  DELIVERED: 'bg-green-500/10 text-green-500',
  CANCELLED: 'bg-crimson/10 text-crimson',
};

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tracking, setTracking] = useState('');
  const [notes, setNotes] = useState('');
  const [savingTracking, setSavingTracking] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = statusFilter === 'ALL' ? '/orders' : `/orders?status=${statusFilter}`;
      const response = await api.get(url);
      if (response.data.success) setOrders(response.data.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const openDetail = (order) => {
    setSelectedOrder(order);
    setTracking(order.trackingNumber || '');
    setNotes(order.notes || '');
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId + newStatus);
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (response.data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder?.id === orderId) setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch { alert('Failed to update status'); }
    finally { setUpdatingStatus(null); }
  };

  const handleSaveTracking = async () => {
    if (!selectedOrder) return;
    setSavingTracking(true);
    try {
      const res = await api.put(`/orders/${selectedOrder.id}/tracking`, { trackingNumber: tracking, notes });
      if (res.data.success) {
        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, trackingNumber: tracking, notes } : o));
        setSelectedOrder(prev => ({ ...prev, trackingNumber: tracking, notes }));
      }
    } catch { alert('Failed to save tracking'); }
    finally { setSavingTracking(false); }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-cinzel text-3xl font-bold text-white tracking-widest uppercase">Orders</h2>
        <p className="text-ivory/60 mt-2">Track and manage <span className="text-gold">{orders.length}</span> customer purchases.</p>
      </header>

      <div className="flex gap-4 border-b border-gold/10 overflow-x-auto scrollbar-hide">
        {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`pb-4 px-2 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-all ${statusFilter === status ? 'text-gold border-b-2 border-gold' : 'text-ivory/40 hover:text-ivory/80'}`}
          >
            {status}
          </button>
        ))}
      </div>

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
          <div className="py-20 text-center"><p className="font-cinzel text-xs text-ivory/40 uppercase tracking-widest">No orders found.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-ivory/40">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tracking</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-gold text-xs">{order.id.slice(0, 8)}…</td>
                    <td className="px-6 py-4 text-white font-bold">{order.user?.firstName} {order.user?.lastName}</td>
                    <td className="px-6 py-4 font-bold">${Number(order.totalAmount || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[order.status] || 'bg-ivory/10 text-ivory/40'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-ivory/40 font-mono">{order.trackingNumber || '—'}</td>
                    <td className="px-6 py-4 text-xs text-ivory/40">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openDetail(order)} className="p-2 text-ivory/40 hover:text-gold hover:bg-gold/10 rounded transition-all" title="View / Edit">
                          <Eye size={15} />
                        </button>
                        {order.status === 'PENDING' && (
                          <button onClick={() => handleUpdateStatus(order.id, 'PROCESSING')} disabled={!!updatingStatus}
                            className="p-2 text-ivory/40 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-all" title="Mark Processing">
                            {updatingStatus === order.id + 'PROCESSING' ? <Loader2 size={15} className="animate-spin" /> : <Package size={15} />}
                          </button>
                        )}
                        {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                          <button onClick={() => handleUpdateStatus(order.id, 'SHIPPED')} disabled={!!updatingStatus}
                            className="p-2 text-ivory/40 hover:text-blue-500 hover:bg-blue-500/10 rounded transition-all" title="Mark Shipped">
                            {updatingStatus === order.id + 'SHIPPED' ? <Loader2 size={15} className="animate-spin" /> : <Truck size={15} />}
                          </button>
                        )}
                        {order.status === 'SHIPPED' && (
                          <button onClick={() => handleUpdateStatus(order.id, 'DELIVERED')} disabled={!!updatingStatus}
                            className="p-2 text-ivory/40 hover:text-green-500 hover:bg-green-500/10 rounded transition-all" title="Mark Delivered">
                            {updatingStatus === order.id + 'DELIVERED' ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-surface border border-gold/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gold/10">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">Order Detail</h3>
                <p className="text-ivory/40 font-mono text-xs mt-1">{selectedOrder.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[selectedOrder.status] || ''}`}>{selectedOrder.status}</span>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-ivory/40 hover:text-white"><X size={18} /></button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* Customer */}
              <div className="bg-black/30 rounded-xl p-4 space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Customer</p>
                <p className="text-white font-bold">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                <p className="text-ivory/60 text-sm">{selectedOrder.user?.email}</p>
              </div>

              {/* Shipping */}
              {selectedOrder.shippingAddress && (
                <div className="bg-black/30 rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-widest text-ivory/40 mb-2 flex items-center gap-2"><MapPin size={12} /> Shipping Address</p>
                  <div className="text-sm text-ivory/80 space-y-0.5">
                    {Object.values(selectedOrder.shippingAddress).filter(Boolean).map((v, i) => <p key={i}>{v}</p>)}
                  </div>
                </div>
              )}

              {/* Tracking */}
              <div className="bg-black/30 rounded-xl p-4 space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-ivory/40 flex items-center gap-2"><Hash size={12} /> Tracking & Notes</p>
                <input
                  value={tracking}
                  onChange={e => setTracking(e.target.value)}
                  placeholder="Tracking number..."
                  className="w-full bg-black border border-white/10 rounded-lg py-2.5 px-4 text-white font-mono text-sm focus:border-gold outline-none"
                />
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Internal notes..."
                  rows={2}
                  className="w-full bg-black border border-white/10 rounded-lg py-2.5 px-4 text-white text-sm focus:border-gold outline-none resize-none"
                />
                <button onClick={handleSaveTracking} disabled={savingTracking}
                  className="flex items-center gap-2 bg-gold text-black px-4 py-2 rounded-lg font-cinzel text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-transform disabled:opacity-50">
                  {savingTracking && <Loader2 size={12} className="animate-spin" />}
                  Save Tracking
                </button>
              </div>

              {/* Status Quick Change */}
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-ivory/40 mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                    <button key={s} onClick={() => handleUpdateStatus(selectedOrder.id, s)} disabled={selectedOrder.status === s || !!updatingStatus}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all border ${selectedOrder.status === s ? 'bg-gold text-black border-gold' : 'border-white/10 text-ivory/40 hover:border-gold/40 hover:text-white'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-black/30 rounded-xl p-4 flex justify-between items-center">
                <p className="text-[10px] uppercase tracking-widest text-ivory/40">Order Total</p>
                <p className="font-cinzel text-xl font-bold text-gold">${Number(selectedOrder.totalAmount).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderList;
