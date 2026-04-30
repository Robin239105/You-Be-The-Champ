import React from 'react';
import { Save, Lock, CreditCard, Bell, Globe } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-cinzel text-3xl font-bold text-white tracking-widest uppercase">Settings</h2>
        <p className="text-ivory/60 mt-2">Configure your platform's global parameters.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Gateways */}
        <div className="space-y-8">
          <section className="bg-surface border border-gold/10 p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-gold/10 pb-4">
              <CreditCard className="text-gold" size={20} />
              <h3 className="font-cinzel text-lg text-gold uppercase tracking-widest">Payment Integration</h3>
            </div>
            
            <div className="space-y-6">
              {/* Stripe */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Stripe</h4>
                  <input type="checkbox" className="w-10 h-5 accent-gold cursor-pointer" defaultChecked />
                </div>
                <div className="space-y-4 pl-4 border-l border-white/5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Publishable Key</label>
                    <input 
                      type="text" 
                      className="w-full bg-black border border-white/10 rounded-lg py-2 px-4 text-white focus:border-gold outline-none transition-colors font-mono text-xs"
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Secret Key</label>
                    <input 
                      type="password" 
                      className="w-full bg-black border border-white/10 rounded-lg py-2 px-4 text-white focus:border-gold outline-none transition-colors font-mono text-xs"
                      placeholder="••••••••••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* PayPal */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">PayPal</h4>
                  <input type="checkbox" className="w-10 h-5 accent-gold cursor-pointer" />
                </div>
                <div className="space-y-4 pl-4 border-l border-white/5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Client ID</label>
                    <input 
                      type="text" 
                      className="w-full bg-black border border-white/10 rounded-lg py-2 px-4 text-white focus:border-gold outline-none transition-colors font-mono text-xs"
                      placeholder="PayPal Client ID"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Secret</label>
                    <input 
                      type="password" 
                      className="w-full bg-black border border-white/10 rounded-lg py-2 px-4 text-white focus:border-gold outline-none transition-colors font-mono text-xs"
                      placeholder="••••••••••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full flex items-center justify-center gap-2 bg-gold text-black py-3 rounded-lg font-cinzel text-xs tracking-widest uppercase font-bold hover:scale-[1.02] transition-transform mt-4">
              <Save size={16} /> Save Payment Config
            </button>
          </section>
        </div>

        {/* Other Settings */}
        <div className="space-y-8">
          <section className="bg-surface border border-gold/10 p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-gold/10 pb-4">
              <Lock className="text-gold" size={20} />
              <h3 className="font-cinzel text-lg text-gold uppercase tracking-widest">Security Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Maintenance Mode</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Disable frontend access for customers</p>
                </div>
                <input type="checkbox" className="w-10 h-5 accent-gold cursor-pointer" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-sm text-white">Require Email Verification</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">New users must verify their email</p>
                </div>
                <input type="checkbox" className="w-10 h-5 accent-gold cursor-pointer" defaultChecked />
              </div>
            </div>
          </section>

          <section className="bg-surface border border-gold/10 p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-gold/10 pb-4">
              <Globe className="text-gold" size={20} />
              <h3 className="font-cinzel text-lg text-gold uppercase tracking-widest">Store Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Support Email</label>
                <input 
                  type="email" 
                  className="w-full bg-black border border-white/10 rounded-lg py-2 px-4 text-white focus:border-gold outline-none transition-colors"
                  defaultValue="support@youbethechamp.com"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">VAT / Tax ID</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-white/10 rounded-lg py-2 px-4 text-white focus:border-gold outline-none transition-colors"
                  placeholder="Optional"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
