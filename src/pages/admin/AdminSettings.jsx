import React, { useState, useEffect } from 'react';
import { Save, CreditCard, Globe, Package, DollarSign, Mail, Phone, MapPin } from 'lucide-react';
import api from '../../utils/api';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // Payment Settings
    stripe_enabled: true,
    paypal_enabled: false,
    cod_enabled: true,
    
    // Store Settings
    store_name: 'You Be The Champ',
    store_email: 'info@youbethechamp.com.au',
    store_phone: '+1-555-0123',
    store_address: '123 Championship Lane, Victory City, VC 12345',
    
    // Pricing Settings (AUD Fixed, Free Shipping)
    currency: 'AUD',
    tax_rate: '10',
    
    // Feature Settings
    maintenance_mode: false,
    enable_reviews: true,
    enable_wishlist: true,
    enable_guest_checkout: true,
    show_stock_quantity: true,
    show_product_badges: true,
    enable_quick_view: true,
    
    // Display Settings
    products_per_page: '12',
    enable_dark_mode: true,
    show_breadcrumbs: true,
    
    // Social Settings
    social_facebook: 'https://facebook.com/youbethechamp',
    social_twitter: 'https://twitter.com/youbethechamp',
    social_instagram: 'https://instagram.com/youbethechamp'
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await api.post('/settings/update', { settings });
      if (response.data.success) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Failed to save settings');
      }
    } catch (error) {
      setMessage('Error saving settings');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      try {
        const response = await api.post('/settings/reset');
        if (response.data.success) {
          fetchSettings();
          setMessage('Settings reset to defaults');
        }
      } catch (error) {
        setMessage('Error resetting settings');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-cinzel text-3xl font-bold text-white tracking-widest uppercase">Settings</h2>
        <p className="text-ivory/60 mt-2">Configure your store's global parameters.</p>
      </header>

      {message && (
        <div className={`p-4 rounded-lg text-center ${message.includes('success') ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Settings */}
        <div className="space-y-8">
          <section className="bg-surface border border-gold/10 p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-gold/10 pb-4">
              <CreditCard className="text-gold" size={20} />
              <h3 className="font-cinzel text-lg text-gold uppercase tracking-widest">Payment Methods</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Stripe</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Credit card payments</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-10 h-5 accent-gold cursor-pointer" 
                  checked={settings.stripe_enabled}
                  onChange={(e) => updateSetting('stripe_enabled', e.target.checked)}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-sm text-white">PayPal</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">PayPal payments</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-10 h-5 accent-gold cursor-pointer" 
                  checked={settings.paypal_enabled}
                  onChange={(e) => updateSetting('paypal_enabled', e.target.checked)}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-sm text-white">Cash on Delivery</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Pay on delivery</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-10 h-5 accent-gold cursor-pointer" 
                  checked={settings.cod_enabled}
                  onChange={(e) => updateSetting('cod_enabled', e.target.checked)}
                />
              </div>
            </div>
          </section>

          {/* Pricing Settings */}
          <section className="bg-surface border border-gold/10 p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-gold/10 pb-4">
              <DollarSign className="text-gold" size={20} />
              <h3 className="font-cinzel text-lg text-gold uppercase tracking-widest">Pricing</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Currency</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Fixed to AUD</p>
                </div>
                <span className="px-3 py-1 bg-gold/20 text-gold rounded-lg text-xs font-bold">AUD</span>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-sm text-white">Shipping</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Always free</p>
                </div>
                <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-lg text-xs font-bold">FREE</span>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Tax Rate (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full bg-black border border-white/10 rounded-lg py-2 px-4 text-white focus:border-gold outline-none transition-colors"
                  value={settings.tax_rate}
                  onChange={(e) => updateSetting('tax_rate', e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Store & Feature Settings */}
        <div className="space-y-8">
          {/* Store Information */}
          <section className="bg-surface border border-gold/10 p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-gold/10 pb-4">
              <Globe className="text-gold" size={20} />
              <h3 className="font-cinzel text-lg text-gold uppercase tracking-widest">Store Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Store Name</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-white/10 rounded-lg py-2 px-4 text-white focus:border-gold outline-none transition-colors"
                  value={settings.store_name}
                  onChange={(e) => updateSetting('store_name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-black border border-white/10 rounded-lg py-2 px-4 text-white focus:border-gold outline-none transition-colors"
                  value={settings.store_email}
                  onChange={(e) => updateSetting('store_email', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Phone</label>
                <input 
                  type="tel" 
                  className="w-full bg-black border border-white/10 rounded-lg py-2 px-4 text-white focus:border-gold outline-none transition-colors"
                  value={settings.store_phone}
                  onChange={(e) => updateSetting('store_phone', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Address</label>
                <textarea 
                  className="w-full bg-black border border-white/10 rounded-lg py-2 px-4 text-white focus:border-gold outline-none transition-colors resize-none"
                  rows={2}
                  value={settings.store_address}
                  onChange={(e) => updateSetting('store_address', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Feature Settings */}
          <section className="bg-surface border border-gold/10 p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-gold/10 pb-4">
              <Package className="text-gold" size={20} />
              <h3 className="font-cinzel text-lg text-gold uppercase tracking-widest">Store Features</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Maintenance Mode</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Disable store access</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-10 h-5 accent-gold cursor-pointer" 
                  checked={settings.maintenance_mode}
                  onChange={(e) => updateSetting('maintenance_mode', e.target.checked)}
                />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-sm text-white">Customer Reviews</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Allow product reviews</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-10 h-5 accent-gold cursor-pointer" 
                  checked={settings.enable_reviews}
                  onChange={(e) => updateSetting('enable_reviews', e.target.checked)}
                />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-sm text-white">Wishlist</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Enable wishlist feature</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-10 h-5 accent-gold cursor-pointer" 
                  checked={settings.enable_wishlist}
                  onChange={(e) => updateSetting('enable_wishlist', e.target.checked)}
                />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-sm text-white">Guest Checkout</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Allow checkout without account</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-10 h-5 accent-gold cursor-pointer" 
                  checked={settings.enable_guest_checkout}
                  onChange={(e) => updateSetting('enable_guest_checkout', e.target.checked)}
                />
              </div>
            </div>
          </section>

          {/* Display Settings */}
          <section className="bg-surface border border-gold/10 p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-gold/10 pb-4">
              <Globe className="text-gold" size={20} />
              <h3 className="font-cinzel text-lg text-gold uppercase tracking-widest">Display Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ivory/40 mb-2">Products Per Page</label>
                <select 
                  className="w-full bg-black border border-white/10 rounded-lg py-2 px-4 text-white focus:border-gold outline-none transition-colors"
                  value={settings.products_per_page}
                  onChange={(e) => updateSetting('products_per_page', e.target.value)}
                >
                  <option value="12">12 Products</option>
                  <option value="24">24 Products</option>
                  <option value="36">36 Products</option>
                  <option value="48">48 Products</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-sm text-white">Show Stock Quantity</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Display stock on product pages</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-10 h-5 accent-gold cursor-pointer" 
                  checked={settings.show_stock_quantity}
                  onChange={(e) => updateSetting('show_stock_quantity', e.target.checked)}
                />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-sm text-white">Product Badges</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Show NEW/SALE badges</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-10 h-5 accent-gold cursor-pointer" 
                  checked={settings.show_product_badges}
                  onChange={(e) => updateSetting('show_product_badges', e.target.checked)}
                />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-sm text-white">Quick View</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Enable quick product preview</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-10 h-5 accent-gold cursor-pointer" 
                  checked={settings.enable_quick_view}
                  onChange={(e) => updateSetting('enable_quick_view', e.target.checked)}
                />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-sm text-white">Breadcrumbs</p>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Show navigation breadcrumbs</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-10 h-5 accent-gold cursor-pointer" 
                  checked={settings.show_breadcrumbs}
                  onChange={(e) => updateSetting('show_breadcrumbs', e.target.checked)}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-gold text-black py-3 px-6 rounded-lg font-cinzel text-xs tracking-widest uppercase font-bold hover:scale-[1.02] transition-transform disabled:opacity-50"
        >
          <Save size={16} /> {loading ? 'Saving...' : 'Save Settings'}
        </button>
        
        <button 
          onClick={handleReset}
          className="flex items-center justify-center gap-2 bg-red-900/50 text-red-400 border border-red-800 py-3 px-6 rounded-lg font-cinzel text-xs tracking-widest uppercase font-bold hover:bg-red-900/70 transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
