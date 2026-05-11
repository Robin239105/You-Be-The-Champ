import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, ChevronRight, Lock, Loader2, AlertCircle, CheckCircle2, MapPin, Ticket, Check, ShoppingBag } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', address: '', city: '', state: '', zip: '', phone: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const { items, getTotal, clearCart, appliedCoupon, discountAmount, setAppliedCoupon, removeCoupon } = useCartStore();

  // Version check
  console.log('💳 Checkout page loaded - Coupon System v1.0 ACTIVE');

  // Removed redirect for empty cart - will show empty state instead

  // Load checkout state from localStorage (after returning from login)
  useEffect(() => {
    const savedCheckoutState = localStorage.getItem('checkoutState');
    if (savedCheckoutState) {
      try {
        const { step: savedStep, formData: savedFormData, shippingMethod: savedShippingMethod } = JSON.parse(savedCheckoutState);
        setStep(savedStep || 1);
        setFormData(savedFormData || formData);
        setShippingMethod(savedShippingMethod || 'standard');
        localStorage.removeItem('checkoutState');
        console.log('✅ Restored checkout state');
      } catch (e) {
        console.error('Error restoring checkout state:', e);
      }
    }
  }, []);

  // Auto-populate form when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
      // Load saved addresses
      fetchSavedAddresses();
    }
  }, [isAuthenticated, user]);

  const fetchSavedAddresses = async () => {
    try {
      setAddressLoading(true);
      const response = await api.get('/auth/addresses');
      if (response.data.success) {
        setSavedAddresses(response.data.data || []);
        // Auto-select default address
        const defaultAddr = response.data.data?.find(a => a.isDefault);
        if (defaultAddr) {
          handleSelectAddress(defaultAddr);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id);
    setFormData(prev => ({
      ...prev,
      address: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip
    }));
    setSuccessMessage('Address loaded!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const shippingCost = shippingMethod === 'express' ? 25 : 0;
  const subtotal = getTotal();
  const totalBeforeDiscount = subtotal + shippingCost;
  const finalTotal = totalBeforeDiscount - discountAmount;

  const validateStep1 = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zip', 'phone'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    setError('');
    setStep(step + 1);
  };

  const handleSaveAndRedirectToAuth = (isRegister = false) => {
    const stateToSave = {
      step,
      formData,
      shippingMethod
    };
    localStorage.setItem('checkoutState', JSON.stringify(stateToSave));
    if (isRegister) {
      navigate('/account/register', { state: { from: location } });
    } else {
      navigate('/account/login', { state: { from: location } });
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const response = await api.post('/coupons/validate', {
        code: couponCode.toUpperCase(),
        cartItems: items // Sending items instead of total for security
      });

      if (response.data.success) {
        setAppliedCoupon(response.data.data.code, Number(response.data.data.discountAmount));
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
    removeCoupon();
    setCouponCode('');
    setCouponError('');
  };

  const steps = [
    { id: 1, name: 'Shipping', icon: Truck },
    { id: 2, name: 'Payment', icon: CreditCard },
    { id: 3, name: 'Review', icon: ShieldCheck },
  ];

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Header />
      
       <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-52 sm:pt-52 lg:pt-52 pb-16 sm:pb-20 lg:pb-24">
        {/* Progress Stepper */}
        <div className="max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gold/10 -translate-y-1/2 z-0" />
          {steps.map((s, i) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${step >= s.id ? 'bg-gold border-gold text-black scale-110 shadow-[0_0_25px_rgba(201,168,76,0.6)]' : 'bg-surface border-gold/20 text-gold/40'}`}>
                <s.icon size={22} />
              </div>
              <span className={`font-cinzel text-[9px] tracking-widest uppercase transition-all ${step >= s.id ? 'text-gold font-bold' : 'text-ivory/30'}`}>{s.name}</span>
            </div>
          ))}
        </div>

        {/* Empty Cart State */}
        {items.length === 0 ? (
          <div className="max-w-2xl mx-auto py-24 text-center bg-card border border-gold/10 p-12">
            <ShoppingBag className="text-gold/20 mx-auto mb-6" size={64} />
            <h2 className="text-2xl font-cinzel text-ivory mb-4 uppercase tracking-widest">Your collection is empty</h2>
            <p className="text-ivory/60 mb-8">Add some championship rings to proceed with checkout</p>
            <div className="flex gap-4 justify-center">
              <Link to="/shop">
                <Button>Browse All Rings</Button>
              </Link>
              <Link to="/cart">
                <Button variant="outline">View Cart</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* STEP 1: SHIPPING */}
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="space-y-8"
                >
                  {/* Shipping Information Section */}
                  <section className="bg-card border border-gold/20 p-6 sm:p-8 rounded-lg">
                    <h2 className="text-lg sm:text-xl font-cinzel font-bold text-gold tracking-widest uppercase mb-8 flex items-center gap-3">
                      <span className="text-gold/30 text-sm">01</span> Shipping Information
                    </h2>
                    
                    {isAuthenticated ? (
                      <div className="mb-6 p-4 bg-gold/5 border border-gold/20 rounded-lg">
                        <p className="text-[10px] text-ivory/60 uppercase tracking-widest mb-2">👤 Logged in as</p>
                        <p className="text-sm font-bold text-gold">{user?.firstName} {user?.lastName}</p>
                        <p className="text-[10px] text-ivory/40">{user?.email}</p>
                      </div>
                    ) : null}

                    {/* Saved Addresses */}
                    {isAuthenticated && savedAddresses.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xs font-cinzel font-bold text-ivory/60 uppercase tracking-widest mb-4">📍 Your Saved Addresses</h3>
                        <div className="space-y-3">
                          {savedAddresses.map(addr => (
                            <button
                              key={addr.id}
                              onClick={() => handleSelectAddress(addr)}
                              className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                                selectedAddressId === addr.id 
                                  ? 'border-gold bg-gold/10' 
                                  : 'border-gold/20 hover:border-gold/40'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${selectedAddressId === addr.id ? 'border-gold bg-gold' : 'border-gold/40'}`}>
                                  {selectedAddressId === addr.id && <div className="w-2 h-2 bg-black rounded-full" />}
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs font-bold text-ivory uppercase">{addr.street}</p>
                                  <p className="text-[10px] text-ivory/60">{addr.city}, {addr.state} {addr.zip}</p>
                                  {addr.isDefault && <span className="text-[9px] text-gold font-cinzel font-bold mt-1 inline-block">DEFAULT</span>}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Form Fields */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
                      <Input 
                        label="First Name" 
                        placeholder="John" 
                        value={formData.firstName} 
                        onChange={(v) => setFormData({...formData, firstName: v})} 
                        disabled={isAuthenticated}
                      />
                      <Input 
                        label="Last Name" 
                        placeholder="Doe" 
                        value={formData.lastName} 
                        onChange={(v) => setFormData({...formData, lastName: v})} 
                        disabled={isAuthenticated}
                      />
                      <Input 
                        label="Email Address" 
                        placeholder="john@example.com" 
                        full 
                        value={formData.email} 
                        onChange={(v) => setFormData({...formData, email: v})} 
                        disabled={isAuthenticated}
                      />
                      <Input 
                        label="Shipping Address" 
                        placeholder="123 Champion St" 
                        full 
                        value={formData.address} 
                        onChange={(v) => setFormData({...formData, address: v})} 
                      />
                      <Input 
                        label="City" 
                        placeholder="Los Angeles" 
                        value={formData.city} 
                        onChange={(v) => setFormData({...formData, city: v})} 
                      />
                      <Input 
                        label="State/Province" 
                        placeholder="CA" 
                        value={formData.state} 
                        onChange={(v) => setFormData({...formData, state: v})} 
                      />
                      <Input 
                        label="ZIP/Postal Code" 
                        placeholder="90001" 
                        value={formData.zip} 
                        onChange={(v) => setFormData({...formData, zip: v})} 
                      />
                      <Input 
                        label="Phone Number" 
                        placeholder="+1 (555) 000-0000" 
                        value={formData.phone} 
                        onChange={(v) => setFormData({...formData, phone: v})} 
                      />
                    </div>
                  </section>

                  {/* Shipping Method Section */}
                  <section className="bg-card border border-gold/20 p-6 sm:p-8 rounded-lg">
                    <h3 className="text-sm font-cinzel font-bold text-gold uppercase tracking-widest mb-6">🚚 Delivery Speed</h3>
                    <div className="space-y-3">
                      <ShippingOption 
                        title="Standard Shipping" 
                        description="5-10 Business Days"
                        price="Free" 
                        active={shippingMethod === 'standard'} 
                        onClick={() => setShippingMethod('standard')}
                      />
                      <ShippingOption 
                        title="Express Shipping" 
                        description="2-3 Business Days"
                        price="$25.00 AUD" 
                        active={shippingMethod === 'express'} 
                        onClick={() => setShippingMethod('express')}
                      />
                    </div>
                  </section>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-crimson/10 border border-crimson/30 rounded-lg flex items-center gap-3 text-crimson text-[10px] uppercase tracking-widest font-bold">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  {/* Success Message */}
                  {successMessage && (
                    <div className="p-4 bg-emerald-900/20 border border-emerald-500/40 rounded-lg flex items-center gap-3 text-emerald-400 text-[10px] uppercase tracking-widest font-bold">
                      <CheckCircle2 size={16} /> {successMessage}
                    </div>
                  )}

                  {/* Next Button */}
                  <div className="flex gap-4">
                    <Link to="/cart" className="flex-1">
                      <Button variant="outline" className="w-full">← Back to Cart</Button>
                    </Link>
                    <Button onClick={handleNextStep} className="flex-1">Continue to Payment <ChevronRight size={16} className="inline ml-2"/></Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PAYMENT */}
              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="space-y-8"
                >
                  <section className="bg-card border border-gold/20 p-6 sm:p-8 rounded-lg">
                    <h2 className="text-lg sm:text-xl font-cinzel font-bold text-gold tracking-widest uppercase mb-8 flex items-center gap-3">
                      <span className="text-gold/30 text-sm">02</span> Secure Payment
                    </h2>
                    
                    <div className="bg-gold/5 border border-gold/20 p-6 rounded-lg mb-6">
                      <p className="text-[10px] text-ivory/60 uppercase tracking-widest mb-4">🔒 Test Card Information</p>
                      <div className="space-y-2 text-xs font-mono text-ivory">
                        <p>Card: <span className="text-gold">4242 4242 4242 4242</span></p>
                        <p>Expiry: <span className="text-gold">12/28</span></p>
                        <p>CVV: <span className="text-gold">123</span></p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex gap-4 mb-6 opacity-50">
                        <div className="h-8 w-12 bg-ivory/20 rounded-md" />
                        <div className="h-8 w-12 bg-ivory/20 rounded-md" />
                        <div className="h-8 w-12 bg-ivory/20 rounded-md" />
                      </div>
                      <Input label="Card Number" placeholder="0000 0000 0000 0000" full value="4242 4242 4242 4242" readOnly />
                      <div className="grid grid-cols-2 gap-6">
                         <Input label="Expiry Date" placeholder="MM/YY" value="12/28" readOnly />
                         <Input label="CVV" placeholder="123" value="123" readOnly />
                      </div>
                      <Input label="Name on Card" placeholder="JOHN DOE" full value={`${formData.firstName} ${formData.lastName}`.toUpperCase()} readOnly />
                    </div>
                  </section>

                  <div className="flex gap-6">
                    <button onClick={() => setStep(1)} className="text-ivory/40 hover:text-gold font-cinzel text-xs tracking-widest uppercase transition-all">← Back</button>
                    <Button onClick={() => setStep(3)} className="flex-1">Review Order</Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: REVIEW & CONFIRM */}
              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="space-y-8"
                >
                  <section className="bg-card border border-gold/20 p-6 sm:p-8 rounded-lg">
                    <h2 className="text-lg sm:text-xl font-cinzel font-bold text-gold tracking-widest uppercase mb-8 flex items-center gap-3">
                      <span className="text-gold/30 text-sm">03</span> Review & Confirm
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Shipping Summary */}
                      <div className="p-4 bg-surface border border-gold/10 rounded-lg">
                        <div className="flex justify-between items-start mb-4 pb-4 border-b border-gold/10">
                           <div>
                             <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">📍 Shipping To</p>
                             <p className="text-xs text-ivory font-medium">{formData.firstName} {formData.lastName}</p>
                             <p className="text-[10px] text-ivory/60 mt-1">{formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
                           </div>
                           <button onClick={() => setStep(1)} className="text-gold text-[10px] underline font-cinzel uppercase hover:text-gold/60">Edit</button>
                        </div>
                        <div>
                           <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">📧 Contact</p>
                           <p className="text-[10px] text-ivory">{formData.email}</p>
                           <p className="text-[10px] text-ivory">{formData.phone}</p>
                        </div>
                      </div>

                       {/* Delivery Method */}
                       <div className="p-4 bg-surface border border-gold/10 rounded-lg">
                         <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">🚚 Delivery Method</p>
                              <p className="text-xs text-ivory font-medium">{shippingMethod === 'express' ? 'Express (2-3 Days)' : 'Standard (5-10 Days)'}</p>
                            </div>
                            <button onClick={() => setStep(1)} className="text-gold text-[10px] underline font-cinzel uppercase hover:text-gold/60">Edit</button>
                         </div>
                       </div>

{/* Coupon Section */}
                          <div className="bg-gold/5 border border-gold/20 p-4 rounded-lg space-y-3">
                            {appliedCoupon && (
                              <div className="flex items-center justify-between pb-3 border-b border-gold/20">
                                <div className="flex items-center gap-2">
                                  <Check size={14} className="text-emerald-400" />
                                  <div>
                                    <span className="text-xs font-cinzel font-bold text-emerald-400 uppercase block">You save ${(Number(discountAmount) || 0).toFixed(2)}!</span>
                                    <p className="text-sm font-mono font-bold text-ivory">{appliedCoupon}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={handleRemoveCoupon}
                                  className="text-[10px] text-ivory/50 hover:text-crimson transition-colors underline uppercase font-cinzel"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                           
                           {!appliedCoupon && (
                             <div className="space-y-2">
                               <label className="text-[10px] font-cinzel text-gold/80 uppercase tracking-widest block">🎟️ Have a Coupon?</label>
                               <div className="flex gap-2">
                                 <input
                                   type="text"
                                   value={couponCode}
                                   onChange={(e) => {
                                     setCouponCode(e.target.value);
                                     setCouponError('');
                                   }}
                                   placeholder="Enter code"
                                   className="flex-1 bg-black border border-gold/20 px-3 py-2 text-[10px] text-ivory font-mono uppercase placeholder:text-ivory/20 focus:border-gold outline-none transition-colors"
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
                               {couponError && (
                                 <p className="text-[10px] text-crimson uppercase font-cinzel">{couponError}</p>
                               )}
                             </div>
                           )}
                         </div>

                       {/* Terms */}
                       <div className="bg-gold/5 border border-gold/20 p-4 rounded-lg">
                          <label className="flex items-center gap-3 cursor-pointer group">
                             <input 
                               type="checkbox" 
                               required 
                               className="w-4 h-4 accent-gold bg-black border border-gold/30 rounded-none cursor-pointer" 
                             />
                             <span className="text-[10px] text-ivory/60 uppercase tracking-widest">I agree to the Terms of Service and Privacy Policy</span>
                          </label>
                       </div>
                    </div>
                  </section>

                  {/* Action Buttons */}
                  <div className="flex gap-6">
                    <button onClick={() => setStep(2)} className="text-ivory/40 hover:text-gold font-cinzel text-xs tracking-widest uppercase transition-all">← Back</button>
                    {!isAuthenticated ? (
                      <div className="flex-1 space-y-4">
                        <div className="text-center p-6 bg-gold/5 border border-gold/10 relative overflow-hidden rounded-lg">
                          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Lock size={60} className="text-gold" />
                          </div>
                          <p className="text-[10px] text-gold font-black font-cinzel uppercase tracking-[2px] mb-3">Champions Identity Required</p>
                          <p className="text-ivory/40 text-[10px] uppercase tracking-widest leading-relaxed mb-6">
                            To secure your championship ring and complete checkout, you must be a registered member.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                            <button onClick={() => handleSaveAndRedirectToAuth(false)} className="flex-1">
                               <Button variant="outline" className="w-full py-3 text-[10px] uppercase tracking-widest font-bold">Sign In</Button>
                            </button>
                            <button onClick={() => handleSaveAndRedirectToAuth(true)} className="flex-1">
                               <Button className="w-full py-3 text-[10px] uppercase tracking-widest font-bold">Create Account</Button>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        disabled={isLoading}
                        onClick={async () => {
                           setIsLoading(true);
                           try {
                             const storedRef = localStorage.getItem('affiliateRef');
                             console.log('🚀 Initiating order placement...', {
                               cartItemsCount: items.length,
                               total: finalTotal
                             });
                             const orderData = {
                               cartItems: items.map(i => ({ id: i.id, quantity: i.quantity })),
                               shippingAddress: JSON.stringify({
                                 street: formData.address,
                                 city: formData.city,
                                 state: formData.state,
                                 zip: formData.zip,
                                 country: 'Australia',
                                 name: `${formData.firstName} ${formData.lastName}`,
                                 phone: formData.phone,
                                 email: formData.email
                               }),
                               shippingMethod,
                               paymentMethod: 'Credit Card (Mock)',
                               couponCode: appliedCoupon || null,
                               affiliateCode: storedRef || null,
                             };

                             const response = await api.post('/orders', orderData);
                             
                             console.log('✅ API Response:', response.data);
                             
                             if (response.data.success) {
                               console.log('🎉 Order successful, navigating to confirmation');
                               // Make a copy of items before clearing (in case we need them)
                               const orderItems = [...items];
                               localStorage.removeItem('affiliateRef');
                               navigate('/order-confirmation', { 
                                 state: { 
                                   formData, 
                                   items: orderItems, 
                                   shippingMethod, 
                                   finalTotal, 
                                   orderId: response.data.data.orderNumber || response.data.data.id 
                                 },
                                 replace: true
                               });
                               // Clear cart AFTER navigation to avoid triggering redirect
                               setTimeout(() => clearCart(), 100);
                             } else {
                               setError('Order failed. Please try again.');
                             }
                           } catch (error) {
                             console.error('❌ Order submission error:', error);
                             setError(error.response?.data?.message || 'Failed to place order');
                           } finally {
                             setIsLoading(false);
                           }
                        }}
                        className="flex-1 py-4 uppercase tracking-[2px] text-xs font-bold"
                       >
                         {isLoading ? <Loader2 size={18} className="animate-spin inline mr-2" /> : <Lock size={16} className="inline mr-2" />}
                         {isLoading ? 'Processing...' : `Complete Purchase — $${Number(finalTotal || 0).toFixed(2)} AUD`}
                       </Button>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 bg-crimson/10 border border-crimson/30 rounded-lg flex items-center gap-3 text-crimson text-[10px] uppercase tracking-widest font-bold">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
             <div className="bg-surface border border-gold/10 p-6 sm:p-8 rounded-lg sticky top-32 space-y-6">
                <h3 className="font-cinzel text-sm font-bold text-gold tracking-widest uppercase pb-4 border-b border-gold/10">Order Summary</h3>
                <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                   {items.map(item => (
                     <div key={item.id} className="flex gap-3">
                        <div className="w-14 h-14 bg-black border border-gold/10 flex items-center justify-center flex-shrink-0 overflow-hidden rounded">
                           <img 
                             src={item.images?.[0]?.url || item.images?.[0] || item.image} 
                             alt={item.name} 
                             className="w-full h-full object-cover"
                           />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="font-cinzel text-[10px] font-bold text-ivory uppercase leading-tight truncate">{item.name}</p>
                           <p className="text-[9px] text-ivory/40 font-raleway uppercase mt-1">QTY: {item.quantity} • ${parseFloat(item.price || 0).toFixed(2)} AUD</p>
                        </div>
                     </div>
                   ))}
                </div>
                
                <div className="pt-4 border-t border-gold/10 space-y-3">
                  <div className="flex justify-between text-xs text-ivory/60 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="font-mono text-ivory">${Number(subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-ivory/40 uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-gold">{shippingMethod === 'express' ? '$25.00' : 'Free'}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[10px] text-emerald-400 uppercase tracking-widest bg-emerald-900/20 p-2 rounded border border-emerald-500/20">
                      <span>Discount</span>
                      <span className="font-mono font-bold">-${Number(discountAmount || 0).toFixed(2)}</span>
                    </div>
                  )}
                    <div className="flex justify-between text-sm font-bold text-gold font-cinzel uppercase tracking-widest pt-3 border-t border-gold/10">
                       <span>Total (AUD)</span>
                       <span className="font-mono">${Number(finalTotal || 0).toFixed(2)}</span>
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

const Input = ({ label, placeholder, full = false, value = '', onChange = () => {}, readOnly = false, disabled = false }) => (
  <div className={full ? 'col-span-2' : ''}>
    <label className="block text-[10px] font-cinzel font-bold text-ivory/40 uppercase tracking-widest mb-2">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      disabled={disabled}
      className={`w-full bg-surface border border-gold/20 px-4 py-3 font-raleway text-sm text-ivory outline-none focus:border-gold transition-colors placeholder:text-ivory/10 ${readOnly || disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    />
  </div>
);

const ShippingOption = ({ title, description, price, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-4 border-2 rounded-lg transition-all flex justify-between items-center text-left ${active ? 'border-gold bg-gold/10' : 'border-gold/20 hover:border-gold/40'}`}
  >
     <div className="flex items-center gap-4 flex-1">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-gold bg-gold' : 'border-gold/20'}`}>
           {active && <div className="w-2 h-2 bg-black rounded-full" />}
        </div>
        <div>
           <p className="font-cinzel text-xs font-bold text-ivory uppercase">{title}</p>
           <p className="text-[10px] text-ivory/40 uppercase tracking-widest">{description}</p>
        </div>
     </div>
     <span className={`font-mono text-sm font-bold ${active ? 'text-gold' : 'text-ivory/60'}`}>{price}</span>
  </button>
);

export default Checkout;
