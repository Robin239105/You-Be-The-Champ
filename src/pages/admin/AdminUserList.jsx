import React, { useState, useEffect, useCallback } from 'react';
import { Search, User, Mail, Calendar, Loader2, ShieldCheck, ShieldOff, Trash2, ShoppingBag, X, ChevronDown } from 'lucide-react';
import api from '../../utils/api';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter !== 'ALL') params.append('role', roleFilter);
      const response = await api.get(`/auth/users?${params.toString()}`);
      if (response.data.success) setUsers(response.data.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, roleFilter]);

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  const handleBan = async (user) => {
    setActionLoading(user.id + '_ban');
    try {
      const res = await api.put(`/auth/users/${user.id}/ban`);
      if (res.data.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isBanned: res.data.data.isBanned } : u));
      }
    } catch { alert('Action failed'); }
    finally { setActionLoading(null); }
  };

  const handleRoleChange = async (user, role) => {
    setActionLoading(user.id + '_role');
    try {
      const res = await api.put(`/auth/users/${user.id}/role`, { role });
      if (res.data.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: res.data.data.role } : u));
      }
    } catch { alert('Action failed'); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.email}? This cannot be undone.`)) return;
    setActionLoading(user.id + '_delete');
    try {
      const res = await api.delete(`/auth/users/${user.id}`);
      if (res.data.success) setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch { alert('Delete failed'); }
    finally { setActionLoading(null); }
  };

  const openOrders = async (user) => {
    setSelectedUser(user);
    setOrdersLoading(true);
    setUserOrders([]);
    try {
      const res = await api.get(`/auth/users/${user.id}`);
      if (res.data.success) setUserOrders(res.data.data.orders || []);
    } catch { setUserOrders([]); }
    finally { setOrdersLoading(false); }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-cinzel text-3xl font-bold text-white tracking-widest uppercase">Customers</h2>
        <p className="text-ivory/60 mt-2">Manage your <span className="text-gold">{users.length}</span> registered users.</p>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-surface p-4 rounded-xl border border-gold/10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full bg-black border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-gold outline-none transition-colors font-raleway text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none bg-black border border-white/10 rounded-lg py-3 pl-4 pr-10 text-white focus:border-gold outline-none font-raleway text-sm"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/40 pointer-events-none" size={14} />
        </div>
      </div>

      <div className="bg-surface border border-gold/10 rounded-xl overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 size={40} className="text-gold animate-spin" />
            <p className="font-cinzel text-xs text-gold uppercase tracking-widest">Loading Customers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-ivory/40">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Orders</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map((user) => (
                  <tr key={user.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${user.isBanned ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/20">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-white font-bold">{user.firstName} {user.lastName}</p>
                          <p className="text-[10px] text-ivory/40 font-mono">{user.id.slice(0, 8)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ivory/80 font-raleway">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gold/40 shrink-0" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        disabled={actionLoading === user.id + '_role'}
                        className="bg-black border border-white/10 rounded px-2 py-1 text-[10px] uppercase tracking-widest font-bold text-white focus:border-gold outline-none"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openOrders(user)}
                        className="flex items-center gap-1 text-ivory/60 hover:text-gold transition-colors text-xs"
                      >
                        <ShoppingBag size={14} />
                        {user._count?.orders ?? 0}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.isBanned ? 'bg-crimson/10 text-crimson' : 'bg-green-500/10 text-green-500'}`}>
                        {user.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-ivory/40">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleBan(user)}
                          disabled={actionLoading === user.id + '_ban'}
                          title={user.isBanned ? 'Unban' : 'Ban'}
                          className={`p-2 rounded transition-all ${user.isBanned ? 'text-green-500 hover:bg-green-500/10' : 'text-amber-500 hover:bg-amber-500/10'}`}
                        >
                          {actionLoading === user.id + '_ban' ? <Loader2 size={14} className="animate-spin" /> : user.isBanned ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={actionLoading === user.id + '_delete'}
                          title="Delete user"
                          className="p-2 text-ivory/30 hover:text-crimson hover:bg-crimson/10 rounded transition-all"
                        >
                          {actionLoading === user.id + '_delete' ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-20 text-center font-cinzel text-xs text-ivory/20 uppercase tracking-widest">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Orders Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-surface border border-gold/20 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gold/10">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">Orders — {selectedUser.firstName} {selectedUser.lastName}</h3>
                <p className="text-ivory/40 text-xs mt-1">{selectedUser.email}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 text-ivory/40 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] p-6 space-y-3">
              {ordersLoading ? (
                <div className="flex justify-center py-10"><Loader2 size={30} className="text-gold animate-spin" /></div>
              ) : userOrders.length === 0 ? (
                <p className="text-center text-ivory/40 font-cinzel text-xs uppercase tracking-widest py-10">No orders yet</p>
              ) : (
                userOrders.map(order => (
                  <div key={order.id} className="bg-black/40 border border-white/5 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-mono text-gold text-xs">{order.id.slice(0, 12)}…</p>
                      <p className="text-ivory/40 text-[10px] mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${Number(order.totalAmount).toFixed(2)}</p>
                      <span className={`text-[10px] uppercase font-bold ${order.status === 'DELIVERED' ? 'text-green-500' : order.status === 'CANCELLED' ? 'text-crimson' : 'text-amber-500'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
