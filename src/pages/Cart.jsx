import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useCartStore } from '../store/useCartStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Ticket, Check, AlertCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';

const Cart = () => {
  const { items, removeItem, updateQty, getTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponSuccess, setCouponSuccess] = useState('');

  // Version check
  console.log('🛒 Cart page loaded - Coupon System v1.0 ACTIVE');

  const subtotal = getTotal();
  const total = subtotal - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const response = await api.post('/coupons/validate', {
        code: couponCode.toUpperCase(),
        cartTotal: subtotal
      });

      if (response.data.success) {
        setAppliedCoupon(response.data.data.code);
        setDiscountAmount(response.data.data.discountAmount);
        setCouponSuccess(`Coupon applied! You saved $${response.data.data.discountAmount.toFixed(2)}`);
        setCouponCode('');
      } else {
        setCouponError(response.data.message || 'Invalid coupon');
      }
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    setCouponError('');
    setCouponSuccess('');
  };

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-8 pt-40 pb-24">
        <h1 className="text-4xl font-black font-cinzel text-gold tracking-widest uppercase mb-12">Shopping Collection</h1>

        {items.length === 0 ? (
          <div className="py-24 text-center bg-card border border-gold/10 p-12">
            <ShoppingBag className="text-gold/20 mx-auto mb-6" size={64} />
            <h2 className="text-xl font-cinzel text-ivory mb-4 uppercase tracking-widest">Your collection is empty</h2>
            <Link to="/shop">
              <Button>Browse All Rings</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items Column */}
            <div className="lg:col-span-2 space-y-6">
              {items.map(item => (
                <div key={item.id} className="bg-card border border-gold/10 p-6 flex flex-col sm:flex-row gap-6 hover:border-gold/30 transition-colors">
                  <div className="w-32 h-32 bg-black border border-gold/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img 
                      src={item.images?.[0]?.url || item.images?.[0] || item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Link to={`/product/${item.id}`} className="font-cinzel text-lg font-bold text-white hover:text-gold transition-colors uppercase leading-tight">
                          {item.name}
                        </Link>
                        <button onClick={() => removeItem(item.id)} className="text-ivory/30 hover:text-crimson transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <p className="text-xs text-ivory/50 font-raleway uppercase tracking-[1px]">{item.sport} • {item.year}</p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border border-gold/20">
                        <button 
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="px-3 py-2 hover:text-gold transition-colors"
                        ><Minus size={14}/></button>
                        <span className="px-6 font-mono text-gold font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="px-3 py-2 hover:text-gold transition-colors"
                        ><Plus size={14}/></button>
                      </div>
                      <span className="text-xl font-mono font-bold text-gold">${(Number(item.price) * item.quantity).toFixed(2)} AUD</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link to="/shop" className="inline-flex items-center gap-2 text-gold text-xs font-cinzel hover:translate-x-[-4px] transition-transform uppercase tracking-widest mt-4">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-gold/20 p-8 space-y-8 sticky top-32">
                <h3 className="font-cinzel text-lg font-bold text-gold tracking-widest uppercase pb-4 border-b border-gold/10">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-ivory/60 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="font-mono text-ivory">${subtotal.toFixed(2)} AUD</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-400 uppercase tracking-widest bg-emerald-900/20 p-3 rounded border border-emerald-500/20">
                      <span>Discount</span>
                      <span className="font-mono font-bold">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-ivory/60 uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-gold">Free</span>
                  </div>
                  <div className="flex justify-between text-xs text-ivory/60 uppercase tracking-widest">
                    <span>Tax</span>
                    <span className="font-mono text-ivory">$0.00</span>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="pt-6 border-t border-gold/20 space-y-3">
                  {appliedCoupon ? (
                    <div className="bg-gold/10 border border-gold/30 rounded p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check size={16} className="text-emerald-400" />
                          <span className="text-xs font-cinzel font-bold text-gold uppercase">Coupon Applied</span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-[10px] text-ivory/50 hover:text-crimson transition-colors underline uppercase font-cinzel"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-sm font-mono font-bold text-ivory">{appliedCoupon}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-cinzel text-gold/60 uppercase tracking-widest block">🎟️ Have a Coupon?</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError('');
                          }}
                          placeholder="Enter code"
                          className="flex-1 bg-black border border-gold/20 px-4 py-2 text-xs text-ivory font-mono uppercase placeholder:text-ivory/20 focus:border-gold outline-none transition-colors"
                          onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                          className="px-4 py-2 bg-gold/20 hover:bg-gold/30 border border-gold/40 text-gold text-[10px] font-cinzel uppercase font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                        >
                          {couponLoading ? <Loader2 size={12} className="animate-spin" /> : <Ticket size={12} />}
                          Apply
                        </button>
                      </div>
                    </div>
                  )}

                  {couponError && (
                    <div className="bg-crimson/10 border border-crimson/30 rounded p-3 flex items-start gap-2">
                      <AlertCircle size={14} className="text-crimson flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-crimson uppercase font-cinzel">{couponError}</p>
                    </div>
                  )}

                  {couponSuccess && (
                    <div className="bg-emerald-900/20 border border-emerald-500/40 rounded p-3 flex items-start gap-2">
                      <Check size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-emerald-400 uppercase font-cinzel">{couponSuccess}</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gold/20 flex justify-between items-end">
                  <span className="font-cinzel text-sm font-bold text-gold uppercase tracking-widest">Total (AUD)</span>
                  <span className="font-mono text-3xl font-bold text-gold">${total.toFixed(2)} AUD</span>
                </div>

                <Link to="/checkout" className="block w-full pt-4">
                  <Button className="w-full py-5">Proceed to Checkout</Button>
                </Link>

                <div className="pt-6 space-y-4">
                   <p className="text-[10px] text-ivory/40 uppercase tracking-[1px] text-center">Accepted Payments</p>
                   <div className="flex justify-center gap-3 opacity-30 grayscale">
                      <div className="h-6 w-10 bg-ivory/20 rounded" />
                      <div className="h-6 w-10 bg-ivory/20 rounded" />
                      <div className="h-6 w-10 bg-ivory/20 rounded" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
