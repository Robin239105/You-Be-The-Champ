import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useCartStore } from '../store/useCartStore';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const { items, getTotal } = useCartStore();

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
                      <Input label="First Name" placeholder="John" />
                      <Input label="Last Name" placeholder="Doe" />
                      <Input label="Email Address" placeholder="john@example.com" full />
                      <Input label="Shipping Address" placeholder="123 Champion St" full />
                      <Input label="City" placeholder="Los Angeles" />
                      <Input label="State/Province" placeholder="CA" />
                      <Input label="ZIP/Postal Code" placeholder="90001" />
                      <Input label="Phone Number" placeholder="+1 (555) 000-0000" />
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-cinzel font-bold text-ivory/60 uppercase tracking-widest mb-6">Shipping Method</h3>
                    <div className="space-y-4">
                      <ShippingOption title="Standard Shipping" time="5-10 Business Days" price="Free" active />
                      <ShippingOption title="Express Shipping" time="2-3 Business Days" price="$25.00" />
                    </div>
                  </section>
                  
                  <div className="pt-8">
                    <Button onClick={() => setStep(2)} className="w-full sm:w-auto">Continue to Payment <ChevronRight size={16} className="inline ml-2"/></Button>
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
                            <p className="text-xs text-ivory">John Doe, 123 Champion St, Los Angeles, CA</p>
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
                    <Link to="/order-confirmation" className="flex-1">
                      <Button className="w-full flex items-center justify-center gap-3">
                        <Lock size={16} /> Place Order - ${getTotal().toFixed(2)}
                      </Button>
                    </Link>
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
                        <div className="w-16 h-16 bg-black border border-gold/10 flex items-center justify-center flex-shrink-0">
                           <svg className="w-8 h-8 text-gold/20" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l2.4 7.4h7.6l-6.1 4.5 2.3 7.1-6.2-4.4-6.2 4.4 2.3-7.1-6.1-4.5h7.6z" />
                           </svg>
                        </div>
                        <div className="flex-1">
                           <p className="font-cinzel text-[10px] font-bold text-ivory uppercase leading-tight">{item.name}</p>
                           <p className="text-[9px] text-ivory/40 font-raleway uppercase mt-1">QTY: {item.quantity} • ${item.price.toFixed(2)}</p>
                        </div>
                     </div>
                   ))}
                </div>
                
                <div className="pt-6 border-t border-gold/10 space-y-3">
                   <div className="flex justify-between text-[10px] text-ivory/40 uppercase tracking-widest"><span>Subtotal</span><span className="font-mono">${getTotal().toFixed(2)}</span></div>
                   <div className="flex justify-between text-[10px] text-ivory/40 uppercase tracking-widest"><span>Shipping</span><span className="text-gold">Free</span></div>
                   <div className="flex justify-between text-sm font-bold text-gold font-cinzel uppercase tracking-widest pt-4 border-t border-gold/10">
                      <span>Total</span>
                      <span className="font-mono">${getTotal().toFixed(2)}</span>
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

const Input = ({ label, placeholder, full = false }) => (
  <div className={full ? 'col-span-2' : ''}>
    <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest mb-2">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      className="w-full bg-surface border border-gold/20 px-4 py-3 font-raleway text-sm text-ivory outline-none focus:border-gold transition-colors placeholder:text-ivory/10"
    />
  </div>
);

const ShippingOption = ({ title, time, price, active = false }) => (
  <div className={`p-4 border cursor-pointer transition-all flex justify-between items-center ${active ? 'border-gold bg-gold/5' : 'border-gold/10 hover:border-gold/40'}`}>
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
