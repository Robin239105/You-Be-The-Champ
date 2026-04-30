import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Calendar, Loader2, Award } from 'lucide-react';
import api from '../../utils/api';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/auth/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-cinzel text-3xl font-bold text-white tracking-widest uppercase">Customers</h2>
        <p className="text-ivory/60 mt-2">Manage your <span className="text-gold">{users.length}</span> registered users.</p>
      </header>

      <div className="bg-surface p-4 rounded-xl border border-gold/10 relative">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-ivory/30" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or email..."
          className="w-full bg-black border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-gold outline-none transition-colors font-raleway text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Affiliate ID</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/20">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-white font-bold">{user.firstName} {user.lastName}</p>
                          <p className="text-[10px] text-ivory/40 uppercase tracking-widest">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ivory/80 font-raleway flex items-center gap-2">
                      <Mail size={14} className="text-gold/40" />
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        user.role === 'ADMIN' ? 'bg-gold text-black' : 'bg-white/5 text-ivory/60'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-ivory/40 flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.affiliateId ? (
                        <div className="flex items-center gap-2 text-gold">
                          <Award size={14} />
                          <span className="font-mono text-xs">{user.affiliateId}</span>
                        </div>
                      ) : (
                        <span className="text-ivory/20">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-20 text-center font-cinzel text-xs text-ivory/20 uppercase tracking-widest">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserList;
