import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Share2, Star, ShieldCheck, Truck, RotateCcw, Minus, Plus, ChevronRight, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Badge from '../components/Badge';
import api from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen text-ivory flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
           <Loader2 size={48} className="text-gold animate-spin mb-4" />
           <p className="font-cinzel text-xs tracking-widest text-gold uppercase">Opening the vault...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-black min-h-screen text-ivory flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-20">
          <h1 className="text-4xl font-cinzel text-gold mb-4">Product Not Found</h1>
          <p className="text-ivory/60 mb-8">The championship ring you are looking for has been moved to the vault.</p>
          <Link to="/shop"><Button variant="primary">Back To Shop</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const price = Number(product.price || 0);
  const salePrice = Number(product.salePrice || 0);
  const onSale = product.onSale && salePrice > 0;
  const rating = product.rating || 4.8;
  const reviewsCount = product.reviews || 124;
  const images = product.images?.length > 0 ? product.images.map(img => img.url) : [product.image];

  return (
    <div className="bg-black min-h-screen text-ivory">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-40 pb-24">
        <Breadcrumb items={[
          { name: 'Shop', path: '/shop' },
          { name: product.name, path: `/product/${product.id}` }
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
          
          {/* Left: Gallery */}
          <div className="space-y-6">
            <div className="aspect-square bg-card border border-gold/10 overflow-hidden relative group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={images[selectedImage]} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-12"
                />
              </AnimatePresence>
              <div className="absolute top-6 left-6">
                <Badge variant="gold">Authentic Replica</Badge>
              </div>
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square border transition-all ${selectedImage === i ? 'border-gold p-1' : 'border-gold/10 hover:border-gold/30'}`}
                  >
                    <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="border-b border-gold/10 pb-8 mb-8">
               <div className="flex items-center gap-4 mb-4">
                  <span className="text-gold font-cinzel text-[10px] tracking-[3px] uppercase">
                     {product.categories?.[0]?.name || 'Official Collection'}
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < Math.floor(rating) ? 'fill-gold text-gold' : 'text-gold/20'} />
                    ))}
                    <span className="text-[10px] text-ivory/40 ml-2 font-mono">({reviewsCount} Reviews)</span>
                  </div>
               </div>

               <h1 className="text-3xl md:text-4xl font-black font-cinzel text-white tracking-tight uppercase mb-6 leading-tight">
                 {product.name}
               </h1>

               <div className="flex items-center gap-6">
                 {price === 0 ? (
                   <span className="text-3xl font-cinzel font-bold text-gold tracking-widest uppercase">Coming Soon</span>
                 ) : (
                   <>
                     <span className="text-4xl font-mono font-bold text-gold">${price.toFixed(2)} AUD</span>
                     {onSale && (
                       <span className="text-xl text-ivory/30 line-through font-mono">${salePrice.toFixed(2)} AUD</span>
                     )}
                   </>
                 )}
                 <Badge variant="sport">{price === 0 ? 'Pre-Release' : 'In Stock'}</Badge>
               </div>
            </div>

            <div className="space-y-10">
              {/* Short Description */}
              <p className="text-ivory/60 font-raleway leading-relaxed text-lg">
                The ultimate symbol of team dominance. This high-grade replica features {product.material || 'premium zinc alloy'} construction with {product.plating || '18K gold'} plating and precision-set AAA+ crystals.
              </p>

               <div className="space-y-6">
                <div className="flex items-center gap-8">
                   <div className="flex items-center border border-gold/20 bg-card">
                      <button 
                        disabled={product.price === 0}
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className={`p-4 transition-colors ${product.price === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:text-gold'}`}
                      >
                        <Minus size={16} />
                      </button>
                      <span className={`w-12 text-center font-mono font-bold ${product.price === 0 ? 'opacity-20' : ''}`}>{quantity}</span>
                      <button 
                        disabled={product.price === 0}
                        onClick={() => setQuantity(q => q + 1)}
                        className={`p-4 transition-colors ${product.price === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:text-gold'}`}
                      >
                        <Plus size={16} />
                      </button>
                   </div>
                   <button 
                    onClick={() => toggleWishlist(product)}
                    className={`flex items-center gap-2 font-cinzel text-[10px] tracking-widest uppercase transition-colors ${isWishlisted(product.id) ? 'text-gold' : 'text-ivory/40 hover:text-gold'}`}
                   >
                      <Heart size={18} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} /> 
                      {isWishlisted(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                   </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.price === 0 ? (
                    <Button 
                      variant="primary" 
                      className="col-span-2 py-6 uppercase tracking-[3px] text-xs font-bold"
                    >
                      Notify Me On Release
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="secondary" 
                        className="w-full py-6 uppercase tracking-[3px] text-xs font-bold border-gold/20 hover:border-gold"
                        onClick={handleAddToCart}
                      >
                        Add To Vault
                      </Button>
                      <Button 
                        variant="primary" 
                        className="w-full py-6 uppercase tracking-[3px] text-xs font-bold"
                        onClick={handleBuyNow}
                      >
                        Direct Purchase
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gold/10">
                 <div className="flex flex-col items-center text-center gap-2">
                    <Truck className="text-gold" size={24} />
                    <span className="text-[10px] font-cinzel uppercase tracking-widest text-ivory/60">Free Shipping</span>
                 </div>
                 <div className="flex flex-col items-center text-center gap-2">
                    <ShieldCheck className="text-gold" size={24} />
                    <span className="text-[10px] font-cinzel uppercase tracking-widest text-ivory/60">Secure Payment</span>
                 </div>
                 <div className="flex flex-col items-center text-center gap-2">
                    <RotateCcw className="text-gold" size={24} />
                    <span className="text-[10px] font-cinzel uppercase tracking-widest text-ivory/60">30-Day Return</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-32">
           <div className="flex border-b border-gold/10 gap-12 mb-12">
              {['description', 'specifications', 'reviews'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-cinzel text-xs tracking-[4px] uppercase transition-all relative ${activeTab === tab ? 'text-gold' : 'text-ivory/30 hover:text-ivory'}`}
                >
                  {tab}
                  {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />}
                </button>
              ))}
           </div>

           <div className="max-w-4xl min-h-[300px]">
              {activeTab === 'description' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="prose prose-invert max-w-none">
                  <p className="text-ivory/70 leading-loose text-lg font-raleway">
                    {product.description || `Celebrate the legacy of champions with this masterfully crafted replica ring. Every detail, from the engraved team mottos to the strategic placement of high-brilliance stones, has been executed with the same passion as the athletes on the field. This isn't just a piece of jewelry; it's a piece of history that commands attention in any display or on any finger.`}
                  </p>
                  <ul className="mt-8 space-y-4 text-ivory/60">
                    <li className="flex items-center gap-3"><ChevronRight className="text-gold" size={16}/> Hand-polished finish with extreme detail</li>
                    <li className="flex items-center gap-3"><ChevronRight className="text-gold" size={16}/> Heavyweight solid construction (approx. 60g-80g)</li>
                    <li className="flex items-center gap-3"><ChevronRight className="text-gold" size={16}/> High-grade AAA+ Cubic Zirconia stones</li>
                  </ul>
                </motion.div>
              )}

              {activeTab === 'specifications' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: 'Material', value: product.material || 'Zinc Alloy' },
                    { label: 'Plating', value: product.plating || '18K Gold / Silver' },
                    { label: 'Stone Grade', value: 'AAA+ Cubic Zirconia' },
                    { label: 'Weight', value: '65g - 75g Average' },
                    { label: 'Packaging', value: 'Luxury Gift Bag Included' },
                    { label: 'SKU', value: product.sku || `YTBC-${product.id}` },
                  ].map(spec => (
                    <div key={spec.label} className="flex justify-between items-center py-4 border-b border-gold/5">
                      <span className="text-[10px] font-cinzel text-ivory/40 uppercase tracking-widest">{spec.label}</span>
                      <span className="text-sm font-raleway text-white">{spec.value}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                   {/* Review Submission Form */}
                   <div className="bg-surface p-10 border border-gold/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                         <Star size={100} className="text-gold" />
                      </div>
                      <h4 className="font-cinzel text-lg font-bold text-gold uppercase tracking-widest mb-8">Write a Review</h4>
                      <form className="space-y-6 relative z-10">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                               <label className="block text-[10px] text-gold font-cinzel tracking-widest uppercase mb-2">Display Name</label>
                               <input type="text" className="w-full bg-black border border-gold/10 p-4 text-white focus:border-gold outline-none transition-all" placeholder="e.g. John D." />
                            </div>
                            <div>
                               <label className="block text-[10px] text-gold font-cinzel tracking-widest uppercase mb-2">Rating</label>
                               <div className="flex gap-2 p-4 bg-black border border-gold/10">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      size={16} 
                                      className="cursor-pointer text-gold/20 hover:text-gold transition-colors" 
                                    />
                                  ))}
                                  <span className="text-[10px] text-ivory/40 ml-2 uppercase font-cinzel">Select Stars</span>
                               </div>
                            </div>
                         </div>
                         <div>
                            <label className="block text-[10px] text-gold font-cinzel tracking-widest uppercase mb-2">Your Championship Experience</label>
                            <textarea rows="4" className="w-full bg-black border border-gold/10 p-4 text-white focus:border-gold outline-none transition-all resize-none" placeholder="Tell us about the quality, weight, and detail..."></textarea>
                         </div>
                         <Button variant="primary" className="w-full md:w-auto px-12 py-4 uppercase tracking-[3px] text-[10px]">Submit Review To Vault</Button>
                      </form>
                   </div>

                   {/* Existing Reviews */}
                   <div className="space-y-8">
                      <h4 className="font-cinzel text-sm font-bold text-ivory/40 uppercase tracking-[4px] mb-8">Recent Testimonials</h4>
                      {[
                        { user: 'J. Maverick', rating: 5, date: '2 days ago', text: 'The weight of this ring is incredible. Feels like the real deal.' },
                        { user: 'S. Thompson', rating: 5, date: '1 week ago', text: 'Perfect gift for any true fan. The stones really sparkle under light.' },
                      ].map((review, i) => (
                        <div key={i} className="bg-surface/50 p-8 border border-gold/5 hover:border-gold/20 transition-all">
                           <div className="flex justify-between mb-4">
                              <span className="font-cinzel text-sm text-white">{review.user}</span>
                              <span className="text-[10px] text-ivory/30 uppercase tracking-widest">{review.date}</span>
                           </div>
                           <div className="flex gap-1 mb-4">
                              {[...Array(review.rating)].map((_, j) => <Star key={j} size={10} className="fill-gold text-gold" />)}
                           </div>
                           <p className="text-ivory/60 font-raleway text-sm italic">"{review.text}"</p>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
