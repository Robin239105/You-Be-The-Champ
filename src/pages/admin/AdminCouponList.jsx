import React, { useState, useEffect } from 'react';
import { Plus, Ticket, Trash2, Loader2, Calendar, DollarSign, Percent, Edit, X, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../../utils/api';

const EMPTY_FORM = { code: '', type: 'PERCENTAGE', value: '', minOrderAmount: '', maxUses: '', expiryDate: '' };

const AdminCouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/coupons');
      if (response.data.success) setCoupons(response.data.data);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openCreate = () => { setEditingCoupon(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount || '',
      maxUses: coupon.maxUses || '',
      expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCoupon) {
        const res = await api.put(`/coupons/${editingCoupon.id}`, form);
        if (res.data.success) setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? res.data.data : c));
      } else {
        const res = await api.post('/coupons', form);
        if (res.data.success) setCoupons(prev => [res.data.data, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (coupon) => {
    try {
      const res = await api.patch(`/coupons/${coupon.id}/toggle`);
      if (res.data.success) setCoupons(prev => prev.map(c => c.id === coupon.id ? res.data.data : c));
    } catch { alert('Toggle failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const res = await api.delete(`/coupons/${id}`);
      if (res.data.success) setCoupons(prev => prev.filter(c => c.id !== id));
    } catch { alert('Delete failed'); }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="font-cinzel text-3xl font-bold text-white tracking-widest uppercase">Coupons</h2>
          <p className="text-ivory/60 mt-2">Manage your <span className="text-gold">{coupons.length}</span> promotional codes.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gold text-black px-6 py-3 rounded-lg font-cinzel text-xs tracking-widest uppercase font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(201,168,76,0.3)]"
        >
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
            <p className="font-cinzel text-xs text-ivory/40 uppercase tracking-widest">No coupons yet. Create one!</p>
          </div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon.id} className={`bg-surface border rounded-xl relative group overflow-hidden p-6 transition-all ${coupon.isActive ? 'border-gold/10' : 'border-white/5 opacity-60'}`}>
              <Ticket className="absolute -right-4 -bottom-4 text-gold/5 rotate-12" size={100} />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 font-mono text-sm font-black tracking-widest ${coupon.isActive ? 'bg-gold text-black' : 'bg-white/10 text-ivory/40'}`}>
                    {coupon.code}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleToggle(coupon)} title={coupon.isActive ? 'Deactivate' : 'Activate'} className="p-1.5 text-ivory/30 hover:text-gold transition-colors">
                      {coupon.isActive ? <ToggleRight size={18} className="text-gold" /> : <ToggleLeft size={18} />}
                    </button>
                    <button onClick={() => openEdit(coupon)} className="p-1.5 text-ivory/30 hover:text-gold transition-colors">
                      <Edit size={15} />
                    </button>
                    <button onClick={() => handleDelete(coupon.id)} className="p-1.5 text-ivory/30 hover:text-crimson transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  {coupon.type === 'PERCENTAGE' ? <Percent size={18} className="text-gold" /> : <DollarSign size={18} className="text-gold" />}
                  <p className="text-2xl font-cinzel font-bold text-white">
                    {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `$${Number(coupon.value).toFixed(2)}`} OFF
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gold/5 text-[10px] uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-gold/40" />
                    <div>
                      <p className="text-ivory/30">Expires</p>
                      <p className="text-white">{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket size={12} className="text-gold/40" />
                    <div>
                      <p className="text-ivory/30">Uses</p>
                      <p className="text-white">{coupon.usedCount || 0} / {coupon.maxUses || '∞'}</p>
                    </div>
                  </div>
                  {coupon.minOrderAmount && (
                    <div className="col-span-2 flex items-center gap-2">
                      <DollarSign size={12} className="text-gold/40" />
                      <div>
                        <p className="text-ivory/30">Min Order</p>
                        <p className="text-white">${Number(coupon.minOrderAmount).toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-surface border border-gold/20 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gold/10">
              <h3 className="font-cinzel text-lg font-bold text-white">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-ivory/40 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-1">Code *</label>
                  <input required value={form.code} onChange={e => setForm(f => ({...f, code: e.target.value.toUpperCase()}))}
                    className="w-full bg-black border border-white/10 rounded-lg py-2.5 px-4 text-white font-mono focus:border-gold outline-none"
                    placeholder="SUMMER20" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-1">Type *</label>
                  <select required value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}
                    className="w-full bg-black border border-white/10 rounded-lg py-2.5 px-4 text-white focus:border-gold outline-none">
                    <option value="PERCENTAGE">Percentage %</option>
                    <option value="FIXED">Fixed $</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-1">Value *</label>
                  <input required type="number" min="0" step="0.01" value={form.value} onChange={e => setForm(f => ({...f, value: e.target.value}))}
                    className="w-full bg-black border border-white/10 rounded-lg py-2.5 px-4 text-white focus:border-gold outline-none"
                    placeholder={form.type === 'PERCENTAGE' ? '20' : '10.00'} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-1">Min Order Amount</label>
                  <input type="number" min="0" step="0.01" value={form.minOrderAmount} onChange={e => setForm(f => ({...f, minOrderAmount: e.target.value}))}
                    className="w-full bg-black border border-white/10 rounded-lg py-2.5 px-4 text-white focus:border-gold outline-none"
                    placeholder="0.00 (optional)" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-1">Max Uses</label>
                  <input type="number" min="0" value={form.maxUses} onChange={e => setForm(f => ({...f, maxUses: e.target.value}))}
                    className="w-full bg-black border border-white/10 rounded-lg py-2.5 px-4 text-white focus:border-gold outline-none"
                    placeholder="Unlimited (optional)" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-1">Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={e => setForm(f => ({...f, expiryDate: e.target.value}))}
                    className="w-full bg-black border border-white/10 rounded-lg py-2.5 px-4 text-white focus:border-gold outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-white/10 text-ivory/60 rounded-lg font-cinzel text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-gold text-black rounded-lg font-cinzel text-xs uppercase tracking-widest font-bold hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editingCoupon ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCouponList;
