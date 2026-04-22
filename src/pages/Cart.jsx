import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useCartStore } from '../store/useCartStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { items, removeItem, updateQty, getTotal } = useCartStore();

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
                  <div className="w-32 h-32 bg-black border border-gold/10 flex items-center justify-center flex-shrink-0">
                     <svg className="w-16 h-16 text-gold/20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l2.4 7.4h7.6l-6.1 4.5 2.3 7.1-6.2-4.4-6.2 4.4 2.3-7.1-6.1-4.5h7.6z" />
                      </svg>
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
                      <span className="text-xl font-mono font-bold text-gold">${(item.price * item.quantity).toFixed(2)}</span>
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
                    <span className="font-mono text-ivory">${getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-ivory/60 uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-gold">Free</span>
                  </div>
                  <div className="flex justify-between text-xs text-ivory/60 uppercase tracking-widest">
                    <span>Tax</span>
                    <span className="font-mono text-ivory">$0.00</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gold/20 flex justify-between items-end">
                  <span className="font-cinzel text-sm font-bold text-gold uppercase tracking-widest">Total</span>
                  <span className="font-mono text-3xl font-bold text-gold">${getTotal().toFixed(2)}</span>
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
