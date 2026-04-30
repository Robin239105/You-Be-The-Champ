import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, ChevronRight, Lock, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';

const Checkout = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', address: '', city: '', state: '', zip: '', phone: ''
  });
  const [error, setError] = useState('');

  const { items, getTotal, clearCart } = useCartStore();
  const addOrder = useOrderStore(state => state.addOrder);

  const shippingCost = shippingMethod === 'express' ? 25 : 0;
  const finalTotal = getTotal() + shippingCost;

  const validateStep1 = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zip', 'phone'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(step + 1);
  };

  const handlePlaceOrder = () => {
    const orderId = `YBTC-${Math.floor(Math.random() * 1000000)}`;
    addOrder({
      orderId,
      formData,
      items,
      shippingMethod,
      finalTotal
    });
    return orderId;
  };

  const steps = [
    { id: 1, name: 'Shipping', icon: Truck },
    { id: 2, name: 'Payment', icon: CreditCard },
    { id: 3, name: 'Review', icon: ShieldCheck },
  ];

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-8 pt-40 pb-24">
        {/* Stepper */}
        <div className="max-w-3xl mx-auto mb-20 flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gold/10 -translate-y-1/2 z-0" />
          {steps.map((s, i) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-4">
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${step >= s.id ? 'bg-gold border-gold text-black scale-110 shadow-[0_0_20px_rgba(201,168,76,0.5)]' : 'bg-surface border-gold/20 text-gold/40'}`}>
                <s.icon size={20} />
              </div>
              <span className={`font-cinzel text-[10px] tracking-widest uppercase ${step >= s.id ? 'text-gold font-bold' : 'text-ivory/30'}`}>{s.name}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                  <section>
                    <h2 className="text-xl font-cinzel font-bold text-gold tracking-widest uppercase mb-8 flex items-center gap-3">
                      <span className="text-gold/20">01</span> Shipping Information
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                      <Input label="First Name" placeholder="John" value={formData.firstName} onChange={(v) => setFormData({...formData, firstName: v})} />
                      <Input label="Last Name" placeholder="Doe" value={formData.lastName} onChange={(v) => setFormData({...formData, lastName: v})} />
                      <Input label="Email Address" placeholder="john@example.com" full value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                      <Input label="Shipping Address" placeholder="123 Champion St" full value={formData.address} onChange={(v) => setFormData({...formData, address: v})} />
                      <Input label="City" placeholder="Los Angeles" value={formData.city} onChange={(v) => setFormData({...formData, city: v})} />
                      <Input label="State/Province" placeholder="CA" value={formData.state} onChange={(v) => setFormData({...formData, state: v})} />
                      <Input label="ZIP/Postal Code" placeholder="90001" value={formData.zip} onChange={(v) => setFormData({...formData, zip: v})} />
                      <Input label="Phone Number" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-cinzel font-bold text-ivory/60 uppercase tracking-widest mb-6">Shipping Method</h3>
                    <div className="space-y-4">
                      <ShippingOption 
                        title="Standard Shipping" 
                        time="5-10 Business Days" 
                        price="Free" 
                        active={shippingMethod === 'standard'} 
                        onClick={() => setShippingMethod('standard')}
                      />
                      <ShippingOption 
                        title="Express Shipping" 
                        time="2-3 Business Days" 
                        price="$25.00 AUD" 
                        active={shippingMethod === 'express'} 
                        onClick={() => setShippingMethod('express')}
                      />
                    </div>
                  </section>
                  
                  <div className="pt-8 space-y-4">
                    {error && <p className="text-crimson text-[10px] uppercase tracking-widest font-bold">{error}</p>}
                    <Button onClick={handleNextStep} className="w-full sm:w-auto">Continue to Payment <ChevronRight size={16} className="inline ml-2"/></Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                   <section>
                    <h2 className="text-xl font-cinzel font-bold text-gold tracking-widest uppercase mb-8 flex items-center gap-3">
                      <span className="text-gold/20">02</span> Secure Payment
                    </h2>
                    <div className="bg-card border border-gold/20 p-8 space-y-8">
                      <div className="flex gap-4 mb-4 opacity-50">
                        <div className="h-8 w-12 bg-ivory/20 rounded-md" />
                        <div className="h-8 w-12 bg-ivory/20 rounded-md" />
                        <div className="h-8 w-12 bg-ivory/20 rounded-md" />
                      </div>
                      <Input label="Card Number" placeholder="0000 0000 0000 0000" full />
                      <div className="grid grid-cols-2 gap-6">
                         <Input label="Expiry Date" placeholder="MM/YY" />
                         <Input label="CVV" placeholder="123" />
                      </div>
                      <Input label="Name on Card" placeholder="JOHN DOE" full />
                    </div>
                  </section>
                  
                  <div className="flex gap-6">
                    <button onClick={() => setStep(1)} className="text-ivory/40 hover:text-gold font-cinzel text-xs tracking-widest uppercase">← Back</button>
                    <Button onClick={() => setStep(3)} className="flex-1">Review Order</Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                   <section>
                    <h2 className="text-xl font-cinzel font-bold text-gold tracking-widest uppercase mb-8 flex items-center gap-3">
                      <span className="text-gold/20">03</span> Review & Confirm
                    </h2>
                    <div className="bg-card border border-gold/20 p-8 space-y-6">
                      <div className="flex justify-between items-center pb-6 border-b border-gold/10">
                         <div>
                            <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">Shipping to</p>
                            <p className="text-xs text-ivory">{formData.firstName} {formData.lastName}, {formData.address}, {formData.city}, {formData.state}</p>
                         </div>
                         <button onClick={() => setStep(1)} className="text-gold text-[10px] underline uppercase">Edit</button>
                      </div>
                      <div className="flex justify-between items-center">
                         <div>
                            <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">Payment Method</p>
                            <p className="text-xs text-ivory font-mono">VISA Ending in 4242</p>
                         </div>
                         <button onClick={() => setStep(2)} className="text-gold text-[10px] underline uppercase">Edit</button>
                      </div>
                    </div>
                  </section>
                  
                  <div className="bg-gold/5 border border-gold/20 p-6 flex flex-col gap-4">
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          required 
                          className="w-4 h-4 accent-gold bg-black border border-gold/30 rounded-none cursor-pointer" 
                        />
                        <span className="text-[10px] text-ivory/60 uppercase tracking-widest">I agree to the Terms of Service and Privacy Policy</span>
                     </label>
                  </div>

                  <div className="flex gap-6">
                    <button onClick={() => setStep(2)} className="text-ivory/40 hover:text-gold font-cinzel text-xs tracking-widest uppercase">← Back</button>
                    {!isAuthenticated ? (
                      <div className="flex-1 space-y-6">
                        <div className="text-center p-8 bg-gold/5 border border-gold/10 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Lock size={80} className="text-gold" />
                          </div>
                          <p className="text-[10px] text-gold font-black font-cinzel uppercase tracking-[3px] mb-4">Champions Identity Required</p>
                          <p className="text-ivory/40 text-[10px] uppercase tracking-widest leading-relaxed mb-8">
                            To secure your championship ring and access the archive, you must be a registered member.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                            <Link to="/account/login" className="flex-1">
                               <Button variant="outline" className="w-full py-4 text-[10px] uppercase tracking-widest font-bold">Sign In</Button>
                            </Link>
                            <Link to="/account/register" className="flex-1">
                               <Button className="w-full py-4 text-[10px] uppercase tracking-widest font-bold">Join The Club</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        disabled={isLoading}
                        onClick={async () => {
                          setIsLoading(true);
                          try {
                            const response = await api.post('/orders', {
                              cartItems: items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
                              totalAmount: finalTotal,
                              shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
                              paymentMethod: 'Credit Card (Mock)'
                            });
                            
                            if (response.data.success) {
                              clearCart();
                              navigate('/order-confirmation', { 
                                state: { 
                                  formData, 
                                  items, 
                                  shippingMethod, 
                                  finalTotal, 
                                  orderId: response.data.data.id 
                                } 
                              });
                            }
                          } catch (error) {
                            setError(error.response?.data?.message || 'Failed to place order');
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        className="flex-1 py-6 uppercase tracking-[3px] text-xs font-bold"
                      >
                        {isLoading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Lock size={16} className="mr-2" />}
                        {isLoading ? 'Securing Transaction...' : `Complete Purchase — $${finalTotal.toFixed(2)} AUD`}
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
             <div className="bg-surface border border-gold/10 p-8 space-y-8 sticky top-32">
                <h3 className="font-cinzel text-sm font-bold text-gold tracking-widest uppercase pb-4 border-b border-gold/10">Your Selection</h3>
                <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                   {items.map(item => (
                     <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 bg-black border border-gold/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                           <img 
                             src={item.images?.[0]} 
                             alt={item.name} 
                             className="w-full h-full object-cover"
                           />
                        </div>
                        <div className="flex-1">
                           <p className="font-cinzel text-[10px] font-bold text-ivory uppercase leading-tight">{item.name}</p>
                           <p className="text-[9px] text-ivory/40 font-raleway uppercase mt-1">QTY: {item.quantity} • ${item.price.toFixed(2)} AUD</p>
                        </div>
                     </div>
                   ))}
                </div>
                
                <div className="pt-6 border-t border-gold/10 space-y-3">
                  <div className="flex justify-between text-xs text-ivory/60 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="font-mono text-ivory">${getTotal().toFixed(2)} AUD</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-ivory/40 uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-gold">{shippingMethod === 'express' ? '$25.00 AUD' : 'Free'}</span>
                  </div>
                    <div className="flex justify-between text-sm font-bold text-gold font-cinzel uppercase tracking-widest pt-4 border-t border-gold/10">
                       <span>Total (AUD)</span>
                       <span className="font-mono">${finalTotal.toFixed(2)} AUD</span>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Input = ({ label, placeholder, full = false, value = '', onChange = () => {} }) => (
  <div className={full ? 'col-span-2' : ''}>
    <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest mb-2">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-surface border border-gold/20 px-4 py-3 font-raleway text-sm text-ivory outline-none focus:border-gold transition-colors placeholder:text-ivory/10"
    />
  </div>
);

const ShippingOption = ({ title, time, price, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-4 border cursor-pointer transition-all flex justify-between items-center ${active ? 'border-gold bg-gold/5' : 'border-gold/10 hover:border-gold/40'}`}
  >
     <div className="flex items-center gap-4">
        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${active ? 'border-gold' : 'border-gold/20'}`}>
           {active && <div className="w-2 h-2 bg-gold rounded-full" />}
        </div>
        <div>
           <p className="font-cinzel text-xs font-bold text-ivory uppercase">{title}</p>
           <p className="text-[10px] text-ivory/40 uppercase tracking-widest">{time}</p>
        </div>
     </div>
     <span className="font-mono text-sm text-gold font-bold">{price}</span>
  </div>
);

export default Checkout;
