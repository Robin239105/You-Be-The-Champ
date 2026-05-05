import React, { useState, useEffect } from 'react';
import { Users, DollarSign, MousePointer2, CheckCircle, Clock, Award, Loader2, ChevronDown } from 'lucide-react';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_STYLES = {
  PENDING:  'border-ivory/20 text-ivory/50 bg-white/[0.03]',
  APPROVED: 'border-gold/40 text-gold bg-gold/10',
  PAID:     'border-emerald-500/40 text-emerald-400 bg-emerald-900/20',
};

const AdminAffiliateList = () => {
  const [tab, setTab] = useState('affiliates');
  const [affiliates, setAffiliates] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [affRes, commRes] = await Promise.all([
        api.get('/affiliate/admin/list'),
        api.get('/affiliate/admin/commissions'),
      ]);
      if (affRes.data.success) setAffiliates(affRes.data.data);
      if (commRes.data.success) setCommissions(commRes.data.data);
    } catch (err) {
      console.error('Failed to fetch affiliate data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (commissionId, newStatus) => {
    setUpdatingId(commissionId);
    try {
      await api.patch(`/affiliate/admin/commissions/${commissionId}`, { status: newStatus });
      setCommissions(prev => prev.map(c => c.id === commissionId ? { ...c, status: newStatus } : c));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCommissions = statusFilter === 'ALL'
    ? commissions
    : commissions.filter(c => c.status === statusFilter);

  const totalPending = commissions.filter(c => c.status === 'PENDING').reduce((s, c) => s + parseFloat(c.commission), 0);
  const totalPaid = commissions.filter(c => c.status === 'PAID').reduce((s, c) => s + parseFloat(c.commission), 0);
  const totalAll = commissions.reduce((s, c) => s + parseFloat(c.commission), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-cinzel text-3xl text-white uppercase tracking-[4px]">Affiliate Program</h1>
        <p className="text-gold/60 text-xs mt-2 uppercase tracking-widest">Manage affiliates, commissions & payouts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <SummaryCard icon={Users} label="Total Affiliates" value={affiliates.length} />
        <SummaryCard icon={DollarSign} label="All Commissions" value={`$${totalAll.toFixed(2)}`} />
        <SummaryCard icon={Clock} label="Pending Payout" value={`$${totalPending.toFixed(2)}`} color="text-yellow-400" />
        <SummaryCard icon={CheckCircle} label="Total Paid Out" value={`$${totalPaid.toFixed(2)}`} color="text-emerald-400" />
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gold/10">
        {['affiliates', 'commissions'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-cinzel text-[10px] uppercase tracking-[3px] px-8 py-4 border-b-2 transition-all ${
              tab === t ? 'border-gold text-gold' : 'border-transparent text-ivory/40 hover:text-ivory/70'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 size={36} className="text-gold animate-spin" />
          <p className="text-gold/40 text-[10px] uppercase tracking-widest">Loading affiliate data...</p>
        </div>
      ) : (
        <>
          {/* Affiliates Tab */}
          {tab === 'affiliates' && (
            <div className="bg-surface border border-gold/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/40 border-b border-gold/10">
                      <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel">Affiliate</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel">Code</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel text-center">Clicks</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel text-center">Referrals</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel text-right">Total Earned</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel text-right">Pending</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel text-right">Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/5">
                    {affiliates.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-8 py-20 text-center text-gold/40 text-[10px] uppercase tracking-widest">
                          No affiliates yet
                        </td>
                      </tr>
                    ) : affiliates.map(a => (
                      <tr key={a.id} className="hover:bg-gold/[0.02] transition-colors">
                        <td className="px-8 py-5">
                          <div>
                            <p className="text-white font-cinzel text-xs tracking-wider">{a.name}</p>
                            <p className="text-ivory/40 text-[10px] font-raleway mt-0.5">{a.email}</p>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <code className="text-[10px] bg-black/40 text-gold/70 px-2 py-1 border border-gold/10 uppercase tracking-widest">
                            {a.affiliateCode}
                          </code>
                        </td>
                        <td className="px-8 py-5 text-center text-ivory font-mono">{a.affiliateClicks}</td>
                        <td className="px-8 py-5 text-center text-ivory font-mono">{a.referralCount}</td>
                        <td className="px-8 py-5 text-right text-gold font-mono font-bold">${a.totalEarned}</td>
                        <td className="px-8 py-5 text-right font-mono text-yellow-400">${a.pendingAmount}</td>
                        <td className="px-8 py-5 text-right font-mono text-emerald-400">${a.paidAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Commissions Tab */}
          {tab === 'commissions' && (
            <div className="space-y-4">
              {/* Filter */}
              <div className="flex gap-2">
                {['ALL', 'PENDING', 'APPROVED', 'PAID'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`font-cinzel text-[9px] uppercase tracking-widest px-4 py-2 border transition-all ${
                      statusFilter === s ? 'bg-gold text-black border-gold font-black' : 'border-gold/20 text-ivory/50 hover:border-gold/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="bg-surface border border-gold/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/40 border-b border-gold/10">
                        <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel">Date</th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel">Affiliate</th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel">Code</th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel">Order</th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel text-right">Sale</th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel text-right">Commission (15%)</th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel text-center">Status</th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-[2px] text-gold font-cinzel text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5">
                      {filteredCommissions.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-8 py-20 text-center text-gold/40 text-[10px] uppercase tracking-widest">
                            No commissions found
                          </td>
                        </tr>
                      ) : filteredCommissions.map(c => (
                        <tr key={c.id} className="hover:bg-gold/[0.02] transition-colors">
                          <td className="px-8 py-5 text-[10px] text-ivory/50 font-raleway whitespace-nowrap">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-5">
                            <div>
                              <p className="text-white font-cinzel text-xs tracking-wider">{c.affiliateName}</p>
                              <p className="text-ivory/40 text-[10px] font-raleway mt-0.5">{c.affiliateEmail}</p>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <code className="text-[10px] text-gold/60 bg-black/40 px-2 py-1 border border-gold/10">
                              {c.affiliateCode}
                            </code>
                          </td>
                          <td className="px-8 py-5">
                            <code className="text-[10px] text-ivory/50">{c.orderId.slice(0, 8)}...</code>
                          </td>
                          <td className="px-8 py-5 text-right font-mono text-ivory text-sm">${c.orderAmount}</td>
                          <td className="px-8 py-5 text-right font-mono text-gold font-bold text-sm">${c.commission}</td>
                          <td className="px-8 py-5 text-center">
                            <span className={`text-[9px] px-2 py-1 font-cinzel uppercase tracking-widest border ${STATUS_STYLES[c.status]}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-center">
                            {updatingId === c.id ? (
                              <Loader2 size={14} className="animate-spin text-gold mx-auto" />
                            ) : (
                              <div className="flex justify-center gap-2">
                                {c.status === 'PENDING' && (
                                  <button
                                    onClick={() => handleStatusChange(c.id, 'APPROVED')}
                                    className="text-[9px] font-cinzel uppercase tracking-widest px-3 py-1.5 border border-gold/30 text-gold hover:bg-gold/10 transition-all"
                                  >
                                    Approve
                                  </button>
                                )}
                                {c.status === 'APPROVED' && (
                                  <button
                                    onClick={() => handleStatusChange(c.id, 'PAID')}
                                    className="text-[9px] font-cinzel uppercase tracking-widest px-3 py-1.5 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/20 transition-all"
                                  >
                                    Mark Paid
                                  </button>
                                )}
                                {c.status === 'PAID' && (
                                  <span className="text-[9px] text-emerald-400/50 font-cinzel uppercase">Paid ✓</span>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const SummaryCard = ({ icon: Icon, label, value, color = 'text-gold' }) => (
  <div className="bg-surface border border-gold/10 p-6 hover:border-gold/30 transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-gold/5 border border-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all flex-shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[9px] text-ivory/40 uppercase tracking-widest font-cinzel">{label}</p>
        <p className={`text-xl font-mono font-bold mt-0.5 ${color}`}>{value}</p>
      </div>
    </div>
  </div>
);

export default AdminAffiliateList;
